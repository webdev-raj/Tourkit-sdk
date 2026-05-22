import { NextResponse } from 'next/server'

import { getUserPlan } from '@/app/actions/billing'

const POSITIONS = new Set(['top', 'bottom', 'left', 'right'])

function getOpenRouterError(data, response) {
  if (data?.error) {
    const err = data.error
    return typeof err === 'string' ? err : err.message || 'AI service error'
  }

  const choice = data?.choices?.[0]
  if (choice?.error?.message) return choice.error.message
  if (choice?.finish_reason === 'error') {
    return choice.error?.message || 'AI model failed to complete the request.'
  }

  if (!response.ok) {
    return `AI service request failed (${response.status}).`
  }

  return null
}

function getAssistantContent(data) {
  const choice = data?.choices?.[0]
  if (!choice) return ''

  const content = choice.message?.content
  if (typeof content === 'string') return content
  if (Array.isArray(content)) {
    return content.map((part) => (typeof part === 'string' ? part : part?.text || '')).join('')
  }
  if (typeof choice.text === 'string') return choice.text

  return ''
}

function extractJsonArray(text) {
  const trimmed = String(text || '').trim()
  if (!trimmed) throw new Error('Empty response')

  try {
    const parsed = JSON.parse(trimmed)
    if (Array.isArray(parsed)) return parsed
  } catch {
    /* try fenced or embedded array */
  }

  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i)
  if (fenced?.[1]) {
    const parsed = JSON.parse(fenced[1].trim())
    if (Array.isArray(parsed)) return parsed
  }

  const arrayMatch = trimmed.match(/\[[\s\S]*\]/)
  if (arrayMatch) {
    const parsed = JSON.parse(arrayMatch[0])
    if (Array.isArray(parsed)) return parsed
  }

  throw new Error('Could not parse tour steps from AI response')
}

function normalizeStep(raw, tourType) {
  const title = String(raw?.title ?? '').trim()
  const message = String(raw?.message ?? '').trim()
  const selector = String(raw?.selector ?? '').trim()
  let position = String(raw?.position ?? 'bottom').toLowerCase()
  if (!POSITIONS.has(position)) position = 'bottom'

  let url_pattern = null
  if (tourType === 'context-aware') {
    const pattern = raw?.url_pattern != null ? String(raw.url_pattern).trim() : ''
    url_pattern = pattern || null
  }

  return { title, message, selector, position, url_pattern }
}

export async function POST(request) {
  try {
    const { plan } = await getUserPlan()
    if (plan !== 'pro') {
      return NextResponse.json({ error: 'Pro plan required to use AI generator' }, { status: 403 })
    }

    if (!process.env.OPENROUTER_API_KEY) {
      return NextResponse.json(
        { error: 'AI generation is not configured. Add OPENROUTER_API_KEY to your environment.' },
        { status: 503 },
      )
    }

    const body = await request.json()
    const description = String(body?.description ?? '').trim()
    const url = String(body?.url ?? '').trim()
    const numSteps = Number(body?.numSteps ?? 5)
    const tourType = body?.tourType === 'context-aware' ? 'context-aware' : 'linear'

    if (description.length < 10) {
      return NextResponse.json(
        { error: 'Please describe your product in at least 10 characters.' },
        { status: 400 },
      )
    }

    if (!Number.isFinite(numSteps) || numSteps < 3 || numSteps > 10) {
      return NextResponse.json({ error: 'Number of steps must be between 3 and 10.' }, { status: 400 })
    }

    const systemPrompt = `You are an expert UX designer specializing in product onboarding tours.
Generate tour steps for a web application.

Each step must have:
- title: Short, clear title (3-5 words max)
- message: Helpful description (1-2 sentences max, friendly and encouraging tone)
- selector: CSS selector for the element to highlight (use common patterns like nav, #hero, .cta-button, header, main, footer, .dashboard, #sidebar, etc)
- position: top, bottom, left, or right
- url_pattern: null for linear tours, or path like /dashboard for context-aware tours

Return ONLY a valid JSON array. No explanation. No markdown. No code blocks. Just the JSON array.

Example format:
[
  {
    "title": "Welcome aboard",
    "message": "This is your main dashboard where you can manage everything.",
    "selector": ".dashboard-header",
    "position": "bottom",
    "url_pattern": null
  }
]`

    const userPrompt = `Generate ${numSteps} onboarding tour steps for this product:

Product description: ${description}
${url ? `Website URL: ${url}` : ''}
Tour type: ${tourType}

${
  tourType === 'context-aware'
    ? 'For context-aware tours, assign each step a url_pattern like /dashboard, /projects, /settings'
    : 'For linear tours, set url_pattern to null for all steps'
}

Return only the JSON array.`

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://tourkit-phi.vercel.app',
        'X-Title': 'TourKit',
      },
      body: JSON.stringify({
        model: 'openai/gpt-oss-20b:free',
        messages: [
          {
            role: 'system',
            content: systemPrompt,
          },
          {
            role: 'user',
            content: userPrompt,
          },
        ],
        max_tokens: 1500,
      }),
    })

    let data
    try {
      data = await response.json()
    } catch {
      return NextResponse.json({ error: 'Invalid response from AI service.' }, { status: 502 })
    }

    const apiError = getOpenRouterError(data, response)
    if (apiError) {
      console.error('generate-tour: OpenRouter', apiError)
      const status =
        response.status === 429 ? 429 : response.status >= 400 && response.status < 600 ? response.status : 502
      return NextResponse.json({ error: apiError }, { status })
    }

    const content = getAssistantContent(data)
    if (!content.trim()) {
      console.error('generate-tour: empty output', JSON.stringify(data).slice(0, 500))
      return NextResponse.json(
        { error: 'The AI model returned an empty response. Please try again.' },
        { status: 502 },
      )
    }

    const parsed = extractJsonArray(content)

    const steps = parsed
      .map((step) => normalizeStep(step, tourType))
      .filter((step) => step.message && step.selector)

    if (!steps.length) {
      return NextResponse.json(
        { error: 'AI returned no valid steps. Please try again with a clearer description.' },
        { status: 422 },
      )
    }

    return NextResponse.json({ steps })
  } catch (err) {
    console.error('generate-tour:', err)
    const msg = err?.message || 'Something went wrong generating your tour.'
    return NextResponse.json(
      { error: msg.includes('parse') ? 'Could not read the AI response. Please try again.' : msg },
      { status: 500 },
    )
  }
}
