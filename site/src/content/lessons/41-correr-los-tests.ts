import type {TerminalStep} from '@site/src/components/Terminal';
import type {MultiSelectQuestion} from '@site/src/components/MultiSelect';
import type {BuilderStep} from '@site/src/components/CommandBuilder';
import type {DecisionNode} from '@site/src/components/DecisionPath';

const SMOKE_ACCEPTED = ["npx playwright test --grep @smoke --project=chromium --list", "npx playwright test --grep @smoke --list --project=chromium", "npx playwright test --project=chromium --grep @smoke --list", "npx playwright test --project=chromium --list --grep @smoke", "npx playwright test --list --grep @smoke --project=chromium", "npx playwright test --list --project=chromium --grep @smoke", "npx playwright test --grep @smoke --project chromium --list", "npx playwright test --grep @smoke --list --project chromium", "npx playwright test --project chromium --grep @smoke --list", "npx playwright test --project chromium --list --grep @smoke", "npx playwright test --list --grep @smoke --project chromium", "npx playwright test --list --project chromium --grep @smoke", "npx playwright test -g @smoke --project=chromium --list", "npx playwright test -g @smoke --list --project=chromium", "npx playwright test --project=chromium -g @smoke --list", "npx playwright test --project=chromium --list -g @smoke", "npx playwright test --list -g @smoke --project=chromium", "npx playwright test --list --project=chromium -g @smoke", "npx playwright test -g @smoke --project chromium --list", "npx playwright test -g @smoke --list --project chromium", "npx playwright test --project chromium -g @smoke --list", "npx playwright test --project chromium --list -g @smoke", "npx playwright test --list -g @smoke --project chromium", "npx playwright test --list --project chromium -g @smoke", "npx playwright test --grep=@smoke --project=chromium --list", "npx playwright test --grep=@smoke --list --project=chromium", "npx playwright test --project=chromium --grep=@smoke --list", "npx playwright test --project=chromium --list --grep=@smoke", "npx playwright test --list --grep=@smoke --project=chromium", "npx playwright test --list --project=chromium --grep=@smoke", "npx playwright test --grep=@smoke --project chromium --list", "npx playwright test --grep=@smoke --list --project chromium", "npx playwright test --project chromium --grep=@smoke --list", "npx playwright test --project chromium --list --grep=@smoke", "npx playwright test --list --grep=@smoke --project chromium", "npx playwright test --list --project chromium --grep=@smoke", "npx playwright test --grep \"@smoke\" --project=chromium --list", "npx playwright test --grep \"@smoke\" --list --project=chromium", "npx playwright test --project=chromium --grep \"@smoke\" --list", "npx playwright test --project=chromium --list --grep \"@smoke\"", "npx playwright test --list --grep \"@smoke\" --project=chromium", "npx playwright test --list --project=chromium --grep \"@smoke\"", "npx playwright test --grep \"@smoke\" --project chromium --list", "npx playwright test --grep \"@smoke\" --list --project chromium", "npx playwright test --project chromium --grep \"@smoke\" --list", "npx playwright test --project chromium --list --grep \"@smoke\"", "npx playwright test --list --grep \"@smoke\" --project chromium", "npx playwright test --list --project chromium --grep \"@smoke\"", "npx playwright test -g \"@smoke\" --project=chromium --list", "npx playwright test -g \"@smoke\" --list --project=chromium", "npx playwright test --project=chromium -g \"@smoke\" --list", "npx playwright test --project=chromium --list -g \"@smoke\"", "npx playwright test --list -g \"@smoke\" --project=chromium", "npx playwright test --list --project=chromium -g \"@smoke\"", "npx playwright test -g \"@smoke\" --project chromium --list", "npx playwright test -g \"@smoke\" --list --project chromium", "npx playwright test --project chromium -g \"@smoke\" --list", "npx playwright test --project chromium --list -g \"@smoke\"", "npx playwright test --list -g \"@smoke\" --project chromium", "npx playwright test --list --project chromium -g \"@smoke\""];

export const RUN_STEPS: TerminalStep[] = [
  {
    instruction: 'La suite de turnos tiene dos archivos y dos proyectos. Listá todos sus tests sin correrlos.',
    accepted: ['npx playwright test --list'],
    hint: 'Es el comando de siempre, con la opción que muestra la lista en lugar de ejecutar.',
    output:
      'Listing tests:\n  [chromium] › perfil.spec.ts:4:7 › Perfil › cambiar el teléfono guarda el dato nuevo\n  [chromium] › perfil.spec.ts:8:7 › Perfil › cancelar la edición deja el teléfono anterior\n  [chromium] › turnos.spec.ts:4:7 › Turnos › reservar un turno muestra la confirmación\n  [chromium] › turnos.spec.ts:8:7 › Turnos › cancelar un turno lo saca de la lista\n  [chromium] › turnos.spec.ts:12:7 › Turnos › reprogramar un turno lo pasa a la fecha nueva\n  [firefox] › perfil.spec.ts:4:7 › Perfil › cambiar el teléfono guarda el dato nuevo\n  [firefox] › perfil.spec.ts:8:7 › Perfil › cancelar la edición deja el teléfono anterior\n  [firefox] › turnos.spec.ts:4:7 › Turnos › reservar un turno muestra la confirmación\n  [firefox] › turnos.spec.ts:8:7 › Turnos › cancelar un turno lo saca de la lista\n  [firefox] › turnos.spec.ts:12:7 › Turnos › reprogramar un turno lo pasa a la fecha nueva\nTotal: 10 tests in 2 files',
  },
  {
    instruction: 'Listá solo los tests del archivo turnos.spec.ts.',
    accepted: ['turnos', 'turnos.spec', 'turnos.spec.ts', 'tests/turnos', 'tests/turnos.spec.ts'].flatMap((f) => ['npx playwright test ' + f + ' --list', 'npx playwright test --list ' + f]),
    hint: 'Una palabra suelta después de `test` filtra por la ruta del archivo. Mantené `--list`.',
    output:
      'Listing tests:\n  [chromium] › turnos.spec.ts:4:7 › Turnos › reservar un turno muestra la confirmación\n  [chromium] › turnos.spec.ts:8:7 › Turnos › cancelar un turno lo saca de la lista\n  [chromium] › turnos.spec.ts:12:7 › Turnos › reprogramar un turno lo pasa a la fecha nueva\n  [firefox] › turnos.spec.ts:4:7 › Turnos › reservar un turno muestra la confirmación\n  [firefox] › turnos.spec.ts:8:7 › Turnos › cancelar un turno lo saca de la lista\n  [firefox] › turnos.spec.ts:12:7 › Turnos › reprogramar un turno lo pasa a la fecha nueva\nTotal: 6 tests in 1 file',
  },
  {
    instruction: 'Listá los tests con el tag @smoke, solo en el proyecto chromium.',
    accepted: SMOKE_ACCEPTED,
    hint: 'Hacen falta tres opciones: la que filtra por título o tag, la que elige el proyecto y `--list`.',
    output:
      'Listing tests:\n  [chromium] › perfil.spec.ts:4:7 › Perfil › cambiar el teléfono guarda el dato nuevo\n  [chromium] › turnos.spec.ts:4:7 › Turnos › reservar un turno muestra la confirmación\nTotal: 2 tests in 2 files',
  },
  {
    instruction: 'Ahora corré, en los dos proyectos, solo el test que empieza en la línea 8 de turnos.spec.ts.',
    accepted: ['turnos', 'turnos.spec', 'turnos.spec.ts', 'tests/turnos.spec.ts'].map((f) => 'npx playwright test ' + f + ':8'),
    hint: 'El archivo y el número de línea van juntos, separados por dos puntos.',
    output:
      'Running 2 tests using 2 workers\n\n  ✓  2 [chromium] › tests/turnos.spec.ts:8:7 › Turnos › cancelar un turno lo saca de la lista (181ms)\n  ✓  1 [firefox] › tests/turnos.spec.ts:8:7 › Turnos › cancelar un turno lo saca de la lista (474ms)\n\n  2 passed (1.4s)',
  },
];
export const RUN_EXPLANATION =
  '`--list` muestra qué va a correr sin ejecutar nada. Una palabra suelta filtra por archivo, `-g` por título o tag, `--project` por proyecto, y `archivo:línea` elige un test puntual. Todos los filtros se combinan.';

export const FILTER_QUESTIONS: MultiSelectQuestion[] = [
  {
    prompt: 'Con la suite de turnos de la actividad anterior, ¿qué ejecuciones produce `npx playwright test perfil -g cancelar --project=firefox`? Marcá todas las que correspondan.',
    options: [
      {text: '`[firefox]` Perfil › cancelar la edición deja el teléfono anterior', correct: true, why: 'Cumple los tres filtros: está en el archivo de perfil, su título contiene «cancelar» y corre en Firefox.'},
      {text: '`[chromium]` Perfil › cancelar la edición deja el teléfono anterior', correct: false, why: '`--project=firefox` deja afuera el proyecto chromium.'},
      {text: '`[firefox]` Turnos › cancelar un turno lo saca de la lista', correct: false, why: 'Contiene «cancelar», pero está en `turnos.spec.ts`, y el filtro de archivo pide `perfil`.'},
      {text: '`[firefox]` Perfil › cambiar el teléfono guarda el dato nuevo', correct: false, why: 'Está en el archivo de perfil y en Firefox, pero su título no contiene «cancelar».'},
    ],
  },
  {
    prompt: '¿Y con `npx playwright test -g Cancelar --project=chromium`, con C mayúscula? Marcá todas las que correspondan.',
    options: [
      {text: '`[chromium]` Turnos › cancelar un turno lo saca de la lista', correct: true, why: '`-g` no distingue mayúsculas de minúsculas: «Cancelar» encuentra «cancelar».'},
      {text: '`[chromium]` Perfil › cancelar la edición deja el teléfono anterior', correct: true, why: 'Sin filtro de archivo, `-g` busca en todos: este título también contiene «cancelar».'},
      {text: 'Ninguna: los títulos dicen «cancelar» con minúscula.', correct: false, why: 'La comparación de `-g` no distingue mayúsculas de minúsculas.'},
      {text: '`[firefox]` Turnos › cancelar un turno lo saca de la lista', correct: false, why: '`--project=chromium` deja afuera Firefox.'},
    ],
  },
];

export const HEADED_PREFIX = 'npx playwright test ';
export const HEADED_STEPS: BuilderStep[] = [
  {options: ['@perfil', 'perfil', '--last-failed'], correct: 'perfil', hint: 'Lo que se quiere filtrar es un archivo. Esa opción no elige archivos por su nombre.'},
  {options: ['--project=chromium', '--list', '--project=firefox'], correct: '--project=firefox', hint: 'Ese fragmento no deja la corrida en el navegador que se pide.'},
  {options: ['--grep-invert', '--headed', '--list'], correct: '--headed', hint: 'Esa opción no muestra la ventana del navegador mientras el test corre.'},
];
export const HEADED_EXPLANATION =
  '`perfil` elige el archivo, `--project=firefox` el navegador y `--headed` abre la ventana para ver cada acción. Sin `--headed`, el navegador corre en modo headless, sin ventana.';

export const FAIL_START = 'fail';
export const FAIL_NODES: Record<string, DecisionNode> = {
  fail: {
    id: 'fail',
    situation: 'Corriste la suite completa: 9 pasaron y 1 falló, «cancelar un turno lo saca de la lista» en chromium. Corregiste el test y querés comprobar solo ese, rápido. ¿Qué corrés?',
    options: [
      {text: '`npx playwright test` otra vez, para estar seguro.', correct: false, why: 'Corre los 10 tests para comprobar uno. Hay una forma directa de repetir solo lo que falló.'},
      {text: '`npx playwright test --last-failed`.', correct: true, why: 'Vuelve a correr solo los tests que fallaron en la corrida anterior, sin buscar archivo ni línea.', next: 'report'},
      {text: '`npx playwright test --list`.', correct: false, why: '`--list` no ejecuta nada: solo muestra qué correría.'},
    ],
  },
  report: {
    id: 'report',
    situation: 'Vuelve a fallar. Querés ver los pasos del test, el error y la captura del fallo en una página. ¿Qué hacés?',
    options: [
      {text: 'Abrir el reporte con `npx playwright show-report`.', correct: true, why: 'El reporte HTML muestra cada test con sus pasos, el error y la evidencia guardada.', next: 'only'},
      {text: 'Volver a correr con `--headed` varias veces hasta verlo fallar.', correct: false, why: 'Sirve para ver qué hace un test, pero no deja registro del error ni de la evidencia.'},
      {text: 'Agregar `test.skip` hasta que haya tiempo de revisarlo.', correct: false, why: 'Saltearlo no muestra nada sobre el fallo; solo lo esconde.'},
    ],
  },
  only: {
    id: 'only',
    situation: 'Para trabajar sobre el test lo marcaste con `test.only`, lo arreglaste y pasa. Antes de subir el cambio, ¿qué hacés?',
    options: [
      {text: 'Subirlo así: `forbidOnly` lo va a detectar en CI.', correct: false, why: 'Lo detecta, pero la corrida de CI falla por algo que se podía resolver antes. El `.only` no tiene que llegar al repositorio.'},
      {text: 'Cambiar `test.only` por `test.skip`, por las dudas.', correct: false, why: 'El test dejaría de correr: se perdería la verificación que acabás de arreglar.'},
      {text: 'Quitar el `.only` y correr la suite completa.', correct: true, why: 'Sin `.only` vuelven a correr todos, y la suite completa confirma que el arreglo no rompió otro test.'},
    ],
  },
};
export const FAIL_EXPLANATION =
  'Después de un fallo: `--last-failed` para repetir solo lo que falló y el reporte HTML para ver pasos, error y evidencia. Antes de subir: sin `test.only` y con la suite completa.';

export const SCRIPT_ACCEPTED = ['npm run test:smoke', 'npm run-script test:smoke'];
export const SCRIPT_HINTS = [
  'Los scripts de package.json se ejecutan con npm, no con npx.',
  'Es npm, la acción que corre scripts, y el nombre exacto del script.',
];
export const SCRIPT_EXPLANATION =
  '`npm run test:smoke` ejecuta el script `test:smoke` de `package.json`, que contiene `playwright test --grep @smoke`. Todo el equipo corre así el mismo comando.';
export const SCRIPT_JSON = `"scripts": {
  "test": "playwright test",
  "test:smoke":
    "playwright test --grep @smoke",
  "report":
    "playwright show-report"
}`;
