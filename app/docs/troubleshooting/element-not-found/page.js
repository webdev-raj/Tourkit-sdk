import { DocCallout, DocH2, DocLi, DocP, DocSection, DocUl } from '@/components/docs/doc-article'
import { DocHeader } from '@/components/docs/doc-header'

export const metadata = {
  title: 'Element not found',
}

export default function Page() {
  return (
    <article className="flex flex-col gap-8 pb-16">
      <DocHeader
        breadcrumb={[{ label: 'Troubleshooting' }, { label: 'Element not found' }]}
        title="Element not found"
        description="When a selector no longer matches DOM or has zero size."
      />

      <DocSection>
        <DocH2>Common causes</DocH2>
        <DocUl>
          <DocLi>Renamed classes after a refactor.</DocLi>
          <DocLi>Content behind feature flags or auth — element absent for some users.</DocLi>
          <DocLi>Virtualized lists that unmount off-screen nodes.</DocLi>
        </DocUl>
      </DocSection>

      <DocCallout title="Fix" variant="warning">
        Update selectors to stable attributes you control (for example <code className="text-primary">data-tour</code> hooks) and republish.
      </DocCallout>

      <DocSection>
        <DocH2>Verify locally</DocH2>
        <DocP>Paste the selector into DevTools console on the exact URL users tour.</DocP>
      </DocSection>
    </article>
  )
}
