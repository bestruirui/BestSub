package fetch

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"slices"
	"strings"
	"time"

	"github.com/bestruirui/bestsub/internal/config"
	"github.com/bestruirui/bestsub/internal/core/mihomo"
	"github.com/bestruirui/bestsub/internal/core/node"
	"github.com/bestruirui/bestsub/internal/database/op"
	nodeModel "github.com/bestruirui/bestsub/internal/models/node"
	"github.com/bestruirui/bestsub/internal/models/setting"
	subModel "github.com/bestruirui/bestsub/internal/models/sub"
	"github.com/bestruirui/bestsub/internal/utils/log"
	"gopkg.in/yaml.v3"
)

func Do(ctx context.Context, subID uint16, config string) subModel.Result {
	startTime := time.Now()
	retry := 0

	var subConfig subModel.Config
	if err := json.Unmarshal([]byte(config), &subConfig); err != nil {
		log.Warnf("fetch task %d failed: %v", subID, err)
		return createFailureResult(err.Error(), startTime)
	}

	log.Debugf("fetch task %d started", subID)

	client := mihomo.Default(false)
	if client == nil {
		log.Warnf("fetch task %d failed: proxy config error", subID)
		return createFailureResult("proxy config error", startTime)
	}
	defer client.Release()
	subUrl := genSubConverterUrl(subConfig.Url, subConfig.Proxy)
	for retry < 3 {
		time.Sleep(time.Duration(retry) * time.Second)
		retry++
		client.Timeout = time.Duration(subConfig.Timeout) * time.Second

		req, err := http.NewRequestWithContext(ctx, "GET", subUrl, nil)
		if err != nil {
			log.Warnf("fetch task %d failed: %v", subID, err)
			continue
		}

		resp, err := client.Do(req)
		if err != nil {
			log.Warnf("fetch task %d failed: %v", subID, err)
			continue
		}
		defer resp.Body.Close()

		content, err := io.ReadAll(resp.Body)
		if err != nil {
			log.Warnf("fetch task %d failed: %v", subID, err)
			continue
		}

		globalProtocolFilterEnable := op.GetSettingBool(setting.NODE_PROTOCOL_FILTER_ENABLE)
		globalProtocolFilterMode := op.GetSettingBool(setting.NODE_PROTOCOL_FILTER_MODE)
		globalProtocolFilter := strings.Split(op.GetSettingStr(setting.NODE_PROTOCOL_FILTER), ",")

		var nodes []nodeModel.Base
		var unique nodeModel.UniqueKey
		lines := bytes.Split(content, []byte("\n"))
		lines = lines[1:]
		for _, line := range lines {
			if len(line) == 0 {
				continue
			}
			line = line[4:]
			if err := yaml.Unmarshal(line, &unique); err != nil {
				continue
			}
			if subConfig.ProtocolFilterEnable {
				if subConfig.ProtocolFilterMode {
					if !slices.Contains(subConfig.ProtocolFilter, unique.Type) {
						continue
					}
				} else {
					if slices.Contains(subConfig.ProtocolFilter, unique.Type) {
						continue
					}
				}
			} else {
				if globalProtocolFilterEnable {
					if globalProtocolFilterMode {
						if !slices.Contains(globalProtocolFilter, unique.Type) {
							log.Debugf("全局协议过滤启用,协议包含模式 丢弃协议: %v", unique.Type)
							continue
						}
					} else {
						if slices.Contains(globalProtocolFilter, unique.Type) {
							log.Debugf("全局协议过滤启用,协议排除模式 丢弃协议: %v", unique.Type)
							continue
						}
					}
				}
			}
			nodes = append(nodes, nodeModel.Base{
				Raw:       line,
				SubId:     subID,
				UniqueKey: unique.Gen(),
			})
		}

		count := len(nodes)

		node.Add(&nodes)

		log.Debugf("fetch task %d completed, node count: %d,  duration: %dms",
			subID, count, uint16(time.Since(startTime).Milliseconds()))

		return createSuccessResult(uint32(count), startTime, count == 0)
	}
	return createFailureResult("fetch task failed", startTime)
}
func createFailureResult(msg string, startTime time.Time) subModel.Result {
	return subModel.Result{
		Success:  0,
		Fail:     1,
		Msg:      msg,
		LastRun:  time.Now(),
		Duration: uint16(time.Since(startTime).Milliseconds()),
	}
}

func createSuccessResult(count uint32, startTime time.Time, nodeNull bool) subModel.Result {
	nodeNullCount := uint16(0)
	if nodeNull {
		nodeNullCount = 1
	}
	return subModel.Result{
		Success:       1,
		Fail:          0,
		NodeNullCount: nodeNullCount,
		Msg:           "sub updated successfully",
		RawCount:      count,
		LastRun:       time.Now(),
		Duration:      uint16(time.Since(startTime).Milliseconds()),
	}
}
func genSubConverterUrl(subUrl string, enableProxy bool) string {
	subUrl = url.QueryEscape(subUrl)
	cfg := config.Base()
	scHost := cfg.SubConverter.Host
	scPort := cfg.SubConverter.Port
	if enableProxy {
		proxy := op.GetSettingStr(setting.PROXY_URL)
		proxy = url.QueryEscape(proxy)
		return fmt.Sprintf("http://%s:%d/sub?target=clash&list=true&url=%s&sub_proxy=%s", scHost, scPort, subUrl, proxy)
	}
	return fmt.Sprintf("http://%s:%d/sub?target=clash&list=true&url=%s", scHost, scPort, subUrl)
}
