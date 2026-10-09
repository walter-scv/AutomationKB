# Errores que se pagan caro

Errores comunes en una suite de automation, cada uno con su forma correcta
de resolverlo — nombrada acá mismo, sin asumir que ya se leyó en otra
entrada.

- **Lógica de negocio dentro del test** (parseos, loops, condicionales). Un
  test se lee como Arrange → Act → Assert. Esa lógica pertenece a la Page
  Object (la clase que sabe interactuar con la pantalla) o a un Helper
  (código compartido de lógica), nunca al test.

- **Timeouts mágicos.** `sleep(3000)` no documenta nada y es el primer
  sospechoso ante un test flaky — uno que falla de forma inconsistente sin
  que el comportamiento real haya cambiado. Usar constantes nombradas
  (`TIMEOUTS.standard`, vistas en [BasePage](./07-basepage.md)) que se
  ajustan en un solo lugar.

- **Datos fijos en un entorno compartido.** Un nombre de usuario o registro
  hardcodeado eventualmente colisiona con otra corrida. Datos únicos por
  ejecución, siempre — o, cuando no se puede controlar el dato (ver
  [Setup & Cleanup](./12-setup-and-cleanup.md)), medir el estado real en
  vez de asumirlo.

- **Un test que depende del anterior.** Si el test B solo pasa porque el
  test A corrió antes y dejó estado, no son dos tests independientes entre
  sí — es un test partido en dos archivos, frágil ante cualquier
  reordenamiento o corrida en paralelo.

- **Aflojar una aserción para que pase.** `toBeVisible()` → `toBeAttached()`,
  un match exacto que se vuelve un `contains`, un timeout agrandado para
  tapar un hang real. No arregla el test — lo deja en verde sin que ya esté
  cuidando nada.

## El contraejemplo real: documentar el bug, no esconderlo

El test `buying beyond available balance results in negative balance
(known bug)` en
[`project/tests/portfolio/portfolio.spec.ts`](../../project/tests/portfolio/portfolio.spec.ts)
es el caso real de qué hacer cuando la app tiene un bug confirmado — la app
permite comprar más de lo que el saldo disponible permite, dejando un saldo
negativo:

```typescript
test('buying beyond available balance results in negative balance (known bug) @p1 @portfolio', async ({ page }) => {
  // ARRANGE + ACT: ...compra una cantidad que excede el saldo disponible...

  // ASSERT — documenta el bug, no lo esconde
  await test.step('4- Validate balance is now negative (documents missing validation bug)', async () => {
    const balanceAfter = await portfolioPage.getSavingsBalance();
    expect(balanceAfter).toBeLessThan(0);              // ← afirma el bug, no lo esconde
    expect(balanceAfter).toBeLessThan(balanceBefore);
  });
});
// "(known bug)" en el título + el nombre del paso: nadie confunde esto con
// el comportamiento deseado. El día que se arregle la validación de saldo,
// ESTE test va a fallar — y esa falla es la señal correcta de actualizarlo.
```

**Siguiente:** no hay — esta es la última entrada de la introducción al
automation. Las próximas (risk-based testing, etc.) son independientes y
explican de nuevo lo que necesiten.
