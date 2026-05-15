import { DocCallout, DocH2, DocLi, DocOl, DocP, DocSection } from '@/components/docs/doc-article'
import { DocHeader } from '@/components/docs/doc-header'
import CodeBlock from '@/components/docs/code-block'
import { TOURKIT_SCRIPT_SNIPPET } from '@/app/docs/_constants'

const WP_FUNCTIONS_PHP = `function add_tourkit_script() {
  wp_enqueue_script(
    'tourkit',
    'https://cdn.jsdelivr.net/gh/webdev-raj/Tourkit@main/sdk/dist/tourkit.min.js?v=4',
    array(),
    null,
    true
  );
  add_filter('script_loader_tag', function($tag, $handle) {
    if ($handle === 'tourkit') {
      return str_replace(
        '<script',
        '<script data-key="YOUR_SCRIPT_KEY" data-api="https://tourkit-phi.vercel.app"',
        $tag
      );
    }
    return $tag;
  }, 10, 2);
}
add_action('wp_enqueue_scripts', 'add_tourkit_script');`

export const metadata = {
  title: 'WordPress',
}

export default function Page() {
  return (
    <article className="flex flex-col gap-8 pb-16">
      <DocHeader
        breadcrumb={[{ label: 'Installation' }, { label: 'WordPress' }]}
        title="WordPress"
        description="Inject the snippet globally so tours run on every template that exposes your selectors."
      />

      <DocSection>
        <DocH2>Option A — Theme functions.php</DocH2>
        <DocP>Add this to your theme&apos;s <code className="text-primary">functions.php</code> (child theme recommended). Replace YOUR_SCRIPT_KEY with your TourKit script key.</DocP>
        <CodeBlock code={WP_FUNCTIONS_PHP} language="php" />
      </DocSection>

      <DocSection>
        <DocH2>Option B — Header / Footer plugin</DocH2>
        <DocP>
          Paste the script tag directly in your site footer using a header/footer injection plugin (for example &quot;Insert Headers and Footers&quot;).
        </DocP>
        <CodeBlock code={TOURKIT_SCRIPT_SNIPPET} />
      </DocSection>

      <DocSection>
        <DocH2>Typical approaches</DocH2>
        <DocOl>
          <DocLi>
            <strong className="text-foreground">Theme footer</strong> — edit <code className="text-primary">footer.php</code> if you control the theme.
          </DocLi>
          <DocLi>
            <strong className="text-foreground">Plugin</strong> — enqueue from <code className="text-primary">functions.php</code> as above.
          </DocLi>
        </DocOl>
      </DocSection>

      <DocCallout title="Caching plugins" variant="warning">
        Purge page cache after publishing tour changes so visitors receive fresh tour JSON from the API.
      </DocCallout>
    </article>
  )
}
