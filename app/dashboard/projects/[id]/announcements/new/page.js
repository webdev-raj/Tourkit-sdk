import { notFound, redirect } from 'next/navigation'

import { getAnnouncements } from '@/app/actions/announcements'
import { getUserPlan } from '@/app/actions/billing'
import { AnnouncementForm } from '@/components/dashboard/announcement-form'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export async function generateMetadata() {
  return { title: 'New announcement — TourKit' }
}

export default async function NewAnnouncementPage({ params }) {
  const { id: projectId } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/auth')

  const { data: project } = await supabase.from('projects').select('id').eq('id', projectId).maybeSingle()
  if (!project) notFound()

  const { plan } = await getUserPlan()
  if (plan === 'free') {
    redirect(`/dashboard/projects/${projectId}/announcements`)
  }

  if (plan === 'starter') {
    const listRes = await getAnnouncements(projectId)
    const activeCount = (listRes.data ?? []).filter((row) => row.is_active).length
    if (activeCount >= 2) {
      redirect(`/dashboard/projects/${projectId}/announcements`)
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">New announcement</h1>
        <p className="mt-2 text-sm text-muted-foreground">Modal, banner, or slide-in. Title and description are required.</p>
      </div>
      <AnnouncementForm projectId={projectId} plan={plan} />
    </div>
  )
}
