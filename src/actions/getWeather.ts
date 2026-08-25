import { getWeather } from "../api/weather"
import { error, info, renderWeather } from "../presentation/output"
import type { ActionDeps } from "./deps"

export async function runDefaultCityWeather({ citiesStorage, settingsStorage }: ActionDeps): Promise<void> {
  const city = citiesStorage.getById(settingsStorage.defaultCityId ?? "")
  if (!city) return error("No hay ciudad default configurada.")

  const weather = await getWeather(city, settingsStorage.unit)
  if (!weather) return error("No se pudo obtener el clima.")

  renderWeather(weather)
}

export async function runAllCitiesWeather({ citiesStorage, settingsStorage }: ActionDeps): Promise<void> {
  const cities = citiesStorage.all
  if (!cities.length) return info("No hay ciudades registradas.")

  for (const city of cities) {
    const weather = await getWeather(city, settingsStorage.unit)
    if (weather) {
      renderWeather(weather)
    } else {
      error(`No se pudo obtener el clima de ${city.name}.`)
    }
  }
}
