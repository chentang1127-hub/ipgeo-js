declare module "ipgeo-api" {
  interface IPGeoClientOptions {
    baseUrl?: string
    timeout?: number
    fetch?: typeof fetch
  }

  interface Location {
    country?: { code: string; name: string }
    continent?: { code: string; name: string }
    city?: string | null
    region?: string | null
    postal_code?: string | null
    latitude?: number
    longitude?: number
    accuracy_km?: number
    timezone?: string
  }

  interface Network {
    isp?: string | null
    asn?: number | null
    type?: "hosting" | null
  }

  interface Security {
    is_tor: boolean
    is_vpn: boolean
    is_proxy: boolean
    is_hosting: boolean
  }

  interface Meta {
    data_source: "GeoIP2" | "GeoLite2"
    upgrade?: { risk_scoring: string; learn_more: string }
  }

  interface IpLookupResponse {
    ip: string
    location: Location
    network: Network
    security: Security
    meta: Meta
  }

  interface BatchResponse {
    results: IpLookupResponse[]
  }

  interface UsageResponse {
    plan: string
    monthly_quota: number
    monthly_used: number
    remaining_quota: number
    prepaid_credits: number
  }

  class IPGeoError extends Error {
    status: number
  }

  class IPGeoClient {
    constructor(apiKey: string, options?: IPGeoClientOptions)
    lookup(ip: string, fields?: string): Promise<IpLookupResponse>
    me(): Promise<IpLookupResponse>
    batch(ips: string[]): Promise<BatchResponse>
    usage(): Promise<UsageResponse>
    health(): Promise<{ status: string; version: string; components: Record<string, unknown> }>
  }

  export { IPGeoClient, IPGeoError }
}
