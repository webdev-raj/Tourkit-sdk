import { DocsShell } from '@/components/docs/docs-shell'

export const metadata = {
  title: {
    default: 'Documentation — TourKit',
    template: '%s — TourKit Docs',
  },
  description: 'Learn how to install TourKit, configure tours, customize your tooltip, and read analytics.',
}

export default function DocsLayout({ children }) {
  return <DocsShell>{children}</DocsShell>
}
