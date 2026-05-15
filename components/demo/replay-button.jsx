'use client'

import { RotateCcw } from 'lucide-react'

export default function ReplayButton({ scriptKey }) {
  function handleReplay() {
    try {
      var keysToRemove = []
      var i = 0
      try {
        for (i = 0; i < localStorage.length; i++) {
          var key = localStorage.key(i)
          if (key && key.startsWith('tourkit_seen_' + scriptKey)) {
            keysToRemove.push(key)
          }
        }
      } catch (_) {
        keysToRemove = []
      }
      keysToRemove.forEach(function (k) {
        try {
          localStorage.removeItem(k)
        } catch (e) {
          /* silent */
        }
      })
    } catch (e) {
      /* silent */
    }
    window.location.reload()
  }

  return (
    <button
      type="button"
      onClick={handleReplay}
      className="inline-flex h-8 items-center gap-1.5 rounded-md border border-white/20 bg-transparent px-3 text-xs font-medium text-gray-200 transition hover:bg-white/10">
      <RotateCcw size={14} />
      Replay tour
    </button>
  )
}
