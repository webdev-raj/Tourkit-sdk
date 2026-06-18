"use client"

import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { PlusIcon } from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending} className="w-full rounded-xl">
      Create project
    </Button>
  )
}

export function ProjectCreateForm({ action }) {
  const [state, formAction] = useActionState(action, { error: null, ok: false })

  return (
    <Card className="border border-white/10 bg-card/20 backdrop-blur-sm" data-tour="create-project" data-tourkit="create-project-form">
      <CardHeader className="flex flex-col gap-2">
        <CardTitle className="flex items-center gap-2">
          <PlusIcon className="size-4 text-primary" aria-hidden />
          New Project
        </CardTitle>
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
          <div className="flex items-center">
            <SubmitButton />
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

