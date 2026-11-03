import type {MatchItem} from '@site/src/components/Match';
import type {ClassifyItem} from '@site/src/components/Classify';
import type {BuilderStep} from '@site/src/components/CommandBuilder';
import type {DecisionNode} from '@site/src/components/DecisionPath';

export const PICK_LEFT: MatchItem[] = [
  {id: 'alt', text: '`<img src="mapa.png" alt="Mapa de la sede">`'},
  {id: 'ph', text: '`<input placeholder="Buscar especialidad">`, sin label'},
  {id: 'label', text: '`<label for="dni">DNI</label>` y `<input id="dni">`'},
  {id: 'title', text: '`<button title="Imprimir comprobante">🖨</button>`'},
  {id: 'role', text: '`<h2>Próximos turnos</h2>`'},
  {id: 'text', text: '`<p>Llegá 10 minutos antes.</p>`'},
];
export const PICK_RIGHT: MatchItem[] = [
  {id: 'role', text: "`getByRole('heading', { name: 'Próximos turnos' })`"},
  {id: 'title', text: "`getByTitle('Imprimir comprobante')`"},
  {id: 'text', text: "`getByText('Llegá 10 minutos antes')`"},
  {id: 'label', text: "`getByLabel('DNI')`"},
  {id: 'alt', text: "`getByAltText('Mapa de la sede')`"},
  {id: 'ph', text: "`getByPlaceholder('Buscar especialidad')`"},
];
export const PICK_WHY: Record<string, string> = {
  alt: 'Una imagen se identifica por su texto alternativo, el `alt`.',
  ph: 'El campo no tiene etiqueta: su placeholder es lo único que lo describe.',
  label: 'Es un campo con etiqueta asociada: `getByLabel` usa la misma asociación que un lector de pantalla.',
  title: 'El nombre accesible del botón es «🖨», su contenido. El `title` es lo que lo describe, y `getByTitle` lo usa.',
  role: 'Un título tiene rol `heading` y su texto como nombre: es el primer locator recomendado.',
  text: 'Un párrafo no tiene un rol útil para buscarlo: se encuentra por su texto.',
};

export const MITURNO_HTML = `<h1>Mi turno</h1>
<h2>Próximos turnos</h2>
<p>Clínica médica · 12/11 09:00</p>
<p>Llegá 10 minutos antes.</p>
<button>Cancelar</button>
<button>
  Cancelar todos los turnos
</button>
<button aria-label="Cerrar aviso">
  ×
</button>
<label for="dni">DNI</label>
<input id="dni">
<input
  placeholder="Buscar especialidad">
<img src="mapa.png"
  alt="Mapa de la sede">
<button
  title="Imprimir comprobante">
  🖨
</button>
<a href="/turnos/nuevo">
  Pedir turno
</a>`;

export const COUNT_COLUMNS = ['Ninguno', 'Uno', 'Varios'];
export const COUNT_ITEMS: ClassifyItem[] = [
  {
    code: "getByRole('button', { name: 'Cancelar' })",
    column: 2,
    why: 'Sin `exact`, el nombre se busca como parte: encuentra «Cancelar» y «Cancelar todos los turnos». Una acción sobre este locator daría `strict mode violation`.',
    hint: '¿Hay otro botón cuyo nombre contenga esa palabra?',
  },
  {
    code: "getByRole('button', { name: 'Cancelar', exact: true })",
    column: 1,
    why: 'Con `exact: true` solo coincide el nombre completo «Cancelar».',
    hint: '¿Qué cambia `exact: true` en la comparación?',
  },
  {
    code: "getByRole('button', { name: 'Imprimir comprobante' })",
    column: 0,
    why: 'El nombre accesible del botón es su contenido, «🖨». El `title` no es el nombre cuando hay contenido.',
    hint: 'De las fuentes del nombre accesible, ¿cuál tiene prioridad: el contenido o el `title`?',
  },
  {
    code: "getByText('turno')",
    column: 2,
    why: 'Busca una parte del texto y no distingue mayúsculas: encuentra «Mi turno», «Próximos turnos», «Cancelar todos los turnos» y «Pedir turno».',
    hint: '¿Cuántos textos de la página contienen esa palabra?',
  },
  {
    code: "getByRole('link', { name: 'pedir turno' })",
    column: 1,
    why: 'Sin `exact`, la comparación no distingue mayúsculas: encuentra el enlace «Pedir turno».',
    hint: '¿`name` distingue mayúsculas cuando no se usa `exact`?',
  },
  {
    code: "getByRole('heading', { level: 3 })",
    column: 0,
    why: 'La página tiene un `<h1>` y un `<h2>`, ningún título de nivel 3.',
    hint: '¿Qué niveles de título hay en la página?',
  },
  {
    code: "getByRole('textbox', { name: 'Buscar especialidad' })",
    column: 1,
    why: 'Sin etiqueta ni `aria-label`, el placeholder es el nombre accesible del campo.',
    hint: '¿De dónde saca su nombre un campo sin etiqueta?',
  },
  {
    code: "getByRole('button', { name: '×' })",
    column: 0,
    why: '`aria-label` le da al botón el nombre «Cerrar aviso»: «×» es su contenido, pero ya no su nombre.',
    hint: '¿Qué fuente del nombre le gana al contenido?',
  },
  {
    code: "getByRole('heading')",
    column: 2,
    why: 'Sin nombre ni nivel, encuentra todos los títulos: el `<h1>` y el `<h2>`.',
    hint: '¿Cuántos títulos tiene la página?',
  },
];

export const LOCATOR_PREFIX = 'page.';
export const LOCATOR_STEPS: BuilderStep[] = [
  {options: ['getByText', 'getByLabel', 'getByRole'], correct: 'getByRole', hint: 'Ese locator no busca por rol: no comprueba que el elemento sea un botón.'},
  {options: ["('link', {", "('button', {", "('textbox', {"], correct: "('button', {", hint: 'Ese rol no corresponde a un `<button>`.'},
  {options: [" name: 'Cancelar' })", " title: 'Cancelar' })", " name: 'Cancelar', exact: true })"], correct: " name: 'Cancelar', exact: true })", hint: 'En esta página hay otro botón cuyo nombre empieza igual, o esa opción no existe en `getByRole`.'},
];
export const LOCATOR_EXPLANATION =
  "`page.getByRole('button', { name: 'Cancelar', exact: true })` encuentra un solo botón, aunque exista «Cancelar todos los turnos». Sin `exact`, el click fallaría por strict mode.";

export const DEBUG_START = 'timeout';
export const DEBUG_NODES: Record<string, DecisionNode> = {
  timeout: {
    id: 'timeout',
    situation: "En la pantalla de turnos, el test falla en `await page.getByRole('button', { name: '×' }).click();` con `Test timeout of 30000ms exceeded` y `waiting for getByRole('button', { name: '×' })`. En pantalla se ve el botón «×» arriba del aviso. ¿Qué mirás primero?",
    options: [
      {text: 'Subir el timeout del test a 60 segundos.', correct: false, why: '`waiting for` durante 30 segundos indica que el locator no encontró nada. Esperar más no cambia eso.'},
      {text: 'El rol y el nombre accesible del botón, en la pestaña Accessibility de DevTools.', correct: true, why: 'El locator busca por rol y nombre accesible. Si no coincide con el real, nunca encuentra el elemento.', next: 'name'},
      {text: 'Si el botón tiene una clase CSS, para buscarlo por ahí.', correct: false, why: 'Cambiar de estrategia sin saber por qué falla esconde el problema. Primero hay que ver qué nombre tiene.'},
    ],
  },
  name: {
    id: 'name',
    situation: 'La pestaña Accessibility muestra rol `button` y nombre «Cerrar aviso». ¿Qué corregís?',
    options: [
      {text: "Usar `getByRole('button', { name: '×', exact: true })`.", correct: false, why: 'El nombre accesible no es «×» sino «Cerrar aviso», que le da `aria-label`. Con o sin `exact`, «×» no coincide.'},
      {text: "Usar `getByRole('button', { name: 'Cerrar aviso' })`.", correct: true, why: 'Describe el botón por su nombre accesible real, completo y claro para quien lea el test.', next: 'twice'},
      {text: "Usar `getByText('×')`.", correct: false, why: 'Busca por un símbolo que no comprueba que sea un botón y que no describe qué hace.'},
    ],
  },
  twice: {
    id: 'twice',
    situation: "Ahora el test pasa ese paso y falla en el siguiente: `getByRole('button', { name: 'Cancelar' })` da `strict mode violation` con 2 elementos: «Cancelar» y «Cancelar todos los turnos». El test quiere cancelar solo el turno. ¿Qué corregís?",
    options: [
      {text: "Agregar `exact: true` al locator.", correct: true, why: "`{ name: 'Cancelar', exact: true }` encuentra solo el botón «Cancelar». Es el `aka` que sugiere el propio mensaje."},
      {text: 'Quedarse con el primero de la lista.', correct: false, why: 'Funciona hoy por el orden de la página; si el orden cambia, el test cancela todos los turnos.'},
      {text: "Cambiar a `getByText('Cancelar')`.", correct: false, why: 'También busca una parte del texto: encuentra los dos botones, y además pierde el rol.'},
    ],
  },
};
export const DEBUG_EXPLANATION =
  'Un locator que espera hasta el timeout no encontró nada: se compara con el rol y el nombre accesible reales. Un `strict mode violation` encontró de más: se precisa el locator, por ejemplo con `exact: true`.';
