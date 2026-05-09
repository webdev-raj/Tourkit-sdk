import { redirect } from 'next/navigation'

import {
  getAnalyticsOverTime,
  getAnalyticsSummary,
  getStepAnalytics,
} from '@/app/actions/analytics'
import { AnalyticsDashboard } from '@/components/dashboard/analytics-dashboard'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }) {
  const { id } = await params
  const supabase = await createClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return { title: 'Analytics — TourKit' }
  }

  const { data: project } = await supabase
    .from('projects')
    .select('name')
    .eq('id', id)
    .eq('user_id', user.id)
    .maybeSingle()

  return { title: project?.name ? `${project.name} Analytics — TourKit` : 'Analytics — TourKit' }
}

export default async function ProjectAnalyticsPage({ params }) {
  const { id: projectId } = await params
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect('/dashboard')
  }

  const { data: project } = await supabase
    .from('projects')
    .select('id, name, script_key, user_id')
    .eq('id', projectId)
    .eq('user_id', user.id)
    .maybeSingle()

  if (!project) {
    redirect('/dashboard')
  }

  const { data: tour } = await supabase
    .from('tours')
    .select('is_active')
    .eq('project_id', projectId)
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle()

  const [summary, stepData, overTime] = await Promise.all([
    getAnalyticsSummary(projectId),
    getStepAnalytics(projectId),
    getAnalyticsOverTime(projectId),
  ])

  return (
    <AnalyticsDashboard
      project={project}
      summary={summary}
      stepData={stepData}
      overTime={overTime}
      isTourActive={Boolean(tour?.is_active)}
    />
  )
}
