package proxy

import (
	"fmt"
	"io"
	"net/http"
	"regexp"
	"strings"
	"time"

	"github.com/bestruirui/bestsub/config"
	"github.com/bestruirui/bestsub/proxy/parser"
	"github.com/bestruirui/bestsub/utils"
	"gopkg.in/yaml.v3"
)

func GetProxies() ([]map[string]any, error) {
	utils.LogInfo("currently, there are %d subscription links set", len(config.GlobalConfig.SubUrls))

	subUrls := make([]interface{}, len(config.GlobalConfig.SubUrls))
	for i, url := range config.GlobalConfig.SubUrls {
		subUrls[i] = url
	}
	numWorkers := min(len(subUrls), config.GlobalConfig.Check.Concurrent)

	pool := utils.NewThreadPool(numWorkers, taskGetProxies)
	pool.Start()
	pool.AddTaskArgs(subUrls)
	pool.Wait()
	results := pool.GetResults()
	var mihomoProxies []map[string]any

	for _, result := range results {
		if result.Result != nil {
			mihomoProxies = append(mihomoProxies, result.Result.([]map[string]any)...)
		}
	}
	return mihomoProxies, nil
}

func taskGetProxies(args interface{}) (interface{}, error) {
	subUrl := args.(string)
	var mihomoProxies []map[string]any
	data, err := getDateFromSubs(subUrl)
	fmt.Println(err)
	if err != nil {
		return nil, err
	}
	var config map[string]any
	err = yaml.Unmarshal(data, &config)
	if err != nil {
		data = removeAllControlCharacters(data)
		err = yaml.Unmarshal(data, &config)
	}
	if err != nil {
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
				mihomoProxies = append(mihomoProxies, parseProxy)
			}
		}
	} else {
		proxyInterface, ok := config["proxies"]
		if !ok || proxyInterface == nil {
			utils.LogError("subscription link: %s has no proxies", subUrl)
			return nil, fmt.Errorf("subscription link: %s has no proxies", subUrl)
		}

		proxyList, ok := proxyInterface.([]any)
		if !ok {
			return nil, fmt.Errorf("subscription link: %s has no proxies", subUrl)
		}

		for _, proxy := range proxyList {
			proxyMap, ok := proxy.(map[string]any)
			if !ok {
				continue
			}
			mihomoProxies = append(mihomoProxies, proxyMap)
		}
	}

	return mihomoProxies, nil
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
	for _, b := range data {
		if b >= 32 && b <= 126 || b == '\n' || b == '\t' || b == '\r' {
			cleanedData = append(cleanedData, b)
		}
	}
	return cleanedData
}
