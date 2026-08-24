import * as readline from "readline"
import type { City, WeatherData } from "./types"
import { Store } from "./store"
import { geocodeCity, getWeather } from "./api"

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

function renderHeader() {
  console.log("")
  console.log(`  ${BORDER}`)
  console.log("         WEATHER CLI")
  console.log(`  ${BORDER}`)
  console.log("    1. Clima de ciudad default")
  console.log("    2. Clima de todas las ciudades")
  console.log("    3. Buscar y agregar ciudad")
  console.log("    4. Eliminar ciudad")
  console.log("    5. Establecer ciudad default")
  console.log("    8. Ajustes (°C)")
  console.log("    9. Salir")
  console.log(`  ${BORDER}`)
}

function renderWeather(data: WeatherData) {
  console.log(`\n  ${data.city}: ${data.temperature}°C\n`)
}

function renderCityList(cities: City[], defaultCityId: string | null) {
  if (!cities.length) {
    console.log("\n  No hay ciudades registradas.\n")
    return
  }
  console.log("")
  for (const city of cities) {
    const marker = city.id === defaultCityId ? " (default)" : ""
    console.log(`  - ${city.name}${marker}`)
  }
  console.log("")
}

function info(msg: string) {
  console.log(`\n  ${msg}\n`)
}

async function handleDefaultWeather(store: Store) {
  const city = store.getDefaultCity()
  if (!city) return info("No hay ciudad default configurada.")
  const weather = await getWeather(city)
  if (!weather) return info("No se pudo obtener el clima.")
  renderWeather(weather)
}

async function handleAllWeather(store: Store) {
  const cities = store.cities
  if (!cities.length) return info("No hay ciudades registradas.")
  for (const city of cities) {
    const weather = await getWeather(city)
    if (weather) {
      renderWeather(weather)
    } else {
      info(`No se pudo obtener el clima de ${city.name}.`)
    }
  }
}

async function handleAddCity(store: Store) {
  const name = await ask("  Nombre de la ciudad: ")
  const city = await geocodeCity(name)
  if (!city) return info("Ciudad no encontrada.")
  store.addCity(city.name, city.latitude, city.longitude, city.id)
  info(`${city.name} agregada correctamente.`)
}

async function handleRemoveCity(store: Store) {
  const cities = store.cities
  if (!cities.length) return info("No hay ciudades para eliminar.")
  renderCityList(cities, store.defaultCityId)
  const name = await ask("  Nombre de la ciudad a eliminar: ")
  const city = cities.find((c) => c.name.toLowerCase() === name.toLowerCase())
  if (!city) return info("Ciudad no encontrada.")
  store.removeCity(city.id)
  info(`${city.name} eliminada.`)
}

async function handleSetDefault(store: Store) {
  const cities = store.cities
  if (!cities.length) return info("No hay ciudades registradas.")
  renderCityList(cities, store.defaultCityId)
  const name = await ask("  Nombre de la ciudad default: ")
  const city = cities.find((c) => c.name.toLowerCase() === name.toLowerCase())
  if (!city) return info("Ciudad no encontrada.")
  store.setDefaultCity(city.id)
  info(`${city.name} establecida como ciudad default.`)
}

function handleSettings() {
  info("Unidad actual: °C (Celsius)")
}

export async function startMenu(store: Store) {
  while (true) {
    renderHeader()
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
        handleSettings()
        break
      case "9":
        info("¡Hasta luego!")
        return
      default:
        info("Opción no válida.")
    }
  }
}
