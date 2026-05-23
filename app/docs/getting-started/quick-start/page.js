import Link from 'next/link'

import {
  DocCallout,
  DocH2,
  DocLi,
  DocOl,
  DocP,
  DocSection,
  DocUl,
} from '@/components/docs/doc-article'
import { DocHeader } from '@/components/docs/doc-header'
import CodeBlock from '@/components/docs/code-block'
import DocImage from '@/components/docs/doc-image'
import { TOURKIT_SCRIPT_SNIPPET } from '@/app/docs/_constants'

export const metadata = {
  title: 'Quick start (5 minutes)',
}

export default function Page() {
  return (
    <article className="flex flex-col gap-8 pb-16">
      <DocHeader
        breadcrumb={[{ label: 'Getting Started' }, { label: 'Quick start' }]}
        title="Quick start (5 minutes)"
        description="Create a project, drop in the script tag, and run your first tour end-to-end."
      />

      <DocCallout variant="tip" title="New to TourKit?">
        Use our free{' '}
        <Link href="/tools/generate" className="font-medium text-primary underline-offset-4 hover:underline">
          AI Tour Generator
        </Link>{' '}
        to create your first tour steps automatically. No signup required.{' '}
        <Link href="/tools/generate" className="font-medium text-primary underline-offset-4 hover:underline">
          Try it free →
        </Link>
      </DocCallout>

      <DocSection>
        <DocH2>Prerequisites</DocH2>
        <DocUl>
          <DocLi>A TourKit account (sign up from the marketing site).</DocLi>
          <DocLi>A site or dev environment where you can add a script tag.</DocLi>
        </DocUl>
      </DocSection>

      <DocSection>
        <DocH2>1. Create a project</DocH2>
        <DocP>In the dashboard, create a project and note your unique script key.</DocP>
        <DocImage
          src={null}
          placeholder="Dashboard — Create a project and copy your script key"
          caption="Step 1: Create a project in the dashboard"
        />
      </DocSection>

      <DocSection>
        <DocH2>2. Install the snippet</DocH2>
        <DocP>
          The TourKit SDK is hosted on jsDelivr CDN. Add this script tag before your closing <code className="text-primary">&lt;/body&gt;</code> tag:
        </DocP>
        <CodeBlock code={TOURKIT_SCRIPT_SNIPPET} />
        <DocP>Replace YOUR_SCRIPT_KEY with the script key from your TourKit dashboard project.</DocP>
        <p className="text-sm leading-relaxed text-muted-foreground">
          The <code className="rounded-md border border-white/10 bg-[#0c0c0c] px-1.5 py-0.5 font-mono text-[0.9em] text-primary">data-api</code> attribute tells the SDK where to fetch your tour configuration from.
        </p>
        <DocImage
          src={null}
          placeholder="Install snippet — Script tag in your HTML"
          caption="Step 2: Paste the script tag before </body>"
        />
      </DocSection>

      <DocSection>
        <DocH2>3. Publish steps</DocH2>
        <DocOl>
          <DocLi>Open the tour editor for your project.</DocLi>
          <DocLi>Add a step: CSS selector, title, message, position.</DocLi>
          <DocLi>Activate the tour when you are ready.</DocLi>
        </DocOl>
        <DocImage
          src={null}
          placeholder="Tour editor — Add steps with CSS selectors"
          caption="Step 3: Configure your tour steps"
        />
      </DocSection>

      <DocSection>
        <DocH2>4. Verify on your site</DocH2>
        <DocP>Load the page that matches your selectors. The SDK fetches tour JSON and renders the tooltip tour.</DocP>
        <DocCallout title="Tip" variant="tip">
          Use the hosted demo route or your staging URL first, then roll out to production.
        </DocCallout>
        <DocImage
          src={null}
          placeholder="Live tour — Tooltip appearing on your website"
          caption="Step 4: Tour running on your website"
        />
      </DocSection>
    </article>
  )
}
