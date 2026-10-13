# Estructura de un proyecto de automation: carpetas y capas

Un proyecto de automation maduro separa su código en piezas con una única
responsabilidad cada una — nunca todo junto en un solo archivo o carpeta,
donde encontrar algo depende de recordar dónde quedó. Esa separación se ve
en dos niveles a la vez, y son la misma idea: en qué **carpeta** vive cada
cosa, y qué **capa** lógica cumple.

## El árbol de carpetas, en un proyecto real

Así se ve en `project/` (raíz de este repo) — la suite E2E de "Show me the
money!", una app de inversiones personales:

```
project/
├── pages/                  ← Page Objects (patrón en una próxima entrada)
│   ├── BasePage.ts          clase base de la que heredan todas las pantallas
│   └── PortfolioPage.ts     la única pantalla de esta app
├── tests/
│   ├── base-test.ts         fixture de test extendido (BaseTest)
│   └── portfolio/
│       └── portfolio.spec.ts
├── helpers/                 lógica compartida que no es ni Page Object ni test
│   ├── index.ts              barrel export
│   ├── api.ts                 llamadas directas a la API (buyAsset, sellAsset)
│   └── order.builder.ts       builder para sembrar datos (ver Setup & Cleanup)
├── docs/specs/               documentación de producto (no de implementación)
│   └── portfolio.md
├── .github/
│   ├── workflows/            CI/CD
│   └── actions/               pasos reusables entre workflows
├── playwright.config.ts
├── package.json
├── tsconfig.json
└── .env.example
```

## Las 4 capas que esa estructura refleja

```
Test               → Arrange / Act / Assert. Lenguaje de negocio. Cero lógica.
Page Object        → Sabe interactuar con una pantalla. Expone acciones, no selectores.
Helper / Service   → Lógica compartida: llamadas a API, cálculos, formateo.
Data / Fixture     → Qué datos existen antes de que el test arranque.
```

Cada carpeta de arriba es, directamente, una de estas capas: `pages/` es
la capa Page Object, `tests/` es la capa Test, `helpers/` es la capa
Helper/Service. La única que no tiene carpeta propia es Data/Fixture —
porque no es algo que viva en disco antes de correr, sino algo que se
arma en el momento (una fixture, una llamada a la API antes de que el
test arranque); se desarrolla en
[Setup & Cleanup](./11-setup-and-cleanup.md).

Dos razones más, propias de una carpeta puntual y no de la separación
general:

- **`docs/specs/` vive en el repo, versionado junto al código.** La
  documentación de qué hace la app (casos de uso, bugs conocidos) queda al
  lado del test que la verifica, no en un doc separado que se desactualiza
  sin que nadie lo note.
- **Nada de datos de prueba sembrados en disco** — esta app no necesita un
  `setup.ts` que corra antes de toda la suite: cada test siembra lo
  puntual que necesita llamando a la API directo, vía `helpers/` (más
  sobre esto en la entrada de Setup & Cleanup).

## El error más común: Test y Page Object mezclados

```typescript
// ❌ El test sabe el selector Y sabe parsear el formato de la pantalla:
test('user sees their balance', async ({ page }) => {
  await page.goto('/dashboard');
  const text = await page.locator('.balance').textContent();
  const balance = parseFloat(text?.replace(/[^0-9.,-]/g, '').replace(',', '.') ?? '0');
  expect(balance).toBeGreaterThan(0);
});
```

El test busca el selector, conoce la estructura del DOM, y parsea el
formato de la pantalla — tres responsabilidades ajenas a la única que le
corresponde a un test: verificar un resultado de negocio. Cómo se resuelve
(una clase dedicada que sabe interactuar con esa pantalla, y a la que el
test solo le pide resultados) es, en sí mismo, suficiente contenido para
su propia entrada: se desarrolla en
[Page Object Model](./04-page-object-model.md).

## Chequeo rápido para auditar una suite existente

Leé un test tapando el código de la Page Object que usa. Si se entiende qué
verifica sin necesitar ver esa implementación, la separación está
funcionando. Si en cambio encontrás un selector, una expresión regular, o
una cuenta matemática escritos directo en el test, esa pieza vive en la
capa equivocada.

**Siguiente:** [Configuración base del proyecto](./03-configuracion-base.md)
