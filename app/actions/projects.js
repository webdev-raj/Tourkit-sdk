'use server'

import { revalidatePath } from 'next/cache'

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
  return { ok: true }
}

