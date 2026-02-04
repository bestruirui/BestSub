package system

// HealthResponse 健康检查响应
type HealthResponse struct {
	Status    string `json:"status" example:"ok"`                     // 服务状态
	Timestamp string `json:"timestamp" example:"2024-01-01T12:00:00"` // 检查时间
	Version   string `json:"version" example:"1.0.0"`                 // 版本信息
	Database  string `json:"database" example:"connected"`            // 数据库状态
}

// 系统信息结构
type Info struct {
	MemoryUsed    uint64  `json:"memory_used"`    // 已使用内存 (bytes)
	CPUPercent    float64 `json:"cpu_percent"`    // CPU 占用率
	StartTime     string  `json:"start_time"`     // 启动时间
	UploadBytes   uint64  `json:"upload_bytes"`   // 上传流量 (bytes)
	DownloadBytes uint64  `json:"download_bytes"` // 下载流量 (bytes)
}

type Version struct {
	SubConverterVersion string `json:"subconverter_version"`
	Version             string `json:"version"`
	BuildTime           string `json:"build_time"`
	Commit              string `json:"commit"`
	Author              string `json:"author"`
	Repo                string `json:"repo"`
}
