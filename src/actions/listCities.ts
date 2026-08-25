import { renderCityList } from "../presentation/output"
import type { ActionDeps } from "./deps"

export async function runListCities({ citiesStorage, settingsStorage }: ActionDeps): Promise<void> {
  renderCityList(citiesStorage.all, settingsStorage.defaultCityId)
}
