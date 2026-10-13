# BaseTest — lo que comparten todos los tests

> Nota de vocabulario: acá "fixture" tiene un significado técnico puntual —
> una función que Playwright inyecta en cada test vía `test.extend()` (por
> ejemplo, una página ya autenticada). Es un caso específico de la idea más
> general de "Data / Fixture" como capa que ya viste en
> [Estructura y capas](./02-estructura-y-capas.md): ahí, una fixture es
> cualquier dato preparado antes de que el test arranque; acá es,
> puntualmente, el mecanismo de Playwright para inyectar ese dato.

## El problema: necesitás agregar algo a todos los tests a la vez

Imaginá que mañana esta app agrega un login, y todos los tests necesitan
arrancar con una sesión ya autenticada — no uno, todos. Si cada archivo de
test importa `test` y `expect` directo de `@playwright/test`:

```typescript
// test-a.spec.ts
import { test, expect } from '@playwright/test';

// test-b.spec.ts
import { test, expect } from '@playwright/test';

// ...cien archivos más, cada uno con el mismo import
```

... no hay un lugar único donde agregar ese comportamiento. Habría que
editar, a mano, cada uno de los cien archivos para que haga login antes de
empezar.

## La solución: un archivo intermedio del que todos importan

**BaseTest** es ese lugar único: un archivo que reexporta `test` y `expect`
de Playwright (son los mismos, no hay magia), y que es el único punto
donde se agrega cualquier comportamiento compartido, vía `test.extend()` —
el mecanismo de Playwright para declarar fixtures propias:

```typescript
// base-test.ts
import { test as base, expect, Page } from '@playwright/test';

export const test = base.extend<{ authenticatedPage: Page }>({
  authenticatedPage: async ({ page }, use) => {
    await page.goto('/login');
    await page.getByLabel('Email').fill(process.env.TEST_USER_EMAIL ?? '');
    await page.getByLabel('Password').fill(process.env.TEST_USER_PASSWORD ?? '');
    await page.getByRole('button', { name: 'Sign In' }).click();
    await page.waitForURL(/dashboard/);
    await use(page);
  },
});

export { expect };
```

```typescript
// cualquier test real
import { test, expect } from './base-test'; // nunca de '@playwright/test' directo

test('ve su dashboard al entrar', async ({ authenticatedPage }) => {
  // arranca ya logueado — ningún test repite el login a mano
});
```

El día que el flujo de login cambie, se arregla **una sola vez**, acá, y
los cien tests que piden `authenticatedPage` quedan arreglados sin
tocarlos.

## Así se ve en el proyecto real

[`project/tests/base-test.ts`](../../project/tests/base-test.ts) no
necesitó nunca la fixture de login del ejemplo de arriba —esta app no
tiene login—, pero sí tiene una fixture real, `seedPosition`, que resuelve
el mismo problema genérico (algo que varios tests necesitan, agregado en
un solo lugar) para un caso distinto: sembrar una posición en el portfolio
antes de que el test arranque, y revertirla después:

```typescript
// tests/base-test.ts
export const test = base.extend<{
  seedPosition: (order: Order) => Promise<void>;
}>({
  seedPosition: async ({ page }, use) => {
    const seeded: Order[] = [];

    await use(async (order) => {
      await buyAsset(page.request, order);   // ← Setup: compra vía API
      seeded.push(order);
    });

    for (const order of seeded.reverse()) {
      await sellAsset(page.request, order);  // ← Cleanup: vende lo que compró
    }
  },
});
```

Y así lo pide un test real,
[`portfolio.spec.ts`](../../project/tests/portfolio/portfolio.spec.ts):

```typescript
test('a seeded position shows the right unit count @p1 @portfolio', async ({ page, seedPosition }) => {
  // ...
  await seedPosition(anOrder().forAsset(secondaryAssetId).withAmount(50).build());
  // ...
});
```

(El detalle de por qué `seedPosition` revierte exactamente lo que compró,
y cuándo esa fixture no alcanza, se desarrolla en
[Setup & Cleanup](./11-setup-and-cleanup.md).) El valor de BaseTest es
justamente este: **todos los tests ya importan desde acá**
(`from '../base-test'`, nunca de `@playwright/test` directo), así que
cualquier fixture nueva que aparezca —como `seedPosition`— queda disponible
para todos sin tocar ni un test existente.

## Un error fácil de cometer acá: escribir una fixture para algo que el framework ya resuelve

Antes de agregar una fixture a `base-test.ts`, vale la pena confirmar que
Playwright no lo esté resolviendo ya. El caso más común: adjuntar evidencia
al reporte cuando un test falla. No hace falta ninguna fixture ni ningún
helper para eso — ya está resuelto en
[`playwright.config.ts`](../../project/playwright.config.ts):

```typescript
use: {
  screenshot: 'only-on-failure',
  video: 'retain-on-failure',
  trace: 'on-first-retry',
},
```

Con esta configuración sola, cualquier test que falla deja una screenshot,
un video y un trace — y `allure-playwright` (el reporter configurado en el
mismo archivo) los toma de ahí y los adjunta al reporte solo, sin que
ningún test ni ninguna fixture tenga que pedirlo explícitamente (se
profundiza en [Reportes con Allure](./15-reportes-allure.md)). Escribir una
fixture que envuelva manualmente cada `expect` para capturar algo que el
framework ya captura solo es código extra para mantener, sin beneficio
real.

**Siguiente:** [Parametrización de datos](./10-parametrizacion-de-datos.md)
