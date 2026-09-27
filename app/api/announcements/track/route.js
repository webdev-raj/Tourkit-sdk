import { NextResponse } from 'next/server'

import { createAdminClient } from '@/lib/supabase/admin'

const EVENT_TYPES = new Set(['view', 'click', 'dismiss'])

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

export async function POST(req) {
  try {
    let announcement_id = ''
    let event_type = ''
    let session_id = null
    try {
      ;({ announcement_id, event_type, session_id } = await req.json())
    } catch {
      /* fail silently */
    }

    const announcementId = typeof announcement_id === 'string' ? announcement_id.trim() : ''
    const eventType = typeof event_type === 'string' ? event_type.trim() : ''
    const sessionId = typeof session_id === 'string' && session_id.trim() ? session_id.trim() : null

    if (announcementId && EVENT_TYPES.has(eventType)) {
      try {
        const supabase = createAdminClient()
        const { data: announcement } = await supabase
          .from('announcements')
          .select('id, project_id')
          .eq('id', announcementId)
          .maybeSingle()

        if (announcement?.id && announcement?.project_id) {
          await supabase.from('announcement_events').insert({
            announcement_id: announcement.id,
            project_id: announcement.project_id,
            event_type: eventType,
            session_id: sessionId,
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
