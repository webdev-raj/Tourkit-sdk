'use client'

const VARIANTS = {
  info: '#F15025',
  success: '#22c55e',
  warning: '#f59e0b',
  promo: '#a855f7',
}

function sizeClass(type, size) {
  const s = size || 'md'
  if (type === 'modal') {
    if (s === 'sm') return 'max-w-[380px]'
    if (s === 'lg') return 'max-w-[720px]'
    return 'max-w-[520px]'
  }
  if (type === 'slide_in') {
    if (s === 'sm') return 'w-[300px]'
    if (s === 'lg') return 'w-[460px]'
    return 'w-[380px]'
  }
  return ''
}

function bannerH(size) {
  if (size === 'sm') return 40
  if (size === 'lg') return 80
  return 56
}

function CardShell({ accent, children, className = '', style }) {
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{
        background: 'rgba(10,10,10,0.92)',
        backdropFilter: 'blur(20px) saturate(180%)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 16,
        boxShadow:
          '0 0 0 1px rgba(255,255,255,0.04), 0 4px 8px rgba(0,0,0,0.3), 0 16px 32px rgba(0,0,0,0.4)',
        ...style,
      }}>
      <div className="h-[3px] w-full" style={{ background: accent }} />
      {children}
    </div>
  )
}

function CopyBlock({ title, description, accent, hideDesc, ctaText }) {
  const heading = String(title || '').trim() || 'Announcement title'
  const body = String(description || '').trim() || 'Write a short description. Visitors will see this on their site.'
  const cta = String(ctaText || '').trim()
  return (
    <>
      <div className="mb-2 flex items-start gap-2 pr-7">
        <span
          className="mt-1 inline-block size-2.5 shrink-0 rounded-full"
          style={{ background: accent }}
          aria-hidden
        />
        <h3 className="text-[16px] font-semibold leading-snug tracking-tight text-white md:text-[18px]">{heading}</h3>
      </div>
      {hideDesc ? null : <p className="text-[12.5px] leading-[1.65] text-[rgba(255,255,255,0.45)]">{body}</p>}
      {cta ? (
        <button
          type="button"
          tabIndex={-1}
          className="mt-4 rounded-lg px-3.5 py-2 text-[12px] font-semibold text-white"
          style={{ background: accent }}>
          {cta}
        </button>
      ) : null}
    </>
  )
}

export function AnnouncementPreview({
  type = 'modal',
  size = 'md',
  variant = 'info',
  title,
  description,
  ctaText,
  imageUrl,
  imagePosition = 'top',
  slidePosition = 'bottom-right',
  mobile = false,
}) {
  const accent = VARIANTS[variant] || VARIANTS.info
  const image = String(imageUrl || '').trim()
  const kind = type === 'banner' || type === 'slide_in' ? type : 'modal'
  const frameClass = mobile ? 'mx-auto w-[375px] max-w-full' : 'w-full'

  if (kind === 'banner') {
    const h = bannerH(size)
    return (
      <div className={`overflow-hidden rounded-xl border border-white/10 bg-[#070707] ${frameClass}`}>
        <div
          className="relative flex items-center gap-3 overflow-hidden px-3"
          style={{
            minHeight: mobile ? undefined : h,
            height: mobile ? 'auto' : h,
            background: 'rgba(10,10,10,0.94)',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
          }}>
          <div className="absolute bottom-0 left-0 top-0 w-[3px]" style={{ background: accent }} />
          {size === 'lg' && image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={image} alt="" className="size-12 shrink-0 rounded-lg object-cover" />
          ) : null}
          <div className="min-w-0 flex-1 py-2 pl-2">
            <div className="truncate text-[13px] font-semibold text-white">{title || 'Announcement title'}</div>
            {size !== 'sm' ? (
              <div className="truncate text-[12px] text-[rgba(255,255,255,0.45)]">
                {description || 'Short description'}
              </div>
            ) : null}
          </div>
          {ctaText ? (
            <span className="shrink-0 rounded-lg px-2.5 py-1 text-[11px] font-semibold text-white" style={{ background: accent }}>
              {ctaText}
            </span>
          ) : null}
          <span className="shrink-0 text-[#888]">×</span>
        </div>
        <div className="h-24 bg-[#111]" />
      </div>
    )
  }

  if (kind === 'slide_in') {
    const align = slidePosition === 'bottom-left' ? 'items-end justify-start' : 'items-end justify-end'
    return (
      <div className={`relative min-h-[360px] overflow-hidden rounded-xl border border-white/10 bg-[#070707] ${frameClass}`}>
        <div className={`relative z-10 flex min-h-[360px] p-4 ${mobile ? 'items-end' : align}`}>
          <CardShell accent={accent} className={mobile ? 'w-full rounded-t-2xl' : sizeClass('slide_in', size)}>
            {image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={image} alt="" className="h-28 w-full object-cover" />
            ) : null}
            <div className="p-4">
              <CopyBlock title={title} description={description} accent={accent} ctaText={ctaText} />
            </div>
            <span className="absolute right-2 top-3 text-[#888]">×</span>
          </CardShell>
        </div>
      </div>
    )
  }

  const left = image && imagePosition === 'left' && !mobile
  return (
    <div className={`relative min-h-[420px] overflow-hidden rounded-xl border border-white/10 bg-[#070707] ${frameClass}`}>
      <div
        className="absolute inset-0"
        style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(2px)' }}
        aria-hidden
      />
      <div className="relative z-10 flex min-h-[420px] items-center justify-center p-5">
        <CardShell accent={accent} className={`w-full ${sizeClass('modal', size)}`}>
          {left ? (
            <div className="flex">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={image} alt="" className="w-[42%] min-w-[120px] object-cover" />
              <div className="min-w-0 flex-1 p-5">
                <CopyBlock title={title} description={description} accent={accent} ctaText={ctaText} />
              </div>
            </div>
          ) : (
            <>
              {image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={image} alt="" className="h-36 w-full object-cover" />
              ) : null}
              <div className="p-5">
                <CopyBlock title={title} description={description} accent={accent} ctaText={ctaText} />
              </div>
            </>
          )}
          <span className="absolute right-2 top-3 text-[#888]">×</span>
        </CardShell>
      </div>
    </div>
  )
}

export function AnnouncementModalPreview(props) {
  return <AnnouncementPreview type="modal" {...props} />
}
