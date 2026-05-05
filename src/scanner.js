/**
 * @param {Element|null} el
 * @returns {boolean}
 */
export function elementIsVisible(el) {
  try {
    if (!el || el.nodeType !== 1 || !document.contains(el)) return false
    var rect = el.getBoundingClientRect()
    if (rect.width <= 0 || rect.height <= 0) return false
    var style = window.getComputedStyle(el)
    if (style.visibility === 'hidden' || style.display === 'none' || Number(style.opacity) === 0) return false

    /** @type {HTMLElement} */
    var hel = /** @type {HTMLElement} */ (el)
    if (hel.offsetParent === null && style.position !== 'fixed' && style.position !== 'sticky') return false

    return true
  } catch (_) {
    return false
  }
}

/**
 * @param {string[]} selectorList
 * @returns {string}
 */
function pickFirstVisible(selectorList) {
  for (var i = 0; i < selectorList.length; i++) {
    try {
      var sel = selectorList[i]
      var node = document.querySelector(sel)
      if (elementIsVisible(node)) return sel
    } catch (_) {
      /* silent */
    }
  }
  return ''
}

var CTA_RE = /\b(get started|sign up|signup|subscribe)\b|\b(create|join)\b|\bnew\b|\bstart\b|\btry\b/i

/**
 * @param {Element} el
 * @returns {string}
 */
function escapeIdSel(idStr) {
  if (typeof window !== 'undefined' && window.CSS && typeof window.CSS.escape === 'function') {
    try {
      return window.CSS.escape(String(idStr))
    } catch (_) {
      /* fall through */
    }
  }
  return String(idStr).replace(/\\/g, '\\\\').replace(/([\0-\\x1F\x7f#.,:[\] \s])/g, '\\$1')
}

/**
 * @param {Element} el
 * @returns {string}
 */
export function stableSelector(el) {
  try {
    if (!(el instanceof Element)) return ''

    /** @type {HTMLElement} */
    var h = /** @type {HTMLElement} */ (el)
    var idRaw = typeof h.id === 'string' ? h.id.trim() : ''
    if (idRaw && document.querySelectorAll('#' + escapeIdSel(idRaw)).length === 1)
      return '#' + escapeIdSel(idRaw)

    var cur = el
    var segments = []

    while (cur && cur !== document.documentElement && segments.length < 6) {
      var tag = cur.tagName ? cur.tagName.toLowerCase() : 'div'
      var parentEl = cur.parentElement
      if (!parentEl) break

      var idx = 1
      for (var child = cur.previousElementSibling; child; child = child.previousElementSibling) {
        if (child.tagName === cur.tagName) idx++
      }

      segments.unshift(tag + ':nth-of-type(' + idx + ')')
      cur = parentEl
    }

    return segments.join(' > ')
  } catch (_) {
    return ''
  }
}

/**
 * Ordered DOM discovery (max 5). API-provided selectors take priority at merge site.
 * @returns {string[]}
 */
export function detectElements() {
  var out = []

  try {
    var p1 = pickFirstVisible(['nav', 'header', '[role="navigation"]'])
    if (p1) out.push(p1)

    var p2 = pickFirstVisible(['main', '[role="main"]', '#app'])
    if (p2 && out.indexOf(p2) === -1 && out.length < 5) out.push(p2)

    try {
      var root = document.querySelector('#root')
      var fc = root && root.firstElementChild instanceof Element ? root.firstElementChild : null
      if (fc && elementIsVisible(fc)) {
        var sr = stableSelector(fc)
        if (sr && out.indexOf(sr) === -1 && out.length < 5) out.push(sr)
      }
    } catch (_) {
      /* silent */
    }

    try {
      var nodes = document.querySelectorAll('button, a[href]')
      var foundSel = ''

      for (var i = 0; i < nodes.length && out.length < 5; i++) {
        var n = nodes[i]
        if (!(n instanceof Element) || !elementIsVisible(n)) continue
        var txt = ((n.innerText || n.textContent || '') + '').trim().slice(0, 280)
        if (!txt || !CTA_RE.test(txt.toLowerCase())) continue

        foundSel = stableSelector(n)
        break
      }

      if (foundSel && out.indexOf(foundSel) === -1 && out.length < 5) out.push(foundSel)
    } catch (_) {
      /* silent */
    }

    var p5 = pickFirstVisible(['aside', '[role="complementary"]'])
    if (p5 && out.indexOf(p5) === -1 && out.length < 5) out.push(p5)

    var p6 = pickFirstVisible(['footer'])
    if (p6 && out.indexOf(p6) === -1 && out.length < 5) out.push(p6)
  } catch (_) {
    /* silent */
  }

  return out.slice(0, 5)
}
