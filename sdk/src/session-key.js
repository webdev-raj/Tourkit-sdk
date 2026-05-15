export function buildSessionKey(scriptKey, path) {
  try {
    const safePath = (path || '/')
      .replace(/^\//, '')
      .replace(/\//g, '-')
      .replace(/[^a-zA-Z0-9-_]/g, '') || 'root'
    return 'tourkit_seen_' + scriptKey + '_' + safePath
  } catch (e) {
    return 'tourkit_seen_' + scriptKey + '_root'
  }
}

export function tourkitSeenPrefix(scriptKey) {
  return 'tourkit_seen_' + scriptKey + '_'
}
