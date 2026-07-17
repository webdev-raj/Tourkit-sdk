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

const DYNAMIC_SYNTAX_EXAMPLE = `# Exact match (default)
/dashboard           → matches /dashboard only

# Dynamic segment
/products/[id]       → matches /products/123
                     → matches /products/abc-slug
                     → does NOT match /products/123/edit

# Nested dynamic
/blog/[category]/[slug] → matches /blog/tech/my-post

# Wildcard (all sub-routes)
/dashboard/*         → matches /dashboard/anything
                     → matches /dashboard/a/b/c`

const SESSION_FLAG_EXAMPLE = `Pattern: /products/[id]

User visits /products/123 → tour runs → flag stored
User visits /products/456 → flag exists → tour skips
User visits /products/789 → flag exists → tour skips`

const COMMON_USE_CASES_EXAMPLE = `# SaaS dashboard
/dashboard/projects/[id]        → project detail page
/dashboard/projects/[id]/analytics → analytics page

# Blog
/blog/[slug]                    → any blog post
/blog/[category]/[slug]         → categorized post

# E-commerce
/products/[id]                  → any product page
/shop/[category]/[product]      → category product`

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
          src="/ref-images/contextaware-diagram.png"
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

        <DocH3>Dynamic URL segments</DocH3>
        <DocP>
          Use <code className="text-primary">[param]</code> syntax to match dynamic URL segments like IDs, slugs, and
          other variable path parts.
        </DocP>

        <DocH3>Syntax</DocH3>
        <CodeBlock code={DYNAMIC_SYNTAX_EXAMPLE} language="text" />

        <DocH3>Real world examples</DocH3>
        <DynamicUrlTable />

        <DocH3>Session flag behavior</DocH3>
        <DocP>
          When using dynamic segments, TourKit uses the <strong className="text-foreground">pattern</strong> as the
          session key — not the actual URL.
        </DocP>
        <DocP>This means:</DocP>
        <CodeBlock code={SESSION_FLAG_EXAMPLE} language="text" />
        <DocP>
          Tour shows <strong className="text-foreground">once</strong> across all dynamic pages. ✅ This prevents users
          from seeing the same tour on every product, post, or project page.
        </DocP>

        <DocH3>Common use cases</DocH3>
        <CodeBlock code={COMMON_USE_CASES_EXAMPLE} language="text" />

        <DocH3>Matching priority</DocH3>
        <DocP>When multiple steps have url_patterns, TourKit matches in this order:</DocP>
        <DocOl>
          <DocLi>Exact match (<code className="text-primary">/dashboard</code>)</DocLi>
          <DocLi>
            Dynamic match (<code className="text-primary">/products/[id]</code>)
          </DocLi>
          <DocLi>
            Wildcard match (<code className="text-primary">/dashboard/*</code>)
          </DocLi>
        </DocOl>
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
          src="/ref-images/muiltpage.png"
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

function DynamicUrlTable() {
  return (
    <div className="overflow-x-auto rounded-xl border border-white/10">
      <table className="w-full min-w-[32rem] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-white/10 bg-[#0c0c0c]">
            <th className="px-4 py-3 font-semibold text-foreground">Pattern</th>
            <th className="px-4 py-3 font-semibold text-foreground">Matches</th>
            <th className="px-4 py-3 font-semibold text-foreground">Does not match</th>
          </tr>
        </thead>
        <tbody className="text-muted-foreground">
          <tr className="border-b border-white/10">
            <td className="px-4 py-2.5 font-mono text-[13px] text-foreground">/dashboard</td>
            <td className="px-4 py-2.5 font-mono text-[13px]">/dashboard</td>
            <td className="px-4 py-2.5 font-mono text-[13px]">/dashboard/projects</td>
          </tr>
          <tr className="border-b border-white/10">
            <td className="px-4 py-2.5 font-mono text-[13px] text-foreground">/products/[id]</td>
            <td className="px-4 py-2.5 font-mono text-[13px]">/products/123</td>
            <td className="px-4 py-2.5 font-mono text-[13px]">/products/123/reviews</td>
          </tr>
          <tr className="border-b border-white/10">
            <td className="px-4 py-2.5 font-mono text-[13px] text-foreground">/products/[id]/reviews</td>
            <td className="px-4 py-2.5 font-mono text-[13px]">/products/123/reviews</td>
            <td className="px-4 py-2.5 font-mono text-[13px]">/products/123</td>
          </tr>
          <tr className="border-b border-white/10">
            <td className="px-4 py-2.5 font-mono text-[13px] text-foreground">/blog/[slug]</td>
            <td className="px-4 py-2.5 font-mono text-[13px]">/blog/my-post</td>
            <td className="px-4 py-2.5 font-mono text-[13px]">/blog/tech/my-post</td>
          </tr>
          <tr>
            <td className="px-4 py-2.5 font-mono text-[13px] text-foreground">/dashboard/*</td>
            <td className="px-4 py-2.5 font-mono text-[13px]">/dashboard/anything</td>
            <td className="px-4 py-2.5 font-mono text-[13px]">/dashboard</td>
          </tr>
        </tbody>
      </table>
    </div>
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
