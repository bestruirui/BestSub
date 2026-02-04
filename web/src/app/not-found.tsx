"use client"

import { useEffect } from "react"
import { SPAApp } from "@/src/components/app"

export default function NotFound() {
    useEffect(() => {
        const currentPath = window.location.pathname
        if (currentPath !== '/') {
            window.location.href = `/#${currentPath}${window.location.search}${window.location.hash}`
        }
    }, [])
    return <SPAApp />
} 