export interface City {
  id: string
  name: string
  latitude: number
  longitude: number
  admin1?: string
  country?: string
}

export type Unit = "celsius" | "fahrenheit"
