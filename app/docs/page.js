import Link from 'next/link'
import { ArrowRightIcon, LayersIcon, SparklesIcon } from 'lucide-react'

import { DOCS_NAV } from '@/components/docs/docs-nav-data'

export const metadata = {
  title: 'Documentation',
}

const highlights = [
  {
    title: 'Ship in minutes',
    body: 'Embed one script, publish steps from the dashboard, and your visitors get a polished tour.',
    icon: SparklesIcon,
  },
  {
    title: 'Framework-agnostic',
    body: 'Works on static HTML, SPAs, and CMS pages — your tour config is fetched from TourKit’s API.',
    icon: LayersIcon,
  },
]

export default function DocsHomePage() {
  return (
    <div className="flex flex-col gap-12">
      <div className="space-y-4">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">TourKit documentation</p>
        <h1 className="text-balance text-4xl font-semibold tracking-tight text-foreground">
          Everything you need to run product tours
        </h1>
        <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">
          Install the SDK, wire selectors to real UI, tune appearance, and understand engagement — all in one place.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {highlights.map(({ title, body, icon: Icon }) => (
          <div
            key={title}
            className="rounded-xl border border-white/10 bg-[#0c0c0c]/80 p-6 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]">
            <Icon className="mb-3 size-8 text-primary" aria-hidden />
            <h2 className="text-lg font-semibold text-foreground">{title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-10">
        {DOCS_NAV.map((section) => (
          <section key={section.title}>
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.14em] text-muted-foreground">{section.title}</h2>
            <ul className="grid gap-3 sm:grid-cols-2">
              {section.items.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="group flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-[#111111] px-4 py-4 transition-[border-color,background-color] hover:border-primary/35 hover:bg-[#141414]">
                    <span className="font-medium text-foreground">{item.title}</span>
                    <ArrowRightIcon className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" aria-hidden />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  )
}
