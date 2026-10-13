# BasePage — lo que comparten todas las Page Objects

## El problema: código repetido entre pantallas

Imaginá que una app tuviera dos pantallas — `DashboardPage` y, digamos,
`SettingsPage`. Las dos necesitan navegar a su URL y esperar a que la
página cargue — y las dos repiten el mismo dominio, cambiando solo la
ruta final:

```typescript
class DashboardPage {
  constructor(private page: Page) {}
  async navigate() {
    await this.page.goto('https://app.example.com/dashboard', { waitUntil: 'networkidle' });
  }
}

class SettingsPage {
  constructor(private page: Page) {}
  async navigate() {                                           // ← idéntico al de arriba, copiado
    await this.page.goto('https://app.example.com/settings', { waitUntil: 'networkidle' });
  }
}
```

El método `navigate()` es idéntico salvo por la URL — y el dominio
(`https://app.example.com`) tampoco cambia entre pantallas, solo la ruta
(`/dashboard`, `/settings`). Con dos pantallas no duele; con veinte, tanto
el método como el dominio están pegados veinte veces — y si mañana la app
se muda a otro dominio, o cambia la estrategia de espera (`networkidle`
por otra cosa), hay que encontrar y cambiar las veinte copias de las dos
cosas.

## La solución: una clase base de la que todas heredan

`BasePage` es una clase abstracta que contiene **todo lo que es igual para
cualquier pantalla** — incluido el dominio base, que ninguna pantalla
concreta debería tener que repetir. Cada Page Object hereda de ella y solo
agrega su propia ruta:

```typescript
abstract class BasePage {
  protected url: string;

  constructor(protected page: Page) {
    this.url = 'https://app.example.com';   // ← el dominio vive acá, UNA sola vez
  }

  async navigate() {
    await this.page.goto(this.url, { waitUntil: 'networkidle' });
  }
}

class DashboardPage extends BasePage {
  constructor(page: Page) {
    super(page);
    this.url = this.url + '/dashboard';   // ← solo agrega SU ruta a la base heredada
  }
  // DashboardPage ya no necesita escribir su propio navigate()
}

class SettingsPage extends BasePage {
  constructor(page: Page) {
    super(page);
    this.url = this.url + '/settings';
  }
}
```

Ahora `navigate()` existe en un solo lugar, y el dominio también: si
mañana la app se muda a otro dominio, se cambia una vez en `BasePage`, y
las veinte Page Objects que heredan de ella lo reciben automáticamente,
sin tocar ni una.

## Así se ve en el proyecto real

El real, [`project/pages/BasePage.ts`](../../project/pages/BasePage.ts),
no necesita separar dominio y ruta como el ejemplo — esta app tiene una
sola pantalla, así que `BasePage` recibe directamente la URL completa.
Donde sí creció más allá de `navigate()` es en timeouts nombrados y
helpers de interacción comunes:

```typescript
export const TIMEOUTS = {
  short: 2000,       // elementos que aparecen de inmediato (botones, labels)
  standard: 5000,    // transacciones e interacciones de UI
  long: 10000,       // operaciones async, respuestas de red
  processing: 60000, // tareas de background, transacciones, sync de datos
} as const;

export abstract class BasePage {
  readonly page: Page;
  readonly url: string;

  constructor(page: Page, url: string) {
    this.page = page;
    this.url = url;
  }

  async navigate(): Promise<void> {
    await this.page.goto(this.url, { waitUntil: 'networkidle' });
  }

  // timeout opcional: cada llamada puede pedir más o menos paciencia sin
  // tener que repetir el número — ver TIMEOUTS arriba.
  async click(locator: Locator, timeout: number = TIMEOUTS.standard): Promise<void> {
    await locator.click({ timeout });
  }

  /** Clear a field, fill it with text, then press Tab — mimics real user input. */
  async fill(locator: Locator, text: string): Promise<void> {
    await locator.clear();
    await locator.fill(text);
    await locator.press('Tab');     // dispara blur/change como lo haría un usuario real
  }

  async waitForVisible(locator: Locator, timeout: number = TIMEOUTS.standard): Promise<void> {
    await locator.waitFor({ state: 'visible', timeout });
  }

  async waitForHidden(locator: Locator, timeout: number = TIMEOUTS.standard): Promise<void> {
    await locator.waitFor({ state: 'hidden', timeout });
  }
}
```

Y así hereda `PortfolioPage` en la vida real, pasando su propia URL al
constructor de `BasePage` y usando sus helpers en vez de reimplementarlos:

```typescript
export class PortfolioPage extends BasePage {
  constructor(page: Page) {
    super(page, 'https://sea-lion-app-7celq.ondigitalocean.app');
    // ...
  }

  async clickRealizarCompra(): Promise<void> {
    await this.waitForVisible(this.realizarCompraButton);  // ← de BasePage, no reimplementado
    await this.click(this.realizarCompraButton);            // ← también de BasePage
    await this.waitForTransactionComplete();
  }
}
```

## Qué pertenece a BasePage, y qué no

La regla es: si el comportamiento es **el mismo para cualquier pantalla**,
va en `BasePage`. Si depende de qué hace *esta* pantalla en particular, va
en la Page Object concreta.

- `navigate()`, `click()`, `fill()`, `waitForVisible()` — genéricos de
  Playwright, ninguno sabe nada de "portfolio" ni de ninguna otra feature.
- `TIMEOUTS` — una sola fuente de verdad para los tiempos de espera de toda
  la suite (ver [Errores que se pagan caro](./20-errores-que-se-pagan-caro.md)
  sobre timeouts mágicos).
- En cambio, algo como `clickRealizarCompra()` o `getUnitsOwned()` no tiene
  lugar acá — es específico de la pantalla de portfolio y vive en
  `PortfolioPage`.

## Cuándo el helper genérico no alcanza

`PortfolioPage` usa `click()` y `waitForVisible()` de `BasePage` en todos
lados — pero **no** usa `fill()` para los spinbuttons de compra/venta:

```typescript
// fillComprar() — usa pressSequentially(), no el fill() genérico de BasePage
async fillComprar(quantity: number): Promise<void> {
  await this.waitForVisible(this.comprarSpinbutton);
  await this.comprarSpinbutton.clear();
  await this.comprarSpinbutton.pressSequentially(String(quantity)); // ← simula tecla por tecla
}
```

Ese spinbutton escucha eventos de tecla reales — un `.fill()` directo (lo
que haría `BasePage.fill()`) pone el valor sin disparar esos eventos, y el
componente no reacciona igual. Esto no es un bug del helper genérico: es
una señal correcta de que esta pantalla necesita algo más específico, y el
comentario en el código documenta exactamente por qué se desvía del
helper común. Esa es la decisión correcta — no forzar un helper genérico
donde no encaja, y dejar por escrito el motivo.

**Siguiente:** [Anatomía de un test](./06-anatomia-de-un-test.md)
