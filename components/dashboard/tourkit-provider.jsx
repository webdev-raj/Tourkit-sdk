'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export function TourKitProvider() {
  const pathname = usePathname()

  useEffect(() => {
    var cancelled = false
    var attempts = 0

    function tryStart() {
      if (cancelled) return

      try {
        if (window.TourKit && typeof window.TourKit.startFor === 'function') {
          window.TourKit.startFor(pathname)
          return
        }
      } catch (_) {
        /* silent */
      }

      if (attempts < 24) {
        attempts += 1
        setTimeout(tryStart, 250)
      }
    }

    var timer = setTimeout(tryStart, 400)

    return function () {
      cancelled = true
      clearTimeout(timer)
    }
  }, [pathname])

  return null
}
