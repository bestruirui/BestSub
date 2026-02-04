/**
 * 格式化相关工具函数
 */

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * 合并CSS类名
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

/**
 * 格式化持续时间
 */
export function formatDuration(milliseconds: number): string {
    if (milliseconds < 1000) {
        return `${milliseconds}ms`
    } else if (milliseconds < 60000) {
        return `${(milliseconds / 1000).toFixed(1)}s`
    } else {
        const minutes = Math.floor(milliseconds / 60000)
        const seconds = Math.floor((milliseconds % 60000) / 1000)
        return `${minutes}m ${seconds}s`
    }
}



/**
 * 格式化最后运行时间（通用）
 */
export function formatLastRunTime(lastRun: string | undefined): string {
    if (!lastRun) return '从未运行'

    // 检查是否为零时间
    const zeroTimePatterns = [
        '0001-01-01T00:00:00Z',
        '0001-01-01T00:00:00.000Z',
        '1970-01-01T00:00:00Z',
        '1970-01-01T00:00:00.000Z'
    ]

    if (zeroTimePatterns.includes(lastRun)) {
        return '从未运行'
    }

    try {
        return new Date(lastRun).toLocaleString('zh-CN')
    } catch {
        return '时间格式错误'
    }
}

/**
 * 格式化布尔值显示
 */
export function formatBooleanText(value: boolean): string {
    return value ? '启用' : '禁用'
}
