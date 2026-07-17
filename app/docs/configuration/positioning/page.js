import { DocH2, DocLi, DocP, DocSection, DocUl } from '@/components/docs/doc-article'
import { DocHeader } from '@/components/docs/doc-header'
import DocImage from '@/components/docs/doc-image'
import { DOC_IMAGES } from '@/lib/doc-images'

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
        <DocImage
          src={DOC_IMAGES.positionDiagram}
          placeholder="Position diagram — Top, Bottom, Left, Right tooltip positions"
          caption="Four tooltip positions relative to the highlighted element"
        />
      </DocSection>

      <DocSection>
        <DocH2>Viewport clamping</DocH2>
        <DocP>The SDK keeps the card on-screen when possible; extremely small viewports may compress layout.</DocP>
      </DocSection>
    </article>
  )
}
