import { createProject } from '@/app/actions/projects'
import { getUserPlan } from '@/app/actions/billing'
import { ProjectCreateForm } from '@/components/dashboard/project-create-form'
import { ProjectsCards } from '@/components/dashboard/projects-cards'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/server'
import { ArrowRightIcon, BookOpen, FolderOpenIcon } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'Projects — TourKit',
}

export const dynamic = 'force-dynamic'

export default async function DashboardProjectsPage() {
  const supabase = await createClient()
  const { plan } = await getUserPlan()

  const { data: projects, error } = await supabase
    .from('projects')
    .select('id, name, domain, script_key, created_at')
    .order('created_at', { ascending: false })

  if (error) {
    return (
      <div className="flex flex-col gap-6">
        <div className="space-y-3 rounded-xl border border-white/10 bg-card/20 px-4 py-5 sm:px-6">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Projects</h1>
          <p className="text-sm text-muted-foreground">Something went wrong loading your workspace.</p>
        </div>
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(280px,22rem)] lg:items-start">
          <Card className="min-w-0 rounded-xl border border-white/10 bg-card/20">
            <CardHeader>
              <CardTitle>Couldn’t load projects</CardTitle>
              <CardDescription>{error.message}</CardDescription>
            </CardHeader>
          </Card>
          <aside className="min-w-0 lg:sticky lg:top-20 lg:self-start">
            <ProjectCreateForm action={createProject} />
          </aside>
        </div>
      </div>
    )
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const projectIds = (projects ?? []).map((p) => p.id)

  const { data: tours } = projectIds.length
    ? await supabase
        .from('tours')
        .select('id, project_id, is_active, created_at')
        .in('project_id', projectIds)
    : { data: [] }

  const toursSafe = tours ?? []

  const tourIdsForStepCounts = []
  const selectedTourByProjectId = {}

  for (const p of projects ?? []) {
    const projectTours = toursSafe
      .filter((t) => t.project_id === p.id)
      .sort((a, b) => String(b.created_at).localeCompare(String(a.created_at)))

    const activeTour = projectTours.find((t) => t.is_active) ?? projectTours[0] ?? null
    selectedTourByProjectId[p.id] = activeTour

    if (activeTour?.id) tourIdsForStepCounts.push(activeTour.id)
  }

  const uniqueTourIds = Array.from(new Set(tourIdsForStepCounts))

  const { data: steps } = uniqueTourIds.length
    ? await supabase.from('steps').select('tour_id').in('tour_id', uniqueTourIds)
    : { data: [] }

  const stepsByTourId = {}
  ;(steps ?? []).forEach((s) => {
    const key = s.tour_id
    stepsByTourId[key] = (stepsByTourId[key] ?? 0) + 1
  })

  const enhancedProjects = (projects ?? []).map((p) => {
    const tour = selectedTourByProjectId[p.id]
    return {
      ...p,
      tour_is_active: Boolean(tour?.is_active),
      steps_count: tour?.id ? stepsByTourId[tour.id] ?? 0 : 0,
    }
  })

  const totalProjects = enhancedProjects.length
  const totalActiveTours = toursSafe.filter((t) => t.is_active).length
  const showFreeLimitBanner = plan === 'free' && totalProjects >= 1

  const planBadgeClass =
    plan === 'pro'
      ? 'border-[#F15025]/50 bg-[#F15025]/15 text-[#F15025]'
      : plan === 'starter'
        ? 'border-blue-400/40 bg-blue-400/10 text-blue-300'
        : 'border-white/15 bg-background/40 text-muted-foreground'
  const planBadgeLabel = plan === 'pro' ? 'Pro ✦' : plan === 'starter' ? 'Starter' : 'Free plan'

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-xl border border-white/10 bg-card/20 px-4 py-5 sm:px-6" data-tour="projects-header" data-tourkit="projects-header">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-semibold tracking-tight text-foreground">Projects</h1>
              <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${planBadgeClass}`}>{planBadgeLabel}</span>
            </div>
            <p className="max-w-xl text-sm text-muted-foreground">
              Manage your websites and onboarding tours.
            </p>
          </div>

          <div className="grid w-full max-w-md grid-cols-2 gap-3">
            <div className="rounded-xl border border-white/10 bg-background/20 p-4">
              <div className="text-xs font-medium text-muted-foreground">Total projects</div>
              <div className="mt-1 text-xl font-semibold text-foreground">{totalProjects}</div>
            </div>

            <div className="rounded-xl border border-white/10 bg-background/20 p-4">
              <div className="text-xs font-medium text-muted-foreground">Active tours</div>
              <div className="mt-1 text-xl font-semibold text-foreground">{totalActiveTours}</div>
            </div>
          </div>
        </div>
      </div>

      {showFreeLimitBanner ? (
        <div className="rounded-xl border border-[#F15025]/25 border-l-4 border-l-[#F15025] bg-[#F15025]/[0.06] px-4 py-4 sm:px-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">You&apos;ve reached your free plan limit</p>
              <p className="mt-1 text-xs text-muted-foreground">Upgrade to Starter to add up to 3 projects</p>
            </div>
            <Button asChild size="sm" className="bg-[#F15025] text-white hover:bg-[#F15025]/90">
              <Link href="/pricing">Upgrade now →</Link>
            </Button>
          </div>
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(280px,22rem)] lg:items-start">
        <div className="min-w-0">
          {enhancedProjects.length ? (
            <ProjectsCards projects={enhancedProjects} appUrl={appUrl} />
          ) : (
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

              <a
                href="/docs/getting-started/quick-start"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '13px',
                  color: '#666',
                  marginTop: '8px',
                  textDecoration: 'none',
                }}>
                <BookOpen size={14} />
                Read the docs to get started
              </a>
            </div>
          )}
        </div>

        <aside id="create-project-form" className="min-w-0 lg:sticky lg:top-20 lg:self-start">
          <ProjectCreateForm action={createProject} />
        </aside>
      </div>
    </div>
  )
}

