import type { Unit } from "../types"
import { ask } from "../presentation/input"
import { error, ok } from "../presentation/output"
import { unitLabel } from "../utils/format"
import type { ActionDeps } from "./deps"

const UNIT_BY_OPTION: Record<string, Unit> = {
  "1": "celsius",
  "2": "fahrenheit",
}

export async function runSettings({ settingsStorage }: ActionDeps): Promise<void> {
  console.log(`\n  Unidad actual: ${unitLabel(settingsStorage.unit)}`)
  console.log("  1. Celsius (°C)")
  console.log("  2. Fahrenheit (°F)")

  const option = await ask("  Selecciona una unidad: ")
  const unit = UNIT_BY_OPTION[option]
  if (!unit) return error("Opción no válida.")

  settingsStorage.setUnit(unit)
  ok(`Unidad establecida en ${unitLabel(unit)}.`)
}
