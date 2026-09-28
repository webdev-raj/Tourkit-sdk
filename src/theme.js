/**
 * Apply TourKit customization CSS variables on :root.
 * Shared by tours and announcements so theme works even with no tour.
 */
export function applyCustomization(customization) {
  try {
    const primaryColor = customization?.primary_color || '#F15025'
    const fontFamily = customization?.font_family || 'Inter'
    const borderRadius = customization?.border_radius || '10px'
    const theme = customization?.theme || 'dark'

    let bg = '#111111'
    let border = '#2a2a2a'
    let text = '#ffffff'
    let subtext = '#999999'
    let buttonGhost = '#1e1e1e'
    let buttonGhostBorder = '#333333'
    let buttonGhostText = '#cccccc'

    if (theme === 'light') {
      bg = '#ffffff'
      border = '#e5e7eb'
      text = '#111111'
      subtext = '#6b7280'
      buttonGhost = '#f9fafb'
      buttonGhostBorder = '#e5e7eb'
      buttonGhostText = '#374151'
    }

    const root = document.documentElement
    root.style.setProperty('--tk-primary', primaryColor)
    root.style.setProperty('--tk-bg', bg)
    root.style.setProperty('--tk-border', border)
    root.style.setProperty('--tk-text', text)
    root.style.setProperty('--tk-subtext', subtext)
    root.style.setProperty('--tk-radius', borderRadius)
    root.style.setProperty('--tk-font', fontFamily)
    root.style.setProperty('--tk-buttonGhost', buttonGhost)
    root.style.setProperty('--tk-buttonGhostBorder', buttonGhostBorder)
    root.style.setProperty('--tk-buttonGhostText', buttonGhostText)

    try {
      if (theme === 'light') root.classList.add('tk-theme-light')
      else root.classList.remove('tk-theme-light')
    } catch (_) {}

    try {
      var tooltipThemeEl = document.querySelector('.tk-tooltip')
      if (tooltipThemeEl) {
        if (theme === 'light') tooltipThemeEl.classList.add('tk-tooltip-light')
        else tooltipThemeEl.classList.remove('tk-tooltip-light')
      }
    } catch (_) {}
  } catch (_) {
    /* silent */
  }
}
