'use client'

import { useActionState, useEffect, useState } from 'react'
import { useFormStatus } from 'react-dom'
import Link from 'next/link'
import { EyeIcon, EyeOffIcon } from 'lucide-react'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

function SubmitButton({ children }) {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {children}
    </Button>
  )
}

export function AuthForm({ mode, action }) {
  const [state, formAction] = useActionState(action, { error: null, message: null })
  const [showPassword, setShowPassword] = useState(false)

  const isLogin = mode === 'login'

  useEffect(() => {
    setShowPassword(false)
  }, [mode])

  return (
    <Card className="w-full max-w-md border-border/80 bg-card/80 shadow-[0_0_0_1px_color-mix(in_srgb,var(--primary)_12%,transparent)] backdrop-blur-sm">
      <CardHeader className="flex flex-col gap-2">
        <CardTitle>{isLogin ? 'Welcome back' : 'Create your account'}</CardTitle>
        <CardDescription>
          {isLogin
            ? 'Sign in to manage projects and publish tours.'
            : 'Start generating onboarding tours for any website.'}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        {state?.error ? (
          <Alert variant="destructive" aria-live="polite">
            <AlertTitle>Couldn’t {isLogin ? 'sign in' : 'sign up'}</AlertTitle>
            <AlertDescription>{state.error}</AlertDescription>
          </Alert>
        ) : null}

        {state?.message ? (
          <Alert aria-live="polite">
            <AlertTitle>One more step</AlertTitle>
            <AlertDescription>{state.message}</AlertDescription>
          </Alert>
        ) : null}

        <form action={formAction} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@company.com…"
              autoComplete="email"
              spellCheck={false}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder={isLogin ? '••••••••…' : 'At least 8 characters…'}
                autoComplete={isLogin ? 'current-password' : 'new-password'}
                spellCheck={false}
                required
                minLength={8}
                className="pe-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="absolute end-1 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                aria-pressed={showPassword}
                onClick={() => setShowPassword((v) => !v)}
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </Button>
            </div>
          </div>
          <SubmitButton>{isLogin ? 'Sign in' : 'Create account'}</SubmitButton>
        </form>
      </CardContent>

      <CardFooter className="flex items-center justify-between gap-3">
        <span className="text-sm text-muted-foreground">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}
        </span>
        <Link
          className="text-sm font-medium text-primary underline-offset-4 hover:text-primary/90 hover:underline"
          href={isLogin ? '/auth?mode=signup' : '/auth'}
        >
          {isLogin ? 'Sign up' : 'Sign in'}
        </Link>
      </CardFooter>
    </Card>
  )
}

