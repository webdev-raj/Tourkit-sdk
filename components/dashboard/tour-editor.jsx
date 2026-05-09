"use client"

import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState, useTransition } from 'react'
import Link from 'next/link'
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ChevronLeftIcon,
  CopyIcon,
  MapIcon,
  GripVerticalIcon,
  Trash2Icon,
  PaletteIcon,
  MoonIcon,
  SunIcon,
  BarChart2Icon
} from 'lucide-react'

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

import {
  createStep,
  deleteStep,
  reorderSteps,
  toggleTourActive,
  updateTourCustomization,
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { TourPreview } from '@/components/dashboard/tour-preview'

const POSITION_OPTIONS = [
  { value: 'top', label: 'Top' },
  { value: 'bottom', label: 'Bottom' },
  { value: 'left', label: 'Left' },
  { value: 'right', label: 'Right' },
]

const SELECT_INPUT =
  'flex h-10 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm shadow-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:bg-input/50 dark:bg-input/30'

const ACCENT = '#F15025'
const APPEARANCE_COLORS = ['#F15025', '#6366f1', '#22c55e', '#3b82f6', '#ec4899', '#f59e0b']
const FONT_OPTIONS = [
  { value: 'Inter', label: 'Inter' },
  { value: 'Geist', label: 'Geist' },
  { value: 'System', label: 'System UI' },
  { value: 'Roboto', label: 'Roboto' },
  { value: 'Poppins', label: 'Poppins' },
]
const RADIUS_OPTIONS = [
  { value: '4px', label: 'Sharp' },
  { value: '10px', label: 'Default' },
  { value: '16px', label: 'Rounded' },
  { value: '24px', label: 'Pill' },
]

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

export function TourEditor({ project, tour, initialSteps, analyticsHref }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [actionError, setActionError] = useState(null)
  const initialSorted = useMemo(
    () => (initialSteps ?? []).map(normalizeStep).sort((a, b) => a.step_order - b.step_order),
    [initialSteps],
  )

  const [steps, setSteps] = useState(initialSorted)

  const [panelMode, setPanelMode] = useState('add')
  const [selectedId, setSelectedId] = useState(null)
  const selected = steps.find((s) => s.id === selectedId) ?? null

  const [tourActive, setTourActive] = useState(Boolean(tour.is_active))
  const [addFormKey, setAddFormKey] = useState(0)
  const [appearanceOpen, setAppearanceOpen] = useState(false)
  const [appearanceState, setAppearanceState] = useState({
    primary_color: tour.primary_color || '#F15025',
    font_family: tour.font_family || 'Inter',
    border_radius: tour.border_radius || '10px',
    theme: tour.theme || 'dark',
  })
  const [appearanceFeedback, setAppearanceFeedback] = useState({ ok: false, error: null })

  useEffect(() => {
    setTourActive(Boolean(tour.is_active))
  }, [tour.is_active])
  useEffect(() => {
    setAppearanceState({
      primary_color: tour.primary_color || '#F15025',
      font_family: tour.font_family || 'Inter',
      border_radius: tour.border_radius || '10px',
      theme: tour.theme || 'dark',
    })
  }, [tour.primary_color, tour.font_family, tour.border_radius, tour.theme])

  useEffect(() => {
    setSteps(initialSorted)
  }, [initialSorted])

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

  const [stepToDelete, setStepToDelete] = useState(null)
  const [selectorError, setSelectorError] = useState('')

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  function handleDragEnd(event) {
    const { active, over } = event
    if (!active?.id || !over?.id) return
    if (active.id === over.id) return

    const oldIndex = steps.findIndex((s) => s.id === active.id)
    const newIndex = steps.findIndex((s) => s.id === over.id)
    if (oldIndex < 0 || newIndex < 0) return

    const newSteps = arrayMove(steps, oldIndex, newIndex)
    setSteps(newSteps)

    const reordered = newSteps.map((s, i) => ({ id: s.id, step_order: i + 1 }))

    setActionError(null)
    startTransition(async () => {
      const result = await reorderSteps(reordered)
      if (result?.error) {
        setActionError(result.error)
        return
      }
      router.refresh()
    })
  }

  function validateSelector(value) {
    if (!value || !value.trim()) {
      setSelectorError('Selector is required')
      return false
    }
    try {
      document.querySelector(value)
      setSelectorError('')
      return true
    } catch (_) {
      setSelectorError('Invalid CSS selector')
      return false
    }
  }

  const confirmDelete = () => {
    const stepId = stepToDelete
    if (!stepId) return

    setStepToDelete(null)

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

  const [draft, setDraft] = useState({
    title: '',
    message: '',
    selector: '',
    position: 'bottom',
  })

  const [editDraft, setEditDraft] = useState({
    title: '',
    message: '',
    selector: '',
    position: 'bottom',
  })

  useEffect(() => {
    if (panelMode === 'edit' && selected) {
      setEditDraft({
        title: selected.title ?? '',
        message: selected.message ?? '',
        selector: selected.selector ?? '',
        position: selected.position ?? 'bottom',
      })
    }
  }, [panelMode, selectedId]) // eslint-disable-line react-hooks/exhaustive-deps

  const previewData = panelMode === 'edit' && selected ? editDraft : draft

  const selectedIndex = selected ? steps.findIndex((s) => s.id === selected.id) : -1
  const previewStepNumber = panelMode === 'edit' && selected ? selectedIndex + 1 : steps.length + 1
  const previewTotalSteps = panelMode === 'edit' && selected ? steps.length : steps.length + 1

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

          <div className="flex shrink-0 items-center gap-3">
            {analyticsHref ? (
              <Button variant="outline" size="sm" asChild className="border-white/10 bg-background/20 hover:bg-muted/20">
                <Link href={analyticsHref}><BarChart2Icon className="mr-2 size-4" /> View Analytics</Link>
              </Button>
            ) : null}
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
        </div>

        <Separator className="bg-border/60" />

        <div className="rounded-lg border border-border/60 bg-muted/20">
          <button
            type="button"
            className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
            onClick={() => setAppearanceOpen((v) => !v)}>
            <div className="flex items-center gap-2">
              <PaletteIcon className="size-4 text-primary" aria-hidden />
              <div>
                <div className="text-sm font-medium text-foreground">Appearance</div>
                <div className="text-xs text-muted-foreground">Customize tooltip look and theme</div>
              </div>
            </div>
            {appearanceOpen ? <ChevronUpIcon className="size-4 text-muted-foreground" /> : <ChevronDownIcon className="size-4 text-muted-foreground" />}
          </button>
          {appearanceOpen ? (
            <div className="border-t border-border/60 px-4 py-4">
              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                  <Label>Theme</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      className={`justify-start gap-2 ${appearanceState.theme === 'dark' ? 'border-[#F15025]/60 bg-[#F15025]/10 text-[#F15025]' : 'border-white/10 bg-background/20 hover:bg-muted/20'}`}
                      onClick={() => setAppearanceState((s) => ({ ...s, theme: 'dark' }))}>
                      <MoonIcon className="size-4" />
                      Dark
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className={`justify-start gap-2 ${appearanceState.theme === 'light' ? 'border-[#F15025]/60 bg-[#F15025]/10 text-[#F15025]' : 'border-white/10 bg-background/20 hover:bg-muted/20'}`}
                      onClick={() => setAppearanceState((s) => ({ ...s, theme: 'light' }))}>
                      <SunIcon className="size-4" />
                      Light
                    </Button>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Label>Primary color</Label>
                  <div className="flex flex-wrap items-center gap-2">
                    {APPEARANCE_COLORS.map((color) => {
                      const selected = appearanceState.primary_color.toLowerCase() === color.toLowerCase()
                      return (
                        <button
                          key={color}
                          type="button"
                          aria-label={`Set color ${color}`}
                          onClick={() => setAppearanceState((s) => ({ ...s, primary_color: color }))}
                          className={`size-7 rounded-full border ${selected ? 'ring-2 ring-white ring-offset-1 ring-offset-background' : ''}`}
                          style={{ backgroundColor: color, borderColor: 'rgba(255,255,255,0.2)' }}
                        />
                      )
                    })}
                    <Input
                      value={appearanceState.primary_color}
                      onChange={(e) => setAppearanceState((s) => ({ ...s, primary_color: e.target.value }))}
                      className="h-9 w-28"
                      spellCheck={false}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Label>Font family</Label>
                  <select
                    className={SELECT_INPUT}
                    value={appearanceState.font_family}
                    onChange={(e) => setAppearanceState((s) => ({ ...s, font_family: e.target.value }))}>
                    {FONT_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <Label>Corner style</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {RADIUS_OPTIONS.map((r) => (
                      <button
                        key={r.value}
                        type="button"
                        onClick={() => setAppearanceState((s) => ({ ...s, border_radius: r.value }))}
                        className={`rounded-lg border px-3 py-2 text-left text-sm ${
                          appearanceState.border_radius === r.value
                            ? 'border-[#F15025]/60 bg-[#F15025]/10 text-[#F15025]'
                            : 'border-white/10 bg-background/20 text-foreground hover:bg-muted/20'
                        }`}>
                        <div className="font-medium">{r.label}</div>
                        <div className="mt-1 h-4 w-10 border border-white/20" style={{ borderRadius: r.value }} />
                      </button>
                    ))}
                  </div>
                </div>

                <Button
                  type="button"
                  className="w-full"
                  disabled={isPending}
                  onClick={() => {
                    setAppearanceFeedback({ ok: false, error: null })
                    startTransition(async () => {
                      const res = await updateTourCustomization(tour.id, appearanceState)
                      if (!res?.ok) {
                        setAppearanceFeedback({ ok: false, error: res?.error || 'Could not save appearance.' })
                        return
                      }
                      setAppearanceFeedback({ ok: true, error: null })
                      router.refresh()
                    })
                  }}>
                  {isPending ? 'Saving…' : 'Save appearance'}
                </Button>

                {appearanceFeedback.ok ? (
                  <Alert className="border-white/10 bg-background/10">
                    <AlertTitle>Appearance updated</AlertTitle>
                    <AlertDescription>Your tooltip style has been saved.</AlertDescription>
                  </Alert>
                ) : null}
                {appearanceFeedback.error ? (
                  <Alert variant="destructive" className="border-destructive/50">
                    <AlertTitle>Couldn’t save appearance</AlertTitle>
                    <AlertDescription>{appearanceFeedback.error}</AlertDescription>
                  </Alert>
                ) : null}
              </div>
            </div>
          ) : null}
        </div>

        <Separator className="bg-border/60" />

        <div className="flex flex-col gap-2">
          <Label className="text-xs font-medium text-muted-foreground">Script key</Label>
          <ScriptKey value={project.script_key} />
        </div>

        <Separator className="bg-border/60" />

        <InstallSnippetBlock scriptKey={project.script_key} />
      </div>

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:items-start xl:grid-cols-[minmax(0,1fr)_minmax(0,26rem)_minmax(0,22rem)]">
        <Card className="border-border/80 bg-card/60 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Steps ({steps.length})</CardTitle>
            <CardDescription>Order matches how the tour runs on your site.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <AlertDialog
              open={stepToDelete !== null}
              onOpenChange={(open) => {
                if (!open) setStepToDelete(null)
              }}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete this step?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This step will be permanently removed from your tour. This cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel type="button" onClick={() => setStepToDelete(null)}>
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction type="button" className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={confirmDelete}>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

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
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={steps.map((s) => s.id)} strategy={verticalListSortingStrategy}>
                  {steps.map((step, index) => (
                    <SortableStepCard
                      key={step.id}
                      step={step}
                      index={index}
                      disabled={isPending}
                      isSelected={selectedId === step.id && panelMode === 'edit'}
                      onSelect={() => openEditForStep(step.id)}
                      onDelete={() => {
                        setStepToDelete(step.id)
                      }}
                    />
                  ))}
                </SortableContext>
              </DndContext>
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
                disabled={isPending}
                draft={editDraft}
                onDraftChange={setEditDraft}
                selectorError={selectorError}
                onSelectorBlur={validateSelector}
                onCancel={() => {
                  setActionError(null)
                  setPanelMode('add')
                  setSelectedId(null)
                }}
                onSave={() => {
                  if (!validateSelector(editDraft.selector)) return
                  setActionError(null)
                  startTransition(async () => {
                    const result = await updateStep(selected.id, editDraft)
                    if (result?.error) {
                      setActionError(result.error)
                      return
                    }
                    setSteps((prev) =>
                      prev.map((s) => (s.id === selected.id ? { ...s, ...editDraft, position: editDraft.position || s.position } : s)),
                    )
                    setPanelMode('add')
                    setSelectedId(null)
                    router.refresh()
                  })
                }}
              />
            ) : (
              <AddStepForm
                disabled={isPending}
                draft={draft}
                onDraftChange={setDraft}
                selectorError={selectorError}
                onSelectorBlur={validateSelector}
                onAdd={() => {
                  if (!validateSelector(draft.selector)) return
                  setActionError(null)
                  startTransition(async () => {
                    const result = await createStep(tour.id, draft)
                    if (result?.error) {
                      setActionError(result.error)
                      return
                    }
                    setAddFormKey((k) => k + 1)
                    setSteps((prev) => {
                      const nextOrder = prev.length ? Math.max(...prev.map((s) => Number(s.step_order) || 0)) + 1 : 1
                      return [
                        ...prev,
                        {
                          id: result.id,
                          tour_id: tour.id,
                          selector: draft.selector,
                          title: draft.title,
                          message: draft.message,
                          position: draft.position || 'bottom',
                          step_order: nextOrder,
                        },
                      ]
                    })
                    setDraft({ title: '', message: '', selector: '', position: 'bottom' })
                    router.refresh()
                  })
                }}
              />
            )}
          </CardContent>
        </Card>

        <Card className="min-w-0 border-border/80 bg-card/60 backdrop-blur-sm lg:col-span-2 xl:col-span-1">
          <CardContent className="pt-4">
            <TourPreview
              title={previewData.title}
              message={previewData.message}
              position={previewData.position}
              stepNumber={previewStepNumber}
              totalSteps={previewTotalSteps}
              customization={appearanceState}
              onPositionChange={(pos) => {
                if (panelMode === 'edit') setEditDraft((s) => ({ ...s, position: pos }))
                else setDraft((s) => ({ ...s, position: pos }))
              }}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function SortableStepCard({ step, index, disabled, isSelected, onSelect, onDelete }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: step.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onSelect?.()
        }
      }}
      className={`flex cursor-pointer flex-col gap-2 rounded-lg border p-4 text-left transition-[border-color,box-shadow,background-color] hover:border-[#F15025]/45 ${
        isSelected
          ? 'border-2 border-[#F15025] bg-[#F15025]/[0.07] shadow-[inset_0_0_0_1px_rgba(241,80,37,0.25)]'
          : 'border border-border/80 bg-muted/25'
      }`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <span
            className="inline-flex items-center text-muted-foreground hover:text-foreground"
            style={{ cursor: disabled ? 'not-allowed' : 'grab' }}
            onClick={(e) => e.stopPropagation()}
            {...(disabled ? {} : attributes)}
            {...(disabled ? {} : listeners)}>
            <GripVerticalIcon className="size-4" aria-hidden />
          </span>
          <span className="text-xs font-medium text-muted-foreground">Step {index + 1}</span>
        </div>
        <Button
          type="button"
          variant="destructive"
          size="icon-xs"
          disabled={disabled}
          aria-label="Delete step"
          onClick={(e) => {
            e.stopPropagation()
            onDelete?.()
          }}>
          <Trash2Icon />
        </Button>
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
}

function StepFields({ value, onChange, disabled, selectorError, onSelectorBlur }) {
  return (
    <>
      <div className="flex flex-col gap-2">
        <Label htmlFor="step-title">Title</Label>
        <Input
          id="step-title"
          placeholder="Welcome"
          value={value.title}
          disabled={disabled}
          autoComplete="off"
          onChange={(e) => onChange({ ...value, title: e.target.value })}
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="step-message">Message</Label>
        <Textarea
          id="step-message"
          placeholder="Explain what this part of the page does…"
          value={value.message}
          disabled={disabled}
          required
          rows={4}
          onChange={(e) => onChange({ ...value, message: e.target.value })}
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="step-selector">CSS selector</Label>
        <Input
          id="step-selector"
          placeholder="nav, #hero, .cta-button"
          value={value.selector}
          disabled={disabled}
          required
          spellCheck={false}
          autoComplete="off"
          onChange={(e) => onChange({ ...value, selector: e.target.value })}
          onBlur={(e) => onSelectorBlur(e.target.value)}
        />
        {selectorError && (
          <p className="mt-1 text-xs text-red-500">
            {selectorError}
          </p>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="step-position">Position</Label>
        <select
          id="step-position"
          className={SELECT_INPUT}
          value={value.position}
          disabled={disabled}
          onChange={(e) => onChange({ ...value, position: e.target.value })}>
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

function AddStepForm({ disabled, draft, onDraftChange, onAdd, selectorError, onSelectorBlur }) {
  return (
    <div className="flex flex-col gap-4">
      <StepFields value={draft} onChange={onDraftChange} disabled={disabled} selectorError={selectorError} onSelectorBlur={onSelectorBlur} />
      <div className="flex justify-end">
        <Button type="button" disabled={disabled} onClick={onAdd}>
          {disabled ? 'Adding…' : 'Add step'}
        </Button>
      </div>
    </div>
  )
}

function EditStepForm({ disabled, draft, onDraftChange, onSave, onCancel, selectorError, onSelectorBlur }) {
  return (
    <div className="flex flex-col gap-4">
      <StepFields value={draft} onChange={onDraftChange} disabled={disabled} selectorError={selectorError} onSelectorBlur={onSelectorBlur} />
      <div className="flex flex-wrap justify-end gap-2">
        <Button type="button" variant="outline" disabled={disabled} onClick={onCancel}>
          Cancel
        </Button>
        <Button type="button" disabled={disabled} onClick={onSave}>
          {disabled ? 'Saving…' : 'Save changes'}
        </Button>
      </div>
    </div>
  )
}
