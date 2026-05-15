'use client'

import { use, useEffect } from 'react'
import { usePathname } from 'next/navigation'

export default function DemoHomePage({ params }) {
  const { scriptKey } = use(params)
  const pathname = usePathname()

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        window.TourKit?.startFor?.(pathname)
      } catch (_) {}
    }, 600)
    return () => clearTimeout(timer)
  }, [pathname])

  const homePath = `/demo/${scriptKey}`

  const selectors = ['nav', '#hero', '.cta-primary', '#features', '.feature-card', '#pricing-cta', 'footer']

  return (
    <div className="demo-page-grid">
      <div className="demo-home-main">
        <div className="page-url-note">
          Home — full pathname: <strong style={{ color: '#ccc' }}>{homePath}</strong>
          <br />
          Use this path (or a matching pattern) in Trigger URL for steps that should start on the demo home page.
        </div>

        <nav id="demo-nav">Navigation — Home</nav>

        <section id="hero">
          <div className="badge">Primary demo surface</div>
          <h1>Test your tour on realistic UI targets</h1>
          <p>
            This page is structured for TourKit QA. Use the selectors below in your dashboard.
          </p>
          <div className="buttons">
            <button type="button" className="cta-primary">
              Get Started
            </button>
            <button type="button" className="cta-secondary">
              Secondary Action
            </button>
          </div>
        </section>

        <section id="features">
          <h2>Feature Grid</h2>
          <div className="feature-grid">
            <div className="feature-card">Auto-detect elements</div>
            <div className="feature-card">Theme-safe tooltip</div>
            <div className="feature-card">Analytics tracking</div>
          </div>
        </section>

        <section id="pricing-cta">
          <h2>Pricing CTA Area</h2>
          <p>Another useful area to test tooltip positions.</p>
          <div className="buttons-row">
            <button type="button" className="btn-outline">
              View Plans
            </button>
            <button type="button" className="cta-primary">
              Start Free Trial
            </button>
          </div>
        </section>

        <footer id="demo-footer">TourKit demo footer</footer>
      </div>

      <aside className="demo-selector-panel">
        <h2>Selector targets</h2>
        <p>Copy any selector into the step editor.</p>
        <div className="demo-selector-list">
          {selectors.map((sel) => (
            <code key={sel}>{sel}</code>
          ))}
        </div>
      </aside>
    </div>
  )
}
