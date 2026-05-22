'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Check, ChevronRight, Pencil, Sparkles } from 'lucide-react'

import { createClient } from '@/lib/supabase/client'
import { encodeStepsForUrl } from '@/lib/tour-steps-encoding'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'

const STEP_OPTIONS = [3, 4, 5, 6, 7]

const fieldClass =
  'w-full rounded-lg border border-white/10 bg-[#111111] px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-[#F15025]/50 focus:ring-2 focus:ring-[#F15025]/20'

const selectClass =
  'w-full rounded-lg border border-white/10 bg-[#111111] px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-[#F15025]/50 focus:ring-2 focus:ring-[#F15025]/20'

export function TourGenerator() {
  const [phase, setPhase] = useState('input')
  const [description, setDescription] = useState('')
  const [websiteUrl, setWebsiteUrl] = useState('')
  const [numSteps, setNumSteps] = useState('5')
  const [tourType, setTourType] = useState('linear')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [steps, setSteps] = useState([])
  const [editingIndex, setEditingIndex] = useState(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    let cancelled = false
    async function checkAuth() {
      try {
        const supabase = createClient()
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (!cancelled) setIsLoggedIn(Boolean(user))
      } catch {
        if (!cancelled) setIsLoggedIn(false)
      }
    }
    checkAuth()
    return () => {
      cancelled = true
    }
  }, [])

  async function handleGenerate(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/generate-tour', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description,
          url: websiteUrl,
          numSteps: Number(numSteps),
          tourType,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data?.error || 'Could not generate tour steps. Please try again.')
        return
      }

      if (!Array.isArray(data.steps) || !data.steps.length) {
        setError('No steps were returned. Try a more detailed product description.')
        return
      }

      setSteps(data.steps)
      setEditingIndex(null)
      setPhase('result')
    } catch {
      setError('Network error. Check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  function handleStartOver() {
    setPhase('input')
    setSteps([])
    setError('')
    setEditingIndex(null)
  }

  function updateStepField(index, field, value) {
    setSteps((prev) =>
      prev.map((step, i) => (i === index ? { ...step, [field]: value } : step)),
    )
  }

  function buildImportHref() {
    const encoded = encodeStepsForUrl(steps)
    if (isLoggedIn) {
      return `/dashboard/import?steps=${encoded}`
    }
    const redirect = encodeURIComponent(`/dashboard/import?steps=${encoded}`)
    return `/auth?mode=signup&redirect=${redirect}`
  }

  const isContextAware = tourType === 'context-aware'

  return (
    <div className="relative min-h-dvh bg-[#070707] text-foreground">
      <div className="pointer-events-none absolute inset-0 tk-grid opacity-[0.25]" aria-hidden />
      <div className="pointer-events-none absolute inset-0 tk-glow-hero" aria-hidden />

      <header className="relative z-10 border-b border-white/10 bg-[#070707]/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 md:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <Link
              href="/"
              className="flex shrink-0 items-center gap-2 text-sm font-semibold tracking-tight hover:text-[#F15025]">
              <span
                className="inline-block size-2 rounded-full bg-[#F15025] shadow-[0_0_12px_color-mix(in_srgb,#F15025_55%,transparent)]"
                aria-hidden
              />
              TourKit
            </Link>
            <span className="text-muted-foreground/60">/</span>
            <span className="truncate text-sm text-muted-foreground">Tools</span>
          </div>
          <nav className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild className="text-muted-foreground hover:text-foreground">
              <Link href="/dashboard">Go to dashboard →</Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-2xl px-4 py-12 md:py-16">
        {phase === 'input' ? (
          <div className="flex flex-col gap-8">
            <div className="text-center">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-[#F15025]">
                PRO FEATURE ✦ POWERED BY CLAUDE AI
              </p>
              <h1 className="text-balance text-3xl font-bold tracking-tight text-white md:text-4xl">
                Generate your onboarding tour in seconds
              </h1>
              <p className="mx-auto mt-4 max-w-lg text-pretty text-sm leading-relaxed text-[#999999] md:text-base">
                Describe your product and AI will generate ready-to-use tour steps you can import directly into any of
                your projects.
              </p>
            </div>

            <form onSubmit={handleGenerate} className="flex flex-col gap-5 rounded-xl border border-white/10 bg-[#111111]/80 p-6 md:p-8">
              <div className="flex flex-col gap-2">
                <Label htmlFor="description">Describe your product</Label>
                <Textarea
                  id="description"
                  required
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="We build a project management tool for remote teams. Key features include task boards, time tracking, and team chat."
                  className={`${fieldClass} min-h-[120px] resize-y`}
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="websiteUrl">Website URL (optional)</Label>
                <Input
                  id="websiteUrl"
                  type="url"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  placeholder="https://yourwebsite.com"
                  className={fieldClass}
                />
                <p className="text-xs text-[#666666]">Used to make steps more specific to your site</p>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="numSteps">How many steps?</Label>
                <select
                  id="numSteps"
                  value={numSteps}
                  onChange={(e) => setNumSteps(e.target.value)}
                  className={selectClass}>
                  {STEP_OPTIONS.map((n) => (
                    <option key={n} value={String(n)}>
                      {n} steps
                    </option>
                  ))}
                </select>
              </div>

              <fieldset className="flex flex-col gap-3">
                <legend className="text-sm font-medium text-foreground">Tour type</legend>
                <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-white/10 bg-[#0a0a0a] p-3 has-[:checked]:border-[#F15025]/40">
                  <input
                    type="radio"
                    name="tourType"
                    value="linear"
                    checked={tourType === 'linear'}
                    onChange={() => setTourType('linear')}
                    className="mt-1 accent-[#F15025]"
                  />
                  <span>
                    <span className="block text-sm font-medium text-white">Linear tour</span>
                    <span className="text-xs text-[#888888]">Same steps on every page</span>
                  </span>
                </label>
                <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-white/10 bg-[#0a0a0a] p-3 has-[:checked]:border-[#F15025]/40">
                  <input
                    type="radio"
                    name="tourType"
                    value="context-aware"
                    checked={tourType === 'context-aware'}
                    onChange={() => setTourType('context-aware')}
                    className="mt-1 accent-[#F15025]"
                  />
                  <span>
                    <span className="block text-sm font-medium text-white">Context-aware</span>
                    <span className="text-xs text-[#888888]">Different steps per page</span>
                  </span>
                </label>
              </fieldset>

              {error ? (
                <Alert variant="destructive" className="border-red-500/30 bg-red-950/20">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              ) : null}

              <Button
                type="submit"
                disabled={loading}
                size="lg"
                className="h-12 w-full bg-[#F15025] text-base font-semibold hover:bg-[#F15025]/90">
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Sparkles className="size-4 animate-pulse" aria-hidden />
                    Generating your tour...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Generate tour steps
                    <ChevronRight className="size-4" aria-hidden />
                  </span>
                )}
              </Button>
            </form>
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            <div className="rounded-xl border border-[#22c55e]/30 bg-[#22c55e]/10 px-4 py-4 text-center">
              <p className="flex items-center justify-center gap-2 text-base font-semibold text-[#86efac]">
                <Check className="size-5 shrink-0" aria-hidden />
                Your tour steps are ready!
              </p>
              <p className="mt-1 text-sm text-[#888888]">
                {steps.length} steps generated. Review and import to TourKit.
              </p>
            </div>

            <ul className="flex list-none flex-col gap-4 p-0">
              {steps.map((step, index) => (
                <li
                  key={index}
                  className="rounded-xl border border-white/[0.08] bg-[#111111] p-5">
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <span className="rounded-full bg-[#F15025]/15 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-[#F15025]">
                      Step {index + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => setEditingIndex(editingIndex === index ? null : index)}
                      className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground"
                      aria-label={editingIndex === index ? 'Done editing' : 'Edit step'}>
                      <Pencil className="size-4" aria-hidden />
                    </button>
                  </div>

                  {editingIndex === index ? (
                    <div className="flex flex-col gap-3">
                      <Input
                        value={step.title || ''}
                        onChange={(e) => updateStepField(index, 'title', e.target.value)}
                        placeholder="Title"
                        className={fieldClass}
                      />
                      <Textarea
                        value={step.message || ''}
                        onChange={(e) => updateStepField(index, 'message', e.target.value)}
                        rows={3}
                        placeholder="Message"
                        className={`${fieldClass} resize-y`}
                      />
                    </div>
                  ) : (
                    <>
                      <h3 className="text-base font-semibold text-white">{step.title || `Step ${index + 1}`}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-[#888888]">{step.message}</p>
                    </>
                  )}

                  <p className="mt-3 font-mono text-xs text-[#F15025]">{step.selector}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="rounded-md border border-white/10 bg-[#0a0a0a] px-2 py-0.5 text-[10px] uppercase tracking-wide text-[#888888]">
                      {step.position || 'bottom'}
                    </span>
                    {isContextAware && step.url_pattern ? (
                      <span className="rounded-md border border-[#F15025]/30 bg-[#F15025]/10 px-2 py-0.5 font-mono text-[10px] text-[#F15025]">
                        {step.url_pattern}
                      </span>
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>

            <div className="flex flex-col gap-3">
              <Button size="lg" asChild className="h-12 w-full bg-[#F15025] hover:bg-[#F15025]/90">
                <Link href={buildImportHref()}>
                  Add these steps to TourKit
                  <ChevronRight className="ml-1 size-4" aria-hidden />
                </Link>
              </Button>
              <Button type="button" variant="outline" size="lg" className="w-full border-white/15" onClick={handleStartOver}>
                Start over
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
