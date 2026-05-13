import { DocH2, DocImage, DocLi, DocP, DocSection, DocUl } from '@/components/docs/doc-article'
import { DocHeader } from '@/components/docs/doc-header'

export const metadata = {
  title: 'Adding steps',
}

export default function Page() {
  return (
    <article className="flex flex-col gap-8 pb-16">
      <DocHeader
        breadcrumb={[{ label: 'Configuration' }, { label: 'Adding steps' }]}
        title="Adding steps"
        description="Each step is one tooltip anchored to a DOM node on your site."
      />

      <DocSection>
        <DocH2>Fields</DocH2>
        <DocUl>
          <DocLi>
            <strong className="text-foreground">Selector</strong> — any valid CSS selector that resolves to a visible element.
          </DocLi>
          <DocLi>
            <strong className="text-foreground">Title & message</strong> — concise headline plus supporting copy.
          </DocLi>
          <DocLi>
            <strong className="text-foreground">Position</strong> — top, bottom, left, or right relative to the element box.
          </DocLi>
        </DocUl>
        <DocImage caption="Step form — selector, copy, position (placeholder)" ratio="video" />
      </DocSection>

      <DocSection>
        <DocH2>Ordering</DocH2>
        <DocP>Reorder steps in the dashboard — runtime order follows your saved sequence.</DocP>
      </DocSection>
    </article>
  )
}
