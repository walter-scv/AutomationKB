# Debugging: trace viewer y modo UI

Antes de asumir una causa y ponerse a cambiar código, Playwright da tres
formas de ver exactamente qué pasó — de más liviana a más profunda. Los
scripts reales están en [`project/package.json`](../../project/package.json).

## Modo UI — para desarrollar y depurar tests interactivamente

```bash
npm run test:ui
```

Abre una ventana que corre los tests y muestra, test por test, cada acción
con un snapshot del DOM en ese momento — se puede pausar, retroceder paso a
paso, e inspeccionar el estado exacto antes y después de cada acción. Es la
herramienta por defecto mientras se **escribe** un test nuevo.

## Modo debug — paso a paso con el inspector

```bash
npm run test:debug
```

Abre el Playwright Inspector: corre el test pausado en cada acción, con
control manual de "siguiente paso". Más quirúrgico que el modo UI cuando ya
sabés en qué parte del test está el problema.

## El trace viewer — para un fallo que ya ocurrió (típicamente en CI)

```typescript
// playwright.config.ts
use: {
  trace: 'on-first-retry', // graba el trace solo si el test falló una vez
},
```

Esta es la herramienta correcta para un fallo en CI, donde no podés correr
el test interactivamente. El trace guarda una grabación completa —DOM,
red, consola, screenshots por acción— que se reproduce después, local:

```bash
npx playwright show-trace trace.zip
```

El `trace.zip` de cada test vive en `test-results/`, la carpeta por defecto
donde Playwright vuelca sus archivos de salida — no en `allure-results/`,
que solo tiene la data que lee el reporte de Allure. Los dos workflows
reales ([`e2e-tests.yml`](../../project/.github/workflows/e2e-tests.yml) y
[`daily-regression.yml`](../../project/.github/workflows/daily-regression.yml),
desarrollados en [CI/CD](./19-ci-cd.md)) suben esa carpeta como artifact
(`traces-<run>` / `daily-traces-<run>`) además de `allure-results/`:

```yaml
- name: Upload traces
  uses: actions/upload-artifact@v4
  if: always()
  with:
    name: traces-${{ github.run_number }}
    path: test-results/
    retention-days: 7
    if-no-files-found: ignore
```

Bajar ese artifact desde la corrida de GitHub Actions y abrirlo con
`show-trace` es, en la práctica, la única forma de ver qué pasó en un test
que falló en CI una sola vez y no se puede reproducir corriendo de nuevo.

## Cuál usar, según el momento

| Situación | Herramienta |
|---|---|
| Estás escribiendo un test nuevo | Modo UI |
| Sabés dónde está el problema, querés ver variable por variable | Modo debug |
| Un test falló en CI y no podés reproducirlo corriendo de nuevo | Trace viewer, descargando el `trace.zip` del artifact `traces-<run>` |
| Un test falla y no sabés ni por dónde arrancar | Abrí primero el reporte de Allure ([entrada anterior](./16-reportes-allure.md)) — la screenshot que Playwright adjunta sola en el fallo suele contestar la pregunta sin necesitar nada más |

**Siguiente:** [Tags y cómo correr subsets](./18-tags-y-subsets.md)
