"use client"

import { createContext, useContext } from 'react'

export interface Route {
    path: string
    component: React.ComponentType
    title: string
    protected?: boolean
    preloadImport?: () => Promise<unknown>
    priority?: 'critical' | 'normal' | 'low'
}

export interface RouteParams {
    [key: string]: string | undefined
}

export interface QueryParams {
    [key: string]: string | string[] | undefined
}

export interface NavigateOptions {
    replace?: boolean
    state?: unknown
}

interface RouterContextType {
    currentPath: string
    params: RouteParams
    query: QueryParams
    navigate: (path: string, query?: QueryParams, options?: NavigateOptions) => void
    routes: Route[]
}

export const RouterContext = createContext<RouterContextType | undefined>(undefined)

export function useRouter() {
    const context = useContext(RouterContext)
    if (!context) {
        throw new Error('useRouter must be used within a RouterProvider')
    }
    return context
}
