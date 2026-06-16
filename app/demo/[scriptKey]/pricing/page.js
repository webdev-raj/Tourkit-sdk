'use client'

import { use, useEffect } from 'react'

export default function DemoPricingPage({ params }) {
  const { scriptKey } = use(params)

  useEffect(() => {
    let attempts = 0
    const maxAttempts = 20
    let timeoutId = null

    const interval = setInterval(() => {
      attempts++

      if (window.TourKit) {
        clearInterval(interval)
        timeoutId = setTimeout(() => {
          try {
            window.TourKit.startFor(
              window.location.pathname.replace(/\/demo\/[^/]+/, '') || '/',
            )
          } catch (_) {}
        }, 300)
        return
      }

      if (attempts >= maxAttempts) {
        clearInterval(interval)
      }
    }, 200)

    return () => {
      clearInterval(interval)
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [])

  const fullPath = `/demo/${scriptKey}/pricing`

  const selectors = [
    '#pricing-header',
    '#pricing-grid',
    '#plan-free',
    '#plan-starter',
    '#upgrade-btn',
    '#plan-pro',
    '#pricing-faq',
  ]

  return (
    <div className="demo-page-grid">
      <div>
        <div className="page-url-note">
          URL path for this page: <strong style={{ color: '#ccc' }}>{fullPath}</strong>
          <br />
          Use this in your step&apos;s Trigger URL field (e.g. <code style={{ color: '#f15025' }}>/pricing</code>).
        </div>

        <div className="pricing-wrapper" style={{ padding: '0 24px 40px' }}>
          <div className="pricing-header" id="pricing-header">
            <h1>Simple Pricing</h1>
            <p>Start free. Upgrade when you need more.</p>
          </div>

          <div className="pricing-grid" id="pricing-grid">
            <div className="pricing-card" id="plan-free">
              <div className="plan-name">Free</div>
              <div className="plan-price">$0/mo</div>
              <ul className="plan-features">
                <li>1 project</li>
                <li>500 sessions</li>
                <li>Basic analytics</li>
              </ul>
              <button type="button" className="btn-outline">
                Get Started
              </button>
            </div>

            <div className="pricing-card featured" id="plan-starter">
              <div className="plan-badge">Most Popular</div>
              <div className="plan-name">Starter</div>
              <div className="plan-price">$9/mo</div>
              <ul className="plan-features">
                <li>3 projects</li>
                <li>2000 sessions</li>
                <li>Full analytics</li>
              </ul>
              <button type="button" className="cta-primary" id="upgrade-btn">
                Get Starter
              </button>
            </div>

            <div className="pricing-card" id="plan-pro">
              <div className="plan-name">Pro</div>
              <div className="plan-price">$19/mo</div>
              <ul className="plan-features">
                <li>Unlimited projects</li>
                <li>Unlimited sessions</li>
                <li>Priority support</li>
              </ul>
              <button type="button" className="btn-outline">
                Get Pro
              </button>
            </div>
          </div>

          <div className="pricing-faq" id="pricing-faq">
            <h2>FAQ</h2>
            <div className="faq-item">
              <strong>Can I cancel anytime?</strong>
              <p>Yes, cancel from your dashboard anytime.</p>
            </div>
          </div>
        </div>
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
