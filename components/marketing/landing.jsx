import Link from "next/link"
import {
  ArrowRightIcon,
  BarChart3Icon,
  Code2Icon,
  LayersIcon,
  MapPinIcon,
  SparklesIcon,
  ZapIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"

const CDN_SNIPPET = `<script src="https://cdn.jsdelivr.net/gh/webdev-raj/Tourkit@sdk-v14/sdk/dist/tourkit.min.js"
  data-key="YOUR_SCRIPT_KEY"
  data-api="https://your-app.com"
  async></script>`

const stats = [
  { value: "1", label: "script tag to ship" },
  { value: "<5min", label: "to first live tour" },
  { value: "∞", label: "sites & frameworks" },
]

const bento = [
  {
    title: "Context-aware tours",
    description: "Trigger steps by URL — exact paths, dynamic segments like /projects/[id], or wildcards.",
    icon: MapPinIcon,
    className: "md:col-span-2 md:row-span-1",
    accent: true,
  },
  {
    title: "Dark glass tooltips",
    description: "Premium frosted UI that feels native on SaaS dashboards, marketing sites, and SPAs.",
    icon: LayersIcon,
    className: "md:col-span-1",
  },
  {
    title: "One script embed",
    description: "Vanilla JS SDK via CDN. React, Next.js, Vue, WordPress — no framework lock-in.",
    icon: Code2Icon,
    className: "md:col-span-1",
  },
  {
    title: "Hosted config API",
    description: "Publish steps from the dashboard; your site fetches JSON from /api/tour/[scriptKey].",
    icon: ZapIcon,
    className: "md:col-span-1",
  },
  {
    title: "Step analytics",
    description: "Completion rates, drop-off per step, and session tracking — built into every project.",
    icon: BarChart3Icon,
    className: "md:col-span-1",
  },
  {
    title: "AI-assisted authoring",
    description: "Generate tour copy from your product context, then refine selectors in the editor.",
    icon: SparklesIcon,
    className: "md:col-span-2",
  },
]

const steps = [
  {
    n: "01",
    title: "Create a project",
    body: "Sign up, name your product, and copy your script key from the dashboard.",
  },
  {
    n: "02",
    title: "Define your steps",
    body: "Pick CSS selectors, set trigger URLs per page, and customize tooltip theme.",
  },
  {
    n: "03",
    title: "Embed & go live",
    body: "Add the script tag. TourKit runs on route changes with TourKitProvider for SPAs.",
  },
]

function LandingNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-background/70 backdrop-blur-xl backdrop-saturate-150">
      <div className="mx-auto flex h-[4.25rem] max-w-6xl items-center justify-between gap-4 px-4 md:px-6">
        <Link
          href="/"
          className="group flex items-center gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background">
          <span
            className="relative flex size-8 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.04]"
            aria-hidden>
            <span className="size-2 rounded-full bg-primary shadow-[0_0_12px_color-mix(in_srgb,var(--primary)_60%,transparent)]" />
          </span>
          <span className="flex flex-col leading-none">
            <span className="text-sm font-semibold tracking-tight text-foreground">TourKit</span>
            <span className="text-[10px] font-medium text-muted-foreground transition-colors group-hover:text-foreground/80">
              Product tours, shipped.
            </span>
          </span>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2" aria-label="Marketing">
          <Button variant="ghost" size="sm" className="hidden text-muted-foreground hover:text-foreground sm:inline-flex" asChild>
            <Link href="/docs">Docs</Link>
          </Button>
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground" asChild>
            <Link href="/pricing">Pricing</Link>
          </Button>
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground" asChild>
            <Link href="/auth">Sign in</Link>
          </Button>
          <Button size="sm" className="shadow-[0_0_20px_color-mix(in_srgb,var(--primary)_25%,transparent)]" asChild>
            <Link href="/auth?mode=signup">Get started</Link>
          </Button>
        </nav>
      </div>
    </header>
  )
}

function HeroVisual() {
  return (
    <div className="tk-landing-rise tk-landing-rise-delay-3 relative mx-auto w-full max-w-lg lg:max-w-none">
      <div
        className="pointer-events-none absolute -inset-6 rounded-[2rem] bg-primary/20 blur-3xl tk-landing-pulse-glow"
        aria-hidden
      />

      <div className="tk-landing-glass tk-landing-glow-ring relative overflow-hidden rounded-2xl">
        <div className="flex items-center gap-2 border-b border-white/[0.06] px-4 py-3">
          <span className="size-2.5 rounded-full bg-red-500/80" aria-hidden />
          <span className="size-2.5 rounded-full bg-amber-400/80" aria-hidden />
          <span className="size-2.5 rounded-full bg-emerald-500/80" aria-hidden />
          <span className="ml-2 truncate font-mono text-[10px] text-muted-foreground">your-app.com/dashboard</span>
        </div>

        <div className="relative aspect-[4/3] bg-[#0a0a0a] p-5">
          <div className="absolute inset-0 tk-grid opacity-[0.2]" aria-hidden />

          <div className="relative flex h-full gap-3">
            <div className="hidden w-14 shrink-0 flex-col gap-2 rounded-lg border border-white/[0.06] bg-white/[0.02] p-2 sm:flex">
              <div className="h-6 rounded bg-white/[0.06]" />
              <div className="h-6 rounded bg-primary/30" />
              <div className="h-6 rounded bg-white/[0.04]" />
              <div className="mt-auto h-6 rounded bg-white/[0.04]" />
            </div>

            <div className="relative min-w-0 flex-1 rounded-lg border border-white/[0.06] bg-white/[0.02] p-4">
              <div className="mb-4 h-3 w-24 rounded bg-white/[0.08]" />
              <div className="mb-2 h-2 w-full max-w-[12rem] rounded bg-white/[0.05]" />
              <div className="h-2 w-2/3 max-w-[8rem] rounded bg-white/[0.04]" />

              <div
                className="relative z-10 mt-8 inline-flex rounded-lg border-2 border-primary bg-primary/10 px-3 py-2"
                style={{ boxShadow: "0 0 0 3px color-mix(in srgb, var(--primary) 35%, transparent)" }}>
                <span className="text-[10px] font-medium text-primary">Activate tour</span>
              </div>

              <div
                className="absolute bottom-4 left-4 right-4 z-20 rounded-2xl border border-white/[0.06] p-4 shadow-[0_16px_48px_rgba(0,0,0,0.5)] sm:left-auto sm:right-4 sm:w-[220px]"
                style={{
                  background: "rgba(10,10,10,0.92)",
                  backdropFilter: "blur(20px) saturate(180%)",
                  WebkitBackdropFilter: "blur(20px) saturate(180%)",
                }}>
                <div className="mb-3 flex gap-1">
                  <span className="h-1 w-[18px] rounded-full bg-primary shadow-[0_0_8px_var(--primary)]" />
                  <span className="size-1 rounded-full bg-white/15" />
                  <span className="size-1 rounded-full bg-white/15" />
                </div>
                <p className="text-[11px] font-semibold tracking-tight text-white/95">Activate your tour</p>
                <p className="mt-1 text-[10px] leading-relaxed text-white/45">Toggle live mode when your steps are ready.</p>
                <div className="mt-3 flex justify-end gap-1.5 border-t border-white/[0.05] pt-3">
                  <span className="rounded-md bg-white/[0.04] px-2 py-1 text-[9px] text-white/50">Skip</span>
                  <span className="rounded-md bg-primary px-2.5 py-1 text-[9px] font-semibold text-white">Next →</span>
                </div>
              </div>
            </div>
          </div>
          <div className="h-full top-0 left-0 w-full bg-black/40 z-[4] absolute"></div>
          <div
            className="pointer-events-none absolute z-[5] rounded-lg border-2 border-primary max-md:hidden"
            style={{ top: "32%", left: "21%", width: "5rem", height: "2.25rem"}}
            aria-hidden
          />
        </div>
      </div>
    </div>
  )
}

function BentoCard({ title, description, icon: Icon, className, accent }) {
  return (
    <article
      className={[
        "group tk-landing-glass flex flex-col gap-4 rounded-2xl p-6 transition-[border-color,transform] duration-200 hover:-translate-y-0.5",
        accent ? "border-primary/20 hover:border-primary/35" : "hover:border-white/[0.12]",
        className,
      ].join(" ")}>
      <div
        className={[
          "flex size-10 items-center justify-center rounded-xl border transition-colors",
          accent
            ? "border-primary/30 bg-primary/10 text-primary"
            : "border-white/[0.08] bg-white/[0.03] text-primary group-hover:border-primary/25 group-hover:bg-primary/10",
        ].join(" ")}>
        <Icon className="size-5" aria-hidden />
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="text-base font-semibold tracking-tight text-foreground">{title}</h3>
        <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
      </div>
    </article>
  )
}

export function LandingPage() {
  return (
    <div className="relative min-h-dvh overflow-x-hidden bg-background">
      <div className="pointer-events-none absolute inset-0 tk-grid opacity-[0.25]" aria-hidden />
      <div className="pointer-events-none absolute inset-0 tk-landing-mesh" aria-hidden />
      <div className="pointer-events-none absolute inset-0 tk-landing-noise" aria-hidden />

      <LandingNav />

      <main id="main-content" className="relative" tabIndex={-1}>
        {/* Hero */}
        <section className="mx-auto max-w-6xl px-4 pb-20 pt-12 md:px-6 md:pb-28 md:pt-16">
          <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-16">
            <div className="flex flex-col gap-7">
              <div className="tk-landing-rise flex flex-col gap-5">
                <span className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
                  <span className="size-1.5 rounded-full bg-primary animate-pulse" aria-hidden />
                  Guided onboarding for the real web
                </span>
                <h1 className="max-w-[14ch] text-balance text-4xl font-semibold leading-[1.05] tracking-[-0.03em] text-foreground sm:text-5xl lg:text-[3.25rem]">
                  Product tours that feel{" "}
                  <span className="bg-gradient-to-r from-foreground via-foreground to-muted-foreground bg-clip-text text-transparent">
                    built in
                  </span>
                  , not bolted on.
                </h1>
                <p className="max-w-lg text-pretty text-base leading-relaxed text-muted-foreground md:text-lg md:leading-relaxed">
                  TourKit hosts your tour config, delivers it through a tiny SDK, and matches steps to the exact page your
                  user is on — including dynamic URLs.
                </p>
              </div>

              <div className="tk-landing-rise tk-landing-rise-delay-1 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Button size="lg" className="h-12 rounded-xl px-6 text-base shadow-[0_0_28px_color-mix(in_srgb,var(--primary)_30%,transparent)]" asChild>
                  <Link href="/auth?mode=signup">
                    Start free
                    <ArrowRightIcon className="ml-2 size-4" aria-hidden />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="h-12 rounded-xl border-white/10 bg-white/[0.02] px-6 text-base hover:bg-white/[0.05]" asChild>
                  <Link href="/docs/getting-started/quick-start">Read the docs</Link>
                </Button>
              </div>

              <p className="tk-landing-rise tk-landing-rise-delay-2 text-xs text-muted-foreground">
                Free tier · No credit card · Works on any stack
              </p>

              <dl className="tk-landing-rise tk-landing-rise-delay-2 grid grid-cols-3 gap-4 border-t border-white/[0.06] pt-6">
                {stats.map(({ value, label }) => (
                  <div key={label} className="flex flex-col gap-0.5">
                    <dt className="text-lg font-semibold tracking-tight text-foreground tabular-nums md:text-xl">{value}</dt>
                    <dd className="text-[11px] leading-snug text-muted-foreground">{label}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <HeroVisual />
          </div>
        </section>

        {/* Bento features */}
        <section className="border-t border-white/[0.06] bg-white/[0.01]">
          <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
            <div className="mx-auto flex max-w-2xl flex-col gap-3 text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Platform</p>
              <h2 className="text-balance text-2xl font-semibold tracking-tight text-foreground md:text-4xl">
                Everything you need to onboard users — without shipping a custom tour system.
              </h2>
              <p className="text-muted-foreground md:text-lg">
                Embed once, configure from the dashboard, and iterate on copy without redeploying your app.
              </p>
            </div>

            <div className="mt-12 grid gap-4 md:grid-cols-3 md:gap-5">
              {bento.map((item) => (
                <BentoCard key={item.title} {...item} />
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="border-t border-white/[0.06]">
          <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
            <div className="flex flex-col gap-3 md:max-w-xl">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">How it works</p>
              <h2 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">Three steps to a live tour</h2>
            </div>

            <ol className="mt-12 grid gap-6 md:grid-cols-3 md:gap-8">
              {steps.map(({ n, title, body }) => (
                <li key={n} className="tk-landing-glass relative flex flex-col gap-4 rounded-2xl p-6">
                  <span className="font-mono text-xs font-medium text-primary">{n}</span>
                  <h3 className="text-lg font-semibold tracking-tight text-foreground">{title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Code + API */}
        <section className="border-t border-white/[0.06] bg-white/[0.01]">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 md:grid-cols-2 md:items-center md:gap-14 md:px-6 md:py-24">
            <div className="flex flex-col gap-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Developer experience</p>
              <h2 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
                One snippet. One API. Zero framework drama.
              </h2>
              <p className="text-muted-foreground md:text-lg">
                Drop the script before <code className="rounded bg-white/[0.06] px-1.5 py-0.5 font-mono text-sm text-foreground">&lt;/body&gt;</code>
                . Your SDK pulls tour JSON from TourKit&apos;s public endpoint — same config your dashboard edits.
              </p>
              <Button variant="outline" className="mt-2 w-fit rounded-xl border-white/10 bg-white/[0.02]" asChild>
                <Link href="/docs/installation/html">Installation guides →</Link>
              </Button>
            </div>

            <div className="tk-landing-glass overflow-hidden rounded-2xl">
              <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Embed</span>
                <span className="rounded bg-emerald-500/15 px-2 py-0.5 font-mono text-[10px] text-emerald-400">sdk-v14</span>
              </div>
              <pre className="overflow-x-auto p-4 font-mono text-[11px] leading-relaxed text-foreground/90">
                <code translate="no">{CDN_SNIPPET}</code>
              </pre>
              <div className="border-t border-white/[0.06] px-4 py-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="rounded bg-primary/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
                    GET
                  </span>
                  <span className="truncate font-mono text-xs text-foreground">/api/tour/[scriptKey]</span>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  Returns tour metadata + ordered steps with selectors, positions, and url_pattern triggers.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-white/[0.06]">
          <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
            <div className="tk-landing-glass tk-landing-glow-ring relative overflow-hidden rounded-3xl px-6 py-12 text-center md:px-12 md:py-16">
              <div className="pointer-events-none absolute inset-0 tk-glow-soft opacity-60" aria-hidden />
              <div className="relative flex flex-col items-center gap-5">
                <h2 className="max-w-xl text-balance text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
                  Ready to wire up your first tour?
                </h2>
                <p className="max-w-md text-muted-foreground md:text-lg">
                  Create a project, grab your script key, and point visitors at steps that match where they actually are.
                </p>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button size="lg" className="h-12 rounded-xl px-8" asChild>
                    <Link href="/auth?mode=signup">Open dashboard</Link>
                  </Button>
                  <Button size="lg" variant="outline" className="h-12 rounded-xl border-white/10 bg-white/[0.02] px-8" asChild>
                    <Link href="/pricing">View pricing</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <footer className="border-t border-white/[0.06] py-10">
          <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 md:flex-row md:items-center md:justify-between md:px-6">
            <div className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-foreground">TourKit</span>
              <span className="text-xs text-muted-foreground tabular-nums">© {new Date().getFullYear()} — Product tours, shipped.</span>
            </div>
            <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground" aria-label="Footer">
              <Link href="/docs" className="transition-colors hover:text-foreground">
                Docs
              </Link>
              <Link href="/pricing" className="transition-colors hover:text-foreground">
                Pricing
              </Link>
              <Link href="/auth" className="transition-colors hover:text-foreground">
                Sign in
              </Link>
              <Link href="/auth?mode=signup" className="transition-colors hover:text-foreground">
                Sign up
              </Link>
            </nav>
          </div>
        </footer>
      </main>
    </div>
  )
}
