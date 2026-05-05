import { redirect } from 'next/navigation'

import { signOut } from '@/app/actions/auth'
import { AppSidebar } from '@/components/dashboard/app-sidebar'
import { UserMenu } from '@/components/dashboard/user-menu'
import { createClient } from '@/lib/supabase/server'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'

export const metadata = {
  title: 'Dashboard — TourKit',
}

export const dynamic = 'force-dynamic'

export default async function DashboardLayout({ children }) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/auth')

  return (
    <SidebarProvider>
      <AppSidebar userEmail={user.email} onSignOut={signOut} />
      <SidebarInset>
        <div className="flex min-h-dvh min-w-0 flex-col bg-background">
          <header className="sticky top-0 z-10 flex shrink-0 items-center justify-between gap-3 border-b border-border/80 bg-background/90 px-4 py-3 backdrop-blur-md sm:px-6">
            <div className="min-w-0">
              <div className="text-sm font-semibold leading-none tracking-tight">TourKit</div>
              <div className="mt-1 text-xs text-muted-foreground">Projects &amp; script keys</div>
            </div>
            <UserMenu email={user.email} onSignOut={signOut} />
          </header>
          <div
            id="main-content"
            className="flex-1 px-4 py-6 pb-10 sm:px-6 lg:py-10"
            tabIndex={-1}>
            <div className="mx-auto w-full max-w-6xl">{children}</div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

