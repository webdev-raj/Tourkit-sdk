import { DocH2, DocLi, DocP, DocPre, DocSection, DocUl } from '@/components/docs/doc-article'
import { DocHeader } from '@/components/docs/doc-header'

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
        <DocH2>Recommended placement</DocH2>
        <DocUl>
          <DocLi>
            In <strong className="text-foreground">index.html</strong> for CRA/Vite, or
          </DocLi>
          <DocLi>
            In your root <strong className="text-foreground">layout</strong> / App component using a small effect or a
            dedicated component that mounts the script once.
          </DocLi>
        </DocUl>
      </DocSection>

      <DocSection>
        <DocH2>Example: append script once</DocH2>
        <DocPre>{`useEffect(() => {
  const s = document.createElement('script')
  s.src = '/tourkit.min.js'
  s.async = true
  s.dataset.key = import.meta.env.VITE_TOURKIT_KEY
  document.body.appendChild(s)
  return () => { document.body.removeChild(s) }
}, [])`}</DocPre>
        <p className="text-sm text-muted-foreground">
          Prefer loading from HTML when possible so the SDK is available before hydration-heavy routes paint.
        </p>
      </DocSection>
    </article>
  )
}
