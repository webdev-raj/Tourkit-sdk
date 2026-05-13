import { DocH2, DocP, DocSection } from '@/components/docs/doc-article'
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
        <DocH2>Common reasons tour is not showing</DocH2>
        <ul className="space-y-2.5 font-mono text-[13px] leading-relaxed text-muted-foreground">
          <li className="flex gap-2">
            <span className="text-foreground" aria-hidden>
              □
            </span>
            <span>Script tag is missing data-key attribute</span>
          </li>
          <li className="flex gap-2">
            <span className="text-foreground" aria-hidden>
              □
            </span>
            <span>Script key doesn&apos;t match your project</span>
          </li>
          <li className="flex gap-2">
            <span className="text-foreground" aria-hidden>
              □
            </span>
            <span>Tour is set to inactive in dashboard</span>
          </li>
          <li className="flex gap-2">
            <span className="text-foreground" aria-hidden>
              □
            </span>
            <span>No steps added to the tour yet</span>
          </li>
          <li className="flex gap-2">
            <span className="text-foreground" aria-hidden>
              □
            </span>
            <span>
              localStorage has seen flag set (clear with:{' '}
              <code className="rounded border border-white/10 bg-[#0c0c0c] px-1.5 py-0.5 text-[#e6e8e6]">
                localStorage.removeItem(&apos;tourkit_seen_YOUR_KEY&apos;)
              </code>
              )
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-foreground" aria-hidden>
              □
            </span>
            <span>data-api URL is wrong or unreachable</span>
          </li>
          <li className="flex gap-2">
            <span className="text-foreground" aria-hidden>
              □
            </span>
            <span>Ad blocker is blocking the script</span>
          </li>
        </ul>
      </DocSection>

      <DocSection>
        <DocH2>How to debug</DocH2>
        <DocP>Open the browser console and look for any errors.</DocP>
        <DocP>
          In the Network tab you should see a request to: <code className="text-primary">/api/tour/YOUR_SCRIPT_KEY</code> (relative to your{' '}
          <code className="text-primary">data-api</code> base URL).
        </DocP>
      </DocSection>
    </article>
  )
}
