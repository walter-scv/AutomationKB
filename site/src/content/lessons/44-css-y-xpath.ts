import type {MatchItem} from '@site/src/components/Match';
import type {SpotTokenRound} from '@site/src/components/SpotToken';
import type {DecisionNode} from '@site/src/components/DecisionPath';

export const AGENDA_HTML = `<main>
  <h1>Agenda</h1>
  <div class="turno"
       data-id="T-88">
    <span class="hora">09:00</span>
    <span class="medica">Dra. Paz</span>
    <button class="btn-x7a9">Reservar</button>
  </div>
  <div class="turno ocupado"
       data-id="T-89">
    <span class="hora">09:30</span>
    <span class="medica">Dr. Ruiz</span>
    <button class="btn-x7a9" disabled>Reservar</button>
  </div>
  <form id="filtros">
    <input name="dni">
    <select name="especialidad">
      ...
    </select>
  </form>
</main>`;

export const SEL_LEFT: MatchItem[] = [
  {id: 'busy', text: "`.turno.ocupado`"},
  {id: 'btn88', text: "`[data-id=\"T-88\"] button`"},
  {id: 'dni', text: "`#filtros input[name=\"dni\"]`"},
  {id: 'parent', text: "`//span[text()='Dra. Paz']/..`"},
  {id: 'hours', text: "`.turno .hora`"},
  {id: 'disabled', text: "`//button[@disabled]`"},
];
export const SEL_RIGHT: MatchItem[] = [
  {id: 'hours', text: 'Los dos horarios, 09:00 y 09:30.'},
  {id: 'parent', text: 'El bloque completo del turno de las 09:00.'},
  {id: 'disabled', text: 'El botón Reservar del turno de las 09:30.'},
  {id: 'busy', text: 'El bloque completo del turno de las 09:30.'},
  {id: 'dni', text: 'El campo DNI del formulario de filtros.'},
  {id: 'btn88', text: 'El botón Reservar del turno de las 09:00.'},
];
export const SEL_WHY: Record<string, string> = {
  busy: 'Dos clases juntas, sin espacio, exigen las dos: solo el turno de las 09:30 tiene también `ocupado`.',
  btn88: 'El espacio significa "adentro de": el botón que está dentro del elemento con `data-id="T-88"`.',
  dni: 'El `<input>` con `name="dni"` que está dentro del elemento con `id="filtros"`.',
  parent: '`text()` encuentra el `<span>` de la Dra. Paz y `..` sube a su padre, el `<div>` del turno.',
  hours: 'Los elementos con clase `hora` dentro de cualquier `.turno`: hay dos.',
  disabled: '`[@disabled]` filtra los botones que tienen ese atributo: solo el del turno ocupado.',
};

export const DNI_ACCEPTED = [
  'input[name="dni"]', "input[name='dni']", '[name="dni"]', "[name='dni']", 'input[name=dni]', '[name=dni]',
  'form input[name="dni"]', "form input[name='dni']", 'form [name="dni"]',
  '#filtros input[name="dni"]', "#filtros input[name='dni']", '#filtros [name="dni"]', "#filtros [name='dni']",
];
export const DNI_HINTS = [
  'El selector de atributo se escribe entre corchetes: el nombre del atributo, un igual y el valor entre comillas.',
  'Podés anteponer la etiqueta del elemento, sin espacio, para que solo coincida con campos `<input>`.',
];
export const DNI_EXPLANATION =
  '`input[name="dni"]` usa el atributo `name`, que la aplicación necesita para enviar el formulario. No depende de posiciones ni de clases de diseño, así que es de los selectores más estables.';

export const FRAGILE_PROMPT = '¿Qué parte de esta línea hace frágil al selector?';
export const FRAGILE_ROUNDS: SpotTokenRound[] = [
  {
    line: "await page.locator('main > div:nth-child(3) > button').click();",
    targetIndex: 3,
    why: '`:nth-child(3)` elige por posición. Si aparece un elemento nuevo antes, el tercer hijo pasa a ser otro, y el test hace click en el botón equivocado.',
    hint: '¿Qué parte del selector cambia de significado si se agrega un elemento en la página?',
  },
  {
    line: "const hora = page.locator('div.turno > span:first-child');",
    targetIndex: 5,
    why: '`span:first-child` depende de que la hora sea el primer `<span>`. Si se agrega un ícono antes, el selector devuelve otra cosa.',
    hint: '¿Qué parte del selector asume un orden entre los elementos?',
  },
  {
    line: "await page.locator('.turno .btn-x7a9').click();",
    targetIndex: 2,
    why: '`.btn-x7a9` es un nombre de clase generado automáticamente: cambia en cada versión de la aplicación.',
    hint: '¿Alguna parte parece escrita por una herramienta y no por una persona?',
  },
  {
    line: "await page.locator('.turno:nth-child(3) button').click();",
    targetIndex: 1,
    why: '`:nth-child(3)` vuelve a elegir por posición: el turno que esté tercero hoy no es el mismo mañana.',
    hint: '¿Qué parte depende del lugar que ocupa el turno en la lista?',
  },
  {
    line: "await page.locator('#filtros .col-md-6 input').fill('30111222');",
    targetIndex: 2,
    why: '`.col-md-6` es una clase de diseño, que define el ancho de una columna. Un cambio de diseño la cambia aunque el campo siga ahí.',
    hint: '¿Qué parte describe cómo se ve la página y no qué es el elemento?',
  },
];

export const LEGACY_START = 'broken';
export const LEGACY_NODES: Record<string, DecisionNode> = {
  broken: {
    id: 'broken',
    situation: "Heredás un test que reserva el turno de las 09:30 con `page.locator('//main/div[2]/button').click()`. Desde que la agenda sumó un turno a las 08:30, primero de la lista, el test sigue pasando pero reserva el de las 09:00. ¿Qué pasó?",
    options: [
      {text: 'La aplicación tiene un defecto: el botón de las 09:30 reserva otro horario.', correct: false, why: 'El botón funciona: el test hace click en otro botón. Lo que cambió es qué elemento ocupa la segunda posición.'},
      {text: 'El turno nuevo ocupa la primera posición: `div[2]` ahora es el turno de las 09:00.', correct: true, why: 'El selector elige por posición. Un elemento nuevo corre las posiciones y el test actúa sobre otro elemento sin fallar.', next: 'rewrite'},
      {text: 'XPath dejó de ser compatible con la versión nueva de Playwright.', correct: false, why: 'Playwright sigue aceptando XPath. El selector funciona: elige lo que dice, que ya no es lo que el test quería.'},
    ],
  },
  rewrite: {
    id: 'rewrite',
    situation: 'Todavía no viste cómo combinar locators por texto y por rol, y la agenda no tiene `data-testid`. Cada turno tiene un atributo `data-id`; el de las 09:30 es `T-91`. ¿Con qué selector lo reescribís por ahora?',
    options: [
      {text: "`page.locator('main > div:nth-child(4) > button')`.", correct: false, why: 'Sigue eligiendo por posición: el próximo cambio de la página lo vuelve a romper.'},
      {text: "`page.locator('.btn-x7a9')`.", correct: false, why: 'Es una clase generada que cambia con cada versión, y además coincide con los dos botones: daría strict mode violation.'},
      {text: "`page.locator('[data-id=\"T-91\"] button')`.", correct: true, why: 'Usa un atributo de datos que identifica el turno, no su posición ni su diseño. Con `filter` (entrada siguiente) se puede hacer además por texto y rol.', next: 'check'},
    ],
  },
  check: {
    id: 'check',
    situation: 'Antes de cambiar el test querés comprobar que el selector encuentra un solo elemento en la página real. ¿Cómo?',
    options: [
      {text: 'Buscarlo en el panel Elements de DevTools y ver que diga «1 of 1».', correct: true, why: 'La búsqueda de Elements acepta CSS y XPath y muestra cuántos elementos coinciden en el DOM actual.'},
      {text: 'Buscarlo con Ver código fuente.', correct: false, why: 'El código fuente es el HTML original, sin lo que agregó JavaScript; además, no evalúa selectores.'},
      {text: 'Correr la suite completa y ver si pasa.', correct: false, why: 'El test anterior también pasaba, haciendo click en el elemento equivocado. Pasar no prueba que el selector apunte bien.'},
    ],
  },
};
export const LEGACY_EXPLANATION =
  'Un selector por posición se rompe en silencio cuando la página cambia. Se reemplaza por uno basado en un atributo que identifica el dato, se prueba en DevTools, y cuando se puede, por un locator orientado al usuario.';
