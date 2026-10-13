# Anatomía de un test

## Lo mínimo que tiene que tener un test

Ya vimos qué es una Page Object y de dónde hereda — ahora toca mirar la
estructura del test en sí, el que termina usándola. En su forma más
simple, un test tiene tres partes — conocidas como **AAA**:

```typescript
test('clicking Buy increases units owned', async ({ page }) => {
  // ARRANGE — preparar lo necesario
  const dashboardPage = new DashboardPage(page);
  await dashboardPage.navigate();

  // ACT — hacer la acción que se quiere probar
  await dashboardPage.fillQuantity(1);
  await dashboardPage.clickBuy();

  // ASSERT — verificar el resultado
  expect(await dashboardPage.getUnitsOwned()).toBe(1);
});
```

Arrange prepara el escenario, Act hace la acción, Assert verifica el
resultado. Si un test no se puede dividir limpiamente en esas tres partes,
casi siempre es señal de que está probando más de una cosa a la vez — y
debería ser dos tests, no uno.

## Agregando lo que hace falta en una suite real

El ejemplo de arriba alcanza para entender AAA, pero le faltan cosas que
una suite real necesita: identificar cuán crítico es el test, y dejar un
rastro de qué pasó paso a paso cuando algo falla. Así se ve este mismo caso
en el proyecto real,
[`project/tests/portfolio/portfolio.spec.ts`](../../project/tests/portfolio/portfolio.spec.ts) —
con los comentarios `ARRANGE`/`ACT`/`ASSERT` explícitos, tal como exige la
convención documentada del proyecto:

```typescript
test.describe('Portfolio @portfolio', () => {

  test('buy existing portfolio asset increases units and decreases balance @smoke @p0 @portfolio', async ({ page }) => {
    const portfolioPage = new PortfolioPage(page);

    // ARRANGE — navega, selecciona el activo, y lee el estado "antes"
    await test.step('1- User navigates to the app', async () => {
      await portfolioPage.navigate();
    });

    const balanceBefore = await portfolioPage.getSavingsBalance();

    await test.step('2- User selects Ternium Argentina from Mi portfolio', async () => {
      await portfolioPage.terniumArgentinaButton.click();
      await expect(portfolioPage.detailCantidadAdquirida).toBeVisible();
    });

    const unitsBefore = await portfolioPage.getUnitsOwned();

    // ACT
    await test.step('3- User enters quantity 1 and clicks Realizar compra', async () => {
      await portfolioPage.fillComprar(1);
      await portfolioPage.clickRealizarCompra();
    });

    // ASSERT
    await test.step('4- Validate units increased by 1', async () => {
      expect(await portfolioPage.getUnitsOwned()).toBe(unitsBefore + 1);
    });
  });

});
```

> El test real en `portfolio.spec.ts` tiene un paso 4 más largo — también
> valida que el saldo bajó y que el spinbutton volvió a 0. Lo recorté acá
> a una sola verificación para enfocar en la estructura, no en todo lo que
> se puede validar a la vez; podés ver el paso 4 completo en el archivo.

## Qué se agregó respecto del ejemplo mínimo, y por qué

- **`describe` con un tag de feature** (`@portfolio`): agrupa todos los
  tests de esta pantalla bajo un filtro que se puede correr aparte — se
  desarrolla en [Tags y cómo correr subsets](./17-tags-y-subsets.md).

- **El título es una oración completa + tags.** Dice exactamente qué
  verifica sin tener que abrir el archivo. `@smoke @p0` son los tags que
  permiten decidir qué correr y cuándo.

- **`test.step()` con pasos numerados**, en vez de comentarios sueltos.
  Cada paso aparece así, numerado, en el reporte (HTML de Playwright y
  Allure). Cuando el test falla, el reporte dice "falló en el paso 3", no
  solo "falló en algún lado de la línea 40".

- **ARRANGE no es un bloque único — abarca dos pasos y dos lecturas de
  estado.** `balanceBefore` se lee después del paso 1 pero antes del paso
  2, y `unitsBefore` se lee después del paso 2 pero antes del ACT. Todo eso
  sigue siendo preparación: ninguna de esas lecturas es la acción que el
  test está probando (comprar), son el estado de partida contra el que
  después se compara. AAA es sobre el **orden de las ideas**, no una
  plantilla rígida de tres párrafos consecutivos — y no todos los tests del
  archivo real tienen esta misma forma: el primer test
  (`portfolio page overview...`) arranca con dos pasos que son **ASSERT sin
  ningún ACT previo** (verifican cómo se ve la pantalla recién cargada),
  y solo después aparece un ACT (clickear un activo) seguido de su propio
  ASSERT. Un test puede tener una verificación inicial de precondición
  antes de su primer ACT — eso también es AAA, con el Arrange haciendo un
  poco más de trabajo.

## Qué hace bueno a un ASSERT

No alcanza con que un assert exista — tiene que decir algo preciso. Tres
reglas, visibles en el bloque de arriba:

1. **Comparar contra un valor calculado, nunca contra un número puesto a
   mano.** `expect(await portfolioPage.getUnitsOwned()).toBe(unitsBefore + 1)`
   compara contra "lo que había antes, más uno" — no contra `toBe(11)` a
   secas. Un número mágico como `11` solo es correcto *hoy*, con el dato de
   *esta* cuenta; `unitsBefore + 1` es correcto siempre, sin importar desde
   qué cantidad arrancó la cuenta real.

2. **Usar el matcher que corresponde al tipo de dato.** `toBe()` es
   igualdad exacta — perfecta para el conteo de unidades (un entero). El
   paso 4 completo del archivo real también compara el saldo, un número con
   decimales, y ahí usa `toBeCloseTo(expectedBalance, 2)` en vez de `toBe()`
   — los números de punto flotante acumulan errores de redondeo minúsculos
   (`0.1 + 0.2` no da exactamente `0.3` en la mayoría de los lenguajes), y
   `toBeCloseTo` con 2 decimales tolera esa diferencia invisible sin dejar
   de detectar un error real de cálculo.

3. **Un assert por cada cosa que importa, no una sola aserción gigante
   que prueba de todo.** El paso 4 real tiene varios `expect` — uno para
   unidades, otro para saldo, otro para el spinbutton — en vez de un solo
   chequeo combinado. Si el saldo estuviera mal pero las unidades bien, el
   reporte señala exactamente cuál de las dos cosas falló, no "algo en el
   paso 4 no cerró".

## Lo que un test nunca debería necesitar

Si para escribir una aserción tenés que calcular algo primero —parsear un
texto, sumar, convertir un formato— esa lógica no pertenece acá.
`unitsBefore`, igual que el saldo esperado que usa el paso 4 completo, son
valores que la Page Object ya entrega listos para comparar (ver
[Page Object Model](./04-page-object-model.md)). El test compara; no
calcula — y el caso real de [Estructura y capas](./02-estructura-y-capas.md)
muestra qué pasa cuando esa regla no se respetó.

**Siguiente:** [Centralizando los selectores](./07-centralizando-selectores.md)
