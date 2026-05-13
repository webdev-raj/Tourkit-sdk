import { DocH2, DocImage, DocLi, DocP, DocSection, DocUl } from '@/components/docs/doc-article'
import { DocHeader } from '@/components/docs/doc-header'

export const metadata = {
  title: 'Step positioning',
}

export default function Page() {
  return (
    <article className="flex flex-col gap-8 pb-16">
      <DocHeader
        breadcrumb={[{ label: 'Configuration' }, { label: 'Step positioning' }]}
        title="Step positioning"
        description="Choose where the tooltip sits relative to the highlighted element."
      />

      <DocSection>
        <DocH2>Options</DocH2>
        <DocUl>
          <DocLi>
            <strong className="text-foreground">Bottom</strong> — default for nav and header targets.
          </DocLi>
          <DocLi>
            <strong className="text-foreground">Top</strong> — when content sits near the bottom of the viewport.
          </DocLi>
          <DocLi>
            <strong className="text-foreground">Left / Right</strong> — sidebars and wide canvases.
          </DocLi>
        </DocUl>
        <DocImage caption="Tooltip positions — top / bottom / sides schematic (placeholder)" ratio="wide" />
      </DocSection>

      <DocSection>
        <DocH2>Viewport clamping</DocH2>
        <DocP>The SDK keeps the card on-screen when possible; extremely small viewports may compress layout.</DocP>
      </DocSection>
    </article>
  )
}
