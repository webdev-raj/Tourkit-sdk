import { DocCallout, DocH2, DocLi, DocP, DocSection, DocUl } from '@/components/docs/doc-article'
import { DocHeader } from '@/components/docs/doc-header'

export const metadata = {
  title: 'Dark vs Light mode',
}

export default function Page() {
  return (
    <article className="flex flex-col gap-8 pb-16">
      <DocHeader
        breadcrumb={[{ label: 'Customization' }, { label: 'Dark vs Light mode' }]}
        title="Dark vs Light mode"
        description="Tune tooltip chrome for the surface your users actually see."
      />

      <DocSection>
        <DocH2>When to use dark</DocH2>
        <DocUl>
          <DocLi>Operator tools and dense dashboards.</DocLi>
          <DocLi>Brand palettes that already skew dark.</DocLi>
        </DocUl>
      </DocSection>

      <DocSection>
        <DocH2>When to use light</DocH2>
        <DocP>Marketing pages and consumer flows where surrounding UI is predominantly white.</DocP>
      </DocSection>

      <DocCallout title="Visitor context" variant="info">
        Theme controls tooltip styling only — it does not auto-switch with OS appearance unless you expose separate tours or keys per theme.
      </DocCallout>
    </article>
  )
}
