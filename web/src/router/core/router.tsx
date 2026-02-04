"use client"

import { useState, useEffect, useCallback, ReactNode } from 'react'
import { RouterContext, QueryParams, RouteParams, NavigateOptions } from './context'
import { routes } from '../routes'

function parseRoute(hash: string): { path: string; params: RouteParams; query: QueryParams } {
    if (!hash) return { path: '', params: {}, query: {} }

    const cleanHash = hash.startsWith('#') ? hash.slice(1) : hash

    const [pathWithParams, queryString] = cleanHash.split('?')

    const query: QueryParams = {}
    if (queryString) {
        const searchParams = new URLSearchParams(queryString)
        for (const [key, value] of searchParams) {
            const existing = query[key]
            if (existing === undefined) {
                query[key] = value
            } else if (Array.isArray(existing)) {
                existing.push(value)
            } else {
                query[key] = [existing, value]
            }
        }
    }

    const path = pathWithParams || ''
    const params: RouteParams = {}

    return { path, params, query }
}

function buildRoute(path: string, query?: QueryParams): string {
    if (!query || Object.keys(query).length === 0) {
        return path
    }

    const searchParams = new URLSearchParams()
    Object.entries(query).forEach(([key, value]) => {
        if (Array.isArray(value)) {
            value.forEach(v => searchParams.append(key, v))
        } else if (value !== undefined) {
            searchParams.set(key, value)
        }
    })

    const queryString = searchParams.toString()
    return queryString ? `${path}?${queryString}` : path
}

export function RouterProvider({ children }: { children: ReactNode }) {
    const [routeState, setRouteState] = useState(() => {
        if (typeof window !== 'undefined') {
            return parseRoute(window.location.hash)
        }
        return { path: '', params: {}, query: {} }
    })

    useEffect(() => {
        const handleHashChange = () => {
            const newState = parseRoute(window.location.hash)
            setRouteState(newState)
        }

        window.addEventListener('hashchange', handleHashChange)
        return () => window.removeEventListener('hashchange', handleHashChange)
    }, [])

    const navigate = useCallback((
        path: string,
        query?: QueryParams,
        options: NavigateOptions = {}
    ) => {
        const route = buildRoute(path, query)

        if (options.replace) {
            if (options.state !== undefined) {
                try { window.history.replaceState(options.state, '') } catch { }
            }
            window.location.replace(`#${route}`)
        } else {
            if (options.state !== undefined) {
                try { window.history.pushState(options.state, '') } catch { }
            }
            window.location.hash = route
        }
    }, [])

    const contextValue = {
        currentPath: routeState.path,
        params: routeState.params,
        query: routeState.query,
        navigate,
        routes,
    }

    return (
        <RouterContext.Provider value={contextValue}>
            {children}
        </RouterContext.Provider>
    )
}
