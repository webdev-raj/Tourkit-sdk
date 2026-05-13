import { DocCallout, DocH2, DocImage, DocLi, DocOl, DocP, DocSection } from '@/components/docs/doc-article'
import { DocHeader } from '@/components/docs/doc-header'

export const metadata = {
  title: 'WordPress',
}

export default function Page() {
  return (
    <article className="flex flex-col gap-8 pb-16">
      <DocHeader
        breadcrumb={[{ label: 'Installation' }, { label: 'WordPress' }]}
        title="WordPress"
        description="Inject the snippet globally so tours run on every template that exposes your selectors."
      />

      <DocSection>
        <DocH2>Typical approaches</DocH2>
        <DocOl>
          <DocLi>
            <strong className="text-foreground">Theme footer</strong> — edit <code className="text-xs text-primary">footer.php</code> if you
            control the theme.
          </DocLi>
          <DocLi>
            <strong className="text-foreground">Plugin</strong> — “Insert Headers and Footers” or a small custom plugin that enqueues a script handle.
          </DocLi>
        </DocOl>
        <DocImage caption="WP admin — footer injection or plugin settings (placeholder)" ratio="video" />
      </DocSection>

      <DocCallout title="Caching plugins" variant="warning">
        Purge page cache after publishing tour changes so visitors receive fresh tour JSON from the API.
      </DocCallout>
    </article>
  )
}
