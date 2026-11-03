import type {DecisionNode} from '@site/src/components/DecisionPath';
import type {ClassifyItem} from '@site/src/components/Classify';
import type {TerminalStep} from '@site/src/components/Terminal';
import type {QuizQuestion} from '@site/src/components/Quiz';

export const MOMENT_START = 'pr';
export const MOMENT_NODES: Record<string, DecisionNode> = {
  pr: {
    id: 'pr',
    situation: 'Un Pull Request de la agenda de turnos cambia `pages/PacientePage.ts`. La suite completa tarda 40 minutos. ¿Qué corre en el Pull Request?',
    options: [
      {text: 'Los tests afectados por el cambio, con `--only-changed=main`.', correct: true, why: 'Corre los archivos de test modificados y los que importan `PacientePage`: lo que el cambio puede haber roto, en pocos minutos.', next: 'deploy'},
      {text: 'Nada: la suite completa ya corre de noche.', correct: false, why: 'El defecto llegaría a la rama principal y recién se vería al día siguiente, mezclado con otros cambios.'},
      {text: 'Solo `@smoke`, como antes de desplegar.', correct: false, why: 'El smoke cubre lo crítico de todo el sistema, no lo que tocó este cambio: los tests de pacientes que no son smoke quedarían afuera.'},
    ],
  },
  deploy: {
    id: 'deploy',
    situation: 'La versión se despliega a producción en 10 minutos y hay que confirmar que lo crítico funciona en staging. ¿Qué corrés?',
    options: [
      {text: 'La suite completa, en todos los navegadores.', correct: false, why: 'Tarda mucho más que los 10 minutos disponibles.'},
      {text: 'Los tests que cambiaron desde la última versión.', correct: false, why: 'Lo que hay que confirmar es lo crítico de todo el sistema, haya cambiado o no.'},
      {text: 'Los tests `@smoke`, con `--grep @smoke`.', correct: true, why: 'El smoke es justamente el conjunto chico que cubre lo principal antes de seguir.', next: 'night'},
    ],
  },
  night: {
    id: 'night',
    situation: '¿Cuándo corre la regresión completa, con todas las prioridades y en todos los proyectos?',
    options: [
      {text: 'Una vez antes de cada versión, para no gastar tiempo de CI.', correct: false, why: 'Los defectos se acumulan durante semanas y aparecen todos juntos, sin saber qué cambio los causó.'},
      {text: 'Todas las noches, sobre la rama principal.', correct: true, why: 'Cubre lo que los subsets dejan afuera, y un defecto aparece al día siguiente del cambio que lo causó.', next: 'bug'},
      {text: 'Nunca: con los Pull Requests y el smoke alcanza.', correct: false, why: 'Los dos subsets dejan afuera tests: un cambio en el servidor no aparece en `--only-changed`.'},
    ],
  },
  bug: {
    id: 'bug',
    situation: 'La regresión encuentra que el sistema permite reprogramar un turno a un feriado. El defecto #57 está reportado y se corrige en dos versiones. ¿Qué hacés con el test?',
    options: [
      {text: 'Agregarle `test.fail(true, \'Defecto #57: permite reprogramar a un feriado\')`, sin cambiar lo que verifica.', correct: true, why: 'La corrida deja de estar roja por una falla conocida, y cuando se corrija el defecto, el test avisa con «Expected to fail, but passed».'},
      {text: 'Agregarle `test.skip` hasta que se corrija.', correct: false, why: 'El test deja de correr: nadie se entera cuando el defecto se corrige, ni si empeora.'},
      {text: 'Cambiar la assertion para que acepte el feriado, y volver a cambiarla después.', correct: false, why: 'El test pasa a afirmar el comportamiento incorrecto, y nadie recuerda volver a cambiarla.'},
    ],
  },
};
export const MOMENT_EXPLANATION =
  'Un subset para cada momento: lo que cambió en el Pull Request, `@smoke` antes de desplegar, todo de noche; y `test.fail` con el número del defecto para lo que ya se sabe que falla.';

export const ANNOT_COLUMNS = ['test.skip con condición', 'test.fixme', 'test.fail'];
export const ANNOT_ITEMS: ClassifyItem[] = [
  {code: 'El test de descargar el comprobante no aplica en el proyecto de iPhone, que no tiene descargas.', column: 0, why: 'En ese proyecto el test no tiene sentido: se saltea con una condición sobre el proyecto o el navegador.', hint: '¿El test aplica en ese proyecto?'},
  {code: 'El test de reprogramar falla desde el rediseño porque sus locators quedaron viejos, y nadie lo arregló todavía.', column: 1, why: 'El que está roto es el test: `fixme` lo saltea y deja claro que hay que arreglarlo.', hint: '¿Quién tiene el problema: el test o la aplicación?'},
  {code: 'El sistema permite reservar dos turnos a la misma hora. El defecto #61 está reportado, y el test verifica que no se pueda.', column: 2, why: 'El test está bien y la aplicación tiene un defecto conocido: `fail` documenta que hoy falla y avisa cuando se corrija.', hint: '¿El test verifica el comportamiento correcto?'},
  {code: 'La pantalla de estadísticas solo existe en staging; en el entorno local no está.', column: 0, why: 'Donde la pantalla no existe, el test no aplica: se saltea con una condición sobre el entorno.', hint: '¿En el entorno local hay algo para probar?'},
  {code: 'El arrastre de turnos no funciona en Firefox: el equipo de producto decidió no ofrecerlo en ese navegador.', column: 0, why: 'No es un defecto: es una decisión de producto. En Firefox el test no aplica.', hint: '¿Es un defecto o una decisión?'},
  {code: 'El aviso de turno superpuesto no aparece. Está reportado como defecto #63 y su corrección ya está planificada.', column: 2, why: 'Defecto reportado y test correcto: `fail`, con el número en el motivo.', hint: '¿Hay un defecto reportado de la aplicación?'},
  {code: 'El test del calendario falla desde que se actualizó el componente de fecha, y hay que reescribir cómo elige el día.', column: 1, why: 'El test quedó desactualizado frente a un componente nuevo: es el test el que hay que arreglar.', hint: '¿Lo que hay que cambiar es el test o la aplicación?'},
];

export const FILTER_STEPS: TerminalStep[] = [
  {
    instruction: 'Listá, sin correrlos, los tests de la agenda que tienen a la vez el tag @p0 y el tag @pacientes.',
    accepted: ["npx playwright test --grep \"(?=.*@p0)(?=.*@pacientes)\" --list", "npx playwright test --grep \"(?=.*@pacientes)(?=.*@p0)\" --list", "npx playwright test --grep '(?=.*@p0)(?=.*@pacientes)' --list", "npx playwright test --grep '(?=.*@pacientes)(?=.*@p0)' --list", "npx playwright test --grep=\"(?=.*@p0)(?=.*@pacientes)\" --list", "npx playwright test --grep=\"(?=.*@pacientes)(?=.*@p0)\" --list", "npx playwright test --grep='(?=.*@p0)(?=.*@pacientes)' --list", "npx playwright test --grep='(?=.*@pacientes)(?=.*@p0)' --list", "npx playwright test --list --grep \"(?=.*@p0)(?=.*@pacientes)\"", "npx playwright test --list --grep \"(?=.*@pacientes)(?=.*@p0)\"", "npx playwright test --list --grep '(?=.*@p0)(?=.*@pacientes)'", "npx playwright test --list --grep '(?=.*@pacientes)(?=.*@p0)'", "npx playwright test --list -g \"(?=.*@p0)(?=.*@pacientes)\"", "npx playwright test --list -g \"(?=.*@pacientes)(?=.*@p0)\"", "npx playwright test --list -g '(?=.*@p0)(?=.*@pacientes)'", "npx playwright test --list -g '(?=.*@pacientes)(?=.*@p0)'", "npx playwright test -g \"(?=.*@p0)(?=.*@pacientes)\" --list", "npx playwright test -g \"(?=.*@pacientes)(?=.*@p0)\" --list", "npx playwright test -g '(?=.*@p0)(?=.*@pacientes)' --list", "npx playwright test -g '(?=.*@pacientes)(?=.*@p0)' --list"],
    hint: 'Hace falta una expresión que exija los dos tags en cualquier orden, con un `(?=.*...)` para cada uno, entre comillas.',
    output: 'Listing tests:\n  [setup] › auth.setup.ts:2:6 › ingresar como recepcionista\n  [chromium] › pacientes.spec.ts:4:7 › Pacientes › buscar un paciente por DNI\nTotal: 2 tests in 2 files',
  },
  {
    instruction: 'Listá todos los tests menos los que tienen el tag @lento.',
    accepted: ["npx playwright test --grep-invert \"@lento\" --list", "npx playwright test --grep-invert '@lento' --list", "npx playwright test --grep-invert @lento --list", "npx playwright test --grep-invert=\"@lento\" --list", "npx playwright test --grep-invert='@lento' --list", "npx playwright test --grep-invert=@lento --list", "npx playwright test --list --grep-invert \"@lento\"", "npx playwright test --list --grep-invert '@lento'", "npx playwright test --list --grep-invert @lento", "npx playwright test --list --grep-invert=\"@lento\"", "npx playwright test --list --grep-invert='@lento'", "npx playwright test --list --grep-invert=@lento"],
    hint: 'Es la opción que excluye lo que coincide con la expresión.',
    output: 'Listing tests:\n  [setup] › auth.setup.ts:2:6 › ingresar como recepcionista\n  [chromium] › agenda.spec.ts:4:7 › Agenda › reservar el primer horario libre\n  [chromium] › agenda.spec.ts:5:7 › Agenda › cancelar un turno lo libera\n  [chromium] › agenda.spec.ts:6:7 › Agenda › reprogramar un turno a otro día\n  [chromium] › pacientes.spec.ts:4:7 › Pacientes › buscar un paciente por DNI\n  [chromium] › pacientes.spec.ts:5:7 › Pacientes › editar el teléfono de un paciente\nTotal: 6 tests in 3 files',
  },
  {
    instruction: 'Estás en la rama mejora-pacientes, que cambió pages/PacientePage.ts. Listá los tests afectados por los cambios respecto de la rama main.',
    accepted: ["npx playwright test --list --only-changed main", "npx playwright test --list --only-changed=main", "npx playwright test --only-changed main --list", "npx playwright test --only-changed=main --list"],
    hint: 'Es la opción que filtra por lo que cambió según Git, con el nombre de la rama de referencia.',
    output: 'Listing tests:\n  [setup] › auth.setup.ts:2:6 › ingresar como recepcionista\n  [chromium] › pacientes.spec.ts:4:7 › Pacientes › buscar un paciente por DNI\n  [chromium] › pacientes.spec.ts:5:7 › Pacientes › editar el teléfono de un paciente\n  [chromium] › pacientes.spec.ts:6:7 › Pacientes › exportar el listado de pacientes\nTotal: 4 tests in 2 files',
  },
];
export const FILTER_EXPLANATION =
  'Cada `(?=.*@tag)` exige un tag, así que los dos juntos combinan como «y»; `--grep-invert` excluye y `--only-changed=main` deja los tests que tocan lo que cambió en la rama. En las tres salidas aparece el setup: es una dependencia y corre igual.';

export const READ_QUIZ: QuizQuestion[] = [
  {
    question: 'El test de reprogramar a un feriado tiene test.fail por el defecto #57. Hace meses que el reporter list lo muestra con ✘ y el resumen lo cuenta como passed. Al abrir el error, dice: waiting for getByRole(\'button\', { name: \'Reprogramar\' }); el botón ahora se llama «Cambiar horario». ¿Qué pasa?',
    options: [
      {text: 'Nada: el test falla, como se espera mientras el #57 no se corrija.', correct: false, why: 'Falla por otra causa: ya no llega a verificar el feriado. Si el #57 se corrige, el test va a seguir fallando y nadie se va a enterar.'},
      {text: 'test.fail aceptó una falla que no tiene que ver con el defecto: hay que corregir el locator en el Page Object.', correct: true, why: '`test.fail` acepta cualquier falla. Por eso se revisa: el test tiene que fallar por el defecto, no por un locator roto.'},
      {text: 'El defecto #57 ya se corrigió.', correct: false, why: 'Si se hubiera corregido y el test llegara a verificarlo, terminaría con «Expected to fail, but passed».'},
    ],
  },
  {
    question: 'El test de reprogramar a un feriado, marcado con test.fail por el defecto #57, hoy hace fallar la corrida con: Expected to fail, but passed. ¿Qué corresponde?',
    options: [
      {text: 'Confirmar que el #57 se corrigió y sacar el test.fail.', correct: true, why: 'El test pasó porque la aplicación ahora se comporta bien: la anotación cumplió su función y ya no corresponde.'},
      {text: 'Cambiar la assertion para que el test vuelva a fallar.', correct: false, why: 'El test verifica el comportamiento correcto, que ahora se cumple: hacerlo fallar sería afirmar el defecto.'},
      {text: 'Cambiar test.fail por test.skip, para que la corrida vuelva a pasar.', correct: false, why: 'El test dejaría de correr justo cuando empezó a verificar algo útil.'},
    ],
  },
  {
    question: 'El test de exportar el informe mensual tarda 70 segundos, porque el servidor arma el archivo, y el timeout de la suite es 30. ¿Qué corresponde?',
    options: [
      {text: 'Subir el timeout de toda la suite a 90 segundos.', correct: false, why: 'Un test colgado en cualquier otro lugar tardaría 90 segundos en fallar.'},
      {text: 'Marcarlo con test.slow(), con el motivo.', correct: true, why: '`test.slow` triplica el timeout solo de ese test: 90 segundos, sin cambiar los demás.'},
      {text: 'Marcarlo con test.fixme hasta que el servidor sea más rápido.', correct: false, why: 'El test no está roto: tarda a propósito. Saltearlo deja la exportación sin probar.'},
    ],
  },
  {
    question: 'Antes de cada despliegue, alguien escribe a mano npx playwright test --grep @smoke, y a veces se olvida el filtro. ¿Qué cambio lo evita?',
    options: [
      {text: 'Agregar @smoke a todos los tests, para que el filtro no cambie nada.', correct: false, why: 'Si todo es smoke, el smoke deja de ser el conjunto chico de lo crítico.'},
      {text: 'Borrar los tests que no son @smoke.', correct: false, why: 'Se pierde la regresión completa, que corre de noche.'},
      {text: 'Un proyecto smoke en la configuración, con grep: /@smoke/, y correr --project=smoke.', correct: true, why: 'El filtro queda escrito en un solo lugar, con nombre, y no depende de recordarlo.'},
    ],
  },
];

export const PIPE_CODE = `$ npx playwright test --grep @smoke|@p0 --list
zsh: command not found: @p0`;
export const PIPE_ACCEPTED = ["npx playwright test --grep \"@p0|@smoke\" --list", "npx playwright test --grep \"@smoke|@p0\" --list", "npx playwright test --grep '@p0|@smoke' --list", "npx playwright test --grep '@smoke|@p0' --list", "npx playwright test --grep=\"@p0|@smoke\" --list", "npx playwright test --grep=\"@smoke|@p0\" --list", "npx playwright test --grep='@p0|@smoke' --list", "npx playwright test --grep='@smoke|@p0' --list", "npx playwright test --list --grep \"@p0|@smoke\"", "npx playwright test --list --grep \"@smoke|@p0\"", "npx playwright test --list --grep '@p0|@smoke'", "npx playwright test --list --grep '@smoke|@p0'", "npx playwright test --list -g \"@p0|@smoke\"", "npx playwright test --list -g \"@smoke|@p0\"", "npx playwright test --list -g '@p0|@smoke'", "npx playwright test --list -g '@smoke|@p0'", "npx playwright test -g \"@p0|@smoke\" --list", "npx playwright test -g \"@smoke|@p0\" --list", "npx playwright test -g '@p0|@smoke' --list", "npx playwright test -g '@smoke|@p0' --list"];
export const PIPE_HINTS = [
  'La terminal tomó la barra vertical como propia: la expresión tiene que llegarle entera a Playwright.',
  'Es el mismo comando, con la expresión `@smoke|@p0` entre comillas.',
];
export const PIPE_EXPLANATION =
  'Sin comillas, `|` es el operador de la terminal que conecta dos comandos, y trató de ejecutar `@p0`. Entre comillas, la expresión llega entera a `--grep`.';
