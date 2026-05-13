import { DocH2, DocImage, DocLi, DocP, DocSection, DocUl } from '@/components/docs/doc-article'
import { DocHeader } from '@/components/docs/doc-header'

export const metadata = {
  title: 'Step dropoff',
}

export default function Page() {
  return (
    <article className="flex flex-col gap-8 pb-16">
      <DocHeader
        breadcrumb={[{ label: 'Analytics' }, { label: 'Step dropoff' }]}
        title="Step dropoff"
        description="Find the exact step where users abandon or churn within the tour."
      />

      <DocSection>
        <DocH2>Reading the funnel</DocH2>
        <DocP>Step-view counts show where attention concentrates; compare consecutive steps to spot cliffs.</DocP>
        <DocImage caption="Step funnel — views per step (placeholder)" ratio="video" />
      </DocSection>

      <DocSection>
        <DocH2>Remediation checklist</DocH2>
        <DocUl>
          <DocLi>Shorten copy on heavy steps.</DocLi>
          <DocLi>Confirm selectors after layout changes.</DocLi>
          <DocLi>Reorder steps so prerequisites appear earlier.</DocLi>
        </DocUl>
      </DocSection>
    </article>
  )
}
