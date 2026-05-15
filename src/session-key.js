export function buildSessionKey(scriptKey, path) {
  try {
    var safePath = String(path == null || path === '' ? '/' : path)
      .replace(/^\//, '')
      .replace(/\//g, '-')
      .replace(/[^a-zA-Z0-9-_]/g, '')
    if (!safePath) safePath = 'root'
    var result = 'tourkit_seen_' + scriptKey + '_' + safePath
    try {
      console.log('Building key for path:', path, '→', result)
    } catch (_) {}
    return result
  } catch (e) {
    var fallback = 'tourkit_seen_' + scriptKey + '_root'
    try {
      console.log('Building key for path:', path, '→', fallback, '(fallback)')
    } catch (_) {}
    return fallback
  }
}

export function tourkitSeenPrefix(scriptKey) {
  return 'tourkit_seen_' + scriptKey + '_'
}
