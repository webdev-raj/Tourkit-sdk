// TourKit SDK v11
import { TK_API_ORIGIN } from './config.js'
import { detectElements } from './scanner.js'
import { startTour } from './renderer.js'
import { buildSessionKey, tourkitSeenPrefix } from './session-key.js'

;(function tourkitBootstrap() {
  try {
    var SCRIPT_KEY = ''
    var API_BASE = ''
    var IS_DEMO = false

    try {
      if (document.currentScript && document.currentScript.getAttribute) {
        SCRIPT_KEY = String(document.currentScript.getAttribute('data-key') || '').trim()
        API_BASE = String(document.currentScript.getAttribute('data-api') || '').trim()
        IS_DEMO = document.currentScript.getAttribute('data-demo') === 'true'
      }

      if (!SCRIPT_KEY) {
        var scripts = document.getElementsByTagName('script')
        for (var si = scripts.length - 1; si >= 0; si--) {
          var sc = scripts[si]
          if (!sc || !sc.getAttribute) continue
          var kk = String(sc.getAttribute('data-key') || '').trim()
          if (!kk) continue
          SCRIPT_KEY = kk
          API_BASE = String(sc.getAttribute('data-api') || '').trim()
          IS_DEMO = sc.getAttribute('data-demo') === 'true'
          break
        }
      }
    } catch (_) {
      /* silent */
    }

    var fetchOrigin = API_BASE || TK_API_ORIGIN
    try {
      fetchOrigin = String(fetchOrigin || '').replace(/\/$/, '')
    } catch (_) {
      fetchOrigin = TK_API_ORIGIN
    }

    if (!SCRIPT_KEY || !fetchOrigin) return

    var isDemoGlobal = Boolean(IS_DEMO)
    try {
      if (typeof window !== 'undefined' && window.__TOURKIT_DEMO__ === true) isDemoGlobal = true
    } catch (_) {}

    var sessionIdForAnalytics = (function () {
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
    })()

    function isContextAwareMode(steps) {
      try {
        return steps.some(function (s) {
          try {
            return Boolean(s && s.url_pattern && String(s.url_pattern).trim().length > 0)
          } catch (_) {
            return false
          }
        })
      } catch (e) {
        return false
      }
    }

    /**
     * Context-aware: steps without url_pattern = root (/) only.
     * Steps with url_pattern = matching path only. No match = empty (no tour).
     * @param {Array<{ url_pattern?: string|null }>} steps
     * @param {string} currentPath
     */
    function filterStepsForPath(steps, currentPath) {
      try {
        if (!isContextAwareMode(steps)) return steps

        var pathStr = String(currentPath || '')

        var matchingSteps = []
        try {
          matchingSteps = steps.filter(function (step) {
            try {
              if (step && step.url_pattern && String(step.url_pattern).trim()) {
                var pattern = String(step.url_pattern).trim()

                if (pathStr === pattern) return true

                if (pattern.length > 0 && pattern.charAt(pattern.length - 1) === '*') {
                  return pathStr.indexOf(pattern.slice(0, -1)) === 0
                }

                if (pathStr.indexOf(pattern) === 0) return true

                return false
              }

              var isRoot = pathStr === '/' || pathStr === '' || pathStr === '/index'
              return isRoot
            } catch (_) {
              return false
            }
          })
        } catch (_) {
          matchingSteps = []
        }

        return matchingSteps
      } catch (e) {
        return steps
      }
    }

    /**
     * @param {Array<{ id?: string, selector?: string, title?: string|null, message: string, position?: string, step_order?: number, url_pattern?: string|null }>} apiSteps
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
            url_pattern: null,
          }

          try {
            if (step && step.url_pattern != null) {
              var up = String(step.url_pattern).trim()
              row.url_pattern = up || null
            }
          } catch (_) {
            row.url_pattern = null
          }

          if (!row.message) continue
          out.push(row)
        }

        return out
      } catch (_) {
        return []
      }
    }

    var cachedConfig = null
    var cachedSteps = []
    var cachedCustomization = null
    var cachedShowBranding = false
    var isLoading = false
    var loadCallbacks = []

    function populateCacheFromConfig(config) {
      try {
        if (!config || config.error) {
          cachedSteps = []
          return false
        }
        cachedConfig = config
        try {
          cachedCustomization = config.customization || null
        } catch (_) {
          cachedCustomization = null
        }
        try {
          if (Array.isArray(config.steps) && config.steps.length) {
            cachedSteps = mergeDetected(config.steps)
          } else {
            cachedSteps = []
          }
        } catch (_) {
          cachedSteps = []
        }
        try {
          cachedShowBranding = config.show_branding === true
        } catch (_) {
          cachedShowBranding = false
        }
        return cachedSteps.length > 0
      } catch (_) {
        cachedSteps = []
        return false
      }
    }

    function getConfig() {
      if (cachedConfig && cachedSteps.length) return Promise.resolve(cachedConfig)
      if (isLoading) {
        return new Promise(function (resolve) {
          loadCallbacks.push(resolve)
        })
      }
      isLoading = true
      return fetch(fetchOrigin + '/api/tour/' + encodeURIComponent(SCRIPT_KEY), {
        credentials: 'omit',
        cache: 'no-store',
        mode: 'cors',
      })
        .then(function (res) {
          if (!res.ok) return null
          return res.json()
        })
        .then(function (config) {
          isLoading = false
          try {
            if (config && !config.error && Array.isArray(config.steps) && config.steps.length) {
              populateCacheFromConfig(config)
            }
          } catch (_) {}
          var cbs = loadCallbacks.slice()
          loadCallbacks = []
          cbs.forEach(function (cb) {
            try {
              cb(cachedConfig)
            } catch (_) {}
          })
          return cachedConfig
        })
        .catch(function () {
          isLoading = false
          var cbs = loadCallbacks.slice()
          loadCallbacks = []
          cbs.forEach(function (cb) {
            try {
              cb(null)
            } catch (_) {}
          })
          return null
        })
    }

    function runTourForPath(currentPath) {
      try {
        var config = cachedConfig
        if (!config || config.error) return
        if (config.is_active === false) return
        if (!cachedSteps.length) return
        try {
          if (config.tour && typeof config.tour === 'object' && config.tour.is_active === false) return
        } catch (_) {
          /* silent */
        }

        var sessionKey = isContextAwareMode(cachedSteps)
          ? buildSessionKey(SCRIPT_KEY, currentPath)
          : 'tourkit_seen_' + SCRIPT_KEY

        var isDemo = isDemoGlobal
        try {
          if (typeof window !== 'undefined' && window.__TOURKIT_DEMO__ === true) isDemo = true
        } catch (_) {}

        try {
          if (!isDemo && window.localStorage.getItem(sessionKey) === '1') return
        } catch (_) {
          /* silent */
        }

        try {
          if (typeof window.__TOURKIT_DESTROY__ === 'function') {
            window.__TOURKIT_DESTROY__()
          }
        } catch (_) {}

        var filteredSteps = []
        try {
          filteredSteps = filterStepsForPath(cachedSteps, currentPath)
        } catch (_) {
          filteredSteps = []
        }

        if (!filteredSteps.length) {
          return
        }

        var apiBaseResolved = API_BASE || config.api_base || TK_API_ORIGIN

        startTour(
          filteredSteps,
          SCRIPT_KEY,
          apiBaseResolved,
          cachedCustomization || null,
          sessionIdForAnalytics,
          isDemo,
          0,
          sessionKey,
          cachedShowBranding,
        )
      } catch (e) {
        /* silent */
      }
    }

    function startForPath(path) {
      try {
        var currentPath = path
        try {
          if (currentPath == null || currentPath === '') {
            currentPath = String(window.location.pathname || '/') || '/'
          } else {
            currentPath = String(currentPath)
          }
        } catch (_) {
          currentPath = '/'
        }

        if (!cachedSteps.length) {
          return getConfig()
            .then(function () {
              if (!cachedSteps.length) {
                return
              }
              runTourForPath(currentPath)
            })
            .catch(function () {})
        }

        runTourForPath(currentPath)
      } catch (e) {
        /* silent */
      }
    }

    window.TourKit = {
      startFor: function (path) {
        try {
          var targetPath = path
          try {
            if (targetPath == null || targetPath === '') {
              targetPath = String(window.location.pathname || '/') || '/'
            } else {
              targetPath = String(targetPath)
            }
          } catch (_) {
            targetPath = '/'
          }

          startForPath(targetPath)
        } catch (e) {
          /* silent */
        }
      },

      start: function () {
        try {
          var p = ''
          try {
            p = String(window.location.pathname || '/') || '/'
          } catch (_) {
            p = '/'
          }
          startForPath(p)
        } catch (e) {
          /* silent */
        }
      },

      destroy: function () {
        try {
          if (typeof window.__TOURKIT_DESTROY__ === 'function') {
            window.__TOURKIT_DESTROY__()
          }
        } catch (e) {
          /* silent */
        }
      },

      reset: function (path) {
        try {
          var p = path
          try {
            if (p == null || p === '') {
              p = String(window.location.pathname || '/') || '/'
            }
          } catch (_) {
            p = '/'
          }
          var sessionKey = isContextAwareMode(cachedSteps)
            ? buildSessionKey(SCRIPT_KEY, p)
            : 'tourkit_seen_' + SCRIPT_KEY
          try {
            window.localStorage.removeItem(sessionKey)
          } catch (e) {
            /* silent */
          }
        } catch (e) {
          /* silent */
        }
      },

      resetAll: function () {
        try {
          var keysToRemove = []
          var i = 0
          for (i = 0; i < window.localStorage.length; i++) {
            var key = window.localStorage.key(i)
            if (key && key.startsWith(tourkitSeenPrefix(SCRIPT_KEY))) {
              keysToRemove.push(key)
            }
          }
          keysToRemove.forEach(function (k) {
            try {
              window.localStorage.removeItem(k)
            } catch (e) {
              /* silent */
            }
          })
        } catch (e) {
          /* silent */
        }
      },
    }

    getConfig()
      .then(function (config) {
        try {
          if (!config || !Array.isArray(config.steps) || !config.steps.length) return
          if (!isDemoGlobal) {
            var autoPath = ''
            try {
              autoPath = String(window.location.pathname || '/') || '/'
            } catch (_) {
              autoPath = '/'
            }
            startForPath(autoPath)
          }
        } catch (_) {}
      })
      .catch(function () {})
  } catch (_) {
    /* silent */
  }
})()
