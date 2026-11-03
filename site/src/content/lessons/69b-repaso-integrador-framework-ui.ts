import type {DecisionNode} from '@site/src/components/DecisionPath';
import type {MatchItem} from '@site/src/components/Match';
import type {CodeLine} from '@site/src/components/FindInCode';
import type {OrderItem, OrderRule} from '@site/src/components/Order';
import type {SpotTokenRound} from '@site/src/components/SpotToken';
import type {MultiSelectQuestion} from '@site/src/components/MultiSelect';
import type {QuizQuestion} from '@site/src/components/Quiz';

// 1. Escenario encadenado (60, 61, 63, 64, 66, 67)
export const FW_START = 'mixed';
export const FW_NODES: Record<string, DecisionNode> = {
  mixed: {
    id: 'mixed',
    situation: 'La suite de la agenda son 40 tests con locators, datos y pasos mezclados en cada archivo. El botón Reservar cambió de nombre y hubo que tocar 23 archivos. ¿Por dónde empezás?',
    options: [
      {text: 'Agregar comentarios en cada test que digan qué botón usa, para encontrarlos más rápido.', correct: false, why: 'Los 23 cambios siguen siendo 23: el locator sigue repetido.'},
      {text: 'Separar por capas, con un Page Object por pantalla que tenga los locators y las acciones.', correct: true, why: 'El locator del botón queda en un solo lugar, `AgendaPage`, y el cambio se hace una vez (entradas 60 y 61).', next: 'base'},
      {text: 'Pedirle a desarrollo un `data-testid` para cada botón.', correct: false, why: 'Hace el locator más estable, pero si sigue copiado en 23 archivos, cualquier otro cambio vuelve a tocar los 23.'},
    ],
  },
  base: {
    id: 'base',
    situation: 'Ya hay 12 Page Objects, y todos repiten el mismo `abrir()` y el mismo `completar(campo, valor)`. ¿Qué hacés?',
    options: [
      {text: 'Una clase abstracta `BasePage` con esos métodos y una `ruta` abstracta que cada página define.', correct: true, why: 'Lo común se escribe una vez, y `abstract` obliga a cada Page Object a declarar su ruta (entrada 63).', next: 'fixtures'},
      {text: 'Un Page Object `ComunPage` con esos métodos, que cada test crea además del de su pantalla.', correct: false, why: 'Cada test tendría que manejar dos objetos para una sola pantalla: la herencia lo resuelve dentro del Page Object.'},
      {text: 'Dejarlo así: son métodos cortos.', correct: false, why: 'Son cortos, pero están en 12 lugares: un cambio en la forma de completar campos obliga a tocar las 12 clases.'},
    ],
  },
  fixtures: {
    id: 'fixtures',
    situation: 'Cada test empieza con `const agenda = new AgendaPage(page);` y `const ingreso = new IngresoPage(page);`. ¿Qué cambiás?',
    options: [
      {text: 'Crear los Page Objects en un `beforeAll` y guardarlos en variables del archivo.', correct: false, why: '`page` se crea para cada test: Playwright no lo entrega en `beforeAll` y falla con «"context" and "page" fixtures are not supported in "beforeAll"».'},
      {text: 'Un Page Object que cree a todos los demás.', correct: false, why: 'Mezcla responsabilidades y cada test sigue creando objetos que no usa.'},
      {text: 'Fixtures `agendaPage` e `ingresoPage` en `base-test.ts`, que el test pide por nombre.', correct: true, why: 'El test pide lo que necesita y Playwright lo crea para ese test (entrada 64).', next: 'login'},
    ],
  },
  login: {
    id: 'login',
    situation: 'Los 40 tests ingresan por la interfaz en un `beforeEach`, y la suite tarda el doble. ¿Qué cambiás?',
    options: [
      {text: 'Un `beforeAll` que ingresa una vez por archivo.', correct: false, why: 'En `beforeAll` no hay `page`; y aunque se ingrese con un contexto creado a mano, cada test arranca con su propio contexto, sin esas cookies.'},
      {text: 'Un proyecto de setup que ingresa una vez y guarda la sesión, y `storageState` con `dependencies` en el proyecto de tests.', correct: true, why: 'Un ingreso por corrida, y cada test arranca con la sesión cargada (entrada 67).', next: 'env'},
      {text: 'Bajar el `timeout` del ingreso.', correct: false, why: 'El tiempo se va en la cantidad de ingresos, no en esperarlos.'},
    ],
  },
  env: {
    id: 'env',
    situation: 'La suite tiene que correr contra tu computadora y contra staging, con cuentas distintas en cada uno. Hoy las direcciones y las contraseñas están escritas en los tests. ¿Qué hacés?',
    options: [
      {text: 'Variables de entorno en `.env`, fuera del repositorio, una plantilla `.env.example` versionada y `baseURL` leída del entorno.', correct: true, why: 'Lo que cambia según el entorno y los secretos salen del código; `.env.example` dice qué completar (entrada 66).'},
      {text: 'Dos copias de la suite, una por entorno.', correct: false, why: 'Cada cambio se hace dos veces: es la duplicación que el framework quiere evitar.'},
      {text: 'Un archivo `config.ts` versionado con las dos direcciones y las dos contraseñas.', correct: false, why: 'Las contraseñas quedarían en el repositorio: los secretos no se versionan.'},
    ],
  },
};
export const FW_EXPLANATION =
  'De tests mezclados a un framework: Page Objects (60, 61), BasePage (63), fixtures (64), sesión reutilizada (67) y variables de entorno (66).';

// 2. Emparejar (60, 62, 64, 65, 66, 67)
export const PIECE_LEFT: MatchItem[] = [
  {id: 'po', text: "`turno(hora: string): Locator { return this.page.getByRole('row').filter({ hasText: hora }); }`"},
  {id: 'builder', text: "`aLas(hora: string): TurnoBuilder { this.turno.hora = hora; return this; }`"},
  {id: 'env', text: '`PACIENTE_DNI=30111222`'},
  {id: 'example', text: '`PACIENTE_DNI=<DNI del paciente de prueba>`'},
  {id: 'fixture', text: '`export const test = base.extend<Fixtures>({ ... })`'},
  {id: 'config', text: "`{ name: 'setup', testMatch: /.*\\.setup\\.ts/ }`"},
  {id: 'setup', text: "`await page.context().storageState({ path: 'playwright/.auth/recepcionista.json' });`"},
  {id: 'spec', text: "`await expect(agendaPage.estado('10:30')).toHaveText('Reprogramado');`"},
];
export const PIECE_RIGHT: MatchItem[] = [
  {id: 'setup', text: '`tests/auth.setup.ts`'},
  {id: 'example', text: '`.env.example`'},
  {id: 'spec', text: '`tests/turnos.spec.ts`'},
  {id: 'builder', text: '`helpers/turno.builder.ts`'},
  {id: 'config', text: '`playwright.config.ts`'},
  {id: 'po', text: '`pages/AgendaPage.ts`'},
  {id: 'fixture', text: '`tests/base-test.ts`'},
  {id: 'env', text: '`.env`'},
];
export const PIECE_WHY: Record<string, string> = {
  po: 'Un método fábrica de locators es conocimiento de la pantalla: va en su Page Object (entrada 62).',
  builder: 'Los métodos que arman el dato paso a paso son del builder (entrada 65).',
  env: 'El valor real de una variable va en `.env`, que no se versiona (entrada 66).',
  example: 'La plantilla sin valores reales es `.env.example`, que sí se versiona (entrada 66).',
  fixture: 'Las fixtures propias se definen en `base-test.ts`, el BaseTest de la suite (entrada 64).',
  config: 'Los proyectos se declaran en la configuración (entrada 67).',
  setup: 'Guardar la sesión es lo último que hace el archivo de setup (entrada 67).',
  spec: 'La assertion la hace el test, no el Page Object (entradas 60 y 61).',
};

// 3. Buscar en el código (61, 62, 65, 66)
export const REV_RULE_LABELS = [
  'Verifica dentro del Page Object',
  'Locator fuera del Page Object',
  'Valor que tiene que venir del entorno',
  'Dato que nadie limpia',
];
export const REV_LINES: CodeLine[] = [
  {
    code: "await page.getByRole('button', { name: 'Reprogramar' }).click(); // en turnos.spec.ts; AgendaPage tiene reprogramar(hora, horaNueva)",
    rule: 2,
    why: 'El test escribe un locator que ya vive en `AgendaPage`: si el botón cambia, hay que corregirlo en dos lugares (entrada 62).',
    hint: '¿Qué capa de la suite ya sabe dónde está ese botón?',
  },
  {
    code: "async cancelar(hora: string) { await this.turno(hora).getByRole('button', { name: 'Cancelar' }).click(); await expect(this.mensaje).toHaveText('Turno cancelado'); }",
    rule: 1,
    why: 'El Page Object hace la acción y además decide el resultado esperado. La assertion va en el test (entrada 61).',
    hint: '¿Quién tendría que decidir cuál es el mensaje correcto?',
  },
  {
    code: "await page.goto('https://staging.clinica.test/agenda');",
    rule: 3,
    why: 'La dirección cambia según el entorno: va en `BASE_URL`, y la página se abre con una ruta relativa, como hace `abrir()` (entrada 66).',
    hint: '¿Esta línea funciona igual en tu computadora que en staging?',
  },
  {
    code: "await sembrarTurno(unTurno().aLas('11:00').build());",
    rule: 0,
    why: 'Crea el turno por la API con la fixture, que lo borra al terminar (entrada 65).',
    hint: '¿Quién borra este turno al terminar?',
  },
  {
    code: "const turno = await crearTurno(request, unTurno().aLas('11:00').build()); // en el test, sin fixture y sin borrarlo",
    rule: 4,
    why: 'El turno queda en el sistema después del test y puede chocar con la corrida siguiente. Tiene que crearse con `sembrarTurno` (entrada 65).',
    hint: '¿Qué pasa con este turno cuando termina el test?',
  },
  {
    code: "await ingresoPage.ingresar(variable('RECEPCIONISTA_EMAIL'), variable('RECEPCIONISTA_CLAVE'));",
    rule: 0,
    why: 'Los datos de la cuenta salen del entorno, y `variable` falla con un mensaje claro si faltan (entrada 66).',
    hint: '¿De dónde salen el email y la contraseña?',
  },
  {
    code: "await ingresoPage.ingresar('marta@clinica.test', 'Marta2024!');",
    rule: 3,
    why: 'La contraseña queda escrita en el repositorio, y la cuenta no se puede cambiar por entorno (entrada 66).',
    hint: '¿Esa contraseña puede quedar en el código?',
  },
  {
    code: "await expect(agendaPage.estado('10:30')).toHaveText('Cancelado');",
    rule: 0,
    why: 'El test pide el locator al Page Object y hace él la verificación (entrada 61).',
    hint: '¿Quién verifica y de dónde sale el locator?',
  },
];

// 4. Ordenar (64, 65, 67, 69)
export const RUN_ITEMS: OrderItem[] = [
  {id: 'step', what: 'Momento', code: 'El test reprograma el turno y verifica su estado nuevo.'},
  {id: 'gen', what: 'Momento', code: 'npx allure generate arma el reporte desde allure-results.'},
  {id: 'login', what: 'Momento', code: 'El proyecto setup ingresa como recepcionista y verifica que llegó a la agenda.'},
  {id: 'clean', what: 'Momento', code: 'La fixture sembrarTurno borra el turno, después de use.'},
  {id: 'save', what: 'Momento', code: 'El setup guarda la sesión en recepcionista.json.'},
  {id: 'result', what: 'Momento', code: 'allure-playwright escribe el resultado del test en allure-results.'},
  {id: 'seed', what: 'Momento', code: 'La fixture sembrarTurno crea el turno de las 10:30 por la API.'},
];
export const RUN_CORRECT = ['login', 'save', 'seed', 'step', 'clean', 'result', 'gen'];
export const RUN_RULES: OrderRule[] = [
  {before: 'login', after: 'save', why: 'La sesión se guarda después de confirmar que el ingreso funcionó (entrada 67).'},
  {before: 'save', after: 'seed', why: 'El proyecto de tests depende del setup: no empieza hasta que la sesión está guardada (entrada 67).'},
  {before: 'seed', after: 'step', why: 'La fixture prepara el dato antes de `use`, es decir, antes del cuerpo del test (entradas 64 y 65).'},
  {before: 'step', after: 'clean', why: 'Lo que está después de `use` corre cuando el test terminó (entrada 64).'},
  {before: 'clean', after: 'result', why: 'El resultado del test se registra cuando terminó todo, incluida la limpieza de sus fixtures.'},
  {before: 'result', after: 'gen', why: 'El reporte se genera después de la corrida, desde los resultados crudos (entrada 69).'},
];

// 5. Respuesta escrita (41, 67)
export const DEPS_CODE = `$ npx playwright test turnos --project=chromium --no-deps

Error: Error reading storage state from playwright/.auth/recepcionista.json:
ENOENT: no such file or directory, open 'playwright/.auth/recepcionista.json'`;
export const DEPS_ACCEPTED = [
  'npx playwright test --project=setup',
  'npx playwright test --project setup',
  'npx playwright test auth.setup',
  'npx playwright test auth.setup.ts',
  'npx playwright test tests/auth.setup.ts',
  'npx playwright test tests/auth.setup',
  'npx playwright test auth.setup --project=setup',
  'npx playwright test --project=setup auth.setup',
];
export const DEPS_HINTS = [
  'El archivo que falta lo crea un proyecto que `--no-deps` salteó.',
  'Es `npx playwright test` con la opción que elige un proyecto y el nombre del proyecto que ingresa, o con el archivo de setup.',
];
export const DEPS_EXPLANATION =
  '`npx playwright test --project=setup` corre solo el ingreso y guarda la sesión. Después, `--no-deps` encuentra el archivo (entrada 67).';

// 6. Señalar en la línea (63, 65, 66, 67)
export const DETAIL_PROMPT = '¿Qué parte de esta línea causa el problema?';
export const DETAIL_ROUNDS: SpotTokenRound[] = [
  {
    line: "const turno = await crearTurno(request, datos); await borrarTurno(request, turno.id); await use(turno); // fixture sembrarTurno",
    targetIndex: 7,
    why: 'La fixture borra el turno antes de entregarlo: el test recibe un turno que ya no existe. La limpieza va después de `use` (entrada 65).',
    hint: '¿En qué momento corre cada parte de una fixture respecto de `use`?',
  },
  {
    line: "test.use({ storageState: 'playwright/.auth/recepcionista.json' }); // primera línea de ingreso.spec.ts",
    targetIndex: 2,
    why: 'Los tests del formulario de ingreso necesitan arrancar sin sesión: en ese archivo va `{ cookies: [], origins: [] }` (entrada 67).',
    hint: '¿Qué necesita un test que prueba el formulario de ingreso?',
  },
  {
    line: 'RECEPCIONISTA_CLAVE=Marta2024! # en .env.example, que se versiona',
    targetIndex: 0,
    why: 'La plantilla versionada no lleva valores reales: la contraseña queda en el repositorio. Va un texto que explique qué completar (entrada 66).',
    hint: '¿Quién puede leer lo que está en `.env.example`?',
  },
  {
    line: "export class AgendaPage implements BasePage { // tsc: Property 'abrir' is missing in type 'AgendaPage' but required in type 'BasePage'.",
    targetIndex: 3,
    why: '`implements` solo exige que la clase tenga la forma de `BasePage`, sin heredar su código: por eso le falta `abrir()`. Para heredarlo, `extends BasePage` (entrada 63).',
    hint: '¿Qué palabra hace que una clase herede el código de otra?',
  },
];

// 7. Marcar todas (66, 67, 68, 69)
export const REPO_QUESTIONS: MultiSelectQuestion[] = [
  {
    prompt: '¿Qué archivos y carpetas del framework de la agenda van al repositorio? Marcá todos los que se versionan.',
    options: [
      {text: '`.env.example`', correct: true, why: 'Es la plantilla que dice qué variables completar, sin valores reales (entrada 66).'},
      {text: '`playwright/.auth/recepcionista.json`', correct: false, why: 'Tiene la sesión: es tan sensible como una contraseña y se genera en cada corrida (entrada 67).'},
      {text: '`features/reservar.feature`', correct: true, why: 'Los escenarios son parte de la suite: se escriben, se revisan y se versionan (entrada 68).'},
      {text: '`allure-results/`', correct: false, why: 'Son resultados crudos de una corrida: se generan cada vez (entrada 69).'},
      {text: '`allurerc.mjs`', correct: true, why: 'Es configuración de la suite, como `playwright.config.ts` (entrada 69).'},
      {text: '`.features-gen/`', correct: false, why: 'Lo genera `bddgen` desde los `.feature` en cada corrida (entrada 68).'},
      {text: '`.env`', correct: false, why: 'Tiene secretos y valores de cada persona (entrada 66).'},
    ],
  },
];

// 8. Elegí la opción (66, 68, 69)
export const READ_QUIZ: QuizQuestion[] = [
  {
    question: 'La suite pasa en tu computadora, pero en CI todos los tests fallan con: Error: Falta la variable de entorno PACIENTE_DNI. Copiá .env.example a .env y completala. ¿Qué hacés?',
    options: [
      {text: 'Versionar tu `.env` para que CI lo tenga.', correct: false, why: '`.env` no se versiona: tiene secretos y valores de cada persona.'},
      {text: 'Configurar `PACIENTE_DNI` en las variables de la plataforma de CI.', correct: true, why: 'En CI no hay `.env`: las variables se configuran en la plataforma (entrada 66; sección IV).'},
      {text: 'Cambiar `variable(\'PACIENTE_DNI\')` por `process.env.PACIENTE_DNI ?? \'\'`.', correct: false, why: 'El error desaparece, pero el test usa un DNI vacío y falla más adelante, lejos de la causa.'},
    ],
  },
  {
    question: 'En el reporte de Allure, el test reprogramar un turno muestra en sus últimas 5 corridas: pasó, falló, pasó, pasó, falló. Nadie cambió el código entre esas corridas. ¿Qué concluís?',
    options: [
      {text: 'Que hubo un defecto y ya se corrigió, porque la mayoría de las corridas pasan.', correct: false, why: 'Nadie cambió el código: no hubo corrección. El resultado alterna con el mismo código.'},
      {text: 'Que el historial de Allure está mezclando resultados de otro test.', correct: false, why: 'El historial se agrupa por test: son los resultados de este test.'},
      {text: 'Que el test es inestable: con el mismo código, a veces pasa y a veces falla, y hay que investigar por qué.', correct: true, why: 'Es lo que el historial deja ver y una corrida sola no: un resultado que no depende del código (entrada 69; el triage se ve en la sección IV).'},
    ],
  },
  {
    question: 'En el .feature de reservas aparece el paso: Cuando la recepcionista hace clic en el botón azul de la tercera fila. ¿Qué problema tiene?',
    options: [
      {text: 'Describe la pantalla en lugar del comportamiento: deja de servir con un rediseño y negocio no lo entiende.', correct: true, why: 'Un paso de Gherkin habla del negocio, como «Cuando la recepcionista cancela el turno de las 10:30» (entrada 68).'},
      {text: 'Falta la palabra clave Dado al principio.', correct: false, why: '`Cuando` es correcto para una acción; `Dado` es para el estado inicial.'},
      {text: 'Gherkin no admite números en los pasos.', correct: false, why: 'Los admite: los datos, entre comillas, llegan como parámetros a la definición.'},
    ],
  },
];
