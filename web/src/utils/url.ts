/**
 * URL处理相关工具函数
 */

/**
 * 获取API基础URL
 */
export function getApiBaseUrl(): string {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASEURL

    if (!apiBaseUrl || apiBaseUrl.trim() === '') {
        if (typeof window !== 'undefined') {
            return window.location.origin
        }
        return ''
    }

    return apiBaseUrl.replace(/\/$/, '')
}

/**
 * 构建完整的API URL
 */
export function buildApiUrl(endpoint: string): string {
    const baseUrl = getApiBaseUrl()
    const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`
    return `${baseUrl}${normalizedEndpoint}`
} 