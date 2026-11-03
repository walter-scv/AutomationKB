import type {MatchItem} from '@site/src/components/Match';
import type {FillBlankSlot} from '@site/src/components/FillBlank';
import type {OrderItem, OrderRule} from '@site/src/components/Order';
import type {QuizQuestion} from '@site/src/components/Quiz';

export const REACH_LEFT: MatchItem[] = [
  {id: 'confirm', text: 'Al cancelar un turno aparece la ventanita del navegador «¿Cancelar el turno del 12/11?», y hay que aceptarla.'},
  {id: 'dismiss', text: 'La misma ventanita, pero el test tiene que comprobar qué pasa si la persona elige Cancelar.'},
  {id: 'prompt', text: 'Una ventanita del navegador pide escribir el motivo de la cancelación.'},
  {id: 'modal', text: 'Un `<div role="dialog">` de la aplicación pide confirmar el cambio de horario.'},
  {id: 'iframe', text: 'El mapa de la sede está incrustado desde otro sitio, con un botón «Cómo llegar» adentro.'},
  {id: 'popup', text: 'El enlace «Preparación para el estudio» abre las indicaciones en otra pestaña.'},
];
export const REACH_RIGHT: MatchItem[] = [
  {id: 'iframe', text: "`page.frameLocator('iframe[title=\"Mapa de la sede\"]')`"},
  {id: 'modal', text: "`page.getByRole('dialog')`"},
  {id: 'popup', text: "`page.waitForEvent('popup')` antes del click"},
  {id: 'prompt', text: "`page.once('dialog', (d) => d.accept('Viajo ese día'))`"},
  {id: 'confirm', text: "`page.once('dialog', (d) => d.accept())`"},
  {id: 'dismiss', text: "`page.once('dialog', (d) => d.dismiss())`"},
];
export const REACH_WHY: Record<string, string> = {
  confirm: 'Es un diálogo del navegador: hace falta un manejador que lo acepte, porque si no Playwright lo cancela.',
  dismiss: '`dismiss()` responde Cancelar. Se escribe explícito aunque sea lo que Playwright hace por defecto, para que el test diga qué prueba.',
  prompt: 'En un `prompt`, `accept` recibe el texto que se escribe en la ventanita.',
  modal: 'Es HTML de la aplicación, no del navegador: se encuentra con un locator, como cualquier elemento.',
  iframe: 'El botón está en otro documento: los locators de `page` no entran, `frameLocator` sí.',
  popup: 'La pestaña se abre durante el click: hay que empezar a esperarla antes.',
};

export const HANDLER_TEMPLATE = `page.{{a}}('dialog', async (dialog) => {
  await expect(dialog.{{b}}())
    .toBe('¿Cancelar el turno del 12/11?');
  await dialog.{{c}}();
});
await page.getByRole('button',
  { name: 'Cancelar turno' }).click();

const pago = page.{{d}}(
  'iframe[title="Pago de la consulta"]');
await pago.getByLabel('Número de tarjeta')
  .fill('4509953566233704');`;
export const HANDLER_SLOTS: FillBlankSlot[] = [
  {id: 'a', answer: 'once'},
  {id: 'b', answer: 'message'},
  {id: 'c', answer: 'accept'},
  {id: 'd', answer: 'frameLocator'},
];
export const HANDLER_BANK = ['dismiss', 'locator', 'type', 'once', 'accept', 'frameLocator', 'message', 'waitForEvent'];
export const HANDLER_EXPLANATION =
  '`page.once` registra el manejador para el próximo diálogo, antes del click. `message()` devuelve el texto de la ventanita, y `accept()` responde Aceptar. Para el pago, `frameLocator` entra al iframe y los locators funcionan adentro.';

export const POPUP_ITEMS: OrderItem[] = [
  {id: 'await', what: 'Línea', code: 'const indicaciones = await nuevaPestana;'},
  {id: 'click', what: 'Línea', code: "await page.getByRole('link', { name: 'Preparación para el estudio' }).click();"},
  {id: 'check', what: 'Línea', code: "await expect(indicaciones.getByRole('heading', { name: 'Ayuno de 8 horas' })).toBeVisible();"},
  {id: 'goto', what: 'Línea', code: "await page.goto('/turnos/estudios');"},
  {id: 'wait', what: 'Línea', code: "const nuevaPestana = page.waitForEvent('popup');"},
];
export const POPUP_CORRECT = ['goto', 'wait', 'click', 'await', 'check'];
export const POPUP_RULES: OrderRule[] = [
  {before: 'goto', after: 'wait', why: 'Primero se abre la pantalla de estudios, desde donde sale el enlace.'},
  {before: 'wait', after: 'click', why: 'La pestaña se abre durante el click: la espera tiene que empezar antes.'},
  {before: 'click', after: 'await', why: 'La Promise se resuelve con la pestaña que abre el click: se espera después.'},
  {before: 'await', after: 'check', why: 'Para verificar dentro de la pestaña nueva, primero hay que tenerla.'},
];

export const SYMPTOM_QUIZ: QuizQuestion[] = [
  {
    question: 'El test de cancelar un turno hace click en «Cancelar turno» y espera el mensaje «Turno cancelado», pero falla con `element(s) not found`. En pantalla quedó «El turno sigue vigente». No hay ningún manejador de diálogos. ¿Qué pasó?',
    options: [
      {text: 'La aplicación no mostró la confirmación.', correct: false, why: 'Si no hubiera confirmación, el turno se habría cancelado. Que siga vigente indica que alguien respondió Cancelar.'},
      {text: 'El click no llegó al botón.', correct: false, why: 'Si el click no hubiera llegado, no habría aparecido ningún mensaje nuevo; «El turno sigue vigente» es la respuesta a un Cancelar.'},
      {text: 'Apareció un `confirm` y Playwright lo canceló automáticamente.', correct: true, why: 'Sin manejador, Playwright cancela los diálogos. Hace falta `page.once(\'dialog\', ...)` con `accept()` antes del click.'},
    ],
  },
  {
    question: "El test del pago escribe en `page.getByLabel('Número de tarjeta')` y falla por timeout con `waiting for getByLabel('Número de tarjeta')`, aunque el campo se ve en pantalla. ¿Qué es lo más probable?",
    options: [
      {text: 'El campo está dentro de un iframe, y los locators de `page` no entran.', correct: true, why: 'El campo está en otro documento. Con `frameLocator` (o `contentFrame`) el mismo locator lo encuentra.'},
      {text: 'El campo está deshabilitado.', correct: false, why: 'Si estuviera deshabilitado, el call log mostraría `locator resolved to` y `element is not enabled`. Acá el locator nunca encontró nada.'},
      {text: 'Hace falta más timeout: la pasarela es lenta.', correct: false, why: 'El campo ya se ve en pantalla. Esperar más no cambia que el locator busca en el documento equivocado.'},
    ],
  },
  {
    question: "Un test agrega un manejador `page.on('dialog', (d) => console.log(d.message()))` para registrar los mensajes, y desde entonces el click en «Cancelar turno» nunca termina. ¿Por qué?",
    options: [
      {text: 'Porque `console.log` no funciona dentro de un manejador.', correct: false, why: 'Funciona: el mensaje se imprime. El problema es lo que falta después.'},
      {text: 'Porque el manejador no acepta ni cancela el diálogo, y la página queda detenida esperando una respuesta.', correct: true, why: 'Con un manejador registrado, Playwright ya no cancela solo: el manejador tiene que llamar a `accept()` o `dismiss()`.'},
      {text: 'Porque `page.on` solo funciona con `alert`, no con `confirm`.', correct: false, why: 'El evento `dialog` cubre `alert`, `confirm`, `prompt` y `beforeunload`.'},
    ],
  },
];
