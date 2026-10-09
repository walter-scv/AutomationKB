# Centralizando los selectores

## El problema: un selector declarado dentro de cada método que lo usa

Una Page Object ya resuelve que el test no toque el DOM — pero eso no
garantiza que esté bien organizada por dentro. Mirá esta versión, donde
cada método declara sus propios locators al vuelo, en vez de tenerlos
agrupados:

```typescript
class PortfolioPage {
  constructor(private page: Page) {}

  async clickRealizarCompra() {
    await this.page.getByRole('button', { name: 'Realizar compra' }).click();  // ← selector #1
  }

  async isBuyButtonVisible() {
    return this.page.getByRole('button', { name: 'Realizar compra' }).isVisible();  // ← selector #2, idéntico
  }

  async getBuyButtonText() {
    return this.page.getByRole('button', { name: 'Realizar compra' }).textContent();  // ← selector #3, idéntico
  }
}
```

El mismo selector del botón de compra aparece **tres veces**, repetido a
mano. Si alguien necesita saber "qué selectores usa esta pantalla", tiene
que leer la clase entera, método por método, buscando cada `page.getBy...`
suelto.

## La solución: declarar cada locator una sola vez, como propiedad

```typescript
class PortfolioPage {
  readonly realizarCompraButton: Locator;

  constructor(private page: Page) {
    this.realizarCompraButton = page.getByRole('button', { name: 'Realizar compra' });
  }

  async clickRealizarCompra() {
    await this.realizarCompraButton.click();
  }

  async isBuyButtonVisible() {
    return this.realizarCompraButton.isVisible();
  }
}
```

Ahora el selector existe **una sola vez**, asignado en el constructor. Si
el botón cambia de texto, se arregla en una línea — no en tres, no en las
que alguien se olvide de encontrar.

## Así se ve en el proyecto real

`PortfolioPage` tiene 18 locators en total. El archivo real,
[`project/pages/PortfolioPage.ts`](../../project/pages/PortfolioPage.ts),
aplica la misma idea a esa escala, agrupándolos por zona de la pantalla con
comentarios de sección — para que encontrar uno no signifique leer 17 líneas
sin estructura:

```typescript
export class PortfolioPage extends BasePage {
  // Sidebar locators
  readonly savingsBalance: Locator;
  readonly portfolioSectionLabel: Locator;

  // Portfolio asset buttons
  readonly terniumArgentinaButton: Locator;

  // Transaction spinbuttons
  readonly comprarSpinbutton: Locator;
  readonly venderSpinbutton: Locator;

  // Transaction action buttons
  readonly realizarCompraButton: Locator;
  readonly realizarVentaButton: Locator;

  constructor(page: Page) {
    super(page, 'https://sea-lion-app-7celq.ondigitalocean.app');
    this.savingsBalance = page.getByRole('complementary').locator('p').nth(1);
    // ...cada propiedad asignada acá, nunca dentro de un método de acción
  }
}
```

No hace falta ningún archivo ni estructura extra para lograr esto — alcanza
con la disciplina de declarar **todo** locator **fijo** como propiedad de la
clase, nunca como una llamada a `page.locator(...)` suelta dentro de un
método de acción.

## La excepción real: cuando el locator depende de un dato que no se conoce de antemano

La regla de arriba habla de locators *fijos* — los que apuntan siempre al
mismo elemento. `PortfolioPage` tiene otro tipo distinto, declarado en su
propia sección (`// --- Dynamic locator factories ---`):

```typescript
/** Returns a locator for any button by name (sidebar or available). */
assetButton(name: string): Locator {
  return this.page.getByRole('button', { name });
}

/** Returns a locator scoped to Mi portfolio section buttons only. */
portfolioAssetButton(name: string): Locator {
  return this.page.locator('.my-investments__items__name', { hasText: name });
}
```

Estos **no** son una violación de la regla — no se puede declarar como
propiedad fija un locator que depende de un argumento que todavía no existe
cuando se arma la clase (`name` llega recién cuando el test lo llama). La
distinción real es: **¿el locator es siempre el mismo elemento, o depende de
un dato que varía por llamada?** Lo primero va como propiedad en el
constructor; lo segundo, como un método que construye y devuelve el
`Locator` bajo demanda — y sigue siendo "centralizado", porque ese método
también vive en un solo lugar, no repetido en cada test que necesita buscar
un activo por nombre.

Que el método reciba `name` como parámetro es correcto sin importar qué
selector use adentro — pero *ese* selector sigue atado a la misma
limitación de siempre: sin `data-testid`, `assetButton` solo puede buscar
por el texto visible del botón, y `portfolioAssetButton` tiene que apoyarse
en una clase CSS para acotar la búsqueda a "Mi portfolio" porque no hay
forma semántica de distinguir esa sección. Acá se resolvió así porque la
app no es modificable para este ejercicio; qué pedirle a frontend para que
ninguna Page Object futura tenga que resolverlo así, y cómo quedaría este
mismo método con ese atributo ya en su lugar, se desarrolla en
[Data-attributes: el contrato con frontend](./09-data-attributes-con-frontend.md).

## A futuro: cuando el mismo selector cruza varias pantallas

Esta app tiene una sola pantalla, así que no se da el caso — pero en un
proyecto con más de una Page Object, es común que dos pantallas necesiten
el mismo selector (por ejemplo, un mensaje de error genérico que aparece en
varios formularios). Cuando eso pasa, extraerlo a un contrato compartido
entre pantallas empieza a tener sentido, en vez de duplicarlo en cada Page
Object. Esa es una herramienta para cuando la suite tenga varias Page
Objects en juego — no hace falta todavía con una sola pantalla.

**Siguiente:** [Data-attributes: el contrato con frontend](./09-data-attributes-con-frontend.md)
