'use client'

import { useMemo, useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { PencilIcon, Trash2Icon } from 'lucide-react'

import { deleteAnnouncement, toggleAnnouncementActive } from '@/app/actions/announcements'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'

function announcementStatus(row, now) {
  if (!row?.is_active) return 'Inactive'
  const start = row.start_date ? new Date(row.start_date) : null
  const end = row.end_date ? new Date(row.end_date) : null
  if (start && !Number.isNaN(start.getTime()) && start > now) return 'Scheduled'
  if (end && !Number.isNaN(end.getTime()) && end < now) return 'Expired'
  return 'Active'
}

function statusClasses(status) {
  if (status === 'Active') return 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
  if (status === 'Scheduled') return 'border-sky-500/30 bg-sky-500/10 text-sky-300'
  if (status === 'Expired') return 'border-white/10 bg-white/5 text-[#888888]'
  return 'border-white/10 bg-[#0a0a0a] text-[#777777]'
}

function typeLabel(type) {
  if (type === 'banner') return 'Banner'
  if (type === 'slide_in') return 'Slide-in'
  return 'Modal'
}

function formatCtr(ctr) {
  const n = Number(ctr)
  if (!Number.isFinite(n) || n <= 0) return '0%'
  return `${Math.round(n * 1000) / 10}%`
}

export function AnnouncementsList({ projectId, announcements, statsById }) {
  const router = useRouter()
  const [error, setError] = useState('')
  const [pendingId, setPendingId] = useState('')
  const [isPending, startTransition] = useTransition()
  const now = useMemo(() => new Date(), [])

  function onDelete(id) {
    setError('')
    setPendingId(id)
    startTransition(async () => {
      const result = await deleteAnnouncement(id)
      setPendingId('')
      if (!result?.ok) {
        setError(result?.error || 'Could not delete announcement.')
        return
      }
      router.refresh()
    })
  }

  function onToggle(id, next) {
    setError('')
    setPendingId(id)
    startTransition(async () => {
      const result = await toggleAnnouncementActive(id, next)
      setPendingId('')
      if (!result?.ok) {
        setError(result?.error || 'Could not update announcement.')
        return
      }
      router.refresh()
    })
  }

  return (
    <div className="flex flex-col gap-3">
      {error ? (
        <Alert variant="destructive" className="border-destructive/50">
          <AlertTitle>Could not update announcements</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      {announcements.map((row) => {
        const status = announcementStatus(row, now)
        const stats = statsById?.[row.id] || { views: 0, clicks: 0, ctr: 0 }
        const busy = isPending && pendingId === row.id

        return (
          <article
            key={row.id}
            className="flex flex-col gap-4 rounded-xl border border-white/10 bg-[#111111]/80 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="truncate text-base font-semibold tracking-tight text-white">{row.title}</h2>
                <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] font-medium text-[#bbb]">
                  {typeLabel(row.type)}
                </span>
                <span className={`inline-flex rounded-full border px-2 py-0.5 text-[11px] font-medium ${statusClasses(status)}`}>
                  {status}
                </span>
              </div>
              <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[#888888]">{row.description}</p>
              <p className="mt-3 text-xs text-[#666666]">
                {stats.views} views · {stats.clicks} clicks · {formatCtr(stats.ctr)} CTR
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-3">
              <Switch
                checked={Boolean(row.is_active)}
                disabled={busy}
                onCheckedChange={(checked) => onToggle(row.id, checked)}
                aria-label="Toggle active"
              />
              <Button variant="outline" size="sm" asChild className="rounded-xl border-white/10 bg-background/20 hover:bg-white/5">
                <Link href={`/dashboard/projects/${projectId}/announcements/${row.id}`}>
                  <PencilIcon className="mr-1.5 size-3.5" aria-hidden />
                  Edit
                </Link>
              </Button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={busy}
                    className="rounded-xl border-red-900/50 bg-red-950/20 text-red-200 hover:bg-red-950/40 hover:text-red-100">
                    <Trash2Icon className="mr-1.5 size-3.5" aria-hidden />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete this announcement?</AlertDialogTitle>
                    <AlertDialogDescription>
                      “{row.title}” will be removed permanently. This cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel type="button">Cancel</AlertDialogCancel>
                    <Button type="button" variant="destructive" disabled={busy} onClick={() => onDelete(row.id)}>
                      Delete
                    </Button>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </article>
        )
      })}
    </div>
  )
}
