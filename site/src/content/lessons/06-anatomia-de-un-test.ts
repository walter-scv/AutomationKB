import type {CodeLine} from '@site/src/components/FindInCode';
import type {OrderItem, OrderRule} from '@site/src/components/Order';
import type {QuizQuestion} from '@site/src/components/Quiz';

// Actividad "Ordená AAA" — mismo ejemplo de la sección teórica, con los
// comentarios // ARRANGE / // ACT / // ASSERT como ítems a ordenar también,
// para que el ejercicio verifique la estructura AAA en sí, no solo el
// orden lógico de uso de la app (eso no probaría que entendiste AAA).
export const AAA_ORDER_ITEMS: OrderItem[] = [
  {id: 'assert', what: 'Verifica que haya una unidad más que antes', code: 'expect(await dashboardPage.getUnitsOwned()).toBe(1);'},
  {id: 'h-act', what: 'Marca dónde empieza la acción que se quiere probar', code: '// ACT', kind: 'header'},
  {id: 'fill', what: 'Escribe la cantidad a comprar', code: 'await dashboardPage.fillQuantity(1);'},
  {id: 'h-assert', what: 'Marca dónde empieza la verificación', code: '// ASSERT', kind: 'header'},
  {id: 'new', what: 'Crea la Page Object', code: 'const dashboardPage = new DashboardPage(page);'},
  {id: 'buy', what: 'Confirma la compra', code: 'await dashboardPage.clickBuy();'},
  {id: 'h-arrange', what: 'Marca dónde empieza la preparación', code: '// ARRANGE', kind: 'header'},
  {id: 'nav', what: 'Entra a la app', code: 'await dashboardPage.navigate();'},
];

export const AAA_ORDER_CORRECT = ['h-arrange', 'new', 'nav', 'h-act', 'fill', 'buy', 'h-assert', 'assert'];

export const AAA_ORDER_RULES: OrderRule[] = [
  {before: 'h-arrange', after: 'new', why: 'Arrange es lo primero: prepara todo antes de poder actuar.'},
  {before: 'new', after: 'nav', why: 'La Page Object se crea primero — todas las demás líneas la usan (dashboardPage…).'},
  {before: 'nav', after: 'h-act', why: 'Arrange termina antes de que empiece la acción que se quiere probar.'},
  {before: 'h-act', after: 'fill', why: 'Act es la acción: escribir la cantidad es parte de "actuar", no de preparar.'},
  {before: 'fill', after: 'buy', why: 'Dentro de Act: primero se escribe la cantidad, después se confirma la compra.'},
  {before: 'buy', after: 'h-assert', why: 'Act termina antes de verificar el resultado.'},
  {before: 'h-assert', after: 'assert', why: 'Assert va al final: compara algo que ya tuvo que pasar.'},
];

// Chequeo corto después de "De Arrange/Act a una Page Object".
export const PAGE_OBJECT_QUIZ: QuizQuestion[] = [
  {
    question: "Mañana el botón \"Buy\" cambia de texto a \"Confirmar compra\". ¿Qué hay que arreglar?",
    options: [
      {
        text: 'Todos los tests que hacen click en ese botón, uno por uno.',
        correct: false,
        why: 'Eso pasaría si cada test buscara el botón por su cuenta — exactamente el problema que resuelve una Page Object.',
      },
      {
        text: 'Solo clickBuy() dentro de DashboardPage — ningún test cambia.',
        correct: true,
        why: 'El selector vive en un solo lugar. Los tests llaman a clickBuy() sin saber cómo está hecho por dentro.',
      },
      {
        text: 'Ninguno — Playwright se actualiza solo.',
        correct: false,
        why: 'Playwright no adivina el texto nuevo del botón — alguien tiene que actualizar el selector en algún lado.',
      },
    ],
  },
];

// Ejemplo inventado (DashboardPage), el mismo que la sección teórica — ver
// CLAUDE.md, aprendizaje 2: las actividades priorizan que se entiendan por
// sí solas, no que usen la app real. El código real equivalente vive en
// project/pages/PortfolioPage.ts y project/tests/portfolio/portfolio.spec.ts,
// linkeado al final de la entrada.
export const FIND_PROBLEMS_LINES: CodeLine[] = [
  {
    code: "test('buying one unit increases units owned', async ({ page }) => {",
    rule: 0,
    why: 'Es la declaración del test. No rompe ninguna regla (los tags los vemos más adelante).',
  },
  {
    code: '  const dashboardPage = new DashboardPage(page);',
    rule: 0,
    why: 'Crear la Page Object es justamente lo que permite cumplir la regla 1.',
  },
  {
    code: '  await dashboardPage.navigate();',
    rule: 0,
    why: 'Entra a la app con un método de la Page Object. Correcto.',
  },
  {
    code: '  const balanceBefore = await dashboardPage.getBalance();',
    rule: 0,
    why: 'Anota el saldo de antes con un método de la Page Object, que ya lo devuelve como número.',
  },
  {
    code: "  await page.getByRole('button', { name: 'Buy' }).first().click();",
    rule: 1,
    why: 'Rompe la regla 1: arma su propio locator con page.getByRole(...) en vez de usar el que ya tiene la Page Object para ese botón. Si mañana cambia el botón, este test queda roto aunque la Page Object esté actualizada.',
    hint: 'Fijate cómo empieza la línea: ¿usa dashboardPage o page? Buscá en la tabla si la Page Object ya tiene algo para ese botón.',
  },
  {
    code: '  await expect(dashboardPage.unitsLabel).toBeVisible();',
    rule: 0,
    why: 'Parece sospechosa porque usa un locator dentro de un expect, pero está bien: el locator viene de la Page Object (regla 1) y verifica que el panel apareció antes de leer las unidades. Es una verificación de precondición.',
  },
  {
    code: '  const unitsBefore = await dashboardPage.getUnitsOwned();',
    rule: 0,
    why: 'Anota las unidades de antes, antes de comprar. Es el punto de partida que pide la regla 3.',
  },
  {
    code: '  const price = await dashboardPage.getPrice();',
    rule: 0,
    why: 'Lee el precio con un método de la Page Object, ya convertido a número. Correcto.',
  },
  {
    code: '  await dashboardPage.fillQuantity(1);',
    rule: 0,
    why: 'Escribe la cantidad con un método de la Page Object. Correcto.',
  },
  {
    code: '  await dashboardPage.clickBuy();',
    rule: 0,
    why: 'Confirma la compra con un método de la Page Object. Correcto.',
  },
  {
    code: '  expect(await dashboardPage.getUnitsOwned()).toBe(unitsBefore + 1);',
    rule: 0,
    why: 'El + 1 puede parecer un cálculo prohibido, pero no rompe la regla 2: no convierte ningún texto, solo arma el valor esperado a partir del punto de partida. Es exactamente lo que pide la regla 3.',
  },
  {
    code: "  const balance = Number((await dashboardPage.balanceLabel.textContent()).replace('$', ''));",
    rule: 2,
    why: 'Rompe la regla 2: toma el texto del saldo y lo convierte a número a mano. Eso ya lo hace getBalance(), que el test incluso usó antes. Como usa un locator de la Page Object, la regla 1 no la rompe.',
    hint: 'Usa un locator de la Page Object (dashboardPage.balanceLabel), así que no es la regla 1. Mirá qué hace con el texto que obtiene.',
  },
  {
    code: '  expect(balance).toBe(873.75);',
    rule: 3,
    why: 'Rompe la regla 3: 873.75 es el saldo que quedó hoy. Con otro saldo inicial, el test falla aunque la compra funcione. El test ya tiene balanceBefore y price para calcular el valor esperado.',
    hint: '¿Este número seguiría siendo correcto mañana, si la cuenta arranca con otro saldo?',
  },
  {
    code: '});',
    rule: 0,
    why: 'Es el cierre del test.',
  },
];

export const FIND_PROBLEMS_RULE_LABELS = [
  'Regla 1 — toca la pantalla directamente',
  'Regla 2 — convierte o parsea texto',
  'Regla 3 — compara contra un número fijo',
];

export const LESSON_06_QUIZ: QuizQuestion[] = [
  {
    question: 'Un test hace dos compras distintas (dos Act) y verifica cada una con su propio Assert. ¿Qué conviene?',
    options: [
      {text: 'Separarlo en dos tests — cada uno con su propio Arrange, Act y Assert.', correct: true, why: 'Si un test no se puede dividir limpio en AAA, casi siempre está probando más de una cosa a la vez.'},
      {text: 'Dejarlo así, total tiene sus asserts correspondientes.', correct: false, why: 'Si falla, el reporte no te dice cuál de las dos compras se rompió sin leer el detalle — son dos tests, no uno.'},
      {text: 'Agregar más test.step para ordenarlo mejor.', correct: false, why: 'Los pasos ayudan a leerlo, pero no resuelven que el test esté probando dos cosas a la vez.'},
    ],
  },
  {
    question: '¿Qué significa que la Page Object "no cambia la estructura AAA"?',
    options: [
      {text: 'Que Arrange y Act siguen haciendo lo mismo de siempre, solo que a través de la Page Object en vez de tocar la pantalla directo.', correct: true, why: 'El patrón de preparar/actuar/verificar no cambia — cambia únicamente cómo se habla con la pantalla.'},
      {text: 'Que ya no hace falta un Assert si usás Page Object.', correct: false, why: 'El Assert sigue siendo necesario — la Page Object no verifica nada por sí sola.'},
      {text: 'Que la Page Object reemplaza al Act.', correct: false, why: 'La Page Object es la herramienta que el Act usa, no un reemplazo de la acción en sí.'},
    ],
  },
  {
    question: '¿Cuál de estos asserts rompe la regla 3?',
    options: [
      {text: 'expect(await dashboardPage.getUnitsOwned()).toBe(6);', correct: true, why: '6 es el número de hoy. Mañana, con otra cantidad inicial, el test falla aunque la app funcione bien.'},
      {text: 'expect(await dashboardPage.getUnitsOwned()).toBe(unitsBefore + 1);', correct: false, why: 'Esto SÍ compara contra un valor calculado a partir del estado de antes — es justamente lo que pide la regla 3.'},
      {text: 'expect(await dashboardPage.getUnitsOwned()).toBeGreaterThan(0);', correct: false, why: 'No usa un número fijo arbitrario como "valor esperado" — aunque sea una verificación poco específica, no es el error que describe la regla 3.'},
    ],
  },
];
