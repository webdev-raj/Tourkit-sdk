import { DocCallout, DocH2, DocH3, DocLi, DocP, DocSection, DocUl } from '@/components/docs/doc-article'
import { DocHeader } from '@/components/docs/doc-header'
import CodeBlock from '@/components/docs/code-block'

const IDENTIFY_EXAMPLE = `window.TourKit.identify({ userId: 'user_123', plan: 'pro' })`

export const metadata = {
  title: 'Announcements',
}

export default function Page() {
  return (
    <article className="flex flex-col gap-8 pb-16">
      <DocHeader
        breadcrumb={[{ label: 'Configuration' }, { label: 'Announcements' }]}
        title="Announcements"
        description="Ship product updates with the same script tag as your tour. Modal, banner, or slide-in — no extra install."
      />

      <DocSection>
        <DocH2>Types</DocH2>
        <DocUl>
          <DocLi>
            <strong className="text-foreground">Modal</strong> — centered card over a dimmed overlay. Best for launches
            and important notices.
          </DocLi>
          <DocLi>
            <strong className="text-foreground">Banner</strong> — full-width bar at the top of the page. Pushes page
            content down while it is open.
          </DocLi>
          <DocLi>
            <strong className="text-foreground">Slide-in</strong> — corner card (bottom-right by default). Pro plan
            only.
          </DocLi>
        </DocUl>
      </DocSection>

      <DocSection>
        <DocH2>Sizes</DocH2>
        <DocP>Every type has Small, Medium, and Large. Medium is the default. Modal medium is wider than a tour tooltip.</DocP>
        <DocUl>
          <DocLi>Modal max-width: 380px / 520px / 720px</DocLi>
          <DocLi>Banner height: compact title+CTA / title+description / plus image thumbnail</DocLi>
          <DocLi>Slide-in width: 300px / 380px / 460px</DocLi>
        </DocUl>
      </DocSection>

      <DocSection>
        <DocH2>Variants</DocH2>
        <DocP>
          Info (your tour primary color), Success, Warning, and Promo change the accent on the CTA, top line, and icon.
          Layout stays the same.
        </DocP>
      </DocSection>

      <DocSection>
        <DocH2>Targeting</DocH2>
        <DocH3>Pages</DocH3>
        <DocP>
          Show on all pages, or a comma-separated list of URL patterns. Patterns use the same matcher as tour URL
          triggers: exact paths, <code className="text-primary">[param]</code> segments, and <code className="text-primary">/*</code>{' '}
          wildcards.
        </DocP>
        <DocH3>Audience</DocH3>
        <DocUl>
          <DocLi>All visitors</DocLi>
          <DocLi>New visitors — first seen less than 7 days ago</DocLi>
          <DocLi>Returning visitors — first seen 7 or more days ago</DocLi>
          <DocLi>Logged-in users — only after identify() is called, optionally filtered by plan</DocLi>
        </DocUl>
      </DocSection>

      <DocSection>
        <DocH2>Frequency</DocH2>
        <DocUl>
          <DocLi>
            <strong className="text-foreground">Once per user</strong> — skipped after the first view
          </DocLi>
          <DocLi>
            <strong className="text-foreground">Until dismissed</strong> — keeps showing until the visitor closes it
          </DocLi>
          <DocLi>
            <strong className="text-foreground">Every visit</strong> — no localStorage gate
          </DocLi>
        </DocUl>
      </DocSection>

      <DocSection>
        <DocH2>identify()</DocH2>
        <DocP>
          Call after login so logged-in and plan-based audiences can resolve. The object is stored in memory only (not
          localStorage). Announcements re-evaluate immediately after the call.
        </DocP>
        <CodeBlock code={IDENTIFY_EXAMPLE} language="javascript" />
      </DocSection>

      <DocCallout title="Plans" variant="tip">
        Announcements require Starter or Pro. Starter: up to 2 active, modal and banner only. Pro: unlimited, all types.
      </DocCallout>
    </article>
  )
}
