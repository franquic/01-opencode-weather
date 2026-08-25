# AGENTS.md

## Runtime & Package Manager
- **Use Bun, not Node.js.** Run with `bun index.ts`, install with `bun install`, test with `bun test`, build with `bun build`.
- Bun auto-loads `.env` files — do not use `dotenv`.
- See `bun-instructions.md` for full Bun conventions.

## Project Structure
- Entry point: `index.ts` (root) — delegates to `src/app.ts`.
- Source code: `src/` directory.
- TypeScript with strict mode, `noEmit`, bundler module resolution (`tsconfig.json`).
- `src/store.ts` — estado en memoria con persistencia eager (write-through en cada mutación) a `cities.json` en el cwd.
- `src/api.ts` — llamadas a OpenMeteo (geocoding + forecast).
- `src/app.ts` — CLI, display, handlers y menú.
- `src/colors.ts` — helpers de color ANSI (cyan/yellow/green/red), respeta `NO_COLOR`.
- `src/types.ts` — interfaces TypeScript.

## App Purpose
- CLI weather app using OpenMeteo API (free, no API key required).
- Two-step API flow: geocoding → forecast.
- Supports temperature unit selection (°C/°F) persisted in settings.
- Target: interactive menu with city management (see `README.md` for menu mockup).
- Final deliverable: a compiled binary.

## Commands
```
bun index.ts          # run
bun test              # run tests (uses bun:test)
bun run build         # compila binario (--compile --outfile weather)
```

## API Reference
- Geocoding: `https://geocoding-api.open-meteo.com/v1/search?name={city}&count=1&language=es&format=json`
- Forecast: `https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current=temperature_2m&temperature_unit={celsius|fahrenheit}`
