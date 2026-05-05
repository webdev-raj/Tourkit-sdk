import Link from 'next/link'

import { createProject } from '@/app/actions/projects'
import { ProjectCreateForm } from '@/components/dashboard/project-create-form'
import { ScriptKey } from '@/components/dashboard/script-key'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { createClient } from '@/lib/supabase/server'

export const metadata = {
  title: 'Projects — TourKit',
}

export const dynamic = 'force-dynamic'

export default async function DashboardProjectsPage() {
  const supabase = await createClient()

  const { data: projects, error } = await supabase
    .from('projects')
    .select('id, name, domain, script_key, created_at')
    .order('created_at', { ascending: false })

  if (error) {
    return (
      <div className="flex flex-col gap-10">
        <div className="flex flex-col gap-3 rounded-lg border border-border/60 bg-card/40 px-4 py-4 sm:px-5">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Projects</h1>
          <p className="text-sm text-muted-foreground">Something went wrong loading your workspace.</p>
        </div>
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(280px,22rem)] lg:items-start lg:gap-10">
          <Card className="min-w-0 border-border/80 bg-card/60 backdrop-blur-sm">
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

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-3 rounded-lg border border-border/60 bg-card/40 px-4 py-4 sm:px-5 sm:py-5">
        <h1 className="text-balance text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Projects
        </h1>
        <p className="max-w-2xl text-pretty text-sm leading-relaxed text-muted-foreground md:text-base">
          Each project gets a unique script key. Use it in your embed snippet; your SDK loads tour JSON from the public
          API.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(280px,22rem)] lg:items-start lg:gap-10">
        <div className="flex min-w-0 flex-col gap-4">
          <Card className="border-border/80 bg-card/60 backdrop-blur-sm">
            <CardHeader className="flex flex-col gap-2">
              <CardTitle>Your projects</CardTitle>
              <CardDescription>
                Each project has a script key. Your website includes it to fetch the tour config.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {projects?.length ? (
                <div className="flex flex-col gap-4">
                  {projects.map((p, idx) => (
                    <div key={p.id} className="flex flex-col gap-3">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="truncate text-sm font-medium">
                            <Link
                              href={`/dashboard/projects/${p.id}`}
                              className="text-foreground transition-colors hover:text-primary hover:underline">
                              {p.name}
                            </Link>
                          </div>
                          <div className="truncate text-xs text-muted-foreground">{p.domain}</div>
                        </div>
                        <Button variant="outline" size="xs" asChild>
                          <Link href={`/dashboard/projects/${p.id}`}>Edit tour</Link>
                        </Button>
                      </div>
                      <div className="flex flex-col gap-2">
                        <div className="text-xs font-medium text-muted-foreground">Script key</div>
                        <ScriptKey value={p.script_key} />
                      </div>
                      {idx !== projects.length - 1 ? <Separator /> : null}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">
                  No projects yet. Create your first one to get a script key.
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <aside className="min-w-0 lg:sticky lg:top-20 lg:self-start">
          <ProjectCreateForm action={createProject} />
        </aside>
      </div>
    </div>
  )
}

