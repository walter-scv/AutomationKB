import type {FillBlankSlot} from '@site/src/components/FillBlank';
import type {DecisionNode} from '@site/src/components/DecisionPath';
import type {MultiSelectQuestion} from '@site/src/components/MultiSelect';
import type {TerminalStep} from '@site/src/components/Terminal';

export const AUTH_TEMPLATE = `projects: [
  { name: 'setup', {{a}}: /.*\\.setup\\.ts/ },
  {
    name: 'chromium',
    use: {
      ...devices['Desktop Chrome'],
      {{b}}: 'playwright/.auth/recepcionista.json',
    },
    {{c}}: ['{{d}}'],
  },
],`;
export const AUTH_SLOTS: FillBlankSlot[] = [
  {id: 'a', answer: 'testMatch'},
  {id: 'b', answer: 'storageState'},
  {id: 'c', answer: 'dependencies'},
  {id: 'd', answer: 'setup'},
];
export const AUTH_BANK = ['testDir', 'setup', 'storageState', 'chromium', 'dependencies', 'testMatch', 'baseURL', 'globalSetup'];
export const AUTH_EXPLANATION =
  '`testMatch` hace que el proyecto `setup` corra solo los archivos `.setup.ts`. `storageState` carga la sesión guardada en cada test de `chromium`, y `dependencies: [\'setup\']` hace que `chromium` espere a que el ingreso termine bien.';

export const AUTH_START = 'slow';
export const AUTH_NODES: Record<string, DecisionNode> = {
  slow: {
    id: 'slow',
    situation: 'La suite de la agenda tiene 300 tests, y todos ingresan como recepcionista por la interfaz en un `beforeEach`. La corrida tarda el doble de lo que debería. ¿Qué cambiás?',
    options: [
      {text: 'Un proyecto de setup que ingresa una vez y guarda la sesión con `storageState`, y que los tests la usen.', correct: true, why: 'El ingreso pasa de 300 veces a una por corrida, y los tests arrancan ya ingresados.', next: 'login'},
      {text: 'Bajar el timeout del ingreso para que falle más rápido.', correct: false, why: 'No reduce la cantidad de ingresos: el tiempo se va en hacerlos, no en esperarlos.'},
      {text: 'Correr con `--workers=1` para no sobrecargar el servidor de ingreso.', correct: false, why: 'Con un solo worker la corrida tarda todavía más.'},
    ],
  },
  login: {
    id: 'login',
    situation: 'Ahora fallan los tests del ingreso: arrancan ya ingresados y nunca ven el formulario. ¿Qué hacés?',
    options: [
      {text: 'Borrar las cookies a mano al principio de cada test de ingreso.', correct: false, why: 'Funciona, pero repite código en cada test: Playwright permite elegir el estado inicial del grupo.'},
      {text: 'Mover los tests de ingreso al proyecto de setup.', correct: false, why: 'El setup prepara la sesión para los demás; mezclar ahí los tests del ingreso confunde su propósito.'},
      {text: 'Agregar `test.use({ storageState: { cookies: [], origins: [] } })` en el archivo de los tests de ingreso.', correct: true, why: 'Ese archivo arranca con un contexto vacío, sin sesión, como necesita.', next: 'role'},
    ],
  },
  role: {
    id: 'role',
    situation: 'Llegan los tests del panel de administración, que necesitan una sesión de administradora, distinta de la de recepcionista. ¿Cómo lo resolvés?',
    options: [
      {text: 'Que los tests de administración ingresen por la interfaz en un `beforeEach`.', correct: false, why: 'Vuelve el problema del principio para ese grupo: un ingreso por test.'},
      {text: 'Que el setup también ingrese como administradora y guarde `administradora.json`, y que esos tests lo elijan con `test.use`.', correct: true, why: 'Un archivo de sesión por rol, y cada grupo de tests elige el suyo.'},
      {text: 'Darle permisos de administradora a la cuenta de recepcionista de prueba.', correct: false, why: 'Los tests de recepción dejarían de probar lo que ve una recepcionista.'},
    ],
  },
};
export const AUTH_EXPLANATION_DP =
  'Ingresar una vez en el setup y reutilizar la sesión; los tests que necesitan otra sesión, o ninguna, la eligen con `test.use`.';

export const DEPS_STEPS: TerminalStep[] = [
  {
    instruction: 'En la biblioteca, corré solo el archivo de tests ingreso en el proyecto chromium.',
    accepted: ["npx playwright test --project chromium ingreso", "npx playwright test --project chromium ingreso.spec", "npx playwright test --project chromium ingreso.spec.ts", "npx playwright test --project chromium tests/ingreso", "npx playwright test --project chromium tests/ingreso.spec", "npx playwright test --project chromium tests/ingreso.spec.ts", "npx playwright test --project=chromium ingreso", "npx playwright test --project=chromium ingreso.spec", "npx playwright test --project=chromium ingreso.spec.ts", "npx playwright test --project=chromium tests/ingreso", "npx playwright test --project=chromium tests/ingreso.spec", "npx playwright test --project=chromium tests/ingreso.spec.ts", "npx playwright test ingreso --project chromium", "npx playwright test ingreso --project=chromium", "npx playwright test ingreso.spec --project chromium", "npx playwright test ingreso.spec --project=chromium", "npx playwright test ingreso.spec.ts --project chromium", "npx playwright test ingreso.spec.ts --project=chromium", "npx playwright test tests/ingreso --project chromium", "npx playwright test tests/ingreso --project=chromium", "npx playwright test tests/ingreso.spec --project chromium", "npx playwright test tests/ingreso.spec --project=chromium", "npx playwright test tests/ingreso.spec.ts --project chromium", "npx playwright test tests/ingreso.spec.ts --project=chromium"],
    hint: 'Es `npx playwright test`, el nombre del archivo y la opción que elige el proyecto.',
    output: 'Running 3 tests using 1 worker\n  ✓  1 [setup] › tests/auth.setup.ts:6:6 › ingresar con la socia de prueba (349ms)\n  ✓  2 [chromium] › tests/ingreso.spec.ts:8:7 › Ingreso › con datos correctos llega a sus préstamos (165ms)\n  ✓  3 [chromium] › tests/ingreso.spec.ts:16:7 › Ingreso › con una contraseña incorrecta muestra el error (126ms)\n  3 passed (1.3s)',
  },
  {
    instruction: 'Pediste 2 tests y corrieron 3: el proyecto setup corrió como dependencia. Los tests de ingreso arrancan sin sesión, así que no la necesitan. Repetí la corrida sin correr las dependencias.',
    accepted: ["npx playwright test --no-deps --project chromium ingreso", "npx playwright test --no-deps --project chromium ingreso.spec", "npx playwright test --no-deps --project chromium ingreso.spec.ts", "npx playwright test --no-deps --project chromium tests/ingreso", "npx playwright test --no-deps --project chromium tests/ingreso.spec", "npx playwright test --no-deps --project chromium tests/ingreso.spec.ts", "npx playwright test --no-deps --project=chromium ingreso", "npx playwright test --no-deps --project=chromium ingreso.spec", "npx playwright test --no-deps --project=chromium ingreso.spec.ts", "npx playwright test --no-deps --project=chromium tests/ingreso", "npx playwright test --no-deps --project=chromium tests/ingreso.spec", "npx playwright test --no-deps --project=chromium tests/ingreso.spec.ts", "npx playwright test --no-deps ingreso --project chromium", "npx playwright test --no-deps ingreso --project=chromium", "npx playwright test --no-deps ingreso.spec --project chromium", "npx playwright test --no-deps ingreso.spec --project=chromium", "npx playwright test --no-deps ingreso.spec.ts --project chromium", "npx playwright test --no-deps ingreso.spec.ts --project=chromium", "npx playwright test --no-deps tests/ingreso --project chromium", "npx playwright test --no-deps tests/ingreso --project=chromium", "npx playwright test --no-deps tests/ingreso.spec --project chromium", "npx playwright test --no-deps tests/ingreso.spec --project=chromium", "npx playwright test --no-deps tests/ingreso.spec.ts --project chromium", "npx playwright test --no-deps tests/ingreso.spec.ts --project=chromium", "npx playwright test --project chromium --no-deps ingreso", "npx playwright test --project chromium --no-deps ingreso.spec", "npx playwright test --project chromium --no-deps ingreso.spec.ts", "npx playwright test --project chromium --no-deps tests/ingreso", "npx playwright test --project chromium --no-deps tests/ingreso.spec", "npx playwright test --project chromium --no-deps tests/ingreso.spec.ts", "npx playwright test --project chromium ingreso --no-deps", "npx playwright test --project chromium ingreso.spec --no-deps", "npx playwright test --project chromium ingreso.spec.ts --no-deps", "npx playwright test --project chromium tests/ingreso --no-deps", "npx playwright test --project chromium tests/ingreso.spec --no-deps", "npx playwright test --project chromium tests/ingreso.spec.ts --no-deps", "npx playwright test --project=chromium --no-deps ingreso", "npx playwright test --project=chromium --no-deps ingreso.spec", "npx playwright test --project=chromium --no-deps ingreso.spec.ts", "npx playwright test --project=chromium --no-deps tests/ingreso", "npx playwright test --project=chromium --no-deps tests/ingreso.spec", "npx playwright test --project=chromium --no-deps tests/ingreso.spec.ts", "npx playwright test --project=chromium ingreso --no-deps", "npx playwright test --project=chromium ingreso.spec --no-deps", "npx playwright test --project=chromium ingreso.spec.ts --no-deps", "npx playwright test --project=chromium tests/ingreso --no-deps", "npx playwright test --project=chromium tests/ingreso.spec --no-deps", "npx playwright test --project=chromium tests/ingreso.spec.ts --no-deps", "npx playwright test ingreso --no-deps --project chromium", "npx playwright test ingreso --no-deps --project=chromium", "npx playwright test ingreso --project chromium --no-deps", "npx playwright test ingreso --project=chromium --no-deps", "npx playwright test ingreso.spec --no-deps --project chromium", "npx playwright test ingreso.spec --no-deps --project=chromium", "npx playwright test ingreso.spec --project chromium --no-deps", "npx playwright test ingreso.spec --project=chromium --no-deps", "npx playwright test ingreso.spec.ts --no-deps --project chromium", "npx playwright test ingreso.spec.ts --no-deps --project=chromium", "npx playwright test ingreso.spec.ts --project chromium --no-deps", "npx playwright test ingreso.spec.ts --project=chromium --no-deps", "npx playwright test tests/ingreso --no-deps --project chromium", "npx playwright test tests/ingreso --no-deps --project=chromium", "npx playwright test tests/ingreso --project chromium --no-deps", "npx playwright test tests/ingreso --project=chromium --no-deps", "npx playwright test tests/ingreso.spec --no-deps --project chromium", "npx playwright test tests/ingreso.spec --no-deps --project=chromium", "npx playwright test tests/ingreso.spec --project chromium --no-deps", "npx playwright test tests/ingreso.spec --project=chromium --no-deps", "npx playwright test tests/ingreso.spec.ts --no-deps --project chromium", "npx playwright test tests/ingreso.spec.ts --no-deps --project=chromium", "npx playwright test tests/ingreso.spec.ts --project chromium --no-deps", "npx playwright test tests/ingreso.spec.ts --project=chromium --no-deps"],
    hint: 'Es el mismo comando, con la opción que saltea las dependencias del proyecto.',
    output: 'Running 2 tests using 1 worker\n  ✓  1 [chromium] › tests/ingreso.spec.ts:8:7 › Ingreso › con datos correctos llega a sus préstamos (146ms)\n  ✓  2 [chromium] › tests/ingreso.spec.ts:16:7 › Ingreso › con una contraseña incorrecta muestra el error (127ms)\n  2 passed (532ms)',
  },
];
export const DEPS_EXPLANATION =
  '`--project=chromium` corre también la dependencia `setup`, aunque no se la pida. `--no-deps` la saltea: sirve cuando los tests no usan la sesión, como estos, o cuando la sesión guardada sigue siendo válida.';

export const SESSION_QUESTIONS: MultiSelectQuestion[] = [
  {
    prompt: 'Sobre el archivo `playwright/.auth/recepcionista.json` que guarda el setup, ¿qué afirmaciones son correctas? Marcá todas las que correspondan.',
    options: [
      {text: 'Contiene las cookies y el almacenamiento que hacen que la aplicación reconozca la sesión.', correct: true, why: 'Es lo que guarda `storageState`: con eso, un contexto nuevo queda ingresado.'},
      {text: 'Hay que versionarlo, para que CI no tenga que ingresar.', correct: false, why: 'Funciona como una contraseña: no se versiona. CI corre el setup y genera el suyo.'},
      {text: 'Si el ingreso del setup falla, los tests que dependen de él no corren.', correct: true, why: 'Con `dependencies`, el proyecto espera a que el setup termine bien.'},
      {text: 'Con `--no-deps`, Playwright lo regenera antes de los tests.', correct: false, why: 'Al revés: `--no-deps` saltea el setup y usa el archivo que haya, o falla si no existe.'},
      {text: 'Si la sesión vence en 10 minutos, una corrida de 40 puede fallar a mitad de camino.', correct: true, why: 'La sesión guardada no se renueva sola: hay que conocer cuánto dura antes de reutilizarla.'},
    ],
  },
];
