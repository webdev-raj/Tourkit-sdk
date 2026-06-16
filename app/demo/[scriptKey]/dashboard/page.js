'use client'

import { use, useEffect } from 'react'

export default function DemoDashboardPage({ params }) {
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

  const fullPath = `/demo/${scriptKey}/dashboard`

  const selectors = [
    '#demo-sidebar',
    '#dashboard-header',
    '#create-btn',
    '#stats-row',
    '.stat-card',
    '#project-list',
    '.project-item',
  ]

  return (
    <div className="demo-page-grid">
      <div>
        <div className="page-url-note">
          URL path for this page: <strong style={{ color: '#ccc' }}>{fullPath}</strong>
          <br />
          Use this in your step&apos;s Trigger URL field (or a pattern that matches it, e.g. <code style={{ color: '#f15025' }}>/dashboard</code>).
        </div>

        <div className="demo-page-wrapper">
          <aside className="demo-sidebar" id="demo-sidebar">
            <div className="sidebar-logo">MyApp</div>
            <nav className="sidebar-nav" aria-label="Sidebar">
              <span className="sidebar-link active">Dashboard</span>
              <span className="sidebar-link">Projects</span>
              <span className="sidebar-link">Analytics</span>
              <span className="sidebar-link">Settings</span>
            </nav>
          </aside>

          <main className="demo-main">
            <div className="dashboard-header" id="dashboard-header">
              <h1>Welcome back!</h1>
              <button type="button" className="cta-primary" id="create-btn">
                + Create New
              </button>
            </div>

            <div className="stats-row" id="stats-row">
              <div className="stat-card">
                <div className="stat-number">24</div>
                <div className="stat-label">Total Projects</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">1.2k</div>
                <div className="stat-label">Monthly Visitors</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">89%</div>
                <div className="stat-label">Completion Rate</div>
              </div>
            </div>

            <div className="project-list" id="project-list">
              <h2>Recent Projects</h2>
              <div className="project-item">
                <span>My Website</span>
                <span className="badge-active">Active</span>
              </div>
              <div className="project-item">
                <span>Landing Page</span>
                <span className="badge-active">Active</span>
              </div>
              <div className="project-item">
                <span>App Dashboard</span>
                <span className="badge-inactive">Inactive</span>
              </div>
            </div>
          </main>
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
