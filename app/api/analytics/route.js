import { NextResponse } from 'next/server'

import { createAdminClient } from '@/lib/supabase/admin'

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders() })
}

export async function POST(request) {
  try {
    let body = {}
    try {
      body = await request.json()
    } catch {
      body = {}
    }

    const scriptKey = typeof body.script_key === 'string' ? body.script_key.trim() : ''
    const eventType = typeof body.event_type === 'string' ? body.event_type.trim() : ''
    const rawOrder = body.step_order
    const stepOrder =
      rawOrder === null || rawOrder === undefined || rawOrder === ''
        ? null
        : Number.isFinite(Number(rawOrder))
          ? Number(rawOrder)
          : null

    if (scriptKey && eventType) {
      try {
        const supabase = createAdminClient()
        const { data: project } = await supabase
          .from('projects')
          .select('id')
          .eq('script_key', scriptKey)
          .maybeSingle()

        if (project?.id) {
          await supabase.from('analytics_events').insert({
            project_id: project.id,
            event_type: eventType,
            step_order: stepOrder,
            session_id: null,
          })
        }
      } catch {
        /* fail silently */
      }
    }
  } catch {
    /* fail silently */
  }

  return NextResponse.json({ ok: true }, { status: 200, headers: corsHeaders() })
}
