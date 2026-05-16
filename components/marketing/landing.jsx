import Link from "next/link"
import { Code2Icon, GaugeIcon, LayoutDashboardIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

const features = [
  {
    title: "One script tag",
    description:
      "Drop a snippet on any site. TourKit fetches tour JSON from your project’s script key — no framework lock-in.",
    icon: Code2Icon,
  },
  {
    title: "Dashboard control",
    description:
      "Create projects, copy keys, and tune steps from one workspace built for operators and builders alike.",
    icon: LayoutDashboardIcon,
  },
  {
    title: "Fast delivery",
    description:
      "Public API responses are shaped for your SDK: tour metadata plus ordered steps your renderer can trust.",
    icon: GaugeIcon,
  },
]

export function LandingPage() {
  return (
    <div className="relative min-h-dvh overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0 tk-grid opacity-[0.35]" aria-hidden />
      <div className="pointer-events-none absolute inset-0 tk-glow-hero" aria-hidden />

      <header className="relative border-b border-border/60 bg-background/75 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 md:px-6">
          <Link href="/" className="group flex flex-col gap-0 leading-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background">
            <span className="flex items-center gap-2 text-sm font-semibold tracking-tight">
              <span className="inline-block size-2 rounded-full bg-primary shadow-[0_0_12px_color-mix(in_srgb,var(--primary)_55%,transparent)]" aria-hidden />
              TourKit
            </span>
            <span className="text-[11px] font-medium text-muted-foreground group-hover:text-foreground/90">
              Product tours, shipped.
            </span>
          </Link>
          <nav className="flex items-center gap-2" aria-label="Marketing">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/pricing">Pricing</Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/auth">Sign in</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/auth?mode=signup">Get started</Link>
            </Button>
          </nav>
        </div>
      </header>

      <main id="main-content" className="relative" tabIndex={-1}>
        <section className="mx-auto flex max-w-6xl flex-col gap-10 px-4 pb-16 pt-14 md:gap-12 md:px-6 md:pb-24 md:pt-20 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
          <div className="flex max-w-xl flex-col gap-6">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
              Guided onboarding for the real web
            </p>
            <h1 className="text-balance text-4xl font-semibold leading-[1.08] tracking-tight text-foreground md:text-5xl md:leading-[1.06]">
              Onboarding tours that feel native—not bolted on.
            </h1>
            <p className="max-w-lg text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
              TourKit generates hosted tour configs for any domain. You publish steps from the dashboard; visitors get a
              crisp walkthrough powered by your SDK and our public API.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button size="lg" asChild>
                <Link href="/auth?mode=signup">Start free</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/auth">I already have an account</Link>
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              No credit card for this build phase · Bring your own Supabase project
            </p>
          </div>

          <div className="relative w-full max-w-md lg:max-w-sm">
            <div className="rounded-xl border border-border/80 bg-card/80 p-5 shadow-[0_0_0_1px_color-mix(in_srgb,var(--primary)_18%,transparent),0_24px_48px_-24px_color-mix(in_srgb,var(--foreground)_25%,transparent)] backdrop-blur-sm">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                  Live snippet
                </span>
                <code
                  translate="no"
                  className="break-all rounded-md bg-muted/80 px-3 py-2 font-mono text-[11px] leading-relaxed text-foreground"
                >
                  {`<script src="https://cdn.jsdelivr.net/gh/webdev-raj/Tourkit@sdk-v8/sdk/dist/tourkit.min.js"\n  data-key="YOUR_SCRIPT_KEY"\n  async></script>`}
                </code>
              </div>
              <Separator className="my-4 bg-border/60" />
              <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                <div className="flex items-center justify-between gap-3">
                  <span className="rounded bg-primary/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
                    GET
                  </span>
                  <span className="truncate font-mono text-xs text-foreground">/api/tour/[scriptKey]</span>
                </div>
                <p className="text-xs leading-relaxed">
                  Returns tour + ordered steps as JSON — meant for your vanilla SDK on customer sites.
                </p>
              </div>
            </div>
          </div>
        </section>

        <Separator className="bg-border/60" />

        <section className="mx-auto max-w-6xl px-4 py-14 md:px-6 md:py-20">
          <div className="flex flex-col gap-3 md:max-w-2xl">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
              Built for shipping, not slides.
            </h2>
            <p className="text-muted-foreground md:text-lg">
              Three primitives — embed, configure, fetch — so your team can iterate without redeploying marketing pages.
            </p>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {features.map(({ title, description, icon: Icon }) => (
              <article
                key={title}
                className="flex flex-col gap-4 rounded-xl border border-border/70 bg-card/50 p-6 shadow-sm backdrop-blur-sm transition-[border-color,background-color,transform] duration-200 hover:border-primary/35 hover:bg-accent/40"
              >
                <div className="flex size-10 items-center justify-center rounded-lg border border-border/80 bg-muted/50">
                  <Icon aria-hidden className="size-5 text-primary" />
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="text-base font-semibold leading-snug text-foreground">{title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="border-t border-border/60 bg-muted/25">
          <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-4 py-14 md:flex-row md:items-center md:justify-between md:px-6 md:py-16">
            <div className="flex flex-col gap-2">
              <h2 className="text-xl font-semibold tracking-tight text-foreground md:text-2xl">
                Ready to wire up your first tour?
              </h2>
              <p className="max-w-lg text-sm text-muted-foreground md:text-base">
                Create a project, grab your script key, and point your SDK at TourKit’s public endpoint.
              </p>
            </div>
            <Button size="lg" asChild>
              <Link href="/auth?mode=signup">Open dashboard</Link>
            </Button>
          </div>
        </section>

        <footer className="border-t border-border/60 py-8">
          <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between md:px-6">
            <span className="tabular-nums">© {new Date().getFullYear()} TourKit</span>
            <div className="flex flex-wrap gap-4">
              <Link href="/pricing" className="underline-offset-4 transition-colors hover:text-foreground hover:underline">
                Pricing
              </Link>
              <Link href="/auth" className="underline-offset-4 transition-colors hover:text-foreground hover:underline">
                Sign in
              </Link>
              <Link
                href="/auth?mode=signup"
                className="underline-offset-4 transition-colors hover:text-foreground hover:underline"
              >
                Sign up
              </Link>
            </div>
          </div>
        </footer>
      </main>
    </div>
  )
}
