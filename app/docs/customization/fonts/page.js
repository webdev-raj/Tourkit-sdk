import { DocH2, DocP, DocSection } from '@/components/docs/doc-article'
import { DocHeader } from '@/components/docs/doc-header'

export const metadata = {
  title: 'Fonts',
}

export default function Page() {
  return (
    <article className="flex flex-col gap-8 pb-16">
      <DocHeader
        breadcrumb={[{ label: 'Customization' }, { label: 'Fonts' }]}
        title="Fonts"
        description="Pick a font stack that matches your product — the SDK applies it to tooltip typography."
      />

      <DocSection>
        <DocH2>Dashboard presets</DocH2>
        <DocP>
          Choose from curated families in project settings. The hosted tour payload carries your selection so the renderer
          can style text consistently on the visitor&apos;s site.
        </DocP>
      </DocSection>

      <DocSection>
        <DocH2>Fallbacks</DocH2>
        <DocP>System UI stacks ensure readable text even when a webfont cannot load.</DocP>
      </DocSection>
    </article>
  )
}
