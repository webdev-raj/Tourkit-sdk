import { DocH2, DocP, DocSection } from '@/components/docs/doc-article'
import { DocHeader } from '@/components/docs/doc-header'
import CodeBlock from '@/components/docs/code-block'

const VUE_MOUNT = `import { onMounted, onUnmounted } from 'vue'

onMounted(() => {
  const script = document.createElement('script')
  script.src = 'https://cdn.jsdelivr.net/gh/webdev-raj/Tourkit@sdk-v8/sdk/dist/tourkit.min.js'
  script.setAttribute('data-key', 'YOUR_SCRIPT_KEY')
  script.setAttribute('data-api', 'https://tourkit-phi.vercel.app')
  script.async = true
  document.body.appendChild(script)
})

onUnmounted(() => {
  const script = document.querySelector('script[data-key]')
  if (script) script.remove()
})`

export const metadata = {
  title: 'Vue.js',
}

export default function Page() {
  return (
    <article className="flex flex-col gap-8 pb-16">
      <DocHeader
        breadcrumb={[{ label: 'Installation' }, { label: 'Vue.js' }]}
        title="Vue.js"
        description="Mount the loader once — typically from main.ts or App.vue using onMounted."
      />

      <DocSection>
        <DocH2>onMounted</DocH2>
        <DocP>
          Vue Router navigation does not reload the page. Load the script once when the app mounts and remove it on teardown if you need a clean slate during HMR.
        </DocP>
        <CodeBlock code={VUE_MOUNT} language="javascript" />
      </DocSection>

      <DocSection>
        <DocH2>Single-page apps</DocH2>
        <DocP>Ensure your integration does not append multiple copies of the TourKit script when routes change.</DocP>
      </DocSection>
    </article>
  )
}
