export function buildSessionKey(scriptKey, pathOrPattern) {
  try {
    var safePath = String(pathOrPattern == null || pathOrPattern === '' ? '/' : pathOrPattern)
      .replace(/^\//, '')
      .replace(/\//g, '-')
      .replace(/[^a-zA-Z0-9-_[\]]/g, '')
    if (!safePath) safePath = 'root'
    return 'tourkit_seen_' + scriptKey + '_' + safePath
  } catch (e) {
    return 'tourkit_seen_' + scriptKey + '_root'
  }
}

export function tourkitSeenPrefix(scriptKey) {
  return 'tourkit_seen_' + scriptKey + '_'
}
