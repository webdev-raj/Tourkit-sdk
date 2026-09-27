import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { Megaphone, PlusIcon } from 'lucide-react'

import { getAnnouncements, getAnnouncementStats } from '@/app/actions/announcements'
import { getUserPlan } from '@/app/actions/billing'
import { AnnouncementUpgradeWall } from '@/components/dashboard/announcement-upgrade-wall'
import { AnnouncementsList } from '@/components/dashboard/announcements-list'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }) {
  const { id } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('projects').select('name').eq('id', id).maybeSingle()
  const name = data?.name
  return { title: name ? `${name} announcements — TourKit` : 'Announcements — TourKit' }
}

export default async function AnnouncementsPage({ params }) {
  const { id: projectId } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/auth')

  const { data: project } = await supabase.from('projects').select('id, name').eq('id', projectId).maybeSingle()
  if (!project) notFound()

  const { plan } = await getUserPlan()

  if (plan === 'free') {
    return (
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Announcements</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Show a modal to visitors — product updates, launches, and notices.
          </p>
        </div>
        <AnnouncementUpgradeWall currentPlan={plan} />
      </div>
    )
  }

  const listRes = await getAnnouncements(projectId)
  const announcements = listRes.data ?? []
  const activeCount = announcements.filter((row) => row.is_active).length
  const atStarterLimit = plan === 'starter' && activeCount >= 2

  const statsEntries = await Promise.all(
    announcements.map(async (row) => {
      const stats = await getAnnouncementStats(row.id)
      return [row.id, stats]
    }),
  )
  const statsById = Object.fromEntries(statsEntries)

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Announcements</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Modal messages for {project.name}. Same script tag as your tour.
          </p>
        </div>

        {atStarterLimit ? (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="inline-flex">
                  <Button disabled className="bg-[#F15025]/40 text-white">
                    <PlusIcon className="mr-2 size-4" aria-hidden />
                    New announcement
                  </Button>
                </span>
              </TooltipTrigger>
              <TooltipContent>Limit reached — upgrade to Pro</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <Button asChild className="bg-[#F15025] hover:bg-[#F15025]/90">
            <Link href={`/dashboard/projects/${projectId}/announcements/new`}>
              <PlusIcon className="mr-2 size-4" aria-hidden />
              New announcement
            </Link>
          </Button>
        )}
      </div>

      {listRes.error ? (
        <div className="rounded-xl border border-white/10 bg-[#111111]/80 p-6 text-sm text-red-300">{listRes.error}</div>
      ) : announcements.length === 0 ? (
        <div className="flex flex-col items-center rounded-xl border border-dashed border-white/10 bg-[#111111]/40 px-6 py-16 text-center">
          <div className="mb-4 flex size-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
            <Megaphone className="size-5 text-[#F15025]" aria-hidden />
          </div>
          <h2 className="text-lg font-semibold text-white">No announcements yet</h2>
          <p className="mt-2 max-w-md text-sm text-[#888888]">
            Create a modal to tell visitors about a launch, update, or notice. It ships with the same TourKit snippet.
          </p>
          {!atStarterLimit ? (
            <Button asChild className="mt-6 bg-[#F15025] hover:bg-[#F15025]/90">
              <Link href={`/dashboard/projects/${projectId}/announcements/new`}>New announcement</Link>
            </Button>
          ) : null}
        </div>
      ) : (
        <AnnouncementsList projectId={projectId} announcements={announcements} statsById={statsById} />
      )}
    </div>
  )
}
