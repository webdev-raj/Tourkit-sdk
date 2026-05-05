"use client"

import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState, useTransition } from 'react'
import Link from 'next/link'
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronUpIcon,
  CopyIcon,
  MapIcon,
  Trash2Icon,
} from 'lucide-react'

import {
  createStep,
  deleteStep,
  reorderSteps,
  toggleTourActive,
  updateStep,
} from '@/app/actions/tours'
import { ScriptKey } from '@/components/dashboard/script-key'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'

const POSITION_OPTIONS = [
  { value: 'top', label: 'Top' },
  { value: 'bottom', label: 'Bottom' },
  { value: 'left', label: 'Left' },
  { value: 'right', label: 'Right' },
]

const SELECT_INPUT =
  'flex h-10 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm shadow-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:bg-input/50 dark:bg-input/30'

const ACCENT = '#F15025'

function buildInstallSnippet(scriptKey) {
  return `<script 
  src="https://cdn.tourkit.io/tourkit.min.js" 
  data-key="${scriptKey}"
  async>
</script>`
}

function positionPillLabel(position) {
  return String(position || 'bottom').toUpperCase()
}

function InstallSnippetBlock({ scriptKey }) {
  const [copied, setCopied] = useState(false)
  const snippet = useMemo(() => buildInstallSnippet(scriptKey), [scriptKey])

  async function onCopy() {
    await navigator.clipboard.writeText(snippet)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-2">
        <Label className="text-xs font-medium text-muted-foreground">Install snippet</Label>
        <Button
          type="button"
          variant="outline"
          size="xs"
          onClick={onCopy}
          className="h-7 gap-1.5 border-border/80 bg-muted/40"
          aria-label={copied ? 'Copied install snippet' : 'Copy install snippet'}>
          {copied ? <CheckIcon className="size-3.5 text-primary" /> : <CopyIcon className="size-3.5" />}
          {copied ? 'Copied' : 'Copy'}
        </Button>
      </div>
      <pre className="max-h-[12rem] overflow-auto rounded-lg border border-border/60 bg-[#050505] p-3 text-[11px] leading-relaxed text-[#e6e8e6] md:text-xs" tabIndex={0}>
        <code className="whitespace-pre-wrap break-all font-mono">{snippet}</code>
      </pre>
      <p className="text-xs text-muted-foreground">Paste this before <code className="text-foreground/80">&lt;/body&gt;</code> on your website.</p>
    </div>
  )
}

function normalizeStep(s) {
  return {
    ...s,
    title: s.title ?? '',
    position: s.position || 'bottom',
  }
}

export function TourEditor({ project, tour, initialSteps }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [actionError, setActionError] = useState(null)
  const steps = useMemo(
    () => (initialSteps ?? []).map(normalizeStep).sort((a, b) => a.step_order - b.step_order),
    [initialSteps],
  )

  const [panelMode, setPanelMode] = useState('add')
  const [selectedId, setSelectedId] = useState(null)
  const selected = steps.find((s) => s.id === selectedId) ?? null

  const [tourActive, setTourActive] = useState(Boolean(tour.is_active))
  const [addFormKey, setAddFormKey] = useState(0)

  useEffect(() => {
    setTourActive(Boolean(tour.is_active))
  }, [tour.is_active])

  useEffect(() => {
    if (selectedId && !steps.some((s) => s.id === selectedId)) {
      setSelectedId(null)
      setPanelMode('add')
    }
  }, [steps, selectedId])

  useEffect(() => {
    if (panelMode === 'edit' && !selected) {
      setPanelMode('add')
    }
  }, [panelMode, selected])

  const runAction = (fn) => {
    setActionError(null)
    startTransition(async () => {
      const result = await fn()
      if (result?.error) {
        setActionError(result.error)
        return
      }
      router.refresh()
    })
  }

  const handleToggleTour = (checked) => {
    setTourActive(checked)
    setActionError(null)
    startTransition(async () => {
      const result = await toggleTourActive(tour.id, checked)
      if (result?.error) {
        setActionError(result.error)
        setTourActive(!checked)
        return
      }
      router.refresh()
    })
  }

  const moveStep = (index, direction) => {
    const nextIndex = index + direction
    if (nextIndex < 0 || nextIndex >= steps.length) return

    const reordered = [...steps]
    const [removed] = reordered.splice(index, 1)
    reordered.splice(nextIndex, 0, removed)

    const payload = reordered.map((s, i) => ({ id: s.id, step_order: i }))
    runAction(async () => reorderSteps(payload))
  }

  const handleDelete = (stepId) => {
    if (!window.confirm('Delete this step? This cannot be undone.')) return
    runAction(async () => deleteStep(stepId))
    if (selectedId === stepId) {
      setSelectedId(null)
      setPanelMode('add')
    }
  }

  function openEditForStep(stepId) {
    setPanelMode('edit')
    setSelectedId(stepId)
  }

  function openAddPanel() {
    setPanelMode('add')
    setSelectedId(null)
    document.getElementById('tour-editor-right-panel')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
      <nav>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-primary">
          <ChevronLeftIcon className="size-4" aria-hidden />
          All projects
        </Link>
      </nav>

      {actionError ? (
        <Alert variant="destructive" className="border-destructive/50">
          <AlertTitle>Couldn’t save</AlertTitle>
          <AlertDescription>{actionError}</AlertDescription>
        </Alert>
      ) : null}

      <div className="flex flex-col gap-6 rounded-lg border border-border/60 bg-card/40 px-4 py-5 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 flex-1 space-y-1">
            <h1 className="text-balance text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              {project.name}
            </h1>
            <p className="text-sm text-muted-foreground">{project.domain}</p>
          </div>

          <div className="flex shrink-0 items-center gap-3 rounded-lg border border-border/50 bg-muted/40 px-3 py-2.5">
            <div className="flex flex-col gap-0.5">
              <span className="text-xs font-medium text-muted-foreground">Tour visible on site</span>
              <span className="text-[0.68rem] text-muted-foreground/90">
                Matches <code className="text-foreground/80">tours.is_active</code> in Supabase.
              </span>
            </div>
            <Switch
              checked={tourActive}
              onCheckedChange={handleToggleTour}
              disabled={isPending}
              aria-label={tourActive ? 'Tour active' : 'Tour inactive'}
            />
          </div>
        </div>

        <Separator className="bg-border/60" />

        <div className="flex flex-col gap-2">
          <Label className="text-xs font-medium text-muted-foreground">Script key</Label>
          <ScriptKey value={project.script_key} />
        </div>

        <Separator className="bg-border/60" />

        <InstallSnippetBlock scriptKey={project.script_key} />
      </div>

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(280px,26rem)] lg:items-start">
        <Card className="border-border/80 bg-card/60 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Steps ({steps.length})</CardTitle>
            <CardDescription>Order matches how the tour runs on your site.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {steps.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border/70 bg-muted/20 px-6 py-12 text-center">
                <div
                  className="flex size-12 items-center justify-center rounded-full border border-border/60 bg-card"
                  style={{ color: ACCENT }}>
                  <MapIcon className="size-6" aria-hidden />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-foreground">No steps yet</p>
                  <p className="max-w-[18rem] text-xs leading-relaxed text-muted-foreground">
                    Add your first step using the panel on the right
                  </p>
                </div>
              </div>
            ) : (
              steps.map((step, index) => {
                const isSelected = selectedId === step.id && panelMode === 'edit'
                return (
                  <div
                    key={step.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => openEditForStep(step.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        openEditForStep(step.id)
                      }
                    }}
                    className={`flex cursor-pointer flex-col gap-2 rounded-lg border p-4 text-left transition-[border-color,box-shadow,background-color] hover:border-[#F15025]/45 ${
                      isSelected
                        ? 'border-2 border-[#F15025] bg-[#F15025]/[0.07] shadow-[inset_0_0_0_1px_rgba(241,80,37,0.25)]'
                        : 'border border-border/80 bg-muted/25'
                    }`}>
                    <div className="flex items-start justify-between gap-3">
                      <span className="text-xs font-medium text-muted-foreground">Step {index + 1}</span>
                      <div className="flex shrink-0 items-center gap-1" onClick={(e) => e.stopPropagation()}>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon-xs"
                          disabled={isPending || index === 0}
                          aria-label="Move step up"
                          onClick={(e) => {
                            e.stopPropagation()
                            moveStep(index, -1)
                          }}>
                          <ChevronUpIcon />
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon-xs"
                          disabled={isPending || index === steps.length - 1}
                          aria-label="Move step down"
                          onClick={(e) => {
                            e.stopPropagation()
                            moveStep(index, 1)
                          }}>
                          <ChevronDownIcon />
                        </Button>
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon-xs"
                          disabled={isPending}
                          aria-label="Delete step"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDelete(step.id)
                          }}>
                          <Trash2Icon />
                        </Button>
                      </div>
                    </div>
                    <div className="truncate text-sm font-semibold text-foreground">
                      {step.title?.trim() ? step.title : '(No title)'}
                    </div>
                    <code className="truncate font-mono text-xs" style={{ color: ACCENT }}>
                      {step.selector}
                    </code>
                    <p className="line-clamp-1 text-xs text-muted-foreground">{step.message}</p>
                    <div>
                      <span className="inline-flex rounded-full border border-border/60 bg-muted/50 px-2 py-0.5 text-[0.65rem] font-semibold tracking-wide text-muted-foreground">
                        {positionPillLabel(step.position)}
                      </span>
                    </div>
                  </div>
                )
              })
            )}

            <Button
              type="button"
              variant="outline"
              className="mt-2 w-full border-dashed border-[#F15025]/50 text-[#F15025] hover:bg-[#F15025]/10"
              disabled={isPending}
              onClick={openAddPanel}>
              Add step
            </Button>
          </CardContent>
        </Card>

        <Card
          className="min-w-0 border-border/80 bg-card/60 backdrop-blur-sm"
          id="tour-editor-right-panel">
          <CardHeader className="pb-3">
            {panelMode === 'edit' && selected ? (
              <>
                <CardTitle className="text-lg">Edit step</CardTitle>
                <CardDescription>Update copy, selector, and tooltip position.</CardDescription>
              </>
            ) : (
              <>
                <CardTitle className="text-lg">Add new step</CardTitle>
                <CardDescription>Create a step and choose the element to highlight.</CardDescription>
              </>
            )}
          </CardHeader>
          <CardContent>
            {panelMode === 'edit' && selected ? (
              <EditStepForm
                key={selected.id}
                step={selected}
                disabled={isPending}
                onError={setActionError}
                onCancel={() => {
                  setActionError(null)
                  setPanelMode('add')
                  setSelectedId(null)
                }}
                onSuccess={() => {
                  setActionError(null)
                  setPanelMode('add')
                  setSelectedId(null)
                  router.refresh()
                }}
              />
            ) : (
              <AddStepForm
                key={addFormKey}
                tourId={tour.id}
                disabled={isPending}
                onCreated={() => {
                  setAddFormKey((k) => k + 1)
                }}
                onError={setActionError}
                onSuccess={() => {
                  setActionError(null)
                  router.refresh()
                }}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function AddStepForm({ tourId, disabled, onCreated, onError, onSuccess }) {
  const [isPending, startTransition] = useTransition()

  return (
    <form
      className="flex flex-col gap-4"
      action={(formData) => {
        onError(null)
        const title = String(formData.get('title') || '')
        const message = String(formData.get('message') || '')
        const selector = String(formData.get('selector') || '')
        const position = String(formData.get('position') || 'bottom')
        startTransition(async () => {
          const result = await createStep(tourId, { title, message, selector, position })
          if (result?.error) {
            onError(result.error)
            return
          }
          onCreated(result.id)
          onSuccess()
        })
      }}>
      <FieldGroup
        idPrefix="add"
        defaultTitle=""
        defaultMessage=""
        defaultSelector=""
        defaultPosition="bottom"
        disabled={disabled || isPending}
      />
      <div className="flex justify-end">
        <Button type="submit" disabled={disabled || isPending}>
          {isPending ? 'Adding…' : 'Add step'}
        </Button>
      </div>
    </form>
  )
}

function EditStepForm({ step, disabled, onError, onSuccess, onCancel }) {
  const [isPending, startTransition] = useTransition()

  return (
    <form
      className="flex flex-col gap-4"
      action={(formData) => {
        onError(null)
        const title = String(formData.get('title') || '')
        const message = String(formData.get('message') || '')
        const selector = String(formData.get('selector') || '')
        const position = String(formData.get('position') || 'bottom')
        startTransition(async () => {
          const result = await updateStep(step.id, { title, message, selector, position })
          if (result?.error) {
            onError(result.error)
            return
          }
          onSuccess()
        })
      }}>
      <FieldGroup
        idPrefix={`edit-${step.id}`}
        defaultTitle={step.title ?? ''}
        defaultMessage={step.message ?? ''}
        defaultSelector={step.selector ?? ''}
        defaultPosition={step.position ?? 'bottom'}
        disabled={disabled || isPending}
      />
      <div className="flex flex-wrap justify-end gap-2">
        <Button type="button" variant="outline" disabled={disabled || isPending} onClick={() => onCancel?.()}>
          Cancel
        </Button>
        <Button type="submit" disabled={disabled || isPending}>
          {isPending ? 'Saving…' : 'Save changes'}
        </Button>
      </div>
    </form>
  )
}

function FieldGroup({
  idPrefix,
  defaultTitle,
  defaultMessage,
  defaultSelector,
  defaultPosition,
  disabled,
}) {
  return (
    <>
      <div className="flex flex-col gap-2">
        <Label htmlFor={`${idPrefix}-title`}>Title</Label>
        <Input
          id={`${idPrefix}-title`}
          name="title"
          placeholder="Welcome"
          defaultValue={defaultTitle}
          disabled={disabled}
          autoComplete="off"
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor={`${idPrefix}-message`}>Message</Label>
        <Textarea
          id={`${idPrefix}-message`}
          name="message"
          placeholder="Explain what this part of the page does…"
          defaultValue={defaultMessage}
          disabled={disabled}
          required
          rows={4}
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor={`${idPrefix}-selector`}>CSS selector</Label>
        <Input
          id={`${idPrefix}-selector`}
          name="selector"
          placeholder="nav, #hero, .cta-button"
          defaultValue={defaultSelector}
          disabled={disabled}
          required
          spellCheck={false}
          autoComplete="off"
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor={`${idPrefix}-position`}>Position</Label>
        <select
          id={`${idPrefix}-position`}
          name="position"
          className={SELECT_INPUT}
          defaultValue={defaultPosition}
          disabled={disabled}>
          {POSITION_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </>
  )
}
