package setting

type Setting struct {
	Key   string `json:"key"`
	Value string `json:"value"`
}

const (
	PROXY_ENABLE = "proxy_enable"
	PROXY_URL    = "proxy_url"

	LOG_RETENTION_DAYS = "log_retention_days"

	FRONTEND_URL       = "frontend_url"
	FRONTEND_URL_PROXY = "frontend_url_proxy"

	SUBCONV_URL       = "subconv_url"
	SUBCONV_URL_PROXY = "subconv_url_proxy"

	SUB_DISABLE_AUTO = "sub_disable_auto"

	NODE_POOL_SIZE    = "node_pool_size"
	NODE_TEST_URL     = "node_test_url"
	NODE_TEST_TIMEOUT = "node_test_timeout"

	NODE_PROTOCOL_FILTER_ENABLE = "node_protocol_filter_enable"
	NODE_PROTOCOL_FILTER_MODE   = "node_protocol_filter_mode"
	NODE_PROTOCOL_FILTER        = "node_protocol_filter"

	TASK_MAX_THREAD  = "task_max_thread"
	TASK_MAX_TIMEOUT = "task_max_timeout"
	TASK_MAX_RETRY   = "task_max_retry"

	NOTIFY_OPERATION = "notify_operation"
	NOTIFY_ID        = "notify_id"
)
