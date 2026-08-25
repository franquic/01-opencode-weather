import type { CitiesStorage } from "../storage/citiesStorage"
import type { SettingsStorage } from "../storage/settingsStorage"

export interface ActionDeps {
  citiesStorage: CitiesStorage
  settingsStorage: SettingsStorage
}
