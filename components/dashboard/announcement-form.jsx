'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { createAnnouncement, updateAnnouncement } from '@/app/actions/announcements'
import { AnnouncementModalPreview } from '@/components/dashboard/announcement-modal-preview'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

const FIELD =
  'rounded-xl border-white/10 bg-[#0a0a0a] text-foreground placeholder:text-[#555555] focus-visible:border-[#F15025]/50 focus-visible:ring-[#F15025]/20'

function toDateInput(value) {
  if (!value) return ''
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return ''
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

export function AnnouncementForm({ projectId, announcement }) {
  const router = useRouter()
  const isEdit = Boolean(announcement?.id)
  const listHref = `/dashboard/projects/${projectId}/announcements`

  const [title, setTitle] = useState(announcement?.title || '')
  const [description, setDescription] = useState(announcement?.description || '')
  const [ctaText, setCtaText] = useState(announcement?.cta_text || '')
  const [ctaUrl, setCtaUrl] = useState(announcement?.cta_url || '')
  const [imageUrl, setImageUrl] = useState(announcement?.image_url || '')
  const [startDate, setStartDate] = useState(toDateInput(announcement?.start_date))
  const [endDate, setEndDate] = useState(toDateInput(announcement?.end_date))
  const [frequency, setFrequency] = useState(announcement?.frequency === 'once' ? 'once' : 'until_dismissed')
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()

  function onSubmit(e) {
    e.preventDefault()
    setError('')

    const payload = {
      title,
      description,
      cta_text: ctaText,
      cta_url: ctaUrl,
      image_url: imageUrl,
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
    <form onSubmit={onSubmit} className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(280px,22rem)] lg:items-start">
      <div className="flex flex-col gap-5 rounded-xl border border-white/10 bg-[#111111]/80 p-5 md:p-6">
        {error ? (
          <Alert variant="destructive" className="border-destructive/50">
            <AlertTitle>Could not save</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : null}

        <div className="flex flex-col gap-2">
          <Label htmlFor="ann-title">Title</Label>
          <Input
            id="ann-title"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="New feature"
            className={FIELD}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="ann-description">Description</Label>
          <Textarea
            id="ann-description"
            required
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="We just launched something worth seeing."
            className={FIELD}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="ann-cta-text">CTA button text</Label>
            <Input
              id="ann-cta-text"
              value={ctaText}
              onChange={(e) => setCtaText(e.target.value)}
              placeholder="Try it"
              className={FIELD}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="ann-cta-url">CTA URL</Label>
            <Input
              id="ann-cta-url"
              value={ctaUrl}
              onChange={(e) => setCtaUrl(e.target.value)}
              placeholder="https://example.com/new"
              className={FIELD}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="ann-image">Image URL</Label>
          <Input
            id="ann-image"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://example.com/banner.jpg"
            className={FIELD}
          />
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

        <div className="flex flex-col gap-2">
          <Label htmlFor="ann-frequency">Frequency</Label>
          <select
            id="ann-frequency"
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
            className={`flex h-10 w-full px-2.5 py-1 text-sm shadow-sm outline-none ${FIELD}`}>
            <option value="until_dismissed">Until dismissed</option>
            <option value="once">Once per user</option>
          </select>
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
        <div className="mb-3 text-xs font-medium uppercase tracking-wide text-[#777777]">Live preview</div>
        <AnnouncementModalPreview title={title} description={description} ctaText={ctaText} imageUrl={imageUrl} />
      </aside>
    </form>
  )
}
