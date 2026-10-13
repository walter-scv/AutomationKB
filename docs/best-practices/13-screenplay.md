# Screenplay — cuando Page Object se queda chico

Una evolución de Page Object pensada para suites con muchos roles de
usuario distintos operando sobre las mismas pantallas. En vez de una clase
por *pantalla*, se modelan **actores** con **habilidades** que realizan
**tareas** — independientes de qué pantalla las ejecuta. Esto importa
cuando dos roles distintos necesitan la misma habilidad de negocio (por
ejemplo, "comprar un activo") pero cada uno la ejecuta desde una pantalla
diferente: con Page Object puro, esa habilidad termina duplicada entre las
dos clases; con Screenplay, una única Task la define una sola vez, y
cualquier actor con la Ability necesaria la reutiliza.

Vale la pena conocerlo de nombre; adoptarlo de entrada en una suite de una
sola pantalla y un solo rol sería más complejidad de la que hace falta.

## Por qué esta base no lo necesita, y cómo se vería si lo necesitara

"Show me the money!" tiene un solo rol (el Inversor) y una sola pantalla —
por eso `PortfolioPage` le alcanza y de sobra. Pero si esta app agregara,
por ejemplo, un rol de "Asesor" que opera sobre la cartera de varios
clientes desde un panel distinto, Screenplay empezaría a tener sentido: un
actor "Inversor" que sabe "comprar un activo" y un actor "Asesor" que
también sabe "comprar un activo" — la misma habilidad, reutilizada entre
dos roles, sin importar si cada uno la ejecuta desde una pantalla distinta.

"Conocerlo de nombre" no alcanza para poder usarlo el día que haga falta —
así se vería, con el mismo dominio de esta base (comprar un activo), si
"Show me the money!" tuviera el rol de Asesor que justifica el patrón:

```typescript
// screenplay/abilities/BrowseTheApp.ts
// Una Ability es "algo que un actor puede hacer con una herramienta" — acá, con un Page.
class BrowseTheApp {
  constructor(private page: Page) {}
  static using(page: Page) {
    return new BrowseTheApp(page);
  }
}

// screenplay/tasks/BuyAsset.ts
// Una Task es un paso de negocio, independiente de qué actor la ejecuta.
class BuyAsset {
  private constructor(private assetName: string, private quantity: number) {}

  static called(assetName: string, quantity: number) {
    return new BuyAsset(assetName, quantity);
  }

  async performAs(actor: Actor): Promise<void> {
    const { page } = actor.abilityTo(BrowseTheApp);
    const portfolioPage = new PortfolioPage(page);           // ← reutiliza el Page Object ya existente
    await portfolioPage.assetButton(this.assetName).click();
    await portfolioPage.fillComprar(this.quantity);
    await portfolioPage.clickRealizarCompra();
  }
}

// screenplay/Actor.ts
class Actor {
  private abilities = new Map();
  static named(name: string) { return new Actor(name); }
  whoCan(ability: BrowseTheApp): this { this.abilities.set(BrowseTheApp, ability); return this; }
  abilityTo(AbilityClass: typeof BrowseTheApp) { return this.abilities.get(AbilityClass); }
  async attemptsTo(task: BuyAsset): Promise<void> { await task.performAs(this); }
}
```

Y así se leería un test con esto:

```typescript
test('advisor buys an asset on behalf of a client', async ({ page }) => {
  const advisor = Actor.named('Asesor').whoCan(BrowseTheApp.using(page));

  await advisor.attemptsTo(BuyAsset.called('Ternium Argentina', 5));

  // ...assert...
});
```

`BuyAsset` no pertenece a ninguna pantalla — la podría ejecutar un actor
"Inversor" o un actor "Asesor" por igual, cada uno con sus propias
`Abilities`, sin duplicar el paso. Con `PortfolioPage` sola, esa misma
secuencia de clicks tendría que repetirse (o copiarse) en cada clase de
página que necesite comprar un activo.

**Siguiente:** [Sesión reutilizada / autenticación](./14-sesion-reutilizada.md)
