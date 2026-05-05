import { Suspense } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { getStepsByTourId, getTourByProjectId } from '@/app/actions/tours'
import { TourEditor } from '@/components/dashboard/tour-editor'
import { TourEditorSkeleton } from '@/components/dashboard/tour-editor-skeleton'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
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

export default async function ProjectTourPage({ params }) {
  const { id } = await params
  return (
    <Suspense fallback={<TourEditorSkeleton />}>
      <TourEditorGate projectId={id} />
    </Suspense>
  )
}

async function TourEditorGate({ projectId }) {
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

  return <TourEditor project={project} tour={tourRes.data} initialSteps={stepsRes.data} />
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
