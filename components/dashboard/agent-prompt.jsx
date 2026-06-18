'use client'

import { useState } from 'react'
import { Copy, Check, Bot } from 'lucide-react'

const AGENT_PROMPT = `You are helping set up an onboarding tour for TourKit.

Analyze this codebase and complete these steps:

## STEP 1 — Find key UI elements
Identify the 5-7 most important elements 
that new users need to understand:
- Main navigation/sidebar
- Primary action buttons (create, add, new)
- Key dashboard sections
- Important forms or inputs
- Settings or profile areas

## STEP 2 — Add data-tourkit attributes
For each important element, add this attribute:
data-tourkit="descriptive-name"

Examples:
<nav data-tourkit="main-navigation">
<button data-tourkit="create-project-btn">
<div data-tourkit="analytics-section">

Naming rules:
- Use kebab-case only
- Be descriptive and specific
- Must be unique across the whole app
- Keep it short (2-4 words max)

## STEP 3 — Decide tour type

IF app has multiple important pages 
(dashboard, settings, projects, etc):
→ Context-aware mode
→ Each step gets url_pattern matching its page

IF app is mostly single page:
→ Linear mode  
→ All url_pattern values = null

## STEP 4 — Generate tour.json

Create a file called tour.json:

[
  {
    "title": "Short title (3-5 words)",
    "description": "Helpful message for new users. Keep it friendly and clear. Max 2 sentences.",
    "selector": "[data-tourkit='your-name']",
    "position": "bottom",
    "url_pattern": "/dashboard" 
  }
]

Position options:
- "bottom" → tooltip below element (default)
- "top" → tooltip above element
- "left" → tooltip left of element  
- "right" → tooltip right of element

URL pattern rules:
- Exact path: "/dashboard"
- Dynamic segment: "/dashboard/projects/[id]"
- Wildcard: "/dashboard/*"
- All pages: null

## STEP 5 — Output
1. List every file you modified with line changes
2. Output the complete tour.json content
3. Confirm all data-tourkit attributes added

The developer will drag tour.json into 
TourKit dashboard to create the tour instantly.`

export default function AgentPrompt({ isPro }) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(AGENT_PROMPT)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (_) {
      const el = document.createElement('textarea')
      el.value = AGENT_PROMPT
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (!isPro) {
    return (
      <div
        style={{
          border: '1px dashed rgba(255,255,255,0.08)',
          borderRadius: '10px',
          padding: '16px',
          opacity: 0.5,
        }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
          <Bot size={14} color="#666" />
          <span style={{ color: '#666', fontSize: '12px', fontWeight: '500' }}>AI Agent prompt — Pro only</span>
        </div>
        <p style={{ color: '#444', fontSize: '11px', margin: 0, lineHeight: '1.5' }}>
          Copy a prompt for Cursor, Claude or Copilot to auto-generate your tour.
        </p>
      </div>
    )
  }

  return (
    <div
      style={{
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '10px',
        padding: '14px',
        background: 'rgba(255,255,255,0.02)',
      }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '8px',
        }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Bot size={14} color="#F15025" />
          <span style={{ color: '#fff', fontSize: '12px', fontWeight: '600' }}>AI Agent prompt</span>
          <span
            style={{
              fontSize: '9px',
              background: '#F15025',
              color: '#fff',
              padding: '1px 5px',
              borderRadius: '3px',
              fontWeight: '600',
            }}>
            PRO
          </span>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            background: copied ? 'rgba(34,197,94,0.15)' : 'rgba(255,255,255,0.06)',
            border: `1px solid ${copied ? 'rgba(34,197,94,0.3)' : 'rgba(255,255,255,0.1)'}`,
            borderRadius: '6px',
            padding: '4px 10px',
            color: copied ? '#22c55e' : '#ccc',
            fontSize: '11px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            fontFamily: 'inherit',
          }}>
          {copied ? (
            <>
              <Check size={11} /> Copied!
            </>
          ) : (
            <>
              <Copy size={11} /> Copy prompt
            </>
          )}
        </button>
      </div>

      <p style={{ color: '#666', fontSize: '11px', margin: '0 0 10px 0', lineHeight: '1.5' }}>
        Paste this into Cursor, Claude Code, or GitHub Copilot. Your AI agent will analyze your codebase, add{' '}
        <code
          style={{
            background: 'rgba(241,80,37,0.15)',
            color: '#F15025',
            padding: '0 4px',
            borderRadius: '3px',
            fontSize: '10px',
          }}>
          data-tourkit
        </code>{' '}
        attributes, and generate a tour.json file ready to drag and drop below.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {[
          '1. Copy prompt above',
          '2. Paste into your AI coding agent',
          '3. Agent analyzes codebase + adds attributes',
          '4. Drag the generated tour.json below',
        ].map((step, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '11px',
              color: '#555',
            }}>
            <div
              style={{
                width: '4px',
                height: '4px',
                borderRadius: '50%',
                background: '#333',
                flexShrink: 0,
              }}
            />
            {step}
          </div>
        ))}
      </div>
    </div>
  )
}
