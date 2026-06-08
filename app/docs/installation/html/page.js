import { DocCallout, DocH2, DocP, DocSection } from '@/components/docs/doc-article'
import { DocHeader } from '@/components/docs/doc-header'
import CodeBlock from '@/components/docs/code-block'
import { TOURKIT_SCRIPT_SNIPPET } from '@/app/docs/_constants'

const FULL_HTML = `<!DOCTYPE html>
<html>
<head>
  <title>My Website</title>
</head>
<body>
  <nav>My Navigation</nav>
  <main id="hero">
    <h1>Welcome</h1>
    <button class="cta">Get Started</button>
  </main>

  <!-- TourKit -->
  <script
    src="https://cdn.jsdelivr.net/gh/webdev-raj/Tourkit@sdk-v14/sdk/dist/tourkit.min.js"
    data-key="YOUR_SCRIPT_KEY"
    data-api="https://tourkit-phi.vercel.app"
    async>
  </script>
</body>
</html>`

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
        <DocH2>Prerequisites</DocH2>
        <DocP>All you need is a text editor and a website where you can edit HTML (or your host&apos;s file manager).</DocP>
      </DocSection>

      <DocSection>
        <DocH2>Step 1 — Add the script tag</DocH2>
        <DocP>Paste this before the closing <code className="text-primary">&lt;/body&gt;</code> tag. Replace YOUR_SCRIPT_KEY with your project key from the TourKit dashboard.</DocP>
        <CodeBlock code={TOURKIT_SCRIPT_SNIPPET} />
      </DocSection>

      <DocSection>
        <DocH2>Step 2 — Verify it works</DocH2>
        <DocP>Open your site in a browser, open the developer console (F12), and confirm there are no script or network errors. You should see a successful request to fetch tour configuration for your script key.</DocP>
      </DocSection>

      <DocSection>
        <DocH2>Complete example</DocH2>
        <CodeBlock code={FULL_HTML} language="html" />
      </DocSection>

      <DocCallout title="Caching" variant="info">
        If you version your assets, bump the query string on the script URL so browsers pick up SDK updates immediately.
      </DocCallout>
    </article>
  )
}
