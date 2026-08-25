import * as readline from "readline"
import type { City, Unit, WeatherData } from "./types"
import { Store } from "./store"
import { geocodeCities, getWeather } from "./api"
import { cyan, yellow, green, red } from "./colors"

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
})

const lineQueue: string[] = []
let lineResolver: ((value: string) => void) | null = null

rl.on("line", (line: string) => {
  if (lineResolver) {
    lineResolver(line.trim())
    lineResolver = null
  } else {
    lineQueue.push(line.trim())
  }
})

async function ask(prompt: string): Promise<string> {
  process.stdout.write(prompt)
  if (lineQueue.length > 0) return lineQueue.shift()!
  return new Promise((resolve) => {
    lineResolver = resolve
  })
}

const BORDER = "═".repeat(38)

function renderHeader(unit: Unit) {
  console.log("")
  console.log(cyan(`  ${BORDER}`))
  console.log(cyan("         WEATHER CLI"))
  console.log(cyan(`  ${BORDER}`))
  console.log(cyan("    1. Clima de ciudad default"))
  console.log(cyan("    2. Clima de todas las ciudades"))
  console.log(cyan("    3. Buscar y agregar ciudad"))
  console.log(cyan("    4. Eliminar ciudad"))
  console.log(cyan("    5. Establecer ciudad default"))
  console.log(cyan(`    8. Ajustes (${unitSymbol(unit)})`))
  console.log(cyan("    9. Salir"))
  console.log(cyan(`  ${BORDER}`))
}

function unitSymbol(unit: Unit): string {
  return unit === "celsius" ? "°C" : "°F"
}

function renderWeather(data: WeatherData) {
  console.log(`\n  ${data.city}: ${yellow(`${data.temperature}${unitSymbol(data.unit)}`)}\n`)
}

function cityLabel(city: City): string {
  const region = [city.admin1, city.country].filter(Boolean).join(", ")
  return region ? `${city.name} (${region})` : city.name
}

function renderCityList(cities: City[], defaultCityId: string | null) {
  if (!cities.length) {
    console.log("\n  No hay ciudades registradas.\n")
    return
  }
  console.log("")
  cities.forEach((city, index) => {
    const marker = city.id === defaultCityId ? " (default)" : ""
    console.log(`  ${index + 1}. ${cityLabel(city)}${marker}`)
  })
  console.log("")
}

async function selectCity(cities: City[]): Promise<City | null> {
  renderCityList(cities, null)
  const input = await ask("  Selecciona una ciudad (número): ")
  const index = Number.parseInt(input, 10)
  if (Number.isNaN(index) || index < 1 || index > cities.length) return null
  return cities[index - 1] ?? null
}

function info(msg: string) {
  console.log(`\n  ${msg}\n`)
}

function ok(msg: string) {
  info(green(msg))
}

function error(msg: string) {
  info(red(msg))
}

async function handleDefaultWeather(store: Store) {
  const city = store.getDefaultCity()
  if (!city) return error("No hay ciudad default configurada.")
  const weather = await getWeather(city, store.unit)
  if (!weather) return error("No se pudo obtener el clima.")
  renderWeather(weather)
}

async function handleAllWeather(store: Store) {
  const cities = store.cities
  if (!cities.length) return info("No hay ciudades registradas.")
  for (const city of cities) {
    const weather = await getWeather(city, store.unit)
    if (weather) {
      renderWeather(weather)
    } else {
      error(`No se pudo obtener el clima de ${city.name}.`)
    }
  }
}

async function handleAddCity(store: Store) {
  const name = await ask("  Nombre de la ciudad: ")
  const results = await geocodeCities(name)
  if (!results.length) return error("Ciudad no encontrada.")

  let city: City | null
  if (results.length === 1) {
    city = results[0] ?? null
  } else {
    console.log(`\n  Se encontraron ${results.length} resultados:`)
    city = await selectCity(results)
  }
  if (!city) return error("Selección no válida.")

  store.addCity(city)
  ok(`${cityLabel(city)} agregada correctamente.`)
}

async function handleRemoveCity(store: Store) {
  const cities = store.cities
  if (!cities.length) return error("No hay ciudades para eliminar.")
  const city = await selectCity(cities)
  if (!city) return error("Selección no válida.")
  store.removeCity(city.id)
  ok(`${cityLabel(city)} eliminada.`)
}

async function handleSetDefault(store: Store) {
  const cities = store.cities
  if (!cities.length) return error("No hay ciudades registradas.")
  const city = await selectCity(cities)
  if (!city) return error("Selección no válida.")
  store.setDefaultCity(city.id)
  ok(`${cityLabel(city)} establecida como ciudad default.`)
}

async function handleSettings(store: Store) {
  const current = store.unit === "celsius" ? "°C (Celsius)" : "°F (Fahrenheit)"
  console.log(`\n  Unidad actual: ${current}`)
  console.log("  1. Celsius (°C)")
  console.log("  2. Fahrenheit (°F)")
  const option = await ask("  Selecciona una unidad: ")
  const unit = option === "1" ? "celsius" : option === "2" ? "fahrenheit" : null
  if (!unit) return error("Opción no válida.")
  store.setUnit(unit)
  ok(`Unidad establecida en ${unit === "celsius" ? "°C (Celsius)" : "°F (Fahrenheit)"}.`)
}

export async function startMenu(store: Store) {
  while (true) {
    renderHeader(store.unit)
    const option = await ask("  Selecciona una opción: ")

    switch (option) {
      case "1":
        await handleDefaultWeather(store)
        break
      case "2":
        await handleAllWeather(store)
        break
      case "3":
        await handleAddCity(store)
        break
      case "4":
        await handleRemoveCity(store)
        break
      case "5":
        await handleSetDefault(store)
        break
      case "8":
        await handleSettings(store)
        break
      case "9":
        ok("¡Hasta luego!")
        return
      default:
        error("Opción no válida.")
    }
  }
}
