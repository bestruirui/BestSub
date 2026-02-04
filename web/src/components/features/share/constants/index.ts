export const SHARE_CONSTANTS = {
    TOKEN_LENGTH: 32,
    DEFAULT_EXPIRES_HOURS: 0,
    DEFAULT_RULE_URL: 'https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_Full_NoAuto.ini',
    DEFAULT_RENAME_TEMPLATE: '{{.Country.Emoji}}{{.Country.NameZh}} {{.Delay}} {{.Count}}',
} as const

export const SUBSCRIPTION_TARGETS = [
    { value: 'qx', label: 'QX' },
    { value: 'QuantumultX', label: 'Quantumult X' },
    { value: 'surge', label: 'Surge' },
    { value: 'SurgeMac', label: 'SurgeMac' },
    { value: 'Loon', label: 'Loon' },
    { value: 'mihomo', label: 'Mihomo' },
    { value: 'uri', label: 'URI' },
    { value: 'v2', label: 'V2Ray' },
    { value: 'json', label: 'JSON' },
    { value: 'stash', label: 'Stash' },
    { value: 'shadowrocket', label: 'Shadowrocket' },
    { value: 'surfboard', label: 'Surfboard' },
    { value: 'singbox', label: 'Sing-Box' },
    { value: 'egern', label: 'Egern' },
] as const

export const FORM_VALIDATION = {
    NAME_REQUIRED: '请输入分享名称',
    POSITIVE_NUMBER: '请输入正数',
    VALID_COUNTRY_CODE: '请输入有效的国家代码',
} as const

export const UI_TEXT = {
    CREATE_SHARE: '创建分享',
    EDIT_SHARE: '编辑分享',
    UPDATE: '更新',
    CREATE: '创建',
    CANCEL: '取消',
    DELETE: '删除',
    COPY: '复制',
    LOADING: '加载中...',
    NO_DATA: '暂无数据',
    CONFIRM_DELETE: '确认删除',
    DELETE_CONFIRM_MESSAGE: '您确定要删除分享 "{name}" 吗？此操作无法撤销。',
    COPY_SUCCESS: '复制成功',
    COPY_FAILED: '复制失败',
    CREATE_SUCCESS: '分享创建成功',
    UPDATE_SUCCESS: '分享更新成功',
    DELETE_SUCCESS: '分享删除成功',
    CREATE_FAILED: '创建分享失败',
    UPDATE_FAILED: '更新分享失败',
    DELETE_FAILED: '删除分享失败',
} as const