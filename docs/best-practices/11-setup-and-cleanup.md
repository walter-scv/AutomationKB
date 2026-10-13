# Setup & Cleanup — dónde nace y muere la data

La regla general, independiente de cualquier proyecto puntual: **ningún
test crea sus propios datos sueltos, dentro del cuerpo del test.** Toda la
data que la suite necesita se arma en un único lugar conocido por todo el
equipo (una fixture, un script de setup, una llamada a API antes de que el
test arranque), y se limpia después — nunca a mano, nunca de forma
distinta test por test.

El problema que evita: datos creados de forma ad-hoc, que después nadie
sabe de dónde salieron ni si se pueden borrar sin romper otro test.

## Dónde se implementa: una fixture

El lugar correcto para un Setup/Cleanup reutilizable es la clase base de
tests (BaseTest) — así, cualquier test que la pida la recibe sin que nadie
tenga que importarla de otro lado.

## Cómo funciona `use()`: setup, pausa, cleanup

Toda fixture de Playwright tiene esta forma — un solo `use(...)`, llamado
una sola vez:

```typescript
miFixture: async ({ page }, use) => {
  // SETUP — todo lo que está antes de use()
  const creados = [];

  await use(async (dato) => {
    const id = await crear(dato);
    creados.push(id);
    return id;
  });
  // ↑ use() entrega ese valor al test y se PAUSA ACÁ, como un `yield`,
  //   hasta que el test completo termina (pase o falle). Recién ahí sigue.

  // CLEANUP — todo lo que está después de use()
  for (const id of creados.reverse()) {
    await eliminar(id);
  }
},
```

Nadie llama al Cleanup "a mano" — es, literalmente, el resto del código de
esa misma función, retomado en cuanto el test termina. Esto se puede
comprobar agregando un `console.log` a cada lado de `use()` y corriendo el
test: el log de Setup aparece, después corre el test entero, y recién
cuando termina aparece el log de Cleanup — nunca antes.

El molde generaliza a cualquier dato: crear algo y guardar una referencia
a lo creado (un id, un objeto completo), seguido de un loop que lo deshace
al final. Una fixture para usuarios, documentos o posiciones de un
portfolio tiene la misma forma — cambia solo qué se llama en cada mitad.

## Cómo armar el dato que se siembra

Si el dato que la fixture crea tiene más de un campo, y algunos tests
necesitan variar solo uno o dos, conviene un builder simple en vez de
armar el objeto literal cada vez — valores por default para lo que casi
nunca cambia, y un par de métodos encadenables para lo que sí varía:

```typescript
class RecordBuilder {
  private record = { id: 'default-id', amount: 1 };   // ← default razonable para el caso común

  forId(id: string): this {
    this.record.id = id;
    return this;                   // ← devuelve this: permite encadenar .forId().withAmount()
  }

  withAmount(amount: number): this {
    this.record.amount = amount;
    return this;
  }

  build() {
    return { ...this.record };
  }
}

const aRecord = () => new RecordBuilder();
```

`aRecord().withAmount(999)` dice "un registro de 999 unidades" y nada más —
el id es el que el builder ya asume. Si el dato que armás tiene un solo
campo que casi nunca cambia, ni este builder mínimo hace falta — un
objeto literal ya es claro de por sí.

## Cuándo el Cleanup automático no alcanza

Una fixture que revierte exactamente lo que creó solo es segura si el test
nunca vuelve a tocar ese mismo dato. Si el test además lo modifica (lo
compra y después lo vende, lo crea y después lo edita), la fixture ya no
sirve — terminaría revirtiendo algo que ya no está en el estado que
asume. En ese caso, Setup y Cleanup van a mano, en el cuerpo del test:
solo el test sabe en qué quedó el dato al final.

**La regla:** si el test no modifica lo que siembra, usá la fixture. Si lo
modifica, Setup y Cleanup van en el mismo test.

## Medir el estado real, no asumirlo

Sembrar un escenario conocido no significa poder asumir valores fijos en
el assert después de actuar sobre él. Si el valor esperado depende de un
dato semilla (un precio, un saldo inicial), fijarlo a mano ata el test a
ese dato exacto — el día que cambie, el test se rompe sin que el
comportamiento real haya cambiado. Medir el estado real al principio, y
comparar el *cambio* en vez de un valor fijo, desacopla el test de ese
detalle.

## Así se ve en el proyecto real

"Show me the money!" tiene una API real para mutar datos — `POST /api/buy`
y `POST /api/sell`, ambos esperan `{ itemId, amount }`. El builder real,
[`project/helpers/order.builder.ts`](../../project/helpers/order.builder.ts):

```typescript
// helpers/order.builder.ts
import { Order } from './api';

class OrderBuilder {
  private order: Order = {
    itemId: process.env.ASSET_PRIMARY_ID ?? 'a1',   // Ternium Argentina — default asset for the common case
    amount: 1,
  };

  forAsset(itemId: string): this {
    this.order.itemId = itemId;
    return this;
  }

  withAmount(amount: number): this {
    this.order.amount = amount;
    return this;
  }

  build(): Order {
    return { ...this.order };
  }
}

export const anOrder = () => new OrderBuilder();
```

El default lee una variable de entorno en vez de un valor fijo — por qué,
se desarrolla en [Parametrización de datos](./10-parametrizacion-de-datos.md);
acá lo único que importa es que sigue siendo *un* default, declarado una
sola vez.

La fixture real que lo usa es `seedPosition`, en
[`tests/base-test.ts`](../../project/tests/base-test.ts) — el mismo
archivo del que ya se habla en [BaseTest](./09-basetest.md):

```typescript
// tests/base-test.ts
export const test = base.extend<{
  seedPosition: (order: Order) => Promise<void>;
}>({
  seedPosition: async ({ page }, use) => {
    const seeded: Order[] = [];

    await use(async (order) => {
      await buyAsset(page.request, order);
      seeded.push(order);
    });

    for (const order of seeded.reverse()) {
      await sellAsset(page.request, order);
    }
  },
});
```

Esto se verificó agregando un log a cada lado de `use()` y corriendo el
test real — en la terminal, en este orden exacto:

```
SETUP: buying { itemId: 'a3', amount: 50 }
                ← acá corre todo el test (navigate, click, expect...)
CLEANUP: selling { itemId: 'a3', amount: 50 }
```

Y así se usa en un test real,
[`portfolio.spec.ts`](../../project/tests/portfolio/portfolio.spec.ts):

```typescript
test('a seeded position shows the right unit count @p1 @portfolio', async ({ page, seedPosition }) => {
  const portfolioPage = new PortfolioPage(page);

  // ARRANGE — Setup completo ANTES de abrir la app: lee la posición actual
  // por API, y recién ahí siembra 50 unidades más vía la fixture.
  const secondaryAssetId = process.env.ASSET_SECONDARY_ID ?? 'a3';
  const unitsBefore = await getUnits(page.request, secondaryAssetId);

  await test.step('1- Seed 50 extra Aluar units via the API', async () => {
    await seedPosition(anOrder().forAsset(secondaryAssetId).withAmount(50).build());
  });

  // ACT — el único navigate() de todo el test: la app abre ya mostrando lo sembrado
  await test.step('2- User navigates and selects Aluar', async () => {
    await portfolioPage.navigate();
    await portfolioPage.portfolioAssetButton(process.env.ASSET_SECONDARY_NAME ?? 'Aluar').click();
    await expect(portfolioPage.detailCantidadAdquirida).toBeVisible();
  });

  // ASSERT
  await test.step('3- Validate units increased by exactly 50', async () => {
    expect(await portfolioPage.getUnitsOwned()).toBe(unitsBefore + 50);
  });
  // ...el test termina acá — el CLEANUP de arriba vende los 50 solo, nadie lo llama a mano
});
```

Notá dos cosas. Primero, el `anOrder().forAsset(secondaryAssetId)` del paso 1 —
Aluar no es el default del builder (ese es Ternium Argentina), así que acá
sí hace falta decirlo explícito; en el contraejemplo de abajo, que compra
el activo por default, ningún test llama a `.forAsset(...)`. Segundo, el
orden: todo el Setup —leer y sembrar— pasa antes del único `navigate()`.
Si el test abriera la app primero y sembrara después, esa página ya
cargada no se enteraría del cambio (hecho por fuera, vía API) sin un
segundo `navigate()` para refrescarla — un parche evitable con solo
invertir el orden.

El contraejemplo real de "cuándo la fixture no alcanza": el mismo archivo
tiene un test que compra 999 unidades (el default del builder, por eso no
llama a `.forAsset(...)`) y después vende casi todas, dejando 1. Como ese
test sí opera sobre lo que siembra, hace su propio Setup y Cleanup en el
cuerpo, con las mismas `buyAsset`/`sellAsset`:

```typescript
// ARRANGE — Setup explícito en el test, no vía fixture: este test sí opera
// sobre la posición que siembra.
await buyAsset(page.request, anOrder().withAmount(999).build());
// ...navega, vende casi todo, valida que queda 1 unidad...

// CLEANUP — vende la última unidad, en el mismo test que la compró.
await sellAsset(page.request, anOrder().withAmount(1).build());
```

Y el caso real de medir en vez de asumir:

```typescript
// ❌ Asumir el valor semilla de hoy — se rompe el día que cambie el dato de demo:
expect(await portfolioPage.getSavingsBalance()).toBeCloseTo(42000 - price, 2);

// ✅ Lo que hace el test real — mide el "antes", no lo asume:
const balanceBefore = await portfolioPage.getSavingsBalance();
const expectedBalance = portfolioPage.getExpectedBalanceAfterPurchase(balanceBefore, 1, price);
expect(await portfolioPage.getSavingsBalance()).toBeCloseTo(expectedBalance, 2);
```

**Siguiente:** [Otras formas de escribir tests](./12-otras-formas-de-escribir-tests.md)
