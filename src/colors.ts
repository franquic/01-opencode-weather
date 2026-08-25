const ANSI = {
  cyan: "\x1b[36m",
  yellow: "\x1b[33m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  reset: "\x1b[0m",
}

const enabled = process.env.NO_COLOR === undefined

function wrap(color: keyof typeof ANSI, text: string): string {
  if (!enabled) return text
  return `${ANSI[color]}${text}${ANSI.reset}`
}

export function cyan(text: string): string {
  return wrap("cyan", text)
}

export function yellow(text: string): string {
  return wrap("yellow", text)
}

export function green(text: string): string {
  return wrap("green", text)
}

export function red(text: string): string {
  return wrap("red", text)
}
