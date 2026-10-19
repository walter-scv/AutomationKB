import type {CodeLine} from '@site/src/components/FindInCode';
import type {OrderItem, OrderRule} from '@site/src/components/Order';
import type {QuizQuestion} from '@site/src/components/Quiz';

export const SELECTOR_ORDER_ITEMS: OrderItem[] = [
  {id: 'text', what: 'Texto visible', code: "getByText('Confirmar compra')"},
  {id: 'testid', what: 'Atributo exclusivo de testing', code: "getByTestId('confirm-button')"},
  {id: 'css', what: 'Clase CSS interna', code: "locator('.btn-primary')"},
  {id: 'role', what: 'Rol semántico + nombre accesible', code: "getByRole('button', { name: 'Confirmar compra' })"},
  {id: 'placeholder', what: 'Texto de ayuda del campo', code: "getByPlaceholder('Buscar...')"},
  {id: 'label', what: 'Label asociado al campo', code: "getByLabel('Cantidad')"},
];

export const SELECTOR_ORDER_CORRECT = ['testid', 'role', 'label', 'placeholder', 'text', 'css'];

export const SELECTOR_ORDER_RULES: OrderRule[] = [
  {before: 'testid', after: 'role', why: 'getByTestId es un atributo que solo existe para testing — nada más lo toca. getByRole depende de que el rol y el nombre accesible no cambien.'},
  {before: 'role', after: 'label', why: 'getByRole refleja la semántica del elemento; getByLabel depende del label asociado, que varía con cambios de copy o traducciones.'},
  {before: 'label', after: 'placeholder', why: 'Un label es parte del contrato de accesibilidad; un placeholder es texto de ayuda, de los primeros que cambia un diseñador.'},
  {before: 'placeholder', after: 'text', why: 'El placeholder es ayuda visual puntual; el texto visible general es lo que más cambia (rediseños, copy, traducciones).'},
  {before: 'text', after: 'css', why: 'El texto visible sigue siendo parte de la interfaz; una clase CSS refleja la implementación interna del DOM, que cambia por puro estilo sin que el comportamiento cambie.'},
];

export const PO_RULES_LABELS = [
  'Tiene un assert adentro (eso es trabajo del test)',
  'Nombre genérico, sin significado de negocio',
  'No recibe lo que le falta como parámetro — lo adivina',
];

export const PO_RULES_LINES: CodeLine[] = [
  {code: 'class CheckoutPage {', rule: 0, why: 'Declaración de la clase.'},
  {code: "  readonly quantityInput = this.page.getByRole('spinbutton').first();", rule: 0, why: 'Selector declarado como propiedad — correcto.'},
  {code: "  readonly confirmButton = this.page.getByRole('button', { name: 'Confirmar compra' });", rule: 0, why: 'Selector declarado como propiedad — correcto.'},
  {code: '  constructor(private page: Page) {}', rule: 0, why: 'Correcto.'},
  {
    code: '  async fillQuantity() {',
    rule: 3,
    why: 'No recibe la cantidad como parámetro: la adivina/hardcodea en el cuerpo. El método debería ser fillQuantity(quantity: number).',
    hint: '¿Qué pasa si otro test necesita llenar "5" en vez de "1"?',
  },
  {code: "    await this.quantityInput.fill('1');", rule: 0, why: 'Usa el selector ya declarado — el problema está en la firma del método de arriba, no en esta línea.'},
  {code: '  }', rule: 0, why: 'Cierre del método.'},
  {
    code: '  async click() {',
    rule: 2,
    why: 'Nombre genérico sin significado de negocio — debería llamarse clickConfirmarCompra(), para que el test diga qué logra, no qué hace técnicamente.',
    hint: '¿Qué te dice este nombre sobre lo que hace, además de "hace click"?',
  },
  {code: '    await this.confirmButton.click();', rule: 0, why: 'Correcto — el problema es el nombre del método, no esta línea.'},
  {
    code: "    expect(await this.quantityInput.inputValue()).toBe('');",
    rule: 1,
    why: 'Decidir si un valor es correcto es trabajo del test, nunca de la Page Object. Esta clase debería devolver el valor (por ejemplo con getQuantity()), no juzgarlo.',
    hint: 'Decidir si algo "está bien" o "está mal", ¿es trabajo de la Page Object o del test?',
  },
  {code: '  }', rule: 0, why: 'Cierre del método.'},
  {code: '}', rule: 0, why: 'Cierre de la clase.'},
];

export const LESSON_04_QUIZ: QuizQuestion[] = [
  {
    question: 'Dos tests repiten `page.getByRole(\'button\', { name: \'Confirmar compra\' }).click()`. Mañana el botón cambia de texto. ¿Qué hay que tocar?',
    options: [
      {text: 'Cada test que lo usa, uno por uno.', correct: false, why: 'Eso es justo el problema que Page Object Model resuelve.'},
      {text: 'Un solo lugar: el método de la Page Object que ambos tests llaman.', correct: true, why: 'Con el selector centralizado en una clase, los tests que llaman al método quedan arreglados sin tocarlos.'},
      {text: 'Nada — Playwright detecta el cambio solo.', correct: false, why: 'Playwright no adivina el nuevo texto del botón.'},
    ],
  },
  {
    question: '¿Por qué `getByTestId` es más estable que `getByText`?',
    options: [
      {text: 'Porque es más corto de escribir.', correct: false, why: 'La longitud del código no tiene que ver con la estabilidad.'},
      {text: 'Porque es un atributo que solo existe para testing — nada más lo toca al cambiar un color, un texto o una traducción.', correct: true, why: 'getByText, en cambio, depende del texto visible: lo primero que cambia en un rediseño o una traducción.'},
      {text: 'Porque Playwright lo ejecuta más rápido.', correct: false, why: 'No es una cuestión de velocidad de ejecución.'},
    ],
  },
  {
    question: 'Un método de una Page Object hace `expect(valor).toBe(resultado)` adentro. ¿Qué regla rompe?',
    options: [
      {text: 'Ninguna — las Page Objects también pueden verificar cosas.', correct: false, why: 'Las aserciones van siempre en el test, nunca en la Page Object.'},
      {text: 'Rompe la regla de que las aserciones van en el test, nunca en la Page Object.', correct: true, why: 'La Page Object reporta estado (devuelve un valor); el test decide si ese valor es correcto.'},
      {text: 'Rompe la regla de centralizar selectores.', correct: false, why: 'Esa regla es sobre dónde se declaran los locators, no sobre dónde van los asserts.'},
    ],
  },
];
