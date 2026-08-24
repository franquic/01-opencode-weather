# AGENTS.md

## Runtime & Package Manager
- **Use Bun, not Node.js.** Run with `bun index.ts`, install with `bun install`, test with `bun test`, build with `bun build`.
- Bun auto-loads `.env` files — do not use `dotenv`.
- See `bun-instructions.md` for full Bun conventions.

## Project Structure
- Entry point: `index.ts` (root, no `src/` directory).
- TypeScript with strict mode, `noEmit`, bundler module resolution (`tsconfig.json`).
- Flat structure — keep it that way unless the app grows significantly.

## App Purpose
- CLI weather app using OpenMeteo API (free, no API key required).
- Two-step API flow: geocoding → forecast.
- Target: interactive menu with city management (see `README.md` for menu mockup).
- Final deliverable: a compiled binary.

## Commands
```
bun index.ts          # run
bun test              # run tests (uses bun:test)
bun build index.ts    # compile to binary
```

## API Reference
- Geocoding: `https://geocoding-api.open-meteo.com/v1/search?name={city}&count=1&language=es&format=json`
- Forecast: `https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current=temperature_2m`
