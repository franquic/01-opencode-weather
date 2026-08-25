import type { AppSettings } from "../types"
import { SETTINGS_FILE } from "../utils/constants"
import { readJsonFile, writeJsonFile } from "./jsonFile"

const DEFAULT_SETTINGS: AppSettings = {
  defaultCityId: null,
  unit: "celsius",
}

export class SettingsStorage {
  private readonly path: string
  private settings: AppSettings

  constructor(cwd: string = process.cwd()) {
    this.path = `${cwd}/${SETTINGS_FILE}`
    this.settings = { ...DEFAULT_SETTINGS, ...readJsonFile<Partial<AppSettings>>(this.path) }
  }

  get unit(): AppSettings["unit"] {
    return this.settings.unit
  }

  get defaultCityId(): string | null {
    return this.settings.defaultCityId
  }

  setUnit(unit: AppSettings["unit"]): void {
    this.settings.unit = unit
    this.flush()
  }

  setDefaultCity(id: string | null): void {
    this.settings.defaultCityId = id
    this.flush()
  }

  private flush(): void {
    writeJsonFile(this.path, this.settings)
  }
}
