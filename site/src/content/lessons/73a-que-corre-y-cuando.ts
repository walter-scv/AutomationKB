import type {MatchItem} from '@site/src/components/Match';
import type {QuizQuestion} from '@site/src/components/Quiz';
import type {TerminalStep} from '@site/src/components/Terminal';
import type {FillBlankSlot} from '@site/src/components/FillBlank';
import type {OrderItem, OrderRule} from '@site/src/components/Order';

export const WHEN_LEFT: MatchItem[] = [
  {id: 'pr', text: 'Una desarrolladora subió un cambio en PrestamosPage.ts y espera el resultado para mergear.'},
  {id: 'deploy', text: 'Terminó de desplegarse una versión nueva del servidor en staging.'},
  {id: 'night', text: 'Hay que saber si todo lo que se mergeó hoy, junto, sigue funcionando en los tres navegadores.'},
  {id: 'manual', text: 'Antes de una demo del catálogo, querés correr solo los tests de @catalogo.'},
];
export const WHEN_RIGHT: MatchItem[] = [
  {id: 'manual', text: 'Run workflow en la regresión, con el tag @catalogo'},
  {id: 'night', text: 'La regresión nocturna, con schedule'},
  {id: 'pr', text: 'El workflow del Pull Request: smoke y lo que cambió'},
  {id: 'deploy', text: 'El smoke, disparado con workflow_run'},
];
export const WHEN_WHY: Record<string, string> = {
  pr: 'Alguien espera: una selección rápida, con lo crítico y lo que el cambio pudo afectar.',
  deploy: 'Se confirma que lo crítico funciona en el entorno recién desplegado.',
  night: 'La suite completa, sobre la rama principal, cuando nadie espera el resultado.',
  manual: 'workflow_dispatch permite elegir el tag al lanzarlo.',
};

export const GAP_QUIZ: QuizQuestion[] = [
  {
    question: 'Un Pull Request cambió PrestamosPage.ts. --only-changed eligió solo prestamos.spec.ts, y pasó en verde. Esa noche falla renovaciones.spec.ts, que también prueba préstamos. ¿Por qué no lo detectó el Pull Request?',
    options: [
      {text: 'Porque renovaciones.spec.ts es un test inestable que falla de vez en cuando.', correct: false, why: 'No corrió en el Pull Request: no hay ningún resultado que diga que es inestable.'},
      {text: 'Porque el Pull Request corre en Chromium y la regresión en Firefox.', correct: false, why: 'La regresión también corre en Chromium: el test directamente no estaba en la selección.'},
      {text: 'Porque no importa PrestamosPage.ts, y --only-changed no lo eligió.', correct: true, why: '--only-changed elige los tests que importan lo que cambió; los demás quedan para la regresión completa.'},
    ],
  },
  {
    question: 'Los Pull Requests #41 y #42 pasaron en verde por separado. Esa noche, la renovación desde la ficha del libro falla. ¿Qué pasó?',
    options: [
      {text: 'Cada uno corrió sin el otro; juntos, en la rama principal, rompen algo.', correct: true, why: 'Es uno de los huecos del Pull Request que cubre la regresión completa.'},
      {text: 'La regresión nocturna corrió una versión vieja de la aplicación.', correct: false, why: 'Corre sobre la rama principal, con todo lo mergeado.'},
      {text: 'Uno de los dos no corrió el smoke antes de mergear.', correct: false, why: 'Los dos pasaron su selección: el problema es la combinación.'},
    ],
  },
  {
    question: '¿Por qué la regresión nombra --project=chromium --project=firefox --project=webkit en lugar de correr npx playwright test sin --project?',
    options: [
      {text: 'Porque sin --project, Playwright corre solo el primer proyecto de la configuración.', correct: false, why: 'Sin --project corren todos los proyectos, incluido el de smoke.'},
      {text: 'Porque si no, también corre el proyecto smoke y los @smoke se repiten.', correct: true, why: 'Nombrar los tres proyectos de navegador deja afuera el proyecto smoke.'},
      {text: 'Porque los proyectos de navegador solo corren si se nombran uno por uno.', correct: false, why: 'Corren igual; el problema es el proyecto que sobra.'},
    ],
  },
];

export const LIST_STEPS: TerminalStep[] = [
  {
    instruction: "Listá, sin correrlos, los tests del proyecto smoke.",
    accepted: ["npx playwright test --project=smoke --list"],
    hint: "Es npx playwright test con --project=smoke y la opción que lista sin correr.",
    output: "Listing tests:\n  [setup] › auth.setup.ts:4:6 › ingresar con la socia de prueba\n  [smoke] › ingreso.spec.ts:6:7 › Ingreso › con datos correctos llega a sus préstamos\n  [smoke] › prestamos.spec.ts:6:7 › Préstamos › renovar un préstamo extiende el vencimiento 14 días\nTotal: 3 tests in 3 files",
  },
  {
    instruction: "Estás en una rama que cambió pages/PrestamosPage.ts. Listá lo que cambió respecto de main, en el proyecto chromium.",
    accepted: ["npx playwright test --project=chromium --only-changed=main --list", "npx playwright test --only-changed=main --project=chromium --list"],
    hint: "Es --project=chromium con --only-changed=main, y --list.",
    output: "Listing tests:\n  [setup] › auth.setup.ts:4:6 › ingresar con la socia de prueba\n  [chromium] › prestamos.spec.ts:6:7 › Préstamos › renovar un préstamo extiende el vencimiento 14 días\n  [chromium] › prestamos.spec.ts:7:7 › Préstamos › devolver un préstamo lo saca de la lista\nTotal: 3 tests in 2 files",
  },
  {
    instruction: "Listá la regresión completa: los tres proyectos de navegador, nombrados uno por uno.",
    accepted: ["npx playwright test --project=chromium --project=firefox --project=webkit --list", "npx playwright test --project=chromium --project=webkit --project=firefox --list", "npx playwright test --project=firefox --project=chromium --project=webkit --list", "npx playwright test --project=firefox --project=webkit --project=chromium --list", "npx playwright test --project=webkit --project=chromium --project=firefox --list", "npx playwright test --project=webkit --project=firefox --project=chromium --list"],
    hint: "Son tres --project, uno por navegador (chromium, firefox y webkit), y --list.",
    output: "Listing tests:\n  [setup] › auth.setup.ts:4:6 › ingresar con la socia de prueba\n  [chromium] › catalogo.spec.ts:5:7 › Catálogo › buscar un libro por autor\n  [chromium] › catalogo.spec.ts:6:7 › Catálogo › exportar el catálogo completo\n  [chromium] › ingreso.spec.ts:6:7 › Ingreso › con datos correctos llega a sus préstamos\n  [chromium] › ingreso.spec.ts:7:7 › Ingreso › con la clave equivocada muestra un error\n  [chromium] › prestamos.spec.ts:6:7 › Préstamos › renovar un préstamo extiende el vencimiento 14 días\n  [chromium] › prestamos.spec.ts:7:7 › Préstamos › devolver un préstamo lo saca de la lista\n  [chromium] › renovaciones.spec.ts:5:7 › Renovaciones › un préstamo admite una sola renovación\n  [firefox] › catalogo.spec.ts:5:7 › Catálogo › buscar un libro por autor\n  [firefox] › catalogo.spec.ts:6:7 › Catálogo › exportar el catálogo completo\n  [firefox] › ingreso.spec.ts:6:7 › Ingreso › con datos correctos llega a sus préstamos\n  [firefox] › ingreso.spec.ts:7:7 › Ingreso › con la clave equivocada muestra un error\n  [firefox] › prestamos.spec.ts:6:7 › Préstamos › renovar un préstamo extiende el vencimiento 14 días\n  [firefox] › prestamos.spec.ts:7:7 › Préstamos › devolver un préstamo lo saca de la lista\n  [firefox] › renovaciones.spec.ts:5:7 › Renovaciones › un préstamo admite una sola renovación\n  [webkit] › catalogo.spec.ts:5:7 › Catálogo › buscar un libro por autor\n  [webkit] › catalogo.spec.ts:6:7 › Catálogo › exportar el catálogo completo\n  [webkit] › ingreso.spec.ts:6:7 › Ingreso › con datos correctos llega a sus préstamos\n  [webkit] › ingreso.spec.ts:7:7 › Ingreso › con la clave equivocada muestra un error\n  [webkit] › prestamos.spec.ts:6:7 › Préstamos › renovar un préstamo extiende el vencimiento 14 días\n  [webkit] › prestamos.spec.ts:7:7 › Préstamos › devolver un préstamo lo saca de la lista\n  [webkit] › renovaciones.spec.ts:5:7 › Renovaciones › un préstamo admite una sola renovación\nTotal: 22 tests in 5 files",
  },
  {
    instruction: "Listá, en el proyecto chromium, solo los tests con el tag @catalogo.",
    accepted: ["npx playwright test --project=chromium --grep \"@catalogo\" --list", "npx playwright test --grep \"@catalogo\" --project=chromium --list", "npx playwright test --project=chromium --grep '@catalogo' --list", "npx playwright test --grep '@catalogo' --project=chromium --list", "npx playwright test --project=chromium --grep @catalogo --list", "npx playwright test --grep @catalogo --project=chromium --list"],
    hint: "Es --project=chromium con --grep y el tag entre comillas, y --list.",
    output: "Listing tests:\n  [setup] › auth.setup.ts:4:6 › ingresar con la socia de prueba\n  [chromium] › catalogo.spec.ts:5:7 › Catálogo › buscar un libro por autor\n  [chromium] › catalogo.spec.ts:6:7 › Catálogo › exportar el catálogo completo\nTotal: 3 tests in 2 files",
  },
];
export const LIST_EXPLANATION =
  'Cada selección se comprueba con --list antes de llevarla a un workflow: el smoke, lo que cambió, la regresión completa y un tag elegido a mano.';

export const PR_TEMPLATE = `concurrency:
  group: pr-\${{ github.event.pull_request.number }}
  cancel-in-progress: {{a}}

jobs:
  pr:
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: {{b}}
      # ... setup-node, npm ci, navegador ...
      - name: Smoke
        run: npx playwright test --project={{c}}
      - name: Lo que cambió
        if: \${{ !cancelled() }}
        run: npx playwright test --project=chromium {{d}}="origin/$GITHUB_BASE_REF"`;
export const PR_SLOTS: FillBlankSlot[] = [
  {id: 'a', answer: 'true'},
  {id: 'b', answer: '0'},
  {id: 'c', answer: 'smoke'},
  {id: 'd', answer: '--only-changed'},
];
export const PR_BANK = ['true', 'false', '0', '1', 'smoke', 'chromium', '--only-changed', '--grep'];
export const PR_EXPLANATION =
  'Un push nuevo cancela la ejecución anterior; fetch-depth: 0 baja la historia que necesita --only-changed para comparar; y son dos pasos, porque el smoke y lo que cambió son dos selecciones distintas.';

export const MORNING_ITEMS: OrderItem[] = [
  {id: 'log', what: 'Paso', code: 'Listar con git log lo que se mergeó desde la última noche en verde.'},
  {id: 'act', what: 'Paso', code: 'Clasificar cada grupo y decidir una acción: reportar, corregir, arreglar los datos o poner en cuarentena.'},
  {id: 'report', what: 'Paso', code: 'Abrir el reporte del artefacto de la regresión.'},
  {id: 'group', what: 'Paso', code: 'Agrupar los fallos por causa.'},
  {id: 'system', what: 'Paso', code: 'Comprobar si es sistémico: si casi todo falla en el mismo paso.'},
];
export const MORNING_CORRECT = ['report', 'system', 'group', 'log', 'act'];
export const MORNING_RULES: OrderRule[] = [
  {before: 'report', after: 'system', why: 'Sin abrir el reporte no se sabe qué falló ni dónde.'},
  {before: 'system', after: 'group', why: 'Si es sistémico, es un solo problema: no hace falta agrupar test por test.'},
  {before: 'group', after: 'log', why: 'Con los grupos armados, se busca qué cambio pudo causar cada uno.'},
  {before: 'log', after: 'act', why: 'La acción depende de la causa, y los sospechosos ayudan a encontrarla.'},
];
