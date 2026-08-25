import * as readline from "readline"
import type { City } from "../types"
import { renderCityList } from "./output"

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
})

const lineQueue: string[] = []
let lineResolver: ((value: string) => void) | null = null

rl.on("line", (line: string) => {
  if (lineResolver) {
    lineResolver(line.trim())
    lineResolver = null
  } else {
    lineQueue.push(line.trim())
  }
})

export function ask(prompt: string): Promise<string> {
  process.stdout.write(prompt)
  if (lineQueue.length > 0) return Promise.resolve(lineQueue.shift()!)
  return new Promise((resolve) => {
    lineResolver = resolve
  })
}

export async function askNumberInRange(prompt: string, max: number): Promise<number | null> {
  const input = await ask(prompt)
  const value = Number.parseInt(input, 10)
  if (Number.isNaN(value) || value < 1 || value > max) return null
  return value
}

export async function selectCity(cities: City[]): Promise<City | null> {
  renderCityList(cities, null)
  const index = await askNumberInRange("  Selecciona una ciudad (número): ", cities.length)
  return index === null ? null : (cities[index - 1] ?? null)
}
