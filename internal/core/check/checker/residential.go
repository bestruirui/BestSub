package checker

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"strings"
	"sync"
	"sync/atomic"
	"time"

	"gopkg.in/yaml.v3"

	"github.com/bestruirui/bestsub/internal/core/mihomo"
	"github.com/bestruirui/bestsub/internal/core/node"
	"github.com/bestruirui/bestsub/internal/core/task"
	checkModel "github.com/bestruirui/bestsub/internal/models/check"
	nodeModel "github.com/bestruirui/bestsub/internal/models/node"
	"github.com/bestruirui/bestsub/internal/modules/register"
	"github.com/bestruirui/bestsub/internal/utils/log"
)

// 固定使用单一 Provider，v1 不走配置化。
const residentialCheckURL = "https://api.ipapi.is/"

// 这些公司类型一旦命中，就直接按非家宽处理。
var nonResidentialCompanyTypes = map[string]struct{}{
	"hosting":    {},
	"business":   {},
	"education":  {},
	"government": {},
	"banking":    {},
}

type Residential struct {
	Thread  int `json:"thread" name:"线程数" value:"100"`
	Timeout int `json:"timeout" name:"超时时间" value:"10" desc:"单个节点检测的超时时间(s)"`
}

type residentialResponse struct {
	IP           string `json:"ip"`
	IsBogon      *bool  `json:"is_bogon"`
	IsMobile     *bool  `json:"is_mobile"`
	IsSatellite  *bool  `json:"is_satellite"`
	IsDatacenter *bool  `json:"is_datacenter"`
	IsTor        *bool  `json:"is_tor"`
	IsProxy      *bool  `json:"is_proxy"`
	IsVPN        *bool  `json:"is_vpn"`
	Company      struct {
		Type string `json:"type"`
	} `json:"company"`
}

func (e *Residential) Init() error {
	return nil
}

func (e *Residential) Run(ctx context.Context, log *log.Logger, subID []uint16) checkModel.Result {
	startTime := time.Now()

	var nodes []nodeModel.Data
	if len(subID) == 0 {
		nodes = node.GetAll()
	} else {
		nodes = *node.GetBySubId(subID)
	}

	threads := e.Thread
	if threads <= 0 || threads > len(nodes) {
		threads = len(nodes)
	}
	if threads > task.MaxThread() {
		threads = task.MaxThread()
	}
	if threads == 0 || len(nodes) == 0 {
		log.Warnf("residential check task failed, no nodes")
		return checkModel.Result{
			Msg:      "no nodes",
			LastRun:  time.Now(),
			Duration: time.Since(startTime).Milliseconds(),
		}
	}

	sem := make(chan struct{}, threads)
	defer close(sem)

	var scannedCount int64
	var residentialCount int64
	var nonResidentialCount int64
	var skippedCount int64
	var failedCount int64

	var wg sync.WaitGroup
	for _, nd := range nodes {
		// v1 只补扫尚未完成家宽判定的节点，避免重复请求外部 API。
		if nd.Info.IsResidentialChecked() {
			atomic.AddInt64(&skippedCount, 1)
			continue
		}

		sem <- struct{}{}
		wg.Add(1)
		n := nd
		task.Submit(func() {
			defer func() {
				<-sem
				wg.Done()
			}()

			atomic.AddInt64(&scannedCount, 1)

			var raw map[string]any
			if err := yaml.Unmarshal(n.Raw, &raw); err != nil {
				atomic.AddInt64(&failedCount, 1)
				log.Warnf("yaml.Unmarshal failed: %v", err)
				return
			}

			name := fmt.Sprint(raw["name"])
			classification, ip, err := e.detect(ctx, raw)
			if err != nil {
				atomic.AddInt64(&failedCount, 1)
				log.Debugf("residential check skipped for node %s: %v", name, err)
				return
			}

			switch classification {
			case residentialClassificationYes:
				n.Info.SetResidentialStatus(true)
				atomic.AddInt64(&residentialCount, 1)
				log.Debugf("node %s classified as residential, ip: %s", name, ip)
			case residentialClassificationNo:
				n.Info.SetResidentialStatus(false)
				atomic.AddInt64(&nonResidentialCount, 1)
				log.Debugf("node %s classified as non-residential, ip: %s", name, ip)
			default:
				atomic.AddInt64(&failedCount, 1)
				log.Debugf("residential check inconclusive for node %s, ip: %s", name, ip)
			}
		})
	}
	wg.Wait()

	return checkModel.Result{
		Msg:      fmt.Sprintf("success, scanned: %d, residential: %d, non_residential: %d, skipped: %d, failed: %d", scannedCount, residentialCount, nonResidentialCount, skippedCount, failedCount),
		LastRun:  time.Now(),
		Duration: time.Since(startTime).Milliseconds(),
		Extra: map[string]any{
			"scanned":         scannedCount,
			"residential":     residentialCount,
			"non_residential": nonResidentialCount,
			"skipped":         skippedCount,
			"failed":          failedCount,
		},
	}
}

type residentialClassification uint8

const (
	residentialClassificationUnknown residentialClassification = iota
	residentialClassificationYes
	residentialClassificationNo
)

func (e *Residential) detect(ctx context.Context, raw map[string]any) (residentialClassification, string, error) {
	client := mihomo.Proxy(raw)
	if client == nil {
		return residentialClassificationUnknown, "", fmt.Errorf("proxy client unavailable")
	}
	client.Timeout = time.Duration(e.Timeout) * time.Second
	defer client.Release()

	req, err := http.NewRequestWithContext(ctx, http.MethodGet, residentialCheckURL, nil)
	if err != nil {
		return residentialClassificationUnknown, "", err
	}

	resp, err := client.Do(req)
	if err != nil {
		return residentialClassificationUnknown, "", err
	}
	defer resp.Body.Close()

	if resp.StatusCode < http.StatusOK || resp.StatusCode >= http.StatusMultipleChoices {
		return residentialClassificationUnknown, "", fmt.Errorf("unexpected status code: %d", resp.StatusCode)
	}

	var data residentialResponse
	if err := json.NewDecoder(resp.Body).Decode(&data); err != nil {
		return residentialClassificationUnknown, "", err
	}

	// 只有拿到可明确解释的结果才允许写入 ResidentialChecked。
	classification, err := classifyResidentialResponse(data)
	return classification, data.IP, err
}

func classifyResidentialResponse(data residentialResponse) (residentialClassification, error) {
	isBogon, err := requiredBool("is_bogon", data.IsBogon)
	if err != nil {
		return residentialClassificationUnknown, err
	}
	isMobile, err := requiredBool("is_mobile", data.IsMobile)
	if err != nil {
		return residentialClassificationUnknown, err
	}
	isSatellite, err := requiredBool("is_satellite", data.IsSatellite)
	if err != nil {
		return residentialClassificationUnknown, err
	}
	isDatacenter, err := requiredBool("is_datacenter", data.IsDatacenter)
	if err != nil {
		return residentialClassificationUnknown, err
	}
	isTor, err := requiredBool("is_tor", data.IsTor)
	if err != nil {
		return residentialClassificationUnknown, err
	}
	isProxy, err := requiredBool("is_proxy", data.IsProxy)
	if err != nil {
		return residentialClassificationUnknown, err
	}
	isVPN, err := requiredBool("is_vpn", data.IsVPN)
	if err != nil {
		return residentialClassificationUnknown, err
	}

	companyType := strings.ToLower(strings.TrimSpace(data.Company.Type))
	if companyType == "" {
		return residentialClassificationUnknown, fmt.Errorf("missing company.type")
	}

	// 先按强特征排除机房/代理/匿名出口。
	if isBogon || isDatacenter || isTor || isProxy || isVPN {
		return residentialClassificationNo, nil
	}

	if _, exists := nonResidentialCompanyTypes[companyType]; exists {
		return residentialClassificationNo, nil
	}

	// 再按保守规则确认家宽：必须是 ISP，且不能是移动/卫星网络。
	if companyType == "isp" && !isMobile && !isSatellite {
		return residentialClassificationYes, nil
	}

	return residentialClassificationUnknown, fmt.Errorf("inconclusive result")
}

// 必须字段缺失时保持未检测，避免因为 provider 响应不完整而误标。
func requiredBool(field string, value *bool) (bool, error) {
	if value == nil {
		return false, fmt.Errorf("missing %s", field)
	}
	return *value, nil
}

func init() {
	register.Check(&Residential{})
}
