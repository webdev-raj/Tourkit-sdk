import { DocCallout, DocH2, DocLi, DocOl, DocP, DocSection } from '@/components/docs/doc-article'
import { DocHeader } from '@/components/docs/doc-header'
import DocImage from '@/components/docs/doc-image'

export const metadata = {
  title: 'Creating your first tour',
}

export default function Page() {
  return (
    <article className="flex flex-col gap-8 pb-16">
      <DocHeader
        breadcrumb={[{ label: 'Configuration' }, { label: 'Creating your first tour' }]}
        title="Creating your first tour"
        description="From zero steps to a publishable walkthrough your users will see on site."
      />

      <DocSection>
        <DocH2>Workflow</DocH2>
        <DocOl>
          <DocLi>Select or create a project.</DocLi>
          <DocLi>Open the tour editor — you start with a default tour.</DocLi>
          <DocLi>Add steps with selectors that exist on your live pages.</DocLi>
          <DocLi>Preview positioning, then activate the tour.</DocLi>
        </DocOl>
        <DocImage
          src={null}
          placeholder="New project form — Project name and domain fields"
          caption="Creating a new project in the dashboard"
        />
        <DocImage
          src={null}
          placeholder="Tour editor — Empty state with Add step button"
          caption="Tour editor ready for your first step"
        />
      </DocSection>

      <DocCallout title="Naming" variant="tip">
        Give steps titles that match UI labels (“Invite teammates”) so operators can scan the list quickly.
      </DocCallout>
    </article>
  )
}
