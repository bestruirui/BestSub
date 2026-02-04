"use client"

import { useState, useCallback } from 'react'

export function useNavigation() {
    const [isNavigating, setIsNavigating] = useState(false)
    const [visitedPaths, setVisitedPaths] = useState<Set<string>>(new Set())

    const markPathAsVisited = useCallback((path: string) => {
        if (!path) return
        setVisitedPaths(prev => {
            const next = new Set(prev)
            next.add(path)
            return next
        })
    }, [])

    const isFirstVisit = useCallback((path: string) => {
        return !visitedPaths.has(path)
    }, [visitedPaths])

    const setNavigating = useCallback((navigating: boolean) => {
        setIsNavigating(navigating)
    }, [])

    const goBack = useCallback(() => {
        setIsNavigating(true)
        window.history.back()
        setTimeout(() => setIsNavigating(false), 100)
    }, [])

    const goForward = useCallback(() => {
        setIsNavigating(true)
        window.history.forward()
        setTimeout(() => setIsNavigating(false), 100)
    }, [])

    return {
        isNavigating,
        visitedPaths,
        isFirstVisit,
        markPathAsVisited,
        setNavigating,
        goBack,
        goForward,
    }
}
