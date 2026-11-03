import type {DecisionNode} from '@site/src/components/DecisionPath';
import type {MatchItem} from '@site/src/components/Match';
import type {TerminalStep} from '@site/src/components/Terminal';
import type {SpotTokenRound} from '@site/src/components/SpotToken';

export const SPEED_START = 'one';
export const SPEED_NODES: Record<string, DecisionNode> = {
  one: {
    id: 'one',
    situation: 'La suite de la agenda tarda 30 minutos en CI. La configuración tiene `workers: 1` y la máquina de CI tiene 4 núcleos, casi sin uso durante la corrida. ¿Qué probás primero?',
    options: [
      {text: 'Comprar una máquina de CI más rápida.', correct: false, why: 'La máquina actual está casi sin uso: el problema es que corre un test por vez.'},
      {text: 'Subir los workers a 4 y medir cuánto tarda.', correct: true, why: 'Con 4 procesos, la espera de cada test se superpone con la de los otros. Se mide antes de fijar el valor.', next: 'clash'},
      {text: 'Borrar los tests más lentos.', correct: false, why: 'Se pierde cobertura para ganar tiempo, cuando todavía hay capacidad sin usar.'},
    ],
  },
  clash: {
    id: 'clash',
    situation: 'Con 4 workers la suite tarda 9 minutos, pero fallan dos tests con strict mode: el locator del paciente Ana Ruiz encuentra 2 elementos. Con 1 worker pasan. ¿Qué hacés?',
    options: [
      {text: 'Volver a `workers: 1`, porque con un worker funciona.', correct: false, why: 'Esconde el problema: los dos tests siguen sin ser independientes.'},
      {text: 'Agregar `.first()` al locator del paciente.', correct: false, why: 'Cada test podría tomar el paciente del otro y verificar datos ajenos.'},
      {text: 'Que el builder genere un paciente único por test, con un sufijo como `parallelIndex` y `Date.now()`.', correct: true, why: 'Cada test toca solo sus datos, y los dos pueden correr al mismo tiempo.', next: 'uneven'},
    ],
  },
  uneven: {
    id: 'uneven',
    situation: 'Ya no hay choques. La corrida tarda 9 minutos, pero tres workers terminan a los 3 y el cuarto sigue solo con `agenda.spec.ts`, que tiene 60 de los 90 tests. ¿Qué cambiás?',
    options: [
      {text: '`fullyParallel: true`, para repartir los tests de a uno y no por archivo.', correct: true, why: 'Los 60 tests de `agenda.spec.ts` se reparten entre los 4 workers y todos terminan parecido.', next: 'shard'},
      {text: 'Subir los workers a 8.', correct: false, why: 'Mientras se repartan archivos, `agenda.spec.ts` lo sigue corriendo un solo worker.'},
      {text: 'Poner `agenda.spec.ts` en modo serial.', correct: false, why: 'Ya corre en orden en un solo worker: el modo serial además cortaría la corrida al primer fallo.'},
    ],
  },
  shard: {
    id: 'shard',
    situation: 'Ahora tarda 4 minutos por máquina, con los 4 núcleos al máximo. El equipo quiere menos de 2 minutos y hay 3 máquinas de CI disponibles. ¿Qué hacés?',
    options: [
      {text: 'Subir los workers a 16 en la misma máquina.', correct: false, why: 'La máquina ya está al máximo: más procesos compiten por los mismos núcleos.'},
      {text: 'Dividir la suite en 3 shards, uno por máquina, con el reporter `blob`, y unir los reportes con `merge-reports`.', correct: true, why: 'Cada máquina corre un tercio al mismo tiempo, y el equipo ve un solo reporte.'},
      {text: 'Correr la suite tres veces en paralelo, una por máquina.', correct: false, why: 'Las tres máquinas harían lo mismo: no se reparte nada.'},
    ],
  },
};
export const SPEED_EXPLANATION =
  'Primero los workers que la máquina soporta, después datos independientes, después repartir por test con `fullyParallel`, y recién cuando una máquina no alcanza, sharding con un reporte unido.';

export const MECH_LEFT: MatchItem[] = [
  {id: 'workers', text: 'La máquina tiene núcleos libres y los tests corren de a uno.'},
  {id: 'fully', text: 'Un archivo tiene 40 tests y los otros cinco, 3 cada uno: un worker termina mucho después que los demás.'},
  {id: 'serial', text: 'Un flujo de alta de paciente, partido en tres tests que no se pueden separar, tiene que correr en orden.'},
  {id: 'shard', text: 'Una máquina, con todos sus workers, tarda 25 minutos; hay tres máquinas disponibles.'},
  {id: 'blob', text: 'Cada máquina de CI tiene que guardar sus resultados en un formato que después se pueda unir.'},
  {id: 'merge', text: 'Los resultados de tres máquinas tienen que verse en un solo reporte HTML.'},
  {id: 'index', text: 'Dos tests que corren al mismo tiempo necesitan pacientes con nombres que no choquen.'},
];
export const MECH_RIGHT: MatchItem[] = [
  {id: 'merge', text: '`npx playwright merge-reports --reporter=html`'},
  {id: 'index', text: '`test.info().parallelIndex` en el builder'},
  {id: 'workers', text: '`workers` en la configuración'},
  {id: 'blob', text: '`--reporter=blob`'},
  {id: 'fully', text: '`fullyParallel: true`'},
  {id: 'shard', text: '`--shard=1/3`, `--shard=2/3` y `--shard=3/3`'},
  {id: 'serial', text: "`test.describe.configure({ mode: 'serial' })`"},
];
export const MECH_WHY: Record<string, string> = {
  workers: 'Los workers son los procesos que corren tests al mismo tiempo dentro de una máquina.',
  fully: 'Sin `fullyParallel`, un archivo lo corre un solo worker; con la opción, sus tests se reparten.',
  serial: 'El modo serial corre los tests del grupo en orden y corta al primer fallo.',
  shard: 'Cada máquina corre una de las tres partes, al mismo tiempo que las otras.',
  blob: 'El reporter `blob` guarda los resultados de cada shard en un archivo que después se une.',
  merge: '`merge-reports` une los archivos `blob` en un reporte final.',
  index: '`parallelIndex` es distinto para cada worker que corre a la vez: sirve para armar datos únicos.',
};

export const SHARD_STEPS: TerminalStep[] = [
  {
    instruction: 'La suite de la agenda se reparte en 3 máquinas. Corré la segunda de las tres partes.',
    accepted: ["npx playwright test --shard 2/3", "npx playwright test --shard=2/3"],
    hint: 'Es la opción que elige una parte de la suite, con el número de la parte y el total.',
    output: 'Running 4 tests using 1 worker, shard 2 of 3\n  ✓  1 [setup] › tests/auth.setup.ts:2:6 › ingresar como recepcionista (0ms)\n  ✓  2 [chromium] › tests/pacientes.spec.ts:4:7 › Pacientes › buscar un paciente por DNI @smoke @p0 @pacientes (50ms)\n  ✓  3 [chromium] › tests/pacientes.spec.ts:5:7 › Pacientes › editar el teléfono de un paciente @p1 @pacientes (37ms)\n  ✓  4 [chromium] › tests/pacientes.spec.ts:6:7 › Pacientes › exportar el listado de pacientes @p2 @pacientes @lento (38ms)\n  4 passed (543ms)',
  },
  {
    instruction: 'Corré ahora la tercera de las tres partes.',
    accepted: ["npx playwright test --shard 3/3", "npx playwright test --shard=3/3"],
    hint: 'Es el mismo comando, con el número de la última parte.',
    output: '',
  },
  {
    instruction: 'La tercera parte no corrió nada: la suite tiene solo dos archivos, y sin fullyParallel las partes se arman con archivos enteros. Los resultados blob de las máquinas ya están juntos en la carpeta all-blob-reports. Uní esos resultados en un reporte HTML.',
    accepted: ["npx playwright merge-reports --reporter html ./all-blob-reports", "npx playwright merge-reports --reporter html ./all-blob-reports/", "npx playwright merge-reports --reporter html all-blob-reports", "npx playwright merge-reports --reporter html all-blob-reports/", "npx playwright merge-reports --reporter=html ./all-blob-reports", "npx playwright merge-reports --reporter=html ./all-blob-reports/", "npx playwright merge-reports --reporter=html all-blob-reports", "npx playwright merge-reports --reporter=html all-blob-reports/", "npx playwright merge-reports ./all-blob-reports --reporter html", "npx playwright merge-reports ./all-blob-reports --reporter=html", "npx playwright merge-reports all-blob-reports --reporter html", "npx playwright merge-reports all-blob-reports --reporter=html"],
    hint: 'Es el comando de Playwright que une reportes, con el reporter de salida y la carpeta de los resultados.',
    output: 'processing test events\nbuilding final report\nfinished building report',
  },
];
export const SHARD_EXPLANATION =
  '`--shard=2/3` corre una de tres partes. Sin `fullyParallel`, las partes son archivos enteros, y con dos archivos el tercer shard queda vacío. `merge-reports` une los resultados `blob` de todas las máquinas en un solo `playwright-report/`.';

export const PAR_PROMPT = '¿Qué parte de esta línea causa el problema?';
export const PAR_ROUNDS: SpotTokenRound[] = [
  {
    line: "workers: 12, // en playwright.config.ts; la máquina de CI tiene 2 núcleos y los tests empiezan a fallar por tiempo",
    targetIndex: 1,
    why: 'Doce procesos compiten por dos núcleos: los navegadores se vuelven lentos y los tests superan sus timeouts. Hay que medir y elegir un número que la máquina soporte.',
    hint: '¿Cuántos procesos puede correr bien una máquina de 2 núcleos?',
  },
  {
    line: "npx playwright merge-reports --reporter=html ./blob-report # después de correr los 3 shards uno tras otro, en la misma carpeta",
    targetIndex: 4,
    why: 'Cada corrida con `blob` vacía `blob-report/` antes de escribir: al final solo queda el último shard. Los archivos de cada shard se juntan en otra carpeta.',
    hint: '¿Qué pasa con `blob-report/` cada vez que empieza una corrida?',
  },
  {
    line: "const dni = '30111222'; // valor por defecto del builder de pacientes, que usan todos los tests",
    targetIndex: 3,
    why: 'Todos los tests crean pacientes con el mismo DNI: dos que corren al mismo tiempo chocan. El valor por defecto tiene que ser único por test.',
    hint: '¿Qué pasa cuando dos workers crean un paciente al mismo tiempo?',
  },
  {
    line: "test.describe.configure({ mode: 'serial' }); // al principio de agenda.spec.ts, cuyos tests no dependen entre sí",
    targetIndex: 2,
    why: 'Si los tests son independientes, el modo serial solo resta: obliga a correrlos en orden y corta el resto al primer fallo.',
    hint: '¿Estos tests necesitan correr en orden?',
  },
];
