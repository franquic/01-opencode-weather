import type { City, WeatherData } from "./types"

const GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search"
const FORECAST_URL = "https://api.open-meteo.com/v1/forecast"

export async function geocodeCity(name: string): Promise<City | null> {
  const url = new URL(GEOCODING_URL)
  url.searchParams.set("name", name)
  url.searchParams.set("count", "1")
  url.searchParams.set("language", "es")
  url.searchParams.set("format", "json")

  const res = await fetch(url.toString())
  if (!res.ok) return null

  const data = await res.json()
  if (!data.results?.length) return null

  const result = data.results[0]
  return {
    id: crypto.randomUUID(),
    name: result.name,
    latitude: result.latitude,
    longitude: result.longitude,
  }
}

export async function getWeather(city: City): Promise<WeatherData | null> {
  const url = new URL(FORECAST_URL)
  url.searchParams.set("latitude", String(city.latitude))
  url.searchParams.set("longitude", String(city.longitude))
  url.searchParams.set("current", "temperature_2m")

  const res = await fetch(url.toString())
  if (!res.ok) return null

  const data = await res.json()
  if (!data.current?.temperature_2m) return null

  return {
    city: city.name,
    temperature: data.current.temperature_2m,
  }
}
