import type {DecisionNode} from '@site/src/components/DecisionPath';
import type {CodeLine} from '@site/src/components/FindInCode';
import type {OrderItem, OrderRule} from '@site/src/components/Order';
import type {TerminalStep} from '@site/src/components/Terminal';
import type {MatchItem} from '@site/src/components/Match';
import type {FillBlankSlot} from '@site/src/components/FillBlank';
import type {SpotTokenRound} from '@site/src/components/SpotToken';
import type {MultiSelectQuestion} from '@site/src/components/MultiSelect';
import type {QuizQuestion} from '@site/src/components/Quiz';
import type {BuilderStep} from '@site/src/components/CommandBuilder';

// 1. Escenario: la primera suite (36, 38, 39, 41, 54, 55)
export const SUITE_START = 'what';
export const SUITE_NODES: Record<string, DecisionNode> = {
  what: {
    id: 'what',
    situation: 'La clínica te pide empezar la suite de UI de la agenda. Producto propone automatizar primero «que el diseño nuevo de la agenda se vea moderno». ¿Qué proponés en su lugar?',
    options: [
      {text: 'Reservar un turno y cancelarlo, que se hace en cada versión y tiene un resultado exacto.', correct: true, why: 'Se repite, tiene resultado verificable y es el flujo principal: es el mejor primer candidato (entrada 36).', next: 'clone'},
      {text: 'Las 40 combinaciones de la regla de cancelación con cargo, todas por la interfaz.', correct: false, why: 'Las combinaciones de una regla van en la capa de componente, no en la UI (entrada 36).'},
      {text: 'Automatizar lo que pide producto: es quien conoce el negocio.', correct: false, why: '«Se vea moderno» no tiene un resultado exacto: es un juicio para una revisión humana (entrada 36).'},
    ],
  },
  clone: {
    id: 'clone',
    situation: 'Una compañera clona el repositorio de la suite y, después de `npm install`, todos los tests fallan con `Executable doesn\'t exist`. ¿Qué le falta?',
    options: [
      {text: 'Correr `npm init playwright@latest` otra vez.', correct: false, why: 'El proyecto ya existe: el instalador lo volvería a crear (entrada 38).'},
      {text: 'Descargar los navegadores con `npx playwright install`.', correct: true, why: 'El paquete se instaló, pero los navegadores van aparte (entrada 38).', next: 'ci'},
      {text: 'Borrar `package-lock.json`.', correct: false, why: 'Las dependencias están bien: faltan los navegadores (entrada 38).'},
    ],
  },
  ci: {
    id: 'ci',
    situation: 'En CI, el test de cancelar figura como `1 flaky`: falló y pasó en el `retry #1`. La suite tiene `trace: \'on-first-retry\'`, así que el único trace es el del reintento, que pasó. Querés ver qué pasó en el intento que falla. ¿Qué configurás para la próxima corrida?',
    options: [
      {text: '`retries: 0`, para que no se reintente.', correct: false, why: 'Sin reintentos y con `on-first-retry`, no se grabaría ningún trace (entrada 39).'},
      {text: '`video: \'on\'`, para grabar todas las corridas.', correct: false, why: 'Un video muestra la pantalla, no el DOM, la red ni el log de cada acción, y pesa en todas las corridas (entradas 39 y 55).'},
      {text: '`trace: \'retain-on-failure\'`, que conserva el trace de cada intento que falla.', correct: true, why: 'Graba todos los intentos y conserva los que fallan: el próximo fallo deja su trace (entradas 39 y 55).', next: 'cause'},
    ],
  },
  cause: {
    id: 'cause',
    situation: 'En el trace del intento fallido, el click en «Cancelar turno» se hizo antes de que la agenda terminara de cargar, y el turno buscado todavía no estaba en la lista. ¿Cómo lo corregís?',
    options: [
      {text: 'Esperar el estado antes de actuar, con una assertion de que el turno está en la agenda.', correct: true, why: 'Una assertion web-first espera exactamente lo necesario y documenta la precondición (entradas 47, 48 y 54).', next: 'hook'},
      {text: 'Agregar `await page.waitForTimeout(3000)` antes del click.', correct: false, why: 'Una espera fija vuelve lento el test y sigue fallando si la agenda tarda más (entrada 48).'},
      {text: 'Subir `retries` a 5.', correct: false, why: 'Esconde el problema sin resolverlo: el test seguiría siendo flaky (entradas 36 y 39).'},
    ],
  },
  hook: {
    id: 'hook',
    situation: 'Hay seis tests de cancelación, y todos arrancan abriendo la agenda. Para no repetir el `goto` en cada uno, ¿dónde va?',
    options: [
      {text: 'En un `test.beforeAll(async ({ page }) => ...)` del grupo.', correct: false, why: '`beforeAll` no recibe `page`: la página se crea para cada test (entrada 42).'},
      {text: 'En el primer test, y los demás siguen desde ahí.', correct: false, why: 'Cada test arranca con un contexto nuevo: los demás no heredan la página del primero (entrada 42).'},
      {text: 'En un `test.beforeEach(async ({ page }) => ...)` del grupo.', correct: true, why: 'Corre antes de cada test, con su propia página, y evita repetir el código (entrada 42).'},
    ],
  },
};
export const SUITE_EXPLANATION =
  'Qué automatizar (36), cómo instalar (38), qué trace conservar para investigar un fallo de CI (39 y 55) cómo corregir un fallo de tiempos esperando el estado (47, 48 y 54) y dónde va la preparación común (42).';

// 2. Diagnóstico de líneas (43, 44, 45, 47, 48)
export const DIAG_RULE_LABELS = [
  'Locator frágil o ambiguo',
  'Assertion que no reintenta o que fue aflojada',
  'Espera fija',
];
export const DIAG_LINES: CodeLine[] = [
  {
    code: "await page.getByRole('row').filter({ hasText: 'Dra. Paz' }).getByRole('button', { name: 'Cancelar', exact: true }).click(); // la Dra. Paz tiene dos turnos hoy",
    rule: 1,
    why: 'Con dos turnos de la misma profesional, el filtro deja dos filas: el click falla por strict mode. Hace falta un dato que distinga la fila, como la hora (entrada 45).',
    hint: 'Si la Dra. Paz tiene dos turnos, ¿cuántas filas deja el filtro?',
  },
  {
    code: "await expect(page.getByRole('row').filter({ hasText: '09:30' }).getByRole('cell').nth(3)).toHaveText('Cancelado');",
    rule: 0,
    why: 'Elige la fila por su hora, la celda por su columna, y verifica con una assertion web-first exacta (entradas 45, 47 y 52).',
    hint: '¿El locator depende de la posición? ¿La assertion reintenta?',
  },
  {
    code: "await page.waitForTimeout(2000); // esperar que cargue la agenda",
    rule: 3,
    why: 'Frena dos segundos sin saber si alcanza ni si hacían falta. Se espera el estado con una assertion (entrada 48).',
    hint: '¿Esta línea sabe cuándo terminó de cargar la agenda?',
  },
  {
    code: "await page.locator('table > tbody > tr:nth-child(3) button').click();",
    rule: 1,
    why: 'Elige por posición: si cambia el orden de los turnos, cancela otro sin fallar (entradas 44 y 45).',
    hint: '¿Qué pasa si se agrega un turno más temprano?',
  },
  {
    code: "expect(await page.getByText('Turno cancelado').isVisible()).toBe(true);",
    rule: 2,
    why: 'Es una manual assertion: mira una sola vez y no reintenta (entrada 47).',
    hint: '¿Qué pasa si el mensaje aparece medio segundo después?',
  },
  {
    code: "await expect(page.getByRole('heading', { name: 'Agenda del día' })).toBeVisible();",
    rule: 0,
    why: 'Locator por rol y nombre, y assertion web-first (entradas 43 y 47).',
    hint: '¿El locator describe lo que ve la persona?',
  },
  {
    code: "await expect(page.getByText('Turno cancelado')).toBeAttached(); // en el último cambio reemplazó a toBeVisible()",
    rule: 2,
    why: '`toBeAttached` pasa aunque el mensaje esté oculto: la assertion ya no verifica lo que la persona ve (entrada 47).',
    hint: '¿Qué diferencia hay entre existir en el DOM y verse?',
  },
  {
    code: "await page.getByTestId('confirmar-cancelacion').click();",
    rule: 0,
    why: 'Un test id acordado con el equipo, en un botón cuyo texto cambia seguido: estable y válido (entrada 46).',
    hint: '¿Es un atributo acordado para los tests?',
  },
];

// 3. Ordenar un archivo de test (40, 42, 47, 51)
export const FILE_ITEMS: OrderItem[] = [
  {id: 'step2', what: 'Línea', code: "    await test.step('2- Confirma la cancelación', async () => {"},
  {id: 'describe', what: 'Línea', code: "test.describe('Agenda', () => {"},
  {id: 'dialog', what: 'Línea', code: "      page.once('dialog', (dialog) => dialog.accept());"},
  {id: 'import', what: 'Línea', code: "import { test, expect } from '@playwright/test';"},
  {id: 'check', what: 'Línea', code: "      await expect(page.getByText('Turno cancelado')).toBeVisible();"},
  {id: 'test', what: 'Línea', code: "  test('cancelar un turno lo libera', { tag: '@smoke' }, async ({ page }) => {"},
  {id: 'click', what: 'Línea', code: "      await page.getByRole('row').filter({ hasText: '09:30' }).getByRole('button', { name: 'Cancelar' }).click();"},
  {id: 'step1', what: 'Línea', code: "    await test.step('1- La recepcionista cancela el turno de las 09:30', async () => {"},
];
export const FILE_CORRECT = ['import', 'describe', 'test', 'step1', 'dialog', 'click', 'step2', 'check'];
export const FILE_RULES: OrderRule[] = [
  {before: 'import', after: 'describe', why: 'Las importaciones van al principio del archivo (entrada 40).'},
  {before: 'describe', after: 'test', why: 'El test va dentro del grupo (entrada 40).'},
  {before: 'test', after: 'step1', why: 'Los pasos van dentro del test (entrada 40).'},
  {before: 'step1', after: 'dialog', why: 'El manejador del diálogo es parte del primer paso.'},
  {before: 'dialog', after: 'click', why: 'El manejador se registra antes del click que abre el diálogo (entrada 51).'},
  {before: 'click', after: 'step2', why: 'El segundo paso empieza cuando terminó la acción del primero (entrada 40).'},
  {before: 'step2', after: 'check', why: 'La verificación está dentro del paso 2 (entradas 40 y 47).'},
];

// 4. Terminal (38, 41, 54)
export const RUN_STEPS: TerminalStep[] = [
  {
    instruction: 'Listá los tests smoke de la suite de la agenda, solo en chromium.',
    accepted: ["npx playwright test --grep @smoke --project=chromium --list", "npx playwright test --grep @smoke --list --project=chromium", "npx playwright test --project=chromium --grep @smoke --list", "npx playwright test --project=chromium --list --grep @smoke", "npx playwright test --list --grep @smoke --project=chromium", "npx playwright test --list --project=chromium --grep @smoke", "npx playwright test --grep @smoke --project chromium --list", "npx playwright test --grep @smoke --list --project chromium", "npx playwright test --project chromium --grep @smoke --list", "npx playwright test --project chromium --list --grep @smoke", "npx playwright test --list --grep @smoke --project chromium", "npx playwright test --list --project chromium --grep @smoke", "npx playwright test -g @smoke --project=chromium --list", "npx playwright test -g @smoke --list --project=chromium", "npx playwright test --project=chromium -g @smoke --list", "npx playwright test --project=chromium --list -g @smoke", "npx playwright test --list -g @smoke --project=chromium", "npx playwright test --list --project=chromium -g @smoke", "npx playwright test -g @smoke --project chromium --list", "npx playwright test -g @smoke --list --project chromium", "npx playwright test --project chromium -g @smoke --list", "npx playwright test --project chromium --list -g @smoke", "npx playwright test --list -g @smoke --project chromium", "npx playwright test --list --project chromium -g @smoke", "npx playwright test --grep=@smoke --project=chromium --list", "npx playwright test --grep=@smoke --list --project=chromium", "npx playwright test --project=chromium --grep=@smoke --list", "npx playwright test --project=chromium --list --grep=@smoke", "npx playwright test --list --grep=@smoke --project=chromium", "npx playwright test --list --project=chromium --grep=@smoke", "npx playwright test --grep=@smoke --project chromium --list", "npx playwright test --grep=@smoke --list --project chromium", "npx playwright test --project chromium --grep=@smoke --list", "npx playwright test --project chromium --list --grep=@smoke", "npx playwright test --list --grep=@smoke --project chromium", "npx playwright test --list --project chromium --grep=@smoke", "npx playwright test --grep \"@smoke\" --project=chromium --list", "npx playwright test --grep \"@smoke\" --list --project=chromium", "npx playwright test --project=chromium --grep \"@smoke\" --list", "npx playwright test --project=chromium --list --grep \"@smoke\"", "npx playwright test --list --grep \"@smoke\" --project=chromium", "npx playwright test --list --project=chromium --grep \"@smoke\"", "npx playwright test --grep \"@smoke\" --project chromium --list", "npx playwright test --grep \"@smoke\" --list --project chromium", "npx playwright test --project chromium --grep \"@smoke\" --list", "npx playwright test --project chromium --list --grep \"@smoke\"", "npx playwright test --list --grep \"@smoke\" --project chromium", "npx playwright test --list --project chromium --grep \"@smoke\"", "npx playwright test -g \"@smoke\" --project=chromium --list", "npx playwright test -g \"@smoke\" --list --project=chromium", "npx playwright test --project=chromium -g \"@smoke\" --list", "npx playwright test --project=chromium --list -g \"@smoke\"", "npx playwright test --list -g \"@smoke\" --project=chromium", "npx playwright test --list --project=chromium -g \"@smoke\"", "npx playwright test -g \"@smoke\" --project chromium --list", "npx playwright test -g \"@smoke\" --list --project chromium", "npx playwright test --project chromium -g \"@smoke\" --list", "npx playwright test --project chromium --list -g \"@smoke\"", "npx playwright test --list -g \"@smoke\" --project chromium", "npx playwright test --list --project chromium -g \"@smoke\""],
    hint: 'Hacen falta tres opciones: el filtro por tag, el proyecto y la que lista sin correr.',
    output: 'Listing tests:\n  [chromium] › perfil.spec.ts:4:7 › Perfil › cambiar el teléfono guarda el dato nuevo\n  [chromium] › turnos.spec.ts:4:7 › Turnos › reservar un turno muestra la confirmación\nTotal: 2 tests in 2 files',
  },
  {
    instruction: 'Corré solo el test que empieza en la línea 8 de turnos.spec.ts, en todos los proyectos.',
    accepted: ["npx playwright test turnos.spec.ts:8", "npx playwright test turnos.spec.ts:8 --project=chromium --project=firefox", "npx playwright test turnos.spec.ts:8 --project=firefox --project=chromium", "npx playwright test tests/turnos.spec.ts:8", "npx playwright test tests/turnos.spec.ts:8 --project=chromium --project=firefox", "npx playwright test tests/turnos.spec.ts:8 --project=firefox --project=chromium", "npx playwright test turnos:8", "npx playwright test turnos:8 --project=chromium --project=firefox", "npx playwright test turnos:8 --project=firefox --project=chromium", "npx playwright test turnos.spec:8", "npx playwright test turnos.spec:8 --project=chromium --project=firefox", "npx playwright test turnos.spec:8 --project=firefox --project=chromium"],
    hint: 'El archivo y la línea van juntos, separados por dos puntos.',
    output: 'Running 2 tests using 2 workers\n\n  ✓  2 [chromium] › tests/turnos.spec.ts:8:7 › Turnos › cancelar un turno lo saca de la lista (181ms)\n  ✓  1 [firefox] › tests/turnos.spec.ts:8:7 › Turnos › cancelar un turno lo saca de la lista (474ms)\n\n  2 passed (1.4s)',
  },
  {
    instruction: 'Un test falló en la corrida completa. Abrí el reporte HTML para ver su error y su evidencia.',
    accepted: ['npx playwright show-report'],
    hint: 'Es el comando de Playwright que sirve el reporte.',
    output: '  Serving HTML report at http://localhost:9323. Press Ctrl+C to quit.',
  },
];
export const RUN_EXPLANATION =
  'Filtros por tag, proyecto y línea para correr justo lo necesario (entrada 41), y el reporte HTML para empezar a leer un fallo (entrada 54).';

// 5. Emparejar (50, 51, 53, 56)
export const MECH_LEFT: MatchItem[] = [
  {id: 'hover', text: 'El botón «Reprogramar» de cada fila aparece con el mouse encima.'},
  {id: 'dialog', text: 'Cancelar un turno abre la ventanita del navegador «¿Seguro?».'},
  {id: 'iframe', text: 'El pago de la consulta está en un formulario incrustado de otra empresa.'},
  {id: 'popup', text: 'El enlace «Indicaciones del estudio» abre otra pestaña.'},
  {id: 'upload', text: 'La orden médica se adjunta en un campo de archivo con etiqueta.'},
  {id: 'mock', text: 'Hay que ver qué muestra la agenda si el servicio de turnos responde 500.'},
  {id: 'keys', text: 'El teléfono del paciente se formatea mientras se escribe, con cada tecla.'},
];
export const MECH_RIGHT: MatchItem[] = [
  {id: 'mock', text: "`page.route(...)` con `route.fulfill({ status: 500 })`"},
  {id: 'upload', text: '`setInputFiles(...)`'},
  {id: 'hover', text: '`hover()` sobre la fila'},
  {id: 'popup', text: "`page.waitForEvent('popup')` antes del click"},
  {id: 'dialog', text: "`page.once('dialog', ...)` antes del click"},
  {id: 'iframe', text: '`frameLocator(...)`'},
  {id: 'keys', text: "`pressSequentially('1145678901')`"},
];
export const MECH_WHY: Record<string, string> = {
  hover: 'Lo que aparece con el mouse encima necesita un `hover` previo (entrada 50).',
  dialog: 'Un diálogo del navegador se maneja con un manejador registrado antes (entrada 51).',
  iframe: 'Los locators de `page` no entran a un iframe (entrada 51).',
  popup: 'La pestaña se abre durante el click: se empieza a esperar antes (entrada 51).',
  upload: '`setInputFiles` carga el archivo sin abrir la ventana del sistema (entrada 53).',
  mock: '`route.fulfill` responde en lugar del servidor, con el error que se quiere probar (entrada 56).',
  keys: 'Un campo que reacciona a cada tecla necesita `pressSequentially`: `fill` no dispara esos eventos (entrada 49).',
};

// 6. Completar la configuración (39, 46, 57)
export const CFG_TEMPLATE = `export default defineConfig({
  retries: process.env.CI {{a}} 2 : 0,
  use: {
    baseURL: 'https://staging.clinica.test',
    trace: '{{b}}',
    {{c}}: 'data-qa',
    {{d}}: 'America/Argentina/Buenos_Aires',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'iphone', use: { ...devices['{{e}}'] } },
  ],
});`;
export const CFG_SLOTS: FillBlankSlot[] = [
  {id: 'a', answer: '?'},
  {id: 'b', answer: 'on-first-retry'},
  {id: 'c', answer: 'testIdAttribute'},
  {id: 'd', answer: 'timezoneId'},
  {id: 'e', answer: 'iPhone 13'},
];
export const CFG_BANK = ['locale', 'iPhone 13', '&&', 'on', 'testIdAttribute', '?', 'timezoneId', 'on-first-retry', 'webkit', 'testDir'];
export const CFG_EXPLANATION =
  'Reintentos solo en CI con el ternario (entrada 39), trace en el primer reintento (39 y 55), `data-qa` como atributo de test (46), zona horaria fija para las fechas y un perfil de iPhone (57).';

// 7. Señalar (40, 43, 51, 53, 58)
export const MIX_PROMPT = '¿Qué parte de esta línea causa el problema?';
export const MIX_ROUNDS: SpotTokenRound[] = [
  {
    line: "expect(page.getByText('Turno reservado')).toBeVisible(); // última línea del test",
    targetIndex: 0,
    why: 'Falta el `await`: el test no espera la verificación. Si el mensaje tarda, falla con `Test ended` aunque la reserva funcione; si aparece al instante, pasa. El resultado depende del tiempo (entrada 40).',
    hint: '¿El test espera a que esta verificación termine?',
  },
  {
    line: "await page.getByRole('button', { name: 'Imprimir' }).click(); // el botón es <button title=\"Imprimir\">🖨</button>",
    targetIndex: 4,
    why: 'El nombre accesible del botón es «🖨», su contenido: el `title` no es el nombre. Se busca con `getByTitle(\'Imprimir\')` (entrada 43).',
    hint: '¿De dónde sale el nombre accesible de ese botón?',
  },
  {
    line: "await page.getByLabel('Orden médica').setInputFiles('/Users/ana/Descargas/orden.pdf');",
    targetIndex: 2,
    why: 'Una ruta del disco de una persona: en otra computadora o en CI no existe (entrada 53).',
    hint: '¿Ese archivo existe en la máquina de CI?',
  },
  {
    line: "await expect(page.getByTestId('comprobante')).toHaveScreenshot('comprobante.png'); // el comprobante muestra la hora de emisión",
    targetIndex: 1,
    why: 'La hora cambia en cada corrida: sin `mask`, la comparación falla siempre (entrada 58).',
    hint: '¿Qué parte de la captura cambia entre corridas?',
  },
];

// 8. Marcar todas (47, 56, 58, 59)
export const CHECK_QUESTIONS: MultiSelectQuestion[] = [
  {
    prompt: 'El test de la pantalla de pago de la consulta ya verifica el monto y el mensaje «Pago aprobado». ¿Qué agregados aportan información que el test todavía no tiene? Marcá todos los que correspondan.',
    options: [
      {text: 'Un análisis con axe del formulario de pago.', correct: true, why: 'Detecta problemas de accesibilidad con reglas fijas, que las assertions de texto no ven (entrada 59).'},
      {text: 'Un `toHaveScreenshot` del comprobante, con la fecha enmascarada.', correct: true, why: 'Detecta cambios visuales que las assertions de texto no ven (entrada 58).'},
      {text: 'Un test que simula con `route.fulfill` un rechazo de la tarjeta.', correct: true, why: 'El entorno no rechaza tarjetas a pedido: simularlo prueba qué ve la persona en ese caso (entrada 56).'},
      {text: 'Repetir la assertion del monto con `toContainText` además de `toHaveText`.', correct: false, why: '`toContainText` es más laxa que la que ya existe: no aporta nada nuevo (entrada 47).'},
      {text: '`expect(await page.getByText(\'Pago aprobado\').isVisible()).toBe(true)`.', correct: false, why: 'Es una manual assertion, peor que la web-first que ya verifica el mensaje (entrada 47).'},
    ],
  },
];

// 9. Leer la salida (37, 43, 54)
export const FAIL_OUTPUT = `1) [chromium] › tests/agenda.spec.ts:4:7
   › Agenda › reprogramar un turno
   › 2- Elige el horario nuevo

  TimeoutError: locator.click:
    Timeout 3000ms exceeded.
  Call log:
    - waiting for getByRole('button',
      { name: 'Confirmar', exact: true })

# Page snapshot
- generic [ref=e1]:
  - heading "Reprogramar turno" [level=1]
  - button "11:00" [ref=e3]
  - button "11:30" [active] [pressed]
  - button "Confirmar el cambio" [ref=e5]`;
export const FAIL_QUIZ: QuizQuestion[] = [
  {
    question: 'El click de esta salida se hizo con `{ timeout: 3000 }`. ¿Por qué nunca encontró el botón?',
    options: [
      {text: 'El botón estaba deshabilitado.', correct: false, why: 'Si estuviera deshabilitado, el call log diría `locator resolved to` y `element is not enabled` (entrada 48).'},
      {text: 'Con `exact: true`, «Confirmar» no coincide con el nombre real del botón, «Confirmar el cambio».', correct: true, why: 'El snapshot muestra el nombre accesible real. `exact` exige el nombre completo (entradas 43 y 54).'},
      {text: 'La página no terminó de cargar.', correct: false, why: 'El snapshot muestra la pantalla completa, con sus tres botones (entrada 54).'},
    ],
  },
  {
    question: 'El texto del botón cambió de «Confirmar» a «Confirmar el cambio» en un rediseño aprobado. ¿De quién es el problema y qué se hace?',
    options: [
      {text: 'Es un error del test: se actualiza el nombre en el locator.', correct: true, why: 'La aplicación hace lo que se decidió; el locator quedó desactualizado (entradas 43 y 54).'},
      {text: 'Es un defecto de la aplicación: se reporta.', correct: false, why: 'El cambio fue aprobado: la aplicación está bien (entrada 54).'},
      {text: 'Es un problema del entorno: se vuelve a correr.', correct: false, why: 'El fallo se repite siempre: el nombre del botón no va a coincidir (entrada 54).'},
    ],
  },
];

// 10. Armar un locator de tabla (45, 52)
export const ROW_PREFIX = "await expect(page.getByRole('row')";
export const ROW_STEPS: BuilderStep[] = [
  {options: [".nth(2)", ".filter({ hasText: '10:30' })", ".filter({ hasText: 'Libre' })"], correct: ".filter({ hasText: '10:30' })", hint: 'Ese fragmento elige la fila por su posición o por el dato que puede cambiar.'},
  {options: [".getByRole('cell').nth(3)", ".getByRole('cell')", ".getByText('Estado')"], correct: ".getByRole('cell').nth(3)", hint: 'Hace falta una sola celda: la de la columna Estado, que es la cuarta.'},
  {options: [").toBeAttached();", ").toHaveText('Libre');", ").toContainText('');"], correct: ").toHaveText('Libre');", hint: 'Esa assertion no compara el estado con el valor esperado: pasaría con cualquier texto.'},
];
export const ROW_EXPLANATION =
  "`expect(page.getByRole('row').filter({ hasText: '10:30' }).getByRole('cell').nth(3)).toHaveText('Libre')`: la fila por su contenido, la celda por su columna y una assertion web-first (entradas 45, 47 y 52).";
