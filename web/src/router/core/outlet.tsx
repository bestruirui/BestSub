"use client"

import { useEffect } from 'react'
import { useRouter } from './context'
import { useAuth } from '@/src/components/providers'
import { Loading } from '@/src/components/ui/loading'
import { NotFound } from '@/src/components/pages'

interface RouterOutletProps {
  fallback?: React.ComponentType
}

export function RouterOutlet({ fallback: Fallback }: RouterOutletProps) {
  const { currentPath, routes, navigate } = useRouter()
  const { isAuthenticated, isLoading: authLoading } = useAuth()

  const currentRoute = routes.find(route => route.path === currentPath)

  useEffect(() => {
    if (!authLoading) {
      if (currentRoute?.protected && !isAuthenticated && currentPath !== '/login') {
        navigate('/login', undefined, { replace: true })
        return
      }

      if (isAuthenticated && currentPath === '/login') {
        navigate('/dashboard', undefined, { replace: true })
        return
      }

      if (!currentPath || currentPath === '' || currentPath === '/') {
        if (isAuthenticated) {
          navigate('/dashboard', undefined, { replace: true })
        } else {
          navigate('/login', undefined, { replace: true })
        }
        return
      }
    }
  }, [isAuthenticated, authLoading, currentPath, navigate, currentRoute])

  if (routes.length === 0) {
    return <Loading variant="fullscreen" message="初始化应用..." />
  }

  if (authLoading) {
    return <Loading variant="fullscreen" message="验证身份中..." />
  }

  if (currentRoute) {
    if (currentRoute.protected && !isAuthenticated) {
      return <Loading variant="fullscreen" message="跳转到登录..." />
    }

    const Component = currentRoute.component
    return <Component />
  }

  if (!currentPath || currentPath === '' || currentPath === '/') {
    return <Loading variant="fullscreen" message="正在跳转..." />
  }

  if (Fallback) {
    return <Fallback />
  }

  return <NotFound path={currentPath} />
}
