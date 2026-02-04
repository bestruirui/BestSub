"use client"

import { useEffect } from 'react'
import { useRouter } from '../core/context'
import { APP_CONFIG } from '@/src/lib/config/config'

export function useRouteTitle() {
    const { currentPath, routes } = useRouter()

    useEffect(() => {
        const currentRoute = routes.find(route => route.path === currentPath)
        if (currentRoute) {
            document.title = `${currentRoute.title} - ${APP_CONFIG.name}`
        }
    }, [currentPath, routes])
}
