import { DocCallout, DocH2, DocH3, DocLi, DocP, DocSection, DocUl } from '@/components/docs/doc-article'
import { DocHeader } from '@/components/docs/doc-header'
import CodeBlock from '@/components/docs/code-block'
import DocImage from '@/components/docs/doc-image'
import { DOC_IMAGES } from '@/lib/doc-images'

const SELECTOR_EXAMPLE = `document.querySelector('[data-tour="billing"]')`

const API_START_FOR_PATH = `window.TourKit.startFor('/dashboard')`

const API_START = `window.TourKit.start()`

const API_DESTROY = `window.TourKit.destroy()`

const API_RESET = `window.TourKit.reset('/dashboard')`

const API_RESET_ALL = `window.TourKit.resetAll()`

export const metadata = {
  title: 'CSS selectors guide',
}

export default function Page() {
  return (
    <article className="flex flex-col gap-8 pb-16">
      <DocHeader
        breadcrumb={[{ label: 'Configuration' }, { label: 'CSS selectors guide' }]}
        title="CSS selectors guide"
        description="Prefer stable selectors so tours survive harmless markup refactors."
      />

      <DocSection>
        <DocH2>Practical reference</DocH2>
        <SelectorReferenceTable />
        <DocImage
          src={DOC_IMAGES.cssInspect}
          placeholder="Browser DevTools — Inspect element to find CSS selector"
          caption="Use DevTools to find the right CSS selector"
        />
      </DocSection>

      <DocSection>
        <DocH2>Good patterns</DocH2>
        <DocUl>
          <DocLi>
            <code className="rounded bg-[#0c0c0c] px-1.5 py-0.5 font-mono text-[13px] text-[#e6e8e6]">[data-tour=&quot;invite&quot;]</code>{' '}
            — explicit hooks you control.
          </DocLi>
          <DocLi>IDs on landmark sections when they are unique per page.</DocLi>
          <DocLi>Single-class hooks on buttons you own (avoid generated hashes).</DocLi>
        </DocUl>
      </DocSection>

      <DocSection>
        <DocH2>Fragile patterns</DocH2>
        <DocP>Deep descendant chains, nth-child indices, and auto-generated CSS-module class names break easily.</DocP>
      </DocSection>

      <DocSection>
        <DocH2>Try in DevTools</DocH2>
        <CodeBlock code={SELECTOR_EXAMPLE} language="javascript" />
      </DocSection>

      <DocCallout title="Tip" variant="tip">
        Open browser DevTools (F12), right-click any element → Inspect, then copy the selector from the HTML panel.
      </DocCallout>

      <DocCallout title="Dynamic lists" variant="warning">
        If the target mounts after data loads, ensure the element exists before the tour reaches that step — or reorder steps after async UI settles.
      </DocCallout>

      <DocSection>
        <DocH2>TourKit Global API</DocH2>
        <DocP>
          After installing the script tag, the following methods are available globally on{' '}
          <code className="text-primary">window.TourKit</code> on any page.
        </DocP>

        <DocH3>Start tour for specific page</DocH3>
        <CodeBlock code={API_START_FOR_PATH} language="javascript" />

        <DocH3>Start tour for current page</DocH3>
        <CodeBlock code={API_START} language="javascript" />

        <DocH3>Destroy active tour</DocH3>
        <CodeBlock code={API_DESTROY} language="javascript" />

        <DocH3>Reset seen flag for specific path</DocH3>
        <CodeBlock code={API_RESET} language="javascript" />

        <DocH3>Reset all seen flags for this project</DocH3>
        <CodeBlock code={API_RESET_ALL} language="javascript" />

        <DocH3>When to use the API</DocH3>
        <DocP>
          Use <code className="text-primary">TourKit.startFor()</code> in React and Next.js apps that use client-side routing.
          Without it, the SDK only runs on initial page load and misses route changes.
        </DocP>
        <DocImage
          src={DOC_IMAGES.consoleApi}
          placeholder="Browser console — window.TourKit API methods"
          caption="TourKit API available in browser console"
        />
      </DocSection>
    </article>
  )
}

function SelectorReferenceTable() {
  return (
    <div className="overflow-x-auto rounded-xl border border-white/10">
      <table className="w-full min-w-[28rem] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-white/10 bg-[#0c0c0c]">
            <th className="px-4 py-3 font-semibold text-foreground">Target</th>
            <th className="px-4 py-3 font-semibold text-foreground">Selector example</th>
          </tr>
        </thead>
        <tbody className="text-muted-foreground">
          <tr className="border-b border-white/10">
            <td className="px-4 py-2.5">Navigation bar</td>
            <td className="px-4 py-2.5 font-mono text-[13px] text-[#e6e8e6]">nav</td>
          </tr>
          <tr className="border-b border-white/10">
            <td className="px-4 py-2.5">Hero section</td>
            <td className="px-4 py-2.5 font-mono text-[13px] text-[#e6e8e6]">#hero</td>
          </tr>
          <tr className="border-b border-white/10">
            <td className="px-4 py-2.5">CTA button</td>
            <td className="px-4 py-2.5 font-mono text-[13px] text-[#e6e8e6]">.cta-button</td>
          </tr>
          <tr className="border-b border-white/10">
            <td className="px-4 py-2.5">Pricing section</td>
            <td className="px-4 py-2.5 font-mono text-[13px] text-[#e6e8e6]">#pricing</td>
          </tr>
          <tr className="border-b border-white/10">
            <td className="px-4 py-2.5">Footer</td>
            <td className="px-4 py-2.5 font-mono text-[13px] text-[#e6e8e6]">footer</td>
          </tr>
          <tr className="border-b border-white/10">
            <td className="px-4 py-2.5">Specific button</td>
            <td className="px-4 py-2.5 font-mono text-[13px] text-[#e6e8e6]">button[data-action=&quot;signup&quot;]</td>
          </tr>
          <tr>
            <td className="px-4 py-2.5">First child</td>
            <td className="px-4 py-2.5 font-mono text-[13px] text-[#e6e8e6]">main &gt; *:first-child</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
