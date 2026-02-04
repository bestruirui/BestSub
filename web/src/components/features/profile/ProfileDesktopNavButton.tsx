import * as React from "react"
import { cn } from "@/src/utils"

interface ProfileDesktopNavButtonProps {
  tabId: string
  activeTab: string
  onTabChange: (id: string) => void
  children: React.ReactNode
}

export function ProfileDesktopNavButton({ tabId, activeTab, onTabChange, children }: ProfileDesktopNavButtonProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onTabChange(tabId)
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        "w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors",
        activeTab === tabId
          ? "bg-primary text-primary-foreground shadow-sm"
          : "hover:bg-muted/70 text-muted-foreground hover:text-foreground"
      )}
    >
      <span>{children}</span>
    </button>
  )
}