"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BookOpen, LayoutGridIcon, LogOutIcon, Settings, Sparkles } from "lucide-react"

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

const navItems = [
  { href: "/dashboard", label: "Projects", icon: LayoutGridIcon },
  { href: "/docs", label: "Docs", icon: BookOpen },
  { href: "/tools/generate", label: "AI Generator", icon: Sparkles },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
]

export function AppSidebar({ userEmail, onSignOut }) {
  const pathname = usePathname()

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

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href === '/dashboard' && pathname?.startsWith('/dashboard/projects')) ||
                  (item.href === '/docs' && pathname?.startsWith('/docs')) ||
                  (item.href === '/tools/generate' && pathname?.startsWith('/tools'))
                const Icon = item.icon
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild isActive={isActive} tooltip={item.label}>
                      <Link href={item.href}>
                        <Icon />
                        <span>
                          {item.label}
                          {item.href === '/tools/generate' ? (
                            <span
                              style={{
                                fontSize: '9px',
                                background: '#F15025',
                                color: '#fff',
                                padding: '1px 5px',
                                borderRadius: '4px',
                                marginLeft: '6px',
                                fontWeight: '600',
                                letterSpacing: '0.05em',
                              }}>
                              PRO
                            </span>
                          ) : null}
                        </span>
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

