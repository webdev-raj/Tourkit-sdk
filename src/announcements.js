import { applyCustomization } from './theme.js'

var SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000

var CSS_SNIPPET = [
  '@keyframes tkAnnFadeUp{from{opacity:0;transform:translateY(10px) scale(0.97)}to{opacity:1;transform:translateY(0) scale(1)}}',
  '@keyframes tkAnnFadeIn{from{opacity:0}to{opacity:1}}',
  '@keyframes tkAnnSlideInRight{from{opacity:0;transform:translateX(24px)}to{opacity:1;transform:translateX(0)}}',
  '@keyframes tkAnnSlideInLeft{from{opacity:0;transform:translateX(-24px)}to{opacity:1;transform:translateX(0)}}',
  '@keyframes tkAnnSlideUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}',
  '.tk-ann-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.55);backdrop-filter:blur(2px);-webkit-backdrop-filter:blur(2px);z-index:100050;display:flex;align-items:center;justify-content:center;padding:24px;box-sizing:border-box;animation:tkAnnFadeIn 0.2s ease;}',
  '.tk-ann-card{position:relative;width:100%;background:rgba(10,10,10,0.92);backdrop-filter:blur(20px) saturate(180%);-webkit-backdrop-filter:blur(20px) saturate(180%);border:1px solid rgba(255,255,255,0.06);border-radius:16px;overflow:hidden;font-family:var(--tk-font,Inter),system-ui,sans-serif;box-sizing:border-box;box-shadow:0 0 0 1px rgba(255,255,255,0.04),0 4px 8px rgba(0,0,0,0.3),0 16px 32px rgba(0,0,0,0.4),0 32px 64px rgba(0,0,0,0.5);animation:tkAnnFadeUp 0.2s cubic-bezier(0.4,0,0.2,1);color:var(--tk-text,#fff);}',
  '.tk-ann-card.tk-ann-sm{max-width:380px;}',
  '.tk-ann-card.tk-ann-md{max-width:520px;}',
  '.tk-ann-card.tk-ann-lg{max-width:720px;}',
  '.tk-ann-accent{height:3px;width:100%;background:var(--tk-ann-accent,var(--tk-primary,#F15025));}',
  '.tk-ann-close{position:absolute;top:10px;right:10px;z-index:2;width:28px;height:28px;border:none;border-radius:8px;background:rgba(0,0,0,0.35);color:rgba(255,255,255,0.55);cursor:pointer;display:flex;align-items:center;justify-content:center;padding:0;font-size:16px;line-height:1;font-family:inherit;}',
  '.tk-ann-close:hover{background:rgba(255,255,255,0.08);color:rgba(255,255,255,0.9);}',
  '.tk-ann-img{display:block;width:100%;height:160px;object-fit:cover;}',
  '.tk-ann-layout-left{display:flex;align-items:stretch;}',
  '.tk-ann-layout-left .tk-ann-img{width:42%;min-width:140px;height:auto;min-height:160px;flex-shrink:0;}',
  '.tk-ann-body{padding:20px 22px 22px;}',
  '.tk-ann-title-row{display:flex;align-items:flex-start;gap:8px;padding-right:28px;margin:0 0 8px 0;}',
  '.tk-ann-icon{flex-shrink:0;width:16px;height:16px;margin-top:3px;color:var(--tk-ann-accent,var(--tk-primary,#F15025));}',
  '.tk-ann-title{font-size:18px;font-weight:600;color:rgba(255,255,255,0.95);margin:0;line-height:1.35;letter-spacing:-0.02em;}',
  '.tk-ann-card.tk-ann-md .tk-ann-title,.tk-ann-card.tk-ann-lg .tk-ann-title{font-size:20px;}',
  '.tk-ann-desc{font-size:12.5px;color:rgba(255,255,255,0.45);margin:0;line-height:1.65;font-weight:400;}',
  '.tk-ann-cta{display:inline-flex;align-items:center;justify-content:center;margin-top:16px;padding:8px 14px;border-radius:8px;font-size:12.5px;font-weight:600;cursor:pointer;border:none;background:var(--tk-ann-accent,var(--tk-primary,#F15025));color:#ffffff;font-family:inherit;letter-spacing:0.01em;text-align:center;text-decoration:none;box-sizing:border-box;}',
  '.tk-ann-cta:hover{filter:brightness(1.12);}',
  '.tk-ann-banner{position:fixed;top:0;left:0;right:0;z-index:100040;display:flex;align-items:center;gap:12px;padding:0 16px 0 12px;box-sizing:border-box;background:rgba(10,10,10,0.94);backdrop-filter:blur(20px) saturate(180%);-webkit-backdrop-filter:blur(20px) saturate(180%);border-bottom:1px solid rgba(255,255,255,0.06);font-family:var(--tk-font,Inter),system-ui,sans-serif;color:var(--tk-text,#fff);box-shadow:0 8px 24px rgba(0,0,0,0.35);animation:tkAnnSlideUp 0.25s ease;}',
  '.tk-ann-banner.tk-ann-sm{height:40px;}',
  '.tk-ann-banner.tk-ann-md{height:56px;}',
  '.tk-ann-banner.tk-ann-lg{height:80px;}',
  '.tk-ann-banner .tk-ann-accent{position:absolute;left:0;top:0;bottom:0;width:3px;height:auto;}',
  '.tk-ann-banner .tk-ann-body{display:flex;align-items:center;gap:12px;flex:1;min-width:0;padding:0;}',
  '.tk-ann-banner .tk-ann-title-row{margin:0;padding-right:0;align-items:center;}',
  '.tk-ann-banner .tk-ann-title{font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}',
  '.tk-ann-banner .tk-ann-desc{font-size:12px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:42%;}',
  '.tk-ann-banner .tk-ann-cta{margin-top:0;padding:6px 12px;flex-shrink:0;}',
  '.tk-ann-banner .tk-ann-close{position:static;width:24px;height:24px;flex-shrink:0;background:transparent;}',
  '.tk-ann-banner .tk-ann-thumb{width:48px;height:48px;object-fit:cover;border-radius:8px;flex-shrink:0;}',
  '.tk-ann-slide{position:fixed;bottom:20px;z-index:100045;width:380px;max-width:calc(100vw - 24px);background:rgba(10,10,10,0.92);backdrop-filter:blur(20px) saturate(180%);-webkit-backdrop-filter:blur(20px) saturate(180%);border:1px solid rgba(255,255,255,0.06);border-radius:16px;overflow:hidden;font-family:var(--tk-font,Inter),system-ui,sans-serif;box-shadow:0 16px 40px rgba(0,0,0,0.45);}',
  '.tk-ann-slide.tk-ann-sm{width:300px;}',
  '.tk-ann-slide.tk-ann-md{width:380px;}',
  '.tk-ann-slide.tk-ann-lg{width:460px;}',
  '.tk-ann-slide.tk-ann-br{right:20px;animation:tkAnnSlideInRight 0.28s cubic-bezier(0.4,0,0.2,1);}',
  '.tk-ann-slide.tk-ann-bl{left:20px;animation:tkAnnSlideInLeft 0.28s cubic-bezier(0.4,0,0.2,1);}',
  '.tk-ann-slide .tk-ann-img{height:120px;}',
  '.tk-theme-light .tk-ann-card,.tk-theme-light .tk-ann-banner,.tk-theme-light .tk-ann-slide{background:rgba(255,255,255,0.94);border-color:rgba(0,0,0,0.06);}',
  '.tk-theme-light .tk-ann-title{color:rgba(0,0,0,0.9);}',
  '.tk-theme-light .tk-ann-desc{color:rgba(0,0,0,0.45);}',
  '.tk-theme-light .tk-ann-close{background:rgba(0,0,0,0.06);color:rgba(0,0,0,0.45);}',
  '@media (max-width:767px){',
  '.tk-ann-overlay{padding:16px;align-items:flex-end;}',
  '.tk-ann-card,.tk-ann-card.tk-ann-sm,.tk-ann-card.tk-ann-md,.tk-ann-card.tk-ann-lg{max-width:100%;}',
  '.tk-ann-layout-left{flex-direction:column;}',
  '.tk-ann-layout-left .tk-ann-img{width:100%;height:140px;min-height:0;}',
  '.tk-ann-banner{height:auto!important;min-height:40px;flex-wrap:wrap;padding:8px 12px;align-items:center;}',
  '.tk-ann-banner .tk-ann-body{flex-wrap:wrap;}',
  '.tk-ann-banner .tk-ann-desc{max-width:100%;white-space:normal;}',
  '.tk-ann-banner .tk-ann-cta{margin-left:auto;}',
  '.tk-ann-slide,.tk-ann-slide.tk-ann-sm,.tk-ann-slide.tk-ann-md,.tk-ann-slide.tk-ann-lg{left:0;right:0;bottom:0;width:100%;max-width:100%;border-radius:16px 16px 0 0;animation:tkAnnSlideUp 0.28s ease;}',
  '}',
].join('')

var runtime = {
  shown: { modal: null, banner: null, slide_in: null },
  nodes: { modal: null, banner: null, slide_in: null },
  modalQueue: [],
  bannerPad: 0,
  ctx: null,
}

function injectStylesOnce() {
  try {
    if (document.head && document.getElementById('tourkit-ann-styles')) return
    var tag = document.createElement('style')
    tag.id = 'tourkit-ann-styles'
    tag.textContent = CSS_SNIPPET
    if (document.head) document.head.appendChild(tag)
  } catch (_) {
    /* silent */
  }
}

function storageKey(id) {
  return 'tourkit_ann_' + String(id || '')
}

function readState(id) {
  try {
    return window.localStorage.getItem(storageKey(id))
  } catch (_) {
    return null
  }
}

function writeState(id, value) {
  try {
    if (!id || !value) return
    if (value === 'seen' && readState(id) === 'dismissed') return
    window.localStorage.setItem(storageKey(id), value)
  } catch (_) {
    /* silent */
  }
}

function variantColor(variant, primary) {
  var v = String(variant || 'info')
  if (v === 'success') return '#22c55e'
  if (v === 'warning') return '#f59e0b'
  if (v === 'promo') return '#a855f7'
  return primary || '#F15025'
}

function normalizeType(type) {
  var t = String(type || 'modal')
  if (t === 'banner' || t === 'slide_in' || t === 'slide-in') return t === 'slide-in' ? 'slide_in' : t
  return 'modal'
}

function normalizeSize(size) {
  var s = String(size || 'md')
  if (s === 'sm' || s === 'lg') return s
  return 'md'
}

function tourIsRunning() {
  try {
    return typeof window.__TOURKIT_DESTROY__ === 'function'
  } catch (_) {
    return false
  }
}

function whenTourIdle(cb) {
  try {
    if (!tourIsRunning()) {
      cb()
      return
    }
    var ticks = 0
    var t = setInterval(function () {
      ticks += 1
      try {
        if (!tourIsRunning() || ticks > 600) {
          clearInterval(t)
          cb()
        }
      } catch (_) {
        clearInterval(t)
        cb()
      }
    }, 300)
  } catch (_) {
    try {
      cb()
    } catch (__) {}
  }
}

function removeNode(el) {
  try {
    if (el && el.parentNode) el.parentNode.removeChild(el)
  } catch (_) {
    /* silent */
  }
}

function trackEvent(apiBase, announcementId, eventType, sessionId, isDemo) {
  try {
    if (isDemo) return
    if (!apiBase || !announcementId || !eventType) return
    var body = JSON.stringify({
      announcement_id: String(announcementId),
      event_type: String(eventType),
      session_id: sessionId ? String(sessionId) : '',
    })
    fetch(String(apiBase).replace(/\/+$/, '') + '/api/announcements/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: body,
      mode: 'cors',
      keepalive: true,
    }).catch(function () {})
  } catch (_) {
    /* silent */
  }
}

function matchesShowOn(announcement, path, matcher) {
  try {
    var raw = announcement && announcement.show_on != null ? String(announcement.show_on).trim() : 'all'
    if (!raw || raw.toLowerCase() === 'all') return true
    if (typeof matcher !== 'function') return true
    var parts = raw.split(',')
    for (var i = 0; i < parts.length; i++) {
      var p = String(parts[i] || '').trim()
      if (p && matcher(p, path)) return true
    }
    return false
  } catch (_) {
    return true
  }
}

function matchesAudience(announcement, identity, firstSeen) {
  try {
    var aud = String((announcement && announcement.audience) || 'all')
    var now = Date.now()
    var first = Number(firstSeen)
    if (!Number.isFinite(first)) first = now
    var age = now - first

    if (aud === 'new') return age < SEVEN_DAYS_MS
    if (aud === 'returning') return age >= SEVEN_DAYS_MS
    if (aud === 'logged_in') {
      var userId = identity && identity.userId
      if (!userId) return false
      var planNeed = announcement.audience_plan != null ? String(announcement.audience_plan).trim() : ''
      if (!planNeed) return true
      var planHave = identity && identity.plan != null ? String(identity.plan).trim() : ''
      return planHave === planNeed
    }
    return true
  } catch (_) {
    return true
  }
}

function blockedByFrequency(announcement) {
  try {
    if (!announcement || !announcement.id) return true
    var freq = String(announcement.frequency || 'until_dismissed')
    if (freq === 'every_visit') return false
    var state = readState(announcement.id)
    if (freq === 'once' && (state === 'seen' || state === 'dismissed')) return true
    if (freq === 'until_dismissed' && state === 'dismissed') return true
    return false
  } catch (_) {
    return false
  }
}

function filterEligible(announcements, ctx) {
  try {
    var list = Array.isArray(announcements) ? announcements : []
    var path = ctx && ctx.path ? String(ctx.path) : '/'
    var matcher = ctx && ctx.matchesPattern
    var out = []
    for (var i = 0; i < list.length; i++) {
      var item = list[i]
      if (!item || !item.id) continue
      if (!matchesShowOn(item, path, matcher)) continue
      if (!matchesAudience(item, ctx && ctx.identity, ctx && ctx.firstSeen)) continue
      if (blockedByFrequency(item)) continue
      out.push(item)
    }
    return out
  } catch (_) {
    return []
  }
}

function closeSvg() {
  return '<svg width="12" height="12" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M3 3l8 8M11 3L3 11" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>'
}

function iconSvg() {
  return '<svg class="tk-ann-icon" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><circle cx="8" cy="8" r="6.25" stroke="currentColor" stroke-width="1.4"/><path d="M8 7.2V11" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/><circle cx="8" cy="5.1" r="0.8" fill="currentColor"/></svg>'
}

function makeCloseBtn() {
  var closeBtn = document.createElement('button')
  closeBtn.type = 'button'
  closeBtn.className = 'tk-ann-close'
  closeBtn.setAttribute('aria-label', 'Close')
  closeBtn.innerHTML = closeSvg()
  return closeBtn
}

function appendImage(parent, url, className) {
  if (!url) return null
  var img = document.createElement('img')
  img.className = className || 'tk-ann-img'
  img.src = url
  img.alt = ''
  img.onerror = function () {
    try {
      removeNode(img)
    } catch (_) {}
  }
  parent.appendChild(img)
  return img
}

function fillCopy(announcement, body, opts) {
  var hideDesc = opts && opts.hideDesc
  var titleRow = document.createElement('div')
  titleRow.className = 'tk-ann-title-row'
  titleRow.innerHTML = iconSvg()
  var title = document.createElement('h3')
  title.className = 'tk-ann-title'
  try {
    title.textContent = announcement.title ? String(announcement.title) : ''
  } catch (_) {
    title.textContent = ''
  }
  titleRow.appendChild(title)
  body.appendChild(titleRow)

  if (!hideDesc) {
    var desc = document.createElement('p')
    desc.className = 'tk-ann-desc'
    try {
      desc.textContent = announcement.description ? String(announcement.description) : ''
    } catch (_) {
      desc.textContent = ''
    }
    body.appendChild(desc)
  }
}

function bannerHeight(size) {
  if (size === 'sm') return 40
  if (size === 'lg') return 80
  return 56
}

function clearBannerPad() {
  try {
    if (!runtime.bannerPad) return
    var current = parseInt(document.body.style.paddingTop || '0', 10) || 0
    var next = Math.max(0, current - runtime.bannerPad)
    document.body.style.paddingTop = next ? next + 'px' : ''
    runtime.bannerPad = 0
  } catch (_) {
    runtime.bannerPad = 0
  }
}

function applyBannerPad(px) {
  try {
    clearBannerPad()
    var current = parseInt(document.body.style.paddingTop || '0', 10) || 0
    runtime.bannerPad = px
    document.body.style.paddingTop = current + px + 'px'
  } catch (_) {
    /* silent */
  }
}

function unmountType(type, fireDismiss) {
  try {
    var node = runtime.nodes[type]
    var shown = runtime.shown[type]
    if (type === 'banner') clearBannerPad()
    removeNode(node)
    runtime.nodes[type] = null
    runtime.shown[type] = null
    if (fireDismiss && shown && runtime.ctx) {
      writeState(shown.id, 'dismissed')
      trackEvent(runtime.ctx.apiBase, shown.id, 'dismiss', runtime.ctx.sessionId, runtime.ctx.isDemo)
    }
  } catch (_) {
    runtime.nodes[type] = null
    runtime.shown[type] = null
  }
}

function wireCtaAndClose(announcement, closeBtn, ctaEl, root, type) {
  var ctx = runtime.ctx || {}
  function finish(didDismiss) {
    unmountType(type, Boolean(didDismiss))
    if (type === 'modal') {
      try {
        pumpModalQueue()
      } catch (_) {}
    }
  }

  closeBtn.onclick = function (e) {
    try {
      e.preventDefault()
      e.stopPropagation()
    } catch (_) {}
    finish(true)
  }

  if (ctaEl) {
    ctaEl.onclick = function (e) {
      try {
        e.preventDefault()
        e.stopPropagation()
      } catch (_) {}
      trackEvent(ctx.apiBase, announcement.id, 'click', ctx.sessionId, ctx.isDemo)
      try {
        var url = announcement.cta_url ? String(announcement.cta_url).trim() : ''
        if (url) window.location.href = url
      } catch (_) {}
      finish(false)
    }
  }
}

function mountAnnouncement(announcement) {
  try {
    injectStylesOnce()
    var type = normalizeType(announcement.type)
    var size = normalizeSize(announcement.size)
    var primary = ''
    try {
      primary = runtime.ctx && runtime.ctx.customization && runtime.ctx.customization.primary_color
    } catch (_) {
      primary = ''
    }
    var accent = variantColor(announcement.variant, primary)
    var imageUrl = ''
    try {
      imageUrl = announcement.image_url ? String(announcement.image_url).trim() : ''
    } catch (_) {
      imageUrl = ''
    }
    var ctaText = ''
    try {
      ctaText = announcement.cta_text ? String(announcement.cta_text).trim() : ''
    } catch (_) {
      ctaText = ''
    }

    var cta = null
    if (ctaText) {
      cta = document.createElement('button')
      cta.type = 'button'
      cta.className = 'tk-ann-cta tk-btn-primary'
      cta.textContent = ctaText
    }

    var closeBtn = makeCloseBtn()
    var root = null

    if (type === 'banner') {
      root = document.createElement('div')
      root.className = 'tk-ann-banner tk-ann-' + size
      root.style.setProperty('--tk-ann-accent', accent)
      var accentBar = document.createElement('div')
      accentBar.className = 'tk-ann-accent'
      root.appendChild(accentBar)
      if (size === 'lg' && imageUrl) appendImage(root, imageUrl, 'tk-ann-thumb')
      var body = document.createElement('div')
      body.className = 'tk-ann-body'
      fillCopy(announcement, body, { hideDesc: size === 'sm' })
      if (cta) body.appendChild(cta)
      root.appendChild(body)
      root.appendChild(closeBtn)
      document.body.appendChild(root)
      applyBannerPad(bannerHeight(size))
    } else if (type === 'slide_in') {
      root = document.createElement('div')
      var slidePos = String(announcement.slide_position || 'bottom-right')
      root.className = 'tk-ann-slide tk-ann-' + size + (slidePos === 'bottom-left' ? ' tk-ann-bl' : ' tk-ann-br')
      root.style.setProperty('--tk-ann-accent', accent)
      var slideAccent = document.createElement('div')
      slideAccent.className = 'tk-ann-accent'
      root.appendChild(slideAccent)
      if (imageUrl) appendImage(root, imageUrl, 'tk-ann-img')
      var sBody = document.createElement('div')
      sBody.className = 'tk-ann-body'
      fillCopy(announcement, sBody, null)
      if (cta) sBody.appendChild(cta)
      root.appendChild(closeBtn)
      root.appendChild(sBody)
      document.body.appendChild(root)
    } else {
      var overlay = document.createElement('div')
      overlay.className = 'tk-ann-overlay'
      overlay.setAttribute('role', 'dialog')
      overlay.setAttribute('aria-modal', 'true')
      var card = document.createElement('div')
      card.className = 'tk-ann-card tk-ann-' + size
      card.style.setProperty('--tk-ann-accent', accent)
      var modalAccent = document.createElement('div')
      modalAccent.className = 'tk-ann-accent'
      card.appendChild(modalAccent)

      var imagePos = String(announcement.image_position || 'top')
      var mBody = document.createElement('div')
      mBody.className = 'tk-ann-body'
      fillCopy(announcement, mBody, null)
      if (cta) {
        cta.style.width = '100%'
        mBody.appendChild(cta)
      }

      if (imageUrl && imagePos === 'left') {
        var layout = document.createElement('div')
        layout.className = 'tk-ann-layout-left'
        appendImage(layout, imageUrl, 'tk-ann-img')
        layout.appendChild(mBody)
        card.appendChild(layout)
      } else {
        if (imageUrl) appendImage(card, imageUrl, 'tk-ann-img')
        card.appendChild(mBody)
      }

      card.appendChild(closeBtn)
      overlay.appendChild(card)
      overlay.onclick = function (e) {
        try {
          if (e && e.target === overlay) closeBtn.click()
        } catch (_) {}
      }
      document.body.appendChild(overlay)
      root = overlay
    }

    runtime.nodes[type] = root
    runtime.shown[type] = announcement
    writeState(announcement.id, 'seen')
    trackEvent(runtime.ctx.apiBase, announcement.id, 'view', runtime.ctx.sessionId, runtime.ctx.isDemo)
    wireCtaAndClose(announcement, closeBtn, cta, root, type)
  } catch (_) {
    /* silent */
  }
}

function pumpModalQueue() {
  try {
    if (runtime.shown.modal) return
    while (runtime.modalQueue.length) {
      var next = runtime.modalQueue.shift()
      if (!next) continue
      if (blockedByFrequency(next)) continue
      if (runtime.ctx && !matchesShowOn(next, runtime.ctx.path, runtime.ctx.matchesPattern)) continue
      if (runtime.ctx && !matchesAudience(next, runtime.ctx.identity, runtime.ctx.firstSeen)) continue
      if (tourIsRunning()) {
        runtime.modalQueue.unshift(next)
        whenTourIdle(function () {
          pumpModalQueue()
        })
        return
      }
      mountAnnouncement(next)
      return
    }
  } catch (_) {
    /* silent */
  }
}

function syncType(type, eligible) {
  try {
    var current = runtime.shown[type]
    var next = eligible[0] || null
    if (current && next && current.id === next.id) return
    if (current && (!next || current.id !== next.id)) {
      unmountType(type, false)
    }
    if (!next) return
    if (type === 'modal') return
    mountAnnouncement(next)
  } catch (_) {
    /* silent */
  }
}

export function evaluateAnnouncements(announcements, ctx) {
  try {
    runtime.ctx = ctx || runtime.ctx || {}
    try {
      applyCustomization(runtime.ctx.customization || null)
    } catch (_) {}

    var eligible = filterEligible(announcements, runtime.ctx)
    var byType = { modal: [], banner: [], slide_in: [] }
    for (var i = 0; i < eligible.length; i++) {
      var t = normalizeType(eligible[i].type)
      if (!byType[t]) byType[t] = []
      byType[t].push(eligible[i])
    }

    syncType('banner', byType.banner)
    syncType('slide_in', byType.slide_in)

    runtime.modalQueue = byType.modal.slice()
    var showingModal = runtime.shown.modal
    if (showingModal) {
      var still = byType.modal.some(function (row) {
        return row.id === showingModal.id
      })
      if (!still) {
        unmountType('modal', false)
        pumpModalQueue()
      } else {
        runtime.modalQueue = byType.modal.filter(function (row) {
          return row.id !== showingModal.id
        })
      }
    } else {
      pumpModalQueue()
    }
  } catch (_) {
    /* silent */
  }
}

export function runAnnouncements(announcements, apiBase, scriptKey, sessionId, isDemo, extra) {
  try {
    var path = '/'
    try {
      path = extra && extra.path ? extra.path : String(window.location.pathname || '/') || '/'
    } catch (_) {
      path = '/'
    }
    evaluateAnnouncements(announcements, {
      path: path,
      identity: extra && extra.identity,
      firstSeen: extra && extra.firstSeen,
      isDemo: isDemo,
      apiBase: apiBase,
      scriptKey: scriptKey,
      sessionId: sessionId,
      matchesPattern: extra && extra.matchesPattern,
      customization: extra && extra.customization,
    })
  } catch (_) {
    /* silent */
  }
}
