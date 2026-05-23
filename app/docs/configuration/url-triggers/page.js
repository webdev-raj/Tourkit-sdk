import { DocH2, DocH3, DocLi, DocOl, DocP, DocSection, DocUl } from '@/components/docs/doc-article'
import { DocHeader } from '@/components/docs/doc-header'
import CodeBlock from '@/components/docs/code-block'
import DocImage from '@/components/docs/doc-image'

const TRIGGER_EXAMPLE = `Step 1: no url → shows on / (welcome)
Step 2: no url → shows on / (feature overview)
Step 3: url = /dashboard → shows on /dashboard only
Step 4: url = /projects → shows on /projects only
Step 5: url = /settings → shows on /settings only

Result:
- / → steps 1 and 2
- /dashboard → step 3 only
- /projects → step 4 only
- /settings → step 5 only
- /other → no tour`

const WILDCARD_EXAMPLE = `/projects* matches:
/projects
/projects/123
/projects/123/edit`

const API_START_FOR_PATH = `window.TourKit.startFor('/dashboard')`

const API_START = `window.TourKit.start()`

const API_DESTROY = `window.TourKit.destroy()`

const API_RESET = `window.TourKit.reset('/dashboard')`

const API_RESET_ALL = `window.TourKit.resetAll()`

export const metadata = {
  title: 'Context-Aware URL Triggers',
}

export default function Page() {
  return (
    <article className="flex flex-col gap-8 pb-16">
      <DocHeader
        breadcrumb={[{ label: 'Configuration' }, { label: 'URL Triggers' }]}
        title="Context-Aware URL Triggers"
        description="Show different tours on different pages"
      />

      <DocSection>
        <DocH2>Overview</DocH2>
        <DocH3>Linear mode</DocH3>
        <DocP>
          By default TourKit runs in linear mode — all steps show on every page, once per visitor. One seen flag applies
          across your entire site.
        </DocP>
        <DocH3>Context-aware mode</DocH3>
        <DocP>
          When any step has a Trigger URL, TourKit switches to context-aware mode. Each page gets its own focused tour
          and its own seen flag.
        </DocP>
        <ContextAwareTable />
        <DocImage
          src={null}
          placeholder="Context-aware diagram — Different steps showing on different pages"
          caption="Context-aware mode: each page gets its own tour"
        />
        <DocH3>Real world example</DocH3>
        <CodeBlock code={TRIGGER_EXAMPLE} language="text" />
        <DocH3>Wildcard matching</DocH3>
        <DocP>
          Use <code className="text-primary">*</code> at the end for prefix matching:
        </DocP>
        <CodeBlock code={WILDCARD_EXAMPLE} language="text" />
      </DocSection>

      <DocSection>
        <DocH2>Setup in 3 steps</DocH2>
        <DocOl>
          <DocLi>
            <strong className="text-foreground">Create your steps</strong> — Add steps in the tour editor as normal.
          </DocLi>
          <DocLi>
            <strong className="text-foreground">Set Trigger URLs</strong> — For each step that belongs to a specific
            page, enter the URL path in the Trigger URL field (e.g. <code className="text-primary">/dashboard</code>).
          </DocLi>
          <DocLi>
            <strong className="text-foreground">Add TourKitProvider (React/Next.js)</strong> — If using a SPA framework,
            add TourKitProvider so route changes trigger the correct tour. See the React or Next.js installation guides.
          </DocLi>
        </DocOl>
        <DocImage
          src={null}
          placeholder="Multi-page demo — Dashboard, Projects, Settings pages in demo"
          caption="Use the Live Demo to test URL triggers"
        />
      </DocSection>

      <DocSection>
        <DocH2>Testing</DocH2>
        <DocP>Use the Live Demo page to test context-aware tours without touching your real website:</DocP>
        <DocUl>
          <DocLi>
            Go to your project → <strong className="text-foreground">Live Demo</strong>
          </DocLi>
          <DocLi>The demo has multiple pages: Home (/), Dashboard (/dashboard), Projects (/projects), Settings (/settings), Pricing (/pricing)</DocLi>
          <DocLi>Set Trigger URLs matching these paths to verify each page shows the right steps</DocLi>
        </DocUl>
      </DocSection>

      <DocSection>
        <DocH2>Full API reference</DocH2>
        <DocP>
          After installing the script tag, these methods are available on{' '}
          <code className="text-primary">window.TourKit</code>:
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
      </DocSection>
    </article>
  )
}

function ContextAwareTable() {
  return (
    <div className="overflow-x-auto rounded-xl border border-white/10">
      <table className="w-full min-w-[28rem] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-white/10 bg-[#0c0c0c]">
            <th className="px-4 py-3 font-semibold text-foreground">Setup</th>
            <th className="px-4 py-3 font-semibold text-foreground">Behavior</th>
          </tr>
        </thead>
        <tbody className="text-muted-foreground">
          <tr className="border-b border-white/10">
            <td className="px-4 py-2.5">No steps have Trigger URL</td>
            <td className="px-4 py-2.5">Linear mode — all steps on every page, one seen flag</td>
          </tr>
          <tr className="border-b border-white/10">
            <td className="px-4 py-2.5">Any step has Trigger URL</td>
            <td className="px-4 py-2.5">Context-aware mode — each page gets own steps</td>
          </tr>
          <tr className="border-b border-white/10">
            <td className="px-4 py-2.5">Steps without Trigger URL</td>
            <td className="px-4 py-2.5">Root only — shows on /</td>
          </tr>
          <tr className="border-b border-white/10">
            <td className="px-4 py-2.5">Steps with Trigger URL</td>
            <td className="px-4 py-2.5">Shows only on matching path</td>
          </tr>
          <tr>
            <td className="px-4 py-2.5">Page with no matching steps</td>
            <td className="px-4 py-2.5">No tour shown</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
