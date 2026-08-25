import { selectCity } from "../presentation/input"
import { error, ok } from "../presentation/output"
import { cityLabel } from "../utils/format"
import type { ActionDeps } from "./deps"

export async function runRemoveCity({ citiesStorage, settingsStorage }: ActionDeps): Promise<void> {
  const cities = citiesStorage.all
  if (!cities.length) return error("No hay ciudades para eliminar.")

  const city = await selectCity(cities)
  if (!city) return error("Selección no válida.")

  citiesStorage.remove(city.id)
  if (settingsStorage.defaultCityId === city.id) {
    settingsStorage.setDefaultCity(citiesStorage.all[0]?.id ?? null)
  }
  ok(`${cityLabel(city)} eliminada.`)
}
