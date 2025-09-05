package checker

import (
	"bytes"
	"context"
	"io"
	"net/http"
	"sync"
	"time"

	"gopkg.in/yaml.v3"

	"github.com/bestruirui/bestsub/internal/core/mihomo"
	"github.com/bestruirui/bestsub/internal/core/node"
	"github.com/bestruirui/bestsub/internal/core/task"
	"github.com/bestruirui/bestsub/internal/models/check"
	nodeModel "github.com/bestruirui/bestsub/internal/models/node"
	"github.com/bestruirui/bestsub/internal/modules/register"
	"github.com/bestruirui/bestsub/internal/utils/log"
	"github.com/bestruirui/bestsub/internal/utils/ua"
)

type TikTok struct {
	Thread  int `json:"thread" name:"线程数" value:"200"`
	Timeout int `json:"timeout" name:"超时时间" value:"10" desc:"单个节点检测的超时时间(s)"`
}

func (e *TikTok) Init() error {
	return nil
}

func (e *TikTok) Run(ctx context.Context, log *log.Logger, subID []uint16) check.Result {
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
		log.Warnf("tiktok check task failed, no nodes")
		return check.Result{
			Msg:      "no nodes",
			LastRun:  time.Now(),
			Duration: time.Since(startTime).Milliseconds(),
		}
	}

	sem := make(chan struct{}, threads)
	defer close(sem)

	var wg sync.WaitGroup
	for _, nd := range nodes {
		sem <- struct{}{}
		wg.Add(1)
		n := nd
		task.Submit(func() {
			defer func() {
				<-sem
				wg.Done()
			}()

			var raw map[string]any
			if err := yaml.Unmarshal(n.Raw, &raw); err != nil {
				log.Warnf("yaml.Unmarshal failed: %v", err)
				return
			}

			switch e.detectTikTok(ctx, raw) {
			case 1:
				n.Info.SetAliveStatus(nodeModel.TikTok, true)
			case 2:
				n.Info.SetAliveStatus(nodeModel.TikTokIDC, true)
			default:
				n.Info.SetAliveStatus(nodeModel.TikTok, false)
				n.Info.SetAliveStatus(nodeModel.TikTokIDC, false)
			}
		})
	}
	wg.Wait()

	log.Debugf("tiktok check task end")
	return check.Result{
		Msg:      "success",
		LastRun:  time.Now(),
		Duration: time.Since(startTime).Milliseconds(),
	}
}

func (e *TikTok) detectTikTok(ctx context.Context, raw map[string]any) uint8 {
	client := mihomo.Proxy(raw)
	if client == nil {
		return 0
	}
	client.Timeout = time.Duration(e.Timeout) * time.Second
	defer client.Release()

	req, err := http.NewRequestWithContext(ctx, "GET", "https://www.tiktok.com/", nil)
	if err != nil {
		return 0
	}

	ua.SetHeader(req)
	resp, err := client.Do(req)
	if err != nil {
		return 0
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return 0
	}
	if extractRegion(body) {
		return 1
	}

	req, err = http.NewRequestWithContext(ctx, "GET", "https://www.tiktok.com/api/passport/web/region/get/", nil)
	if err != nil {
		return 0
	}
	ua.SetHeader(req)
	req.Header.Set("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9")
	req.Header.Set("Accept-Language", "en")

	resp, err = client.Do(req)
	if err != nil {
		return 0
	}
	defer resp.Body.Close()
	body, err = io.ReadAll(resp.Body)
	if err != nil {
		return 0
	}
	if extractRegion(body) {
		return 2
	}

	return 0
}

func extractRegion(html []byte) bool {
	return bytes.Contains(html, []byte(`"region":`))
}

func init() {
	register.Check(&TikTok{})
}
