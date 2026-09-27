'use client'

export function AnnouncementModalPreview({ title, description, ctaText, imageUrl }) {
  const heading = String(title || '').trim() || 'Announcement title'
  const body = String(description || '').trim() || 'Write a short description. Visitors will see this in the modal.'
  const cta = String(ctaText || '').trim()
  const image = String(imageUrl || '').trim()

  return (
    <div className="relative min-h-[420px] overflow-hidden rounded-xl border border-white/10 bg-[#070707]">
      <div
        className="absolute inset-0"
        style={{
          background: 'rgba(0,0,0,0.55)',
          backdropFilter: 'blur(2px)',
        }}
        aria-hidden
      />
      <div className="relative z-10 flex min-h-[420px] items-center justify-center p-6">
        <div
          className="w-full max-w-[360px] overflow-hidden"
          style={{
            background: 'rgba(10,10,10,0.92)',
            backdropFilter: 'blur(20px) saturate(180%)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '16px',
            boxShadow:
              '0 0 0 1px rgba(255,255,255,0.04), 0 4px 8px rgba(0,0,0,0.3), 0 16px 32px rgba(0,0,0,0.4), 0 32px 64px rgba(0,0,0,0.5)',
          }}>
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element -- remote URL preview, not a Next Image host
            <img src={image} alt="" className="h-36 w-full object-cover" />
          ) : null}
          <div className="p-5">
            <div className="mb-3 flex items-start justify-between gap-3">
              <h3 className="text-[18px] font-semibold leading-snug tracking-tight text-white">{heading}</h3>
              <span className="mt-0.5 inline-flex size-7 shrink-0 items-center justify-center rounded-md text-[#888888]" aria-hidden>
                ×
              </span>
            </div>
            <p className="text-[12.5px] leading-[1.65] text-[rgba(255,255,255,0.45)]">{body}</p>
            {cta ? (
              <button
                type="button"
                tabIndex={-1}
                className="mt-5 w-full rounded-lg px-3.5 py-2 text-[12px] font-semibold text-white"
                style={{
                  background: '#F15025',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                }}>
                {cta}
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}
