'use client'

import { useActionState } from 'react'

import { importProjectWithSteps } from '@/app/actions/import'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const initialState = { error: null }

const fieldClass =
  'w-full rounded-lg border border-white/10 bg-background px-3 py-2 text-sm outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20'

export function ImportTourForm({ steps }) {
  const [state, formAction, pending] = useActionState(importProjectWithSteps, initialState)

  return (
    <form action={formAction} className="flex flex-col gap-8">
      <input type="hidden" name="steps" value={JSON.stringify(steps)} readOnly />

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="name">Project name</Label>
          <Input id="name" name="name" required placeholder="My SaaS app" className={fieldClass} />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="domain">Domain</Label>
          <Input id="domain" name="domain" required placeholder="app.example.com" className={fieldClass} />
        </div>
      </div>

      <div>
        <h2 className="mb-4 text-lg font-semibold text-foreground">Steps to import</h2>
        <ul className="flex list-none flex-col gap-3 p-0">
          {steps.map((step, index) => (
            <li key={index} className="rounded-xl border border-border/70 bg-card/50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-primary">Step {index + 1}</p>
              <p className="mt-1 font-medium text-foreground">{step.title || `Step ${index + 1}`}</p>
              <p className="mt-1 text-sm text-muted-foreground">{step.message}</p>
              <p className="mt-2 font-mono text-xs text-primary">{step.selector}</p>
              <div className="mt-2 flex flex-wrap gap-2 text-[10px] text-muted-foreground">
                <span className="rounded border border-border px-1.5 py-0.5 uppercase">{step.position}</span>
                {step.url_pattern ? (
                  <span className="rounded border border-primary/30 px-1.5 py-0.5 font-mono text-primary">
                    {step.url_pattern}
                  </span>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      </div>

      {state?.error ? (
        <Alert variant="destructive">
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      ) : null}

      <Button type="submit" disabled={pending} size="lg" className="w-full sm:w-auto">
        {pending ? 'Creating project…' : 'Create project and import steps'}
      </Button>
    </form>
  )
}
