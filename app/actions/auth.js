'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

/** Supabase surfaces raw API errors; translate common ones so users know what to do. */
function formatAuthUserMessage(error) {
  const code = error?.code ?? ''
  const msg = String(error?.message ?? '').toLowerCase()

  if (
    code === 'over_email_send_rate_limit' ||
    code === 'over_request_rate_limit' ||
    msg.includes('rate limit')
  ) {
    return (
      'Too many sign-in or sign-up attempts from this IP or email. Wait a few minutes and try again. ' +
      'For local testing, you can disable “Confirm email” in Supabase Dashboard → Authentication → Providers → Email ' +
      'so sign-up does not send confirmation mail (then this limit rarely triggers during dev).'
    )
  }

  return error?.message || 'Something went wrong. Try again.'
}

export async function signIn(prevState, formData) {
  const supabase = await createClient()

  const email = String(formData.get('email') || '').trim()
  const password = String(formData.get('password') || '')

  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) return { error: formatAuthUserMessage(error) }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signUp(prevState, formData) {
  const supabase = await createClient()

  const email = String(formData.get('email') || '').trim()
  const password = String(formData.get('password') || '')

  const { data, error } = await supabase.auth.signUp({ email, password })

  if (error) return { error: formatAuthUserMessage(error) }

  // If email confirmations are enabled, there may not be a session yet.
  if (!data.session) return { message: 'Check your email to confirm your account.' }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/auth')
}

