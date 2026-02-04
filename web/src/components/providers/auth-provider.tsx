"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'
import { api } from '@/src/lib/api/client'
import { tokenManager } from '@/src/lib/api/token-manager'
import type { UserInfo } from '@/src/types'

// Auth相关类型定义
interface AuthState {
    user: UserInfo | null
    isLoading: boolean
    isAuthenticated: boolean
}

interface AuthContextType extends AuthState {
    login: (username: string, password: string) => Promise<void>
    logout: () => Promise<void>
    updateUser: (user: UserInfo) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<UserInfo | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    const isAuthenticated = !!user

    const login = async (username: string, password: string) => {
        try {
            const response = await api.login(username, password)
            tokenManager.setTokens(response)
            const userInfo = await api.getUserInfo()
            setUser(userInfo)
        } catch (error) {
            console.error('Login failed:', error)
            throw error
        }
    }

    const updateUser = (user: UserInfo) => {
        setUser(user)
    }

    const logout = async () => {
        try {
            await api.logout()
        } catch (error) {
            console.error('Logout error:', error)
        } finally {
            tokenManager.clearTokens()
            setUser(null)
        }
    }



    // 初始化认证状态
    useEffect(() => {
        const initAuth = async () => {
            try {
                const currentUser = await api.getUserInfo()
                setUser(currentUser)
            } catch (error) {
                console.error('Auth initialization failed:', error)
                setUser(null)
            } finally {
                setIsLoading(false)
            }
        }

        initAuth()
    }, [])

    const value: AuthContextType = {
        user,
        isLoading,
        isAuthenticated,
        login,
        logout,
        updateUser,
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
