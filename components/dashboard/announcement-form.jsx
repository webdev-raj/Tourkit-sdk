'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { createAnnouncement, updateAnnouncement } from '@/app/actions/announcements'
import { AnnouncementPreview } from '@/components/dashboard/announcement-preview'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

const FIELD =
  'rounded-xl border-white/10 bg-[#0a0a0a] text-foreground placeholder:text-[#555555] focus-visible:border-[#F15025]/50 focus-visible:ring-[#F15025]/20'

const TYPES = [
  { id: 'modal', label: 'Modal', hint: 'Centered overlay' },
  { id: 'banner', label: 'Banner', hint: 'Top of page' },
  { id: 'slide_in', label: 'Slide-in', hint: 'Corner card', pro: true },
]

const SIZES = [
  { id: 'sm', label: 'Small' },
  { id: 'md', label: 'Medium' },
  { id: 'lg', label: 'Large' },
]

const VARIANTS = [
  { id: 'info', label: 'Info', color: '#F15025' },
  { id: 'success', label: 'Success', color: '#22c55e' },
  { id: 'warning', label: 'Warning', color: '#f59e0b' },
  { id: 'promo', label: 'Promo', color: '#a855f7' },
]

function toDateInput(value) {
  if (!value) return ''
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return ''
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

export function AnnouncementForm({ projectId, announcement, plan = 'pro' }) {
  const router = useRouter()
  const isEdit = Boolean(announcement?.id)
  const listHref = `/dashboard/projects/${projectId}/announcements`
  const isStarter = plan === 'starter'

  const initialType = announcement?.type === 'slide_in' && isStarter ? 'modal' : announcement?.type || 'modal'
  const [type, setType] = useState(initialType)
  const [size, setSize] = useState(announcement?.size || 'md')
  const [variant, setVariant] = useState(announcement?.variant || 'info')
  const [title, setTitle] = useState(announcement?.title || '')
  const [description, setDescription] = useState(announcement?.description || '')
  const [ctaText, setCtaText] = useState(announcement?.cta_text || '')
  const [ctaUrl, setCtaUrl] = useState(announcement?.cta_url || '')
  const [imageUrl, setImageUrl] = useState(announcement?.image_url || '')
  const [imagePosition, setImagePosition] = useState(announcement?.image_position || 'top')
  const [slidePosition, setSlidePosition] = useState(announcement?.slide_position || 'bottom-right')
  const [allPages, setAllPages] = useState(!announcement?.show_on || announcement.show_on === 'all')
  const [showOn, setShowOn] = useState(announcement?.show_on && announcement.show_on !== 'all' ? announcement.show_on : '')
  const [audience, setAudience] = useState(announcement?.audience || 'all')
  const [audiencePlan, setAudiencePlan] = useState(announcement?.audience_plan || '')
  const [startDate, setStartDate] = useState(toDateInput(announcement?.start_date))
  const [endDate, setEndDate] = useState(toDateInput(announcement?.end_date))
  const [frequency, setFrequency] = useState(announcement?.frequency || 'until_dismissed')
  const [mobilePreview, setMobilePreview] = useState(false)
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()

  function onSubmit(e) {
    e.preventDefault()
    setError('')

    const payload = {
      type,
      size,
      variant,
      title,
      description,
      cta_text: ctaText,
      cta_url: ctaUrl,
      image_url: imageUrl,
      image_position: imagePosition,
      slide_position: slidePosition,
      show_on: allPages ? 'all' : showOn,
      audience,
      audience_plan: audience === 'logged_in' ? audiencePlan : null,
      start_date: startDate || null,
      end_date: endDate || null,
      frequency,
    }

    startTransition(async () => {
      const result = isEdit
        ? await updateAnnouncement(announcement.id, payload)
        : await createAnnouncement(projectId, payload)

      if (!result?.ok) {
        setError(result?.error || 'Could not save announcement.')
        return
      }

      router.push(listHref)
      router.refresh()
    })
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(280px,24rem)] lg:items-start">
      <div className="flex flex-col gap-5 rounded-xl border border-white/10 bg-[#111111]/80 p-5 md:p-6">
        {error ? (
          <Alert variant="destructive" className="border-destructive/50">
            <AlertTitle>Could not save</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : null}

        <div className="flex flex-col gap-2">
          <Label>Type</Label>
          <div className="grid gap-2 sm:grid-cols-3">
            {TYPES.map((opt) => {
              const locked = Boolean(opt.pro && isStarter)
              const selected = type === opt.id
              return (
                <button
                  key={opt.id}
                  type="button"
                  disabled={locked}
                  onClick={() => setType(opt.id)}
                  className={`rounded-xl border px-3 py-3 text-left transition-colors ${
                    selected ? 'border-[#F15025]/60 bg-[#F15025]/10' : 'border-white/10 bg-[#0a0a0a] hover:border-white/20'
                  } ${locked ? 'cursor-not-allowed opacity-50' : ''}`}>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold text-white">{opt.label}</span>
                    {opt.pro ? (
                      <span className="rounded-full border border-[#F15025]/40 bg-[#F15025]/15 px-1.5 py-0.5 text-[10px] font-semibold text-[#F15025]">
                        PRO
                      </span>
                    ) : null}
                  </div>
                  <span className="mt-1 block text-xs text-[#777]">{opt.hint}</span>
                </button>
              )
            })}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label>Size</Label>
          <div className="flex flex-wrap gap-2">
            {SIZES.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setSize(opt.id)}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium ${
                  size === opt.id ? 'border-[#F15025]/60 bg-[#F15025]/10 text-white' : 'border-white/10 text-[#999]'
                }`}>
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label>Variant</Label>
          <div className="flex flex-wrap gap-2">
            {VARIANTS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setVariant(opt.id)}
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium ${
                  variant === opt.id ? 'border-white/30 bg-white/5 text-white' : 'border-white/10 text-[#999]'
                }`}>
                <span className="size-3 rounded-full" style={{ background: opt.color }} />
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="ann-title">Title</Label>
          <Input id="ann-title" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="New feature" className={FIELD} />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="ann-description">Description</Label>
          <Textarea
            id="ann-description"
            required
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="We just launched something worth seeing."
            className={FIELD}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="ann-cta-text">CTA button text</Label>
            <Input id="ann-cta-text" value={ctaText} onChange={(e) => setCtaText(e.target.value)} placeholder="Try it" className={FIELD} />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="ann-cta-url">CTA URL</Label>
            <Input id="ann-cta-url" value={ctaUrl} onChange={(e) => setCtaUrl(e.target.value)} placeholder="https://example.com/new" className={FIELD} />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="ann-image">Image URL</Label>
          <Input id="ann-image" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://example.com/banner.jpg" className={FIELD} />
        </div>

        {type === 'modal' ? (
          <div className="flex flex-col gap-2">
            <Label>Image position</Label>
            <select value={imagePosition} onChange={(e) => setImagePosition(e.target.value)} className={`flex h-10 w-full px-2.5 text-sm ${FIELD}`}>
              <option value="top">Top</option>
              <option value="left">Left</option>
            </select>
          </div>
        ) : null}

        {type === 'slide_in' ? (
          <div className="flex flex-col gap-2">
            <Label>Slide position</Label>
            <select value={slidePosition} onChange={(e) => setSlidePosition(e.target.value)} className={`flex h-10 w-full px-2.5 text-sm ${FIELD}`}>
              <option value="bottom-right">Bottom right</option>
              <option value="bottom-left">Bottom left</option>
            </select>
          </div>
        ) : null}

        <div className="flex flex-col gap-2">
          <Label>Show on</Label>
          <label className="flex items-center gap-2 text-sm text-[#aaa]">
            <input type="checkbox" checked={allPages} onChange={(e) => setAllPages(e.target.checked)} />
            All pages
          </label>
          {allPages ? null : (
            <>
              <Textarea
                value={showOn}
                onChange={(e) => setShowOn(e.target.value)}
                placeholder="/dashboard, /projects/[id], /blog/*"
                className={FIELD}
                rows={3}
              />
              <p className="text-xs text-[#666]">
                Comma-separated patterns. Use <code className="text-[#888]">[id]</code> for a segment and <code className="text-[#888]">/*</code> for a prefix.
              </p>
            </>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="ann-audience">Audience</Label>
          <select id="ann-audience" value={audience} onChange={(e) => setAudience(e.target.value)} className={`flex h-10 w-full px-2.5 text-sm ${FIELD}`}>
            <option value="all">All visitors</option>
            <option value="new">New visitors</option>
            <option value="returning">Returning visitors</option>
            <option value="logged_in">Logged-in users</option>
          </select>
          {audience === 'logged_in' ? (
            <>
              <Input value={audiencePlan} onChange={(e) => setAudiencePlan(e.target.value)} placeholder="Optional plan, e.g. pro" className={FIELD} />
              <p className="text-xs text-[#666]">
                Requires <code className="text-[#888]">window.TourKit.identify()</code> on your site.{' '}
                <Link href="/docs/announcements" className="text-[#F15025] underline-offset-2 hover:underline">
                  See docs
                </Link>
                .
              </p>
            </>
          ) : null}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="ann-frequency">Frequency</Label>
          <select id="ann-frequency" value={frequency} onChange={(e) => setFrequency(e.target.value)} className={`flex h-10 w-full px-2.5 text-sm ${FIELD}`}>
            <option value="until_dismissed">Until dismissed</option>
            <option value="once">Once per user</option>
            <option value="every_visit">Every visit</option>
          </select>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="ann-start">Start date</Label>
            <Input id="ann-start" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className={FIELD} />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="ann-end">End date</Label>
            <Input id="ann-end" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className={FIELD} />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 border-t border-white/10 pt-5">
          <Button type="submit" disabled={isPending} className="bg-[#F15025] hover:bg-[#F15025]/90">
            {isPending ? 'Saving…' : isEdit ? 'Save changes' : 'Create announcement'}
          </Button>
          <Button variant="outline" asChild className="rounded-xl border-white/10 bg-transparent hover:bg-white/5">
            <Link href={listHref}>Cancel</Link>
          </Button>
        </div>
      </div>

      <aside className="lg:sticky lg:top-20">
        <div className="mb-3 flex items-center justify-between gap-2">
          <div className="text-xs font-medium uppercase tracking-wide text-[#777777]">Live preview</div>
          <button
            type="button"
            onClick={() => setMobilePreview((v) => !v)}
            className="text-xs text-[#888] underline-offset-2 hover:text-white hover:underline">
            {mobilePreview ? 'Desktop' : 'Mobile'}
          </button>
        </div>
        <AnnouncementPreview
          type={type}
          size={size}
          variant={variant}
          title={title}
          description={description}
          ctaText={ctaText}
          imageUrl={imageUrl}
          imagePosition={imagePosition}
          slidePosition={slidePosition}
          mobile={mobilePreview}
        />
      </aside>
    </form>
  )
}
