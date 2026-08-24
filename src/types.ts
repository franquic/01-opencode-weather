export interface City {
  id: string
  name: string
  latitude: number
  longitude: number
}

export interface WeatherData {
  city: string
  temperature: number
}

export interface AppSettings {
  defaultCityId: string | null
  cities: City[]
}
