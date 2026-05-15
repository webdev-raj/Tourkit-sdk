import Link from 'next/link'
import Script from 'next/script'
import { Poppins } from 'next/font/google'

import ReplayButton from '@/components/demo/replay-button'

import './demo.css'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
})

const DEMO_SUBNAV_STYLE = {
  background: '#0d0d0d',
  borderBottom: '1px solid #1a1a1a',
  height: 44,
  padding: '0 24px',
}

const demoNavLinkBase = {
  fontSize: 14,
  color: '#666',
  textDecoration: 'none',
  paddingBottom: 10,
  borderBottom: '2px solid transparent',
  marginBottom: -1,
}

export async function generateMetadata({ params }) {
  const { scriptKey } = await params
  return {
    title: `Live Demo — ${scriptKey}`,
    description: 'Multi-page sandbox to test your tour and URL-based triggers',
  }
}

export default async function DemoLayout({ children, params }) {
  const { scriptKey } = await params
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || ''
  const sk = encodeURIComponent(scriptKey)
  const base = `/demo/${sk}`

  return (
    <div className={`${poppins.className} demo-root antialiased`}>
      <div className="fixed inset-x-0 top-0 z-[999] h-12 border-b border-[#1a1a1a] bg-[#0a0a0a]">
        <div className="mx-auto flex h-full w-full max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2.5">
            <div className="h-2.5 w-2.5 rounded-full bg-[#F15025]" aria-hidden />
            <span className="text-sm font-bold text-white">TourKit</span>
            <span className="rounded-full border border-[#F15025]/50 bg-[#F15025]/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#F15025]">
              Live Demo
            </span>
          </div>
          <p className="hidden text-xs text-gray-400 md:block">Sandbox page to test your tour</p>
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

      <nav
        className="fixed inset-x-0 top-12 z-[998] flex items-center justify-center"
        style={{ ...DEMO_SUBNAV_STYLE, gap: 24 }}
        aria-label="Demo site pages">
        <Link href={base} prefetch style={demoNavLinkBase}>
          Home
        </Link>
        <Link href={`${base}/dashboard`} prefetch style={demoNavLinkBase}>
          Dashboard
        </Link>
        <Link href={`${base}/projects`} prefetch style={demoNavLinkBase}>
          Projects
        </Link>
        <Link href={`${base}/settings`} prefetch style={demoNavLinkBase}>
          Settings
        </Link>
        <Link href={`${base}/pricing`} prefetch style={demoNavLinkBase}>
          Pricing
        </Link>
      </nav>

      <div className="demo-content-shell">{children}</div>

      <Script
        id="tourkit-demo-flag"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: 'window.__TOURKIT_DEMO__ = true;',
        }}
      />
      <Script
        id="tourkit-sdk"
        src="/tourkit.min.js"
        data-key={scriptKey}
        data-api={appUrl}
        data-demo="true"
        strategy="afterInteractive"
      />
    </div>
  )
}
