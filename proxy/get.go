package proxy

import (
	"bufio"
	"bytes"
	"fmt"
	"io"
	"net/http"
	"regexp"
	"strings"
	"sync"
	"time"
	"unicode"
	"unicode/utf8"

	"github.com/bestruirui/bestsub/config"
	"github.com/bestruirui/bestsub/proxy/parser"
	"github.com/bestruirui/bestsub/utils"
	"github.com/panjf2000/ants/v2"
	"gopkg.in/yaml.v3"
)

var mihomoProxies []map[string]any
var mihomoProxiesMutex sync.Mutex

func GetProxies() ([]map[string]any, error) {
	utils.LogInfo("currently, there are %d subscription links set", len(config.GlobalConfig.SubUrls))

	numWorkers := min(len(config.GlobalConfig.SubUrls), config.GlobalConfig.Check.Concurrent)

	pool, _ := ants.NewPool(numWorkers)
	defer pool.Release()
	var wg sync.WaitGroup
	for _, subUrl := range config.GlobalConfig.SubUrls {
		wg.Add(1)
		pool.Submit(func() {
			defer wg.Done()
			taskGetProxies(subUrl)
		})
	}
	wg.Wait()
	return mihomoProxies, nil
}

func taskGetProxies(args string) {
	data, err := getDateFromSubs(args)
	if err != nil {
		return
	}
	if IsYaml(data) {
		proxies, err := ParseYamlProxy(data)
		if err != nil {
			utils.LogError("subscription link: %s has no proxies", args)
			return
		}
		mihomoProxiesMutex.Lock()
		mihomoProxies = append(mihomoProxies, proxies...)
		mihomoProxiesMutex.Unlock()
	} else {
		reg, _ := regexp.Compile("(ssr|ss|vmess|trojan|vless|hysteria|hy2|hysteria2)://")
		if !reg.Match(data) {
			data = []byte(parser.DecodeBase64(string(data)))
		}
		if reg.Match(data) {
			proxies := strings.Split(string(data), "\n")

			for _, proxy := range proxies {
				parseProxy, err := parser.ParseProxy(proxy)
				if err != nil {
					continue
				}
				if parseProxy == nil {
					continue
				}
				mihomoProxiesMutex.Lock()
				mihomoProxies = append(mihomoProxies, parseProxy)
				mihomoProxiesMutex.Unlock()
			}
		}
	}
}

func getDateFromSubs(subUrl string) ([]byte, error) {
	maxRetries := config.GlobalConfig.SubUrlsReTry
	var lastErr error

	client := utils.NewHTTPClient()

	for i := 0; i < maxRetries; i++ {
		if i > 0 {
			time.Sleep(time.Second)
		}

		req, err := http.NewRequest("GET", subUrl, nil)
		if err != nil {
			lastErr = err
			continue
		}

		req.Header.Set("User-Agent", "clash.meta")

		resp, err := client.Do(req)
		if err != nil {
			lastErr = err
			continue
		}
		defer resp.Body.Close()
		if resp.StatusCode != 200 {
			lastErr = fmt.Errorf("subscription link: %s returned status code: %d", subUrl, resp.StatusCode)
			continue
		}

		body, err := io.ReadAll(resp.Body)
		if err != nil {
			lastErr = err
			continue
		}
		return body, nil
	}

	return nil, fmt.Errorf("failed after %d retries: %v", maxRetries, lastErr)
}
func removeAllControlCharacters(data []byte) []byte {
	var cleanedData []byte
	for len(data) > 0 {
		r, size := utf8.DecodeRune(data)
		if r != utf8.RuneError && (r >= 32 && r <= 126) || r == '\n' || r == '\t' || r == '\r' || unicode.Is(unicode.Han, r) {
			cleanedData = append(cleanedData, data[:size]...)
		}
		data = data[size:]
	}
	return cleanedData
}

func IsYaml(data []byte) bool {
    // 优先检查是否包含代理协议标识
    reg, _ := regexp.Compile("(ssr|ss|vmess|trojan|vless|hysteria|hy2|hysteria2)://")
    
    // 尝试先进行base64解码以检查是否为base64编码的代理链接
    decodedData := parser.DecodeBase64(string(data))
    if reg.MatchString(decodedData) {
        return false
    }
    
    // 检查是否含有YAML特有的结构标识
    if bytes.Contains(data, []byte("proxies:")) || 
       bytes.Contains(data, []byte("Proxy:")) || 
       bytes.Contains(data, []byte("proxy-groups:")) {
        var yamlContent map[string]interface{}
        err := yaml.Unmarshal(data, &yamlContent)
        return err == nil
    }
    
    // 进行保守的YAML解析测试
    var yamlBuffer map[string]interface{}
    err := yaml.Unmarshal(data, &yamlBuffer)
    if err != nil {
        // 清理后再尝试一次
        cleanedData := removeAllControlCharacters(data)
        err = yaml.Unmarshal(cleanedData, &yamlBuffer)
        if err != nil {
            return false
        }
        
        // 即使解析成功，但如果map为空或只有极少数项，可能不是有效YAML
        return len(yamlBuffer) > 2
    }
    
    return len(yamlBuffer) > 0
}
func ParseYamlProxy(data []byte) ([]map[string]any, error) {
	var inProxiesSection bool
	var yamlBuffer bytes.Buffer
	var proxies []map[string]any
	var indent int
	var isFirst bool = true

	cleandata := removeAllControlCharacters(data)
	cleanedFile := bytes.NewReader(cleandata)
	scanner := bufio.NewScanner(cleanedFile)

	for scanner.Scan() {
		line := scanner.Text()
		trimmedLine := strings.TrimSpace(line)

		if trimmedLine == "proxies:" {
			inProxiesSection = true
			continue
		}

		if !inProxiesSection {
			continue
		}

		if isFirst {
			indent = len(line) - len(trimmedLine)
			isFirst = false
		}

		if len(line)-len(trimmedLine) == 0 && !strings.HasPrefix(trimmedLine, "-") && trimmedLine != "" {
			break
		}

		if trimmedLine == "" || strings.HasPrefix(trimmedLine, "#") {
			continue
		}

		if strings.HasPrefix(trimmedLine, "-") && len(line)-len(trimmedLine) == indent {
			if yamlBuffer.Len() > 0 {
				var proxy []map[string]any
				if err := yaml.Unmarshal(yamlBuffer.Bytes(), &proxy); err != nil {

				} else {
					proxies = append(proxies, proxy...)
				}
				yamlBuffer.Reset()
			}
			yamlBuffer.WriteString(line + "\n")
		} else if yamlBuffer.Len() > 0 {
			yamlBuffer.WriteString(line + "\n")
		}
	}

	if yamlBuffer.Len() > 0 {
		var proxy []map[string]any
		if err := yaml.Unmarshal(yamlBuffer.Bytes(), &proxy); err != nil {
		} else {
			proxies = append(proxies, proxy...)
		}
	}

	return proxies, nil
}
