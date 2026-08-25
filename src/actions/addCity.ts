import { geocodeCities } from "../api/geocoding"
import { ask, selectCity } from "../presentation/input"
import { error, info, ok } from "../presentation/output"
import { cityLabel } from "../utils/format"
import type { ActionDeps } from "./deps"

export async function runAddCity({ citiesStorage, settingsStorage }: ActionDeps): Promise<void> {
  const name = await ask("  Nombre de la ciudad: ")
  const results = await geocodeCities(name)
  if (!results.length) return error("Ciudad no encontrada.")

  let city = results[0] ?? null
  if (results.length > 1) {
    info(`Se encontraron ${results.length} resultados:`)
    city = await selectCity(results)
  }
  if (!city) return error("Selección no válida.")

  citiesStorage.add(city)
  if (!settingsStorage.defaultCityId) {
    settingsStorage.setDefaultCity(city.id)
  }
  ok(`${cityLabel(city)} agregada correctamente.`)
}
