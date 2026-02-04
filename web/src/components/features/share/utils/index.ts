import { SHARE_CONSTANTS } from '../constants'
import type { ShareRequest } from '@/src/types'

/**
 * 生成随机 token
 */
export function generateToken(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let token = ''
    for (let i = 0; i < SHARE_CONSTANTS.TOKEN_LENGTH; i++) {
        token += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return token
}

/**
 * 构建分享链接
 */
export function buildShareUrl(token: string, baseUrl?: string): string {
    const origin = baseUrl || (typeof window !== 'undefined' ? window.location.origin : '')
    return `${origin}/api/v1/share/sub/${token}`
}

/**
 * 复制文本到剪贴板
 */
export async function copyToClipboard(text: string): Promise<boolean> {
    // 优先使用现代 Clipboard API
    if (navigator.clipboard && window.isSecureContext) {
        try {
            await navigator.clipboard.writeText(text)
            return true
        } catch (error) {
            console.warn('Clipboard API failed:', error)
            return fallbackCopyToClipboard(text)
        }
    }

    // 降级到传统方法
    return fallbackCopyToClipboard(text)
}

/**
 * 降级复制方法
 */
function fallbackCopyToClipboard(text: string): boolean {
    const textArea = document.createElement('textarea')
    textArea.value = text
    textArea.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    opacity: 0;
    pointer-events: none;
  `

    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()

    try {
        const successful = document.execCommand('copy')
        return successful
    } catch (error) {
        console.warn('Fallback copy failed:', error)
        return false
    } finally {
        document.body.removeChild(textArea)
    }
}

/**
 * 创建默认的分享表单数据
 */
export function createDefaultShareData(): ShareRequest {
    return {
        name: '',
        enable: true,
        token: '',
        gen: {
            filter: {
                sub_id_exclude: false,
                country_exclude: false,
                sub_id: [],
                speed_up_more: 0,
                speed_down_more: 0,
                country: [],
                delay_less_than: 0,
                alive_status: 0,
                risk_less_than: 0,
            },
            rename: SHARE_CONSTANTS.DEFAULT_RENAME_TEMPLATE,
            proxy: false,
            target: 'auto',
        },
        max_access_count: 0,
        expires: SHARE_CONSTANTS.DEFAULT_EXPIRES_HOURS,
    }
}

/**
 * 验证国家代码格式
 */
export function validateCountryCodes(codes: string): string[] {
    return codes
        .split(',')
        .map(code => code.trim())
        .filter(Boolean)
        .filter(code => /^\d+$/.test(code)) // 只允许数字
}

/**
 * 格式化访问次数显示
 */
export function formatAccessCount(current: number, max: number): string {
    return `${current}/${max === 0 ? '∞' : max}`
}

/**
 * 格式化过期时间显示
 */
export function formatExpiresTime(expires: number): string {
    if (expires === 0) {
        return '永不过期'
    }
    const date = new Date(expires * 1000)
    return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    })
}

/**
 * 检查是否为自定义规则配置
 */
export function isCustomConfig(config: string, availableRules: Array<{ value: string }>): boolean {
    return !availableRules.some(rule => rule.value === config)
}

/**
 * 安全的数字转换
 */
export function safeParseInt(value: string, defaultValue = 0): number {
    const parsed = parseInt(value, 10)
    return isNaN(parsed) ? defaultValue : parsed
}

/**
 * 安全的浮点数转换
 */
export function safeParseFloat(value: string, defaultValue = 0): number {
    const parsed = parseFloat(value)
    return isNaN(parsed) ? defaultValue : parsed
}