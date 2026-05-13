'use client'

import CopyButton from '@/components/docs/copy-button'

export default function CodeBlock({ code, language = 'html' }) {
  void language

  return (
    <div
      style={{
        position: 'relative',
        background: '#0a0a0a',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '10px',
        padding: '20px',
        margin: '16px 0',
        overflow: 'auto',
      }}>
      <CopyButton text={code} />
      <pre
        style={{
          margin: 0,
          fontFamily: 'monospace',
          fontSize: '13px',
          lineHeight: '1.6',
          color: '#e5e7eb',
          overflowX: 'auto',
          paddingRight: '60px',
        }}>
        <code>{code}</code>
      </pre>
    </div>
  )
}
