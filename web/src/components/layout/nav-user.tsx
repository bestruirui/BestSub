"use client"

import { useState } from "react"
import {
  IconDotsVertical,
  IconLogout,
  IconSettings,
  IconRefresh,
  IconUserCircle,
} from "@tabler/icons-react"

import {
  Avatar,
  AvatarFallback,
} from "@/src/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/src/components/ui/sidebar"
import { useAuth } from "@/src/components/providers"
import { SettingsDialog } from "@/src/components/features"
import { ProfileDialog } from "@/src/components/features/profile"
import { SystemUpdateDialog } from "@/src/components/features/system-update"

export function NavUser() {
  const { isMobile } = useSidebar()
  const { user, logout } = useAuth()
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isUpdateOpen, setIsUpdateOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  if (!user) return null

  const handleOpenSettings = () => {
    setIsDropdownOpen(false)
    setTimeout(() => {
      setIsSettingsOpen(true)
    }, 100)
  }

  const handleOpenProfile = () => {
    setIsDropdownOpen(false)
    setTimeout(() => {
      setIsProfileOpen(true)
    }, 100)
  }

  const handleOpenUpdate = () => {
    setIsDropdownOpen(false)
    setTimeout(() => {
      setIsUpdateOpen(true)
    }, 100)
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg grayscale">
                <AvatarFallback className="rounded-lg">
                  {user.username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.username}</span>
                <span className="text-muted-foreground truncate text-xs">
                  管理员
                </span>
              </div>
              <IconDotsVertical className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarFallback className="rounded-lg">
                    {user.username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.username}</span>
                  <span className="text-muted-foreground truncate text-xs">
                    管理员
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={handleOpenProfile}>
                <IconUserCircle />
                个人资料
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleOpenSettings}>
                <IconSettings />
                系统设置
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleOpenUpdate}>
                <IconRefresh />
                系统更新
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout}>
              <IconLogout />
              退出登录
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
      <SettingsDialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen} />
      <ProfileDialog open={isProfileOpen} onOpenChange={setIsProfileOpen} />
      <SystemUpdateDialog open={isUpdateOpen} onOpenChange={setIsUpdateOpen} />
    </SidebarMenu>
  )
}
