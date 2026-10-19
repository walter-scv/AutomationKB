import type {CodeLine} from '@site/src/components/FindInCode';
import type {QuizQuestion} from '@site/src/components/Quiz';

export const MIXED_LAYERS_RULE_LABELS = ['Debería vivir en la Page Object', 'Debería vivir en un Helper'];

export const MIXED_LAYERS_LINES: CodeLine[] = [
  {code: "test('user sees their balance', async ({ page }) => {", rule: 0, why: 'Es la declaración del test — está bien.'},
  {code: '  const dashboardPage = new DashboardPage(page);', rule: 0, why: 'Crear la Page Object es trabajo del test: es lo que le permite pedirle cosas después.'},
  {
    code: "  await page.goto('/dashboard');",
    rule: 1,
    why: 'El test navega por su cuenta en vez de pedírselo a la Page Object (dashboardPage.navigate()). Si la URL cambia, hay que tocar cada test que la repite.',
    hint: '¿Quién debería saber cuál es la URL de esta pantalla?',
  },
  {
    code: "  const text = await page.locator('.balance').textContent();",
    rule: 1,
    why: 'El test busca el selector por su cuenta — justo lo que una Page Object existe para evitar.',
    hint: 'Buscar un elemento en la pantalla, ¿de quién es el trabajo?',
  },
  {
    code: "  const balance = parseFloat(text.replace(/[^0-9.,-]/g, '').replace(',', '.'));",
    rule: 2,
    why: 'El test convierte un texto con formato a número a mano — es lógica compartida, trabajo de un Helper, no del test.',
    hint: 'Convertir un texto con formato a un número, ¿es "probar", o es otra cosa?',
  },
  {code: '  expect(balance).toBeGreaterThan(0);', rule: 0, why: 'Comparar el resultado es exactamente el trabajo del test.'},
  {code: '});', rule: 0, why: 'Cierre del test.'},
];

export const LESSON_02_QUIZ: QuizQuestion[] = [
  {
    question: 'Para auditar si un test respeta las capas, ¿qué chequeo rápido podés hacer?',
    options: [
      {text: 'Leerlo tapando el código de la Page Object que usa. Si se entiende qué verifica sin verla, está bien.', correct: true, why: 'Si en cambio encontrás un selector, una expresión regular o una cuenta matemática en el test, esa pieza vive en la capa equivocada.'},
      {text: 'Contar cuántas líneas tiene el test.', correct: false, why: 'La cantidad de líneas no dice nada sobre si las responsabilidades están en el lugar correcto.'},
      {text: 'Ver si el test pasa en CI.', correct: false, why: 'Un test puede pasar y, aun así, tener lógica de negocio mezclada que lo hace frágil a largo plazo.'},
    ],
  },
  {
    question: 'Un test necesita sembrar un pedido existente antes de arrancar. ¿Qué es correcto?',
    options: [
      {text: 'El test llama directo a un Helper (una función que pega contra la API) para sembrar el dato — no hace falta pasar por la Page Object.', correct: true, why: 'Sembrar datos antes de que el test arranque es trabajo de un Helper, y el test puede llamarlo directo: no es una cadena donde todo tiene que pasar primero por la Page Object.'},
      {text: 'El test tiene que pedirle a la Page Object que arme ese dato.', correct: false, why: 'La Page Object sabe interactuar con la pantalla, no sembrar datos de negocio — eso es trabajo de un Helper.'},
      {text: 'El test hace el pedido HTTP a la API directamente, sin pasar por ningún Helper.', correct: false, why: 'Eso sería el test haciendo el trabajo del Helper — la llamada a la API debería vivir en un Helper reutilizable, no repetida en cada test.'},
    ],
  },
  {
    question: 'Un test llama a `parseInt(texto)` para convertir algo que leyó de la pantalla. ¿Qué capa debería hacer eso?',
    options: [
      {text: 'El test mismo, ahí donde lo necesita.', correct: false, why: 'Eso mezcla lógica de negocio dentro del test — la regla que esta entrada señala como el error más común.'},
      {text: 'La Page Object (o un Helper), que debería devolver el valor ya convertido.', correct: true, why: 'El test compara; no calcula.'},
      {text: 'Un archivo de configuración.', correct: false, why: 'La configuración no transforma datos leídos de la pantalla.'},
    ],
  },
];
