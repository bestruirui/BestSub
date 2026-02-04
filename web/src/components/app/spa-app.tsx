"use client"

import { RouterProvider } from "@/src/router/core/router"
import { AppLayout } from "./app-layout"

export function SPAApp() {
    return (
        <RouterProvider>
            <AppLayout />
        </RouterProvider>
    )
}
