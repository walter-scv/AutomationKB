import type {ClassifyItem} from '@site/src/components/Classify';
import type {MatchItem} from '@site/src/components/Match';
import type {FillBlankSlot} from '@site/src/components/FillBlank';
import type {MultiSelectQuestion} from '@site/src/components/MultiSelect';

export const LOG_COLUMNS = ['No está habilitado o no es editable', 'Otro elemento lo tapa', 'No lo encuentra'];
export const LOG_ITEMS: ClassifyItem[] = [
  {
    code: "waiting for getByRole('button', { name: 'Confirmar compra' })\n  locator resolved to <button disabled>Confirmar compra</button>\n  element is not enabled",
    column: 0,
    why: 'Encontró el botón (`locator resolved to`), pero tiene `disabled`: `element is not enabled`.',
    hint: '¿Encontró el elemento? ¿Qué dice la última línea?',
  },
  {
    code: "waiting for getByRole('button', { name: 'Agregar al carrito' })\n  locator resolved to <button>Agregar al carrito</button>\n  <div class=\"cookies\">Aceptá las cookies</div> intercepts pointer events",
    column: 1,
    why: 'El aviso de cookies está encima del botón y recibe el click: `intercepts pointer events`.',
    hint: '¿De quién habla la última línea: del botón o de otro elemento?',
  },
  {
    code: "waiting for getByRole('button', { name: 'Finalizar compra' })",
    column: 2,
    why: 'No hay ninguna línea `locator resolved to`: el locator nunca encontró un elemento con ese rol y ese nombre.',
    hint: '¿Llegó a encontrar algún elemento?',
  },
  {
    code: "waiting for getByLabel('Código postal')\n  locator resolved to <input id=\"cp\" readonly value=\"1414\"/>\n  element is not editable",
    column: 0,
    why: 'Encontró el campo, pero tiene `readonly`: `fill` exige que sea editable.',
    hint: '¿Qué atributo del campo impide escribir?',
  },
  {
    code: "waiting for getByRole('button', { name: 'Aplicar cupón' })\n  locator resolved to <button>Aplicar cupón</button>\n  <div class=\"spinner\"></div> intercepts pointer events",
    column: 1,
    why: 'Un indicador de carga quedó encima del botón durante todo el plazo.',
    hint: '¿El problema está en el botón o en algo que hay encima?',
  },
  {
    code: "waiting for getByRole('button', { name: 'Elegir envío' })\n  locator resolved to <button disabled>Elegir envío</button>\n  element is not enabled",
    column: 0,
    why: 'El botón existe pero sigue deshabilitado, probablemente porque falta completar un paso anterior del checkout.',
    hint: '¿Qué atributo tiene el botón que encontró?',
  },
];

export const TIMEOUT_LEFT: MatchItem[] = [
  {id: 'settimeout', text: 'Un test recorre un alta larga y tarda, completo, unos 100 segundos.'},
  {id: 'slow', text: 'Un test corre en un entorno que se sabe lento; alcanza con darle el triple de tiempo que al resto.'},
  {id: 'one', text: 'Una sola verificación espera un mensaje que llega a los 12 segundos.'},
  {id: 'expect', text: 'Todas las assertions de la suite necesitan hasta 8 segundos en el entorno de pruebas.'},
  {id: 'action', text: 'Ningún click debería esperar más de 10 segundos: si tarda más, es un problema.'},
  {id: 'const', text: 'El mismo plazo de 60 segundos para exportar reportes se repite en seis tests.'},
];
export const TIMEOUT_RIGHT: MatchItem[] = [
  {id: 'action', text: '`actionTimeout: 10_000` en `use`'},
  {id: 'const', text: 'Una constante `TIMEOUTS.proceso`'},
  {id: 'one', text: '`{ timeout: 15_000 }` en esa assertion'},
  {id: 'slow', text: '`test.slow()`'},
  {id: 'expect', text: '`expect: { timeout: 8_000 }` en la configuración'},
  {id: 'settimeout', text: '`test.setTimeout(120_000)`'},
];
export const TIMEOUT_WHY: Record<string, string> = {
  settimeout: 'El límite del test completo es 30 segundos, y `test.slow()` lo llevaría a 90, que tampoco alcanza: ese test necesita un plazo propio.',
  slow: '`test.slow()` triplica el timeout del test sin escribir un número.',
  one: 'Solo esa assertion necesita más tiempo: se cambia ahí y no en toda la suite.',
  expect: 'Si todas las assertions lo necesitan, se configura una vez para toda la suite.',
  action: '`actionTimeout` pone un límite a cada acción, que por defecto no tiene.',
  const: 'Un plazo repetido va en una constante con nombre: dice por qué es ese número y se cambia en un solo lugar.',
};

export const WAIT_TEMPLATE = `await page.goto('/agenda');
// antes: await page.waitForTimeout(5000);
await {{a}}(page.getByRole('listitem'))
  .{{b}}.{{c}}(0);

await page.getByRole('listitem')
  .filter({ hasText: '09:00' })
  .getByRole('button', { name: 'Reservar' })
  .click();

await page.{{d}}('**/turnos/confirmado');`;
export const WAIT_SLOTS: FillBlankSlot[] = [
  {id: 'a', answer: 'expect'},
  {id: 'b', answer: 'not'},
  {id: 'c', answer: 'toHaveCount'},
  {id: 'd', answer: 'waitForURL'},
];
export const WAIT_BANK = ['waitForTimeout', 'toHaveCount', 'expect', 'goto', 'not', 'soft', 'waitForURL', 'toBeVisible'];
export const WAIT_EXPLANATION =
  '`expect(...).not.toHaveCount(0)` espera exactamente hasta que la agenda tenga turnos, en lugar de 5 segundos fijos. Después del click, `waitForURL` espera a que la dirección sea la de confirmación.';

export const SPINNER_QUESTIONS: MultiSelectQuestion[] = [
  {
    prompt: 'El click en Aplicar cupón falla con `Test timeout of 30000ms exceeded`, y el call log termina en `<div class="spinner"></div> intercepts pointer events`. ¿Qué afirmaciones y acciones corresponden? Marcá todas las que correspondan.',
    options: [
      {text: 'El indicador de carga siguió encima del botón durante los 30 segundos: hay que investigar si es un defecto.', correct: true, why: 'El click reintentó todo el tiempo. Si el indicador nunca se fue, la persona tampoco podría aplicar el cupón.'},
      {text: 'El call log dice que el botón estaba visible, habilitado y estable.', correct: true, why: 'Pasó esas comprobaciones; lo que faltó fue recibir el click, porque otro elemento lo tapaba.'},
      {text: 'Agregar `force: true` al click para saltear las comprobaciones.', correct: false, why: 'El test pasaría haciendo algo que la persona no puede hacer: tapa el problema en lugar de mostrarlo.'},
      {text: 'Agregar `await page.waitForTimeout(5000)` antes del click.', correct: false, why: 'El click ya esperó 30 segundos al indicador. Cinco más no cambian nada y vuelven más lento cada corrida.'},
      {text: 'Playwright no esperó a que el indicador desapareciera.', correct: false, why: 'Sí esperó: reintentó el click hasta agotar el timeout del test.'},
    ],
  },
];
