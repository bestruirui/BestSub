import type { DynamicConfigItem } from './common'

/**
 * 通知相关类型定义
 */

/**
 * 通知配置请求类型
 */
export interface NotifyRequest {
    name: string
    type: string
    config: Record<string, unknown>
}

/**
 * 通知配置响应类型
 */
export interface NotifyResponse {
    id: number
    name: string
    type: string
    config: Record<string, unknown>
}

/**
 * 通知模板类型
 */
export interface NotifyTemplate {
    id: number
    type: string
    title: string
    content: string
    created_at: string
    updated_at: string
}

/**
 * 通知渠道类型
 */
export type NotifyChannel = string

/**
 * 通知渠道配置响应
 */
export interface NotifyChannelConfigResponse {
    [channel: string]: DynamicConfigItem[]
} 