import { pingEvent } from './tracker.js'

/** @typedef {{ id?: string, selector: string, title?: string|null, message: string, position?: string, step_order?: number, url_pattern?: string|null }} TourStep */

var SPOT_PADDING = 6

var CSS_SNIPPET = [
  ':root{--tk-primary:#F15025;--tk-bg:#111111;--tk-border:#2a2a2a;--tk-text:#ffffff;--tk-subtext:#999999;--tk-radius:10px;--tk-font:Inter;--tk-buttonGhost:#1e1e1e;--tk-buttonGhostBorder:#333333;--tk-buttonGhostText:#cccccc;}',
  '.tk-spot{position:fixed;background:rgba(0,0,0,0.7);backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px);z-index:99998;pointer-events:auto;transition:all 0.4s cubic-bezier(0.4,0,0.2,1);}',
  '.tk-tooltip{position:fixed;width:280px;background:var(--tk-bg);border:1px solid rgba(255,255,255,0.08);border-radius:14px;padding:20px;z-index:100000;font-family:var(--tk-font),system-ui,sans-serif;box-sizing:border-box;box-shadow:0 0 0 1px rgba(255,255,255,0.05),0 4px 6px rgba(0,0,0,0.1),0 20px 40px rgba(0,0,0,0.5);opacity:0;transform:translateY(8px);}',
  '.tk-dots{display:flex;gap:6px;margin-bottom:16px;align-items:center;}',
  '.tk-dot{width:6px;height:6px;border-radius:50%;background:rgba(255,255,255,0.2);transition:all 0.3s ease;flex-shrink:0;}',
  '.tk-dot.active{width:20px;border-radius:3px;background:var(--tk-primary);}',
  '.tk-dot.done{background:var(--tk-primary);opacity:0.4;}',
  '.tk-content{}',
  '.tk-title{font-size:15px;font-weight:600;color:var(--tk-text);margin:0 0 8px 0;line-height:1.4;text-transform:capitalize;}',
  '.tk-message{font-size:13px;color:var(--tk-subtext);margin:0 0 20px 0;line-height:1.7;}',
  '.tk-footer{display:flex;justify-content:space-between;align-items:center;gap:12px;padding-top:16px;border-top:1px solid rgba(255,255,255,0.06);}',
  '.tk-footer-left{flex:1;min-width:0;display:flex;align-items:center;}',
  '.tk-skip{background:transparent;border:none;color:var(--tk-subtext);font-size:11px;font-weight:500;cursor:pointer;padding:6px 8px;margin:0;border-radius:6px;font-family:inherit;opacity:0.75;transition:opacity 0.15s ease,background 0.15s ease;-webkit-tap-highlight-color:transparent;}',
  '.tk-skip:hover{opacity:1;background:rgba(255,255,255,0.06);}',
  '.tk-nav{display:flex;gap:8px;}',
  '.tk-prev{padding:7px 14px;border-radius:8px;font-size:12px;font-weight:500;cursor:pointer;border:1px solid rgba(255,255,255,0.1);background:rgba(255,255,255,0.05);color:var(--tk-text);font-family:inherit;transition:all 0.15s ease;}',
  '.tk-prev:hover{background:rgba(255,255,255,0.1);}',
  '.tk-next{padding:7px 14px;border-radius:8px;font-size:12px;font-weight:500;cursor:pointer;border:none;background:var(--tk-primary);color:#fff;font-family:inherit;transition:all 0.15s ease;}',
  '.tk-next:hover{filter:brightness(1.1);}',
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

function sleep(ms) {
  return new Promise(function (resolve) {
    try {
      setTimeout(resolve, ms)
    } catch (_) {
      resolve()
    }
  })
}

function getCssVar(name, fallback) {
  try {
    var v = String(getComputedStyle(document.documentElement).getPropertyValue(name) || '').trim()
    return v || fallback
  } catch (_) {
    return fallback
  }
}

function createSpotlightOverlay(rect, overlayPieces) {
  try {
    while (overlayPieces.length) {
      var old = overlayPieces.pop()
      try {
        if (old && old.parentNode) old.parentNode.removeChild(old)
      } catch (_) {}
    }

    if (!rect || rect.width <= 0 || rect.height <= 0) return

    var pad = SPOT_PADDING
    var t = rect.top - pad
    var b = rect.bottom + pad
    var l = rect.left - pad
    var r = rect.right + pad
    var h = rect.height + pad * 2

    var mk = function (stylesObj) {
      var d = document.createElement('div')
      d.className = 'tk-spot'
      try {
        for (var key in stylesObj) {
          if (Object.prototype.hasOwnProperty.call(stylesObj, key)) d.style[key] = stylesObj[key]
        }
      } catch (_) {}
      document.body.appendChild(d)
      overlayPieces.push(d)
    }

    mk({
      top: '0',
      left: '0',
      right: '0',
      height: Math.max(0, t) + 'px',
    })

    mk({
      top: b + 'px',
      left: '0',
      right: '0',
      bottom: '0',
    })

    mk({
      top: Math.max(0, t) + 'px',
      left: '0',
      width: Math.max(0, l) + 'px',
      height: Math.max(0, h) + 'px',
    })

    mk({
      top: Math.max(0, t) + 'px',
      left: r + 'px',
      right: '0',
      height: Math.max(0, h) + 'px',
    })
  } catch (_) {
    /* silent */
  }
}

function wireSpotlightClicks(overlayPieces, onSkip) {
  try {
    overlayPieces.forEach(function (piece) {
      piece.onclick = function (e) {
        try {
          e.stopPropagation()
        } catch (_) {}
        onSkip()
      }
    })
  } catch (_) {}
}

function restoreElementStyles(el) {
  try {
    if (!el || !el._tourkitSaved) return
    var s = el._tourkitSaved
    el.style.outline = s.outline
    el.style.outlineOffset = s.outlineOffset
    el.style.zIndex = s.zIndex
    el.style.position = s.position
    el.style.borderRadius = s.borderRadius
    el.style.boxShadow = s.boxShadow
    delete el._tourkitSaved
  } catch (_) {}
}

function applyHighlight(el) {
  try {
    if (!el) return
    if (!el._tourkitSaved) {
      el._tourkitSaved = {
        outline: el.style.outline,
        outlineOffset: el.style.outlineOffset,
        zIndex: el.style.zIndex,
        position: el.style.position,
        borderRadius: el.style.borderRadius,
        boxShadow: el.style.boxShadow,
      }
    }
    var primary = getCssVar('--tk-primary', '#F15025')
    var radius = getCssVar('--tk-radius', '10px')
    el.style.outline = '2px solid ' + primary
    el.style.outlineOffset = '4px'
    el.style.zIndex = '99999'
    el.style.position = 'relative'
    el.style.borderRadius = radius
    var hex = String(primary).replace('#', '')
    var glow = '0 0 0 4px rgba(241,80,37,0.2)'
    if (hex.length === 6) {
      var r = parseInt(hex.slice(0, 2), 16)
      var g = parseInt(hex.slice(2, 4), 16)
      var b = parseInt(hex.slice(4, 6), 16)
      if (!isNaN(r) && !isNaN(g) && !isNaN(b)) glow = '0 0 0 4px rgba(' + r + ',' + g + ',' + b + ',0.2)'
    }
    el.style.boxShadow = glow
  } catch (_) {}
}

function positionTooltip(tooltipEl, element, position) {
  try {
    if (!tooltipEl || !element) return

    var rect = element.getBoundingClientRect()
    var tooltipWidth = 280
    var tooltipHeight = tooltipEl.offsetHeight || 180
    var gap = 16
    var padding = 12

    var pos = normalizePosition(position)
    var top = 0
    var left = 0

    if (pos === 'bottom') {
      top = rect.bottom + gap
      left = rect.left + rect.width / 2 - tooltipWidth / 2
    } else if (pos === 'top') {
      top = rect.top - tooltipHeight - gap
      left = rect.left + rect.width / 2 - tooltipWidth / 2
    } else if (pos === 'right') {
      top = rect.top + rect.height / 2 - tooltipHeight / 2
      left = rect.right + gap
    } else if (pos === 'left') {
      top = rect.top + rect.height / 2 - tooltipHeight / 2
      left = rect.left - tooltipWidth - gap
    } else {
      top = rect.bottom + gap
      left = rect.left + rect.width / 2 - tooltipWidth / 2
    }

    var maxLeft = window.innerWidth - tooltipWidth - padding
    var maxTop = window.innerHeight - tooltipHeight - padding
    left = Math.max(padding, Math.min(left, maxLeft))
    top = Math.max(padding, Math.min(top, maxTop))

    tooltipEl.style.position = 'fixed'
    tooltipEl.style.top = top + 'px'
    tooltipEl.style.left = left + 'px'
    tooltipEl.style.width = tooltipWidth + 'px'
  } catch (_) {
    /* silent */
  }
}

function updateDots(dotsRoot, total, currentIndex) {
  try {
    if (!dotsRoot) return
    while (dotsRoot.firstChild) dotsRoot.removeChild(dotsRoot.firstChild)
    for (var d = 0; d < total; d++) {
      var dot = document.createElement('span')
      dot.className = 'tk-dot'
      if (d < currentIndex) dot.className += ' done'
      if (d === currentIndex) dot.className += ' active'
      dotsRoot.appendChild(dot)
    }
  } catch (_) {}
}

function updateTooltipContent(ttl, msg, dotsRoot, step, logicalIndexZero, steps) {
  try {
    var total = steps.length
    var n = logicalIndexZero + 1
    updateDots(dotsRoot, total, logicalIndexZero)

    var titleTxt = ''
    try {
      if (step.title && String(step.title).trim()) titleTxt = String(step.title).trim()
      else titleTxt = 'Step ' + n
    } catch (_) {
      titleTxt = 'Step'
    }
    ttl.textContent = titleTxt
    msg.textContent = step.message ? String(step.message) : ''
  } catch (_) {
    /* silent */
  }
}

export function startTour(stepsSorted, scriptKey, apiBase, customization, sessionId, isDemo, startIndex, sessionKey) {
  try {
    if (!scriptKey || !apiBase) return

    var storageKey = ''
    try {
      storageKey = sessionKey != null && String(sessionKey).trim() ? String(sessionKey).trim() : ''
    } catch (_) {
      storageKey = ''
    }
    if (!storageKey) {
      try {
        var cp = ''
        try {
          cp = String(window.location.pathname || '')
        } catch (_) {
          cp = ''
        }
        var pp = ''
        try {
          pp = cp.replace(/\//g, '_').replace(/[^a-zA-Z0-9_-]/g, '')
        } catch (_) {
          pp = ''
        }
        storageKey = 'tourkit_seen_' + scriptKey + '_' + pp
      } catch (_) {
        storageKey = 'tourkit_seen_' + scriptKey + '_'
      }
    }

    injectStylesOnce()
    applyCustomization(customization)

    var steps = Array.isArray(stepsSorted) ? stepsSorted.slice() : []
    if (!steps.length) return

    var startIdx = 0
    try {
      startIdx = Number(startIndex)
      if (!Number.isFinite(startIdx)) startIdx = 0
    } catch (_) {
      startIdx = 0
    }
    startIdx = Math.floor(startIdx)
    if (startIdx < 0) startIdx = 0
    if (startIdx >= steps.length) startIdx = 0

    var overlayPieces = []
    var tooltip = document.createElement('div')
    tooltip.className = 'tk-tooltip'

    var dotsRoot = document.createElement('div')
    dotsRoot.className = 'tk-dots'

    var content = document.createElement('div')
    content.className = 'tk-content'

    var ttl = document.createElement('h3')
    ttl.className = 'tk-title'

    var msg = document.createElement('p')
    msg.className = 'tk-message'

    content.appendChild(ttl)
    content.appendChild(msg)

    var footer = document.createElement('div')
    footer.className = 'tk-footer'

    var skipLeft = document.createElement('div')
    skipLeft.className = 'tk-footer-left'

    var btnSkip = document.createElement('button')
    btnSkip.type = 'button'
    btnSkip.className = 'tk-skip'
    btnSkip.textContent = 'Skip tour'

    var nav = document.createElement('div')
    nav.className = 'tk-nav'

    var btnPrev = document.createElement('button')
    btnPrev.type = 'button'
    btnPrev.className = 'tk-prev'
    btnPrev.textContent = '← Prev'

    var btnNext = document.createElement('button')
    btnNext.type = 'button'
    btnNext.className = 'tk-next'
    btnNext.textContent = 'Next →'

    nav.appendChild(btnPrev)
    nav.appendChild(btnNext)
    skipLeft.appendChild(btnSkip)
    footer.appendChild(skipLeft)
    footer.appendChild(nav)

    tooltip.appendChild(dotsRoot)
    tooltip.appendChild(content)
    tooltip.appendChild(footer)

    document.body.appendChild(tooltip)

    var currentIdx = startIdx
    var destroyed = false
    var tourStartedSent = false
    var pendingRaf = 0
    var previousElement = null
    var currentElement = null
    var stepGen = 0

    function teardownListeners() {
      try {
        window.removeEventListener('scroll', scheduleReflow, true)
        window.removeEventListener('resize', scheduleReflow)
      } catch (_) {}
    }

    function removeSpotlight() {
      try {
        while (overlayPieces.length) {
          var p = overlayPieces.pop()
          try {
            if (p && p.parentNode) p.parentNode.removeChild(p)
          } catch (_) {}
        }
      } catch (_) {}
    }

    function removeNodes() {
      try {
        if (previousElement) restoreElementStyles(previousElement)
        previousElement = null
        currentElement = null
      } catch (_) {}
      try {
        if (tooltip.parentNode) tooltip.parentNode.removeChild(tooltip)
      } catch (_) {}
      removeSpotlight()
    }

    function destroyQuiet(markSeen) {
      if (destroyed) return
      destroyed = true
      stepGen += 1
      teardownListeners()
      cancelAnimationFrameMaybe()
      try {
        if (
          markSeen &&
          !isDemo &&
          typeof window !== 'undefined' &&
          window.__TOURKIT_DEMO__ !== true &&
          storageKey
        ) {
          try {
            window.localStorage.setItem(storageKey, '1')
          } catch (e) {
            /* silent */
          }
        }
      } catch (_) {
        /* silent */
      }
      removeNodes()
    }

    function cancelAnimationFrameMaybe() {
      try {
        if (pendingRaf) cancelAnimationFrame(pendingRaf)
      } catch (_) {}
      pendingRaf = 0
    }

    function skipTour() {
      if (destroyed) return
      var lastIx = steps.length - 1
      if (currentIdx >= lastIx) return
      var cs = steps[currentIdx]
      var ord = cs ? orderFor(cs) : currentIdx
      pingEvent(apiBase, scriptKey, 'tour_skipped', ord === null ? null : ord, sessionId, isDemo)
      destroyQuiet(true)
    }

    function onSpotlightClick() {
      if (destroyed) return
      var lastIx = steps.length - 1
      if (currentIdx >= lastIx) {
        var active = steps[currentIdx]
        var ordFinish = active ? orderFor(active) : currentIdx
        pingEvent(apiBase, scriptKey, 'tour_completed', ordFinish === null ? null : ordFinish, sessionId, isDemo)
        destroyQuiet(true)
        return
      }
      skipTour()
    }

    function updateFooterUi(idx) {
      try {
        var lastIx = steps.length - 1
        var isFirst = idx <= 0
        var isLast = idx >= lastIx

        if (isLast) {
          btnSkip.style.display = 'none'
          btnSkip.setAttribute('aria-hidden', 'true')
        } else {
          btnSkip.style.display = 'inline-block'
          btnSkip.removeAttribute('aria-hidden')
          btnSkip.textContent = isFirst ? 'Skip tour' : 'Skip'
        }

        btnPrev.style.display = isFirst ? 'none' : 'inline-flex'
        btnNext.textContent = isLast ? 'Got it!' : 'Next →'
      } catch (_) {}
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

    btnSkip.onclick = skipTour

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
        pingEvent(apiBase, scriptKey, 'tour_completed', ordFinish === null ? null : ordFinish, sessionId, isDemo)
        destroyQuiet(true)
        return
      }

      currentIdx += 1
      showStep(currentIdx, false)
    }

    var guardLoops = 0

    function showStep(initialIndex, silent) {
      if (destroyed) return

      if (silent) {
        cancelAnimationFrameMaybe()
        try {
          pendingRaf = requestAnimationFrame(function () {
            pendingRaf = 0
            if (destroyed || !currentElement) return
            try {
              var st = steps[currentIdx]
              var r = currentElement.getBoundingClientRect()
              if (r && r.width > 0 && r.height > 0) {
                createSpotlightOverlay(r, overlayPieces)
                wireSpotlightClicks(overlayPieces, onSpotlightClick)
                positionTooltip(tooltip, currentElement, normalizePosition(st && st.position))
              }
            } catch (_) {}
          })
        } catch (_) {}
        return
      }

      guardLoops = 0
      void runAttempt(initialIndex, false)
    }

    async function runAttempt(initialIndex, sil) {
      var myGen = ++stepGen
      if (destroyed) return

      var loops = 0
      var i = initialIndex
      var step = null
      var el = null
      var rect = null

      while (i < steps.length && loops++ < steps.length + 20) {
        if (destroyed || myGen !== stepGen) return
        step = steps[i]
        var sel = ''
        try {
          sel = step && step.selector ? String(step.selector).trim() : ''
        } catch (_) {
          sel = ''
        }
        if (!sel || !step) {
          i += 1
          continue
        }

        el = null
        try {
          el = document.querySelector(sel)
        } catch (_) {
          el = null
        }
        if (!el) {
          i += 1
          continue
        }

        rect = null
        try {
          rect = el.getBoundingClientRect()
        } catch (_) {
          rect = null
        }
        if (!rect || rect.width <= 0 || rect.height <= 0) {
          i += 1
          continue
        }

        break
      }

      if (i >= steps.length || !step || !el || !rect) return destroyQuiet(false)
      if (destroyed || myGen !== stepGen) return

      try {
        if (!sil && tooltip.parentNode && previousElement !== null && previousElement !== el) {
          tooltip.style.transition = 'opacity 0.25s ease, transform 0.25s ease'
          tooltip.style.opacity = '0'
          tooltip.style.transform = 'translateY(4px)'
          await sleep(150)
          if (destroyed || myGen !== stepGen) return
        }
      } catch (_) {}

      try {
        if (previousElement && previousElement !== el) restoreElementStyles(previousElement)
      } catch (_) {}

      try {
        el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' })
      } catch (_) {
        try {
          el.scrollIntoView()
        } catch (_) {}
      }

      await sleep(sil ? 0 : 300)
      if (destroyed || myGen !== stepGen) return

      try {
        rect = el.getBoundingClientRect()
      } catch (_) {
        rect = null
      }
      if (!rect || rect.width <= 0 || rect.height <= 0) {
        void runAttempt(i + 1, true)
        return
      }

      applyHighlight(el)
      createSpotlightOverlay(rect, overlayPieces)
      wireSpotlightClicks(overlayPieces, onSpotlightClick)

      updateTooltipContent(ttl, msg, dotsRoot, step, i, steps)

      tooltip.style.display = 'block'
      positionTooltip(tooltip, el, step.position)

      try {
        tooltip.style.transition = 'none'
        tooltip.style.opacity = '0'
        tooltip.style.transform = 'translateY(8px)'
        requestAnimationFrame(function () {
          try {
            if (destroyed || myGen !== stepGen) return
            tooltip.style.transition = 'opacity 0.25s ease, transform 0.25s ease'
            tooltip.style.opacity = '1'
            tooltip.style.transform = 'translateY(0)'
          } catch (_) {}
        })
      } catch (_) {}

      if (!sil && !tourStartedSent) {
        tourStartedSent = true
        pingEvent(apiBase, scriptKey, 'tour_started', orderFor(step), sessionId, isDemo)
      }
      if (!sil) pingEvent(apiBase, scriptKey, 'step_viewed', orderFor(step), sessionId, isDemo)

      currentIdx = i
      previousElement = el
      currentElement = el

      updateFooterUi(currentIdx)
    }

    showStep(currentIdx, false)
  } catch (_) {
    /* silent */
  }
}
