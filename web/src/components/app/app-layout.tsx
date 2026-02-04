"use client"

import { useRouter } from "@/src/router/core/context"
import { useAuth } from "@/src/components/providers"
import { useRouteTitle, useRoutePreloader } from "@/src/router"
import { AppSidebar, SiteHeader } from "@/src/components/layout"
import { SidebarInset, SidebarProvider } from "@/src/components/ui/sidebar"
import { PageLoading } from "@/src/components/ui/loading"
import { RouterOutlet } from "@/src/router/core/outlet"

export function AppLayout() {
    const { currentPath, routes } = useRouter()
    const { isLoading } = useAuth()

    useRoutePreloader()
    useRouteTitle()

    if (isLoading) {
        return <PageLoading message="应用启动中..." />
    }

    const currentRoute = routes.find(route => route.path === currentPath)
    const isProtectedRoute = currentRoute?.protected || false

    if (isProtectedRoute) {
        return (
            <SidebarProvider
                style={
                    {
                        "--sidebar-width": "calc(var(--spacing) * 72)",
                        "--header-height": "calc(var(--spacing) * 12)",
                    } as React.CSSProperties
                }
            >
                <AppSidebar variant="inset" />
                <SidebarInset>
                    <SiteHeader />
                    <div className="flex flex-1 flex-col">
                        <div className="@container/main flex flex-1 flex-col gap-2">
                            <div
                                className="animate-in fade-in slide-in-from-bottom-2 duration-200 ease-out"
                                key={currentPath}
                            >
                                <RouterOutlet />
                            </div>
                        </div>
                    </div>
                </SidebarInset>
            </SidebarProvider>
        )
    }

    return (
        <div
            className="animate-in fade-in slide-in-from-bottom-2 duration-200 ease-out"
            key={currentPath}
        >
            <RouterOutlet />
        </div>
    )
}
