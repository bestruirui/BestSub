/**
 * 验证相关工具函数
 */

/**
 * 验证超时时间
 */
export function validateTimeout(value: string | number): number {
    const num = typeof value === 'string' ? parseInt(value, 10) : value
    if (isNaN(num) || num < 1) return 10
    if (num > 300) return 300
    return num
}

/**
 * 验证URL格式
 */
export function validateUrl(url: string): boolean {
    if (!url.trim()) return false
    try {
        new URL(url)
        return url.startsWith('http://') || url.startsWith('https://')
    } catch {
        return false
    }
}

/**
 * 验证Cron表达式格式
 */
export function validateCronExpr(cron: string): boolean {
    if (!cron.trim()) return false
    const parts = cron.trim().split(/\s+/)
    return parts.length === 5 || parts.length === 6
}

