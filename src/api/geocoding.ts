import type { City } from "../types"
import { GEOCODING_URL, GEOCODING_RESULT_COUNT } from "../utils/constants"
import { fetchJson } from "./http"

interface GeocodingResult {
  name: string
  latitude: number
  longitude: number
  admin1?: string
  country?: string
}

interface GeocodingResponse {
  results?: GeocodingResult[]
}

export async function geocodeCities(name: string): Promise<City[]> {
  const url = new URL(GEOCODING_URL)
  url.searchParams.set("name", name)
  url.searchParams.set("count", String(GEOCODING_RESULT_COUNT))
  url.searchParams.set("language", "es")
  url.searchParams.set("format", "json")

  const data = await fetchJson<GeocodingResponse>(url)
  if (!data?.results?.length) return []

  return data.results.map(
    (result): City => ({
      id: crypto.randomUUID(),
      name: result.name,
      latitude: result.latitude,
      longitude: result.longitude,
      admin1: result.admin1,
      country: result.country,
    }),
  )
}
