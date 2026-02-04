package subconv

import (
	"bytes"
	"context"
	"encoding/json"
	"io"
	"net/http"

	"github.com/bestruirui/bestsub/internal/core/mihomo"
	"github.com/bestruirui/bestsub/internal/database/op"
	"github.com/bestruirui/bestsub/internal/models/setting"
	"github.com/enfein/mieru/v3/pkg/log"
)

func ConvertData(raw string, target string) string {
	subStoreUrl := op.GetSettingStr(setting.SUBCONV_URL)
	if subStoreUrl == "" {
		log.Warnf("substore url is not set")
		return ""
	}
	client := mihomo.Default(op.GetSettingBool(setting.SUBCONV_URL_PROXY))
	if client == nil {
		log.Warnf("failed to create http client")
		return ""
	}
	defer client.Release()
	reqBody := struct {
		Data   string `json:"data"`
		Client string `json:"client"`
	}{
		Data:   raw,
		Client: target,
	}
	reqBodyBytes, err := json.Marshal(reqBody)
	if err != nil {
		log.Warnf("failed to marshal request body: %v", err)
		return ""
	}
	req, err := http.NewRequestWithContext(context.Background(), "POST", subStoreUrl+"/api/proxy/parse", bytes.NewBuffer(reqBodyBytes))
	if err != nil {
		log.Warnf("failed to create request: %v", err)
		return ""
	}
	resp, err := client.Do(req)
	if err != nil {
		log.Warnf("failed to do request: %v", err)
		return ""
	}
	defer resp.Body.Close()
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		log.Warnf("failed to read response body: %v", err)
		return ""
	}
	var respBody struct {
		Data struct {
			Parres string `json:"par_res"`
		}
	}
	err = json.Unmarshal(body, &respBody)
	if err != nil {
		log.Warnf("failed to unmarshal response body: %v body: %s", err, string(body))
		return ""
	}
	return respBody.Data.Parres
}
