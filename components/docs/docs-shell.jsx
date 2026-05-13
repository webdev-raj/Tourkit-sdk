'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { BookOpenIcon, ChevronRightIcon, MenuIcon, XIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { DOCS_NAV } from '@/components/docs/docs-nav-data'

export function DocsShell({ children }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <div className="relative min-h-dvh bg-background">
      <div className="pointer-events-none fixed inset-0 tk-grid opacity-[0.18]" aria-hidden />
      <div className="pointer-events-none fixed inset-0 tk-glow-soft opacity-40" aria-hidden />

      {/* Top bar */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-[90rem] items-center justify-between gap-4 px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="lg:hidden"
              aria-expanded={open}
              aria-controls="docs-sidebar"
              onClick={() => setOpen((v) => !v)}>
              {open ? <XIcon className="size-5" /> : <MenuIcon className="size-5" />}
              <span className="sr-only">Toggle docs navigation</span>
            </Button>
            <Link href="/" className="flex items-center gap-2 text-sm font-semibold tracking-tight text-foreground">
              <span className="inline-block size-2 rounded-full bg-primary shadow-[0_0_12px_color-mix(in_srgb,var(--primary)_55%,transparent)]" aria-hidden />
              TourKit
            </Link>
            <span className="hidden h-4 w-px bg-white/15 sm:block" aria-hidden />
            <Link
              href="/docs"
              className="hidden items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground sm:inline-flex">
              <BookOpenIcon className="size-4 shrink-0 text-primary/90" aria-hidden />
              Docs
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="outline" size="sm" className="rounded-xl border-white/10 bg-background/30">
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="relative mx-auto flex w-full max-w-[90rem] flex-1">
        {/* Sidebar */}
        <aside
          id="docs-sidebar"
          className={`fixed inset-y-0 left-0 z-40 w-[min(100%,18rem)] border-r border-white/10 bg-[#070707]/95 pt-14 backdrop-blur-md transition-transform duration-200 lg:static lg:z-0 lg:block lg:w-64 lg:shrink-0 lg:bg-transparent lg:pt-0 lg:backdrop-blur-none ${
            open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}>
          <nav className="h-[calc(100dvh-3.5rem)] overflow-y-auto overscroll-contain px-4 py-6 lg:sticky lg:top-14 lg:h-[calc(100dvh-3.5rem)] lg:py-8 lg:pl-6 lg:pr-4 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/15">
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Contents</p>
            <div className="flex flex-col gap-8">
              {DOCS_NAV.map((section) => (
                <div key={section.title}>
                  <p className="mb-2 text-xs font-semibold text-foreground/90">{section.title}</p>
                  <ul className="flex flex-col gap-0.5 border-l border-white/10 pl-3">
                    {section.items.map((item) => {
                      const active = pathname === item.href
                      return (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            onClick={() => setOpen(false)}
                            className={`group flex items-center gap-1 py-1.5 pl-2 text-sm transition-colors ${
                              active
                                ? 'border-l-2 border-primary -ml-[13px] pl-[11px] font-medium text-primary'
                                : 'text-muted-foreground hover:text-foreground'
                            }`}>
                            {!active ? (
                              <ChevronRightIcon className="size-3 shrink-0 opacity-0 transition-opacity group-hover:opacity-50" aria-hidden />
                            ) : (
                              <span className="size-3 shrink-0" aria-hidden />
                            )}
                            {item.title}
                          </Link>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </nav>
        </aside>

        {open ? (
          <button
            type="button"
            className="fixed inset-0 z-30 bg-black/60 lg:hidden"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          />
        ) : null}

        {/* Main */}
        <main id="main-content" className="min-w-0 flex-1 px-4 py-10 sm:px-8 lg:px-12 lg:py-14">
          <div className="mx-auto max-w-3xl">{children}</div>
        </main>
      </div>
    </div>
  )
}
