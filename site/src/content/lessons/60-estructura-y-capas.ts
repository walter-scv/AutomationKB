import type {CodeLine} from '@site/src/components/FindInCode';
import type {DecisionNode} from '@site/src/components/DecisionPath';
import type {ClassifyItem} from '@site/src/components/Classify';

export const LAYER_RULE_LABELS = ['Va en un Page Object', 'Va en un helper', 'Va en la capa de datos o fixtures'];
export const LAYER_LINES: CodeLine[] = [
  {
    code: "await page.getByRole('row').filter({ hasText: '09:30' }).getByRole('button', { name: 'Cancelar' }).click();",
    rule: 1,
    why: 'Saber cómo está armada la agenda (filas, botones, nombres) es conocimiento de la pantalla: va en un método como `agendaPage.cancelar(\'09:30\')`.',
    hint: '¿Esta línea dice qué hace la recepcionista o cómo está construida la pantalla?',
  },
  {
    code: "await expect(agendaPage.estado('09:30')).toHaveText('Cancelado');",
    rule: 0,
    why: 'Es la verificación, en lenguaje de negocio, usando el Page Object: es justo lo que le toca al test.',
    hint: '¿Hay algún detalle de la pantalla o de la API en esta línea?',
  },
  {
    code: "await request.post('/api/turnos', { data: { hora: '09:30', paciente: '30111222' }, headers: { 'x-clinica': 'sede-centro' } });",
    rule: 2,
    why: 'Cómo se llama la API y qué encabezados pide es lógica compartida, que no es de ninguna pantalla: va en un helper como `crearTurno(request, turno)`.',
    hint: '¿Esta línea habla de una pantalla o de un servicio?',
  },
  {
    code: "const paciente = await crearPaciente(request, unPaciente().build()); // al principio de 12 tests, y ninguno lo borra",
    rule: 3,
    why: 'Cómo crear el paciente ya está en los helpers. Lo que falta es quién decide que el test lo necesita y lo borra al terminar: una fixture que lo crea antes y lo limpia después.',
    hint: 'El cómo ya está resuelto: ¿quién se encarga del antes y del después?',
  },
  {
    code: "await sembrarTurno(unTurno().aLas('09:30').build());",
    rule: 0,
    why: 'El test solo dice qué dato necesita: la fixture lo crea con el helper y lo borra al terminar.',
    hint: '¿El test sabe acá cómo se crea el turno o cómo se borra?',
  },
  {
    code: "const total = Number((await page.locator('#total').textContent())?.replace('$ ', '').replace('.', ''));",
    rule: 1,
    why: 'Leer el total y quitarle el formato de la pantalla es saber cómo muestra los datos esa pantalla: va en un método del Page Object que devuelva un número.',
    hint: '¿Quién sabe que el total se muestra con «$ » y punto de miles?',
  },
  {
    code: "await test.step('2- La recepcionista cancela el turno de las 09:30', async () => {",
    rule: 0,
    why: 'Los pasos con nombre del negocio son parte del test.',
    hint: '¿Esta línea describe el caso o un detalle técnico?',
  },
  {
    code: "test.afterEach(async ({ request }) => { await request.delete('/api/turnos/' + idTurno); });",
    rule: 3,
    why: 'Limpiar lo que el test creó es responsabilidad de la capa de datos: una fixture que crea y borra, sin que cada test lo repita.',
    hint: '¿Cada test que crea un turno tendría que repetir esta limpieza?',
  },
];

export const REFACTOR_START = 'redesign';
export const REFACTOR_NODES: Record<string, DecisionNode> = {
  redesign: {
    id: 'redesign',
    situation: 'La suite de la agenda tiene 40 tests sin capas. Un rediseño cambia el botón «Cancelar» por «Cancelar turno», y fallan 25 tests en 9 archivos. ¿Qué hacés?',
    options: [
      {text: 'Reemplazar el texto en los 9 archivos con buscar y reemplazar.', correct: false, why: 'Arregla hoy, pero el próximo cambio de la pantalla vuelve a romper 25 tests: el locator sigue repetido en todos.'},
      {text: 'Crear un Page Object de la agenda con un método `cancelar(hora)` y usarlo en los tests.', correct: true, why: 'El conocimiento de la pantalla pasa a un solo lugar: el próximo cambio se arregla en una línea.', next: 'data'},
      {text: 'Cambiar los locators a CSS, que no dependen del texto.', correct: false, why: 'Cambia una fragilidad por otra: las clases y las posiciones cambian con cualquier rediseño.'},
    ],
  },
  data: {
    id: 'data',
    situation: 'Con el Page Object, los tests se leen mejor. Pero cada test crea su paciente con 15 líneas de `request.post` copiadas, y varios no lo borran al terminar. ¿Qué hacés?',
    options: [
      {text: 'Mover las 15 líneas a un método del Page Object de la agenda.', correct: false, why: 'Crear un paciente por API no es saber interactuar con la pantalla: el Page Object quedaría mezclado.'},
      {text: 'Dejarlas en cada test, porque cada uno necesita su paciente.', correct: false, why: 'Cada test necesita el dato, pero no tiene que saber cómo se crea; y los que no limpian ensucian el entorno.'},
      {text: 'Pasar la llamada a un helper y la creación con limpieza a una fixture.', correct: true, why: 'El helper sabe hablar con la API; la fixture crea antes y borra después; el test solo pide el paciente.', next: 'check'},
    ],
  },
  check: {
    id: 'check',
    situation: 'Para revisar si la separación quedó bien, leés un test tapando el código de los Page Objects y helpers. ¿Qué indica que todavía hay algo en la capa equivocada?',
    options: [
      {text: 'Que el test tenga pasos con nombre.', correct: false, why: 'Los pasos con nombre son parte del test: describen el caso.'},
      {text: 'Que aparezca en el test un locator, una cuenta o una llamada a la API.', correct: true, why: 'Esos detalles son de otras capas: si están en el test, el test sabe más de lo que le toca.'},
      {text: 'Que el test use una assertion.', correct: false, why: 'Las assertions van en el test: decidir si el resultado es correcto le toca a él.'},
    ],
  },
};
export const REFACTOR_EXPLANATION =
  'El conocimiento de las pantallas va a los Page Objects, la comunicación con la API a los helpers y la creación y limpieza de datos a las fixtures. El test queda como el caso de prueba que automatiza.';

export const FOLDER_COLUMNS = ['pages/', 'tests/', 'helpers/'];
export const FOLDER_ITEMS: ClassifyItem[] = [
  {code: 'AgendaPage.ts: los locators y métodos de la pantalla de agenda.', column: 0, why: 'Un Page Object por pantalla, en `pages/`.', hint: '¿Describe cómo interactuar con una pantalla?'},
  {code: 'cancelar-turno.spec.ts: los tests de cancelación.', column: 1, why: 'Los archivos de test, `*.spec.ts`, van en `tests/`.', hint: '¿Termina en `.spec.ts`?'},
  {code: 'api.ts: funciones que crean y borran turnos llamando a la API.', column: 2, why: 'Lógica compartida que no es de una pantalla: `helpers/`.', hint: '¿Habla con una pantalla o con un servicio?'},
  {code: 'BasePage.ts: la clase de la que heredan todos los Page Objects.', column: 0, why: 'Es parte de la capa de Page Objects.', hint: '¿Quién hereda de esta clase?'},
  {code: 'base-test.ts: las fixtures que reciben todos los tests.', column: 1, why: 'Las fixtures se declaran junto a los tests que las usan, en `tests/`.', hint: '¿Quién importa este archivo?'},
  {code: 'paciente.builder.ts: arma pacientes de prueba con valores por defecto.', column: 2, why: 'Armar datos de prueba es lógica compartida: `helpers/`.', hint: '¿Es una pantalla o una utilidad para los datos?'},
  {code: 'auth.setup.ts: ingresa una vez y guarda la sesión.', column: 1, why: 'Es un archivo de setup que corre como parte de la suite, en `tests/`.', hint: '¿Lo ejecuta el runner de tests?'},
];
