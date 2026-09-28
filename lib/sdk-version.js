export const LATEST_SDK_VERSION = 'v3.1.0-sdk'

export const SDK_CHANGELOG = {
  'v3.1.0-sdk': {
    date: '2026-09-28',
    changes: [
      'Announcements: modal, banner, and slide-in',
      'window.TourKit.identify() for logged-in / plan audiences',
      'Audience targeting (new, returning, logged-in)',
      'URL targeting with the same pattern matcher as tours',
    ],
  },
  'v3.0.0-sdk': {
    date: '2026-07-27',
    changes: [
      'Context-aware URL triggers',
      'Mobile bottom sheet design',
      'Dynamic URL matching /products/[id]',
      'window.TourKit global API',
      'Dark and light theme support',
    ],
  },
}

export const SDK_CDN_URL = 'https://cdn.jsdelivr.net/gh/webdev-raj/tourkit-sdk'

export function getSnippet(scriptKey, version) {
  return `<script
  src="${SDK_CDN_URL}@${version}/dist/tourkit.min.js"
  data-key="${scriptKey}"
  data-api="${process.env.NEXT_PUBLIC_APP_URL}"
  async>
</script>`
}
