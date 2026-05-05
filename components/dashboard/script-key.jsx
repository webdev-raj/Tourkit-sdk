"use client"

import { useState } from "react"
import { CheckIcon, CopyIcon } from "lucide-react"

import { Button } from "@/components/ui/button"

export function ScriptKey({ value }) {
  const [copied, setCopied] = useState(false)

  async function onCopy() {
    await navigator.clipboard.writeText(value)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1200)
  }

  return (
    <div className="flex min-w-0 items-center gap-2">
      <code className="min-w-0 flex-1 truncate rounded-md border border-primary/35 bg-muted/80 px-2.5 py-1.5 text-xs tabular-nums text-foreground ring-1 ring-inset ring-primary/20">
        {value}
      </code>
      <Button
        type="button"
        variant="outline"
        size="icon-sm"
        onClick={onCopy}
        aria-label={copied ? "Copied script key" : "Copy script key"}
      >
        {copied ? <CheckIcon /> : <CopyIcon />}
        <span className="sr-only">{copied ? "Copied" : "Copy script key"}</span>
      </Button>
    </div>
  )
}

