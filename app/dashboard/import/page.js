import Link from 'next/link'

import { ImportTourForm } from '@/components/dashboard/import-tour-form'
import { Button } from '@/components/ui/button'
import { decodeStepsFromUrl } from '@/lib/tour-steps-encoding'

export const metadata = {
  title: 'Import tour — TourKit',
}

export const dynamic = 'force-dynamic'

export default async function ImportTourPage({ searchParams }) {
  const sp = await searchParams
  const raw = sp?.steps

  let steps = []
  let decodeError = null

  if (!raw) {
    decodeError = 'No tour steps found. Generate steps with the AI tool first.'
  } else {
    try {
      steps = decodeStepsFromUrl(raw)
      if (!steps.length) {
        decodeError = 'No valid steps in the import link. Please generate your tour again.'
      }
    } catch {
      decodeError = 'Could not read the imported steps. Please generate your tour again.'
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Import</p>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
          Import AI-generated tour
        </h1>
        <p className="max-w-2xl text-sm text-muted-foreground md:text-base">
          Create a new project and add your generated steps in one step.
        </p>
      </div>

      {decodeError ? (
        <div className="rounded-xl border border-border/70 bg-card/50 p-6">
          <p className="text-sm text-muted-foreground">{decodeError}</p>
          <Button asChild className="mt-4">
            <Link href="/tools/generate">Open AI tour generator</Link>
          </Button>
        </div>
      ) : (
        <ImportTourForm steps={steps} />
      )}
    </div>
  )
}
