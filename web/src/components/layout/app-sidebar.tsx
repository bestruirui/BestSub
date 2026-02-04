"use client"

import * as React from "react"
import {
  IconDashboard,
  IconLink,
  IconSearch,
  IconShare,
  IconDatabase,
  IconBell,

  IconHelp,
  IconInnerShadowTop,

  IconFileText,
  IconBrandGithub,
} from "@tabler/icons-react"


import { NavMain } from "./nav-main"
import { NavSecondary } from "./nav-secondary"
import { NavUser } from "./nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/src/components/ui/sidebar"
import { APP_ROUTES } from "@/src/lib/config/config"
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {

  const navMain = [
    {
      title: APP_ROUTES.DASHBOARD.title,
      url: APP_ROUTES.DASHBOARD.path,
      icon: IconDashboard,
    },
    {
      title: APP_ROUTES.SUB.title,
      url: APP_ROUTES.SUB.path,
      icon: IconLink,
    },
    {
      title: APP_ROUTES.CHECK.title,
      url: APP_ROUTES.CHECK.path,
      icon: IconSearch,
    },
    {
      title: APP_ROUTES.SHARE.title,
      url: APP_ROUTES.SHARE.path,
      icon: IconShare,
    },
    {
      title: APP_ROUTES.STORAGE.title,
      url: APP_ROUTES.STORAGE.path,
      icon: IconDatabase,
    },
    {
      title: APP_ROUTES.NOTIFY.title,
      url: APP_ROUTES.NOTIFY.path,
      icon: IconBell,
    },
  ]

  const navSecondary = [
    {
      title: APP_ROUTES.LOG.title,
      url: APP_ROUTES.LOG.path,
      icon: IconFileText,
    },
    {
      title: APP_ROUTES.HELP.title,
      url: APP_ROUTES.HELP.path,
      icon: IconHelp,
    },
    {
      title: APP_ROUTES.GITHUB.title,
      url: APP_ROUTES.GITHUB.path,
      icon: IconBrandGithub,
    },
  ]

  return (
    <>
      <Sidebar collapsible="offcanvas" {...props}>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                className="data-[slot=sidebar-menu-button]:!p-1.5"
                onClick={() => window.location.hash = '/dashboard'}
              >
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">BestSub</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <NavMain items={navMain} />
          <NavSecondary items={navSecondary} className="mt-auto" />
        </SidebarContent>
        <SidebarFooter>
          <NavUser />
        </SidebarFooter>
      </Sidebar>
    </>
  )
}
