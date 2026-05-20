'use server'

import { revalidatePath } from 'next/cache'

import { getUserPlan } from '@/app/actions/billing'
import { createClient } from '@/lib/supabase/server'

function formatProjectError(error) {
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

export async function createProject(prevState, formData) {
  const supabase = await createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    return { error: 'You must be signed in to create a project.' }
  }

  const name = String(formData.get('name') || '').trim()
  const domain = String(formData.get('domain') || '').trim()

  if (!name) return { error: 'Project name is required.' }
  if (!domain) return { error: 'Domain is required.' }

  const limits = {
    free: 1,
    starter: 3,
    pro: Infinity,
  }

  const { count, error: countError } = await supabase
    .from('projects')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', user.id)

  if (countError) return { error: formatProjectError(countError) }

  const { plan } = await getUserPlan()
  const limit = limits[plan] ?? 1
  const projectCount = Number(count ?? 0)

  if (projectCount >= limit) {
    return {
      ok: false,
      error:
        plan === 'free'
          ? 'Free plan is limited to 1 project. Upgrade to create more.'
          : 'You have reached your project limit. Upgrade to Pro for unlimited projects.',
    }
  }

  const { data: project, error: projectError } = await supabase
    .from('projects')
    .insert({ name, domain, user_id: user.id })
    .select('id, script_key')
    .single()

  if (projectError) return { error: formatProjectError(projectError) }

  const { error: tourError } = await supabase.from('tours').insert({
    project_id: project.id,
    name: 'Default Tour',
    is_active: true,
  })

  if (tourError) return { error: formatProjectError(tourError) }

  revalidatePath('/dashboard')
  return { ok: true, projectId: project.id }
}

export async function deleteProject(projectId) {
  const supabase = await createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    return { ok: false, error: 'Not found' }
  }

  const normalizedId = String(projectId || '').trim()
  if (!normalizedId) {
    return { ok: false, error: 'Not found' }
  }

  const { data: project } = await supabase
    .from('projects')
    .select('id, user_id')
    .eq('id', normalizedId)
    .maybeSingle()

  if (!project || project.user_id !== user.id) {
    return { ok: false, error: 'Not found' }
  }

  const { error } = await supabase.from('projects').delete().eq('id', normalizedId)
  if (error) {
    return { ok: false, error: error.message || 'Could not delete project.' }
  }

  revalidatePath('/dashboard')
  return { ok: true }
}

