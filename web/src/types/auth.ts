/**
 * 认证相关类型定义
 */

/**
 * 登录请求类型
 */
export interface LoginRequest {
    username: string
    password: string
}

/**
 * 登录响应类型
 */
export interface LoginResponse {
    access_token: string
    access_expires_at: string
}

/**
 * 用户信息类型
 */
export interface UserInfo {
    username: string
    created_at?: string
    updated_at?: string
}

/**
 * 修改密码请求类型
 */
export interface ChangePasswordRequest {
    username: string
    old_password: string
    new_password: string
}

/**
 * 更新用户信息请求类型
 */
export interface UpdateUserInfoRequest {
    username: string
}
