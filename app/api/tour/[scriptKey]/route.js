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

async function resolveShowBranding(supabase, userId) {
  if (!userId) return true

  const { data: userPlan } = await supabase
    .from('user_plans')
    .select('plan')
    .eq('user_id', userId)
    .maybeSingle()

  const plan = userPlan?.plan || 'free'
  return plan === 'free'
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

  if (sdkVersion) {
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

  const showBranding = await resolveShowBranding(supabase, project.user_id)
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
    return NextResponse.json(
      {
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
      },
      { status: 200, headers: corsHeaders() }
    )
  }

  const { data: steps, error: stepsError } = await supabase
    .from('steps')
    .select('id, selector, title, message, position, step_order, url_pattern')
    .eq('tour_id', tour.id)
    .order('step_order', { ascending: true })

  if (stepsError) {
    return NextResponse.json({ error: stepsError.message }, { status: 500, headers: corsHeaders() })
  }

  return NextResponse.json(
    {
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
    },
    { status: 200, headers: corsHeaders() }
  )
}

