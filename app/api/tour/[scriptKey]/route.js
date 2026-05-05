import { NextResponse } from 'next/server'

import { createAdminClient } from '@/lib/supabase/admin'

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders() })
}

export async function GET(_request, { params }) {
  const supabase = createAdminClient()
  const { scriptKey } = await params

  const { data: project, error: projectError } = await supabase
    .from('projects')
    .select('id, is_active')
    .eq('script_key', scriptKey)
    .maybeSingle()

  if (projectError) {
    return NextResponse.json({ error: projectError.message }, { status: 500, headers: corsHeaders() })
  }

  if (!project || !project.is_active) {
    return NextResponse.json({ error: 'Not found' }, { status: 404, headers: corsHeaders() })
  }

  const { data: tour, error: tourError } = await supabase
    .from('tours')
    .select('id, name, is_active')
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
      { projectId: project.id, is_active: true, tour: null, steps: [] },
      { status: 200, headers: corsHeaders() }
    )
  }

  const { data: steps, error: stepsError } = await supabase
    .from('steps')
    .select('id, selector, title, message, position, step_order')
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
    },
    { status: 200, headers: corsHeaders() }
  )
}

