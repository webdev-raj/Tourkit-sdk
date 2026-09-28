'use server'

import { revalidatePath } from 'next/cache'

import { getUserPlan } from '@/app/actions/billing'
import { createClient } from '@/lib/supabase/server'

const FREQUENCIES = new Set(['once', 'until_dismissed', 'every_visit'])
const TYPES = new Set(['modal', 'banner', 'slide_in'])
const SIZES = new Set(['sm', 'md', 'lg'])
const VARIANTS = new Set(['info', 'success', 'warning', 'promo'])
const IMAGE_POSITIONS = new Set(['top', 'left'])
const SLIDE_POSITIONS = new Set(['bottom-right', 'bottom-left'])
const AUDIENCES = new Set(['all', 'new', 'returning', 'logged_in'])
const STARTER_MAX_ACTIVE = 2
const STARTER_TYPES = new Set(['modal', 'banner'])
const ANNOUNCEMENT_COLUMNS =
  'id, project_id, title, description, cta_text, cta_url, image_url, type, size, variant, image_position, slide_position, show_on, audience, audience_plan, frequency, start_date, end_date, is_active, created_at'

function formatDbError(error) {
  const msg = String(error?.message ?? '')

  if (
    msg.includes('schema cache') ||
    msg.toLowerCase().includes('relation') ||
    msg.toLowerCase().includes('does not exist') ||
    msg.toLowerCase().includes('column')
  ) {
    return (
      'Database tables are not set up yet. In Supabase: open SQL Editor, paste the full contents of doc/schema.sql, run it, then try again.'
    )
  }

  return msg || 'Something went wrong.'
}

function revalidateAnnouncementPages(projectId) {
  if (!projectId) return
  revalidatePath(`/dashboard/projects/${projectId}`)
  revalidatePath(`/dashboard/projects/${projectId}/announcements`)
}

async function requireUser(supabase) {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return { user: null, error: 'You must be signed in.' }
  }

  return { user, error: null }
}

async function assertProjectAccess(supabase, projectId) {
  const { data: project, error } = await supabase
    .from('projects')
    .select('id')
    .eq('id', projectId)
    .maybeSingle()

  if (error) return { error: formatDbError(error) }
  if (!project) return { error: 'Project not found or you do not have access.' }
  return { error: null }
}

async function resolveProjectIdFromAnnouncement(supabase, announcementId) {
  const { data } = await supabase
    .from('announcements')
    .select('project_id')
    .eq('id', announcementId)
    .maybeSingle()
  return data?.project_id ?? null
}

async function countActiveAnnouncements(supabase, projectId, excludeId) {
  let query = supabase
    .from('announcements')
    .select('id', { count: 'exact', head: true })
    .eq('project_id', projectId)
    .eq('is_active', true)

  if (excludeId) {
    query = query.neq('id', excludeId)
  }

  const { count, error } = await query
  if (error) return { count: 0, error }
  return { count: count ?? 0, error: null }
}

function parseOptionalText(value) {
  const text = value != null ? String(value).trim() : ''
  return text || null
}

function parseDate(value, asEndOfDay) {
  if (value == null || value === '') return null
  const text = String(value).trim()
  if (!text) return null
  const hasTime = text.includes('T')
  const iso = hasTime ? text : asEndOfDay ? `${text}T23:59:59.999` : `${text}T00:00:00.000`
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return null
  return d.toISOString()
}

function normalizeShowOn(value) {
  const text = String(value ?? 'all').trim()
  if (!text || text.toLowerCase() === 'all') return 'all'
  return text
}

function validateAnnouncementPayload(data, plan) {
  const title = String(data?.title ?? '').trim()
  const description = String(data?.description ?? '').trim()
  const ctaText = parseOptionalText(data?.cta_text)
  const ctaUrl = parseOptionalText(data?.cta_url)
  const imageUrl = parseOptionalText(data?.image_url)
  const typeRaw = String(data?.type ?? 'modal').trim()
  const type = TYPES.has(typeRaw) ? typeRaw : 'modal'
  const sizeRaw = String(data?.size ?? 'md').trim()
  const size = SIZES.has(sizeRaw) ? sizeRaw : 'md'
  const variantRaw = String(data?.variant ?? 'info').trim()
  const variant = VARIANTS.has(variantRaw) ? variantRaw : 'info'
  const imagePosRaw = String(data?.image_position ?? 'top').trim()
  const image_position = IMAGE_POSITIONS.has(imagePosRaw) ? imagePosRaw : 'top'
  const slidePosRaw = String(data?.slide_position ?? 'bottom-right').trim()
  const slide_position = SLIDE_POSITIONS.has(slidePosRaw) ? slidePosRaw : 'bottom-right'
  const audienceRaw = String(data?.audience ?? 'all').trim()
  const audience = AUDIENCES.has(audienceRaw) ? audienceRaw : 'all'
  const audience_plan = audience === 'logged_in' ? parseOptionalText(data?.audience_plan) : null
  const frequencyRaw = String(data?.frequency ?? 'until_dismissed').trim()
  const frequency = FREQUENCIES.has(frequencyRaw) ? frequencyRaw : 'until_dismissed'
  const show_on = normalizeShowOn(data?.show_on)
  const startDate = parseDate(data?.start_date, false)
  const endDate = parseDate(data?.end_date, true)

  if (!title) {
    return { error: 'Title is required.' }
  }
  if (!description) {
    return { error: 'Description is required.' }
  }
  if ((ctaText && !ctaUrl) || (!ctaText && ctaUrl)) {
    return { error: 'CTA text and CTA URL must both be set, or both left empty.' }
  }
  if (plan === 'starter' && !STARTER_TYPES.has(type)) {
    return { error: 'Slide-in announcements require Pro.' }
  }

  return {
    error: null,
    payload: {
      title,
      description,
      cta_text: ctaText,
      cta_url: ctaUrl,
      image_url: imageUrl,
      type,
      size,
      variant,
      image_position,
      slide_position,
      show_on,
      audience,
      audience_plan,
      frequency,
      start_date: startDate,
      end_date: endDate,
    },
  }
}

export async function getAnnouncements(projectId) {
  const supabase = await createClient()
  const { error: authError } = await requireUser(supabase)
  if (authError) {
    return { data: [], error: authError }
  }

  const access = await assertProjectAccess(supabase, projectId)
  if (access.error) {
    return { data: [], error: access.error }
  }

  const { data, error } = await supabase
    .from('announcements')
    .select(ANNOUNCEMENT_COLUMNS)
    .eq('project_id', projectId)
    .order('created_at', { ascending: false })

  if (error) {
    return { data: [], error: formatDbError(error) }
  }

  return { data: data ?? [], error: null }
}

export async function createAnnouncement(projectId, data) {
  const supabase = await createClient()
  const { error: authError } = await requireUser(supabase)
  if (authError) {
    return { ok: false, error: authError }
  }

  const access = await assertProjectAccess(supabase, projectId)
  if (access.error) {
    return { ok: false, error: access.error }
  }

  const { plan } = await getUserPlan()
  if (plan === 'free') {
    return { ok: false, error: 'Announcements require Starter or Pro' }
  }

  if (plan === 'starter') {
    const active = await countActiveAnnouncements(supabase, projectId)
    if (active.error) {
      return { ok: false, error: formatDbError(active.error) }
    }
    if (active.count >= STARTER_MAX_ACTIVE) {
      return { ok: false, error: 'Limit reached — upgrade to Pro' }
    }
  }

  const validated = validateAnnouncementPayload(data, plan)
  if (validated.error) {
    return { ok: false, error: validated.error }
  }

  const { data: row, error } = await supabase
    .from('announcements')
    .insert({
      project_id: projectId,
      ...validated.payload,
      is_active: true,
    })
    .select('id')
    .single()

  if (error) {
    return { ok: false, error: formatDbError(error) }
  }

  revalidateAnnouncementPages(projectId)
  return { ok: true, id: row?.id }
}

export async function updateAnnouncement(id, data) {
  const supabase = await createClient()
  const { error: authError } = await requireUser(supabase)
  if (authError) {
    return { ok: false, error: authError }
  }

  const { plan } = await getUserPlan()
  if (plan === 'free') {
    return { ok: false, error: 'Announcements require Starter or Pro' }
  }

  const validated = validateAnnouncementPayload(data, plan)
  if (validated.error) {
    return { ok: false, error: validated.error }
  }

  const projectId = await resolveProjectIdFromAnnouncement(supabase, id)
  if (!projectId) {
    return { ok: false, error: 'Announcement not found or you do not have access.' }
  }

  const { error } = await supabase.from('announcements').update(validated.payload).eq('id', id)

  if (error) {
    return { ok: false, error: formatDbError(error) }
  }

  revalidateAnnouncementPages(projectId)
  return { ok: true }
}

export async function deleteAnnouncement(id) {
  const supabase = await createClient()
  const { error: authError } = await requireUser(supabase)
  if (authError) {
    return { ok: false, error: authError }
  }

  const projectId = await resolveProjectIdFromAnnouncement(supabase, id)
  if (!projectId) {
    return { ok: false, error: 'Announcement not found or you do not have access.' }
  }

  const { error } = await supabase.from('announcements').delete().eq('id', id)

  if (error) {
    return { ok: false, error: formatDbError(error) }
  }

  revalidateAnnouncementPages(projectId)
  return { ok: true }
}

export async function toggleAnnouncementActive(id, isActive) {
  const supabase = await createClient()
  const { error: authError } = await requireUser(supabase)
  if (authError) {
    return { ok: false, error: authError }
  }

  const { data: row, error: fetchError } = await supabase
    .from('announcements')
    .select('id, project_id, type')
    .eq('id', id)
    .maybeSingle()

  if (fetchError) {
    return { ok: false, error: formatDbError(fetchError) }
  }
  if (!row) {
    return { ok: false, error: 'Announcement not found or you do not have access.' }
  }

  const active = Boolean(isActive)
  const { plan } = await getUserPlan()

  if (active) {
    if (plan === 'free') {
      return { ok: false, error: 'Announcements require Starter or Pro' }
    }
    if (plan === 'starter') {
      const type = String(row.type || 'modal')
      if (!STARTER_TYPES.has(type)) {
        return { ok: false, error: 'Slide-in announcements require Pro.' }
      }
      const counted = await countActiveAnnouncements(supabase, row.project_id, id)
      if (counted.error) {
        return { ok: false, error: formatDbError(counted.error) }
      }
      if (counted.count >= STARTER_MAX_ACTIVE) {
        return { ok: false, error: 'Limit reached — upgrade to Pro' }
      }
    }
  }

  const { error } = await supabase.from('announcements').update({ is_active: active }).eq('id', id)

  if (error) {
    return { ok: false, error: formatDbError(error) }
  }

  revalidateAnnouncementPages(row.project_id)
  return { ok: true }
}

function emptyByDay() {
  const days = []
  const now = new Date()
  for (let i = 13; i >= 0; i -= 1) {
    const d = new Date(now)
    d.setHours(0, 0, 0, 0)
    d.setDate(d.getDate() - i)
    const key = d.toISOString().slice(0, 10)
    days.push({ date: key, views: 0, clicks: 0, dismissals: 0 })
  }
  return days
}

export async function getAnnouncementStats(id) {
  const empty = { views: 0, clicks: 0, dismissals: 0, ctr: 0, byDay: emptyByDay() }
  const supabase = await createClient()
  const { error: authError } = await requireUser(supabase)
  if (authError) {
    return { ...empty, error: authError }
  }

  const since = new Date()
  since.setDate(since.getDate() - 14)

  const { data, error } = await supabase
    .from('announcement_events')
    .select('event_type, created_at')
    .eq('announcement_id', id)

  if (error) {
    return { ...empty, error: formatDbError(error) }
  }

  let views = 0
  let clicks = 0
  let dismissals = 0
  const byDay = emptyByDay()
  const index = Object.fromEntries(byDay.map((row, i) => [row.date, i]))
  const sinceMs = since.getTime()

  for (const row of data ?? []) {
    const type = String(row?.event_type || '')
    if (type === 'view') views += 1
    else if (type === 'click') clicks += 1
    else if (type === 'dismiss') dismissals += 1

    const created = row?.created_at ? new Date(row.created_at) : null
    if (!created || Number.isNaN(created.getTime()) || created.getTime() < sinceMs) continue
    const key = created.toISOString().slice(0, 10)
    const idx = index[key]
    if (idx == null) continue
    if (type === 'view') byDay[idx].views += 1
    else if (type === 'click') byDay[idx].clicks += 1
    else if (type === 'dismiss') byDay[idx].dismissals += 1
  }

  const ctr = views > 0 ? clicks / views : 0

  return { views, clicks, dismissals, ctr, byDay, error: null }
}
