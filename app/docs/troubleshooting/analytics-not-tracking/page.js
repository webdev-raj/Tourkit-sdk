import { DocCallout, DocH2, DocLi, DocOl, DocP, DocSection } from '@/components/docs/doc-article'
import { DocHeader } from '@/components/docs/doc-header'

export const metadata = {
  title: 'Analytics not tracking',
}

export default function Page() {
  return (
    <article className="flex flex-col gap-8 pb-16">
      <DocHeader
        breadcrumb={[{ label: 'Troubleshooting' }, { label: 'Analytics not tracking' }]}
        title="Analytics not tracking"
        description="When events never reach your dashboard charts."
      />

      <DocSection>
        <DocH2>Verify ingest path</DocH2>
        <DocOl>
          <DocLi>SDK points at the correct analytics endpoint for your deployment.</DocLi>
          <DocLi>Ad blockers or corporate proxies are not stripping beacon requests during tests.</DocLi>
          <DocLi>Demo flags are disabled when validating production traffic.</DocLi>
        </DocOl>
      </DocSection>

      <DocCallout title="Clock skew" variant="tip">
        Analytics batches may appear delayed near UTC boundaries — refresh after a minute before assuming loss.
      </DocCallout>

      <DocSection>
        <DocH2>Schema readiness</DocH2>
        <DocP>Ensure your Supabase schema includes analytics tables — missing migrations manifest as silent server drops.</DocP>
      </DocSection>
    </article>
  )
}
