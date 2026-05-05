'use server'

import { revalidatePath } from 'next/cache'

import { createClient } from '@/lib/supabase/server'

const POSITIONS = new Set(['top', 'bottom', 'left', 'right'])

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

  const { data: existing, error: fetchError } = await supabase
    .from('tours')
    .select('id, project_id, name, is_active, created_at')
    .eq('project_id', projectId)
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle()

  if (fetchError) {
    return { data: null, error: formatDbError(fetchError) }
  }

  if (existing) {
    return { data: existing, error: null }
  }

  const { data: inserted, error: insertError } = await supabase
    .from('tours')
    .insert({ project_id: projectId, name: 'Default Tour', is_active: true })
    .select('id, project_id, name, is_active, created_at')
    .single()

  if (insertError) {
    return { data: null, error: formatDbError(insertError) }
  }

  revalidateProjectPage(projectId)
  return { data: inserted, error: null }
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
    .select('id, tour_id, selector, title, message, position, step_order, created_at')
    .eq('tour_id', tourId)
    .order('step_order', { ascending: true })

  if (error) {
    return { data: [], error: formatDbError(error) }
  }

  return { data: steps ?? [], error: null }
}

/**
 * @param {string} tourId
 * @param {{ title?: string | null, message: string, selector: string, position?: string }} data
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
 * @param {{ title?: string | null, message: string, selector: string, position?: string }} data
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
