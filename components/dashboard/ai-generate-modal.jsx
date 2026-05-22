'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Loader2, Sparkles, X } from 'lucide-react'

function ModalWrapper({ children, onClose }) {
  return (
    <>
      <div
        onClick={onClose}
        role="presentation"
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.7)',
          zIndex: 1000,
          backdropFilter: 'blur(2px)',
        }}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="ai-generate-modal-title"
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: '#111111',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '14px',
          padding: '24px',
          width: '440px',
          maxWidth: 'calc(100vw - 32px)',
          zIndex: 1001,
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
        }}>
        {children}
      </div>
    </>
  )
}

const PRO_FEATURES = [
  'Generate up to 10 steps instantly',
  'Linear and context-aware support',
  'AI-optimized CSS selectors',
  'Unlimited generations',
]

export default function AIGenerateModal({ tourId, onStepsGenerated, onClose, isPro }) {
  const [description, setDescription] = useState('')
  const [numSteps, setNumSteps] = useState('5')
  const [tourType, setTourType] = useState('linear')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function requestGeneration(retryLabel) {
    if (retryLabel) setError(retryLabel)

    const res = await fetch('/api/generate-tour', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        description,
        numSteps: parseInt(numSteps, 10),
        tourType,
      }),
    })

    const data = await res.json()
    return { res, data }
  }

  async function handleGenerate() {
    if (loading) return

    if (!description.trim()) {
      setError('Please describe your product')
      return
    }

    setLoading(true)
    setError('')

    try {
      let { res, data } = await requestGeneration()

      if (res.status === 429) {
        setError('AI is busy — retrying automatically...')
        await new Promise((resolve) => setTimeout(resolve, 2000))
        ;({ res, data } = await requestGeneration())
      }

      if (!res.ok) {
        setError(
          res.status === 429
            ? 'AI is busy right now. Please wait a few seconds and try again.'
            : data.error || 'Generation failed',
        )
        return
      }

      onStepsGenerated(data.steps)
      onClose()
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!isPro) {
    return (
      <ModalWrapper onClose={onClose}>
        <div style={{ textAlign: 'center', padding: '32px 24px' }}>
          <Sparkles size={40} color="#F15025" style={{ marginBottom: '16px' }} aria-hidden />
          <h3
            id="ai-generate-modal-title"
            style={{
              color: '#fff',
              fontSize: '18px',
              fontWeight: '600',
              marginBottom: '8px',
            }}>
            AI Tour Generator
          </h3>
          <p
            style={{
              color: '#999',
              fontSize: '13px',
              lineHeight: '1.6',
              marginBottom: '24px',
            }}>
            Generate tour steps instantly with AI. Available on Pro plan only.
          </p>
          <ul
            style={{
              color: '#666',
              fontSize: '12px',
              listStyle: 'none',
              padding: 0,
              marginBottom: '24px',
              textAlign: 'left',
            }}>
            {PRO_FEATURES.map((f) => (
              <li
                key={f}
                style={{
                  marginBottom: '6px',
                  display: 'flex',
                  gap: '8px',
                }}>
                <span style={{ color: '#22c55e' }}>✓</span>
                {f}
              </li>
            ))}
          </ul>
          <Link
            href="/pricing"
            style={{
              display: 'block',
              background: '#F15025',
              color: '#fff',
              padding: '10px 24px',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '14px',
              textAlign: 'center',
            }}>
            Upgrade to Pro →
          </Link>
        </div>
      </ModalWrapper>
    )
  }

  return (
    <ModalWrapper onClose={onClose}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px',
        }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={16} color="#F15025" aria-hidden />
          <h3
            id="ai-generate-modal-title"
            style={{
              color: '#fff',
              fontSize: '15px',
              fontWeight: '600',
              margin: 0,
            }}>
            AI Generate Steps
          </h3>
          <span
            style={{
              fontSize: '9px',
              background: '#F15025',
              color: '#fff',
              padding: '1px 6px',
              borderRadius: '4px',
              fontWeight: '600',
            }}>
            PRO
          </span>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          style={{
            background: 'none',
            border: 'none',
            color: '#666',
            cursor: 'pointer',
            padding: '4px',
          }}>
          <X size={16} />
        </button>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label
          htmlFor="ai-description"
          style={{
            color: '#ccc',
            fontSize: '13px',
            fontWeight: '500',
            display: 'block',
            marginBottom: '6px',
          }}>
          Describe your product *
        </label>
        <textarea
          id="ai-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="We build a project management tool for remote teams with task boards and time tracking."
          rows={4}
          style={{
            width: '100%',
            background: '#0a0a0a',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '8px',
            padding: '10px 12px',
            color: '#fff',
            fontSize: '13px',
            resize: 'vertical',
            fontFamily: 'inherit',
            boxSizing: 'border-box',
          }}
        />
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '12px',
          marginBottom: '20px',
        }}>
        <div>
          <label
            htmlFor="ai-num-steps"
            style={{
              color: '#ccc',
              fontSize: '13px',
              fontWeight: '500',
              display: 'block',
              marginBottom: '6px',
            }}>
            Number of steps
          </label>
          <select
            id="ai-num-steps"
            value={numSteps}
            onChange={(e) => setNumSteps(e.target.value)}
            style={{
              width: '100%',
              background: '#0a0a0a',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              padding: '9px 12px',
              color: '#fff',
              fontSize: '13px',
              fontFamily: 'inherit',
            }}>
            {[3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
              <option key={n} value={n}>
                {n} steps
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="ai-tour-type"
            style={{
              color: '#ccc',
              fontSize: '13px',
              fontWeight: '500',
              display: 'block',
              marginBottom: '6px',
            }}>
            Tour type
          </label>
          <select
            id="ai-tour-type"
            value={tourType}
            onChange={(e) => setTourType(e.target.value)}
            style={{
              width: '100%',
              background: '#0a0a0a',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              padding: '9px 12px',
              color: '#fff',
              fontSize: '13px',
              fontFamily: 'inherit',
            }}>
            <option value="linear">Linear tour</option>
            <option value="context-aware">Context-aware</option>
          </select>
        </div>
      </div>

      {error ? (
        <p
          style={{
            color: '#ef4444',
            fontSize: '12px',
            marginBottom: '12px',
          }}>
          {error}
        </p>
      ) : null}

      <button
        type="button"
        onClick={handleGenerate}
        disabled={loading}
        style={{
          width: '100%',
          background: loading ? '#333' : '#F15025',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          padding: '11px',
          fontSize: '14px',
          fontWeight: '600',
          cursor: loading ? 'not-allowed' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          fontFamily: 'inherit',
        }}>
        {loading ? (
          <>
            <Loader2 size={14} className="animate-spin" aria-hidden />
            Generating...
          </>
        ) : (
          <>
            <Sparkles size={14} aria-hidden />
            Generate steps
          </>
        )}
      </button>
    </ModalWrapper>
  )
}
