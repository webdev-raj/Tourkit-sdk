import { pingEvent } from './tracker.js'

/** @typedef {{ id?: string, selector: string, title?: string|null, message: string, position?: string, step_order?: number }} TourStep */

var CSS_SNIPPET = [
  ':root{--tk-primary:#F15025;--tk-bg:#111111;--tk-border:#2a2a2a;--tk-text:#ffffff;--tk-subtext:#999999;--tk-radius:10px;--tk-font:Inter;--tk-buttonGhost:#1e1e1e;--tk-buttonGhostBorder:#333333;--tk-buttonGhostText:#cccccc;}',
  '.tk-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.6);backdrop-filter:blur(2px);z-index:99998;animation:tkFadeIn 0.2s ease;}',
  '.tk-highlight{position:absolute;border:2px solid var(--tk-primary);border-radius:var(--tk-radius);z-index:99999;pointer-events:none;box-shadow:0 0 0 4px color-mix(in srgb,var(--tk-primary) 20%,transparent);transition:all 0.3s cubic-bezier(0.4,0,0.2,1);}',
  '.tk-tooltip{position:fixed;background:var(--tk-bg);border:1px solid var(--tk-border);border-radius:var(--tk-radius);padding:20px;width:320px;max-width:320px;z-index:100000;font-family:var(--tk-font),system-ui,sans-serif;font-size:14px;line-height:1.6;color:var(--tk-text);box-sizing:border-box;box-shadow:0 20px 60px rgba(0,0,0,0.3),0 0 0 1px rgba(255,255,255,0.05);animation:tkSlideUp 0.25s cubic-bezier(0.4,0,0.2,1);}',
  '.tk-tooltip-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;}',
  '.tk-tooltip-badge{font-size:11px;font-weight:600;letter-spacing:.05em;text-transform:uppercase;color:var(--tk-primary);background:color-mix(in srgb,var(--tk-primary) 15%,transparent);padding:3px 8px;border-radius:20px;}',
  '.tk-close-btn{background:none;border:none;color:var(--tk-subtext);cursor:pointer;font-size:18px;line-height:1;padding:0;width:24px;height:24px;display:flex;align-items:center;justify-content:center;border-radius:4px;transition:background .15s ease;}',
  '.tk-close-btn:hover{background:rgba(255,255,255,0.1);}',
  '.tk-progress-track{height:3px;background:rgba(255,255,255,0.1);border-radius:999px;margin-bottom:16px;overflow:hidden;}',
  '.tk-progress-fill{height:100%;background:var(--tk-primary);border-radius:999px;transition:width .3s ease;}',
  '.tk-tooltip-title{font-size:15px;font-weight:600;color:var(--tk-text);margin:0 0 6px 0;line-height:1.4;}',
  '.tk-tooltip-message{font-size:13px;color:var(--tk-subtext);margin:0 0 16px 0;line-height:1.6;}',
  '.tk-tooltip-footer{display:flex;justify-content:flex-end;gap:8px;align-items:center;}',
  '.tk-btn{padding:8px 16px;border-radius:calc(var(--tk-radius) - 2px);font-size:13px;font-weight:500;cursor:pointer;font-family:var(--tk-font),system-ui,sans-serif;transition:all .15s ease;border:none;}',
  '.tk-btn-primary{background:var(--tk-primary);color:#fff;}',
  '.tk-btn-primary:hover{filter:brightness(1.1);}',
  '.tk-btn-ghost{background:var(--tk-buttonGhost);color:var(--tk-buttonGhostText);border:1px solid var(--tk-buttonGhostBorder);}',
  '.tk-btn-ghost:hover{background:rgba(255,255,255,0.05);}',
  '@keyframes tkFadeIn{from{opacity:0}to{opacity:1}}',
  '@keyframes tkSlideUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}',
].join('')

function injectStylesOnce() {
  try {
    if (document.head && !document.getElementById('tourkit-sdk-font')) {
      const fontLink = document.createElement('link')
      fontLink.id = 'tourkit-sdk-font'
      fontLink.rel = 'stylesheet'
      fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap'
      document.head.appendChild(fontLink)
    }
    if (document.head && document.getElementById('tourkit-sdk-styles')) return
    var tag = document.createElement('style')
    tag.id = 'tourkit-sdk-styles'
    tag.textContent = CSS_SNIPPET
    if (document.head) document.head.appendChild(tag)
  } catch (_) {
    /* silent */
  }
}

function applyCustomization(customization) {
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
  } catch (_) {
    /* silent */
  }
}

function normalizePosition(p) {
  var v = String(p || 'bottom').toLowerCase()
  if (v === 'top' || v === 'left' || v === 'right') return v
  return 'bottom'
}

function clampViewport(left, top, w, h) {
  var pad = 8
  var maxL = Math.max(pad, window.innerWidth - w - pad)
  var maxT = Math.max(pad, window.innerHeight - h - pad)
  left = Math.min(Math.max(left, pad), maxL)
  top = Math.min(Math.max(top, pad), maxT)
  return [left, top]
}

export function startTour(stepsSorted, scriptKey, apiBase, customization) {
  try {
    if (!scriptKey || !apiBase) return

    injectStylesOnce()
    applyCustomization(customization)

    var steps = Array.isArray(stepsSorted) ? stepsSorted.slice() : []
    if (!steps.length) return

    var overlay = document.createElement('div')
    overlay.className = 'tk-overlay'

    var highlight = document.createElement('div')
    highlight.className = 'tk-highlight'

    var tooltip = document.createElement('div')
    tooltip.className = 'tk-tooltip'

    var header = document.createElement('div')
    header.className = 'tk-tooltip-header'

    var badge = document.createElement('div')
    badge.className = 'tk-tooltip-badge'

    var closeBtn = document.createElement('button')
    closeBtn.type = 'button'
    closeBtn.className = 'tk-close-btn'
    closeBtn.setAttribute('aria-label', 'Close')
    closeBtn.textContent = '×'

    header.appendChild(badge)
    header.appendChild(closeBtn)

    var progressTrack = document.createElement('div')
    progressTrack.className = 'tk-progress-track'

    var progressFill = document.createElement('div')
    progressFill.className = 'tk-progress-fill'
    progressTrack.appendChild(progressFill)

    var content = document.createElement('div')
    content.className = 'tk-tooltip-content'

    var ttl = document.createElement('h3')
    ttl.className = 'tk-tooltip-title'

    var msg = document.createElement('p')
    msg.className = 'tk-tooltip-message'

    content.appendChild(ttl)
    content.appendChild(msg)

    var footer = document.createElement('div')
    footer.className = 'tk-tooltip-footer'

    var btnPrev = document.createElement('button')
    btnPrev.type = 'button'
    btnPrev.className = 'tk-btn tk-btn-ghost'
    btnPrev.textContent = '← Prev'

    var btnNext = document.createElement('button')
    btnNext.type = 'button'
    btnNext.className = 'tk-btn tk-btn-primary'
    btnNext.textContent = 'Next →'

    footer.appendChild(btnPrev)
    footer.appendChild(btnNext)

    tooltip.appendChild(header)
    tooltip.appendChild(progressTrack)
    tooltip.appendChild(content)
    tooltip.appendChild(footer)

    document.body.appendChild(overlay)
    document.body.appendChild(highlight)
    document.body.appendChild(tooltip)

    var currentIdx = 0
    var destroyed = false
    var tourStartedSent = false
    var pendingRaf = 0

    function teardownListeners() {
      try {
        window.removeEventListener('scroll', scheduleReflow, true)
        window.removeEventListener('resize', scheduleReflow)
      } catch (_) {}
    }

    function removeNodes() {
      try {
        if (tooltip.parentNode) tooltip.parentNode.removeChild(tooltip)
        if (highlight.parentNode) highlight.parentNode.removeChild(highlight)
        if (overlay.parentNode) overlay.parentNode.removeChild(overlay)
      } catch (_) {}
    }

    function destroyQuiet(markSeen) {
      if (destroyed) return
      destroyed = true
      teardownListeners()
      cancelAnimationFrameMaybe()
      try {
        if (markSeen) window.localStorage.setItem('tourkit_seen_' + scriptKey, '1')
      } catch (_) {}
      removeNodes()
    }

    function cancelAnimationFrameMaybe() {
      try {
        if (pendingRaf) cancelAnimationFrame(pendingRaf)
      } catch (_) {}
      pendingRaf = 0
    }

    function scheduleReflow() {
      if (destroyed) return
      cancelAnimationFrameMaybe()
      try {
        pendingRaf = requestAnimationFrame(function () {
          pendingRaf = 0
          if (destroyed) return
          showStep(currentIdx, true)
        })
      } catch (_) {}
    }

    window.addEventListener('scroll', scheduleReflow, true)
    window.addEventListener('resize', scheduleReflow)

    function orderFor(step) {
      try {
        if (step && typeof step.step_order === 'number' && Number.isFinite(step.step_order)) return step.step_order
      } catch (_) {}
      try {
        if (steps.indexOf(step) >= 0) return steps.indexOf(step)
      } catch (_) {}
      return null
    }

    function layoutHighlight(rect) {
      highlight.style.display = 'block'
      highlight.style.left = rect.left + window.scrollX + 'px'
      highlight.style.top = rect.top + window.scrollY + 'px'
      highlight.style.width = rect.width + 'px'
      highlight.style.height = rect.height + 'px'
    }

    function layoutTooltip(elRect, step, logicalIndexZero) {
      var pos = normalizePosition(step && step.position)
      tooltip.style.display = 'block'

      var ttW = tooltip.offsetWidth || 320
      var ttH = tooltip.offsetHeight || 120
      var gap = 12
      var left = 0
      var top = 0

      if (pos === 'bottom') {
        left = elRect.left + elRect.width / 2 - ttW / 2
        top = elRect.bottom + gap
      } else if (pos === 'top') {
        left = elRect.left + elRect.width / 2 - ttW / 2
        top = elRect.top - ttH - gap
      } else if (pos === 'left') {
        left = elRect.left - ttW - gap
        top = elRect.top + elRect.height / 2 - ttH / 2
      } else {
        left = elRect.right + gap
        top = elRect.top + elRect.height / 2 - ttH / 2
      }

      var cl = clampViewport(left, top, tooltip.offsetWidth || ttW, tooltip.offsetHeight || ttH)
      tooltip.style.left = cl[0] + 'px'
      tooltip.style.top = cl[1] + 'px'

      var total = steps.length
      var n = logicalIndexZero + 1
      badge.textContent = 'Step ' + n + ' of ' + total
      progressFill.style.width = total > 0 ? (n / total) * 100 + '%' : '0%'

      var titleTxt = ''
      try {
        if (step.title && String(step.title).trim()) titleTxt = String(step.title).trim()
        else titleTxt = 'Step ' + n
      } catch (_) {
        titleTxt = 'Step'
      }
      ttl.textContent = titleTxt
      msg.textContent = step.message ? String(step.message) : ''
    }

    function skipTour() {
      if (destroyed) return
      var cs = steps[currentIdx]
      var ord = cs ? orderFor(cs) : currentIdx
      pingEvent(apiBase, scriptKey, 'tour_skipped', ord === null ? null : ord)
      destroyQuiet(true)
    }

    closeBtn.onclick = skipTour
    overlay.onclick = skipTour

    btnPrev.onclick = function () {
      if (destroyed || currentIdx <= 0) return
      currentIdx -= 1
      showStep(currentIdx, false)
    }

    btnNext.onclick = function () {
      if (destroyed) return
      var lastIx = steps.length - 1
      var active = steps[currentIdx]
      var ordFinish = active ? orderFor(active) : currentIdx

      if (currentIdx >= lastIx) {
        pingEvent(apiBase, scriptKey, 'tour_completed', ordFinish === null ? null : ordFinish)
        destroyQuiet(true)
        return
      }

      currentIdx += 1
      showStep(currentIdx, false)
    }

    var guardLoops = 0

    function showStep(initialIndex, silent) {
      if (destroyed) return
      guardLoops = 0
      attempt(initialIndex, silent)

      function attempt(i, sil) {
        if (destroyed) return
        if (i >= steps.length) return destroyQuiet(false)
        if (guardLoops++ > steps.length + 20) return destroyQuiet(false)

        var step = steps[i]
        var sel = ''
        try {
          sel = step && step.selector ? String(step.selector).trim() : ''
        } catch (_) {
          sel = ''
        }
        if (!sel || !step) return attempt(i + 1, true)

        var el = null
        try {
          el = document.querySelector(sel)
        } catch (_) {
          el = null
        }
        if (!el) return attempt(i + 1, true)

        try {
          el.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' })
        } catch (_) {
          try {
            el.scrollIntoView()
          } catch (_) {}
        }

        var rect = null
        try {
          rect = el.getBoundingClientRect()
        } catch (_) {
          rect = null
        }
        if (!rect || rect.width <= 0 || rect.height <= 0) return attempt(i + 1, true)

        layoutHighlight(rect)
        layoutTooltip(rect, step, i)

        if (!sil && !tourStartedSent) {
          tourStartedSent = true
          pingEvent(apiBase, scriptKey, 'tour_started', orderFor(step))
        }
        if (!sil) pingEvent(apiBase, scriptKey, 'step_viewed', orderFor(step))

        currentIdx = i
        btnPrev.style.display = currentIdx <= 0 ? 'none' : 'inline-flex'
        btnNext.textContent = currentIdx >= steps.length - 1 ? 'Finish' : 'Next →'
      }
    }

    showStep(0, false)
  } catch (_) {
    /* silent */
  }
}
