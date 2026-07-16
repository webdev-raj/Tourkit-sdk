import { DocCallout, DocH2, DocLi, DocP, DocSection, DocUl } from '@/components/docs/doc-article'
import { DocHeader } from '@/components/docs/doc-header'
import DocImage from '@/components/docs/doc-image'

export const metadata = {
  title: 'How it works',
}

export default function Page() {
  return (
    <article className="flex flex-col gap-8 pb-16">
      <DocHeader
        breadcrumb={[{ label: 'Getting Started' }, { label: 'How it works' }]}
        title="How it works"
        description="A thin client on your site, a hosted config API, and the dashboard as your control plane."
      />

      <DocImage
        src="/ref-images/architecture-diagram.png"
        placeholder="Architecture diagram — SDK fetches config from API and renders tooltip"
        caption="How TourKit works: one script tag connects your site to the dashboard"
      />

      <DocSection>
        <DocH2>Architecture at a glance</DocH2>
        <DocUl>
          <DocLi>
            <strong className="text-foreground">Dashboard</strong> — you define projects, tours, steps, and appearance.
          </DocLi>
          <DocLi>
            <strong className="text-foreground">Public API</strong> — the SDK requests tour JSON by script key.
          </DocLi>
          <DocLi>
            <strong className="text-foreground">SDK</strong> — positions tooltips, handles navigation, and sends analytics events.
          </DocLi>
        </DocUl>
      </DocSection>

      <DocSection>
        <DocH2>Runtime behavior</DocH2>
        <DocP>
          On load, the SDK resolves each step’s CSS selector, scrolls the target into view, draws focus (spotlight), and
          anchors the tooltip. Users move forward, back, skip, or complete — events can be recorded for analytics.
        </DocP>
      </DocSection>

      <DocCallout title="Privacy-aware by design" variant="info">
        Keep PII out of step copy when possible; analytics events are designed around aggregate tour engagement, not
        end-user profiling.
      </DocCallout>
    </article>
  )
}
