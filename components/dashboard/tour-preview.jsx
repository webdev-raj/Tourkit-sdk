"use client"

import { useMemo } from "react"

import { Button } from "@/components/ui/button"

const ACCENT = "#F15025"

function PositionButton({ value, selected, onSelect, children }) {
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className={`h-9 flex-1 rounded-xl border-white/10 bg-background/20 text-xs ${
        selected ? "border-[#F15025]/60 bg-[#F15025]/10 text-[#F15025]" : "hover:bg-muted/20"
      }`}
      onClick={() => onSelect?.(value)}>
      {children}
    </Button>
  )
}

export function TourPreview({
  title,
  message,
  position,
  stepNumber,
  totalSteps,
  onPositionChange,
}) {
  const safeTitle = String(title || "").trim() || `Step ${stepNumber || 1}`
  const safeMessage = String(message || "").trim() || "Your tooltip message will appear here."
  const pos = String(position || "bottom").toLowerCase()

  const nextLabel = useMemo(() => {
    if (!totalSteps || !stepNumber) return "Next"
    return stepNumber >= totalSteps ? "Finish" : "Next"
  }, [stepNumber, totalSteps])

  const tooltip = (
    <div
      className="w-full max-w-[320px] rounded-[10px] border border-[#222] bg-[#111] px-6 py-5 text-[14px] leading-[1.5] text-white shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
      style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <div className="mb-2 text-[16px] font-semibold text-white">{safeTitle}</div>
      <div className="mb-4 text-[#aaaaaa]">{safeMessage}</div>
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          className="rounded-[6px] border border-[#333] bg-transparent px-4 py-2 text-[13px] font-medium text-[#aaa]">
          Skip
        </button>
        <div className="text-[12px] text-[#666]">
          {Math.max(stepNumber || 1, 1)} of {Math.max(totalSteps || 1, 1)}
        </div>
        <div className="flex items-center gap-2">
          {stepNumber > 1 ? (
            <button
              type="button"
              className="rounded-[6px] border border-[#333] bg-transparent px-4 py-2 text-[13px] font-medium text-[#aaa]">
              Prev
            </button>
          ) : null}
          <button
            type="button"
            className="rounded-[6px] border border-transparent bg-[#F15025] px-4 py-2 text-[13px] font-medium text-white">
            {nextLabel}
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-sm font-semibold text-foreground">Preview</div>
          <div className="mt-1 text-xs text-muted-foreground">Updates as you type</div>
        </div>
        <div className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-background/20 px-2.5 py-1 text-[0.7rem] font-medium text-foreground">
          <span className="size-1.5 rounded-full bg-emerald-400" aria-hidden />
          Live
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="text-xs font-medium text-muted-foreground">Element highlight</div>
        <div
          className="rounded-lg border border-dashed px-4 py-4 text-sm text-muted-foreground"
          style={{ borderColor: ACCENT }}>
          ← Your selected element appears here
        </div>
      </div>

      <div className="relative flex min-h-[220px] items-center justify-center rounded-xl border border-white/10 bg-background/10 p-5">
        {pos === "top" ? (
          <div className="absolute inset-x-4 top-4 flex justify-center">{tooltip}</div>
        ) : null}
        {pos === "left" ? (
          <div className="absolute left-4 top-1/2 -translate-y-1/2">{tooltip}</div>
        ) : null}
        {pos === "right" ? (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">{tooltip}</div>
        ) : null}
        {pos === "bottom" ? (
          <div className="absolute inset-x-4 bottom-4 flex justify-center">{tooltip}</div>
        ) : null}
      </div>

      <div className="flex flex-col gap-3">
        <div className="text-xs font-medium text-muted-foreground">Position</div>
        <div className="grid grid-cols-2 gap-2">
          <PositionButton value="top" selected={pos === "top"} onSelect={onPositionChange}>
            Top
          </PositionButton>
          <PositionButton value="bottom" selected={pos === "bottom"} onSelect={onPositionChange}>
            Bottom
          </PositionButton>
          <PositionButton value="left" selected={pos === "left"} onSelect={onPositionChange}>
            Left
          </PositionButton>
          <PositionButton value="right" selected={pos === "right"} onSelect={onPositionChange}>
            Right
          </PositionButton>
        </div>
      </div>
    </div>
  )
}

