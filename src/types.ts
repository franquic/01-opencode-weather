export interface City {
  id: string
  name: string
  latitude: number
  longitude: number
  admin1?: string
  country?: string
}

export type Unit = "celsius" | "fahrenheit"

export interface WeatherData {
  city: string
  temperature: number
  unit: Unit
}

export interface AppSettings {
  defaultCityId: string | null
  cities: City[]
  unit: Unit
}
