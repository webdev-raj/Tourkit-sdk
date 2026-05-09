/**
 * POST analytics event — never throws on customer sites.
 * @param {string} apiBase
 * @param {string} scriptKey
 * @param {string} eventType
 * @param {number|null|undefined} stepOrder
 * @param {string} sessionId
 */
export function pingEvent(apiBase, scriptKey, eventType, stepOrder, sessionId) {
  try {
    if (!apiBase || !scriptKey || !eventType) return

    var body = JSON.stringify({
      script_key: String(scriptKey),
      event_type: String(eventType),
      step_order: stepOrder != null && stepOrder !== '' && Number.isFinite(Number(stepOrder)) ? Number(stepOrder) : null,
      session_id: sessionId ? String(sessionId) : '',
    })

    fetch(String(apiBase).replace(/\/+$/, '') + '/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      mode: 'cors',
      keepalive: true,
    }).catch(function () {})
  } catch (_) {
    /* silent */
  }
}
