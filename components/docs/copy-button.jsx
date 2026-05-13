'use client'

import { useState } from 'react'
import { CheckIcon, CopyIcon } from 'lucide-react'

export default function CopyButton({ text }) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      try {
        const el = document.createElement('textarea')
        el.value = text
        document.body.appendChild(el)
        el.select()
        document.execCommand('copy')
        document.body.removeChild(el)
        setCopied(true)
        window.setTimeout(() => setCopied(false), 2000)
      } catch {
        /* silent */
      }
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      style={{
        position: 'absolute',
        top: '12px',
        right: '12px',
        background: 'rgba(255,255,255,0.08)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '6px',
        padding: '4px 8px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        fontSize: '12px',
        color: copied ? '#22c55e' : '#999',
        transition: 'all 0.15s ease',
      }}>
      {copied ? (
        <>
          <CheckIcon size={12} aria-hidden />
          Copied!
        </>
      ) : (
        <>
          <CopyIcon size={12} aria-hidden />
          Copy
        </>
      )}
    </button>
  )
}
