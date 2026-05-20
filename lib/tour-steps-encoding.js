/**
 * Encode/decode generated tour steps for URL query params (UTF-8 safe).
 */

export function encodeStepsForUrl(steps) {
  const json = JSON.stringify(steps)
  if (typeof window !== 'undefined') {
    return encodeURIComponent(btoa(unescape(encodeURIComponent(json))))
  }
  return encodeURIComponent(Buffer.from(json, 'utf8').toString('base64'))
}

export function decodeStepsFromUrl(encoded) {
  if (!encoded) return []
  const base64 = decodeURIComponent(String(encoded))
  const json =
    typeof window !== 'undefined'
      ? decodeURIComponent(escape(atob(base64)))
      : Buffer.from(base64, 'base64').toString('utf8')
  const parsed = JSON.parse(json)
  return Array.isArray(parsed) ? parsed : []
}
