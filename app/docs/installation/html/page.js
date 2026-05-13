import { DocCallout, DocH2, DocImage, DocP, DocPre, DocSection } from '@/components/docs/doc-article'
import { DocHeader } from '@/components/docs/doc-header'

export const metadata = {
  title: 'Plain HTML',
}

export default function Page() {
  return (
    <article className="flex flex-col gap-8 pb-16">
      <DocHeader
        breadcrumb={[{ label: 'Installation' }, { label: 'Plain HTML' }]}
        title="Plain HTML"
        description="Add TourKit to any static page or server-rendered template."
      />

      <DocSection>
        <DocH2>Snippet</DocH2>
        <DocP>Paste before the closing body tag. Replace the script URL with your CDN or self-hosted bundle.</DocP>
        <DocPre>{`<script
  src="/tourkit.min.js"
  data-key="YOUR_SCRIPT_KEY"
  async
></script>`}</DocPre>
        <DocImage caption="HTML template with script near footer (placeholder)" ratio="video" />
      </DocSection>

      <DocCallout title="Caching" variant="info">
        If you version your assets, bump the query string on the script URL so browsers pick up SDK updates immediately.
      </DocCallout>
    </article>
  )
}
