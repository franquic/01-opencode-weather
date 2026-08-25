# AGENTS.md

## Runtime & Package Manager
- **Use Bun, not Node.js.** Run with `bun index.ts`, install with `bun install`, test with `bun test`, build with `bun build`.
- Bun auto-loads `.env` files — do not use `dotenv`.
- See `bun-instructions.md` for full Bun conventions.

## Project Structure
- Entry point: `index.ts` (root) — delegates to `src/index.ts`.
- Source code: `src/` directory, organized in layers (see `references/file-system.md`):
  - `src/index.ts` — composition root: migrates storage, creates storages, builds the menu, starts the app.
  - `src/actions/` — user-facing actions (one file per action). Each takes `ActionDeps` (`{ citiesStorage, settingsStorage }`) — dependencies are injected, never imported as singletons. Actions orchestrate but never do I/O directly.
  - `src/presentation/` — console interaction: `menu.ts` (data-driven menu loop over `MenuOption[]`), `input.ts` (readline, `ask`, `selectCity`), `output.ts` (rendering and messages).
  - `src/storage/` — local persistence: `citiesStorage.ts` (cities.json), `settingsStorage.ts` (settings.json), `migration.ts` (one-time migration from the legacy single-file store), `jsonFile.ts` (low-level JSON read/write). Write-through on every mutation.
  - `src/api/` — OpenMeteo integration: `geocoding.ts`, `weather.ts`, `http.ts` (`fetchJson` helper).
  - `src/types/` — shared TypeScript contracts: `City.ts`, `Weather.ts`, `AppSettings.ts`, `MenuOption.ts` (+ `index.ts` barrel).
  - `src/utils/` — reusable helpers: `format.ts` (pure formatters), `constants.ts`, `colors.ts` (ANSI, respects `NO_COLOR`), `wmo.ts` (WMO code → Spanish description).
- TypeScript with strict mode, `noEmit`, bundler module resolution (`tsconfig.json`).

## App Purpose
- CLI weather app using OpenMeteo API (free, no API key required).
- Two-step API flow: geocoding → forecast.
- Temperature unit selection (°C/°F) persisted in settings.
- Data files in the cwd: `cities.json` (array of cities) and `settings.json` (`defaultCityId`, `unit`).

## Commands
```
bun index.ts          # run
bun test              # run tests (uses bun:test)
bun run build         # compiles binary (--compile --outfile weather)
bun x tsc --noEmit    # typecheck
```

## Conventions
- Actions receive deps by parameter (`ActionDeps`) — no global state, easy to test.
- Presentation layer never calls the API directly; actions orchestrate between presentation, api and storage.
- Adding a menu option = add an entry to `buildMenuOptions` in `src/index.ts` (no switch statements).
- Cross-storage rules (e.g. resetting the default city after removal) live in the corresponding action.

## API Reference
- Geocoding: `https://geocoding-api.open-meteo.com/v1/search?name={city}&count=5&language=es&format=json` (devuelve hasta 5 resultados; el usuario elige uno de una lista numerada cuando hay varios).
- Forecast: `https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current=temperature_2m&temperature_unit={celsius|fahrenheit}`
- Predicción diaria: `https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&daily=weather_code,temperature_2m_max,temperature_2m_min&forecast_days=7&timezone=auto&temperature_unit={celsius|fahrenheit}`
