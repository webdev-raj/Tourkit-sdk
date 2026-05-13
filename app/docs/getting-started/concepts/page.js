import { DocH2, DocH3, DocLi, DocP, DocSection, DocUl } from '@/components/docs/doc-article'
import { DocHeader } from '@/components/docs/doc-header'

export const metadata = {
  title: 'Core concepts',
}

export default function Page() {
  return (
    <article className="flex flex-col gap-8 pb-16">
      <DocHeader
        breadcrumb={[{ label: 'Getting Started' }, { label: 'Core concepts' }]}
        title="Core concepts"
        description="Vocabulary you will see across the dashboard and docs."
      />

      <DocSection>
        <DocH2>Project</DocH2>
        <DocP>A container for one website or product surface. Each project has its own script key and tours.</DocP>
      </DocSection>

      <DocSection>
        <DocH2>Tour</DocH2>
        <DocP>An ordered sequence of steps. You can tune theme, colors, and typography at the tour level.</DocP>
      </DocSection>

      <DocSection>
        <DocH2>Step</DocH2>
        <DocP>
          One highlight moment: a CSS selector (what to point at), title and message (what to say), and position (where
          the tooltip sits relative to the element).
        </DocP>
      </DocSection>

      <DocSection>
        <DocH2>Script key</DocH2>
        <DocP>Public identifier embedded in your snippet. The SDK uses it to fetch the correct tour payload.</DocP>
      </DocSection>

      <DocSection>
        <DocH3>Session & analytics</DocH3>
        <DocUl>
          <DocLi>
            <strong className="text-foreground">Tour session</strong> — a single visitor run through the tour (starts,
            steps, completion or skip).
          </DocLi>
          <DocLi>
            <strong className="text-foreground">Events</strong> — structured signals such as tour started, step viewed,
            completed, or skipped.
          </DocLi>
        </DocUl>
      </DocSection>
    </article>
  )
}
