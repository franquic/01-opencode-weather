import type { Unit } from "./City"

export interface WeatherData {
  city: string
  temperature: number
  unit: Unit
}

export interface ForecastDay {
  date: string
  tempMin: number
  tempMax: number
  weatherCode: number
}

export interface ForecastData {
  city: string
  unit: Unit
  days: ForecastDay[]
}
