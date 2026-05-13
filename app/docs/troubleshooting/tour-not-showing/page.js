import { DocCallout, DocH2, DocLi, DocOl, DocP, DocSection } from '@/components/docs/doc-article'
import { DocHeader } from '@/components/docs/doc-header'

export const metadata = {
  title: 'Tour not showing',
}

export default function Page() {
  return (
    <article className="flex flex-col gap-8 pb-16">
      <DocHeader
        breadcrumb={[{ label: 'Troubleshooting' }, { label: 'Tour not showing' }]}
        title="Tour not showing"
        description="Systematic checks when nothing renders on the visitor site."
      />

      <DocSection>
        <DocH2>Checklist</DocH2>
        <DocOl>
          <DocLi>Script tag loads without 404 — verify URL and deployment path.</DocLi>
          <DocLi>
            <code className="text-primary">data-key</code> matches an active project script key.
          </DocLi>
          <DocLi>Tour is active in the dashboard and project is not disabled.</DocLi>
          <DocLi>API base URL is reachable from the browser (CORS / network).</DocLi>
        </DocOl>
      </DocSection>

      <DocCallout title="Demo mode" variant="info">
        Demo pages may flag analytics separately — confirm you are testing the same embed path production uses.
      </DocCallout>

      <DocSection>
        <DocH2>Still stuck?</DocH2>
        <DocP>Open DevTools → Network and confirm the tour JSON request returns 200 with steps.</DocP>
      </DocSection>
    </article>
  )
}
