import { DocH2, DocH3, DocLi, DocP, DocSection, DocUl } from '@/components/docs/doc-article'
import { DocHeader } from '@/components/docs/doc-header'
import CodeBlock from '@/components/docs/code-block'
import DocImage from '@/components/docs/doc-image'
import { DOC_IMAGES } from '@/lib/doc-images'

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

const SUPPORTED_URL_PATTERNS = `/dashboard              → exact path only
/products/[id]          → dynamic segment
/blog/[category]/[post] → multiple dynamic segments
/dashboard/*            → all sub-routes`

export const metadata = {
  title: 'Adding steps',
}

export default function Page() {
  return (
    <article className="flex flex-col gap-8 pb-16">
      <DocHeader
        breadcrumb={[{ label: 'Configuration' }, { label: 'Adding steps' }]}
        title="Adding steps"
        description="Each step is one tooltip anchored to a DOM node on your site."
      />

      <DocSection>
        <DocH2>Fields</DocH2>
        <DocUl>
          <DocLi>
            <strong className="text-foreground">Selector</strong> — any valid CSS selector that resolves to a visible element.
          </DocLi>
          <DocLi>
            <strong className="text-foreground">Title & message</strong> — concise headline plus supporting copy.
          </DocLi>
          <DocLi>
            <strong className="text-foreground">Position</strong> — top, bottom, left, or right relative to the element box.
          </DocLi>
        </DocUl>
        <DocImage
          src={DOC_IMAGES.stepEditor}
          placeholder="Step editor — Title, message, CSS selector and position fields"
          caption="Step editor with all configuration fields"
        />
      </DocSection>

      <DocSection>
        <DocH2>Ordering</DocH2>
        <DocP>Reorder steps in the dashboard — runtime order follows your saved sequence.</DocP>
      </DocSection>

      <DocSection>
        <DocH2>Trigger URL (Context-Aware Tours)</DocH2>

        <DocH3>What is a Trigger URL?</DocH3>
        <DocP>
          By default TourKit runs in <strong className="text-foreground">linear mode</strong> — all steps show on every page,
          once per visitor.
        </DocP>
        <DocP>
          When you set a Trigger URL on a step, TourKit switches to <strong className="text-foreground">context-aware mode</strong>.
          Each page gets its own focused tour.
        </DocP>

        <DocH3>How to set it</DocH3>
        <DocP>
          In the step editor, find the <strong className="text-foreground">Trigger URL</strong> field below the CSS Selector
          input. Enter the URL path for that step:
        </DocP>
        <DocUl>
          <DocLi>
            <code className="text-primary">/dashboard</code>
          </DocLi>
          <DocLi>
            <code className="text-primary">/projects</code>
          </DocLi>
          <DocLi>
            <code className="text-primary">/settings</code>
          </DocLi>
          <DocLi>
            <code className="text-primary">/pricing</code>
          </DocLi>
        </DocUl>

        <DocH3>How it works</DocH3>
        <ContextAwareTable />

        <DocH3>Real world example</DocH3>
        <CodeBlock code={TRIGGER_EXAMPLE} language="text" />

        <DocH3>Wildcard matching</DocH3>
        <DocP>
          Use <code className="text-primary">*</code> at the end for prefix matching:
        </DocP>
        <CodeBlock code={WILDCARD_EXAMPLE} language="text" />
        <DocImage
          src={DOC_IMAGES.triggerUrl}
          placeholder="Trigger URL field — Optional URL path input in step editor"
          caption="Setting a Trigger URL for context-aware tours"
        />

        <DocH3>Supported URL patterns</DocH3>
        <CodeBlock code={SUPPORTED_URL_PATTERNS} language="text" />
        <DocP>
          <strong className="text-foreground">Tip:</strong> Use <code className="text-primary">[param]</code> for any
          dynamic segment like IDs, slugs, or usernames. Use <code className="text-primary">*</code> at the end for
          matching all sub-routes.
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

