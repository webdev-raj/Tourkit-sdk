import Link from "next/link"

import { signIn, signUp } from "@/app/actions/auth"
import { AuthForm } from "@/components/auth/auth-form"
import { Button } from "@/components/ui/button"

export async function generateMetadata({ searchParams }) {
  const sp = await searchParams
  const signup = sp?.mode === "signup"
  return {
    title: signup ? "Sign up — TourKit" : "Sign in — TourKit",
  }
}

export default async function AuthPage({ searchParams }) {
  const sp = await searchParams
  const mode = sp?.mode === "signup" ? "signup" : "login"

  return (
    <div className="relative min-h-dvh overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0 tk-grid opacity-[0.28]" aria-hidden />
      <div className="pointer-events-none absolute inset-0 tk-glow-soft" aria-hidden />

      <main id="main-content" className="relative mx-auto flex min-h-dvh w-full max-w-6xl flex-col lg:flex-row" tabIndex={-1}>
        <aside className="relative flex flex-col justify-between gap-10 border-b border-border/60 px-6 py-10 lg:w-[42%] lg:border-b-0 lg:border-r lg:border-border/60 lg:py-14">
          <div className="pointer-events-none absolute left-0 top-0 hidden h-full w-1 bg-gradient-to-b from-primary via-primary/50 to-transparent lg:block" aria-hidden />

          <div className="flex flex-col gap-8">
            <Button variant="ghost" className="w-fit px-0 text-muted-foreground hover:text-foreground" asChild>
              <Link href="/">← Back to TourKit</Link>
            </Button>
            <div className="flex flex-col gap-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                {mode === "login" ? "Welcome back" : "New workspace"}
              </p>
              <h1 className="text-balance text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
                {mode === "login" ? "Sign in to your workspace" : "Create your workspace"}
              </h1>
              <p className="max-w-sm text-pretty text-sm leading-relaxed text-muted-foreground md:text-base">
                Manage projects, script keys, and tours from one dashboard. Your sites fetch config from TourKit’s public
                API.
              </p>
            </div>
          </div>
          <p className="max-w-xs text-xs leading-relaxed text-muted-foreground">
            By continuing you agree to use this environment responsibly. Keys with service role access stay server-side
            only.
          </p>
        </aside>

        <section className="flex flex-1 flex-col items-center justify-center px-4 py-10 lg:px-10 lg:py-14">
          <div className="flex w-full max-w-md flex-col gap-8">
            <div className="flex flex-col gap-3">
              <p className="text-center text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                Account
              </p>
              <div className="flex rounded-lg border border-border/80 bg-muted/30 p-1" role="tablist" aria-label="Sign in or sign up">
                <Button
                  variant={mode === "login" ? "secondary" : "ghost"}
                  className="flex-1 shadow-none"
                  size="sm"
                  asChild
                >
                  <Link href="/auth" aria-current={mode === "login" ? "page" : undefined}>
                    Sign in
                  </Link>
                </Button>
                <Button
                  variant={mode === "signup" ? "secondary" : "ghost"}
                  className="flex-1 shadow-none"
                  size="sm"
                  asChild
                >
                  <Link href="/auth?mode=signup" aria-current={mode === "signup" ? "page" : undefined}>
                    Sign up
                  </Link>
                </Button>
              </div>
            </div>

            <AuthForm mode={mode} action={mode === "login" ? signIn : signUp} />
          </div>
        </section>
      </main>
    </div>
  )
}
