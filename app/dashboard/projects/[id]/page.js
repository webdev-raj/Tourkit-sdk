import { Suspense } from 'react'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'


import { deleteProject } from '@/app/actions/projects'
import { getStepsByTourId, getTourByProjectId } from '@/app/actions/tours'
import { TourEditor } from '@/components/dashboard/tour-editor'
import { TourEditorSkeleton } from '@/components/dashboard/tour-editor-skeleton'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }) {
  const { id } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('projects').select('name').eq('id', id).maybeSingle()
  const name = data?.name
  return { title: name ? `${name} — TourKit` : 'Project tour — TourKit' }
}

export default async function ProjectTourPage({ params, searchParams }) {
  const { id } = await params
  const qp = await searchParams
  const deleteError = typeof qp?.deleteError === 'string' ? qp.deleteError : ''
  return (
    <Suspense fallback={<TourEditorSkeleton />}>
      <TourEditorGate projectId={id} deleteError={deleteError} />
    </Suspense>
  )
}

async function TourEditorGate({ projectId, deleteError }) {
  const supabase = await createClient()

  const { data: project, error: projectError } = await supabase
    .from('projects')
    .select('id, name, domain, script_key')
    .eq('id', projectId)
    .maybeSingle()

  if (projectError) {
    return (
      <LoadErrorCard
        message={projectError.message}
        hint="If tables are missing, run doc/schema.sql in the Supabase SQL Editor."
      />
    )
  }

  if (!project) {
    notFound()
  }

  const tourRes = await getTourByProjectId(projectId)

  if (tourRes.error) {
    return <LoadErrorCard message={tourRes.error} />
  }

  const stepsRes = await getStepsByTourId(tourRes.data.id)

  if (stepsRes.error) {
    return <LoadErrorCard message={stepsRes.error} />
  }

  async function deleteProjectAction() {
    'use server'
    const result = await deleteProject(project.id)
    if (!result?.ok) {
      const msg = encodeURIComponent(result?.error || 'Could not delete project.')
      redirect(`/dashboard/projects/${project.id}?deleteError=${msg}`)
    }
    redirect('/dashboard')
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
      {/* <div className="flex justify-end">
        <Button variant="outline" asChild>
          <Link href={`/dashboard/projects/${project.id}/analytics`}>
            <BarChart2Icon className="mr-2 size-4" />
            View Analytics
          </Link>
        </Button>
      </div> */}

      <TourEditor
        project={project}
        tour={tourRes.data}
        initialSteps={stepsRes.data}
        analyticsHref={`/dashboard/projects/${project.id}/analytics`}
      />

      <section className="rounded-lg border border-red-900/70 bg-card/40 p-5">
        <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-red-300">Danger Zone</div>
        <h2 className="text-lg font-semibold text-foreground">Delete project</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          This will permanently delete the project, all tour steps, and analytics data. This cannot be undone.
        </p>

        {deleteError ? (
          <Alert variant="destructive" className="mt-4 border-destructive/50">
            <AlertTitle>Could not delete project</AlertTitle>
            <AlertDescription>{deleteError}</AlertDescription>
          </Alert>
        ) : null}

        <div className="mt-4">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                type="button"
                variant="outline"
                className="border-red-900/70 bg-red-950/20 text-red-200 hover:bg-red-950/40 hover:text-red-100">
                Delete project
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete this project?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete {project.name} and all its data including tour steps and analytics. This cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <form action={deleteProjectAction}>
                <AlertDialogFooter>
                  <AlertDialogCancel type="button">Cancel</AlertDialogCancel>
                  <Button type="submit" variant="destructive">
                    Delete project
                  </Button>
                </AlertDialogFooter>
              </form>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </section>
    </div>
  )
}

function LoadErrorCard({ message, hint }) {
  return (
    <div className="mx-auto w-full max-w-2xl space-y-4">
      <Alert variant="destructive" className="border-destructive/50">
        <AlertTitle>Could not load tour editor</AlertTitle>
        <AlertDescription>{message}</AlertDescription>
      </Alert>
      {hint ? <p className="text-center text-xs text-muted-foreground">{hint}</p> : null}
      <div className="flex justify-center">
        <Button variant="outline" asChild>
          <Link href="/dashboard">Back to projects</Link>
        </Button>
      </div>
    </div>
  )
}
