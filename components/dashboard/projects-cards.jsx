"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import {
  CheckIcon,
  CopyIcon,
  FolderOpenIcon,
  ArrowRightIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ExternalLinkIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { ScriptKey } from "@/components/dashboard/script-key"
import { Label } from "@/components/ui/label"

function CopyIconButton({ text, ariaLabel }) {
  const [copied, setCopied] = useState(false)

  async function onCopy() {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1200)
    } catch {
      /* silent */
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="icon-sm"
      aria-label={ariaLabel}
      className="h-9 w-9 rounded-xl border-white/10 bg-background/20 hover:bg-muted/20"
      onClick={(e) => {
        e.stopPropagation()
        onCopy()
      }}>
      {copied ? <CheckIcon className="size-4 text-primary" /> : <CopyIcon className="size-4" />}
    </Button>
  )
}

function CopySnippetButton({ snippet }) {
  const [copied, setCopied] = useState(false)

  async function onCopy() {
    try {
      await navigator.clipboard.writeText(snippet)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1500)
    } catch {
      /* silent */
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className="gap-2 rounded-xl border-white/10 bg-background/20 hover:bg-muted/20"
      onClick={(e) => {
        e.stopPropagation()
        onCopy()
      }}>
      {copied ? <CheckIcon className="size-4 text-primary" /> : <CopyIcon className="size-4" />}
      {copied ? "Copied" : "Copy snippet"}
    </Button>
  )
}

function buildInstallSnippet(scriptKey, appUrl) {
  var src = "https://cdn.jsdelivr.net/gh/webdev-raj/Tourkit@sdk-v8/sdk/dist/tourkit.min.js"
  var safeKey = String(scriptKey || "")
  var safeApi = String(appUrl || "")

  return `<script
  src="${src}"
  data-key="${safeKey}"
  data-api="${safeApi}"
  async>
</script>`
}

function StatusBadge({ isActive }) {
  const base =
    "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[0.68rem] font-semibold uppercase tracking-wide"
  if (isActive) {
    return (
      <span className={`${base} border-white/10 bg-background/30 text-foreground`}>
        <span className="size-1.5 rounded-full bg-emerald-400" aria-hidden />
        Active
      </span>
    )
  }

  return (
    <span className={`${base} border-white/10 bg-background/30 text-muted-foreground`}>
      <span className="size-1.5 rounded-full bg-muted-foreground/60" aria-hidden />
      Inactive
    </span>
  )
}

function ProjectCard({ project, appUrl, open, onToggle }) {
  const snippet = useMemo(
    () => buildInstallSnippet(project.script_key, appUrl),
    [project.script_key, appUrl]
  )

  return (
    <div
      className={`rounded-xl border border-white/10 bg-card/20 shadow-[0_0_0_1px_rgba(255,255,255,0.02)] transition-[border-color,background-color] ${
        open ? "bg-muted/10" : "hover:bg-muted/10 hover:border-white/20"
      }`}
      role="group">
      <div
        className="p-4 sm:p-5">
        <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="truncate text-base font-semibold sm:text-lg">{project.name}</h3>
              <StatusBadge isActive={project.tour_is_active} />
            </div>
            <div className="mt-1 truncate text-xs text-muted-foreground">{project.domain}</div>

            <div className="mt-3 flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-background/20 px-3 py-1 text-xs text-muted-foreground">
                <span className="font-semibold text-foreground">{project.steps_count}</span>{" "}
                {project.steps_count === 1 ? "step" : "steps"}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Button asChild className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/90">
              <Link
                href={`/dashboard/projects/${project.id}`}
                onClick={(e) => {
                  e.stopPropagation()
                }}>
                Edit Tour
              </Link>
            </Button>

            <Button
              asChild
              type="button"
              variant="ghost"
              size="sm"
              className="rounded-xl text-muted-foreground hover:text-foreground">
              <Link
                href={`/demo/${project.script_key}`}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => {
                  e.stopPropagation()
                }}>
                <ExternalLinkIcon className="size-4" />
                Live Demo
              </Link>
            </Button>

            <CopyIconButton
              text={project.script_key}
              ariaLabel="Copy script key"
            />

            <Button
              type="button"
              variant="outline"
              size="sm"
              className="hidden rounded-xl border-white/10 bg-background/20 hover:bg-muted/20 sm:inline-flex"
              onClick={() => onToggle(project.id)}>
              {open ? <ChevronUpIcon data-icon="inline-end" /> : <ChevronDownIcon data-icon="inline-end" />}
              Details
            </Button>
          </div>
        </div>
      </div>

      {open ? (
        <div className="border-t border-white/10 p-4 sm:p-5">
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <Label className="text-xs font-medium text-muted-foreground">Script key</Label>
              <ScriptKey value={project.script_key} />
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <Label className="text-xs font-medium text-muted-foreground">Install snippet</Label>
                <CopySnippetButton snippet={snippet} />
              </div>

              <pre className="overflow-x-auto rounded-xl border border-white/10 bg-[#050505] p-4 text-[11px] leading-relaxed text-[#e6e8e6]">
                <code className="whitespace-pre">{snippet}</code>
              </pre>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export function ProjectsCards({ projects, appUrl }) {
  const [openId, setOpenId] = useState(null)

  const cards = useMemo(() => projects || [], [projects])

  return (
    <div className="flex flex-col gap-4">
      {cards.map((p) => (
        <ProjectCard
          key={p.id}
          project={p}
          appUrl={appUrl}
          open={openId === p.id}
          onToggle={(id) => setOpenId((curr) => (curr === id ? null : id))}
        />
      ))}
    </div>
  )
}

export function EmptyProjectsState() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
      <div className="flex size-14 items-center justify-center rounded-2xl border border-white/10 bg-card/20">
        <FolderOpenIcon className="size-7 text-primary" />
      </div>
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold">No projects yet</h2>
        <p className="text-sm text-muted-foreground">Create your first project to get started</p>
      </div>

      <a
        href="#create-project-form"
        className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-background/20 px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-white/20 hover:bg-muted/20">
        Go to create form <ArrowRightIcon className="size-4" />
      </a>
    </div>
  )
}

