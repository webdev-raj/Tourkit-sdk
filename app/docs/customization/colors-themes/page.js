import { DocH2, DocImage, DocLi, DocP, DocSection, DocUl } from '@/components/docs/doc-article'
import { DocHeader } from '@/components/docs/doc-header'

export const metadata = {
  title: 'Colors and themes',
}

export default function Page() {
  return (
    <article className="flex flex-col gap-8 pb-16">
      <DocHeader
        breadcrumb={[{ label: 'Customization' }, { label: 'Colors and themes' }]}
        title="Colors and themes"
        description="Align the tour with your brand using primary color and light or dark chrome."
      />

      <DocSection>
        <DocH2>Primary color</DocH2>
        <DocP>
          Sets accent elements — progress dots, primary buttons, and highlights. Default TourKit orange is{' '}
          <code className="rounded bg-[#0c0c0c] px-1.5 py-0.5 font-mono text-[13px] text-primary">#F15025</code>.
        </DocP>
        <DocImage caption="Appearance panel — color swatches (placeholder)" ratio="video" />
      </DocSection>

      <DocSection>
        <DocH2>Theme modes</DocH2>
        <DocUl>
          <DocLi>
            <strong className="text-foreground">Dark</strong> — charcoal surfaces, high contrast for SaaS dashboards.
          </DocLi>
          <DocLi>
            <strong className="text-foreground">Light</strong> — bright tooltip surfaces for marketing sites.
          </DocLi>
        </DocUl>
      </DocSection>
    </article>
  )
}
