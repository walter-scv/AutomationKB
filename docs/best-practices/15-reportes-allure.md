# Reportes con Allure

Un test que falla y solo deja un mensaje de texto en la terminal obliga a
reproducir el fallo para entenderlo. Un reporte rico — con pasos, tiempos,
y una captura de pantalla del momento exacto del fallo — muchas veces
alcanza por sí solo.

## De dónde sale la evidencia

Tres piezas, ya vistas en entradas anteriores, se combinan para esto:

1. **El reporter en** [`playwright.config.ts`](../../project/playwright.config.ts):
   ```typescript
   reporter: [
     ['allure-playwright', { resultsDir: 'allure-results', detail: true, suiteTitle: true }],
   ],
   ```
   Cada corrida escribe los resultados crudos (JSON + adjuntos) en
   `allure-results/` — ese directorio es la materia prima, no el reporte en
   sí.

2. **Los pasos numerados** (`test.step('1- ...')`, vistos en
   [Anatomía de un test](./06-anatomia-de-un-test.md)) son lo que convierte
   un test de una sola línea de resultado en un reporte navegable paso a
   paso.

3. **`screenshot`, `video` y `trace` en `playwright.config.ts`** (visto en
   [BaseTest](./09-basetest.md)), configurados como `'only-on-failure'` /
   `'retain-on-failure'` / `'on-first-retry'` — Playwright los captura solo
   cuando el test falla, y `allure-playwright` los adjunta al reporte sin
   que ningún test tenga que pedirlo. Así el reporte no solo dice "falló en
   el paso 3", muestra qué se veía en pantalla en ese momento.

## Generarlo localmente

```bash
npm run report:allure            # genera y sirve en un paso (allure serve)
npm run report:allure:generate   # solo genera el HTML en allure-report/
```

Un reporte de Allure **no se puede abrir como archivo** — sus páginas se
piden por HTTP, así que hace falta servirlo (`allure serve`/`allure open`
lo hacen por vos).

## Publicarlo desde CI

El archivo real: [`project/.github/actions/publish-allure/action.yml`](../../project/.github/actions/publish-allure/action.yml).
Es un composite action bastante más elaborado que "generar y listo":

- Genera el HTML con `allure generate`.
- Lo publica a **GitHub Pages**, bajo una carpeta por ejecución
  (`execution-reports/<id>/`) — nunca pisa el reporte de la corrida
  anterior.
- Mantiene un **historial acumulado** (`global-history/`) para que Allure
  muestre tendencias (flaky rate, duración) entre corridas, no solo el
  resultado de la última.
- Genera un **dashboard propio** (`index.html`) que lista las últimas 30
  ejecuciones con fecha, rama, autor y commit — para no tener que buscar un
  link de reporte perdido en el historial de Actions.

Esto se dispara desde los dos workflows reales
([CI/CD](./18-ci-cd.md)) después de correr los tests, con `if: always()` —
el reporte se publica tanto si la suite pasó como si falló.

**Siguiente:** [Debugging: trace viewer y modo UI](./16-debugging.md)
