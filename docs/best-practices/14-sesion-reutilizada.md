# Sesión reutilizada / autenticación

Un problema común en cualquier app con login: si cada test empieza
logueándose desde cero (completar usuario, contraseña, click), ese flujo se
repite cientos de veces por corrida — tiempo real sumado sin verificar nada
nuevo cada vez, salvo en el puñado de tests que específicamente prueban el
login.

## El patrón de Playwright: `storageState`

Una fixture que hace login por UI resuelve la repetición de código, pero no
la de tiempo — sigue pagando el costo del login en cada test:

```typescript
authenticatedPage: async ({ page }, use) => {
  await page.goto('/login');                                   // ← login por UI,
  await page.getByLabel('Email').fill(/* ... */);                //   una vez POR TEST
  await page.getByRole('button', { name: 'Sign In' }).click();  //   que use esta fixture
  await use(page);
},
```

Playwright resuelve el costo de tiempo guardando la sesión (cookies +
local storage) en disco **una sola vez**, y reutilizándola en cada test sin
repetir el login:

```typescript
// global-setup.ts — corre UNA VEZ, antes de toda la suite (no por test)
import { chromium } from '@playwright/test';

export default async function globalSetup() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('/login');
  await page.getByLabel('Email').fill(process.env.TEST_USER_EMAIL ?? '');
  await page.getByRole('button', { name: 'Sign In' }).click();
  await page.waitForURL(/dashboard/);
  await page.context().storageState({ path: 'playwright/.auth/user.json' }); // ← guarda cookies + local storage en disco
  await browser.close();
}
```

```typescript
// playwright.config.ts
export default defineConfig({
  globalSetup: require.resolve('./global-setup'),  // ← corre esto una vez, antes de los tests
  use: {
    storageState: 'playwright/.auth/user.json', // ← cada test arranca YA logueado, sin pasar por /login
  },
});
```

## Por qué importa la diferencia

- La fixture de login hace login **por test** — simple de entender, pero
  paga el costo del login en cada uno.
- `storageState` paga ese costo **una sola vez por corrida completa** — la
  sesión se inyecta directamente en el contexto del browser, sin pasar por
  el formulario de login en absoluto.

Para una suite chica, la diferencia no se nota. Para una suite de cientos
de tests, es la diferencia entre sumar minutos reales a cada corrida o no.

El mismo mecanismo sirve para un segundo caso, además del login: reutilizar
una sesión que ya tiene un escenario sembrado (un carrito con productos,
una cuenta con historial), para no repetir ese seed en cada test que lo
necesita — siempre que sembrar sea costoso (una cadena de pasos por UI).

## Así se ve en esta base

"Show me the money!" no tiene un login con usuario y contraseña — es una
app abierta. Sí tiene una sesión anónima (una cookie que el backend asigna
sola, sin ningún formulario de por medio), así que el primer caso de
`storageState` —ahorrar el costo de un login— no aplica acá: no hay ningún
formulario que completar, la sesión existe desde el primer request.
`tests/base-test.ts` real ya tiene el lugar exacto donde iría una fixture
de autenticación si esta app alguna vez tuviera login, comentado,
esperando a que haga falta:

```typescript
// tests/base-test.ts
export const test = base.extend<{
  // authenticatedPage: async ({ page }, use) => {
  //   await page.goto('/login');
  //   await page.getByLabel('Email').fill(process.env.TEST_USER_EMAIL ?? '');
  //   await page.getByLabel('Password').fill(process.env.TEST_USER_PASSWORD ?? '');
  //   await page.getByRole('button', { name: 'Sign In' }).click();
  //   await page.waitForURL(/dashboard/);
  //   await use(page);
  // },
}>({});
```

Tampoco aplica el segundo caso —sembrar un escenario sembrado y
reutilizarlo—: el test real S8
([Setup & Cleanup](./11-setup-and-cleanup.md)) necesita exactamente eso,
una posición grande en un activo, y aun así no usa `storageState`: siembra
vía una sola llamada a la API (`buyAsset(...)`), que tarda milisegundos.
`storageState` paga su costo cuando sembrar es caro; acá sembrar ya es una
llamada directa y barata, así que agregar `globalSetup` y un archivo de
sesión en disco sumaría una capa de infraestructura sin ahorrar nada real.

**Siguiente:** [Reportes con Allure](./15-reportes-allure.md)
