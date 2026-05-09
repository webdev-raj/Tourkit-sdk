'use server'

import { createClient } from '@/lib/supabase/server'

function emptySummary() {
  return {
    total_starts: 0,
    total_completions: 0,
    total_skips: 0,
    completion_rate: 0,
    skip_rate: 0,
    total_sessions: 0,
  }
}

async function canAccessProject(supabase, projectId) {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) return false

  const { data: project, error } = await supabase
    .from('projects')
    .select('id')
    .eq('id', projectId)
    .eq('user_id', user.id)
    .maybeSingle()

  return !error && Boolean(project?.id)
}

export async function getAnalyticsSummary(projectId) {
  const supabase = await createClient()
  const hasAccess = await canAccessProject(supabase, projectId)
  if (!hasAccess) return emptySummary()

  const { data: events, error } = await supabase
    .from('analytics_events')
    .select('event_type, session_id')
    .eq('project_id', projectId)

  if (error || !Array.isArray(events)) return emptySummary()

  let totalStarts = 0
  let totalCompletions = 0
  let totalSkips = 0
  const sessions = new Set()

  for (const event of events) {
    if (event?.event_type === 'tour_started') totalStarts += 1
    if (event?.event_type === 'tour_completed') totalCompletions += 1
    if (event?.event_type === 'tour_skipped') totalSkips += 1

    const sid = typeof event?.session_id === 'string' ? event.session_id.trim() : ''
    if (sid) sessions.add(sid)
  }

  const completionRate = totalStarts > 0 ? Math.round((totalCompletions / totalStarts) * 100) : 0
  const skipRate = totalStarts > 0 ? Math.round((totalSkips / totalStarts) * 100) : 0

  return {
    total_starts: totalStarts,
    total_completions: totalCompletions,
    total_skips: totalSkips,
    completion_rate: completionRate,
    skip_rate: skipRate,
    total_sessions: sessions.size,
  }
}

export async function getStepAnalytics(projectId) {
  const supabase = await createClient()
  const hasAccess = await canAccessProject(supabase, projectId)
  if (!hasAccess) return []

  const { data: rows, error } = await supabase
    .from('analytics_events')
    .select('step_order')
    .eq('project_id', projectId)
    .eq('event_type', 'step_viewed')

  if (error || !Array.isArray(rows)) return []

  const grouped = new Map()
  for (const row of rows) {
    const stepOrder = Number(row?.step_order)
    if (!Number.isFinite(stepOrder)) continue
    grouped.set(stepOrder, (grouped.get(stepOrder) || 0) + 1)
  }

  return Array.from(grouped.entries())
    .map(([step_order, views]) => ({ step_order, views }))
    .sort((a, b) => a.step_order - b.step_order)
}

function formatDateKeyUTC(date) {
  const year = date.getUTCFullYear()
  const month = String(date.getUTCMonth() + 1).padStart(2, '0')
  const day = String(date.getUTCDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export async function getAnalyticsOverTime(projectId) {
  const supabase = await createClient()
  const hasAccess = await canAccessProject(supabase, projectId)
  if (!hasAccess) return []

  const now = new Date()
  const fromDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - 13))
  const fromIso = `${formatDateKeyUTC(fromDate)}T00:00:00.000Z`

  const { data: rows, error } = await supabase
    .from('analytics_events')
    .select('created_at')
    .eq('project_id', projectId)
    .eq('event_type', 'tour_started')
    .gte('created_at', fromIso)

  if (error) return []

  const byDay = new Map()
  for (const row of rows || []) {
    const dateKey = typeof row?.created_at === 'string' ? row.created_at.slice(0, 10) : ''
    if (!dateKey) continue
    byDay.set(dateKey, (byDay.get(dateKey) || 0) + 1)
  }

  const filled = []
  for (let i = 0; i < 14; i += 1) {
    const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - (13 - i)))
    const key = formatDateKeyUTC(d)
    filled.push({ date: key, count: byDay.get(key) || 0 })
  }

  return filled
}
