import type { City, Unit } from "../types"

export function unitSymbol(unit: Unit): string {
  return unit === "celsius" ? "°C" : "°F"
}

export function unitLabel(unit: Unit): string {
  return unit === "celsius" ? "°C (Celsius)" : "°F (Fahrenheit)"
}

export function cityLabel(city: City): string {
  const region = [city.admin1, city.country].filter(Boolean).join(", ")
  return region ? `${city.name} (${region})` : city.name
}

export function formatForecastDate(date: string): string {
  const parsed = new Date(`${date}T12:00:00`)
  if (Number.isNaN(parsed.getTime())) return date
  const weekday = new Intl.DateTimeFormat("es", { weekday: "short" }).format(parsed)
  const dayMonth = new Intl.DateTimeFormat("es", { day: "2-digit", month: "2-digit" }).format(parsed)
  return `${weekday} ${dayMonth}`
}
