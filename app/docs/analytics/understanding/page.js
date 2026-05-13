import { DocH2, DocImage, DocLi, DocP, DocSection, DocUl } from '@/components/docs/doc-article'
import { DocHeader } from '@/components/docs/doc-header'

export const metadata = {
  title: 'Understanding your data',
}

export default function Page() {
  return (
    <article className="flex flex-col gap-8 pb-16">
      <DocHeader
        breadcrumb={[{ label: 'Analytics' }, { label: 'Understanding your data' }]}
        title="Understanding your data"
        description="Telemetry that explains whether tours help users finish critical journeys."
      />

      <DocSection>
        <DocH2>Event types</DocH2>
        <DocUl>
          <DocLi>
            <strong className="text-foreground">Tour started</strong> — visitor entered the flow.
          </DocLi>
          <DocLi>
            <strong className="text-foreground">Step viewed</strong> — a step rendered with a visible target.
          </DocLi>
          <DocLi>
            <strong className="text-foreground">Completed / skipped</strong> — visitor finished or exited early.
          </DocLi>
        </DocUl>
        <DocImage caption="Analytics dashboard — overview charts (placeholder)" ratio="wide" />
      </DocSection>

      <DocSection>
        <DocH2>Sessions</DocH2>
        <DocP>Session identifiers group events from one browser run — useful for deduplicating noisy refreshes during QA.</DocP>
      </DocSection>
    </article>
  )
}
