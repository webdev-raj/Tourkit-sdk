import { DocCallout, DocH2, DocP, DocSection } from '@/components/docs/doc-article'
import { DocHeader } from '@/components/docs/doc-header'

export const metadata = {
  title: 'Completion rate',
}

export default function Page() {
  return (
    <article className="flex flex-col gap-8 pb-16">
      <DocHeader
        breadcrumb={[{ label: 'Analytics' }, { label: 'Completion rate' }]}
        title="Completion rate"
        description="Share of tours that reach the final step — your headline quality metric."
      />

      <DocSection>
        <DocH2>Interpretation</DocH2>
        <DocP>
          Higher completion means copy and targeting align with user intent. Sudden drops often correlate with confusing
          selectors, slow-loading UI, or dense copy on a single step.
        </DocP>
      </DocSection>

      <DocCallout title="Benchmark carefully" variant="tip">
        Compare completion between releases or cohorts — absolute numbers vary wildly by page traffic and audience.
      </DocCallout>
    </article>
  )
}
