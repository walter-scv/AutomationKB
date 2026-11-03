import type {MatchItem} from '@site/src/components/Match';
import type {CodeLine} from '@site/src/components/FindInCode';
import type {BuilderStep} from '@site/src/components/CommandBuilder';
import type {QuizQuestion} from '@site/src/components/Quiz';

export const WANT_LEFT: MatchItem[] = [
  {id: 'value', text: 'El campo Cantidad tiene escrito 2.'},
  {id: 'text', text: 'El resumen dice exactamente «Total: $ 90.000».'},
  {id: 'contain', text: 'El aviso de envío menciona «llega el jueves», entre otros datos.'},
  {id: 'count', text: 'Quedaron tres productos en el carrito.'},
  {id: 'checked', text: 'La casilla «Envolver para regalo» quedó marcada.'},
  {id: 'disabled', text: 'El botón Pagar no se puede usar todavía.'},
  {id: 'url', text: 'La página pasó a la confirmación del pedido.'},
  {id: 'hidden', text: 'El aviso de error ya no se muestra.'},
];
export const WANT_RIGHT: MatchItem[] = [
  {id: 'hidden', text: '`toBeHidden()`'},
  {id: 'count', text: '`toHaveCount(3)`'},
  {id: 'url', text: '`toHaveURL(/\\/pedido\\/confirmado/)`'},
  {id: 'value', text: "`toHaveValue('2')`"},
  {id: 'disabled', text: '`toBeDisabled()`'},
  {id: 'contain', text: "`toContainText('llega el jueves')`"},
  {id: 'checked', text: '`toBeChecked()`'},
  {id: 'text', text: "`toHaveText('Total: $ 90.000')`"},
];
export const WANT_WHY: Record<string, string> = {
  value: 'Lo escrito en un campo es su valor, no su texto: `toHaveValue`.',
  text: '`toHaveText` compara el texto completo del elemento.',
  contain: 'Si importa solo una parte del texto, `toContainText`.',
  count: '`toHaveCount` verifica cuántos elementos encuentra el locator, y reintenta hasta que coincida.',
  checked: 'El estado de una casilla se verifica con `toBeChecked`.',
  disabled: '`toBeDisabled` verifica que el control no se pueda usar.',
  url: 'La dirección es de la página, no de un elemento: `expect(page).toHaveURL(...)`.',
  hidden: '`toBeHidden` reintenta hasta que el elemento deje de verse.',
};

export const ASSERT_RULE_LABELS = [
  'No reintenta: es una manual assertion',
  'Compara contra un valor que depende de los datos de hoy',
  'Está aflojada: ya no verifica lo que tenía que verificar',
];
export const ASSERT_LINES: CodeLine[] = [
  {
    code: "expect(await page.getByText('Pedido confirmado').isVisible()).toBe(true);",
    rule: 1,
    why: '`isVisible()` mira una sola vez. Si el mensaje aparece unos milisegundos después, el test falla aunque la compra funcione.',
    hint: '¿Qué pasa si el mensaje tarda medio segundo en aparecer?',
  },
  {
    code: "await expect(page.getByRole('listitem')).toHaveCount(antes - 1);",
    rule: 0,
    why: 'Es web-first y compara contra un valor calculado a partir del estado real al empezar.',
    hint: '¿De dónde sale el número esperado?',
  },
  {
    code: "await expect(page.getByText('Pedido confirmado')).toBeAttached(); // en el último cambio reemplazó a toBeVisible()",
    rule: 3,
    why: '`toBeAttached` solo exige que el elemento exista en el DOM. Si el mensaje queda oculto, el test pasa igual.',
    hint: '¿Qué diferencia hay entre existir en el DOM y verse?',
  },
  {
    code: "await expect(page.getByTestId('stock')).toHaveText('Quedan 7 unidades'); // el stock lo modifican también las compras reales",
    rule: 2,
    why: 'El 7 sale del stock de hoy. Mañana el stock es otro y el test falla sin que la compra esté rota. Hay que leer el stock al empezar y comparar el cambio.',
    hint: '¿Ese 7 sigue siendo correcto mañana?',
  },
  {
    code: 'const subtotal = 90000; expect(subtotal * 1.21).toBeCloseTo(108900, 2);',
    rule: 0,
    why: 'Es un valor ya calculado en el propio test, con decimales: una assertion genérica con `toBeCloseTo` es lo indicado.',
    hint: '¿Este valor está en la página o en una variable del test?',
  },
  {
    code: "await expect(page.locator('#total')).toContainText('$'); // en el último cambio reemplazó a toHaveText('Total: $ 90.000')",
    rule: 3,
    why: 'Cualquier total con un signo pesos pasa. Ya no verifica el monto, que era lo importante.',
    hint: '¿Qué total haría fallar esta assertion?',
  },
  {
    code: "const envio = await page.locator('#envio').textContent(); expect(envio).toBe('Llega el jueves');",
    rule: 1,
    why: 'Lee el texto una vez y lo compara después: si el aviso se actualiza un instante más tarde, el test falla. `toHaveText` reintentaría.',
    hint: '¿Esta comparación vuelve a intentar si el texto todavía no cambió?',
  },
  {
    code: "await expect(page.getByLabel('Cantidad')).toHaveValue('2');",
    rule: 0,
    why: 'Web-first, sobre el valor del campo y con el dato que el propio test escribió.',
    hint: '¿Reintenta? ¿Compara contra algo que controla el test?',
  },
  {
    code: "await expect(page.getByRole('row')).toHaveCount(12); // la cuenta de prueba la usa todo el equipo",
    rule: 2,
    why: 'Cada corrida y cada persona que usa la cuenta suma pedidos: el 12 es correcto solo hoy.',
    hint: '¿La cantidad de pedidos de esa cuenta es siempre la misma?',
  },
];

export const ASSERT_PREFIX = 'await ';
export const ASSERT_STEPS: BuilderStep[] = [
  {options: ['expect', 'assert', 'expect.soft'], correct: 'expect.soft', hint: 'Con esa forma, un fallo detiene el test, o no es una función de Playwright: el test tiene que seguir verificando los demás datos de la pantalla.'},
  {options: ["(await page.getByLabel('Cantidad').inputValue())", "(page.getByLabel('Cantidad'))", "(page.getByText('Cantidad'))"], correct: "(page.getByLabel('Cantidad'))", hint: 'Eso no es un locator del campo, o lee el valor una sola vez y pierde el reintento.'},
  {options: [".toBe('3')", ".toHaveText('3')", ".toHaveValue('3')"], correct: ".toHaveValue('3')", hint: 'Lo escrito en un campo no es su texto, y `toBe` es una comparación genérica.'},
];
export const ASSERT_EXPLANATION =
  "`await expect.soft(page.getByLabel('Cantidad')).toHaveValue('3')` reintenta sobre el valor del campo y, si falla, deja que el test siga verificando el resto de la pantalla.";

export const SHOP_OUTPUT = `✘ 1 ... › agregar dos veces deja
  el carrito en 2 (132ms)
✘ 2 ... › la ficha muestra nombre
  y carrito vacío (10.1s)

1) agregar dos veces deja el
   carrito en 2
Error: expect(received).toBe(expected)
Expected: "2"
Received: "0"

2) la ficha muestra nombre y
   carrito vacío
Error: expect(locator).toHaveText
Locator:  getByRole('heading')
Expected: "Mochila escolar"
Received: "Mochila urbana"
  - Expect "soft toHaveText" ...
Error: expect(locator).toHaveText
Locator:  locator('#n')
Expected: "1"
Received: "0"
  - Expect "soft toHaveText" ...`;

export const SHOP_QUIZ: QuizQuestion[] = [
  {
    question: "El test 1 hace dos clicks en «Agregar al carrito» y termina con `expect(await page.locator('#n').textContent()).toBe('2')`. Cada click actualiza el contador 200 ms después. ¿Por qué falló con `Received: \"0\"`?",
    options: [
      {text: 'Porque los clicks no funcionaron.', correct: false, why: 'Funcionaron, pero el contador se actualiza 200 ms después, y el test leyó antes.'},
      {text: 'Porque leyó el contador una sola vez, antes de que se actualizara.', correct: true, why: 'Es una manual assertion: `textContent()` se lee en el momento y `toBe` no reintenta. Con `toHaveText(\'2\')` habría esperado.'},
      {text: 'Porque `toBe` no compara textos.', correct: false, why: '`toBe` compara cualquier valor. El problema es cuándo se leyó.'},
    ],
  },
  {
    question: 'El test 2 tiene tres assertions: dos `expect.soft` y una `expect` común al final. ¿Qué muestra la salida?',
    options: [
      {text: 'Que fallaron las dos soft y el test siguió hasta la última, que pasó.', correct: true, why: 'Los dos errores se listan en el mismo test, marcados «soft». Si la última hubiera fallado, habría un tercer error.'},
      {text: 'Que fallaron las tres assertions.', correct: false, why: 'Hay dos errores, los dos de assertions soft.'},
      {text: 'Que el test se detuvo en la primera soft.', correct: false, why: 'Si se hubiera detenido, no aparecería el segundo error.'},
    ],
  },
  {
    question: 'El segundo error del test 2 compara el contador con «1». La ficha abre con el carrito vacío. ¿Dónde está el problema?',
    options: [
      {text: 'En la aplicación: el contador debería empezar en 1.', correct: false, why: 'El título del test dice «carrito vacío»: lo esperable es 0, y eso muestra la página.'},
      {text: 'En el timeout: 5 segundos no alcanzaron.', correct: false, why: 'El contador mostró «0» durante todo el plazo: esperar más no lo cambia.'},
      {text: 'En el test: el valor esperado contradice su propio título.', correct: true, why: '`Received: "0"` es lo correcto para un carrito vacío. El dato esperado del test está mal.'},
    ],
  },
];
