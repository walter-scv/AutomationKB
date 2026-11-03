import type {OrderItem, OrderRule} from '@site/src/components/Order';
import type {ClassifyItem} from '@site/src/components/Classify';
import type {DecisionNode} from '@site/src/components/DecisionPath';
import type {QuizQuestion} from '@site/src/components/Quiz';

export const HOOKS_CODE = `test.describe('Perfil', () => {
  test.beforeAll(...);
  test.beforeEach(...);
  test.afterEach(...);
  test.afterAll(...);

  test('cambiar el teléfono', ...);
  test('cambiar el email', ...);
});`;

export const HOOK_ORDER_ITEMS: OrderItem[] = [
  {id: 'be2', what: 'Se ejecuta', code: '// beforeEach, antes de cambiar el email'},
  {id: 'aa', what: 'Se ejecuta', code: '// afterAll'},
  {id: 't1', what: 'Se ejecuta', code: '// test: cambiar el teléfono'},
  {id: 'ba', what: 'Se ejecuta', code: '// beforeAll'},
  {id: 'ae1', what: 'Se ejecuta', code: '// afterEach, después de cambiar el teléfono'},
  {id: 't2', what: 'Se ejecuta', code: '// test: cambiar el email'},
  {id: 'be1', what: 'Se ejecuta', code: '// beforeEach, antes de cambiar el teléfono'},
  {id: 'ae2', what: 'Se ejecuta', code: '// afterEach, después de cambiar el email'},
];
export const HOOK_ORDER_CORRECT = ['ba', 'be1', 't1', 'ae1', 'be2', 't2', 'ae2', 'aa'];
export const HOOK_ORDER_RULES: OrderRule[] = [
  {before: 'ba', after: 'be1', why: '`beforeAll` corre una vez, antes de todo lo demás del grupo en ese worker.'},
  {before: 'be1', after: 't1', why: '`beforeEach` corre antes de cada test.'},
  {before: 't1', after: 'ae1', why: '`afterEach` corre después de cada test, pase o falle.'},
  {before: 'ae1', after: 'be2', why: 'El ciclo de un test termina con su `afterEach` antes de que empiece el `beforeEach` del siguiente.'},
  {before: 'be2', after: 't2', why: '`beforeEach` corre antes de cada test, también del segundo.'},
  {before: 't2', after: 'ae2', why: '`afterEach` cierra el segundo test.'},
  {before: 'ae2', after: 'aa', why: '`afterAll` corre una vez, después del último test del grupo en ese worker.'},
];

export const HOOK_COLUMNS = ['beforeAll', 'beforeEach', 'afterEach'];
export const HOOK_ITEMS: ClassifyItem[] = [
  {
    code: 'Abrir la pantalla de turnos e ingresar con el paciente de prueba, que todos los tests del grupo necesitan.',
    column: 1,
    why: 'Usa `page`, que existe solo durante cada test, y todos los tests necesitan arrancar así: va en `beforeEach`.',
    hint: '¿Esta preparación necesita la página del navegador?',
  },
  {
    code: 'Leer de un archivo la lista de especialidades, que ningún test modifica.',
    column: 0,
    why: 'No necesita la página y los tests la comparten sin cambiarla: alcanza con leerla una vez por worker.',
    hint: '¿Algún test modifica esa lista?',
  },
  {
    code: 'Cancelar en el sistema el turno que reservó el test, para que el horario quede libre.',
    column: 2,
    why: 'Deshace lo que el test dejó fuera del navegador. Tiene que correr después de cada test, aunque falle.',
    hint: '¿Esto prepara algo o deshace algo?',
  },
  {
    code: 'Navegar a la página de perfil, donde arrancan todos los tests del grupo.',
    column: 1,
    why: 'Necesita `page` y es el punto de partida de cada test.',
    hint: '¿Se puede hacer sin la fixture `page`?',
  },
  {
    code: 'Borrar el paciente que el test creó en el sistema para probar el alta.',
    column: 2,
    why: 'Es limpieza de un dato que el test creó fuera del navegador: corresponde a `afterEach`.',
    hint: '¿Cuándo tiene que ocurrir: antes o después del test?',
  },
  {
    code: 'Leer de un archivo los horarios de atención de cada sede, que los tests solo consultan.',
    column: 0,
    why: 'Es un dato de referencia que no cambia y no necesita la página: una vez por worker alcanza.',
    hint: '¿Hace falta leerlo de nuevo antes de cada test?',
  },
  {
    code: 'Liberar el horario que el test bloqueó en la agenda de la profesional, aunque el test haya fallado.',
    column: 2,
    why: 'Deshace un cambio que quedó en el sistema, fuera del navegador, y tiene que correr pase o falle el test.',
    hint: '¿Esto prepara el test o deshace lo que dejó?',
  },
];

export const ORDER_START = 'ci';
export const ORDER_NODES: Record<string, DecisionNode> = {
  ci: {
    id: 'ci',
    situation: 'La suite de la tienda usa `fullyParallel: true`. El test «crear un pedido» guarda el número en una variable del archivo, y el test «cancelar el pedido» lo usa. Corriendo con `--workers=1`, pasan los dos; con varios workers, «cancelar el pedido» falla porque el número es `undefined`. ¿Qué pasa?',
    options: [
      {text: 'En CI el servidor tarda más y el número no llega a tiempo.', correct: false, why: '`undefined` no es una demora: la variable nunca recibió valor en ese proceso.'},
      {text: 'Cada worker tiene su propia copia de la variable, y «cancelar» corrió en uno donde «crear» no corrió.', correct: true, why: 'Los workers son procesos separados. La variable compartida solo funciona si los dos tests corren en el mismo, y en orden.', next: 'fix'},
      {text: 'El contexto del navegador borró la variable al terminar el primer test.', correct: false, why: 'El contexto descarta cookies y almacenamiento del navegador, no variables del código del test.'},
    ],
  },
  fix: {
    id: 'fix',
    situation: '¿Cómo lo corregís?',
    options: [
      {text: 'Configurar `workers: 1` para que siempre corran en orden.', correct: false, why: 'Esconde la dependencia y vuelve lenta toda la suite. Y «cancelar» sigue fallando si se corre solo o si «crear» falla.'},
      {text: 'Que «cancelar el pedido» cree su propio pedido antes de cancelarlo.', correct: true, why: 'Cada test prepara lo que necesita: se vuelve independiente del orden y de los workers.', next: 'hook'},
      {text: 'Unir los dos tests en uno solo que crea y cancela.', correct: false, why: 'Funciona, pero mezcla dos acciones bajo prueba en un test: si falla, no se sabe cuál de las dos se rompió.'},
    ],
  },
  hook: {
    id: 'hook',
    situation: 'Ahora tres tests de cancelación necesitan un pedido propio. Para no repetir el código, lo movés a `test.beforeAll(async ({ page }) => { ... })` y la corrida falla con: "context" and "page" fixtures are not supported in "beforeAll". ¿Qué hacés?',
    options: [
      {text: 'Mover la creación del pedido a `beforeEach`.', correct: true, why: '`beforeEach` recibe la `page` de cada test y crea un pedido para cada uno, así ninguno depende de otro.'},
      {text: 'Crear el pedido en `afterAll`.', correct: false, why: '`afterAll` corre después de los tests: el pedido llegaría tarde. Tampoco tiene `page`.'},
      {text: 'Crear un solo pedido en `beforeAll` sin usar `page` y compartirlo entre los tres tests.', correct: false, why: 'El primer test que lo cancela lo deja inservible para los otros dos: los tests volverían a depender entre sí.'},
    ],
  },
};
export const ORDER_EXPLANATION =
  'Una variable compartida entre tests falla con varios workers porque cada uno es un proceso aparte. Cada test prepara lo suyo; si varios comparten la preparación, va en `beforeEach`, que tiene `page` y corre para cada test.';

export const WORKERS_OUTPUT = `Running 3 tests using 3 workers
beforeAll
beforeAll
beforeAll
beforeEach
test: cambiar el email
afterEach
afterAll
beforeEach
test: cambiar el teléfono
afterEach
  ✓  2 [chromium] › tests/perfil.spec.ts:10:7
     › Perfil › cambiar el email (0ms)
afterAll
  ✓  1 [chromium] › tests/perfil.spec.ts:9:7
     › Perfil › cambiar el teléfono (0ms)
beforeEach
test: cambiar la obra social
afterEach
afterAll
  ✓  3 [chromium] › tests/perfil.spec.ts:11:7
     › Perfil › cambiar la obra social (3ms)
  3 passed (355ms)`;

export const WORKERS_QUIZ: QuizQuestion[] = [
  {
    question: 'El grupo «Perfil» tiene tres tests y los cuatro hooks con un `console.log`, y la suite usa `fullyParallel: true`. ¿Por qué `beforeAll` aparece tres veces en la salida de arriba?',
    options: [
      {text: 'Porque `beforeAll` corre antes de cada test.', correct: false, why: 'Eso hace `beforeEach`. Con un solo worker, `beforeAll` aparece una sola vez.'},
      {text: 'Porque hubo tres reintentos.', correct: false, why: 'El resumen dice `3 passed`: no hubo fallos ni reintentos.'},
      {text: 'Porque corrieron tres workers, y cada uno ejecuta su propio `beforeAll`.', correct: true, why: '«Una vez» significa una vez por worker. La primera línea lo dice: 3 workers.'},
    ],
  },
  {
    question: 'El test «cambiar el teléfono» ingresa con un paciente y deja la sesión iniciada. Después, en el mismo worker, corre «cambiar el email». ¿Con qué sesión arranca?',
    options: [
      {text: 'Sin sesión: cada test recibe un contexto de navegador nuevo.', correct: true, why: 'El contexto, con sus cookies y su almacenamiento, se descarta al terminar cada test, aunque el worker sea el mismo.'},
      {text: 'Con la sesión del test anterior, porque corren en el mismo worker.', correct: false, why: 'El worker es el mismo, pero el contexto del navegador no: cada test arranca de cero.'},
      {text: 'Depende de si hay un `afterEach` que cierre la sesión.', correct: false, why: 'No hace falta cerrarla: el contexto se descarta solo.'},
    ],
  },
];
