export function matchesPattern(pattern, path) {
  try {
    if (!pattern || !path) return false

    var patternStr = String(pattern).trim()
    var pathStr = String(path).trim()

    if (patternStr.endsWith('/*')) {
      var base = patternStr.slice(0, -2)
      return pathStr.startsWith(base + '/')
    }

    var segments = patternStr.split('/')
    var pathSegments = pathStr.split('/')

    if (segments.length !== pathSegments.length) {
      return false
    }

    return segments.every(function (seg, i) {
      if (seg.startsWith('[') && seg.endsWith(']')) {
        return pathSegments[i] && pathSegments[i].length > 0
      }
      return seg === pathSegments[i]
    })
  } catch (e) {
    return false
  }
}