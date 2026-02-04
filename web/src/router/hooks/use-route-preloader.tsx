"use client"

import { useEffect, useCallback, useRef } from 'react'
import { useRouter } from '../core/context'

const preloadCache = new Map<string, Promise<unknown>>()
const preloadingPaths = new Set<string>()

export function useRoutePreloader() {
    const { routes } = useRouter()
    const preloadedCritical = useRef(false)

    const preloadRoute = useCallback(async (path: string): Promise<unknown> => {
        try {
            // 在路由配置中查找对应的路由
            const route = routes.find(r => r.path === path)

            if (!route?.preloadImport) {
                return Promise.resolve(null)
            }

            // 检查是否已经在缓存中
            if (preloadCache.has(path)) {
                return preloadCache.get(path)!
            }

            // 检查是否正在预加载
            if (preloadingPaths.has(path)) {
                return Promise.resolve(null)
            }

            preloadingPaths.add(path)

            // 使用路由配置中的预加载函数
            const importPromise = route.preloadImport()
            preloadCache.set(path, importPromise)

            importPromise.finally(() => {
                preloadingPaths.delete(path)
            })

            return importPromise
        } catch (error) {
            preloadingPaths.delete(path)
            console.warn(`Failed to preload route: ${path}`, error)
            return Promise.resolve(null)
        }
    }, [routes])

    const preloadCriticalRoutes = useCallback(async () => {
        if (preloadedCritical.current) return
        preloadedCritical.current = true

        // 从路由配置中自动获取关键路由
        const criticalRoutes = routes
            .filter(route => route.priority === 'critical' && route.preloadImport)
            .map(route => route.path)

        const schedulePreload = () => {
            criticalRoutes.forEach(path => preloadRoute(path))
        }

        // 使用空闲时间预加载
        if ('requestIdleCallback' in window) {
            (window as typeof window & {
                requestIdleCallback: (callback: () => void, options?: { timeout: number }) => void
            }).requestIdleCallback(schedulePreload, { timeout: 2000 })
        } else {
            setTimeout(schedulePreload, 1000)
        }
    }, [routes, preloadRoute])

    const preloadByPriority = useCallback(async (priority: 'critical' | 'normal' | 'low') => {
        const routesToPreload = routes
            .filter(route => route.priority === priority && route.preloadImport)
            .map(route => route.path)

        routesToPreload.forEach(path => preloadRoute(path))
    }, [routes, preloadRoute])

    useEffect(() => {
        preloadCriticalRoutes()
    }, [preloadCriticalRoutes])

    return {
        preloadRoute,
        preloadByPriority,
        preloadCriticalRoutes,
    }
}

export function useLinkPreloader() {
    const { preloadRoute } = useRoutePreloader()
    const timeoutRef = useRef<NodeJS.Timeout | null>(null)

    const handleMouseEnter = useCallback((path: string) => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
        }

        timeoutRef.current = setTimeout(() => {
            preloadRoute(path)
        }, 100)
    }, [preloadRoute])

    const handleMouseLeave = useCallback(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
            timeoutRef.current = null
        }
    }, [])

    return {
        handleMouseEnter,
        handleMouseLeave,
    }
}

// 高级预加载策略
export function useSmartPreloader() {
    const { preloadRoute, preloadByPriority } = useRoutePreloader()
    const { routes, currentPath } = useRouter()

    const preloadAdjacentRoutes = useCallback(() => {
        const currentIndex = routes.findIndex(route => route.path === currentPath)
        if (currentIndex === -1) return

        // 预加载相邻的路由
        const adjacentRoutes = [
            routes[currentIndex - 1],
            routes[currentIndex + 1],
        ].filter(Boolean)

        adjacentRoutes.forEach(route => {
            if (route?.preloadImport) {
                preloadRoute(route.path)
            }
        })
    }, [routes, currentPath, preloadRoute])

    const preloadAllNormalPriority = useCallback(() => {
        preloadByPriority('normal')
    }, [preloadByPriority])

    return {
        preloadAdjacentRoutes,
        preloadAllNormalPriority,
    }
}
