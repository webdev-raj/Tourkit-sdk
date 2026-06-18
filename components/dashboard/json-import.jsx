'use client'

import { useState, useRef } from 'react'
import { FileJson, Check, X, AlertCircle } from 'lucide-react'

export default function JsonImport({ onImport, isPro }) {
  const [isDragging, setIsDragging] = useState(false)
  const [preview, setPreview] = useState(null)
  const [error, setError] = useState('')
  const [importing, setImporting] = useState(false)
  const fileInputRef = useRef(null)

  function validateSteps(data) {
    if (!Array.isArray(data)) {
      throw new Error('JSON must be an array of steps')
    }
    if (data.length === 0) {
      throw new Error('JSON array is empty')
    }
    if (data.length > 20) {
      throw new Error('Maximum 20 steps allowed')
    }

    data.forEach((step, i) => {
      if (!step.title && !step.description && !step.message) {
        throw new Error(`Step ${i + 1} must have title or description`)
      }
      if (!step.selector) {
        throw new Error(`Step ${i + 1} is missing selector`)
      }
    })

    return true
  }

  function handleFile(file) {
    setError('')
    setPreview(null)

    if (!file) return

    if (!file.name.endsWith('.json')) {
      setError('Please upload a .json file only')
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result)
        validateSteps(data)
        setPreview(data)
      } catch (err) {
        setError(err.message || 'Invalid JSON format')
      }
    }
    reader.readAsText(file)
  }

  function handleDrop(e) {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    handleFile(file)
  }

  function handleDragOver(e) {
    e.preventDefault()
    setIsDragging(true)
  }

  function handleDragLeave() {
    setIsDragging(false)
  }

  async function handleImport() {
    if (!preview) return
    setImporting(true)
    try {
      await onImport(preview)
      setPreview(null)
    } catch (_) {
      setError('Import failed. Please try again.')
    } finally {
      setImporting(false)
    }
  }

  if (!isPro) {
    return (
      <div
        style={{
          border: '1px dashed rgba(255,255,255,0.08)',
          borderRadius: '10px',
          padding: '16px',
          textAlign: 'center',
          opacity: 0.5,
        }}>
        <FileJson size={20} color="#666" style={{ marginBottom: '6px' }} />
        <p style={{ color: '#666', fontSize: '11px', margin: 0 }}>JSON import — Pro only</p>
      </div>
    )
  }

  if (preview) {
    const grouped = {}
    preview.forEach((step) => {
      const key = step.url_pattern || 'all pages'
      if (!grouped[key]) grouped[key] = []
      grouped[key].push(step)
    })

    const hasUrlTriggers = preview.some((s) => s.url_pattern)

    return (
      <div
        style={{
          border: '1px solid rgba(241,80,37,0.3)',
          borderRadius: '10px',
          padding: '16px',
          background: 'rgba(241,80,37,0.04)',
        }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '12px',
          }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Check size={14} color="#22c55e" />
            <span style={{ color: '#fff', fontSize: '13px', fontWeight: '600' }}>{preview.length} steps found</span>
          </div>
          <button
            type="button"
            onClick={() => setPreview(null)}
            style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer', padding: '2px' }}>
            <X size={14} />
          </button>
        </div>

        <div style={{ marginBottom: '12px' }}>
          <span
            style={{
              fontSize: '11px',
              background: hasUrlTriggers ? 'rgba(99,102,241,0.15)' : 'rgba(34,197,94,0.15)',
              color: hasUrlTriggers ? '#818cf8' : '#22c55e',
              padding: '2px 8px',
              borderRadius: '4px',
              fontWeight: '500',
            }}>
            {hasUrlTriggers ? '🔗 Context-aware tour' : '→ Linear tour'}
          </span>
        </div>

        <div style={{ maxHeight: '200px', overflowY: 'auto', marginBottom: '12px' }}>
          {Object.entries(grouped).map(([url, steps]) => (
            <div key={url} style={{ marginBottom: '10px' }}>
              {hasUrlTriggers ? (
                <div
                  style={{
                    fontSize: '10px',
                    color: '#F15025',
                    fontFamily: 'monospace',
                    marginBottom: '4px',
                    fontWeight: '600',
                  }}>
                  {url === 'all pages' ? '🌐 All pages' : url}
                </div>
              ) : null}
              {steps.map((step, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '8px',
                    padding: '6px 8px',
                    background: 'rgba(255,255,255,0.03)',
                    borderRadius: '6px',
                    marginBottom: '4px',
                  }}>
                  <Check size={10} color="#22c55e" style={{ marginTop: '3px', flexShrink: 0 }} />
                  <div style={{ minWidth: 0 }}>
                    <div
                      style={{
                        color: '#fff',
                        fontSize: '12px',
                        fontWeight: '500',
                        marginBottom: '1px',
                      }}>
                      {step.title || 'Untitled'}
                    </div>
                    <div
                      style={{
                        color: '#F15025',
                        fontSize: '10px',
                        fontFamily: 'monospace',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}>
                      {step.selector}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={handleImport}
          disabled={importing}
          style={{
            width: '100%',
            background: importing ? '#333' : '#F15025',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            padding: '9px',
            fontSize: '13px',
            fontWeight: '600',
            cursor: importing ? 'not-allowed' : 'pointer',
            fontFamily: 'inherit',
          }}>
          {importing ? 'Importing...' : `Import ${preview.length} steps →`}
        </button>
      </div>
    )
  }

  return (
    <div>
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        style={{
          border: `1px dashed ${isDragging ? '#F15025' : 'rgba(255,255,255,0.1)'}`,
          borderRadius: '10px',
          padding: '20px 16px',
          textAlign: 'center',
          cursor: 'pointer',
          background: isDragging ? 'rgba(241,80,37,0.05)' : 'transparent',
          transition: 'all 0.15s ease',
        }}>
        <FileJson size={20} color={isDragging ? '#F15025' : '#444'} style={{ marginBottom: '8px' }} />
        <p
          style={{
            color: isDragging ? '#F15025' : '#555',
            fontSize: '12px',
            margin: '0 0 4px 0',
            fontWeight: '500',
          }}>
          Drop tour.json here
        </p>
        <p style={{ color: '#444', fontSize: '11px', margin: 0 }}>or click to browse</p>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          style={{ display: 'none' }}
          onChange={(e) => handleFile(e.target.files[0])}
        />
      </div>

      {error ? (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            marginTop: '8px',
            padding: '8px 10px',
            background: 'rgba(239,68,68,0.1)',
            borderRadius: '6px',
            border: '1px solid rgba(239,68,68,0.2)',
          }}>
          <AlertCircle size={12} color="#ef4444" />
          <span style={{ color: '#ef4444', fontSize: '11px' }}>{error}</span>
        </div>
      ) : null}
    </div>
  )
}
