import type {DecisionNode} from '@site/src/components/DecisionPath';
import type {CodeLine} from '@site/src/components/FindInCode';
import type {TerminalStep} from '@site/src/components/Terminal';
import type {ClassifyItem} from '@site/src/components/Classify';
import type {OrderItem, OrderRule} from '@site/src/components/Order';
import type {QuizQuestion} from '@site/src/components/Quiz';

// 1. Escenario encadenado (70, 71, 73, 74)
export const CI_START = 'pr';
export const CI_NODES: Record<string, DecisionNode> = {
  pr: {
    id: 'pr',
    situation: 'La suite de la agenda tiene 400 tests y tarda 50 minutos en una máquina. El equipo quiere que cada Pull Request tenga resultado en menos de 15. ¿Qué corre en el Pull Request?',
    options: [
      {text: 'La suite completa, en tres shards con una matriz.', correct: false, why: 'Tres shards bajan los 50 minutos a unos 17: no alcanza, y corre todo aunque el cambio toque una sola pantalla.'},
      {text: 'Los tests afectados con `--only-changed` contra la rama de destino (con `fetch-depth: 0` en el checkout), más los `@smoke`.', correct: true, why: 'Corre lo que el cambio puede haber roto y lo crítico; la suite completa queda para la noche (entradas 70 y 73).', next: 'night'},
      {text: 'Nada: alcanza con la regresión nocturna.', correct: false, why: 'Un defecto llegaría a la rama principal y se vería al día siguiente, mezclado con otros cambios.'},
    ],
  },
  night: {
    id: 'night',
    situation: 'La regresión nocturna de 400 tests tarda 50 minutos con 2 workers en una máquina de 2 núcleos. ¿Cómo la acelerás?',
    options: [
      {text: 'Subir los workers a 8 en la misma máquina.', correct: false, why: 'Ocho procesos en dos núcleos compiten entre sí y los tests empiezan a superar sus timeouts (entrada 71).'},
      {text: 'Bajar los timeouts para que las fallas terminen antes.', correct: false, why: 'Los tests que pasan no tardan menos, y aparecen fallas falsas.'},
      {text: 'Repartirla en 4 shards con una matriz, y unir los resultados `blob` en un job final.', correct: true, why: 'Cuatro máquinas corren un cuarto cada una, y el equipo ve un solo reporte (entradas 71 y 73).', next: 'secret'},
    ],
  },
  secret: {
    id: 'secret',
    situation: 'El workflow nocturno necesita la contraseña de la recepcionista de prueba y la dirección de staging. ¿Dónde van?',
    options: [
      {text: 'La contraseña como `secrets` y la dirección como `vars`, pasadas con `env` en el job.', correct: true, why: 'El secreto queda cifrado y oculto en los logs; la dirección no es secreta (entrada 73).', next: 'image'},
      {text: 'Las dos en el `env` del YAML, escritas directamente.', correct: false, why: 'La contraseña quedaría en el repositorio, visible para cualquiera que lo lea.'},
      {text: 'Las dos en un `.env` versionado, que el workflow lee.', correct: false, why: '`.env` no se versiona: tiene secretos.'},
    ],
  },
  image: {
    id: 'image',
    situation: 'Las capturas de referencia se generan en las Mac del equipo y en CI fallan siempre. ¿Qué cambiás?',
    options: [
      {text: 'Subir el umbral de diferencia permitido hasta que pasen.', correct: false, why: 'El umbral alto deja pasar diferencias reales: el problema es que se comparan sistemas distintos.'},
      {text: 'Correr CI en `macos-latest` para que coincida con las Mac.', correct: false, why: 'Es más caro y depende de que todo el equipo use Mac; el entorno fijo lo da la imagen.'},
      {text: 'Generar las referencias y correr CI dentro de la misma imagen de Playwright, con la versión del proyecto.', correct: true, why: 'Tu computadora y CI dibujan igual porque corren el mismo entorno (entrada 74).'},
    ],
  },
};
export const CI_EXPLANATION =
  'Un subset para cada momento (70), shards para acelerar (71), secretos y variables en el workflow (73) y el mismo entorno en todas partes con la imagen de Playwright (74).';

// 2. Buscar en el código (71, 73, 74)
export const WF_RULE_LABELS = [
  'Secreto expuesto',
  'Paso o job que no corre en el momento correcto',
  'Versión de Playwright desalineada',
];
export const WF_LINES: CodeLine[] = [
  {
    code: "image: mcr.microsoft.com/playwright:v1.62.0-noble   # package.json tiene 1.64.1",
    rule: 3,
    why: 'La imagen trae los navegadores de otra versión: los tests fallan con «Executable doesn\'t exist» (entrada 74).',
    hint: '¿Coinciden la etiqueta de la imagen y el paquete?',
  },
  {
    code: 'RECEPCIONISTA_CLAVE: ${{ secrets.RECEPCIONISTA_CLAVE }}',
    rule: 0,
    why: 'El secreto se lee de GitHub y llega al job como variable de entorno (entrada 73).',
    hint: '¿De dónde sale el valor?',
  },
  {
    code: "- uses: actions/upload-artifact@v4   # sube el reporte, sin if, después de los tests",
    rule: 2,
    why: 'Si los tests fallan, GitHub saltea este paso: falta el reporte justo cuando hace falta. Le falta `if: ${{ !cancelled() }}` (entrada 73).',
    hint: '¿Qué pasa con este paso si fallaron los tests?',
  },
  {
    code: 'run: npx playwright test --shard=${{ matrix.shardIndex }}/${{ matrix.shardTotal }}',
    rule: 0,
    why: 'Cada copia del job corre su parte según la matriz (entradas 71 y 73).',
    hint: '¿De dónde salen los números del shard?',
  },
  {
    code: 'SLACK_WEBHOOK_URL: https://hooks.slack.com/services/T0/B0/x9K2   # en el env: del job',
    rule: 1,
    why: 'La dirección del webhook permite publicar en el canal: es un secreto y va como `secrets.SLACK_WEBHOOK_URL` (entrada 73).',
    hint: '¿Qué puede hacer cualquiera que lea esa dirección?',
  },
  {
    code: "reporte:   # job que une los blob; no tiene needs: [tests]",
    rule: 2,
    why: 'Sin `needs`, el job corre al mismo tiempo que los shards y no encuentra sus resultados (entradas 71 y 73).',
    hint: '¿Espera este job a que terminen los shards?',
  },
  {
    code: 'if: failure()   # paso de aviso a Slack',
    rule: 0,
    why: 'El aviso sale solo cuando algo falló, y el canal no se llena de ruido (entrada 73).',
    hint: '¿Cuándo tiene sentido avisar?',
  },
  {
    code: 'image: mcr.microsoft.com/playwright:latest',
    rule: 3,
    why: '`latest` cambia de versión sin aviso y se desalinea del paquete en cuanto sale una versión nueva (entrada 74).',
    hint: '¿Qué versión trae esta imagen dentro de un mes?',
  },
];

// 3. Terminal (70, 71, 72, 74)
export const MIX_STEPS: TerminalStep[] = [
  {
    instruction: 'Listá los tests de la primera de dos partes de la suite, sin los marcados @lento.',
    accepted: ["npx playwright test --grep-invert \"@lento\" --list --shard 1/2", "npx playwright test --grep-invert \"@lento\" --list --shard=1/2", "npx playwright test --grep-invert \"@lento\" --shard 1/2 --list", "npx playwright test --grep-invert \"@lento\" --shard=1/2 --list", "npx playwright test --grep-invert '@lento' --list --shard 1/2", "npx playwright test --grep-invert '@lento' --list --shard=1/2", "npx playwright test --grep-invert '@lento' --shard 1/2 --list", "npx playwright test --grep-invert '@lento' --shard=1/2 --list", "npx playwright test --grep-invert @lento --list --shard 1/2", "npx playwright test --grep-invert @lento --list --shard=1/2", "npx playwright test --grep-invert @lento --shard 1/2 --list", "npx playwright test --grep-invert @lento --shard=1/2 --list", "npx playwright test --grep-invert=@lento --list --shard 1/2", "npx playwright test --grep-invert=@lento --list --shard=1/2", "npx playwright test --grep-invert=@lento --shard 1/2 --list", "npx playwright test --grep-invert=@lento --shard=1/2 --list", "npx playwright test --list --grep-invert \"@lento\" --shard 1/2", "npx playwright test --list --grep-invert \"@lento\" --shard=1/2", "npx playwright test --list --grep-invert '@lento' --shard 1/2", "npx playwright test --list --grep-invert '@lento' --shard=1/2", "npx playwright test --list --grep-invert @lento --shard 1/2", "npx playwright test --list --grep-invert @lento --shard=1/2", "npx playwright test --list --grep-invert=@lento --shard 1/2", "npx playwright test --list --grep-invert=@lento --shard=1/2", "npx playwright test --list --shard 1/2 --grep-invert \"@lento\"", "npx playwright test --list --shard 1/2 --grep-invert '@lento'", "npx playwright test --list --shard 1/2 --grep-invert @lento", "npx playwright test --list --shard 1/2 --grep-invert=@lento", "npx playwright test --list --shard=1/2 --grep-invert \"@lento\"", "npx playwright test --list --shard=1/2 --grep-invert '@lento'", "npx playwright test --list --shard=1/2 --grep-invert @lento", "npx playwright test --list --shard=1/2 --grep-invert=@lento", "npx playwright test --shard 1/2 --grep-invert \"@lento\" --list", "npx playwright test --shard 1/2 --grep-invert '@lento' --list", "npx playwright test --shard 1/2 --grep-invert @lento --list", "npx playwright test --shard 1/2 --grep-invert=@lento --list", "npx playwright test --shard 1/2 --list --grep-invert \"@lento\"", "npx playwright test --shard 1/2 --list --grep-invert '@lento'", "npx playwright test --shard 1/2 --list --grep-invert @lento", "npx playwright test --shard 1/2 --list --grep-invert=@lento", "npx playwright test --shard=1/2 --grep-invert \"@lento\" --list", "npx playwright test --shard=1/2 --grep-invert '@lento' --list", "npx playwright test --shard=1/2 --grep-invert @lento --list", "npx playwright test --shard=1/2 --grep-invert=@lento --list", "npx playwright test --shard=1/2 --list --grep-invert \"@lento\"", "npx playwright test --shard=1/2 --list --grep-invert '@lento'", "npx playwright test --shard=1/2 --list --grep-invert @lento", "npx playwright test --shard=1/2 --list --grep-invert=@lento"],
    hint: 'Se combinan la opción que excluye un tag, la que elige una parte y la que lista sin correr.',
    output: 'Listing tests:\n  [setup] › auth.setup.ts:2:6 › ingresar como recepcionista\n  [chromium] › agenda.spec.ts:4:7 › Agenda › reservar el primer horario libre\n  [chromium] › agenda.spec.ts:5:7 › Agenda › cancelar un turno lo libera\n  [chromium] › agenda.spec.ts:6:7 › Agenda › reprogramar un turno a otro día\nTotal: 4 tests in 2 files',
  },
  {
    instruction: 'El test de reservar aparece flaky en CI. Medí cuántas veces falla en 30 corridas, sin reintentos.',
    accepted: ["npx playwright test --repeat-each 30 --retries 0 reservar", "npx playwright test --repeat-each 30 --retries 0 reservar.spec.ts", "npx playwright test --repeat-each 30 --retries 0 tests/reservar.spec.ts", "npx playwright test --repeat-each 30 --retries=0 reservar", "npx playwright test --repeat-each 30 --retries=0 reservar.spec.ts", "npx playwright test --repeat-each 30 --retries=0 tests/reservar.spec.ts", "npx playwright test --repeat-each 30 reservar --retries 0", "npx playwright test --repeat-each 30 reservar --retries=0", "npx playwright test --repeat-each 30 reservar.spec.ts --retries 0", "npx playwright test --repeat-each 30 reservar.spec.ts --retries=0", "npx playwright test --repeat-each 30 tests/reservar.spec.ts --retries 0", "npx playwright test --repeat-each 30 tests/reservar.spec.ts --retries=0", "npx playwright test --repeat-each=30 --retries 0 reservar", "npx playwright test --repeat-each=30 --retries 0 reservar.spec.ts", "npx playwright test --repeat-each=30 --retries 0 tests/reservar.spec.ts", "npx playwright test --repeat-each=30 --retries=0 reservar", "npx playwright test --repeat-each=30 --retries=0 reservar.spec.ts", "npx playwright test --repeat-each=30 --retries=0 tests/reservar.spec.ts", "npx playwright test --repeat-each=30 reservar --retries 0", "npx playwright test --repeat-each=30 reservar --retries=0", "npx playwright test --repeat-each=30 reservar.spec.ts --retries 0", "npx playwright test --repeat-each=30 reservar.spec.ts --retries=0", "npx playwright test --repeat-each=30 tests/reservar.spec.ts --retries 0", "npx playwright test --repeat-each=30 tests/reservar.spec.ts --retries=0", "npx playwright test --retries 0 --repeat-each 30 reservar", "npx playwright test --retries 0 --repeat-each 30 reservar.spec.ts", "npx playwright test --retries 0 --repeat-each 30 tests/reservar.spec.ts", "npx playwright test --retries 0 --repeat-each=30 reservar", "npx playwright test --retries 0 --repeat-each=30 reservar.spec.ts", "npx playwright test --retries 0 --repeat-each=30 tests/reservar.spec.ts", "npx playwright test --retries 0 reservar --repeat-each 30", "npx playwright test --retries 0 reservar --repeat-each=30", "npx playwright test --retries 0 reservar.spec.ts --repeat-each 30", "npx playwright test --retries 0 reservar.spec.ts --repeat-each=30", "npx playwright test --retries 0 tests/reservar.spec.ts --repeat-each 30", "npx playwright test --retries 0 tests/reservar.spec.ts --repeat-each=30", "npx playwright test --retries=0 --repeat-each 30 reservar", "npx playwright test --retries=0 --repeat-each 30 reservar.spec.ts", "npx playwright test --retries=0 --repeat-each 30 tests/reservar.spec.ts", "npx playwright test --retries=0 --repeat-each=30 reservar", "npx playwright test --retries=0 --repeat-each=30 reservar.spec.ts", "npx playwright test --retries=0 --repeat-each=30 tests/reservar.spec.ts", "npx playwright test --retries=0 reservar --repeat-each 30", "npx playwright test --retries=0 reservar --repeat-each=30", "npx playwright test --retries=0 reservar.spec.ts --repeat-each 30", "npx playwright test --retries=0 reservar.spec.ts --repeat-each=30", "npx playwright test --retries=0 tests/reservar.spec.ts --repeat-each 30", "npx playwright test --retries=0 tests/reservar.spec.ts --repeat-each=30", "npx playwright test reservar --repeat-each 30 --retries 0", "npx playwright test reservar --repeat-each 30 --retries=0", "npx playwright test reservar --repeat-each=30 --retries 0", "npx playwright test reservar --repeat-each=30 --retries=0", "npx playwright test reservar --retries 0 --repeat-each 30", "npx playwright test reservar --retries 0 --repeat-each=30", "npx playwright test reservar --retries=0 --repeat-each 30", "npx playwright test reservar --retries=0 --repeat-each=30", "npx playwright test reservar.spec.ts --repeat-each 30 --retries 0", "npx playwright test reservar.spec.ts --repeat-each 30 --retries=0", "npx playwright test reservar.spec.ts --repeat-each=30 --retries 0", "npx playwright test reservar.spec.ts --repeat-each=30 --retries=0", "npx playwright test reservar.spec.ts --retries 0 --repeat-each 30", "npx playwright test reservar.spec.ts --retries 0 --repeat-each=30", "npx playwright test reservar.spec.ts --retries=0 --repeat-each 30", "npx playwright test reservar.spec.ts --retries=0 --repeat-each=30", "npx playwright test tests/reservar.spec.ts --repeat-each 30 --retries 0", "npx playwright test tests/reservar.spec.ts --repeat-each 30 --retries=0", "npx playwright test tests/reservar.spec.ts --repeat-each=30 --retries 0", "npx playwright test tests/reservar.spec.ts --repeat-each=30 --retries=0", "npx playwright test tests/reservar.spec.ts --retries 0 --repeat-each 30", "npx playwright test tests/reservar.spec.ts --retries 0 --repeat-each=30", "npx playwright test tests/reservar.spec.ts --retries=0 --repeat-each 30", "npx playwright test tests/reservar.spec.ts --retries=0 --repeat-each=30"],
    hint: 'Hace falta la opción que repite cada test y la que fija los reintentos en cero.',
    output: 'Running 30 tests using 5 workers\n  2 failed\n  28 passed (6.7s)',
  },
  {
    instruction: 'Listá, dentro de un contenedor de la imagen agenda-e2e que se borre al terminar, los tests con el tag @p0.',
    accepted: ["docker run --rm agenda-e2e npx playwright test --grep \"@p0\" --list", "docker run --rm agenda-e2e npx playwright test --grep '@p0' --list", "docker run --rm agenda-e2e npx playwright test --grep @p0 --list", "docker run --rm agenda-e2e npx playwright test --grep=@p0 --list", "docker run --rm agenda-e2e npx playwright test --list --grep \"@p0\"", "docker run --rm agenda-e2e npx playwright test --list --grep '@p0'", "docker run --rm agenda-e2e npx playwright test --list --grep @p0", "docker run --rm agenda-e2e npx playwright test --list --grep=@p0", "docker run --rm agenda-e2e npx playwright test --list -g \"@p0\"", "docker run --rm agenda-e2e npx playwright test --list -g @p0", "docker run --rm agenda-e2e npx playwright test -g \"@p0\" --list", "docker run --rm agenda-e2e npx playwright test -g @p0 --list"],
    hint: 'Es `docker run` con la opción que borra el contenedor, la imagen y el comando de Playwright que lista.',
    output: 'Listing tests:\n  [setup] › auth.setup.ts:2:6 › ingresar como recepcionista\n  [chromium] › agenda.spec.ts:4:7 › Agenda › reservar el primer horario libre\n  [chromium] › agenda.spec.ts:5:7 › Agenda › cancelar un turno lo libera\n  [chromium] › pacientes.spec.ts:4:7 › Pacientes › buscar un paciente por DNI\nTotal: 4 tests in 3 files',
  },
];
export const MIX_EXPLANATION =
  'Los filtros de tags se combinan con `--shard` (entradas 70 y 71), la inestabilidad se mide sin reintentos (72), y el comando del final de `docker run` reemplaza al del Dockerfile (74).';

// 4. Clasificar (70, 72)
export const TRIAGE_COLUMNS = ['Corregir el test', 'Reportar un defecto', 'Revisar el entorno'];
export const TRIAGE_ITEMS: ClassifyItem[] = [
  {code: 'El trace muestra que el test leyó el estado con textContent() antes de que la tabla se actualizara.', column: 0, why: 'Es una espera mal hecha: el test tiene que usar una assertion web-first (entrada 72).', hint: '¿La aplicación hizo algo mal, o el test leyó antes de tiempo?'},
  {code: 'Con un solo click en Reservar, la agenda a veces muestra el turno duplicado; desarrollo lo reproduce a mano.', column: 1, why: 'La aplicación se comporta mal también fuera del test: es un defecto intermitente (entrada 72).', hint: '¿Pasa también sin el test?'},
  {code: 'En la pestaña Network, el servicio de horarios respondió 503, y a la misma hora fallaron tests de otros tres archivos.', column: 2, why: 'El servidor de pruebas no respondió para nadie: es el entorno (entrada 72).', hint: '¿Falló un solo test o todos los que usan ese servicio?'},
  {code: 'Falla desde que la suite corre con fullyParallel: dos tests crean el mismo paciente de prueba.', column: 0, why: 'Los tests comparten datos: cada uno tiene que crear los suyos (entradas 71 y 72).', hint: '¿El problema está en la aplicación o en los datos que arma el test?'},
  {code: 'El test marcado con test.fail por el defecto #63, el aviso de turno superpuesto, ahora termina con Expected to fail, but passed.', column: 0, why: 'El defecto se corrigió: hay que sacar el `test.fail` del test (entrada 70).', hint: '¿Qué hay que cambiar ahora que la aplicación funciona bien?'},
  {code: 'La agenda acepta turnos los domingos, aunque la clínica no atiende ese día; el test verifica el rechazo.', column: 1, why: 'El test está bien y la aplicación no cumple la regla: se reporta, y el test puede llevar `test.fail` con el número (entrada 70).', hint: '¿Quién incumple la regla: el test o la aplicación?'},
  {code: 'Todos los tests fallan con ERR_CONNECTION_REFUSED en localhost:3000 al correr la imagen agenda-e2e.', column: 2, why: 'Dentro del contenedor, localhost no es tu computadora: hay que apuntar BASE_URL a otra dirección (entrada 74).', hint: '¿Dónde está corriendo la aplicación, y dónde el test?'},
];

// 5. Ordenar (71, 73)
export const FLOW_ITEMS: OrderItem[] = [
  {id: 'merge', what: 'Momento', code: 'npx playwright merge-reports arma el reporte HTML.'},
  {id: 'needs', what: 'Momento', code: 'El job reporte arranca, porque los tres shards terminaron.'},
  {id: 'matrix', what: 'Momento', code: 'La matriz crea tres copias del job tests, una por shard.'},
  {id: 'notify', what: 'Momento', code: 'El job aviso, con needs: [tests, reporte] e if: failure(), avisa en Slack si algún job falló.'},
  {id: 'run', what: 'Momento', code: 'Cada copia corre su parte con --shard y escribe su resultado blob.'},
  {id: 'download', what: 'Momento', code: 'El job reporte baja los artefactos blob-report-* en una carpeta.'},
  {id: 'upload', what: 'Momento', code: 'Cada copia sube su blob-report como artefacto con su número de shard.'},
];
export const FLOW_CORRECT = ['matrix', 'run', 'upload', 'needs', 'download', 'merge', 'notify'];
export const FLOW_RULES: OrderRule[] = [
  {before: 'matrix', after: 'run', why: 'Primero existen las copias del job; después cada una corre su parte.'},
  {before: 'run', after: 'upload', why: 'El resultado blob existe recién después de correr los tests.'},
  {before: 'upload', after: 'needs', why: '`needs: [tests]` hace que el job reporte espere a que terminen las tres copias.'},
  {before: 'needs', after: 'download', why: 'Los artefactos se bajan dentro del job reporte.'},
  {before: 'download', after: 'merge', why: '`merge-reports` necesita todos los archivos blob juntos.'},
  {before: 'merge', after: 'notify', why: '`needs: [tests, reporte]` hace que el aviso espere a los dos jobs; a nivel de job, `failure()` mira si alguno de ellos falló.'},
];

// 6. Elegí la opción (67, 71, 72, 74)
export const READ_QUIZ: QuizQuestion[] = [
  {
    question: 'En la matriz de 3 shards, el job del shard 3 termina en verde en segundos y su resultado no tiene ningún test. La suite tiene 2 archivos y la configuración no tiene fullyParallel. ¿Qué pasó?',
    options: [
      {text: 'El shard 3 se canceló por `fail-fast`.', correct: false, why: 'Un job cancelado no termina en verde: el shard corrió y no tenía nada que correr.'},
      {text: 'Sin fullyParallel las partes son archivos enteros, y con 2 archivos no alcanza para 3 partes.', correct: true, why: 'Con `fullyParallel: true`, las partes se arman con tests sueltos y las tres tienen trabajo (entrada 71).'},
      {text: 'Falta `needs` en el job de los tests.', correct: false, why: '`needs` ordena jobs entre sí; no decide qué tests le tocan a cada shard.'},
    ],
  },
  {
    question: 'CI corre con retries: 2 y la mayoría de los días la corrida termina verde con 2 o 3 flaky. El equipo quiere dejar de aceptar tests inestables nuevos sin perder los reintentos. ¿Qué agrega?',
    options: [
      {text: 'Subir `retries` a 4.', correct: false, why: 'Esconde todavía más tests inestables.'},
      {text: 'Bajar `retries` a 0.', correct: false, why: 'Se pierde la información de cuáles pasan en un reintento, y cualquier demora del entorno frena a todos.'},
      {text: '`--fail-on-flaky-tests` en el comando de CI.', correct: true, why: 'Los reintentos siguen mostrando cuál es inestable, pero la corrida falla (entrada 72).'},
    ],
  },
  {
    question: 'La imagen agenda-e2e tiene playwright/.auth en el .dockerignore. Al correr docker run --rm agenda-e2e npx playwright test --project=chromium --no-deps, todo falla con: Error reading storage state from playwright/.auth/recepcionista.json: ENOENT. ¿Qué corresponde?',
    options: [
      {text: 'Correr sin --no-deps, para que el proyecto setup genere la sesión dentro del contenedor.', correct: true, why: 'La sesión no está en la imagen, a propósito: el setup la crea en cada corrida (entradas 67 y 74).'},
      {text: 'Sacar playwright/.auth del .dockerignore para copiar la sesión en la imagen.', correct: false, why: 'La sesión es tan sensible como una contraseña: no va en una imagen que se comparte.'},
      {text: 'Agregar -v para montar la carpeta playwright/.auth de tu computadora.', correct: false, why: 'Funcionaría en tu computadora, pero no en CI, donde esa carpeta no existe.'},
    ],
  },
];
