import type { City, ForecastData, Unit, WeatherData } from "../types"
import { FORECAST_DAYS, FORECAST_URL } from "../utils/constants"
import { fetchJson } from "./http"

interface CurrentWeatherResponse {
  current?: { temperature_2m?: number }
}

interface DailyForecastResponse {
  daily?: {
    time?: string[]
    temperature_2m_max?: number[]
    temperature_2m_min?: number[]
    weather_code?: number[]
  }
}

export async function getWeather(city: City, unit: Unit = "celsius"): Promise<WeatherData | null> {
  const url = new URL(FORECAST_URL)
  url.searchParams.set("latitude", String(city.latitude))
  url.searchParams.set("longitude", String(city.longitude))
  url.searchParams.set("current", "temperature_2m")
  url.searchParams.set("temperature_unit", unit)

  const data = await fetchJson<CurrentWeatherResponse>(url)
  const temperature = data?.current?.temperature_2m
  if (temperature === undefined) return null

  return { city: city.name, temperature, unit }
}

export async function getForecast(
  city: City,
  unit: Unit = "celsius",
  days: number = FORECAST_DAYS,
): Promise<ForecastData | null> {
  const url = new URL(FORECAST_URL)
  url.searchParams.set("latitude", String(city.latitude))
  url.searchParams.set("longitude", String(city.longitude))
  url.searchParams.set("daily", "weather_code,temperature_2m_max,temperature_2m_min")
  url.searchParams.set("forecast_days", String(days))
  url.searchParams.set("timezone", "auto")
  url.searchParams.set("temperature_unit", unit)

  const data = await fetchJson<DailyForecastResponse>(url)

  const time = data?.daily?.time
  const maxTemps = data?.daily?.temperature_2m_max
  const minTemps = data?.daily?.temperature_2m_min
  const weatherCodes = data?.daily?.weather_code
  if (!time?.length || !maxTemps?.length || !minTemps?.length || !weatherCodes?.length) return null

  return {
    city: city.name,
    unit,
    days: time.map((date, index) => ({
      date,
      tempMax: maxTemps[index]!,
      tempMin: minTemps[index]!,
      weatherCode: weatherCodes[index]!,
    })),
  }
}
