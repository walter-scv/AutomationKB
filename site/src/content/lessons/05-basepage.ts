import type {CodeLine} from '@site/src/components/FindInCode';
import type {QuizQuestion} from '@site/src/components/Quiz';

export const BASEPAGE_RULE_LABELS = ['Es específico de una pantalla — debería vivir en la Page Object concreta'];

export const BASEPAGE_LINES: CodeLine[] = [
  {code: 'export abstract class BasePage {', rule: 0, why: 'Declaración de la clase base.'},
  {code: '  constructor(protected page: Page, protected url: string) {}', rule: 0, why: 'Genérico para cualquier pantalla — cada una pasa su propia URL.'},
  {code: '  async navigate() { await this.page.goto(this.url); }', rule: 0, why: 'Cualquier pantalla necesita navegar — correcto acá.'},
  {code: '  async click(locator: Locator) { await locator.click(); }', rule: 0, why: 'Genérico de Playwright, no sabe nada de ninguna pantalla en particular.'},
  {code: "  async waitForVisible(locator: Locator) { await locator.waitFor({ state: 'visible' }); }", rule: 0, why: 'Igual de genérico — correcto acá.'},
  {
    code: "  async clickBuy() { await this.page.getByRole('button', { name: 'Buy' }).click(); }",
    rule: 1,
    why: 'No todas las pantallas tienen un botón "Buy" — esto es específico de una sola pantalla y debería vivir en su Page Object concreta.',
    hint: '¿Todas las pantallas del sitio tienen este botón?',
  },
  {
    code: '  async getUnitsOwned() { /* ...lee y convierte un texto puntual de esta pantalla... */ }',
    rule: 1,
    why: 'Depende de qué hace una pantalla en particular (un dashboard de compras) — no de algo común a todas. Va en su Page Object concreta.',
    hint: '¿Esto tiene sentido en, por ejemplo, una pantalla de configuración?',
  },
  {code: '}', rule: 0, why: 'Cierre de la clase.'},
];

export const PRESS_SEQUENTIALLY_CHECK: QuizQuestion[] = [
  {
    question: 'Un campo de cantidad solo reacciona a eventos de tecla reales. ¿Por qué no alcanza con `BasePage.fill()` genérico?',
    options: [
      {text: 'Porque fill() no existe en Playwright.', correct: false, why: 'fill() sí existe — el problema es otro.'},
      {text: 'Porque fill() pone el valor sin disparar los eventos de tecla que ese campo necesita — hace falta pressSequentially().', correct: true, why: 'Es una señal correcta de que esa pantalla necesita algo más específico, no un bug del helper genérico.'},
      {text: 'Porque hay que escribir el valor en dos pasos siempre.', correct: false, why: 'No es una regla general — depende de si el campo escucha eventos de tecla real, como en este caso puntual.'},
    ],
  },
];

export const LESSON_05_QUIZ: QuizQuestion[] = [
  {
    question: 'Dos Page Objects distintas repiten el mismo método `navigate()`, cambiando solo la URL. ¿Qué conviene?',
    options: [
      {text: 'Dejarlo así — cada Page Object es independiente.', correct: false, why: 'Si mañana cambia la estrategia de espera o el dominio, hay que tocar cada Page Object por separado.'},
      {text: 'Mover navigate() a una clase base (BasePage) de la que ambas hereden.', correct: true, why: 'Así existe en un solo lugar, y las dos Page Objects lo reciben automáticamente.'},
      {text: 'Convertirlo en una función suelta importada en cada archivo.', correct: false, why: 'Funciona, pero pierde la relación con el resto de los helpers compartidos (click, waitForVisible, TIMEOUTS) que también quieren vivir juntos.'},
    ],
  },
  {
    question: '¿Qué regla general decide si algo va en BasePage o en la Page Object concreta?',
    options: [
      {text: 'Si el comportamiento es el mismo para cualquier pantalla, va en BasePage; si depende de qué hace esta pantalla en particular, va en la concreta.', correct: true, why: 'navigate(), click(), waitForVisible() no saben nada de ninguna feature puntual — por eso van en BasePage.'},
      {text: 'Todo lo que se usa más de una vez va en BasePage.', correct: false, why: 'Usarse más de una vez no alcanza — tiene que ser genérico para cualquier pantalla, no solo repetido entre un par de ellas.'},
      {text: 'Los métodos cortos van en BasePage, los largos en la concreta.', correct: false, why: 'La longitud del método no tiene que ver con dónde debería vivir.'},
    ],
  },
];
