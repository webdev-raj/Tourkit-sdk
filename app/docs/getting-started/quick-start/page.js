import {
  DocCallout,
  DocH2,
  DocImage,
  DocLi,
  DocOl,
  DocP,
  DocPre,
  DocSection,
  DocUl,
} from '@/components/docs/doc-article'
import { DocHeader } from '@/components/docs/doc-header'

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
        <DocImage caption="Dashboard — project card with script key (placeholder)" ratio="video" />
      </DocSection>

      <DocSection>
        <DocH2>2. Install the snippet</DocH2>
        <DocP>
          Add the TourKit script before <code className="text-primary">&lt;/body&gt;</code>. Point{' '}
          <code className="text-primary">data-api</code> at your app URL if you self-host.
        </DocP>
        <DocPre>{`<script
  src="https://cdn.example/tourkit.min.js"
  data-key="YOUR_SCRIPT_KEY"
  async
></script>`}</DocPre>
      </DocSection>

      <DocSection>
        <DocH2>3. Publish steps</DocH2>
        <DocOl>
          <DocLi>Open the tour editor for your project.</DocLi>
          <DocLi>Add a step: CSS selector, title, message, position.</DocLi>
          <DocLi>Activate the tour when you are ready.</DocLi>
        </DocOl>
        <DocImage caption="Tour editor — steps list and preview (placeholder)" ratio="wide" />
      </DocSection>

      <DocSection>
        <DocH2>4. Verify on your site</DocH2>
        <DocP>Load the page that matches your selectors. The SDK fetches tour JSON and renders the tooltip tour.</DocP>
        <DocCallout title="Tip" variant="tip">
          Use the hosted demo route or your staging URL first, then roll out to production.
        </DocCallout>
      </DocSection>
    </article>
  )
}
