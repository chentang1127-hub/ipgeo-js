# IPGeo JavaScript SDK

[![npm](https://img.shields.io/badge/npm-ipgeo-blue)](https://www.npmjs.com/package/ipgeo)
[![Node.js](https://img.shields.io/badge/node-%3E%3D16-green)](https://nodejs.org/)

IP geolocation API client with built-in security detection — VPN, proxy, Tor, and hosting flags included on **every plan**, including free.

## Install

```bash
npm install ipgeo
```

## Quick Start

```js
import { IPGeoClient } from "ipgeo"

const client = new IPGeoClient("ipgeo_YOUR_API_KEY")

// Look up an IP
const data = await client.lookup("8.8.8.8")
console.log(data.location.country.name)  // "United States"
console.log(data.security.is_hosting)    // true

// Look up your own IP
const me = await client.me()
console.log(me.ip)

// Batch lookup (up to 100 IPs)
const result = await client.batch(["8.8.8.8", "1.1.1.1", "8.8.4.4"])
for (const r of result.results) {
  console.log(r.ip, r.location.country.code)
}

// Field filtering — only get what you need
const filtered = await client.lookup("8.8.8.8", "country,security")

// Check usage
const usage = await client.usage()
console.log(`${usage.remaining_quota}/${usage.monthly_quota} remaining`)
```

### CommonJS

```js
const { IPGeoClient } = require("ipgeo")
```

### Browser

```html
<script type="module">
  import { IPGeoClient } from "https://esm.sh/ipgeo"
  const client = new IPGeoClient("ipgeo_YOUR_API_KEY")
</script>
```

## Response Structure

```json
{
  "ip": "8.8.8.8",
  "location": {
    "country": {"code": "US", "name": "United States"},
    "city": "Mountain View",
    "latitude": 37.4223,
    "longitude": -122.0842,
    "timezone": "America/Los_Angeles"
  },
  "network": {
    "isp": "Google LLC",
    "asn": 15169,
    "type": "hosting"
  },
  "security": {
    "is_tor": false,
    "is_vpn": false,
    "is_proxy": false,
    "is_hosting": true
  },
  "meta": {
    "data_source": "GeoLite2"
  }
}
```

## API Reference

### `new IPGeoClient(apiKey, options?)`

| Option | Default | Description |
|--------|---------|-------------|
| `baseUrl` | `https://api.getipgeo.com` | API server URL |
| `timeout` | `10000` | Request timeout in ms |
| `fetch` | `globalThis.fetch` | Custom fetch for Node 16 |

### Methods

| Method | Returns | Description |
|--------|---------|-------------|
| `lookup(ip, fields?)` | `IpLookupResponse` | Look up a single IP |
| `me()` | `IpLookupResponse` | Look up the caller's IP |
| `batch(ips)` | `{ results: IpLookupResponse[] }` | Batch lookup (max 100) |
| `usage()` | `UsageResponse` | Monthly quota usage |
| `health()` | `HealthResponse` | API health (no auth) |

## Plans

| Plan | Monthly Quota | Rate Limit |
|------|---------------|------------|
| Free | 10,000 | 60/min |
| Starter | 100,000 | 600/min |
| Pro | 500,000 | 3,000/min |
| Business | 1,000,000 | 10,000/min |

[See all plans →](https://getipgeo.com/pricing)

## License

MIT · [IPGeo](https://getipgeo.com)
