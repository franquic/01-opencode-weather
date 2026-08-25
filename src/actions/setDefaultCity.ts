import { selectCity } from "../presentation/input"
import { error, ok } from "../presentation/output"
import { cityLabel } from "../utils/format"
import type { ActionDeps } from "./deps"

export async function runSetDefaultCity({ citiesStorage, settingsStorage }: ActionDeps): Promise<void> {
  const cities = citiesStorage.all
  if (!cities.length) return error("No hay ciudades registradas.")

  const city = await selectCity(cities)
  if (!city) return error("Selección no válida.")

  settingsStorage.setDefaultCity(city.id)
  ok(`${cityLabel(city)} establecida como ciudad default.`)
}
