"use client"

import { useEffect, useMemo, useState } from "react"
import { usePathname } from "next/navigation"

import { createClient } from "@/lib/supabase/client"

function BreadcrumbItem({ children }) {
  return <span className="text-sm text-muted-foreground">{children}</span>
}

export function DashboardBreadcrumb() {
  const pathname = usePathname()
  const projectId = useMemo(() => {
    try {
      if (!pathname) return null
      var m = pathname.match(/^\/dashboard\/projects\/([^/]+)/)
      return m && m[1] ? m[1] : null
    } catch {
      return null
    }
  }, [pathname])
  const onAnnouncements = Boolean(pathname?.includes('/announcements'))

  const [projectName, setProjectName] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function loadProjectName() {
      if (!projectId) return
      try {
        var supabase = createClient()
        var { data } = await supabase.from("projects").select("name").eq("id", projectId).maybeSingle()
        if (!cancelled) setProjectName(data?.name ?? null)
      } catch {
        if (!cancelled) setProjectName(null)
      }
    }

    loadProjectName()

    return () => {
      cancelled = true
    }
  }, [projectId])

  return (
    <div className="min-w-0">
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
        <BreadcrumbItem>Dashboard</BreadcrumbItem>
        <span className="text-muted-foreground">›</span>
        <BreadcrumbItem>Projects</BreadcrumbItem>
        {projectId ? (
          <>
            <span className="text-muted-foreground">›</span>
            <span className="truncate text-sm font-medium text-foreground">
              {projectName ?? "Loading…"}
            </span>
            {onAnnouncements ? (
              <>
                <span className="text-muted-foreground">›</span>
                <BreadcrumbItem>Announcements</BreadcrumbItem>
              </>
            ) : null}
          </>
        ) : null}
      </div>
    </div>
  )
}

