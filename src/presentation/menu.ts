import type { MenuOption, Unit } from "../types"
import { ask } from "./input"
import { error, renderMenu } from "./output"

const EXIT_OPTION_ID = "exit"

export async function startMenu(options: MenuOption[], getCurrentUnit: () => Unit): Promise<void> {
  while (true) {
    renderMenu(options, getCurrentUnit())
    const selection = await ask("  Selecciona una opción: ")
    const index = Number.parseInt(selection, 10)
    const option = Number.isNaN(index) ? undefined : options[index - 1]

    if (!option) {
      error("Opción no válida.")
      continue
    }

    await option.run()
    if (option.id === EXIT_OPTION_ID) return
  }
}
