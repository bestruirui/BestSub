export const PROXY_ENABLE = "proxy_enable"
export const PROXY_URL = "proxy_url"

export const LOG_RETENTION_DAYS = "log_retention_days"

export const SUBCONV_URL = "subconv_url"
export const SUBCONV_URL_PROXY = "subconv_url_proxy"

export const SUB_DISABLE_AUTO = "sub_disable_auto"

export const NODE_POOL_SIZE = "node_pool_size"
export const NODE_TEST_URL = "node_test_url"
export const NODE_TEST_TIMEOUT = "node_test_timeout"

export const NODE_PROTOCOL_FILTER_ENABLE = "node_protocol_filter_enable"
export const NODE_PROTOCOL_FILTER_MODE = "node_protocol_filter_mode"
export const NODE_PROTOCOL_FILTER = "node_protocol_filter"

export const TASK_MAX_THREAD = "task_max_thread"
export const TASK_MAX_TIMEOUT = "task_max_timeout"
export const TASK_MAX_RETRY = "task_max_retry"

export const NOTIFY_OPERATION = "notify_operation"
export const NOTIFY_ID = "notify_id"

export const BOOLEAN_SETTING_KEYS = new Set<string>([
  PROXY_ENABLE,
  SUBCONV_URL_PROXY,
  NODE_PROTOCOL_FILTER_ENABLE,
  NODE_PROTOCOL_FILTER_MODE,
])

export const NUMBER_SETTING_KEYS = new Set<string>([
  LOG_RETENTION_DAYS,
  NODE_POOL_SIZE,
  NODE_TEST_TIMEOUT,
  TASK_MAX_THREAD,
  TASK_MAX_TIMEOUT,
  TASK_MAX_RETRY,
  SUB_DISABLE_AUTO,
  NOTIFY_OPERATION,
  NOTIFY_ID,
])

export const MULTI_SELECT_SETTING_KEYS = new Set<string>([
  NODE_PROTOCOL_FILTER,
])
