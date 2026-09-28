"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BookOpen, LayoutGridIcon, LogOutIcon, Megaphone, Settings } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/sidebar"

export function AppSidebar({ userEmail, onSignOut }) {
  const pathname = usePathname()
  const projectMatch = pathname?.match(/^\/dashboard\/projects\/([^/]+)/)
  const projectId = projectMatch?.[1] || null

  const navItems = [
    { href: "/dashboard", label: "Projects", icon: LayoutGridIcon },
    { href: "/docs", label: "Docs", icon: BookOpen },
    ...(projectId
      ? [{ href: `/dashboard/projects/${projectId}/announcements`, label: "Announcements", icon: Megaphone, kind: "announcements" }]
      : []),
    { href: "/dashboard/settings", label: "Settings", icon: Settings },
  ]

  return (
    <Sidebar collapsible="offcanvas">
      <SidebarHeader className="flex flex-row items-center justify-between gap-2 px-3 py-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <div className="text-sm font-semibold leading-none tracking-tight">TourKit</div>
            <span className="inline-flex size-1.5 rounded-full bg-primary" aria-hidden />
          </div>
          <div className="mt-1 text-[0.7rem] text-muted-foreground">Dashboard</div>
        </div>
        <SidebarTrigger />
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent data-tourkit="main-navigation">
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const onAnnouncements = Boolean(pathname?.includes('/announcements'))
                const isActive =
                  item.kind === 'announcements'
                    ? onAnnouncements
                    : item.href === '/dashboard'
                      ? pathname === '/dashboard' ||
                        (Boolean(pathname?.startsWith('/dashboard/projects')) && !onAnnouncements)
                      : pathname === item.href ||
                        (item.href === '/docs' && pathname?.startsWith('/docs'))
                const Icon = item.icon
                return (
                  <SidebarMenuItem key={item.kind || item.href}>
                    <SidebarMenuButton asChild isActive={isActive} tooltip={item.label}>
                      <Link
                        href={item.href}
                        data-tour={
                          item.href === '/dashboard'
                            ? 'sidebar-projects'
                            : item.href === '/docs'
                              ? 'sidebar-docs'
                              : item.href === '/dashboard/settings'
                                ? 'sidebar-settings'
                                : undefined
                        }>
                        <Icon />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarSeparator />

      <SidebarFooter className="gap-3 border-t border-sidebar-border p-4">
        <div className="truncate text-xs text-muted-foreground">{userEmail}</div>
        <form action={onSignOut} className="w-full">
          <Button
            type="submit"
            variant="outline"
            size="sm"
            className="h-10 w-full justify-center gap-2 rounded-xl border-sidebar-border bg-background/20 text-sidebar-accent-foreground hover:bg-sidebar-accent/40">
            <LogOutIcon className="size-4 shrink-0" aria-hidden />
            Sign out
          </Button>
        </form>
      </SidebarFooter>
    </Sidebar>
  )
}

