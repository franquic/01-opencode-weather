import { getForecast } from "../api/weather"
import { error, info, renderForecast } from "../presentation/output"
import { FORECAST_DAYS } from "../utils/constants"
import type { ActionDeps } from "./deps"

export async function runForecast({ citiesStorage, settingsStorage }: ActionDeps): Promise<void> {
  const cities = citiesStorage.all
  if (!cities.length) return info("No hay ciudades registradas.")

  for (const city of cities) {
    const forecast = await getForecast(city, settingsStorage.unit, FORECAST_DAYS)
    if (forecast) {
      renderForecast(forecast)
    } else {
      error(`No se pudo obtener la predicción de ${city.name}.`)
    }
  }
}
