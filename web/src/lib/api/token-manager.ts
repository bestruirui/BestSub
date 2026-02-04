import type { LoginResponse } from '../../types'

const TOKEN_KEYS = {
    ACCESS_TOKEN: 'access_token',
    ACCESS_EXPIRES: 'access_expires_at',
} as const

const LEGACY_KEYS = ['refresh_token', 'refresh_expires_at'] as const

export class TokenManager {
    static isServer() {
        return typeof window === 'undefined'
    }

    static getTokens() {
        if (this.isServer()) return null

        const accessToken = localStorage.getItem(TOKEN_KEYS.ACCESS_TOKEN)
        if (!accessToken) return null

        return {
            access_token: accessToken,
            access_expires_at: localStorage.getItem(TOKEN_KEYS.ACCESS_EXPIRES) || '',
        }
    }

    static setTokens(tokens: LoginResponse) {
        if (this.isServer()) return

        localStorage.setItem(TOKEN_KEYS.ACCESS_TOKEN, tokens.access_token)
        localStorage.setItem(TOKEN_KEYS.ACCESS_EXPIRES, tokens.access_expires_at)
    }

    static clearTokens() {
        if (this.isServer()) return
        Object.values(TOKEN_KEYS).forEach(key => localStorage.removeItem(key))
        LEGACY_KEYS.forEach(key => localStorage.removeItem(key))
    }

    static isExpired(expiresAt: string): boolean {
        if (!expiresAt) return true
        return new Date(expiresAt) <= new Date()
    }

    static async getValidToken(): Promise<string | null> {
        try {
            const tokens = this.getTokens()
            if (!tokens) return null
            if (!this.isExpired(tokens.access_expires_at)) {
                return tokens.access_token
            }
            this.clearTokens()
            return null
        } catch (error) {
            console.error('Token validation failed:', error)
            this.clearTokens()
            return null
        }
    }
}

// 导出实例方法给外部使用
export const tokenManager = {
    getTokens: () => TokenManager.getTokens(),
    setTokens: (tokens: LoginResponse) => TokenManager.setTokens(tokens),
    clearTokens: () => TokenManager.clearTokens(),
    isExpired: (expiresAt: string) => TokenManager.isExpired(expiresAt),
    getValidToken: () => TokenManager.getValidToken(),
}
