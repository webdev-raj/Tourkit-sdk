import { DocCallout, DocH2, DocLi, DocP, DocPre, DocSection, DocUl } from '@/components/docs/doc-article'
import { DocHeader } from '@/components/docs/doc-header'

export const metadata = {
  title: 'CSS selectors guide',
}

export default function Page() {
  return (
    <article className="flex flex-col gap-8 pb-16">
      <DocHeader
        breadcrumb={[{ label: 'Configuration' }, { label: 'CSS selectors guide' }]}
        title="CSS selectors guide"
        description="Prefer stable selectors so tours survive harmless markup refactors."
      />

      <DocSection>
        <DocH2>Good patterns</DocH2>
        <DocUl>
          <DocLi>
            <code className="rounded bg-[#0c0c0c] px-1.5 py-0.5 font-mono text-[13px] text-[#e6e8e6]">[data-tour=&quot;invite&quot;]</code>{' '}
            — explicit hooks you control.
          </DocLi>
          <DocLi>IDs on landmark sections when they are unique per page.</DocLi>
          <DocLi>Single-class hooks on buttons you own (avoid generated hashes).</DocLi>
        </DocUl>
      </DocSection>

      <DocSection>
        <DocH2>Fragile patterns</DocH2>
        <DocP>Deep descendant chains, nth-child indices, and auto-generated CSS-module class names break easily.</DocP>
      </DocSection>

      <DocSection>
        <DocH2>Validate in DevTools</DocH2>
        <DocPre>{`document.querySelector('[data-tour="billing"]')`}</DocPre>
      </DocSection>

      <DocCallout title="Dynamic lists" variant="warning">
        If the target mounts after data loads, ensure the element exists before the tour reaches that step — or reorder steps after async UI settles.
      </DocCallout>
    </article>
  )
}
