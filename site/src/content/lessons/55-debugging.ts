import type {ClassifyItem} from '@site/src/components/Classify';
import type {TerminalStep} from '@site/src/components/Terminal';
import type {QuizQuestion} from '@site/src/components/Quiz';

export const TOOL_COLUMNS = ['UI mode', 'Inspector: --debug o page.pause()', 'Trace viewer'];
export const TOOL_ITEMS: ClassifyItem[] = [
  {
    code: 'Estás escribiendo el test de reprogramar un turno y querés verlo correr cada vez que guardás el archivo.',
    column: 0,
    why: 'El watch mode de UI mode vuelve a correr el test con cada cambio guardado.',
    hint: '¿Qué herramienta corre el test sola cuando cambia el archivo?',
  },
  {
    code: 'El test de cancelar un turno falló anoche en CI; en tu máquina pasa.',
    column: 2,
    why: 'El fallo ya ocurrió en otra máquina: el trace de esa ejecución muestra qué pasó ahí, aunque en local no se reproduzca.',
    hint: '¿Podés volver a ver lo que pasó en la máquina de CI?',
  },
  {
    code: 'Un test falla en tu máquina en el paso 4, y querés detenerte justo antes para mirar la página con DevTools.',
    column: 1,
    why: '`page.pause()` antes del paso 4 detiene el test con la página abierta y el Inspector listo.',
    hint: '¿Qué herramienta detiene el test en una línea elegida?',
  },
  {
    code: 'El reporte de CI muestra un test que falló en el intento original y también en el reintento, con trace en el primer reintento.',
    column: 2,
    why: 'El reintento también falló y dejó su trace: ahí se ve, acción por acción, qué pasó en la máquina de CI.',
    hint: '¿Hay una grabación de esa ejecución?',
  },
  {
    code: 'Querés avanzar acción por acción desde el principio de un test nuevo para ver qué hace cada línea.',
    column: 1,
    why: '`--debug` abre el Inspector detenido antes de la primera acción, con Step over para avanzar de a una.',
    hint: '¿Qué herramienta permite ejecutar una acción y detenerse otra vez?',
  },
  {
    code: 'Querés filtrar la suite por @smoke y correr esos tests viendo su línea de tiempo, uno por uno.',
    column: 0,
    why: 'UI mode lista la suite con filtros por texto, tag y resultado, y muestra la línea de tiempo de cada test que corre.',
    hint: '¿Qué herramienta muestra la suite completa con filtros?',
  },
];

export const TRACE_STEPS: TerminalStep[] = [
  {
    instruction: 'Querés el trace del test de reservar turno aunque pase. Corré el archivo turnos forzando la grabación del trace.',
    accepted: ["npx playwright test turnos --trace on", "npx playwright test --trace on turnos", "npx playwright test turnos --trace=on", "npx playwright test --trace=on turnos", "npx playwright test turnos.spec.ts --trace on", "npx playwright test --trace on turnos.spec.ts", "npx playwright test turnos.spec.ts --trace=on", "npx playwright test --trace=on turnos.spec.ts", "npx playwright test tests/turnos.spec.ts --trace on", "npx playwright test --trace on tests/turnos.spec.ts", "npx playwright test tests/turnos.spec.ts --trace=on", "npx playwright test --trace=on tests/turnos.spec.ts"],
    hint: 'Es la opción `--trace` con el modo que graba siempre.',
    output: 'Running 1 test using 1 worker\n  ✓  1 [chromium] › tests/turnos.spec.ts:4:7 › Turnos › reservar el primer horario libre muestra la confirmación (363ms)\n  1 passed (928ms)',
  },
  {
    instruction: 'Abrí el trace que quedó en test-results/turnos-reservar-chromium/trace.zip (la carpeta real tiene un nombre más largo; acá está acortado).',
    accepted: ['npx playwright show-trace test-results/turnos-reservar-chromium/trace.zip'],
    hint: 'Es el comando de Playwright que abre un trace, seguido de la ruta del archivo.',
    output: '',
  },
];
export const TRACE_EXPLANATION =
  '`--trace on` graba el trace de todos los tests de la corrida, pasen o fallen, y `show-trace` lo abre. También se puede abrir desde el reporte HTML o en trace.playwright.dev.';

export const TRACE_QUIZ: QuizQuestion[] = [
  {
    question: 'En el trace de un test que falló en CI, la última acción es `click` en «Reservar 09:00», con un timeout. Al elegir la acción anterior, `click` en «Continuar», la foto After muestra el mensaje «El DNI tiene que tener 8 dígitos». ¿Qué concluís?',
    options: [
      {text: 'El botón «Reservar 09:00» tardó más de lo normal en CI.', correct: false, why: 'El botón nunca iba a aparecer: la foto After de la acción anterior muestra que la página no avanzó.'},
      {text: 'El DNI que escribió el test no pasó la validación, y por eso los horarios nunca aparecieron.', correct: true, why: 'La foto After de «Continuar» muestra el estado justo después de esa acción: la causa está en el dato del paso anterior.'},
      {text: 'El trace está incompleto porque se grabó en un reintento.', correct: false, why: 'El trace del reintento es una ejecución completa, con todas sus acciones.'},
    ],
  },
  {
    question: 'El mismo test pasa en tu computadora. ¿Qué pestaña del trace de CI revisás para ver si el servidor de pruebas respondió con error al pedir los horarios?',
    options: [
      {text: 'Network, que lista los pedidos al servidor con su estado.', correct: true, why: 'La pestaña Network muestra cada pedido, su método, su estado y su duración: un error del servidor aparece ahí.'},
      {text: 'Metadata, que muestra el navegador y el tamaño de pantalla.', correct: false, why: 'Metadata describe la corrida, no los pedidos que hizo la página.'},
      {text: 'Source, que muestra el código del test.', correct: false, why: 'Source resalta la línea del test de cada acción, no lo que respondió el servidor.'},
    ],
  },
];
