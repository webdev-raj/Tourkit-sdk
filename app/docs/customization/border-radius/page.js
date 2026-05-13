import { DocH2, DocImage, DocP, DocSection } from '@/components/docs/doc-article'
import { DocHeader } from '@/components/docs/doc-header'

export const metadata = {
  title: 'Border radius',
}

export default function Page() {
  return (
    <article className="flex flex-col gap-8 pb-16">
      <DocHeader
        breadcrumb={[{ label: 'Customization' }, { label: 'Border radius' }]}
        title="Border radius"
        description="Match sharp enterprise UIs or rounded consumer surfaces."
      />

      <DocSection>
        <DocH2>Corner presets</DocH2>
        <DocP>Select radius tokens from the appearance panel — preview updates live before you save.</DocP>
        <DocImage caption="Corner style presets — sharp vs pill (placeholder)" ratio="video" />
      </DocSection>

      <DocSection>
        <DocH2>Consistency</DocH2>
        <DocP>Radius applies to the tooltip shell and highlighted elements for a cohesive card metaphor.</DocP>
      </DocSection>
    </article>
  )
}
