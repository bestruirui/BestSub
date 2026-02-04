"use client"

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'

export function QueryProvider({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(() => new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 5 * 60 * 1000,
                gcTime: 10 * 60 * 1000,
                refetchOnWindowFocus: true,
                refetchOnReconnect: true,
                refetchInterval: 5 * 60 * 1000,
                refetchIntervalInBackground: false,
                retry: (failureCount, error: any) => {
                    if (error?.code >= 400 && error?.code < 500) {
                        return false
                    }
                    return failureCount < 3
                },
                retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
            },
            mutations: {
                retry: (failureCount, error: any) => {
                    if (error?.code >= 400 && error?.code < 500) {
                        return false
                    }
                    return failureCount < 2
                },
                retryDelay: 1500,
            },
        },
    }))

    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    )
} 