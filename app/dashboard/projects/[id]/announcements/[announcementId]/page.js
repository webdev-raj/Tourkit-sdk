import { notFound, redirect } from 'next/navigation'

import { getAnnouncements } from '@/app/actions/announcements'
import { getUserPlan } from '@/app/actions/billing'
import { AnnouncementForm } from '@/components/dashboard/announcement-form'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }) {
  const { id } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('projects').select('name').eq('id', id).maybeSingle()
  return { title: data?.name ? `Edit announcement — ${data.name}` : 'Edit announcement — TourKit' }
}

export default async function EditAnnouncementPage({ params }) {
  const { id: projectId, announcementId } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/auth')

  const { plan } = await getUserPlan()
  if (plan === 'free') {
    redirect(`/dashboard/projects/${projectId}/announcements`)
  }

  const listRes = await getAnnouncements(projectId)
  const announcement = (listRes.data ?? []).find((row) => row.id === announcementId)
  if (!announcement) notFound()

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">Edit announcement</h1>
        <p className="mt-2 text-sm text-muted-foreground">Changes go live with the next SDK config fetch.</p>
      </div>
      <AnnouncementForm projectId={projectId} announcement={announcement} />
    </div>
  )
}
