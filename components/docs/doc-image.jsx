'use client'
import { useState, useEffect } from 'react'
import { X, ZoomIn } from 'lucide-react'

export default function DocImage({ src, alt, caption, placeholder }) {
  const [open, setOpen] = useState(false)

  // Close on Escape key
  useEffect(() => {
    if (!open) return
    function handleKey(e) {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [open])

  // Lock body scroll when lightbox is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  // Placeholder fallback (no src provided)
  if (!src) {
    return (
      <div
        style={{
          width: '100%',
          background: '#0d0d0d',
          border: '1px dashed rgba(255,255,255,0.1)',
          borderRadius: '10px',
          padding: '48px 24px',
          textAlign: 'center',
          margin: '24px 0',
        }}
      >
        <div style={{ fontSize: '32px', marginBottom: '8px' }}>🖼️</div>
        <p style={{ color: '#444', fontSize: '13px', margin: 0 }}>
          {placeholder || 'Screenshot coming soon'}
        </p>
      </div>
    )
  }

  return (
    <>
      {/* Thumbnail wrapper */}
      <figure
        className="doc-image-wrapper"
        onClick={() => setOpen(true)}
        style={{
          position: 'relative',
          cursor: 'zoom-in',
          borderRadius: '10px',
          overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.08)',
          margin: '24px 0',
          display: 'block',
        }}
      >
        <img
          src={src}
          alt={alt || caption || ''}
          style={{
            width: '100%',
            height: 'auto',
            display: 'block',
            borderRadius: '10px',
            transition: 'opacity 0.15s ease',
          }}
        />

        {/* Zoom hint badge */}
        <div className="zoom-hint" style={{
          position: 'absolute',
          bottom: '10px',
          right: '10px',
          background: 'rgba(0,0,0,0.65)',
          backdropFilter: 'blur(8px)',
          borderRadius: '6px',
          padding: '4px 8px',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          opacity: 0,
          transition: 'opacity 0.15s ease',
          pointerEvents: 'none',
        }}>
          <ZoomIn size={12} color="#fff" />
          <span style={{ color: '#fff', fontSize: '11px', fontWeight: '500' }}>
            Click to zoom
          </span>
        </div>

        {/* Caption inside figure */}
        {caption && (
          <figcaption style={{
            color: '#666',
            fontSize: '12px',
            textAlign: 'center',
            padding: '8px 12px',
            background: 'rgba(0,0,0,0.3)',
          }}>
            {caption}
          </figcaption>
        )}
      </figure>

      {/* Lightbox overlay */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.92)',
            backdropFilter: 'blur(12px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            cursor: 'zoom-out',
          }}
        >
          {/* Esc hint */}
          <p style={{
            position: 'absolute',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            color: '#555',
            fontSize: '12px',
            whiteSpace: 'nowrap',
            margin: 0,
            pointerEvents: 'none',
          }}>
            Press Esc or click outside to close
          </p>

          {/* Close button */}
          <button
            type="button"
            aria-label="Close image"
            onClick={(e) => { e.stopPropagation(); setOpen(false) }}
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '8px',
              padding: '8px',
              color: '#fff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10000,
              transition: 'background 0.15s ease',
            }}
          >
            <X size={18} />
          </button>

          {/* Full-size image */}
          <img
            src={src}
            alt={alt || caption || ''}
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '90vw',
              maxHeight: '85vh',
              objectFit: 'contain',
              borderRadius: '12px',
              border: '1px solid rgba(255,255,255,0.1)',
              cursor: 'default',
              boxShadow: '0 32px 80px rgba(0,0,0,0.8)',
            }}
          />

          {/* Caption in lightbox */}
          {caption && (
            <p style={{
              position: 'absolute',
              bottom: '20px',
              left: '50%',
              transform: 'translateX(-50%)',
              color: '#888',
              fontSize: '13px',
              textAlign: 'center',
              whiteSpace: 'nowrap',
              margin: 0,
              pointerEvents: 'none',
            }}>
              {caption}
            </p>
          )}
        </div>
      )}

      {/* Hover styles for zoom hint */}
      <style>{`
        .doc-image-wrapper:hover .zoom-hint {
          opacity: 1 !important;
        }
      `}</style>
    </>
  )
}
