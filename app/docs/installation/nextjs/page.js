import { DocCallout, DocH2, DocLi, DocP, DocPre, DocSection, DocUl } from '@/components/docs/doc-article'
import { DocHeader } from '@/components/docs/doc-header'

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
          <DocLi>Add a small client component that injects the script, or use next/script with your CDN URL.</DocLi>
          <DocLi>Keep the script key in an environment variable exposed to the browser (NEXT_PUBLIC_…).</DocLi>
        </DocUl>
      </DocSection>

      <DocSection>
        <DocH2>Example with next/script</DocH2>
        <DocPre>{`import Script from 'next/script'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Script src="/tourkit.min.js" strategy="afterInteractive" />
      </body>
    </html>
  )
}`}</DocPre>
      </DocSection>

      <DocCallout title="Demo route" variant="tip">
        TourKit ships a demo route pattern you can mirror for staging — pair it with <code className="text-primary">data-demo</code>{' '}
        attributes when testing analytics isolation.
      </DocCallout>
    </article>
  )
}
