package sub

import (
	"encoding/json"
	"time"

	nodeModel "github.com/bestruirui/bestsub/internal/models/node"
)

type Data struct {
	ID        uint16    `db:"id" json:"id"`
	Enable    bool      `db:"enable" json:"enable"`
	Name      string    `db:"name" json:"name"`
	Tags      string    `db:"tags" json:"tags"`
	CronExpr  string    `db:"cron_expr" json:"cron_expr"`
	Config    string    `db:"config" json:"config"`
	Result    string    `db:"result" json:"result"`
	CreatedAt time.Time `db:"created_at" json:"created_at"`
	UpdatedAt time.Time `db:"updated_at" json:"updated_at"`
}

type Config struct {
	Url                    string   `json:"url"`
	Proxy                  bool     `json:"proxy"`
	Timeout                int      `json:"timeout"`
	EnableFormatConversion bool     `json:"enable_format_conversion"`
	ProtocolFilterEnable   bool     `json:"protocol_filter_enable"`
	ProtocolFilterMode     bool     `json:"protocol_filter_mode"`
	ProtocolFilter         []string `json:"protocol_filter"`
}

type Result struct {
	Success       uint16    `json:"success,omitempty" description:"成功次数"`
	Fail          uint16    `json:"fail,omitempty" description:"失败次数"`
	NodeNullCount uint16    `json:"node_null_count,omitempty" description:"节点为空次数"`
	Msg           string    `json:"msg,omitempty" description:"消息"`
	RawCount      uint32    `json:"raw_count,omitempty" description:"节点数量"`
	LastRun       time.Time `json:"last_run,omitempty" description:"上次运行时间"`
	Duration      uint16    `json:"duration,omitempty" description:"运行时长(单位:毫秒)"`
}

type Request struct {
	Name     string   `json:"name" description:"订阅任务名称"`
	Tags     []string `json:"tags" description:"订阅标签"`
	Enable   bool     `json:"enable" description:"是否启用"`
	CronExpr string   `json:"cron_expr" example:"0 0 * * *" description:"cron表达式"`
	Config   Config   `json:"config"`
}

type Response struct {
	ID        uint16               `json:"id" description:"订阅任务ID"`
	Name      string               `json:"name" description:"订阅任务名称"`
	Tags      []string             `json:"tags" description:"订阅标签"`
	Enable    bool                 `json:"enable" description:"是否启用"`
	CronExpr  string               `json:"cron_expr" description:"cron表达式"`
	Config    Config               `json:"config" description:"订阅器配置"`
	Status    string               `json:"status" description:"订阅状态"`
	Result    Result               `json:"result" description:"订阅结果"`
	Info      nodeModel.SimpleInfo `json:"info" description:"订阅信息"`
	CreatedAt time.Time            `json:"created_at" description:"创建时间"`
	UpdatedAt time.Time            `json:"updated_at" description:"更新时间"`
}

func (c *Request) GenData(id uint16) Data {
	configBytes, err := json.Marshal(c.Config)
	if err != nil {
		return Data{}
	}
	tags, _ := json.Marshal(c.Tags)
	return Data{
		ID:       id,
		Name:     c.Name,
		Tags:     string(tags),
		Enable:   c.Enable,
		CronExpr: c.CronExpr,
		Config:   string(configBytes),
	}
}
func (d *Data) GenResponse(status string, subInfo nodeModel.SimpleInfo) Response {
	var config Config
	json.Unmarshal([]byte(d.Config), &config)
	var result Result
	json.Unmarshal([]byte(d.Result), &result)
	tags := make([]string, 0)
	json.Unmarshal([]byte(d.Tags), &tags)
	return Response{
		ID:        d.ID,
		Name:      d.Name,
		Tags:      tags,
		Enable:    d.Enable,
		CronExpr:  d.CronExpr,
		Config:    config,
		Status:    status,
		Result:    result,
		Info:      subInfo,
		CreatedAt: d.CreatedAt,
		UpdatedAt: d.UpdatedAt,
	}
}
