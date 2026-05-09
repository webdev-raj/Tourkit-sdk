import { TK_API_ORIGIN } from './config.js'
import { detectElements } from './scanner.js'
import { startTour } from './renderer.js'

;(function tourkitBootstrap() {
  try {
    /**
     * Async script tags do not get document.currentScript — walk scripts for data-key.
     * @returns {string}
     */
    function getScriptDatasetKey() {
      try {
        var scripts = document.getElementsByTagName('script')

        for (var i = scripts.length - 1; i >= 0; i--) {
          var s = scripts[i]
          if (!s || !s.getAttribute) continue
          var k = s.getAttribute('data-key')
          if (k && String(k).trim()) return String(k).trim()
        }
      } catch (_) {
        /* silent */
      }

      return ''
    }

    /**
     * API steps win; detectElements() fills missing selectors by index.
     * @param {Array<{ id?: string, selector?: string, title?: string|null, message: string, position?: string, step_order?: number }>} apiSteps
     */
    function mergeDetected(apiSteps) {
      try {
        var sorted = apiSteps.slice().sort(function (a, b) {
          var ao = Number(a && a.step_order)
          var bo = Number(b && b.step_order)
          if (!Number.isFinite(ao)) ao = 0
          if (!Number.isFinite(bo)) bo = 0
          return ao - bo
        })

        var detected = []
        try {
          detected = detectElements()
        } catch (_) {
          detected = []
        }

        var out = []

        for (var i = 0; i < sorted.length; i++) {
          var step = sorted[i]
          var sel = ''

          try {
            sel = step && step.selector ? String(step.selector).trim() : ''
          } catch (_) {
            sel = ''
          }

          var alt = ''
          try {
            alt = detected[i] || ''
          } catch (_) {
            alt = ''
          }

          var mergedSel = (sel || alt || '').trim()
          if (!mergedSel) continue

          /** @type {number|undefined} */
          var so = undefined

          try {
            if (typeof step.step_order === 'number' && Number.isFinite(step.step_order)) so = step.step_order
            else if (
              typeof step.step_order === 'string' &&
              Number.isFinite(Number(step.step_order)) &&
              `${step.step_order}`.trim() !== ''
            )
              so = Number(step.step_order)
          } catch (_) {
            so = undefined
          }

          var row = {
            id: step.id,
            selector: mergedSel,
            title: step.title,
            message: step.message ? String(step.message) : '',
            position: step.position,
            step_order: so,
          }

          /** schema requires message; skip broken rows silently */
          if (!row.message) continue

          out.push(row)
        }

        return out
      } catch (_) {
        return []
      }
    }

    function getSessionId() {
      try {
        var sid = sessionStorage.getItem('tourkit_sid')
        if (!sid) {
          sid = 'tk_' + Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2)
          sessionStorage.setItem('tourkit_sid', sid)
        }
        return sid
      } catch (_) {
        return 'tk_' + Math.random().toString(36).slice(2)
      }
    }

    function main() {
      try {
        var key = getScriptDatasetKey()
        if (!key) return
        var sessionId = getSessionId()

        try {
          if (window.localStorage.getItem('tourkit_seen_' + key) === '1') return
        } catch (_) {
          /* silent */
        }

        fetch(TK_API_ORIGIN + '/api/tour/' + encodeURIComponent(key), {
          credentials: 'omit',
          cache: 'no-store',
          mode: 'cors',
        })
          .then(function (res) {
            if (!res.ok) return null
            return res.json()
          })
          .then(function (data) {
            if (!data || data.error) return
            if (data.is_active === false) return
            if (!Array.isArray(data.steps) || data.steps.length === 0) return

            try {
              if (data.tour && typeof data.tour === 'object' && data.tour.is_active === false) return
            } catch (_) {
              /* silent */
            }

            var merged = mergeDetected(data.steps)

            if (!merged.length) return

            var apiBase = data.api_base || TK_API_ORIGIN
            startTour(merged, key, apiBase, data.customization || null, sessionId)
          })
          .catch(function () {})
      } catch (_) {
        /* silent */
      }
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', main)
    } else {
      main()
    }
  } catch (_) {
    /* silent */
  }
})()
