import type {FillBlankSlot} from '@site/src/components/FillBlank';
import type {ClassifyItem} from '@site/src/components/Classify';
import type {OrderItem, OrderRule} from '@site/src/components/Order';
import type {QuizQuestion} from '@site/src/components/Quiz';

export const SKELETON_TEMPLATE = `import { {{imp}}, expect } from '@playwright/test';

test('reservar un turno muestra la confirmación', {{fn}} ({ {{fix}} }) => {
  await page.goto('/turnos');
  await page.getByRole('button', { name: 'Reservar' }).click();
  {{aw}} expect(page.getByText('Turno confirmado')).{{check}}();
});`;
export const SKELETON_SLOTS: FillBlankSlot[] = [
  {id: 'imp', answer: 'test'},
  {id: 'fn', answer: 'async'},
  {id: 'fix', answer: 'page'},
  {id: 'aw', answer: 'await'},
  {id: 'check', answer: 'toBeVisible'},
];
export const SKELETON_BANK = ['click', 'await', 'describe', 'page', 'const', 'async', 'browser', 'toBeVisible', 'test', 'step'];
export const SKELETON_EXPLANATION =
  'Se importa `test` para declarar el test. La función es `async` porque todo lo que hace sobre el navegador tarda, y pide la fixture `page`, la pestaña que Playwright prepara. La verificación lleva `await`, como la navegación y el click, y `toBeVisible` comprueba que el mensaje se vea.';

export const AAA_COLUMNS = ['Arrange', 'Act', 'Assert'];
export const AAA_ITEMS: ClassifyItem[] = [
  {
    code: "await page.getByRole('button', { name: 'Ingresar' }).click();",
    column: 0,
    why: 'Es un click, pero ingresar no es lo que este test prueba: es la condición para llegar a la lista de turnos.',
    hint: '¿Ingresar es la acción que da título al test?',
  },
  {
    code: "await page.getByRole('button', { name: 'Sí, cancelar' }).click();",
    column: 1,
    why: 'Confirmar la cancelación es parte de la acción que el test prueba: sin este click, el turno no se cancela.',
    hint: '¿El turno ya quedó cancelado antes de esta línea?',
  },
  {
    code: "await page.goto('/ingresar');",
    column: 0,
    why: 'Abrir la pantalla de ingreso lleva la aplicación al punto de partida.',
    hint: '¿Esta línea cancela algo, o prepara el escenario?',
  },
  {
    code: "await expect(page.getByText('No tenés turnos')).toBeVisible();",
    column: 2,
    why: 'Comprueba un resultado: que la lista quedó vacía después de cancelar.',
    hint: '¿Esta línea cambia algo en la aplicación o comprueba algo?',
  },
  {
    code: "await page.getByLabel('DNI').fill('30111222');",
    column: 0,
    why: 'Completar el DNI es parte del ingreso, que prepara el escenario.',
    hint: '¿Para qué hace falta el DNI en este test?',
  },
  {
    code: "await page.getByRole('button', { name: 'Cancelar turno' }).click();",
    column: 1,
    why: 'Es la acción que da título al test: cancelar el turno.',
    hint: '¿Qué dice el título del test que se prueba?',
  },
  {
    code: "await page.getByRole('link', { name: 'Mis turnos' }).click();",
    column: 0,
    why: 'Navegar hasta la lista es parte de llegar al estado de partida, no la acción bajo prueba.',
    hint: '¿Ir a la lista de turnos es lo mismo que cancelar uno?',
  },
  {
    code: "await expect(page.getByText('Turno cancelado')).toBeVisible();",
    column: 2,
    why: 'Verifica el mensaje que confirma la cancelación.',
    hint: '¿Esta línea actúa o verifica?',
  },
];

export const BOOK_ITEMS: OrderItem[] = [
  {id: 'specialty', what: 'Línea', code: "await page.getByRole('button', { name: 'Dermatología' }).click();"},
  {id: 'fill', what: 'Línea', code: "await page.getByLabel('DNI').fill('27999888');"},
  {id: 'check', what: 'Línea', code: "await expect(page.getByText('Turno confirmado')).toBeVisible();"},
  {id: 'login', what: 'Línea', code: "await page.getByRole('button', { name: 'Ingresar' }).click();"},
  {id: 'slot', what: 'Línea', code: "await page.getByRole('button', { name: '18/11 15:00' }).click();"},
  {id: 'goto', what: 'Línea', code: "await page.goto('/ingresar');"},
  {id: 'confirm', what: 'Línea', code: "await page.getByRole('button', { name: 'Confirmar' }).click();"},
  {id: 'newlink', what: 'Línea', code: "await page.getByRole('link', { name: 'Pedir turno' }).click();"},
];
export const BOOK_CORRECT = ['goto', 'fill', 'login', 'newlink', 'specialty', 'slot', 'confirm', 'check'];
export const BOOK_RULES: OrderRule[] = [
  {before: 'goto', after: 'fill', why: 'Antes de completar el DNI hay que abrir la pantalla donde está el campo.'},
  {before: 'fill', after: 'login', why: 'El DNI se completa antes de presionar Ingresar; si no, se envía el formulario vacío.'},
  {before: 'login', after: 'newlink', why: 'La opción Pedir turno aparece recién después de ingresar.'},
  {before: 'newlink', after: 'specialty', why: 'La especialidad se elige dentro de la pantalla de Pedir turno.'},
  {before: 'specialty', after: 'slot', why: 'Los horarios disponibles dependen de la especialidad elegida.'},
  {before: 'slot', after: 'confirm', why: 'Se confirma un horario ya elegido.'},
  {before: 'confirm', after: 'check', why: 'La verificación va al final: comprueba el resultado de la acción, no lo anticipa.'},
];

export const STEP_OUTPUT = `1) [chromium]
   › tests/turnos.spec.ts:4:7
   › Turnos
   › reprogramar un turno lo pasa
     al 15/11 @regresion
   › 2- Elige el horario nuevo

  Test timeout of 30000ms
  exceeded.

  Error: locator.click: Test
  timeout of 30000ms exceeded.
  Call log:
    - waiting for getByRole(
      'button',
      { name: '15/11 10:30' })`;

export const OUTPUT_QUIZ: QuizQuestion[] = [
  {
    question: 'Según la salida de arriba, ¿en qué parte del flujo falló el test?',
    options: [
      {text: 'Al elegir el horario nuevo: el botón «15/11 10:30» nunca apareció.', correct: true, why: 'La salida termina en el paso «2- Elige el horario nuevo», y el call log muestra que esperó ese botón hasta agotar el tiempo.'},
      {text: 'En la verificación final: no apareció el mensaje de turno reprogramado.', correct: false, why: 'El paso que figura en la salida es el 2, y la operación que falló es un `click`, no un `expect`.'},
      {text: 'Al abrir la pantalla de turnos, en el primer paso.', correct: false, why: 'La salida nombra el paso que falló, y es el 2. El paso 1 se completó.'},
    ],
  },
  {
    question: 'En esa misma salida, ¿qué es «Turnos»?',
    options: [
      {text: 'El nombre del archivo de test.', correct: false, why: 'El archivo es `tests/turnos.spec.ts`, que figura antes, con la línea y la columna.'},
      {text: 'El nombre del grupo declarado con `test.describe`.', correct: true, why: 'El grupo aparece entre el archivo y el título del test, separado por `›`.'},
      {text: 'Un tag del test.', correct: false, why: 'Los tags empiezan con `@`. El de este test es `@regresion`, al final del título.'},
    ],
  },
  {
    question: '¿De dónde sale el `@regresion` que aparece al final del título?',
    options: [
      {text: 'Del nombre del paso que falló.', correct: false, why: 'El paso es «2- Elige el horario nuevo», que aparece en la línea siguiente.'},
      {text: 'Del nombre del navegador en el que corrió.', correct: false, why: 'El navegador es `[chromium]`, al principio de la línea.'},
      {text: 'De un tag declarado en el test, por ejemplo con `{ tag: \'@regresion\' }`.', correct: true, why: 'Los tags se muestran al final del título, y sirven después para correr solo los tests de esa categoría.'},
    ],
  },
  {
    question: 'Otro test termina con `expect(page.getByText(\'Turno cancelado\')).toBeVisible();`, sin `await`, y falla con `Error: Test ended.`. En la pantalla, «Turno cancelado» aparece medio segundo después del click. ¿Qué pasó?',
    options: [
      {text: 'Falta el `await`: el test terminó mientras la verificación todavía esperaba el texto.', correct: true, why: '`Test ended` indica que la verificación seguía esperando cuando el test terminó. Con `await`, el test la espera y pasa.'},
      {text: 'El plazo de 5 segundos de la verificación es demasiado corto.', correct: false, why: 'Medio segundo está muy por debajo de 5. El problema es que nadie esperó la verificación.'},
      {text: 'La aplicación tiene un defecto: el mensaje no aparece.', correct: false, why: 'El mensaje sí aparece, medio segundo después. Lo que falla es el test.'},
    ],
  },
];
