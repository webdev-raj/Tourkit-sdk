"use client"

import { useActionState } from "react"
import { useFormStatus } from "react-dom"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending}>
      Create project
    </Button>
  )
}

export function ProjectCreateForm({ action }) {
  const [state, formAction] = useActionState(action, { error: null, ok: false })

  return (
    <Card className="border-border/80 bg-card/80 shadow-[0_0_0_1px_color-mix(in_srgb,var(--primary)_10%,transparent)] backdrop-blur-sm">
      <CardHeader className="flex flex-col gap-2">
        <CardTitle>Create a project</CardTitle>
        <CardDescription>
          A project maps to one website. You’ll use its script key in your install snippet.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {state?.error ? (
          <Alert variant="destructive" aria-live="polite">
            <AlertTitle>Couldn’t create project</AlertTitle>
            <AlertDescription>{state.error}</AlertDescription>
          </Alert>
        ) : null}

        <form action={formAction} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Project name</Label>
            <Input id="name" name="name" placeholder="Acme Inc…" autoComplete="organization" required />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="domain">Domain</Label>
            <Input
              id="domain"
              name="domain"
              type="text"
              inputMode="url"
              placeholder="acme.com…"
              autoComplete="url"
              spellCheck={false}
              required
            />
          </div>
          <div className="flex items-center justify-end">
            <SubmitButton />
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

