import type {CodeLine} from '@site/src/components/FindInCode';
import type {QuizQuestion} from '@site/src/components/Quiz';
import type {BuilderStep} from '@site/src/components/CommandBuilder';
import type {DecisionNode} from '@site/src/components/DecisionPath';

export const ATTR_RULE_LABELS = [
  'Está en el contenedor, no en el elemento',
  'Nombra el diseño o la posición',
  'Nombre que sirve para varios elementos',
];

export const ATTR_LINES: CodeLine[] = [
  {
    code: '<div data-testid="campo-dni"><label for="dni">DNI</label><input id="dni"></div>',
    rule: 1,
    why: 'El test va a escribir en el campo, pero el atributo quedó en el `<div>`: `fill` fallaría con «Element is not an <input>».',
    hint: '¿En qué elemento escribe el test, y en cuál quedó el atributo?',
  },
  {
    code: '<button data-testid="confirmar-turno">Confirmar</button>',
    rule: 0,
    why: 'Está en el botón que se clickea y el nombre dice qué hace, sin mencionar diseño ni posición.',
    hint: '¿El nombre seguiría siendo cierto después de un rediseño?',
  },
  {
    code: '<button data-testid="boton-verde">Reservar</button>',
    rule: 2,
    why: '«verde» describe cómo se ve. Si diseño cambia el color, el nombre miente aunque el botón siga haciendo lo mismo.',
    hint: '¿Qué pasa con este nombre si el botón cambia de color?',
  },
  {
    code: '<li data-testid="turno-item"><span>09:00</span><span>Dra. Paz</span></li>',
    rule: 0,
    why: 'Es un atributo de contenedor y está en el `<li>` que agrupa el turno: se combina con `filter` para elegir uno.',
    hint: '¿Este elemento es un contenedor con sentido propio?',
  },
  {
    code: '<button data-testid="boton">Cancelar turno</button>',
    rule: 3,
    why: '«boton» no dice qué hace: en cuanto aparezca otro botón con el mismo criterio, el atributo deja de identificar uno solo.',
    hint: '¿Este nombre distinguiría este botón de cualquier otro botón de la pantalla?',
  },
  {
    code: '<span data-testid="estado-turno">Confirmado</span>',
    rule: 0,
    why: 'Es un texto que se verifica, con el atributo en el propio `<span>` y un nombre por su propósito.',
    hint: '¿El atributo está en el elemento que el test va a leer?',
  },
  {
    code: '<div data-testid="columna-derecha"><button>Ver mapa</button></div>',
    rule: 2,
    why: '«columna-derecha» describe la posición en la pantalla. Con otro diseño, el contenedor puede quedar a la izquierda o arriba.',
    hint: '¿El nombre dice qué es el contenedor o dónde está?',
  },
  {
    code: '<section data-testid="formulario-turno"><select id="esp">...</select><button>Buscar</button></section>',
    rule: 0,
    why: 'Es un contenedor que agrupa el formulario completo, y el nombre dice qué es. Los campos de adentro se buscan con `getByLabel` o `getByRole`.',
    hint: '¿Este atributo describe un contenedor o un campo?',
  },
];

export const TESTID_QUIZ: QuizQuestion[] = [
  {
    question: 'La agenda tiene `<button data-testid="reservar-turno">Reservar</button>`. ¿Cuántos elementos encuentra `page.getByTestId(\'reservar\')`?',
    options: [
      {text: 'Uno: busca una parte del valor, igual que `getByText`.', correct: false, why: '`getByTestId` no busca partes: compara el valor completo.'},
      {text: 'Ninguno: compara el valor completo y exacto.', correct: true, why: '«reservar» no es «reservar-turno». Un test id se compara entero, distinguiendo mayúsculas.'},
      {text: 'Uno, porque no distingue mayúsculas.', correct: false, why: 'Las mayúsculas no son el problema: el valor no está completo.'},
    ],
  },
  {
    question: 'La suite configura `use: { testIdAttribute: \'data-qa\' }`. Un botón tiene `data-testid="pedir-turno"` y ningún `data-qa`. ¿Qué encuentra `getByTestId(\'pedir-turno\')`?',
    options: [
      {text: 'El botón: `getByTestId` busca en los dos atributos.', correct: false, why: 'Busca en un solo atributo, el que define `testIdAttribute`.'},
      {text: 'Falla con un error de configuración.', correct: false, why: 'No hay error: el locator simplemente no encuentra elementos con `data-qa="pedir-turno"`.'},
      {text: 'Nada: con esa configuración, `getByTestId` busca `data-qa`.', correct: true, why: '`testIdAttribute` reemplaza a `data-testid` para toda la suite.'},
    ],
  },
  {
    question: 'Un test hace click con `getByTestId(\'cancelar-turno\')`. Un cambio de la aplicación reemplaza el `<button>` por un `<div>` con el mismo atributo y sin rol. ¿Qué pasa con el test?',
    options: [
      {text: 'Sigue pasando, aunque el elemento ya no sea un botón para quien usa un lector de pantalla.', correct: true, why: 'El test id no verifica nada que perciba la persona. Con `getByRole(\'button\', ...)`, el test habría fallado y mostrado el defecto.'},
      {text: 'Falla, porque `getByTestId` solo encuentra botones.', correct: false, why: '`getByTestId` encuentra cualquier elemento con el atributo, sea cual sea su etiqueta.'},
      {text: 'Falla por strict mode violation.', correct: false, why: 'Sigue habiendo un solo elemento con ese valor: no hay ambigüedad.'},
    ],
  },
];

export const CODEGEN_PREFIX = 'npx playwright ';
export const CODEGEN_STEPS: BuilderStep[] = [
  {options: ['test', 'show-report', 'codegen'], correct: 'codegen', hint: 'Ese comando no abre el generador de tests.'},
  {options: ['--test-id-attribute data-qa', '--project=data-qa', '--grep data-qa'], correct: '--test-id-attribute data-qa', hint: 'Esa opción no le dice al generador qué atributo usar para los test ids.'},
  {options: ['-o tests/turnos.spec.ts', '--list', '--headed'], correct: '-o tests/turnos.spec.ts', hint: 'Esa opción no guarda el código generado en un archivo.'},
  {options: ['tests/turnos.spec.ts', 'http://localhost:3000/turnos', '--last-failed'], correct: 'http://localhost:3000/turnos', hint: 'Al final va la página donde empieza la grabación.'},
];
export const CODEGEN_EXPLANATION =
  '`npx playwright codegen --test-id-attribute data-qa -o tests/turnos.spec.ts http://localhost:3000/turnos` abre la agenda en un navegador y el Inspector, genera locators de test id con `data-qa` y guarda lo grabado en un archivo.';

export const ICON_START = 'icon';
export const ICON_NODES: Record<string, DecisionNode> = {
  icon: {
    id: 'icon',
    situation: 'En la agenda, cada turno tiene un ícono de estado sin texto, un `<div>` con un círculo de color. El test tiene que abrir el detalle haciendo click en el ícono del turno de las 10:00. No tiene rol, nombre ni título. ¿Qué hacés?',
    options: [
      {text: "Usar `page.locator('.circle-green')`.", correct: false, why: 'Es una clase de diseño: describe el color, que cambia con el estado del turno y con cualquier rediseño.'},
      {text: 'Pedirle al equipo de desarrollo un `data-testid` para el ícono y reportar que no es accesible.', correct: true, why: 'Sin rol ni nombre, un atributo de test es la opción estable. Que un control clickeable no tenga rol ni nombre es, además, un defecto de accesibilidad.', next: 'wrapper'},
      {text: 'Usar el cuarto `<div>` del turno con `nth(3)`.', correct: false, why: 'Elegir por posición se rompe con el primer cambio de estructura.'},
    ],
  },
  wrapper: {
    id: 'wrapper',
    situation: 'Ya está el atributo en la agenda. En la misma entrega agregaron `data-testid="campo-dni"` para el buscador por DNI, y `getByTestId(\'campo-dni\').fill(\'30111222\')` falla con «Element is not an <input>, <textarea>, <select> or [contenteditable]». ¿Qué revisás?',
    options: [
      {text: 'Si el atributo quedó en el contenedor del campo en lugar del `<input>`.', correct: true, why: 'El mensaje dice que el elemento encontrado no es un campo. La línea «locator resolved to» del call log muestra cuál es.', next: 'qa'},
      {text: 'Si el DNI tiene un formato inválido.', correct: false, why: 'El error no habla del valor: dice que el elemento no acepta texto.'},
      {text: 'Si hay dos elementos con el mismo atributo.', correct: false, why: 'Eso daría strict mode violation, no este error.'},
    ],
  },
  qa: {
    id: 'qa',
    situation: 'Resuelto. Al revisar el resto de la aplicación ves que el equipo ya usaba `data-qa` en todas las pantallas, y ahora conviven los dos atributos. Acuerdan quedarse con `data-qa`. ¿Qué cambiás en la suite?',
    options: [
      {text: "Reemplazar cada `getByTestId(...)` por `page.locator('[data-qa=\"...\"]')`.", correct: false, why: 'Funciona, pero cambia cada test. Playwright permite cambiar el atributo en un solo lugar.'},
      {text: 'Nada: `getByTestId` encuentra los dos atributos.', correct: false, why: '`getByTestId` busca un solo atributo, `data-testid` por defecto.'},
      {text: "Configurar `testIdAttribute: 'data-qa'` en `use`.", correct: true, why: 'Desde ese momento `getByTestId` busca `data-qa` en toda la suite, sin tocar los tests.'},
    ],
  },
};
export const ICON_EXPLANATION =
  'Un elemento sin rol ni nombre se identifica con un atributo de test, y además se reporta como problema de accesibilidad. El atributo va en el elemento interactivo, y el nombre del atributo se configura una sola vez con `testIdAttribute`.';
