import type { AppSettings, City } from "./types"

const STORAGE_PATH = `${process.cwd()}/cities.json`

const DEFAULT_SETTINGS: AppSettings = {
  defaultCityId: null,
  cities: [],
}

export class Store {
  private settings: AppSettings

  constructor() {
    this.settings = this.load()
  }

  private load(): AppSettings {
    try {
      const file = Bun.file(STORAGE_PATH)
      return JSON.parse(file.textSync()) as AppSettings
    } catch {
      this.save(DEFAULT_SETTINGS)
      return structuredClone(DEFAULT_SETTINGS)
    }
  }

  private save(settings: AppSettings): void {
    Bun.write(STORAGE_PATH, JSON.stringify(settings, null, 2))
  }

  flush(): void {
    this.save(this.settings)
  }

  get cities(): City[] {
    return this.settings.cities
  }

  get defaultCityId(): string | null {
    return this.settings.defaultCityId
  }

  addCity(name: string, latitude: number, longitude: number, id: string): void {
    this.settings.cities.push({ id, name, latitude, longitude })
    if (!this.settings.defaultCityId) {
      this.settings.defaultCityId = id
    }
    this.save(this.settings)
  }

  removeCity(id: string): void {
    this.settings.cities = this.settings.cities.filter((c) => c.id !== id)
    if (this.settings.defaultCityId === id) {
      this.settings.defaultCityId = this.settings.cities[0]?.id ?? null
    }
    this.save(this.settings)
  }

  setDefaultCity(id: string): void {
    this.settings.defaultCityId = id
    this.save(this.settings)
  }

  getDefaultCity(): City | null {
    if (!this.settings.defaultCityId) return null
    return this.settings.cities.find((c) => c.id === this.settings.defaultCityId) ?? null
  }
}
