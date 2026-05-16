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

    function stepHasUrlPattern(step) {
      try {
        return Boolean(step && step.url_pattern && String(step.url_pattern).trim())
      } catch (_) {
        return false
      }
    }

    function urlPatternMatchesPath(pattern, currentPath) {
      try {
        var p = String(pattern || '').trim()
        if (!p) return false
        var pathStr = String(currentPath || '')
        if (pathStr === p) return true
        if (p.length > 0 && p.charAt(p.length - 1) === '*') {
          return pathStr.indexOf(p.slice(0, -1)) === 0
        }
        return pathStr.indexOf(p) !== -1
      } catch (_) {
        return false
      }
    }

    /**
     * Option B: path-specific steps only on matching pages; otherwise generic (no url_pattern) steps.
     * @param {Array<{ url_pattern?: string|null }>} steps
     * @param {string} currentPath
     */
    function filterStepsForPath(steps, currentPath) {
      try {
        var pathStr = String(currentPath || '')
        var hasUrlTriggers = false
        try {
          hasUrlTriggers = steps.some(function (s) {
            return stepHasUrlPattern(s)
          })
        } catch (_) {
          hasUrlTriggers = false
        }
        if (!hasUrlTriggers) return steps

        var pathSpecificSteps = []
        try {
          pathSpecificSteps = steps.filter(function (step) {
            try {
              if (!stepHasUrlPattern(step)) return false
              return urlPatternMatchesPath(step.url_pattern, pathStr)
            } catch (_) {
              return false
            }
          })
        } catch (_) {
          pathSpecificSteps = []
        }

        if (pathSpecificSteps.length > 0) {
          return pathSpecificSteps
        }

        try {
          return steps.filter(function (s) {
            try {
              return !stepHasUrlPattern(s)
            } catch (_) {
              return true
            }
          })
        } catch (_) {
          return steps
        }
      } catch (e) {
        return steps
      }
    }

    /**
     * @param {Array<{ url_pattern?: string|null }>} steps
     * @param {string} path
     */
    function findStartIndex(steps, path) {
      try {
        var p = String(path || '')
        var hasUrlTriggers = false
        try {
          hasUrlTriggers = steps.some(function (s) {
            return stepHasUrlPattern(s)
          })
        } catch (_) {
          hasUrlTriggers = false
        }
        if (!hasUrlTriggers) return 0

        var matchIndex = -1
        try {
          matchIndex = steps.findIndex(function (step) {
            try {
              if (!stepHasUrlPattern(step)) return false
              return urlPatternMatchesPath(step.url_pattern, p)
            } catch (_) {
              return false
            }
          })
        } catch (_) {
          matchIndex = -1
        }
        return matchIndex !== -1 ? matchIndex : 0
      } catch (e) {
        return 0
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
    var isLoading = false
    var loadCallbacks = []

    function getConfig() {
      if (cachedConfig) return Promise.resolve(cachedConfig)
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
          if (config && !config.error) {
            cachedConfig = config
          }
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

    function startForPath(path, options) {
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

        var forceFromFirst = Boolean(options && options.forceFromFirst)

        var sessionKey = buildSessionKey(SCRIPT_KEY, currentPath)

        var isDemo = isDemoGlobal
        try {
          if (typeof window !== 'undefined' && window.__TOURKIT_DEMO__ === true) isDemo = true
        } catch (_) {}

        try {
          if (!isDemo && window.localStorage.getItem(sessionKey) === '1') return
        } catch (_) {
          /* silent */
        }

        getConfig()
          .then(function (config) {
            try {
              if (!config || config.error) return
              if (config.is_active === false) return
              if (!Array.isArray(config.steps) || !config.steps.length) return
              try {
                if (config.tour && typeof config.tour === 'object' && config.tour.is_active === false) return
              } catch (_) {
                /* silent */
              }

              try {
                if (typeof window.__TOURKIT_DESTROY__ === 'function') {
                  window.__TOURKIT_DESTROY__()
                }
              } catch (_) {}

              var merged = mergeDetected(config.steps)
              if (!merged.length) return

              var filtered = []
              try {
                filtered = filterStepsForPath(merged, currentPath)
              } catch (_) {
                filtered = merged
              }
              if (!filtered.length) return

              var startIndex = 0
              if (!forceFromFirst) {
                try {
                  startIndex = findStartIndex(filtered, currentPath)
                } catch (_) {
                  startIndex = 0
                }
              }

              var apiBaseResolved = API_BASE || config.api_base || TK_API_ORIGIN

              startTour(
                filtered,
                SCRIPT_KEY,
                apiBaseResolved,
                config.customization || null,
                sessionIdForAnalytics,
                isDemo,
                startIndex,
                sessionKey,
              )
            } catch (e) {
              /* silent */
            }
          })
          .catch(function () {})
      } catch (e) {
        /* silent */
      }
    }

    window.TourKit = {
      startFor: function (path) {
        try {
          startForPath(path, null)
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
          startForPath(p, { forceFromFirst: true })
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
          var sessionKey = buildSessionKey(SCRIPT_KEY, p)
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

    try {
      if (!isDemoGlobal) {
        setTimeout(function () {
          try {
            if (window.TourKit && typeof window.TourKit.startFor === 'function') {
              window.TourKit.startFor(window.location.pathname)
            }
          } catch (_) {}
        }, 500)
      }
    } catch (_) {
      /* silent */
    }
  } catch (_) {
    /* silent */
  }
})()
