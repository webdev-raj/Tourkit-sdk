import Link from 'next/link'
import Script from 'next/script'
import { Poppins } from 'next/font/google'

import ReplayButton from '@/components/demo/replay-button'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
})

export async function generateMetadata() {
  return {
    title: 'TourKit Live Demo',
    description: 'Test your onboarding tour on a sandbox page',
  }
}

export default async function DemoPage({ params }) {
  const { scriptKey } = await params

  return (
    <div className={`${poppins.className} min-h-screen bg-[#060606] text-white antialiased [letter-spacing:-0.04em]`}>
      <div className="fixed inset-x-0 top-0 z-[999] h-12 border-b border-[#1a1a1a] bg-[#0a0a0a]">
        <div className="mx-auto flex h-full w-full max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2.5">
            <div className="h-2.5 w-2.5 rounded-full bg-[#F15025]" />
            <span className="text-sm font-bold text-white">TourKit</span>
            <span className="rounded-full border border-[#F15025]/50 bg-[#F15025]/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#F15025]">
              Live Demo
            </span>
          </div>
          <p className="hidden text-xs text-gray-400 md:block">
            This is a sandbox page to test your tour configuration
          </p>
          <div className="flex items-center gap-2">
            <ReplayButton scriptKey={scriptKey} />
            <Link
              href="/dashboard"
              className="inline-flex h-8 items-center rounded-md bg-[#F15025] px-3 text-xs font-semibold text-white transition hover:brightness-110">
              Open dashboard
            </Link>
          </div>
        </div>
      </div>

      <div className="relative isolate pt-12">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(241,80,37,0.18),transparent_45%),radial-gradient(circle_at_85%_0%,rgba(241,80,37,0.09),transparent_35%)]" />

        <header className="relative z-10 border-b border-white/10 bg-black/50 backdrop-blur">
          <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="h-3 w-3 rounded-full bg-[#F15025]" />
              <p className="text-sm font-semibold tracking-wide text-white">TourKit SDK Sandbox</p>
            </div>
            <div className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-gray-300">
              Test page
            </div>
          </div>
        </header>

        <main className="relative z-10 mx-auto grid w-full max-w-6xl gap-8 px-6 py-10 lg:grid-cols-[1.5fr_1fr]">
          <section
            id="hero"
            className="rounded-2xl border border-white/10 bg-[#111111]/90 p-8 shadow-2xl shadow-black/40">
            <p className="mb-3 inline-flex rounded-full border border-[#F15025]/40 bg-[#F15025]/10 px-3 py-1 text-xs font-medium text-[#F15025]">
              Primary demo surface
            </p>
            <h1 className="text-4xl font-semibold leading-tight text-white md:text-5xl">
              Test your tour on realistic UI targets
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-gray-300">
              This page is intentionally structured for TourKit QA. Use the stable selectors below in your dashboard
              to validate tooltip position, flow, and analytics events.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button
                type="button"
                className="cta-primary rounded-xl bg-[#F15025] px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-110">
                Get Started
              </button>
              <button
                type="button"
                className="rounded-xl border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-medium text-gray-200 transition hover:bg-white/10">
                Secondary Action
              </button>
            </div>
          </section>

          <aside className="rounded-2xl border border-white/10 bg-[#101010] p-6">
            <h2 className="text-lg font-semibold text-white">Selector Targets</h2>
            <p className="mt-2 text-xs text-gray-400">Copy any selector into step editor.</p>
            <div className="mt-5 flex flex-col gap-2">
              <code className="rounded-md border border-white/10 bg-black/40 px-3 py-2 text-xs text-[#F15025]">
                nav
              </code>
              <code className="rounded-md border border-white/10 bg-black/40 px-3 py-2 text-xs text-[#F15025]">
                #hero
              </code>
              <code className="rounded-md border border-white/10 bg-black/40 px-3 py-2 text-xs text-[#F15025]">
                .cta-primary
              </code>
              <code className="rounded-md border border-white/10 bg-black/40 px-3 py-2 text-xs text-[#F15025]">
                #features
              </code>
              <code className="rounded-md border border-white/10 bg-black/40 px-3 py-2 text-xs text-[#F15025]">
                #pricing
              </code>
              <code className="rounded-md border border-white/10 bg-black/40 px-3 py-2 text-xs text-[#F15025]">
                footer
              </code>
            </div>
          </aside>

          <section id="features" className="rounded-2xl border border-white/10 bg-[#111111]/85 p-6 lg:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-white">Feature Grid</h3>
              <span className="text-xs text-gray-500">Good for step-by-step highlighting</span>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <article className="rounded-xl border border-white/10 bg-black/30 p-4">
                <h4 className="text-sm font-medium text-white">Auto-detect elements</h4>
                <p className="mt-2 text-xs text-gray-400">Falls back gracefully if selectors are missing.</p>
              </article>
              <article className="rounded-xl border border-white/10 bg-black/30 p-4">
                <h4 className="text-sm font-medium text-white">Theme-safe tooltip</h4>
                <p className="mt-2 text-xs text-gray-400">Supports dark/light theme customization.</p>
              </article>
              <article className="rounded-xl border border-white/10 bg-black/30 p-4">
                <h4 className="text-sm font-medium text-white">Analytics tracking</h4>
                <p className="mt-2 text-xs text-gray-400">Captures starts, completions, skips, and step views.</p>
              </article>
            </div>
          </section>

          <section id="pricing" className="rounded-2xl border border-white/10 bg-[#111111]/85 p-6 lg:col-span-2">
            <h3 className="text-xl font-semibold text-white">Pricing CTA Area</h3>
            <p className="mt-2 text-sm text-gray-300">Another useful area to test bottom and right tooltip positions.</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <button
                type="button"
                className="rounded-lg border border-white/15 bg-white/5 px-4 py-2 text-sm text-gray-200 hover:bg-white/10">
                View Plans
              </button>
              <button
                type="button"
                className="rounded-lg bg-[#F15025] px-4 py-2 text-sm font-medium text-white hover:brightness-110">
                Start Free Trial
              </button>
            </div>
          </section>
        </main>

        <footer className="relative z-10 border-t border-white/10 bg-black/40">
          <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4 text-xs text-gray-500">
            <span>TourKit test footer</span>
            <span>Use this as a final step target</span>
          </div>
        </footer>
      </div>

      <Script
        src="https://cdn.jsdelivr.net/gh/webdev-raj/Tourkit@main/sdk/dist/tourkit.min.js?v=3"
        data-key={scriptKey}
        data-api={process.env.NEXT_PUBLIC_APP_URL}
        data-demo="true"
        strategy="afterInteractive"
      />
    </div>
  )
}
