import { DocH2, DocP, DocPre, DocSection } from '@/components/docs/doc-article'
import { DocHeader } from '@/components/docs/doc-header'

export const metadata = {
  title: 'Vue.js',
}

export default function Page() {
  return (
    <article className="flex flex-col gap-8 pb-16">
      <DocHeader
        breadcrumb={[{ label: 'Installation' }, { label: 'Vue.js' }]}
        title="Vue.js"
        description="Mount the loader once — typically from main.ts or App.vue."
      />

      <DocSection>
        <DocH2>Single-page apps</DocH2>
        <DocP>
          Vue Router navigation does not reload the page. Ensure your integration does not append multiple copies of the
          TourKit script when routes change.
        </DocP>
      </DocSection>

      <DocSection>
        <DocH2>Minimal bootstrap</DocH2>
        <DocPre>{`// main.ts
const s = document.createElement('script')
s.src = '/tourkit.min.js'
s.async = true
s.dataset.key = import.meta.env.VITE_TOURKIT_KEY
document.body.appendChild(s)`}</DocPre>
      </DocSection>
    </article>
  )
}
