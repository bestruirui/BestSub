import * as React from "react"
import { ProfileNavButton } from "./ProfileNavButton"
import { ProfileDesktopNavButton } from "./ProfileDesktopNavButton"

interface ProfileLayoutProps {
  activeTab: string
  onTabChange: (id: string) => void
  children: React.ReactNode
  renderActions: (isMobile?: boolean) => React.ReactNode
  onSubmit: (e: React.FormEvent) => void
}

export function ProfileLayout({
  activeTab,
  onTabChange,
  children,
  renderActions,
  onSubmit
}: ProfileLayoutProps) {

  return (
    <form onSubmit={onSubmit} className="flex h-full">
      <div className="md:hidden flex flex-col h-full max-h-[90vh] w-full">
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex-shrink-0">
          <div className="p-3 sm:p-4">
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">个人资料</h2>
            <div className="relative">
              <div className="flex overflow-x-auto gap-1.5 sm:gap-2 scrollbar-hide">
                <ProfileNavButton tabId="profile" activeTab={activeTab} onTabChange={onTabChange}>
                  个人资料
                </ProfileNavButton>
                <ProfileNavButton tabId="password" activeTab={activeTab} onTabChange={onTabChange}>
                  修改密码
                </ProfileNavButton>
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
              <h2 className="text-lg font-semibold mb-4">个人资料</h2>
              <nav className="space-y-1">
                <ProfileDesktopNavButton tabId="profile" activeTab={activeTab} onTabChange={onTabChange}>
                  个人资料
                </ProfileDesktopNavButton>
                <ProfileDesktopNavButton tabId="password" activeTab={activeTab} onTabChange={onTabChange}>
                  修改密码
                </ProfileDesktopNavButton>
              </nav>
            </div>
          </div>

          <main className="flex h-[600px] flex-1 flex-col overflow-hidden bg-background">
            <div className="flex-1 overflow-y-auto p-6 pt-12">
              {children}
            </div>

            <div className="border-t bg-muted/10 p-6 flex-shrink-0">
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
