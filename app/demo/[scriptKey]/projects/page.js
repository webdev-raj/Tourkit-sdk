'use client'

import { use, useEffect } from 'react'
import { usePathname } from 'next/navigation'

export default function DemoProjectsPage({ params }) {
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

  const fullPath = `/demo/${scriptKey}/projects`

  const selectors = [
    '#projects-header',
    '#new-project-btn',
    '#projects-grid',
    '#project-card-1',
    '.project-card',
    '#script-key-section',
  ]

  return (
    <div className="demo-page-grid">
      <div>
        <div className="page-url-note">
          URL path for this page: <strong style={{ color: '#ccc' }}>{fullPath}</strong>
          <br />
          Use this in your step&apos;s Trigger URL field (e.g. pattern <code style={{ color: '#f15025' }}>/projects</code>).
        </div>

        <div className="demo-page-wrapper" style={{ display: 'block', padding: '24px' }}>
          <div className="projects-header" id="projects-header">
            <h1>Projects</h1>
            <button type="button" className="cta-primary" id="new-project-btn">
              New Project
            </button>
          </div>

          <div className="projects-grid" id="projects-grid">
            <div className="project-card" id="project-card-1">
              <div className="project-name">My Website</div>
              <div className="project-domain">mywebsite.com</div>
              <div className="project-stats">3 steps · Active</div>
              <button type="button" className="btn-outline">
                Edit Tour
              </button>
            </div>
            <div className="project-card">
              <div className="project-name">Landing Page</div>
              <div className="project-domain">landing.com</div>
              <div className="project-stats">5 steps · Active</div>
              <button type="button" className="btn-outline">
                Edit Tour
              </button>
            </div>
            <div className="project-card">
              <div className="project-name">App Dashboard</div>
              <div className="project-domain">app.com</div>
              <div className="project-stats">2 steps · Inactive</div>
              <button type="button" className="btn-outline">
                Edit Tour
              </button>
            </div>
          </div>

          <div className="script-key-section" id="script-key-section">
            <h3>Script Key</h3>
            <div className="script-key-display">abc123-def456-ghi789</div>
            <button type="button" className="btn-outline">
              Copy
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
