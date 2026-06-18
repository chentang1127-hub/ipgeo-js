/**
 * IPGeo JavaScript SDK
 * IP geolocation API with built-in security detection.
 *
 * @example
 *   const client = new IPGeoClient("ipgeo_YOUR_API_KEY")
 *   const data = await client.lookup("8.8.8.8")
 *   console.log(data.location.country.name) // "United States"
 */

const DEFAULT_BASE_URL = "https://api.getipgeo.com"

class IPGeoClient {
  /**
   * @param {string} apiKey - Your IPGeo API key
   * @param {object} [options]
   * @param {string} [options.baseUrl] - API server URL
   * @param {number} [options.timeout] - Request timeout in ms (default 10000)
   * @param {typeof fetch} [options.fetch] - Custom fetch implementation
   */
  constructor(apiKey, options = {}) {
    this._apiKey = apiKey
    this._baseUrl = (options.baseUrl || DEFAULT_BASE_URL).replace(/\/$/, "")
    this._timeout = options.timeout || 10000
    this._fetch = options.fetch || globalThis.fetch
  }

  /**
   * Look up geolocation for an IP address.
   * @param {string} ip - IPv4/IPv6 address, or "me" for the caller's own IP
   * @param {string} [fields] - Comma-separated field groups, e.g. "location,security"
   * @returns {Promise<object>}
   */
  async lookup(ip, fields) {
    const url = new URL(`${this._baseUrl}/v1/ip/${ip}`)
    if (fields) url.searchParams.set("fields", fields)
    return this._request("GET", url)
  }

  /**
   * Look up the calling client's own IP address.
   * @returns {Promise<object>}
   */
  async me() {
    return this.lookup("me")
  }

  /**
   * Batch lookup — up to 100 IPs per request.
   * @param {string[]} ips
   * @returns {Promise<{results: object[]}>}
   */
  async batch(ips) {
    const url = `${this._baseUrl}/v1/ip/batch`
    return this._request("POST", url, { ips })
  }

  /**
   * Get current billing period usage.
   * @returns {Promise<{plan: string, monthly_quota: number, monthly_used: number, remaining_quota: number, prepaid_credits: number}>}
   */
  async usage() {
    const url = `${this._baseUrl}/v1/usage`
    return this._request("GET", url)
  }

  /**
   * Check API health. No authentication required.
   * @returns {Promise<{status: string, version: string, components: object}>}
   */
  async health() {
    const url = `${this._baseUrl}/v1/health`
    return this._request("GET", url)
  }

  // -- internal ----------------------------------------------------------

  async _request(method, url, body) {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), this._timeout)

    try {
      const resp = await this._fetch(url, {
        method,
        headers: {
          "X-API-Key": this._apiKey,
          "Accept": "application/json",
          "Content-Type": body ? "application/json" : undefined,
          "User-Agent": `ipgeo-js/0.1.0`,
        },
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      })

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}))
        throw new IPGeoError(
          err.detail || err.error || `HTTP ${resp.status}`,
          resp.status
        )
      }

      return resp.json()
    } finally {
      clearTimeout(timer)
    }
  }
}

class IPGeoError extends Error {
  constructor(message, status) {
    super(message)
    this.name = "IPGeoError"
    this.status = status
  }
}

// ESM + CJS dual export
export { IPGeoClient, IPGeoError }
if (typeof module !== "undefined") {
  module.exports = { IPGeoClient, IPGeoError }
}
