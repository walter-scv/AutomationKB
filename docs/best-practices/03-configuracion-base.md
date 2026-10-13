# Configuración base del proyecto

La configuración de una suite no debería ser una lista de defaults
copiados de un tutorial — cada opción responde a una decisión concreta
sobre cómo corre *esta* suite en particular, y esa razón debería quedar
escrita al lado, no en la cabeza de quien la configuró. Así se ve esa idea
aplicada en el archivo real,
[`project/playwright.config.ts`](../../project/playwright.config.ts) —
el comentario al lado de cada línea es la razón, no solo el dato:

```typescript
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  // En CI un test.only() olvidado haría que el job corra uno solo y reporte
  // todo verde — eso falla el build. En local no molesta mientras iterás.

  retries: process.env.CI ? 2 : 0,
  // CI es un entorno compartido con latencia de red variable: un retry separa
  // lo genuinamente roto de un hipo pasajero. En local, 0 — si falla en tu
  // máquina, querés verlo fallar la primera vez, no esperar un reintento.

  workers: process.env.CI ? (Number(process.env.WORKERS) || 2) : undefined,
  // undefined en local deja que Playwright use todos los cores disponibles.
  // Un número fijo en CI solo tiene sentido donde el recurso es compartido.

  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['allure-playwright', { resultsDir: 'allure-results', detail: true, suiteTitle: true }],
    // los cuatro reporters conviven — cada uno sirve un propósito distinto,
    // ninguno reemplaza a otro. Se desarrolla en la entrada de Allure.
  ],

  use: {
    baseURL: process.env.BASE_URL ?? 'https://sea-lion-app-7celq.ondigitalocean.app',
    // sale de una variable de entorno, con un default: el mismo config sirve
    // sin configurar nada Y para apuntar a otro entorno sin tocar código.

    trace: 'on-first-retry',
    // el trace es una grabación completa de la corrida (DOM, red, consola,
    // screenshots por acción) — se explica en la entrada de Debugging.
    // Grabarlo SIEMPRE pesa en disco y tiempo para información que casi
    // nunca se usa. Grabarlo solo tras el primer fallo es la señal de que ahí
    // sí vale la pena esa evidencia.

    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 10000,
    navigationTimeout: 30000,
  },

  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
```

`BASE_URL` sale de `.env` — nunca commiteado, cargado por `dotenv` antes de
esta config. De dónde sale cada variable así, y cómo se maneja lo mismo en
CI (sin archivo `.env`, vía Secrets), se desarrolla en
[Parametrización de datos](./10-parametrizacion-de-datos.md).

## El reporter de Allure, en particular

```typescript
['allure-playwright', { resultsDir: 'allure-results', detail: true, suiteTitle: true }],
```

Está en la lista de reporters junto al HTML nativo de Playwright, no en
reemplazo — cada uno sirve un propósito distinto (desarrollo local vs.
publicación de resultados). Se desarrolla en la entrada de
[Reportes con Allure](./15-reportes-allure.md).

**Siguiente:** [Page Object Model](./04-page-object-model.md)
