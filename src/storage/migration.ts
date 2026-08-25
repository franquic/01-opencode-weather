import type { AppSettings, City } from "../types"
import { CITIES_FILE, SETTINGS_FILE } from "../utils/constants"
import { readJsonFile, writeJsonFile } from "./jsonFile"

interface LegacyStore {
  defaultCityId?: string | null
  cities?: City[]
  unit?: AppSettings["unit"]
}

function isLegacyStore(data: unknown): data is LegacyStore {
  return typeof data === "object" && data !== null && "cities" in data
}

/**
 * Migra el formato antiguo (cities.json con ciudades + settings mezclados)
 * al formato nuevo (cities.json = array, settings.json = preferencias).
 * No hace nada si ya está migrado o no existe el archivo.
 */
export function migrateLegacyStore(cwd: string = process.cwd()): void {
  const citiesPath = `${cwd}/${CITIES_FILE}`
  const settingsPath = `${cwd}/${SETTINGS_FILE}`

  const data = readJsonFile<unknown>(citiesPath)
  if (!isLegacyStore(data)) return

  const cities = data.cities ?? []
  const settings: AppSettings = {
    defaultCityId: data.defaultCityId ?? cities[0]?.id ?? null,
    unit: data.unit ?? "celsius",
  }

  writeJsonFile(citiesPath, cities)
  writeJsonFile(settingsPath, settings)
}
