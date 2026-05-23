import { DocH2, DocLi, DocP, DocSection, DocUl } from '@/components/docs/doc-article'
import { DocHeader } from '@/components/docs/doc-header'
import DocImage from '@/components/docs/doc-image'

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
        <DocImage
          src={null}
          placeholder="Analytics dashboard — Tour started, completed, skipped stats"
          caption="Analytics dashboard showing tour performance metrics"
        />
      </DocSection>

      <DocSection>
        <DocH2>Sessions</DocH2>
        <DocP>Session identifiers group events from one browser run — useful for deduplicating noisy refreshes during QA.</DocP>
      </DocSection>
    </article>
  )
}
