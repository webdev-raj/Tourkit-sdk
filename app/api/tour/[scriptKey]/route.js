import { NextResponse } from 'next/server'

import { LATEST_SDK_VERSION } from '@/lib/sdk-version'
import { createAdminClient } from '@/lib/supabase/admin'

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-TourKit-Version',
    'Access-Control-Max-Age': '86400',
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders() })
}

async function resolveUserPlan(supabase, userId) {
  if (!userId) return 'free'

  const { data: userPlan } = await supabase
    .from('user_plans')
    .select('plan')
    .eq('user_id', userId)
    .maybeSingle()

  return userPlan?.plan || 'free'
}

function isPaidPlan(plan) {
  return plan === 'starter' || plan === 'pro'
}

function isAnnouncementLive(row, nowMs) {
  try {
    if (!row || row.is_active !== true) return false
    if (row.start_date) {
      const start = new Date(row.start_date).getTime()
      if (Number.isFinite(start) && start > nowMs) return false
    }
    if (row.end_date) {
      const end = new Date(row.end_date).getTime()
      if (Number.isFinite(end) && end < nowMs) return false
    }
    return true
  } catch (_) {
    return false
  }
}

async function fetchLiveAnnouncements(supabase, projectId) {
  try {
    const { data, error } = await supabase
      .from('announcements')
      .select('id, title, description, cta_text, cta_url, image_url, frequency, start_date, end_date, is_active')
      .eq('project_id', projectId)
      .eq('is_active', true)
      .order('created_at', { ascending: true })

    if (error || !Array.isArray(data)) return []

    const nowMs = Date.now()
    return data
      .filter((row) => isAnnouncementLive(row, nowMs))
      .map((row) => ({
        id: row.id,
        title: row.title,
        description: row.description,
        cta_text: row.cta_text,
        cta_url: row.cta_url,
        image_url: row.image_url,
        frequency: row.frequency || 'until_dismissed',
      }))
  } catch (_) {
    return []
  }
}

export async function GET(request, { params }) {
  const supabase = createAdminClient()
  const { scriptKey } = await params
  const sdkVersion = request.headers.get('x-tourkit-version')

  const { data: project, error: projectError } = await supabase
    .from('projects')
    .select('id, is_active, user_id')
    .eq('script_key', scriptKey)
    .maybeSingle()

  if (projectError) {
    return NextResponse.json({ error: projectError.message }, { status: 500, headers: corsHeaders() })
  }

  if (!project || !project.is_active) {
    return NextResponse.json({ error: 'Not found' }, { status: 404, headers: corsHeaders() })
  }

  if (sdkVersion && typeof sdkVersion === 'string' && sdkVersion.length < 20) {
    try {
      await supabase
        .from('projects')
        .update({
          detected_sdk_version: sdkVersion,
          sdk_last_seen: new Date().toISOString(),
        })
        .eq('script_key', scriptKey)
    } catch (e) {
      // Fail silently — don't break tour fetch
    }
  }

  const plan = await resolveUserPlan(supabase, project.user_id)
  const showBranding = plan === 'free'
  const announcements = isPaidPlan(plan) ? await fetchLiveAnnouncements(supabase, project.id) : null
  const apiBase = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

  const { data: tour, error: tourError } = await supabase
    .from('tours')
    .select('id, name, is_active, primary_color, font_family, border_radius, theme')
    .eq('project_id', project.id)
    .eq('is_active', true)
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle()

  if (tourError) {
    return NextResponse.json({ error: tourError.message }, { status: 500, headers: corsHeaders() })
  }

  if (!tour) {
    const payload = {
      projectId: project.id,
      is_active: true,
      tour: null,
      steps: [],
      api_base: apiBase,
      show_branding: showBranding,
      customization: {
        primary_color: '#F15025',
        font_family: 'Inter',
        border_radius: '10px',
        theme: 'dark',
      },
      latest_version: LATEST_SDK_VERSION,
    }
    if (announcements) payload.announcements = announcements
    return NextResponse.json(payload, { status: 200, headers: corsHeaders() })
  }

  const { data: steps, error: stepsError } = await supabase
    .from('steps')
    .select('id, selector, title, message, position, step_order, url_pattern')
    .eq('tour_id', tour.id)
    .order('step_order', { ascending: true })

  if (stepsError) {
    return NextResponse.json({ error: stepsError.message }, { status: 500, headers: corsHeaders() })
  }

  const payload = {
    projectId: project.id,
    is_active: true,
    tour: { id: tour.id, name: tour.name, is_active: tour.is_active },
    steps: steps ?? [],
    api_base: apiBase,
    show_branding: showBranding,
    customization: {
      primary_color: tour.primary_color || '#F15025',
      font_family: tour.font_family || 'Inter',
      border_radius: tour.border_radius || '10px',
      theme: tour.theme || 'dark',
    },
    latest_version: LATEST_SDK_VERSION,
  }
  if (announcements) payload.announcements = announcements
  return NextResponse.json(payload, { status: 200, headers: corsHeaders() })
}

