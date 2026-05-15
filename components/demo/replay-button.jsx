'use client'

import { useState } from 'react'
import { RotateCcw } from 'lucide-react'

export default function ReplayButton({ scriptKey: _scriptKey }) {
  const [replaying, setReplaying] = useState(false)

  function handleReplay() {
    setReplaying(true)
    try {
      try {
        if (window.TourKit && typeof window.TourKit.resetAll === 'function') {
          window.TourKit.resetAll()
        }
      } catch (_) {}

      try {
        if (window.TourKit && typeof window.TourKit.destroy === 'function') {
          window.TourKit.destroy()
        }
      } catch (_) {}

      setTimeout(function () {
        try {
          if (window.TourKit && typeof window.TourKit.startFor === 'function') {
            window.TourKit.startFor(window.location.pathname)
          }
        } catch (_) {
          window.location.reload()
        }
        setReplaying(false)
      }, 300)
    } catch (e) {
      window.location.reload()
    }
  }

  return (
    <button
      type="button"
      onClick={handleReplay}
      className="inline-flex h-8 items-center gap-1.5 rounded-md border border-white/20 bg-transparent px-3 text-xs font-medium text-gray-200 transition hover:bg-white/10">
      <RotateCcw size={14} />
      {replaying ? 'Restarting...' : 'Replay tour'}
    </button>
  )
}
