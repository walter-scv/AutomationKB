import type {MatchItem} from '@site/src/components/Match';
import type {OrderItem, OrderRule} from '@site/src/components/Order';
import type {DecisionNode} from '@site/src/components/DecisionPath';

export const SIGNAL_LEFT: MatchItem[] = [
  {id: 'down', text: 'Los 40 tests fallan con «connect ECONNREFUSED» al abrir la agenda.'},
  {id: 'wrong', text: 'La agenda abre, pero todos los ingresos fallan con «Usuario inexistente».'},
  {id: 'auth', text: 'Todos los tests fallan en el mismo paso de la fixture de ingreso.'},
  {id: 'fixture', text: 'Fallan los 12 tests que usan la fixture sembrarTurno; los demás pasan.'},
  {id: 'single', text: 'Fallan 4 tests, cada uno con un error distinto en una pantalla distinta.'},
];
export const SIGNAL_RIGHT: MatchItem[] = [
  {id: 'fixture', text: 'La fixture compartida está rota: se revisa sembrarTurno'},
  {id: 'single', text: 'No hay una causa común: cada fallo se analiza por separado'},
  {id: 'down', text: 'El entorno está caído: no hay ninguna aplicación respondiendo en esa dirección'},
  {id: 'auth', text: 'El ingreso está roto: es un solo problema, no un fallo por test'},
  {id: 'wrong', text: 'Se apunta al entorno equivocado: se revisan BASE_URL y las variables de la ejecución'},
];
export const SIGNAL_WHY: Record<string, string> = {
  down: 'Nadie aceptó la conexión: la aplicación no está corriendo.',
  wrong: 'La aplicación responde, pero no conoce las cuentas de prueba: es otro entorno.',
  auth: 'Un solo punto de falla compartido por todos.',
  fixture: 'El problema está en lo que comparten esos tests, no en cada uno.',
  single: 'Sin un patrón común, cada fallo es su propio trabajo.',
};

export const RUN_ITEMS: OrderItem[] = [
  {id: 'theory', what: 'Paso', code: 'Formar una teoría: el botón cambió de nombre en el Pull Request.'},
  {id: 'shot', what: 'Paso', code: 'Abrir la captura y el snapshot del fallo.'},
  {id: 'repro', what: 'Paso', code: 'Reproducir con la aplicación corriendo y confirmar el nombre actual del botón.'},
  {id: 'diff', what: 'Paso', code: 'Leer el diff del Pull Request.'},
  {id: 'suite', what: 'Paso', code: 'Correr la corrección junto con el resto de la suite.'},
  {id: 'fix', what: 'Paso', code: 'Corregir la entrada del contrato de locators.'},
];
export const RUN_CORRECT = ['shot', 'diff', 'theory', 'repro', 'fix', 'suite'];
export const RUN_RULES: OrderRule[] = [
  {before: 'shot', after: 'diff', why: 'Primero qué hizo la aplicación; después qué cambió.'},
  {before: 'diff', after: 'theory', why: 'La teoría se arma con el artefacto y el diff a la vista.'},
  {before: 'theory', after: 'repro', why: 'Una teoría se prueba reproduciendo, no razonando.'},
  {before: 'repro', after: 'fix', why: 'Se corrige recién con la causa confirmada.'},
  {before: 'fix', after: 'suite', why: 'Un test que pasa solo no prueba que pase en la suite.'},
];

export const TRIAGE_START = 'canary';
export const TRIAGE_NODES: Record<string, DecisionNode> = {
  canary: {
    id: 'canary',
    situation: 'La regresión de turnos tiene 38 tests fallidos. ¿Por dónde empezás?',
    options: [
      {text: 'Por el test de ingreso: si falla, lo más probable es un problema sistémico.', correct: true, why: 'El ingreso es el canario: si cae, todo lo demás cae con él.', next: 'screen'},
      {text: 'Por el primer test de la lista, y después seguir en orden, para no dejar ninguno sin revisar.', correct: false, why: 'Si la causa es común, revisar uno por uno es tiempo perdido.'},
      {text: 'Por los tests con más prioridad, aunque fallen todos en el mismo paso de la fixture.', correct: false, why: 'Si fallan en el mismo paso, es un solo problema: primero hay que descartarlo.'},
    ],
  },
  screen: {
    id: 'screen',
    situation: 'El ingreso pasa. El test de reprogramar falla buscando el botón «Reprogramar», y la captura muestra la pantalla de pacientes, no la agenda. ¿Qué indica?',
    options: [
      {text: 'Que el botón cambió de nombre y hay que corregir el locator.', correct: false, why: 'El test ni siquiera estaba en la pantalla del botón: el locator no es el problema.'},
      {text: 'Que es un test inestable y conviene sumarle reintentos.', correct: false, why: 'Es una navegación desviada, no una falla intermitente.'},
      {text: 'Que la navegación se desvió en un paso anterior.', correct: true, why: 'La captura responde en qué pantalla estaba la aplicación: ahí está la pista.', next: 'timeout'},
    ],
  },
  timeout: {
    id: 'timeout',
    situation: 'Otro test falla por tiempo agotado al abrir un menú de la agenda, una acción que no hace ningún pedido al servidor. ¿Qué concluís?',
    options: [
      {text: 'Que el entorno estaba lento y alcanza con subir el timeout de la acción.', correct: false, why: 'Abrir un menú que ya está cargado no depende del entorno: subir el tiempo tapa el problema.'},
      {text: 'Que es un defecto: abrir un menú que no pide nada al servidor no tiene por qué tardar.', correct: true, why: 'Si la acción no depende del servidor, la lentitud del entorno no la explica.'},
      {text: 'Que es un test inestable y se puede ignorar.', correct: false, why: 'Un tiempo agotado que se repite en una acción que no depende del servidor no es inestabilidad.'},
    ],
  },
};
export const TRIAGE_EXPLANATION =
  'Primero el canario para descartar lo sistémico; después la captura para saber dónde estaba la aplicación; y un tiempo agotado local es un defecto, no lentitud.';
