/**
 * 时间处理相关工具函数
 */

/**
 * 检查是否为零时间
 */
export function isZeroTime(timeString: string | undefined | null): boolean {
    if (!timeString) return true

    const zeroTimePatterns = [
        '0001-01-01T00:00:00Z',
        '0001-01-01T00:00:00.000Z',
        '1970-01-01T00:00:00Z',
        '1970-01-01T00:00:00.000Z'
    ]

    return zeroTimePatterns.includes(timeString)
}

/**
 * 格式化时间
 */
export function formatTime(
    timeString: string | undefined | null,
    options?: Intl.DateTimeFormatOptions
): string | null {
    if (!timeString || isZeroTime(timeString)) {
        return null
    }

    try {
        return new Date(timeString).toLocaleString('zh-CN', options)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
        console.warn('Invalid date string:', timeString)
        return null
    }
}

/**
 * 格式化相对时间
 */
export function formatRelativeTime(timeString: string | undefined | null): string | null {
    if (!timeString || isZeroTime(timeString)) {
        return null
    }

    try {
        const now = new Date()
        const time = new Date(timeString)
        const diffInSeconds = Math.floor((now.getTime() - time.getTime()) / 1000)

        if (diffInSeconds < 60) return '刚刚'
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}分钟前`
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}小时前`
        if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}天前`

        return formatTime(timeString)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
        console.warn('Invalid date string:', timeString)
        return null
    }
} 