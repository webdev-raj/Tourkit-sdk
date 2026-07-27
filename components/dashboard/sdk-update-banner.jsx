'use client'

import { useState } from 'react'
import { AlertTriangle, X, Copy, Check, ExternalLink } from 'lucide-react'

import { LATEST_SDK_VERSION, SDK_CHANGELOG, getSnippet } from '@/lib/sdk-version'

function normalizeVersion(version) {
  return String(version || '').replace(/^v/i, '')
}

export default function SdkUpdateBanner({ project, detectedVersion }) {
  const [dismissed, setDismissed] = useState(false)
  const [copied, setCopied] = useState(false)

  if (dismissed) return null
  if (!detectedVersion) return null
  if (normalizeVersion(detectedVersion) === normalizeVersion(LATEST_SDK_VERSION)) return null

  const changelog = SDK_CHANGELOG[LATEST_SDK_VERSION]

  async function handleCopy() {
    try {
      const snippet = getSnippet(project.script_key, LATEST_SDK_VERSION)
      await navigator.clipboard.writeText(snippet)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (e) {}
  }

  return (
    <div
      style={{
        background: 'rgba(234,179,8,0.06)',
        border: '1px solid rgba(234,179,8,0.2)',
        borderRadius: '12px',
        padding: '16px 20px',
        marginBottom: '16px',
        position: 'relative',
      }}>
      <button
        onClick={() => setDismissed(true)}
        style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          background: 'none',
          border: 'none',
          color: '#666',
          cursor: 'pointer',
          padding: '2px',
        }}>
        <X size={14} />
      </button>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '12px',
        }}>
        <AlertTriangle size={15} color="#eab308" />
        <span
          style={{
            color: '#eab308',
            fontSize: '13px',
            fontWeight: '600',
          }}>
          SDK update available
        </span>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          marginBottom: '12px',
          fontSize: '12px',
        }}>
        <div>
          <span style={{ color: '#666' }}>Detected on your site:</span>{' '}
          <code
            style={{
              background: 'rgba(255,255,255,0.06)',
              padding: '1px 6px',
              borderRadius: '4px',
              color: '#fff',
              fontSize: '11px',
            }}>
            {detectedVersion}
          </code>
        </div>
        <div style={{ color: '#444' }}>→</div>
        <div>
          <span style={{ color: '#666' }}>Latest:</span>{' '}
          <code
            style={{
              background: 'rgba(234,179,8,0.15)',
              padding: '1px 6px',
              borderRadius: '4px',
              color: '#eab308',
              fontSize: '11px',
            }}>
            {LATEST_SDK_VERSION}
          </code>
        </div>
      </div>

      {changelog ? (
        <div style={{ marginBottom: '14px' }}>
          <div
            style={{
              color: '#555',
              fontSize: '11px',
              fontWeight: '600',
              marginBottom: '6px',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
            }}>
            What&apos;s new:
          </div>
          <ul
            style={{
              margin: 0,
              padding: 0,
              listStyle: 'none',
            }}>
            {changelog.changes.map((change, i) => (
              <li
                key={i}
                style={{
                  color: '#888',
                  fontSize: '12px',
                  marginBottom: '3px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}>
                <span style={{ color: '#22c55e' }}>→</span>
                {change}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          flexWrap: 'wrap',
        }}>
        <button
          onClick={handleCopy}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: copied ? 'rgba(34,197,94,0.15)' : 'rgba(234,179,8,0.15)',
            border: `1px solid ${copied ? 'rgba(34,197,94,0.3)' : 'rgba(234,179,8,0.3)'}`,
            borderRadius: '7px',
            padding: '6px 12px',
            color: copied ? '#22c55e' : '#eab308',
            fontSize: '12px',
            fontWeight: '500',
            cursor: 'pointer',
            fontFamily: 'inherit',
            transition: 'all 0.15s ease',
          }}>
          {copied ? (
            <>
              <Check size={12} /> Copied!
            </>
          ) : (
            <>
              <Copy size={12} /> Copy updated snippet
            </>
          )}
        </button>

        <a
          href="https://github.com/webdev-raj/tourkit-sdk/releases"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            color: '#555',
            fontSize: '12px',
            textDecoration: 'none',
            transition: 'color 0.15s ease',
          }}>
          <ExternalLink size={11} />
          View release notes
        </a>
      </div>
    </div>
  )
}
