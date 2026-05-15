'use client'

import { use, useEffect } from 'react'
import { usePathname } from 'next/navigation'

export default function DemoSettingsPage({ params }) {
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

  const fullPath = `/demo/${scriptKey}/settings`

  const selectors = [
    '#settings-header',
    '#account-section',
    '#save-profile-btn',
    '#billing-section',
    '#manage-billing-btn',
    '#danger-zone',
    '#delete-account-btn',
  ]

  return (
    <div className="demo-page-grid">
      <div>
        <div className="page-url-note">
          URL path for this page: <strong style={{ color: '#ccc' }}>{fullPath}</strong>
          <br />
          Use this in your step&apos;s Trigger URL field (e.g. <code style={{ color: '#f15025' }}>/settings</code>).
        </div>

        <div className="settings-wrapper" style={{ padding: '0 24px 32px' }}>
          <div className="settings-header" id="settings-header">
            <h1>Settings</h1>
            <p>Manage your account and preferences</p>
          </div>

          <div className="settings-section" id="account-section">
            <h2>Account</h2>
            <div className="settings-field">
              <label htmlFor="demo-email">Email</label>
              <input id="demo-email" type="email" value="user@example.com" disabled readOnly />
            </div>
            <div className="settings-field">
              <label htmlFor="demo-name">Display Name</label>
              <input id="demo-name" type="text" placeholder="Your name" />
            </div>
            <button type="button" className="cta-primary" id="save-profile-btn">
              Save Changes
            </button>
          </div>

          <div className="settings-section" id="billing-section">
            <h2>Billing & Plan</h2>
            <div className="plan-badge">Pro Plan</div>
            <p style={{ margin: '0 0 16px', fontSize: 14, color: '#aaa' }}>$19/month · Renews June 1</p>
            <button type="button" className="btn-outline" id="manage-billing-btn">
              Manage Subscription
            </button>
          </div>

          <div className="settings-section danger-zone" id="danger-zone">
            <h2>Danger Zone</h2>
            <p style={{ margin: '0 0 16px', fontSize: 14, color: '#888' }}>Permanently delete your account and all data.</p>
            <button type="button" className="btn-danger" id="delete-account-btn">
              Delete Account
            </button>
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
