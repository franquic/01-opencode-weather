import { runAddCity } from "./actions/addCity"
import { runForecast } from "./actions/getForecast"
import { runAllCitiesWeather, runDefaultCityWeather } from "./actions/getWeather"
import { runListCities } from "./actions/listCities"
import { runRemoveCity } from "./actions/removeCity"
import { runSettings } from "./actions/settings"
import { runSetDefaultCity } from "./actions/setDefaultCity"
import type { ActionDeps } from "./actions/deps"
import { startMenu } from "./presentation/menu"
import { ok } from "./presentation/output"
import { CitiesStorage } from "./storage/citiesStorage"
import { migrateLegacyStore } from "./storage/migration"
import { SettingsStorage } from "./storage/settingsStorage"
import { unitSymbol } from "./utils/format"
import type { MenuOption } from "./types"

function buildMenuOptions(deps: ActionDeps): MenuOption[] {
  return [
    { id: "default-weather", label: "Clima de ciudad default", run: () => runDefaultCityWeather(deps) },
    { id: "all-weather", label: "Clima de todas las ciudades", run: () => runAllCitiesWeather(deps) },
    { id: "add-city", label: "Buscar y agregar ciudad", run: () => runAddCity(deps) },
    { id: "remove-city", label: "Eliminar ciudad", run: () => runRemoveCity(deps) },
    { id: "set-default-city", label: "Establecer ciudad default", run: () => runSetDefaultCity(deps) },
    { id: "forecast", label: "Predicción 7 días", run: () => runForecast(deps) },
    { id: "list-cities", label: "Listar ciudades", run: () => runListCities(deps) },
    { id: "settings", label: () => `Ajustes (${unitSymbol(deps.settingsStorage.unit)})`, run: () => runSettings(deps) },
    { id: "exit", label: "Salir", run: async () => ok("¡Hasta luego!") },
  ]
}

async function main(): Promise<void> {
  migrateLegacyStore()

  const deps: ActionDeps = {
    citiesStorage: new CitiesStorage(),
    settingsStorage: new SettingsStorage(),
  }

  await startMenu(buildMenuOptions(deps), () => deps.settingsStorage.unit)
}

await main()
