export interface MenuOption {
  id: string
  label: string | (() => string)
  run: () => Promise<void>
}
