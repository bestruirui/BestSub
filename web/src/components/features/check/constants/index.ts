export const CHECK_CONSTANTS = {
    DEFAULT_TIMEOUT: 30,
    MIN_TIMEOUT: 1,
    MAX_TIMEOUT: 300,
    DEFAULT_CRON: "0 */5 * * *",
    DEFAULT_NOTIFY_CHANNEL: 1,
    DEFAULT_LOG_LEVEL: "info",
} as const

export const LOG_LEVELS = [
    { value: 'debug', label: 'Debug' },
    { value: 'info', label: 'Info' },
    { value: 'warn', label: 'Warn' },
    { value: 'error', label: 'Error' },
] as const

export const CHECK_STATUS_OPTIONS = [
    { value: 'idle', label: '空闲' },
    { value: 'running', label: '运行中' },
    { value: 'success', label: '成功' },
    { value: 'failed', label: '失败' },
] as const

export const FORM_VALIDATION = {
    NAME_REQUIRED: '任务名称不能为空',
    TYPE_REQUIRED: '请选择检测类型',
    TIMEOUT_RANGE: '超时时间必须在1-300秒之间',
    CRON_INVALID: '请输入有效的Cron表达式',
    NOTIFY_CHANNEL_MIN: '通知渠道必须大于0',
} as const

export const UI_TEXT = {
    CREATE_CHECK: '添加检测',
    EDIT_CHECK: '编辑检测任务',
    UPDATE: '更新',
    CREATE: '创建',
    CANCEL: '取消',
    DELETE: '删除',
    RUN: '运行',
    LOADING: '加载中...',
    NO_DATA: '暂无数据',
    CONFIRM_DELETE: '确认删除',
    DELETE_CONFIRM_MESSAGE: '您确定要删除检测任务 "{name}" 吗？此操作无法撤销。',
    RUN_SUCCESS: '运行成功',
    RUN_FAILED: '运行失败',
    CREATE_SUCCESS: '创建成功',
    UPDATE_SUCCESS: '更新成功',
    DELETE_SUCCESS: '删除成功',
    CREATE_FAILED: '创建失败',
    UPDATE_FAILED: '更新失败',
    DELETE_FAILED: '删除失败',
    LOAD_TYPES_FAILED: '加载失败',
    LOAD_CONFIG_FAILED: '加载失败',
} as const

export const CRON_PRESETS = [
    { label: '每5分钟', value: '0 */5 * * *' },
    { label: '每10分钟', value: '0 */10 * * *' },
    { label: '每30分钟', value: '0 */30 * * *' },
    { label: '每小时', value: '0 0 * * *' },
    { label: '每天', value: '0 0 0 * *' },
    { label: '每周', value: '0 0 0 * 0' },
] as const