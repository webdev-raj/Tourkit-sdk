'use server'

import { revalidatePath } from 'next/cache'

import { createClient } from '@/lib/supabase/server'

const POSITIONS = new Set(['top', 'bottom', 'left', 'right'])
const TOUR_THEMES = new Set(['dark', 'light'])
const TOUR_FONTS = new Set(['Inter', 'Geist', 'System', 'Roboto', 'Poppins'])
const TOUR_RADII = new Set(['4px', '8px', '10px', '12px', '14px', '16px', '20px', '24px'])

function formatDbError(error) {
  const msg = String(error?.message ?? '')

  if (
    msg.includes('schema cache') ||
    msg.toLowerCase().includes('relation') ||
    msg.toLowerCase().includes('does not exist')
  ) {
    return (
      'Database tables are not set up yet. In Supabase: open SQL Editor, paste the full contents of doc/schema.sql, run it, then try again.'
    )
  }

  return msg || 'Something went wrong.'
}

function normalizePosition(value) {
  const v = String(value || 'bottom').toLowerCase()
  return POSITIONS.has(v) ? v : 'bottom'
}

async function resolveProjectIdFromTourId(supabase, tourId) {
  const { data } = await supabase.from('tours').select('project_id').eq('id', tourId).maybeSingle()
  return data?.project_id ?? null
}

async function resolveProjectIdFromStepId(supabase, stepId) {
  const { data: step } = await supabase.from('steps').select('tour_id').eq('id', stepId).maybeSingle()
  if (!step?.tour_id) return null
  return resolveProjectIdFromTourId(supabase, step.tour_id)
}

function revalidateProjectPage(projectId) {
  if (projectId) {
    revalidatePath(`/dashboard/projects/${projectId}`)
  }
}

export async function getTourByProjectId(projectId) {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return { data: null, error: 'You must be signed in.' }
  }

  const { data: project, error: projectError } = await supabase
    .from('projects')
    .select('id')
    .eq('id', projectId)
    .maybeSingle()

  if (projectError) {
    return { data: null, error: formatDbError(projectError) }
  }

  if (!project) {
    return { data: null, error: 'Project not found or you do not have access.' }
  }

  let { data: existing, error: fetchError } = await supabase
    .from('tours')
    .select('id, project_id, name, is_active, primary_color, font_family, border_radius, theme, template_id, created_at')
    .eq('project_id', projectId)
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle()

  const missingCustomizationColumns =
    fetchError &&
    String(fetchError.message || '').toLowerCase().includes('column') &&
    (
      String(fetchError.message || '').toLowerCase().includes('primary_color') ||
      String(fetchError.message || '').toLowerCase().includes('font_family') ||
      String(fetchError.message || '').toLowerCase().includes('border_radius') ||
      String(fetchError.message || '').toLowerCase().includes('theme') ||
      String(fetchError.message || '').toLowerCase().includes('template_id')
    )

  if (missingCustomizationColumns) {
    const fallback = await supabase
      .from('tours')
      .select('id, project_id, name, is_active, created_at')
      .eq('project_id', projectId)
      .order('created_at', { ascending: true })
      .limit(1)
      .maybeSingle()

    existing = fallback.data
    fetchError = fallback.error
  }

  if (fetchError) {
    return { data: null, error: formatDbError(fetchError) }
  }

  if (existing) {
    return {
      data: {
        ...existing,
        primary_color: existing.primary_color || '#F15025',
        font_family: existing.font_family || 'Inter',
        border_radius: existing.border_radius || '10px',
        theme: existing.theme || 'dark',
        template_id: existing.template_id || 'default',
      },
      error: null,
    }
  }

  const { data: insertedBase, error: insertError } = await supabase
    .from('tours')
    .insert({ project_id: projectId, name: 'Default Tour', is_active: true })
    .select('id, project_id, name, is_active, created_at')
    .single()

  if (insertError) {
    return { data: null, error: formatDbError(insertError) }
  }

  revalidateProjectPage(projectId)
  return {
    data: {
      ...insertedBase,
      primary_color: '#F15025',
      font_family: 'Inter',
      border_radius: '10px',
      theme: 'dark',
      template_id: 'default',
    },
    error: null,
  }
}

export async function getStepsByTourId(tourId) {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return { data: [], error: 'You must be signed in.' }
  }

  const { data: steps, error } = await supabase
    .from('steps')
    .select('id, tour_id, selector, title, message, position, step_order, url_pattern, created_at')
    .eq('tour_id', tourId)
    .order('step_order', { ascending: true })

  if (error) {
    return { data: [], error: formatDbError(error) }
  }

  return { data: steps ?? [], error: null }
}

/**
 * @param {string} tourId
 * @param {{ title?: string | null, message: string, selector: string, position?: string, url_pattern?: string | null }} data
 */
export async function createStep(tourId, data) {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return { error: 'You must be signed in.' }
  }

  const message = String(data?.message ?? '').trim()
  const selector = String(data?.selector ?? '').trim()
  const title = data?.title != null ? String(data.title).trim() : ''
  const position = normalizePosition(data?.position)
  const urlPatternRaw = data?.url_pattern != null ? String(data.url_pattern).trim() : ''
  const url_pattern = urlPatternRaw || null

  if (!selector) {
    return { error: 'CSS selector is required.' }
  }

  if (!message) {
    return { error: 'Message is required.' }
  }

  const { data: maxRow } = await supabase
    .from('steps')
    .select('step_order')
    .eq('tour_id', tourId)
    .order('step_order', { ascending: false })
    .limit(1)
    .maybeSingle()

  const nextOrder = (maxRow?.step_order ?? -1) + 1

  const { data: row, error } = await supabase
    .from('steps')
    .insert({
      tour_id: tourId,
      selector,
      title: title || null,
      message,
      position,
      url_pattern,
      step_order: nextOrder,
    })
    .select('id')
    .single()

  if (error) {
    return { error: formatDbError(error) }
  }

  const projectId = await resolveProjectIdFromTourId(supabase, tourId)
  revalidateProjectPage(projectId)

  return { ok: true, id: row?.id }
}

/**
 * @param {string} stepId
 * @param {{ title?: string | null, message: string, selector: string, position?: string, url_pattern?: string | null }} data
 */
export async function updateStep(stepId, data) {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return { error: 'You must be signed in.' }
  }

  const message = String(data?.message ?? '').trim()
  const selector = String(data?.selector ?? '').trim()
  const title = data?.title != null ? String(data.title).trim() : ''
  const position = normalizePosition(data?.position)
  const urlPatternRaw = data?.url_pattern != null ? String(data.url_pattern).trim() : ''
  const url_pattern = urlPatternRaw || null

  if (!selector) {
    return { error: 'CSS selector is required.' }
  }

  if (!message) {
    return { error: 'Message is required.' }
  }

  const { error } = await supabase
    .from('steps')
    .update({
      selector,
      title: title || null,
      message,
      position,
      url_pattern,
    })
    .eq('id', stepId)

  if (error) {
    return { error: formatDbError(error) }
  }

  const projectId = await resolveProjectIdFromStepId(supabase, stepId)
  revalidateProjectPage(projectId)

  return { ok: true }
}

export async function deleteStep(stepId) {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return { error: 'You must be signed in.' }
  }

  const projectId = await resolveProjectIdFromStepId(supabase, stepId)

  const { error } = await supabase.from('steps').delete().eq('id', stepId)

  if (error) {
    return { error: formatDbError(error) }
  }

  revalidateProjectPage(projectId)
  return { ok: true }
}

/**
 * @param {Array<{ id: string, step_order: number }>} steps
 */
export async function reorderSteps(steps) {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return { error: 'You must be signed in.' }
  }

  if (!Array.isArray(steps) || steps.length === 0) {
    return { ok: true }
  }

  const projectId = await resolveProjectIdFromStepId(supabase, steps[0].id)

  const results = await Promise.all(
    steps.map(({ id, step_order }) =>
      supabase.from('steps').update({ step_order }).eq('id', id),
    ),
  )

  const failed = results.find((r) => r.error)
  if (failed?.error) {
    return { error: formatDbError(failed.error) }
  }

  revalidateProjectPage(projectId)
  return { ok: true }
}

export async function toggleTourActive(tourId, isActive) {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return { error: 'You must be signed in.' }
  }

  const active = Boolean(isActive)

  const { error } = await supabase.from('tours').update({ is_active: active }).eq('id', tourId)

  if (error) {
    return { error: formatDbError(error) }
  }

  const projectId = await resolveProjectIdFromTourId(supabase, tourId)
  revalidateProjectPage(projectId)

  return { ok: true }
}

function isValidHexColor(value) {
  return /^#[0-9a-fA-F]{6}$/.test(String(value || '').trim())
}

export async function updateTourCustomization(tourId, data) {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return { ok: false, error: 'You must be signed in.' }
  }

  const primaryColor = String(data?.primary_color ?? '').trim()
  const fontFamily = String(data?.font_family ?? '').trim()
  const borderRadius = String(data?.border_radius ?? '').trim()
  const theme = String(data?.theme ?? '').trim().toLowerCase()
  const templateId = String(data?.template_id ?? 'default').trim() || 'default'

  if (!isValidHexColor(primaryColor)) {
    return { ok: false, error: 'Primary color must be a valid hex color like #F15025.' }
  }
  if (!TOUR_FONTS.has(fontFamily)) {
    return { ok: false, error: 'Invalid font family selected.' }
  }
  if (!TOUR_RADII.has(borderRadius)) {
    return { ok: false, error: 'Invalid border radius selected.' }
  }
  if (!TOUR_THEMES.has(theme)) {
    return { ok: false, error: 'Invalid theme selected.' }
  }

  const { error } = await supabase
    .from('tours')
    .update({
      primary_color: primaryColor,
      font_family: fontFamily,
      border_radius: borderRadius,
      theme,
      template_id: templateId,
    })
    .eq('id', tourId)

  if (error) {
    const msg = String(error?.message ?? '')
    const lower = msg.toLowerCase()
    const missingCustomizationColumns =
      lower.includes('column') &&
      (
        lower.includes('primary_color') ||
        lower.includes('font_family') ||
        lower.includes('border_radius') ||
        lower.includes('theme') ||
        lower.includes('template_id')
      )

    if (missingCustomizationColumns) {
      return {
        ok: false,
        error:
          'Customization columns are missing in your Supabase `tours` table. Run this in SQL Editor:\n' +
          "alter table tours add column if not exists primary_color text default '#F15025', " +
          "add column if not exists font_family text default 'Inter', " +
          "add column if not exists border_radius text default '10px', " +
          "add column if not exists theme text default 'dark', " +
          "add column if not exists template_id text default 'default';",
      }
    }

    return { ok: false, error: msg || formatDbError(error) }
  }

  const projectId = await resolveProjectIdFromTourId(supabase, tourId)
  revalidateProjectPage(projectId)
  return { ok: true }
}
