"use client"

import { Button } from "@/components/ui/button"

const ACCENT = "#F15025"

function PositionButton({ value, selected, onSelect, children, primaryColor }) {
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className="h-9 flex-1 rounded-xl border text-xs hover:bg-transparent"
      style={{
        background: selected ? primaryColor + "26" : "transparent",
        borderColor: selected ? primaryColor : "rgba(255,255,255,0.1)",
        color: selected ? primaryColor : "#666666",
      }}
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
  appearance = {},
  hideHeader = false,
}) {
  const primaryColor = appearance.primary_color || ACCENT
  const theme = appearance.theme || "dark"
  const fontFamily = appearance.font_family || "Inter"
  const borderRadius = appearance.border_radius || "10px"

  const isDark = theme === "dark"
  const colors = {
    bg: isDark ? "#111111" : "#ffffff",
    border: isDark ? "rgba(255,255,255,0.08)" : "#e5e7eb",
    text: isDark ? "#ffffff" : "#111111",
    subtext: isDark ? "#999999" : "#6b7280",
    footerBorder: isDark ? "rgba(255,255,255,0.06)" : "#f3f4f6",
    prevBg: isDark ? "rgba(255,255,255,0.05)" : "#f9fafb",
    prevBorder: isDark ? "rgba(255,255,255,0.1)" : "#e5e7eb",
    prevText: isDark ? "#ffffff" : "#374151",
    dotBg: isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.15)",
    dotDone: primaryColor + "66",
  }

  const safeTitle = String(title || "").trim() || `Step ${stepNumber || 1}`
  const safeMessage = String(message || "").trim() || "Your tooltip message will appear here."
  const pos = String(position || "bottom").toLowerCase()

  const n = Math.max(stepNumber || 1, 1)
  const t = Math.max(totalSteps || 1, 1)
  const isFirst = n <= 1
  const isLast = n >= t
  const skipLabel = isFirst ? "Skip tour" : "Skip"
  const primaryLabel = isLast ? "Got it!" : "Next →"

  const dots = Array.from({ length: t }, (_, index) => {
    let style = {
      width: "6px",
      height: "6px",
      borderRadius: "50%",
      background: colors.dotBg,
      transition: "all 0.3s ease",
      flexShrink: 0,
    }

    if (index < n - 1) style = { ...style, background: colors.dotDone }
    if (index === n - 1) style = { ...style, width: "20px", borderRadius: "3px", background: primaryColor }

    return <span key={`dot-${index}`} style={style} />
  })

  const tooltip = (
    <div
      className="w-[280px]"
      style={{
        width: "280px",
        background: colors.bg,
        border: "1px solid " + colors.border,
        borderRadius: borderRadius,
        padding: "20px",
        fontFamily: fontFamily + ", system-ui, sans-serif",
        boxShadow: isDark
          ? "0 0 0 1px rgba(255,255,255,0.05), 0 4px 6px rgba(0,0,0,0.1), 0 20px 40px rgba(0,0,0,0.5)"
          : "0 0 0 1px rgba(255,255,255,0.05), 0 20px 40px rgba(0,0,0,0.15)",
      }}>
      <div className="mb-4 flex items-center gap-[6px]">{dots}</div>
      <div
        className="mb-2 text-[15px] font-semibold leading-[1.4] capitalize"
        style={{ color: colors.text }}>
        {safeTitle}
      </div>
      <div className="mb-5 text-[13px] leading-[1.7]" style={{ color: colors.subtext }}>
        {safeMessage}
      </div>
      <div
        className="flex items-center justify-between gap-3 pt-4"
        style={{
          borderTop: "1px solid " + colors.footerBorder,
        }}>
        <div className="flex min-w-0 flex-1 items-center">
          {!isLast ? (
            <span className="text-xs font-medium" style={{ color: colors.subtext, opacity: 0.6 }}>
              {skipLabel}
            </span>
          ) : null}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {!isFirst ? (
            <button
              type="button"
              className="rounded-lg px-[14px] py-[7px] text-xs font-medium"
              style={{
                background: colors.prevBg,
                border: "1px solid " + colors.prevBorder,
                color: colors.prevText,
                cursor: "default",
              }}>
              ← Prev
            </button>
          ) : null}
          <button
            type="button"
            className="rounded-lg px-[14px] py-[7px] text-xs font-medium text-white"
            style={{
              border: "none",
              background: primaryColor,
              color: "#ffffff",
              cursor: "default",
            }}>
            {primaryLabel}
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="flex flex-col gap-5">
      {!hideHeader ? (
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
      ) : null}

      <div className="flex flex-col gap-3">
        <div className="text-xs font-medium text-muted-foreground">Element highlight</div>
        <div
          className="rounded-xl px-4 py-4 text-center text-[13px]"
          style={{
            border: "2px dashed " + primaryColor,
            borderRadius: borderRadius,
            marginBottom: "16px",
            color: "#666666",
          }}>
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
          <PositionButton value="top" selected={pos === "top"} onSelect={onPositionChange} primaryColor={primaryColor}>
            Top
          </PositionButton>
          <PositionButton value="bottom" selected={pos === "bottom"} onSelect={onPositionChange} primaryColor={primaryColor}>
            Bottom
          </PositionButton>
          <PositionButton value="left" selected={pos === "left"} onSelect={onPositionChange} primaryColor={primaryColor}>
            Left
          </PositionButton>
          <PositionButton value="right" selected={pos === "right"} onSelect={onPositionChange} primaryColor={primaryColor}>
            Right
          </PositionButton>
        </div>
      </div>
    </div>
  )
}

