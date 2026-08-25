import type { City, ForecastData, MenuOption, Unit, WeatherData } from "../types"
import { cyan, green, red, yellow } from "../utils/colors"
import { cityLabel, formatForecastDate, unitSymbol } from "../utils/format"
import { BORDER } from "../utils/constants"
import { describeWeatherCode } from "../utils/wmo"

function resolveLabel(label: MenuOption["label"]): string {
  return typeof label === "function" ? label() : label
}

export function renderMenu(options: MenuOption[], unit: Unit): void {
  console.log("")
  console.log(cyan(`  ${BORDER}`))
  console.log(cyan("         WEATHER CLI"))
  console.log(cyan(`  ${BORDER}`))
  options.forEach((option, index) => {
    console.log(cyan(`    ${index + 1}. ${resolveLabel(option.label)}`))
  })
  console.log(cyan(`  ${BORDER}`))
}

export function renderWeather(data: WeatherData): void {
  console.log(`\n  ${data.city}: ${yellow(`${data.temperature}${unitSymbol(data.unit)}`)}\n`)
}

export function renderForecast(data: ForecastData): void {
  console.log(`\n  ${data.city} — próximos ${data.days.length} días:`)
  for (const day of data.days) {
    const date = formatForecastDate(day.date).padEnd(14)
    const symbol = unitSymbol(data.unit)
    const temps = `${cyan(`${day.tempMin}${symbol}`)} .. ${yellow(`${day.tempMax}${symbol}`)}`
    console.log(`    ${date} ${temps}  ${describeWeatherCode(day.weatherCode)}`)
  }
  console.log("")
}

export function renderCityList(cities: City[], defaultCityId: string | null): void {
  if (!cities.length) {
    info("No hay ciudades registradas.")
    return
  }
  console.log("")
  cities.forEach((city, index) => {
    const marker = city.id === defaultCityId ? " (default)" : ""
    console.log(`  ${index + 1}. ${cityLabel(city)}${marker}`)
  })
  console.log("")
}

export function info(msg: string): void {
  console.log(`\n  ${msg}\n`)
}

export function ok(msg: string): void {
  info(green(msg))
}

export function error(msg: string): void {
  info(red(msg))
}
