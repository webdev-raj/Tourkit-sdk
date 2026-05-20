import Link from 'next/link'
import { Check, ChevronRight, Lock, Sparkles } from 'lucide-react'

import { Button } from '@/components/ui/button'

const proFeatures = [
  'Generate up to 10 steps instantly',
  'Linear and context-aware tour support',
  'AI-optimized CSS selectors',
  'Import directly into any project',
  'Unlimited generations',
]

export function GeneratorUpgradeWall({ currentPlan = 'free' }) {
  const planLabel = currentPlan === 'starter' ? 'Starter' : currentPlan === 'free' ? 'Free' : 'your current'

  return (
    <div className="relative min-h-dvh bg-[#070707] text-foreground">
      <div className="pointer-events-none absolute inset-0 tk-grid opacity-[0.25]" aria-hidden />
      <div className="pointer-events-none absolute inset-0 tk-glow-hero" aria-hidden />

      <header className="relative z-10 border-b border-white/10 bg-[#070707]/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 md:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <Link
              href="/dashboard"
              className="flex shrink-0 items-center gap-2 text-sm font-semibold tracking-tight transition-colors hover:text-[#F15025]">
              <span
                className="inline-block size-2 rounded-full bg-[#F15025] shadow-[0_0_12px_color-mix(in_srgb,#F15025_55%,transparent)]"
                aria-hidden
              />
              TourKit
            </Link>
            <span className="text-muted-foreground/60">/</span>
            <span className="truncate text-sm text-muted-foreground">AI Generator</span>
          </div>
          <nav className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild className="text-muted-foreground hover:text-foreground">
              <Link href="/dashboard">Dashboard</Link>
            </Button>
            <Button size="sm" asChild className="bg-[#F15025] hover:bg-[#F15025]/90">
              <Link href="/pricing">View plans</Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="relative z-10 mx-auto flex max-w-lg flex-col items-center px-4 py-12 md:py-20">
        <div className="w-full rounded-xl border border-white/10 bg-[#111111]/90 p-6 shadow-[0_0_0_1px_color-mix(in_srgb,#F15025_12%,transparent),0_24px_48px_-24px_rgba(0,0,0,0.6)] backdrop-blur-sm md:p-8">
          <div className="mb-6 flex flex-col items-center text-center">
            <div className="mb-4 flex size-14 items-center justify-center rounded-2xl border border-[#F15025]/30 bg-[#F15025]/10">
              <Sparkles className="size-7 text-[#F15025]" aria-hidden />
            </div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#F15025]">
              PRO FEATURE ✦ AI GENERATOR
            </p>
            <h1 className="text-balance text-2xl font-bold tracking-tight text-white md:text-3xl">
              AI Tour Generator
            </h1>
            <p className="mt-3 max-w-md text-pretty text-sm leading-relaxed text-[#999999] md:text-base">
              Generate ready-to-use onboarding steps in seconds with Claude. Available on the Pro plan only.
            </p>
            <span className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-[#0a0a0a] px-3 py-1 text-xs text-[#888888]">
              <Lock className="size-3 shrink-0 text-[#F15025]" aria-hidden />
              You&apos;re on {planLabel} plan
            </span>
          </div>

          <ul className="mb-8 flex flex-col gap-2.5 border-t border-white/[0.06] pt-6">
            {proFeatures.map((feature) => (
              <li key={feature} className="flex items-start gap-3 text-sm text-[#888888]">
                <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-[#22c55e]/15">
                  <Check className="size-3 text-[#22c55e]" aria-hidden />
                </span>
                <span className="leading-relaxed">{feature}</span>
              </li>
            ))}
          </ul>

          <div className="flex flex-col gap-3">
            <Button size="lg" asChild className="h-12 w-full bg-[#F15025] text-base font-semibold hover:bg-[#F15025]/90">
              <Link href="/pricing">
                Upgrade to Pro
                <ChevronRight className="ml-1 size-4" aria-hidden />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild className="w-full border-white/15 bg-transparent hover:bg-white/5">
              <Link href="/dashboard">Back to dashboard</Link>
            </Button>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-[#555555]">
          Already upgraded?{' '}
          <Link href="/dashboard/settings" className="text-[#888888] underline-offset-4 transition-colors hover:text-[#F15025] hover:underline">
            Refresh your plan in settings
          </Link>
        </p>
      </main>
    </div>
  )
}
