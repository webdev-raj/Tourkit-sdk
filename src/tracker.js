import { TK_API_ORIGIN } from './config.js'

/**
 * POST analytics event — never throws on customer sites.
 * @param {string} scriptKey
 * @param {string} eventType
 * @param {number|null|undefined} stepOrder
 */
export function pingEvent(scriptKey, eventType, stepOrder) {
  try {
    if (!scriptKey || !eventType) return

    var body = JSON.stringify({
      script_key: String(scriptKey),
      event_type: String(eventType),
      step_order: stepOrder != null && stepOrder !== '' && Number.isFinite(Number(stepOrder)) ? Number(stepOrder) : null,
    })

    fetch(TK_API_ORIGIN + '/api/analytics', {
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
