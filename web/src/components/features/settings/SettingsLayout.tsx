import * as React from "react"
import { cn } from "@/src/utils"

interface SettingsLayoutProps {
  nav: Array<{ name: string; id: string }>
  activeTab: string
  onTabChange: (id: string) => void
  children: React.ReactNode
  renderActions: (isMobile: boolean) => React.ReactNode
  onSubmit: (e: React.FormEvent) => void
}

export function SettingsLayout({
  nav,
  activeTab,
  onTabChange,
  children,
  renderActions,
  onSubmit
}: SettingsLayoutProps) {
  const handleTabClick = (e: React.MouseEvent, itemId: string) => {
    e.preventDefault()
    e.stopPropagation()
    onTabChange(itemId)
  }

  return (
    <form onSubmit={onSubmit} className="flex h-full">
      <div className="md:hidden flex flex-col h-full max-h-[90vh] w-full">
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex-shrink-0">
          <div className="p-3 sm:p-4">
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">设置</h2>
            <div className="relative">
              <div className="flex overflow-x-auto gap-1.5 sm:gap-2 scrollbar-hide">
                {nav.map((item) => (
                  <button
                    key={item.name}
                    type="button"
                    onClick={(e) => handleTabClick(e, item.id)}
                    className={cn(
                      "flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm rounded-lg transition-all whitespace-nowrap flex-shrink-0",
                      activeTab === item.id
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "hover:bg-muted/70"
                    )}
                  >
                    <span className="truncate max-w-20 sm:max-w-24">{item.name}</span>
                  </button>
                ))}
              </div>
              <div className="absolute right-0 top-0 h-full w-6 sm:w-8 bg-gradient-to-l from-background/95 via-background/80 to-transparent pointer-events-none"></div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto min-h-0 bg-muted/20">
          <div className="p-3 sm:p-4 space-y-4">
            {children}
          </div>
        </div>

        <div className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-3 sm:p-4 flex-shrink-0">
          <div className="flex gap-2 sm:gap-3">
            {renderActions(true)}
          </div>
        </div>
      </div>

      <div className="hidden md:flex w-full h-full">
        <div className="flex w-full">
          <div className="w-64 flex-shrink-0 border-r bg-muted/5">
            <div className="p-6 pt-6">
              <h2 className="text-lg font-semibold mb-4">设置</h2>
              <nav className="space-y-1">
                {nav.map((item) => (
                  <button
                    key={item.name}
                    type="button"
                    onClick={(e) => handleTabClick(e, item.id)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors",
                      activeTab === item.id
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "hover:bg-muted/70 text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <span>{item.name}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          <main className="flex h-[600px] flex-1 flex-col overflow-hidden bg-background">
            <div className="flex-1 overflow-y-auto p-6 pt-12">
              {children}
            </div>

            <div className="border-t bg-muted/10 p-3 flex-shrink-0">
              <div className="flex justify-end gap-3">
                {renderActions(false)}
              </div>
            </div>
          </main>
        </div>
      </div>
    </form>
  )
}
