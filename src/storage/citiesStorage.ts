import type { City } from "../types"
import { CITIES_FILE } from "../utils/constants"
import { readJsonFile, writeJsonFile } from "./jsonFile"

export class CitiesStorage {
  private readonly path: string
  private cities: City[]

  constructor(cwd: string = process.cwd()) {
    this.path = `${cwd}/${CITIES_FILE}`
    this.cities = readJsonFile<City[]>(this.path) ?? []
  }

  get all(): City[] {
    return this.cities
  }

  getById(id: string): City | null {
    return this.cities.find((city) => city.id === id) ?? null
  }

  add(city: City): void {
    this.cities.push(city)
    this.flush()
  }

  remove(id: string): void {
    this.cities = this.cities.filter((city) => city.id !== id)
    this.flush()
  }

  private flush(): void {
    writeJsonFile(this.path, this.cities)
  }
}
