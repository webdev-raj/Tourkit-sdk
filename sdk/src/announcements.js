var CSS_SNIPPET = [
  '@keyframes tkAnnFadeUp{from{opacity:0;transform:translateY(10px) scale(0.97)}to{opacity:1;transform:translateY(0) scale(1)}}',
  '@keyframes tkAnnFadeIn{from{opacity:0}to{opacity:1}}',
  '.tk-ann-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.55);backdrop-filter:blur(2px);-webkit-backdrop-filter:blur(2px);z-index:100050;display:flex;align-items:center;justify-content:center;padding:24px;box-sizing:border-box;animation:tkAnnFadeIn 0.2s ease;}',
  '.tk-ann-card{position:relative;width:100%;max-width:420px;background:rgba(10,10,10,0.92);backdrop-filter:blur(20px) saturate(180%);-webkit-backdrop-filter:blur(20px) saturate(180%);border:1px solid rgba(255,255,255,0.06);border-radius:16px;overflow:hidden;font-family:var(--tk-font,Inter),system-ui,sans-serif;box-sizing:border-box;box-shadow:0 0 0 1px rgba(255,255,255,0.04),0 4px 8px rgba(0,0,0,0.3),0 16px 32px rgba(0,0,0,0.4),0 32px 64px rgba(0,0,0,0.5),0 0 80px rgba(0,0,0,0.2);animation:tkAnnFadeUp 0.2s cubic-bezier(0.4,0,0.2,1);}',
  '.tk-ann-close{position:absolute;top:10px;right:10px;z-index:2;width:32px;height:32px;border:none;border-radius:8px;background:rgba(0,0,0,0.35);color:rgba(255,255,255,0.55);cursor:pointer;display:flex;align-items:center;justify-content:center;padding:0;font-size:18px;line-height:1;font-family:inherit;transition:background 0.15s ease,color 0.15s ease;}',
  '.tk-ann-close:hover{background:rgba(255,255,255,0.08);color:rgba(255,255,255,0.9);}',
  '.tk-ann-img{display:block;width:100%;height:180px;object-fit:cover;border-radius:16px 16px 0 0;}',
  '.tk-ann-body{padding:24px;}',
  '.tk-ann-title{font-size:18px;font-weight:600;color:rgba(255,255,255,0.95);margin:0 0 8px 0;line-height:1.35;letter-spacing:-0.02em;padding-right:28px;}',
  '.tk-ann-desc{font-size:12.5px;color:rgba(255,255,255,0.45);margin:0;line-height:1.65;font-weight:400;}',
  '.tk-ann-cta{display:block;width:100%;margin-top:18px;padding:10px 16px;border-radius:8px;font-size:13px;font-weight:600;cursor:pointer;border:none;background:var(--tk-primary,#F15025);color:#ffffff;font-family:inherit;letter-spacing:0.01em;text-align:center;text-decoration:none;box-sizing:border-box;transition:all 0.15s ease;box-shadow:0 2px 8px rgba(0,0,0,0.3);}',
  '.tk-ann-cta:hover{filter:brightness(1.12);box-shadow:0 4px 12px rgba(0,0,0,0.4),0 0 20px rgba(241,80,37,0.2);transform:translateY(-0.5px);}',
].join('')

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

function shouldSkip(announcement) {
  try {
    if (!announcement || !announcement.id) return true
    var freq = String(announcement.frequency || 'until_dismissed')
    var state = readState(announcement.id)
    if (freq === 'once' && state === 'seen') return true
    if (freq === 'until_dismissed' && state === 'dismissed') return true
    if (freq === 'once' && state === 'dismissed') return true
    return false
  } catch (_) {
    return false
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

function removeNode(el) {
  try {
    if (el && el.parentNode) el.parentNode.removeChild(el)
  } catch (_) {
    /* silent */
  }
}

function renderModal(announcement, apiBase, sessionId, isDemo, onDone) {
  try {
    injectStylesOnce()

    var overlay = document.createElement('div')
    overlay.className = 'tk-ann-overlay'
    overlay.setAttribute('role', 'dialog')
    overlay.setAttribute('aria-modal', 'true')

    var card = document.createElement('div')
    card.className = 'tk-ann-card'

    var closeBtn = document.createElement('button')
    closeBtn.type = 'button'
    closeBtn.className = 'tk-ann-close'
    closeBtn.setAttribute('aria-label', 'Close')
    closeBtn.innerHTML =
      '<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M3 3l8 8M11 3L3 11" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>'

    var imageUrl = ''
    try {
      imageUrl = announcement.image_url ? String(announcement.image_url).trim() : ''
    } catch (_) {
      imageUrl = ''
    }

    if (imageUrl) {
      var img = document.createElement('img')
      img.className = 'tk-ann-img'
      img.src = imageUrl
      img.alt = ''
      img.onerror = function () {
        try {
          removeNode(img)
        } catch (_) {}
      }
      card.appendChild(img)
    }

    var body = document.createElement('div')
    body.className = 'tk-ann-body'

    var title = document.createElement('h3')
    title.className = 'tk-ann-title'
    try {
      title.textContent = announcement.title ? String(announcement.title) : ''
    } catch (_) {
      title.textContent = ''
    }

    var desc = document.createElement('p')
    desc.className = 'tk-ann-desc'
    try {
      desc.textContent = announcement.description ? String(announcement.description) : ''
    } catch (_) {
      desc.textContent = ''
    }

    body.appendChild(title)
    body.appendChild(desc)

    var ctaText = ''
    var ctaUrl = ''
    try {
      ctaText = announcement.cta_text ? String(announcement.cta_text).trim() : ''
    } catch (_) {
      ctaText = ''
    }
    try {
      ctaUrl = announcement.cta_url ? String(announcement.cta_url).trim() : ''
    } catch (_) {
      ctaUrl = ''
    }

    var finished = false
    function finish() {
      if (finished) return
      finished = true
      try {
        document.removeEventListener('keydown', onKey)
      } catch (_) {}
      removeNode(overlay)
      try {
        onDone()
      } catch (_) {}
    }

    function dismiss() {
      writeState(announcement.id, 'dismissed')
      trackEvent(apiBase, announcement.id, 'dismiss', sessionId, isDemo)
      finish()
    }

    closeBtn.onclick = function (e) {
      try {
        e.preventDefault()
        e.stopPropagation()
      } catch (_) {}
      dismiss()
    }

    if (ctaText) {
      var cta = document.createElement('button')
      cta.type = 'button'
      cta.className = 'tk-ann-cta tk-btn-primary'
      cta.textContent = ctaText
      cta.onclick = function (e) {
        try {
          e.preventDefault()
          e.stopPropagation()
        } catch (_) {}
        trackEvent(apiBase, announcement.id, 'click', sessionId, isDemo)
        try {
          if (ctaUrl) {
            window.location.href = ctaUrl
          }
        } catch (_) {}
        finish()
      }
      body.appendChild(cta)
    }

    card.appendChild(closeBtn)
    card.appendChild(body)
    overlay.appendChild(card)

    overlay.onclick = function (e) {
      try {
        if (e && e.target === overlay) dismiss()
      } catch (_) {}
    }

    function onKey(e) {
      try {
        if (e && e.key === 'Escape') dismiss()
      } catch (_) {}
    }

    try {
      document.addEventListener('keydown', onKey)
    } catch (_) {}

    try {
      document.body.appendChild(overlay)
    } catch (_) {
      finish()
      return
    }

    writeState(announcement.id, 'seen')
    trackEvent(apiBase, announcement.id, 'view', sessionId, isDemo)
  } catch (_) {
    try {
      onDone()
    } catch (__) {}
  }
}

export function runAnnouncements(announcements, apiBase, scriptKey, sessionId, isDemo) {
  try {
    var list = Array.isArray(announcements) ? announcements.slice() : []
    if (!list.length) return

    function runNext(index) {
      try {
        var i = index
        while (i < list.length) {
          var item = list[i]
          if (!shouldSkip(item)) {
            renderModal(item, apiBase, sessionId, isDemo, function () {
              runNext(i + 1)
            })
            return
          }
          i += 1
        }
      } catch (_) {
        /* silent */
      }
    }

    runNext(0)
  } catch (_) {
    /* silent */
  }
}
