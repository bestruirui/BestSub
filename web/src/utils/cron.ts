/**
 * Cron表达式处理相关工具函数
 */

import { formatTime } from './time'

/**
 * 获取下一个Cron运行时间
 */
export function getNextCronRunTime(cronExpr: string, enabled: boolean): string | null {
    if (!enabled || !cronExpr.trim()) {
        return null
    }

    try {
        const parts = cronExpr.trim().split(/\s+/)
        if (parts.length < 5) return null

        const minute = parts[0]
        const hour = parts[1]
        const day = parts[2]
        const month = parts[3]
        const weekday = parts[4]

        if (!minute || !hour || !day || !month || !weekday) return null

        const now = new Date()
        const next = new Date(now)

        // 简单的cron计算逻辑（处理常见模式）
        if (hour.startsWith('*/')) {
            // 每N小时模式: 0 */6 * * * 或 * */6 * * *
            const hourInterval = parseInt(hour.substring(2))
            if (isNaN(hourInterval)) return null

            let targetMinute = 0
            if (minute !== '*') {
                targetMinute = parseInt(minute)
                if (isNaN(targetMinute)) return null
            }

            // 计算下一个时间点
            const currentHour = now.getHours()
            const nextHourSlot = Math.ceil(currentHour / hourInterval) * hourInterval

            next.setHours(nextHourSlot, targetMinute, 0, 0)

            // 如果计算出的时间已经过了，添加一个间隔
            if (next <= now) {
                next.setHours(next.getHours() + hourInterval)
            }

        } else if (minute !== '*' && hour !== '*') {
            // 固定时间模式: 30 14 * * * (每天14:30)
            const targetMinute = parseInt(minute)
            const targetHour = parseInt(hour)
            if (isNaN(targetMinute) || isNaN(targetHour)) return null

            next.setHours(targetHour, targetMinute, 0, 0)
            if (next <= now) {
                next.setDate(next.getDate() + 1)
            }

        } else if (minute.startsWith('*/')) {
            // 每N分钟模式: */30 * * * *
            const minuteInterval = parseInt(minute.substring(2))
            if (isNaN(minuteInterval)) return null

            const nextMinute = Math.ceil(now.getMinutes() / minuteInterval) * minuteInterval
            next.setMinutes(nextMinute, 0, 0)
            if (next <= now) {
                next.setHours(next.getHours() + 1)
                next.setMinutes(0, 0, 0)
            }

        } else {
            // 其他复杂模式，返回估算时间
            next.setHours(next.getHours() + 1)
            next.setMinutes(0, 0, 0)
        }

        return formatTime(next.toISOString())
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
        return null
    }
} 