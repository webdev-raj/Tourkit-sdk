import { DocCallout, DocH2, DocLi, DocP, DocSection, DocUl } from '@/components/docs/doc-article'
import { DocHeader } from '@/components/docs/doc-header'
import CodeBlock from '@/components/docs/code-block'

const NEXT_SCRIPT_BLOCK = `import Script from 'next/script'

export default function Layout({ children }) {
  return (
    <>
      {children}
      <Script
        src="https://cdn.jsdelivr.net/gh/webdev-raj/Tourkit@main/sdk/dist/tourkit.min.js?v=2"
        data-key="YOUR_SCRIPT_KEY"
        data-api="https://tourkit-phi.vercel.app"
        strategy="afterInteractive"
      />
    </>
  )
}`

export const metadata = {
  title: 'Next.js',
}

export default function Page() {
  return (
    <article className="flex flex-col gap-8 pb-16">
      <DocHeader
        breadcrumb={[{ label: 'Installation' }, { label: 'Next.js' }]}
        title="Next.js"
        description="Use the App Router root layout or a client wrapper to load the SDK exactly once."
      />

      <DocSection>
        <DocH2>App Router</DocH2>
        <DocUl>
          <DocLi>Add <code className="text-primary">next/script</code> in your root layout so the SDK loads on every page.</DocLi>
          <DocLi>Keep the script key in an environment variable exposed to the browser (<code className="text-primary">NEXT_PUBLIC_…</code>).</DocLi>
        </DocUl>
      </DocSection>

      <DocSection>
        <DocH2>Example with next/script</DocH2>
        <CodeBlock code={NEXT_SCRIPT_BLOCK} language="javascript" />
      </DocSection>

      <DocCallout title="Demo route" variant="tip">
        TourKit ships a demo route pattern you can mirror for staging — pair it with <code className="text-primary">data-demo</code>{' '}
        attributes when testing analytics isolation.
      </DocCallout>
    </article>
  )
}
