# Page Object Model

## El problema que resuelve

Imaginá dos tests que compran un producto en un checkout. Sin ningún
patrón, cada uno busca los elementos directamente en la pantalla:

```typescript
// test A
await page.getByRole('spinbutton').first().fill('1');
await page.getByRole('button', { name: 'Confirmar compra' }).click();

// test B, en otro archivo, repite exactamente lo mismo
await page.getByRole('spinbutton').first().fill('5');
await page.getByRole('button', { name: 'Confirmar compra' }).click();
```

El día que el texto del botón cambie de "Confirmar compra" a "Finalizar
pedido", hay que salir a buscar esa línea en cada test que la repite.
Multiplicá eso por cien tests y un botón que cambia cada dos semanas, y
tenés la razón de ser de este patrón.

## La idea: una clase que sabe interactuar con la pantalla

En vez de que cada test busque los elementos por su cuenta, una sola clase
concentra *cómo* se interactúa con esa pantalla. Los tests solo le piden
que haga cosas — nunca tocan el DOM directamente:

```typescript
// Sin Page Object: el test sabe CÓMO está armada la pantalla
await page.getByRole('spinbutton').first().fill('1');
await page.getByRole('button', { name: 'Confirmar compra' }).click();

// Con Page Object: el test solo dice QUÉ quiere lograr
await checkoutPage.fillQuantity(1);
await checkoutPage.clickConfirmarCompra();
```

Y así de simple es la clase, en su forma mínima:

```typescript
class CheckoutPage {
  readonly quantitySpinbutton = this.page.getByRole('spinbutton').first();
  readonly confirmarCompraButton = this.page.getByRole('button', { name: 'Confirmar compra' });

  constructor(private page: Page) {}

  async fillQuantity(quantity: number) {
    await this.quantitySpinbutton.fill(String(quantity));
  }

  async clickConfirmarCompra() {
    await this.confirmarCompraButton.click();
  }
}
```

Ahora, si el texto del botón cambia, se arregla **en un solo lugar** — acá —
y los cien tests que llaman a `clickConfirmarCompra()` quedan arreglados sin
tocarlos. Eso es todo el patrón: el conocimiento de "cómo es esta pantalla"
vive en un único lugar, no repetido en cada test que la usa.

## Así se ve en el proyecto real

El ejemplo de arriba es la versión mínima para ver la idea. La clase real,
[`project/pages/PortfolioPage.ts`](../../project/pages/PortfolioPage.ts),
tiene 18 locators y bastante más matiz — pero sigue siendo el mismo molde:
selectores declarados arriba, métodos de interacción abajo, y algunos de
esos métodos reciben lo que les falta como parámetro en vez de adivinarlo.
Uno por uno:

### 1. Los selectores vuelven a vivir arriba, como propiedades

```typescript
export class PortfolioPage extends BasePage {
  // Detail panel locators
  readonly detailCantidadAdquirida: Locator;
  readonly detailValorTotal: Locator;

  constructor(page: Page) {
    super(page, 'https://sea-lion-app-7celq.ondigitalocean.app');
    // NOTE: Each detail row is a <p> containing a <strong> label + text.
    this.detailCantidadAdquirida = page.locator('p', { hasText: /Cantidad adquirida/ });
    this.detailValorTotal = page.locator('p', { hasText: /Valor total/ });
    // ...y así las 18 en total, agrupadas por zona de pantalla con un
    // comentario por grupo — ningún método de abajo declara una nueva.
  }
  // el resto de la clase sigue en los puntos 2 y 3
}
```

A esta escala (18 locators, varios sin `data-testid` disponible) aparecen
preguntas propias de cómo organizarlas y cuándo hace falta desambiguar con
`.first()`/`.nth()` — eso se profundiza en
[Centralizando los selectores](./07-centralizando-selectores.md). Acá
alcanza con el punto central: viven arriba, como propiedades, nunca
declaradas sueltas dentro de un método de abajo.

### 2. Los métodos de interacción — uno por cada cosa que se puede hacer o preguntar

```typescript
/** Fill the Comprar quantity input with the given number. */
async fillComprar(quantity: number): Promise<void> {
  await this.comprarSpinbutton.clear();
  await this.comprarSpinbutton.pressSequentially(String(quantity));
}

/** Click the Realizar compra button and wait for the transaction to complete. */
async clickRealizarCompra(): Promise<void> {
  await this.click(this.realizarCompraButton);
  await this.waitForTransactionComplete();
}

async getUnitsOwned(): Promise<number> {
  const text = (await this.detailCantidadAdquirida.textContent()) ?? '0';
  const unitsText = text.replace(/Cantidad adquirida\s*:?\s*/i, '').replace(/\s*unidades?/i, '').trim();
  return parseFloat(unitsText);   // ← el test recibe un number listo, nunca el texto crudo
}
```

Cada nombre de método es una acción (o un conjunto de acciones) que el
usuario puede realizar sobre esa pantalla: `fillComprar` llena la cantidad
a comprar, `clickRealizarCompra` hace click en el botón de compra.
`getUnitsOwned` es distinto — no es algo que el usuario *haga*, es algo que
el test necesita *preguntarle* a la pantalla para poder comparar — pero
sigue siendo parte de la misma idea: preguntar el estado también es una
forma de interactuar con ella. Ningún método expone el spinbutton, el
botón, ni el texto crudo del DOM: el test nunca ve nada de eso, solo el
nombre de lo que logra.
(`this.click(...)` y `this.waitForTransactionComplete()` son helpers
propios de la clase — se explican en la [próxima entrada](./05-basepage.md).)

### 3. Esos métodos reciben lo que les falta como parámetro, no lo adivinan

`fillComprar` no sabe de antemano cuántas unidades va a comprar cada test —
por eso `quantity` es un parámetro, igual que en cualquier función. Eso es
lo que permite que el mismo método sirva para un test que compra `1` unidad
y para otro que compra `5`, sin duplicarlo por cada cantidad posible. Del
lado del test, llamar a `portfolioPage.fillComprar(1)` sigue siendo una sola
línea legible: el test pasa el dato de negocio que le importa (cuánto
comprar) y nada más — nunca un selector, nunca un paso técnico.

El mismo criterio se extiende a un caso más particular: cuando lo que falta
no es un valor para comparar sino **qué elemento buscar en el DOM** — por
ejemplo, un botón que puede ser cualquiera según un nombre que recién llega
del test. Ese caso puntual, y por qué ahí el método construye el `Locator`
en vez de ejecutar una acción, se desarrolla en
[Centralizando los selectores](./07-centralizando-selectores.md).

## Tres reglas para no arruinarlo

1. **Las aserciones van en el test, nunca en la Page Object.** La Page
   Object reporta estado (`getUnitsOwned()` devuelve un número); el test
   decide si ese número es correcto. Ningún método de `PortfolioPage` hace
   un `expect` — todos devuelven un valor o completan una acción.

2. **Prioridad de selectores:** `getByTestId` → `getByRole` → `getByLabel`
   → `getByPlaceholder` → `getByText`. Esta app real **no tiene ningún
   `data-testid`**, lo que obliga a usar `.first()`/`.nth(1)` para
   desambiguar — y cada caso así está documentado con un comentario `NOTE:`
   explicando por qué no había opción mejor. Esa es la regla "sin testId,
   dejá un comentario" aplicada a un caso real, no una excepción a ella.

3. **Métodos con significado de negocio, no pasos sueltos.**
   `clickRealizarCompra()`, no un `click()` genérico — el nombre dice qué
   logra, no qué hace técnicamente.

## Por qué ese orden de selectores

El criterio detrás del ranking es uno solo: **¿qué tan probable es que este
valor cambie por una razón que no tiene nada que ver con el comportamiento
que estoy probando?**

| Selector | Qué tan estable es, y por qué |
|---|---|
| `getByTestId` | El más estable: es un atributo que **solo existe para testing**. Nadie lo toca al cambiar un color, un texto o una traducción, porque no cumple ningún otro propósito. |
| `getByRole` | Refleja la semántica del elemento (es un botón, es un campo de texto). Sobrevive a cambios visuales, pero se rompe si el elemento cambia de rol o de nombre accesible. |
| `getByLabel` | Depende del label asociado al campo — bastante estable, pero varía con cambios de copy o traducciones. |
| `getByPlaceholder` | El placeholder es texto de ayuda, de los primeros que cambia un diseñador en una iteración de UX. |
| `getByText` | El texto visible es lo que más cambia: rediseños, copy nuevo, A/B tests, traducciones. Es el que más mantenimiento genera. |
| CSS / XPath | Refleja la implementación interna del DOM (clases, jerarquía de nodos), que puede cambiar por razones puramente de estilo o de refactor, sin que el comportamiento real se haya tocado. Es la causa más común de un selector roto que no corresponde a ningún bug. |

`PortfolioPage` vive en los niveles de en medio (role, texto) porque no
tiene opción de usar el primero — lo que nos lleva directo al punto
siguiente.

## Por qué vale la pena coordinar con frontend

El `testId` del primer lugar del ranking no aparece solo — alguien tiene que
agregarlo al código de la aplicación. Esta app real es el caso que lo
demuestra al revés: **cero** `data-testid` en toda la aplicación obliga a
`PortfolioPage` a desambiguar con `.first()`/`.nth(1)` en seis lugares
distintos. Cada uno de esos es mantenimiento evitable si frontend agregara
un atributo dedicado.

Pedir el atributo necesario **cuando se construye la feature**, no después
de que un test ya se rompió, tiene un impacto directo y medible:

- Un `data-testid` acordado de entrada cuesta una línea de código al
  desarrollador que ya está tocando ese componente.
- El mismo `testId` agregado reactivamente, después de que un selector por
  texto se rompió en producción, cuesta un test roto en CI, una
  investigación, y recién después el mismo cambio de una línea.
- Tener los selectores agrupados y bien nombrados dentro de la Page Object
  (se profundiza en [Centralizando los selectores](./07-centralizando-selectores.md))
  ya ayuda a esa conversación: en vez de "el selector tal se rompió", se
  puede señalar con precisión qué elemento necesita el atributo.
- Qué pedirle exactamente a frontend —no un `data-testid` suelto, sino un
  atributo por tipo de elemento— es una convención concreta, desarrollada
  en [Data-attributes: el contrato con frontend](./08-data-attributes-con-frontend.md).

> Una excepción real en esta misma clase: `portfolioAssetButton(name)` usa
> `page.locator('.my-investments__items__name', ...)` — un selector CSS, el
> último de la tabla de arriba. No es una inconsistencia: esa clase CSS es,
> en esta app, la única forma de acotar la búsqueda a la sección "Mi
> portfolio" específicamente (a diferencia de `assetButton(name)`, que busca
> en toda la página). Cuando ningún selector semántico alcanza para acotar
> el alcance de la búsqueda, CSS puede ser la herramienta correcta — lo que
> la regla pide es no usarlo *por comodidad* cuando sí había una opción
> mejor arriba en la tabla, no prohibirlo sin excepción.

**Siguiente:** [BasePage — lo que comparten todas las Page Objects](./05-basepage.md)
