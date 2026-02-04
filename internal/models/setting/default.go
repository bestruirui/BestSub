package setting

func DefaultSetting() []Setting {
	return []Setting{

		{
			Key:   PROXY_ENABLE,
			Value: "false",
		},
		{
			Key:   PROXY_URL,
			Value: "socks5://user:pass@127.0.0.1:1080",
		},
		{
			Key:   LOG_RETENTION_DAYS,
			Value: "7",
		},
		{
			Key:   FRONTEND_URL,
			Value: "https://github.com/bestruirui/BestSubFront/releases/latest/download/out.zip",
		},
		{
			Key:   FRONTEND_URL_PROXY,
			Value: "false",
		},
		{
			Key:   SUBCONV_URL,
			Value: "",
		},
		{
			Key:   SUBCONV_URL_PROXY,
			Value: "false",
		},
		{
			Key:   SUB_DISABLE_AUTO,
			Value: "0",
		},
		{
			Key:   NODE_POOL_SIZE,
			Value: "1000",
		},
		{
			Key:   NODE_TEST_URL,
			Value: "https://www.gstatic.com/generate_204",
		},
		{
			Key:   NODE_TEST_TIMEOUT,
			Value: "5",
		},
		{
			Key:   NODE_PROTOCOL_FILTER_ENABLE,
			Value: "false",
		},
		{
			Key:   NODE_PROTOCOL_FILTER_MODE,
			Value: "false",
		},
		{
			Key:   NODE_PROTOCOL_FILTER,
			Value: "",
		},
		{
			Key:   TASK_MAX_THREAD,
			Value: "200",
		},
		{
			Key:   TASK_MAX_TIMEOUT,
			Value: "60",
		},
		{
			Key:   TASK_MAX_RETRY,
			Value: "3",
		},
		{
			Key:   NOTIFY_OPERATION,
			Value: "0",
		},
		{
			Key:   NOTIFY_ID,
			Value: "0",
		},
	}
}
