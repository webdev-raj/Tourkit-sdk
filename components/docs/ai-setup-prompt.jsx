'use client'
import { useState } from 'react'
import { Bot, Copy, Check, Sparkles } from 'lucide-react'

const AI_SETUP_PROMPT = `You are setting up TourKit — a guided onboarding tour SDK — in this codebase.

## STEP 1 — Detect the stack

Look at package.json and the project structure to identify:
- Framework: Next.js (App Router or Pages Router), React (CRA/Vite), Vue, plain HTML, or WordPress
- Router in use (if any): next/navigation, react-router-dom, vue-router
- Package manager: npm, yarn, or pnpm

## STEP 2 — Read the official docs

Fetch and read this page for exact installation instructions:
https://tourkit-phi.vercel.app/docs

Also read the framework-specific install guide that matches what you detected in Step 1:
- Next.js: https://tourkit-phi.vercel.app/docs/installation/nextjs
- React: https://tourkit-phi.vercel.app/docs/installation/react
- Vue: https://tourkit-phi.vercel.app/docs/installation/vue
- Plain HTML: https://tourkit-phi.vercel.app/docs/installation/html
- WordPress: https://tourkit-phi.vercel.app/docs/installation/wordpress

## STEP 3 — Install the SDK script tag

Copy the exact script tag shown on the docs page you just read — do not construct or guess the src URL yourself, always use the one currently published in the docs, since it may change between SDK versions. Add it to the correct root file for the detected framework (layout.js for Next.js App Router, index.html for Vite/CRA, main.js for Vue, etc). Leave the data-key value as the placeholder shown in the docs — the user will fill it in with their own script key after signing up.

## STEP 4 — Add TourKitProvider (SPA frameworks only)

If the project uses client-side routing (Next.js, React Router, Vue Router), create a TourKitProvider component that calls window.TourKit.startFor(pathname) on every route change, using the correct hook for the detected router (usePathname for Next.js App Router, useLocation for React Router, useRoute for Vue Router) — follow the exact pattern shown in the framework-specific docs page. Mount it once near the root of the app. Skip this step entirely for plain HTML or WordPress.

## STEP 5 — Verify installation

Confirm the script tag is present in the correct root file and, if applicable, that TourKitProvider is mounted correctly. Double check the src URL matches exactly what was shown in the docs.

## STEP 6 — Output a summary

1. List every file you created or modified
2. Show the exact script tag that was added
3. Confirm TourKitProvider setup if applicable
4. Tell the user: "Sign up at https://tourkit-phi.vercel.app, create a project, and paste your script key into the data-key attribute above. Your TourKit dashboard is where you'll add and configure tour steps."`

export default function AiSetupPrompt() {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(AI_SETUP_PROMPT)
      setCopied(true)
      setTimeout(() => setCopied(false), 2200)
    } catch (e) {
      const el = document.createElement('textarea')
      el.value = AI_SETUP_PROMPT
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      setCopied(true)
      setTimeout(() => setCopied(false), 2200)
    }
  }

  return (
    <div style={{
      border: '1px solid rgba(241,80,37,0.25)',
      borderRadius: '14px',
      padding: '20px',
      background: 'linear-gradient(180deg, rgba(241,80,37,0.06), rgba(241,80,37,0.02))',
      margin: '24px 0 20px 0'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '10px',
        flexWrap: 'wrap',
        gap: '10px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Bot size={18} color="#F15025" />
          <h3 style={{
            color: '#fff',
            fontSize: '16px',
            fontWeight: '600',
            margin: 0
          }}>
            Set up TourKit with your AI agent
          </h3>
          <span style={{
            display: 'flex',
            alignItems: 'center',
            gap: '3px',
            fontSize: '10px',
            background: 'rgba(241,80,37,0.15)',
            color: '#F15025',
            padding: '2px 7px',
            borderRadius: '5px',
            fontWeight: '600'
          }}>
            <Sparkles size={10} />
            RECOMMENDED
          </span>
        </div>

        <button
          onClick={handleCopy}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: copied ? 'rgba(34,197,94,0.15)' : '#F15025',
            border: copied ? '1px solid rgba(34,197,94,0.3)' : 'none',
            borderRadius: '8px',
            padding: '8px 14px',
            color: copied ? '#22c55e' : '#fff',
            fontSize: '11px',
            fontWeight: '600',
            cursor: 'pointer',
            fontFamily: 'inherit',
            transition: 'all 0.15s ease',
            whiteSpace: 'nowrap'
          }}
        >
          {copied
            ? <><Check size={11} /> Copied!</>
            : <><Copy size={11} /> Copy AI prompt</>
          }
        </button>
      </div>

      {/* Description */}
      <p style={{
        color: '#999',
        fontSize: '13.5px',
        lineHeight: '1.7',
        margin: '0 0 16px 0'
      }}>
        Skip the manual setup. Copy this prompt and paste it into
        Cursor, Antigravity, Claude Code, or GitHub Copilot. Your
        agent will detect your framework, read the official docs,
        and install the SDK correctly — script tag, routing
        provider, everything.
      </p>

      {/* How it works steps */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '6px'
      }}>
        {[
          'Copy the prompt above',
          'Paste it into your AI coding agent',
          'Agent detects your stack, reads the docs, and installs the SDK correctly',
          'Sign up, create a project, and add your script key'
        ].map((step, i) => (
          <div key={i} style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '8px',
            fontSize: '12.5px',
            color: '#666'
          }}>
            <span style={{
              color: '#F15025',
              fontWeight: '700',
              fontSize: '11px',
              minWidth: '14px'
            }}>
              {i + 1}.
            </span>
            {step}
          </div>
        ))}
      </div>
    </div>
  )
}
