import type {MatchItem} from '@site/src/components/Match';
import type {OrderItem, OrderRule} from '@site/src/components/Order';
import type {DecisionNode} from '@site/src/components/DecisionPath';
import type {TerminalStep} from '@site/src/components/Terminal';

export const ROLE_LEFT: MatchItem[] = [
  {id: 'planner', text: 'Recorre la agenda y guarda los casos, con pasos y resultados esperados, en specs/.'},
  {id: 'generator', text: 'Ejecuta los pasos de un caso y escribe el archivo de test con el código de cada acción.'},
  {id: 'healer', text: 'Corre los tests que fallan, mira el snapshot del error y edita los archivos hasta que pasan.'},
  {id: 'seed', text: 'Deja la aplicación lista antes de que un agente explore o genere.'},
  {id: 'mcp', text: 'Ofrece a los agentes las herramientas para correr tests y guardar planes.'},
  {id: 'init', text: 'Crea los archivos de los agentes para el cliente elegido.'},
];
export const ROLE_RIGHT: MatchItem[] = [
  {id: 'mcp', text: 'El servidor `playwright-test` registrado en `.mcp.json`'},
  {id: 'init', text: '`npx playwright init-agents --loop=claude`'},
  {id: 'healer', text: 'Healer'},
  {id: 'seed', text: '`tests/seed.spec.ts`'},
  {id: 'planner', text: 'Planner'},
  {id: 'generator', text: 'Generator'},
];
export const ROLE_WHY: Record<string, string> = {
  planner: 'Explora y guarda el plan en Markdown.',
  generator: 'Registra cada paso con su código y escribe el test.',
  healer: 'Repara editando: sus cambios se revisan con el diff.',
  seed: 'Corre antes de que los agentes trabajen y les sirve de modelo.',
  mcp: 'Es el servidor propio de los agentes, además del navegador.',
  init: 'Genera los agentes, el seed, specs/ y .mcp.json.',
};

export const FLOW_ITEMS: OrderItem[] = [
  {id: 'framework', what: 'Paso', code: 'Pasar los tests generados a AgendaPage y a las fixtures de la suite.'},
  {id: 'plan', what: 'Paso', code: 'Pedirle al planner el plan de la reserva de turnos.'},
  {id: 'init', what: 'Paso', code: 'Correr npx playwright init-agents --loop=claude.'},
  {id: 'generate', what: 'Paso', code: 'Pedirle al generator los tests del plan revisado.'},
  {id: 'seed', what: 'Paso', code: 'Cambiar el seed para que use las fixtures de base-test.ts.'},
  {id: 'review', what: 'Paso', code: 'Completar el plan con las reglas de negocio y los valores límite.'},
];
export const FLOW_CORRECT = ['init', 'seed', 'plan', 'review', 'generate', 'framework'];
export const FLOW_RULES: OrderRule[] = [
  {before: 'init', after: 'seed', why: 'El seed lo crea `init-agents`: recién después se puede ajustar.'},
  {before: 'seed', after: 'plan', why: 'El planner corre el seed antes de explorar: conviene que ya use la suite.'},
  {before: 'plan', after: 'review', why: 'Se completa el plan que guardó el planner.'},
  {before: 'review', after: 'generate', why: 'Generar de un plan incompleto automatiza casos incompletos.'},
  {before: 'generate', after: 'framework', why: 'El código generado se integra al framework después.'},
];

export const HEAL_START = 'mcp';
export const HEAL_NODES: Record<string, DecisionNode> = {
  mcp: {
    id: 'mcp',
    situation: 'Corriste init-agents en la suite de turnos. El diff muestra que .mcp.json ahora solo tiene playwright-test: desapareció el servidor playwright que usaba el equipo. ¿Qué hacés?',
    options: [
      {text: 'Confirmar el cambio, porque playwright-test también maneja el navegador.', correct: false, why: 'El equipo usaba ese servidor con su configuración, por ejemplo con --isolated: quitarlo cambia lo que tienen todos.'},
      {text: 'Volver a agregar la entrada playwright, con su configuración, antes de confirmar.', correct: true, why: '`init-agents` reemplaza `.mcp.json`: lo que se perdió se recupera revisando el diff.', next: 'rename'},
      {text: 'Deshacer todo lo que hizo init-agents y dejar el repositorio como estaba.', correct: false, why: 'Se pierden los agentes y el seed: alcanza con recuperar la entrada que faltó.'},
    ],
  },
  rename: {
    id: 'rename',
    situation: 'En el diff del healer, el locator del botón «Confirmar» pasó a «Confirmar turno», después de un rediseño aprobado de la agenda. ¿Qué hacés?',
    options: [
      {text: 'Dejarlo en el Page Object, una vez confirmado que el rediseño está aprobado.', correct: true, why: 'Es lo que el healer resuelve bien: un cambio de interfaz aprobado, en el Page Object.', next: 'value'},
      {text: 'Descartarlo y corregirlo a mano: los cambios del healer no se integran.', correct: false, why: 'Para un locator desactualizado por un cambio aprobado, el cambio del healer es el correcto.'},
      {text: 'Pedirle que además cambie el texto del botón en cada test que lo usa.', correct: false, why: 'El locator vive en el Page Object: se cambia en un solo lugar.'},
    ],
  },
  value: {
    id: 'value',
    situation: 'En el test de reprogramar, el healer cambió el valor esperado de «Reprogramado para el 14/11» a «Reprogramado para el 15/11», porque es lo que muestra la agenda. ¿Qué hacés?',
    options: [
      {text: 'Dejarlo, porque el test tiene que acompañar lo que muestra la agenda.', correct: false, why: 'Si la regla dice 14/11, el test pasaría con la aplicación equivocada.'},
      {text: 'Pedirle que use otra fecha de ejemplo en el test de reprogramar.', correct: false, why: 'Hay que saber cuál es la fecha correcta, no cambiar de ejemplo.'},
      {text: 'Revertirlo y confirmar con la regla de negocio cuál es la fecha correcta.', correct: true, why: 'Un valor esperado es una decisión sobre el comportamiento: si la correcta es 14/11, hay un defecto.', next: 'fixme'},
    ],
  },
  fixme: {
    id: 'fixme',
    situation: 'El healer no pudo hacer pasar el test de cancelar un turno y lo marcó con test.fixme(). ¿Qué hacés?',
    options: [
      {text: 'Dejarlo marcado, porque el test sigue estando en la suite.', correct: false, why: 'Un `fixme` saltea el test en silencio: la cancelación queda sin probar.'},
      {text: 'Sacar el fixme y buscar en el trace si la falla es del test o de la agenda.', correct: true, why: 'Puede ser un defecto real: el test tiene que seguir corriendo hasta saberlo.'},
      {text: 'Borrar el test, porque si el healer no pudo repararlo no aporta.', correct: false, why: 'Se pierde la cobertura sin saber si el problema era del test o de la aplicación.'},
    ],
  },
};
export const HEAL_EXPLANATION =
  'Los cambios del healer se revisan en el diff: un locator por un rediseño aprobado se deja; un valor esperado se confirma contra la regla; un fixme se revierte y se investiga.';

export const INIT_STEPS: TerminalStep[] = [
  {
    instruction: 'Instalá los agentes de Playwright en la suite de la agenda, para usarlos desde Claude Code.',
    accepted: ['npx playwright init-agents --loop=claude', 'npx playwright init-agents --loop claude'],
    hint: 'Es el comando de Playwright que inicializa los agentes, con la opción que elige el cliente.',
    output: ' 🎭 Using project "chromium" as a primary project\n 📝 specs/README.md - directory for test plans\n 🌱 tests/seed.spec.ts - default environment seed file\n 🤖 .claude/agents/playwright-test-generator.md - agent definition\n 🤖 .claude/agents/playwright-test-healer.md - agent definition\n 🤖 .claude/agents/playwright-test-planner.md - agent definition\n 🔧 .mcp.json - mcp configuration\n ✅ Done.',
  },
];
export const INIT_EXPLANATION =
  'El comando crea los tres agentes, el seed, la carpeta de planes y un `.mcp.json` con el servidor de los agentes. Si ya había un `.mcp.json`, lo reemplaza: se revisa el diff.';
