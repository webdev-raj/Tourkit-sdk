'use client'

import { useState } from 'react'
import { RotateCcw } from 'lucide-react'

export default function ReplayButton({ scriptKey }) {
  const [replaying, setReplaying] = useState(false)

  function handleReplay() {
    setReplaying(true)
    try {
      localStorage.removeItem('tourkit_seen_' + scriptKey)
    } catch (_) {}
    window.location.reload()
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
