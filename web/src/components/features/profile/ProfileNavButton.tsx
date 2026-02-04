import * as React from "react"
import { cn } from "@/src/utils"

interface ProfileNavButtonProps {
  tabId: string
  activeTab: string
  onTabChange: (id: string) => void
  children: React.ReactNode
}

export function ProfileNavButton({ tabId, activeTab, onTabChange, children }: ProfileNavButtonProps) {
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
        "flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm rounded-lg transition-all whitespace-nowrap flex-shrink-0",
        activeTab === tabId
          ? "bg-primary text-primary-foreground shadow-sm"
          : "hover:bg-muted/70"
      )}
    >
      <span className="truncate max-w-20 sm:max-w-24">{children}</span>
    </button>
  )
}