import { DocH2, DocLi, DocP, DocSection, DocUl } from '@/components/docs/doc-article'
import { DocHeader } from '@/components/docs/doc-header'
import CodeBlock from '@/components/docs/code-block'
import { TOURKIT_SCRIPT_SNIPPET } from '@/app/docs/_constants'

const OPTION_A_HTML = `<!-- In public/index.html, paste before </body> -->

${TOURKIT_SCRIPT_SNIPPET}`

const OPTION_B_USEEFFECT = `const TOURKIT_SCRIPT_ID = 'tourkit-sdk'
const TOURKIT_SRC = 'https://cdn.jsdelivr.net/gh/webdev-raj/Tourkit@sdk-v13/sdk/dist/tourkit.min.js'

useEffect(() => {
  if (document.getElementById(TOURKIT_SCRIPT_ID)) return
  const script = document.createElement('script')
  script.id = TOURKIT_SCRIPT_ID
  script.src = TOURKIT_SRC
  script.setAttribute('data-key', 'YOUR_SCRIPT_KEY')
  script.setAttribute('data-api', 'https://tourkit-phi.vercel.app')
  script.async = true
  document.body.appendChild(script)
}, [])`

const TOURKIT_PROVIDER = `// src/components/TourKitProvider.jsx
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export default function TourKitProvider() {
  const location = useLocation()

  useEffect(() => {
    const timer = setTimeout(() => {
      window.TourKit?.startFor(location.pathname)
    }, 500)
    return () => clearTimeout(timer)
  }, [location.pathname])

  return null
}`

const APP_JSX = `import { BrowserRouter } from 'react-router-dom'
import TourKitProvider from './components/TourKitProvider'

export default function App() {
  return (
    <BrowserRouter>
      <TourKitProvider />
      {/* rest of your app */}
    </BrowserRouter>
  )
}`

export const metadata = {
  title: 'React.js',
}

export default function Page() {
  return (
    <article className="flex flex-col gap-8 pb-16">
      <DocHeader
        breadcrumb={[{ label: 'Installation' }, { label: 'React.js' }]}
        title="React.js"
        description="Load the script once at the app shell — avoid injecting duplicates on every route change."
      />

      <DocSection>
        <DocH2>1. Add to index.html or use useEffect</DocH2>
        <DocP>
          Prefer adding the snippet to <strong className="text-foreground">public/index.html</strong> (CRA/Vite) so it
          loads before your bundle. Alternatively, append the script once from a root component.
        </DocP>
      </DocSection>

      <DocSection>
        <DocH2>Option A — Add to public/index.html</DocH2>
        <CodeBlock code={OPTION_A_HTML} language="html" />
      </DocSection>

      <DocSection>
        <DocH2>Option B — Load dynamically in useEffect</DocH2>
        <CodeBlock code={OPTION_B_USEEFFECT} language="javascript" />
      </DocSection>

      <DocSection>
        <DocH2>Single Page App Setup</DocH2>
        <DocP>
          React apps use client-side routing — the page URL changes without a full reload. TourKit needs to know when the
          route changes to show the correct tour.
        </DocP>
        <DocP>Add a TourKitProvider component to your app:</DocP>
        <CodeBlock code={TOURKIT_PROVIDER} language="javascript" />
        <DocP>Then add it to your App.js inside your Router:</DocP>
        <CodeBlock code={APP_JSX} language="javascript" />
        <DocP>The 500ms delay gives the page time to render before the tour starts.</DocP>
      </DocSection>

      <DocSection>
        <DocH2>Single-page apps</DocH2>
        <DocUl>
          <DocLi>Vue Router and React Router do not reload the page — ensure you only mount the script once.</DocLi>
          <DocLi>Prefer HTML injection when possible so the SDK is available before heavy client hydration.</DocLi>
        </DocUl>
      </DocSection>
    </article>
  )
}
