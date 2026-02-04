/**
 * 通用类型定义
 */

/**
 * 基础实体类型
 */
export interface BaseEntity {
    id: number
    created_at: string
    updated_at: string
}

/**
 * 分页请求参数
 */
export interface PaginationParams {
    page?: number
    page_size?: number
    sort_by?: string
    sort_order?: 'asc' | 'desc'
}

/**
 * 分页响应类型
 */
export interface PaginatedResponse<T> {
    items: T[]
    total: number
    page: number
    page_size: number
    total_pages: number
}

/**
 * 动态配置项类型（用于 check 和 notify）
 */
export interface DynamicConfigItem {
    name: string
    key: string
    type: string
    value: string
    options: string
    require: boolean
    desc: string
}

/**
 * 动态配置值类型
 */
export type ConfigValue = string | number | boolean

/**
 * 动态配置对象类型
 */
export interface DynamicConfig {
    [key: string]: ConfigValue
}

export interface KeyValue {
    key: string
    value: string
}