"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutGridIcon, LogOutIcon } from "lucide-react"

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

const navItems = [{ href: "/dashboard", label: "Projects", icon: LayoutGridIcon }]

export function AppSidebar({ userEmail, onSignOut }) {
  const pathname = usePathname()

  return (
    <Sidebar collapsible="offcanvas">
      <SidebarHeader className="flex flex-row items-center justify-between gap-2">
        <div className="min-w-0">
          <div className="text-sm font-semibold leading-none">TourKit</div>
          <div className="mt-1 truncate text-xs text-muted-foreground">{userEmail}</div>
        </div>
        <SidebarTrigger />
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href === '/dashboard' && pathname?.startsWith('/dashboard/projects'))
                const Icon = item.icon
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild isActive={isActive} tooltip={item.label}>
                      <Link href={item.href}>
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
        <form action={onSignOut} className="w-full">
          <Button type="submit" variant="outline" size="sm" className="h-10 w-full justify-center gap-2 border-sidebar-border bg-sidebar-accent/30 text-sidebar-accent-foreground hover:bg-sidebar-accent/50">
            <LogOutIcon className="size-4 shrink-0" aria-hidden />
            Sign out
          </Button>
        </form>
      </SidebarFooter>
    </Sidebar>
  )
}

