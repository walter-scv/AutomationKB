# Las piezas de una suite de tests

Una suite de automation madura separa el código en capas, cada una con una
única responsabilidad:

```
Test               → Arrange / Act / Assert. Lenguaje de negocio. Cero lógica.
Page Object        → Sabe interactuar con una pantalla. Expone acciones, no selectores.
Helper / Service   → Lógica compartida: llamadas a API, cálculos, formateo.
Data / Fixture     → Qué datos existen antes de que el test arranque.
```

El error más común en una suite nueva es mezclar las dos primeras: el test
busca elementos y parsea datos él mismo, en vez de pedirle esas dos cosas a
la Page Object.

## El error más común: Test y Page Object mezclados

```typescript
// ❌ El test sabe el selector Y sabe parsear el formato de la app:
test('user sees their balance', async ({ page }) => {
  await page.goto('https://sea-lion-app-7celq.ondigitalocean.app');
  const text = await page.getByRole('complementary').locator('p').nth(1).textContent();
  const balance = parseFloat(text?.replace(/\$|\./g, '').replace(',', '.') ?? '0');
  expect(balance).toBeGreaterThan(0);
});
```

```typescript
// ✅ El test solo pide y compara; la Page Object sabe cómo y dónde:
test('user sees their balance', async ({ page }) => {
  const portfolioPage = new PortfolioPage(page);  // la clase que sabe interactuar con esta pantalla
  await portfolioPage.navigate();
  expect(await portfolioPage.getSavingsBalance()).toBeGreaterThan(0);
});
```

Nada en la segunda versión depende de cómo está armado el DOM ni de en qué
formato la app muestra los números — eso vive adentro de `PortfolioPage`
(se desarrolla en [Page Object Model](./06-page-object-model.md)).

## Las otras dos capas, brevemente

No hace falta profundizarlas todavía — solo saber dónde buscarlas cuando
haga falta:

- **Helper / Service**: código compartido que no es "interactuar con una
  pantalla" ni "lógica de un test puntual". El ejemplo real de esta base son
  las llamadas directas a la API (`buyAsset`, `sellAsset` en
  [`project/helpers/api.ts`](../../project/helpers/api.ts)) que un test usa
  para sembrar una posición antes de arrancar — no pertenecen al test (se
  repetirían en cada uno que necesite sembrar datos) ni a ninguna Page
  Object en particular (no son específicas de una pantalla). Se desarrolla
  en [Setup & Cleanup](./12-setup-and-cleanup.md).
- **Data / Fixture**: qué tiene que existir antes de que el test arranque.
  Se desarrolla en [Setup & Cleanup](./12-setup-and-cleanup.md).

## Chequeo rápido para auditar una suite existente

Leé un test tapando el código de la Page Object que usa. Si se entiende qué
verifica sin necesitar ver esa implementación, la separación está
funcionando. Si en cambio encontrás un selector, una expresión regular, o
una cuenta matemática escritos directo en el test, esa pieza vive en la
capa equivocada.

**Siguiente:** [Anatomía de un test](./05-anatomia-de-un-test.md)
