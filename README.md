## Weather CLI APP

El objetivo de esta aplicación es que creemos una aplicación de consola que pida que ingresemos la ciudad, Al final, generaremos un binario ejecutable.

### Opciones:

- Ingresar el nombre de una ciudad.
- Guardar la ciudad por defecto.
- Registrar varias otras ciudades para buscar el clima en esas otras ciudades.

## Stack

- Bun.js
- OpenMeteo

## Ejemplo de petición http:

1. Paso 1: Geocoding API.
2. Paso 2: OpenMeteo API.

```
https://geocoding-api.open-meteo.com/v1/search?name=Ottawa&count=5&language=es&format=json
https://api.open-meteo.com/v1/forecast?latitude=45.41117&longitude=-75.69812&current=temperature_2m
```

## Inicializar proyecto

```bash
bun init
```

## Estructura del proyecto

```bash
src/
├── actions/            # Acciones que puede ejecutar el usuario (una por archivo)
├── presentation/       # Interacción de consola: menú, input, output
├── storage/            # Persistencia local: ciudades y ajustes
├── types/              # Tipos y contratos TypeScript
├── api/                # Integración con OpenMeteo (geocoding, weather)
├── utils/              # Helpers reutilizables (formato, constantes, colores)
└── index.ts            # Punto de entrada: composición e inicio de la app
```

## Ejecutar

```bash
bun index.ts      # ejecutar
bun test          # tests
bun run build     # compilar binario (weather)
bun x tsc --noEmit  # typecheck
```

### Ejemplo del menú

Esta es la apariencia que deseamos crear

```bash
════════════════════════════════════════
         WEATHER CLI
════════════════════════════════════════
  1. Clima de ciudad default
  2. Clima de todas las ciudades
  3. Buscar y agregar ciudad
  4. Eliminar ciudad
  5. Establecer ciudad default
  6. Predicción 7 días
  7. Listar ciudades
  8. Ajustes (°C)
  9. Salir
════════════════════════════════════════
  Selecciona una opción: 5
```
