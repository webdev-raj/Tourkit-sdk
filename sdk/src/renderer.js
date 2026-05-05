import { pingEvent } from './tracker.js'

/** @typedef {{ id?: string, selector: string, title?: string|null, message: string, position?: string, step_order?: number }} TourStep */

var CSS_SNIPPET = [
  '.tk-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:99998;}',
  '.tk-highlight{position:fixed;border:2px solid #F15025;border-radius:6px;z-index:99999;pointer-events:none;box-shadow:0 0 0 4px rgba(241,80,37,0.2);transition:all 0.3s ease;}',
  '.tk-tooltip{position:fixed;background:#111;color:#fff;border:1px solid #222;border-radius:10px;padding:20px 24px;max-width:320px;width:320px;z-index:100000;font-family:system-ui,-apple-system,sans-serif;font-size:14px;line-height:1.5;box-sizing:border-box;box-shadow:0 8px 32px rgba(0,0,0,0.4);}',
  '.tk-tooltip-title{font-size:16px;font-weight:600;margin-bottom:8px;color:#ffffff;}',
  '.tk-tooltip-message{color:#aaaaaa;margin-bottom:16px;}',
  '.tk-tooltip-footer{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;width:100%;}',
  '.tk-tooltip-counter{font-size:12px;color:#666;text-align:center;flex:1;min-width:0;}',
  '.tk-tooltip-nav{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin-left:auto;}',
  '.tk-btn{padding:8px 16px;border-radius:6px;font-size:13px;font-weight:500;cursor:pointer;border:none;font:inherit;}',
  '.tk-btn-primary{background:#F15025;color:#fff;}',
  '.tk-btn-ghost{background:transparent;color:#aaa;border:1px solid #333;}',
].join('')

function injectStylesOnce() {
  try {
    if (document.head && document.getElementById('tourkit-sdk-styles')) return
    var tag = document.createElement('style')
    tag.id = 'tourkit-sdk-styles'
    tag.textContent = CSS_SNIPPET
    if (document.head) document.head.appendChild(tag)
  } catch (_) {
    /* silent */
  }
}

/**
 * @param {string|null|undefined} p
 * @returns {'top'|'bottom'|'left'|'right'}
 */
function normalizePosition(p) {
  var v = (String(p || 'bottom') + '').toLowerCase()
  if (v === 'top' || v === 'left' || v === 'right') return v
  return 'bottom'
}

/**
 * @param {number} left
 * @param {number} top
 * @param {number} w
 * @param {number} h
 * @returns {[number, number]}
 */
function clampViewport(left, top, w, h) {
  var pad = 8
  var maxL = Math.max(pad, window.innerWidth - w - pad)
  var maxT = Math.max(pad, window.innerHeight - h - pad)
  left = Math.min(Math.max(left, pad), maxL)
  top = Math.min(Math.max(top, pad), maxT)
  return [left, top]
}

/**
 * @param {TourStep[]} stepsSorted
 * @param {{ scriptKey?: string }} opts
 */
export function startTour(stepsSorted, opts) {
  try {
    var scriptKey = (opts && opts.scriptKey) || ''
    if (!scriptKey) return

    injectStylesOnce()

    var steps = Array.isArray(stepsSorted) ? stepsSorted.slice() : []
    if (!steps.length) return

    var overlay = document.createElement('div')
    overlay.className = 'tk-overlay'

    var highlight = document.createElement('div')
    highlight.className = 'tk-highlight'

    var tooltip = document.createElement('div')
    tooltip.className = 'tk-tooltip'

    tooltip.innerHTML = ''
    tooltip.className = 'tk-tooltip'

    var ttl = document.createElement('div')
    ttl.className = 'tk-tooltip-title'

    var msg = document.createElement('div')
    msg.className = 'tk-tooltip-message'

    var footer = document.createElement('div')
    footer.className = 'tk-tooltip-footer'

    var btnSkip = document.createElement('button')
    btnSkip.type = 'button'
    btnSkip.className = 'tk-btn tk-btn-ghost'
    btnSkip.textContent = 'Skip'

    var counter = document.createElement('div')
    counter.className = 'tk-tooltip-counter'

    var nav = document.createElement('div')
    nav.className = 'tk-tooltip-nav'

    var btnPrev = document.createElement('button')
    btnPrev.type = 'button'
    btnPrev.className = 'tk-btn tk-btn-ghost'
    btnPrev.textContent = 'Prev'

    var btnNext = document.createElement('button')
    btnNext.type = 'button'
    btnNext.className = 'tk-btn tk-btn-primary'
    btnNext.textContent = 'Next'

    nav.appendChild(btnPrev)
    nav.appendChild(btnNext)

    footer.appendChild(btnSkip)
    footer.appendChild(counter)
    footer.appendChild(nav)

    tooltip.appendChild(ttl)
    tooltip.appendChild(msg)
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
      } catch (_) {
        /* silent */
      }
    }

    function removeNodes() {
      try {
        if (tooltip.parentNode) tooltip.parentNode.removeChild(tooltip)
        if (highlight.parentNode) highlight.parentNode.removeChild(highlight)
        if (overlay.parentNode) overlay.parentNode.removeChild(overlay)
      } catch (_) {
        /* silent */
      }
    }

    /** @param {boolean} markSeen */
    function destroyQuiet(markSeen) {
      if (destroyed) return
      destroyed = true
      teardownListeners()
      cancelAnimationFrameMaybe()
      try {
        if (markSeen) window.localStorage.setItem('tourkit_seen_' + scriptKey, '1')
      } catch (_) {
        /* silent */
      }
      removeNodes()
    }

    function cancelAnimationFrameMaybe() {
      try {
        if (pendingRaf) cancelAnimationFrame(pendingRaf)
      } catch (_) {
        /* silent */
      }
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
      } catch (_) {
        /* silent */
      }
    }

    window.addEventListener('scroll', scheduleReflow, true)
    window.addEventListener('resize', scheduleReflow)

    /**
     * @param {TourStep} step
     */
    function orderFor(step) {
      try {
        if (step && typeof step.step_order === 'number' && Number.isFinite(step.step_order)) return step.step_order
      } catch (_) {
        /* ignore */
      }

      try {
        if (steps.indexOf(step) >= 0) return steps.indexOf(step)
      } catch (_) {
        /* ignore */
      }

      return null
    }

    /** @param {DOMRect} rect */
    function layoutHighlight(rect) {
      highlight.style.display = 'block'
      highlight.style.left = rect.left + 'px'
      highlight.style.top = rect.top + 'px'
      highlight.style.width = rect.width + 'px'
      highlight.style.height = rect.height + 'px'
    }

    /**
     * @param {DOMRect} elRect
     * @param {TourStep} step
     */
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
        /** right */
        left = elRect.right + gap
        top = elRect.top + elRect.height / 2 - ttH / 2
      }

      tooltip.style.left = left + 'px'
      tooltip.style.top = top + 'px'

      var titleTxt = ''
      try {
        if (step.title && String(step.title).trim()) titleTxt = String(step.title).trim()
        else titleTxt = 'Step ' + (logicalIndexZero + 1)
      } catch (_) {
        titleTxt = 'Step'
      }

      ttl.textContent = titleTxt
      msg.textContent = step.message ? String(step.message) : ''

      var total = steps.length
      var n = logicalIndexZero + 1
      counter.textContent = n + ' of ' + total

      var tw = tooltip.offsetWidth || ttW
      var th = tooltip.offsetHeight || ttH

      left = parseFloat(tooltip.style.left || '0') || 0
      top = parseFloat(tooltip.style.top || '0') || 0
      var cl = clampViewport(left, top, tw, th)
      tooltip.style.left = cl[0] + 'px'
      tooltip.style.top = cl[1] + 'px'
    }

    btnSkip.onclick = function () {
      if (destroyed) return
      var cs = steps[currentIdx]
      var ord = cs ? orderFor(cs) : currentIdx

      pingEvent(scriptKey, 'tour_skipped', ord === null ? null : ord)

      destroyQuiet(true)
    }

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
        pingEvent(scriptKey, 'tour_completed', ordFinish === null ? null : ordFinish)

        destroyQuiet(true)
        return
      }

      currentIdx += 1

      showStep(currentIdx, false)
    }

    var guardLoops = 0

    /**
     * @param {boolean} silent — true on layout-only reflow or auto-skipped missing targets (no pings)
     */
    function showStep(initialIndex, silent) {
      if (destroyed) return

      guardLoops = 0
      attempt(initialIndex, silent)

      function attempt(i, sil) {
        if (destroyed) return

        if (i >= steps.length) {
          destroyQuiet(false)
          return
        }

        if (guardLoops++ > steps.length + 20) {
          destroyQuiet(false)
          return
        }

        var step = steps[i]
        var sel = ''

        try {
          sel = step && step.selector ? String(step.selector).trim() : ''
        } catch (_) {
          sel = ''
        }

        if (!sel || !step) {
          attempt(i + 1, true)

          return
        }

        var el = null
        try {
          el = document.querySelector(sel)
        } catch (_) {
          el = null
        }

        if (!el) {
          attempt(i + 1, true)

          return
        }

        try {
          el.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' })
        } catch (_) {
          try {
            el.scrollIntoView()
          } catch (_) {
            /* silent */
          }
        }

        var rect = null
        try {
          rect = el.getBoundingClientRect()
        } catch (_) {
          rect = null
        }

        if (!rect || rect.width <= 0 || rect.height <= 0) {
          attempt(i + 1, true)

          return
        }

        layoutHighlight(rect)

        layoutTooltip(rect, step, i)

        if (!sil && !tourStartedSent) {
          tourStartedSent = true

          pingEvent(scriptKey, 'tour_started', orderFor(step))
        }

        if (!sil) pingEvent(scriptKey, 'step_viewed', orderFor(step))

        currentIdx = i

        btnPrev.style.visibility = currentIdx <= 0 ? 'hidden' : 'visible'

        btnNext.textContent = currentIdx >= steps.length - 1 ? 'Finish' : 'Next'
      }
    }

    showStep(0, false)
  } catch (_) {
    /* silent */
  }
}
