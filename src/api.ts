import type { City, Unit, WeatherData } from "./types"

const GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search"
const FORECAST_URL = "https://api.open-meteo.com/v1/forecast"

export async function geocodeCities(name: string): Promise<City[]> {
  const url = new URL(GEOCODING_URL)
  url.searchParams.set("name", name)
  url.searchParams.set("count", "5")
  url.searchParams.set("language", "es")
  url.searchParams.set("format", "json")

  const res = await fetch(url.toString())
  if (!res.ok) return []

  const data = (await res.json()) as {
    results?: { name: string; latitude: number; longitude: number; admin1?: string; country?: string }[]
  }
  if (!data.results?.length) return []

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

export async function getWeather(city: City, unit: Unit = "celsius"): Promise<WeatherData | null> {
  const url = new URL(FORECAST_URL)
  url.searchParams.set("latitude", String(city.latitude))
  url.searchParams.set("longitude", String(city.longitude))
  url.searchParams.set("current", "temperature_2m")
  url.searchParams.set("temperature_unit", unit)

  const res = await fetch(url.toString())
  if (!res.ok) return null

  const data = (await res.json()) as { current?: { temperature_2m?: number } }
  if (data.current?.temperature_2m === undefined) return null

  return {
    city: city.name,
    temperature: data.current.temperature_2m,
    unit,
  }
}
