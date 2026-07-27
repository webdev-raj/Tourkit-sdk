export const LATEST_SDK_VERSION = 'v1.0.0'

export const SDK_CHANGELOG = {
  'v1.0.0': {
    date: '2026-06-01',
    changes: [
      'Initial public release',
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
