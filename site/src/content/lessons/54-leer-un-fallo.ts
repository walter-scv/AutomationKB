import type {ClassifyItem} from '@site/src/components/Classify';
import type {TerminalStep} from '@site/src/components/Terminal';
import type {QuizQuestion} from '@site/src/components/Quiz';

export const CAUSE_COLUMNS = ['Defecto de la aplicación', 'Error del test', 'Problema del entorno o los datos'];
export const CAUSE_ITEMS: ClassifyItem[] = [
  {
    code: 'La assertion espera «Turno confirmado» y recibe «Turno confirmado para el 31/11», una fecha que no existe. A mano pasa lo mismo.',
    column: 0,
    why: 'La aplicación muestra una fecha imposible, y se reproduce a mano: es un defecto, y el test hizo su trabajo al encontrarlo.',
    hint: '¿Lo que muestra la pantalla es correcto según lo especificado?',
  },
  {
    code: 'El locator busca el botón «Confirmar turno»; el page snapshot muestra «Confirmar el turno», el nombre que tiene desde el último rediseño aprobado.',
    column: 1,
    why: 'El cambio de texto fue aprobado: la aplicación está bien y el locator quedó desactualizado.',
    hint: '¿El texto nuevo es un error o un cambio decidido por el equipo?',
  },
  {
    code: 'Todos los tests fallan al primer `goto` con `net::ERR_CONNECTION_REFUSED`: el servidor de pruebas estaba caído.',
    column: 2,
    why: 'Ningún test llegó a probar nada: el problema es que la aplicación no estaba disponible.',
    hint: '¿Los tests llegaron a interactuar con la aplicación?',
  },
  {
    code: 'El test pide un turno para el «31/02/2026» y el snapshot muestra «Fecha inválida».',
    column: 1,
    why: 'El 31 de febrero no existe: la aplicación valida bien y el dato del test está mal.',
    hint: '¿La validación de la aplicación está mal, o el dato del test?',
  },
  {
    code: 'El test usa el paciente «30111222», que alguien borró ayer de la base de pruebas; el snapshot dice «Paciente no encontrado».',
    column: 2,
    why: 'La aplicación responde bien a un paciente inexistente y el test está bien escrito: falta el dato que el test asume.',
    hint: '¿La aplicación o el test hicieron algo mal, o falta algo que el test necesitaba?',
  },
  {
    code: 'Con un turno cancelado, la agenda sigue mostrando el horario como ocupado; a mano, el horario tampoco se libera.',
    column: 0,
    why: 'Cancelar un turno tendría que liberar el horario, y no lo hace ni a mano: es un defecto de la aplicación.',
    hint: '¿Una persona que cancela un turno ve lo que debería?',
  },
  {
    code: 'El click en «Reservar» falla por strict mode: hay dos botones «Reservar», uno por cada profesional, como dice el diseño.',
    column: 1,
    why: 'La pantalla es correcta según el diseño; el locator no elige la fila del profesional.',
    hint: '¿Los dos botones son un error de la pantalla o algo esperado?',
  },
];

export const INVESTIGATE_STEPS: TerminalStep[] = [
  {
    instruction: 'El test de reservar un turno falló en la última corrida. Volvé a correr solo lo que falló, para ver si se repite.',
    accepted: ['npx playwright test --last-failed', 'npx playwright test turnos --last-failed', 'npx playwright test --last-failed turnos'],
    hint: 'Es la opción que repite los tests que fallaron en la corrida anterior.',
    output: 'Running 1 test using 1 worker\n\n  ✘  1 [chromium] › tests/turnos.spec.ts:4:7 › Turnos › reservar el primer horario libre muestra la confirmación (30.0s)\n  ...\n  1 failed',
  },
  {
    instruction: 'Falla de nuevo, igual. Abrí el reporte HTML para ver el error, los pasos y la captura.',
    accepted: ['npx playwright show-report'],
    hint: 'Es el comando de Playwright que sirve el reporte HTML.',
    output: '  Serving HTML report at http://localhost:9323. Press Ctrl+C to quit.',
  },
];
export const INVESTIGATE_EXPLANATION =
  'Primero se comprueba que el fallo se repite, con `--last-failed`. Como se repite, es consistente: el reporte HTML muestra el error, cada paso y la evidencia para buscar la causa.';

export const TURNO_OUTPUT = `1) [chromium] › tests/turnos.spec.ts:4:7
   › Turnos › reservar el primer horario
     libre muestra la confirmación
   › 2- Elige el horario de las 09:00

  Test timeout of 30000ms exceeded.

  Error: locator.click:
    Test timeout of 30000ms exceeded.
  Call log:
    - waiting for getByRole('button',
      { name: 'Reservar 09:00' })

# Page snapshot (resumido)
- generic [ref=e1]:
  - heading "Nuevo turno" [level=1]
  - text: DNI del paciente
  - textbox "DNI del paciente":
      "3011122"
  - button "Continuar" [active]
  - paragraph: El DNI tiene que
      tener 8 dígitos`;

export const TURNO_QUIZ: QuizQuestion[] = [
  {
    question: 'Según la salida de arriba, ¿en qué paso se cortó el test y qué tipo de error fue?',
    options: [
      {text: 'En el paso 1: el campo DNI no aceptó el valor.', correct: false, why: 'La línea del test termina en «2- Elige el horario de las 09:00»: el paso 1 se completó sin errores.'},
      {text: 'En el paso 2: una acción esperó un botón hasta agotar el timeout del test.', correct: true, why: '`locator.click: Test timeout of 30000ms exceeded` es una acción, y el call log muestra que nunca encontró el botón.'},
      {text: 'En el paso 2: una assertion no se cumplió.', correct: false, why: 'Una assertion fallida empieza con `expect(...)` y muestra Expected y Received. Esto es un `locator.click`.'},
    ],
  },
  {
    question: 'El page snapshot muestra el estado de la página al fallar. ¿Dónde está la causa?',
    options: [
      {text: 'En el paso 1: el DNI escrito tiene siete dígitos, la validación lo rechazó y los horarios nunca aparecieron.', correct: true, why: 'El snapshot sigue en «Nuevo turno», con el campo en «3011122» y el mensaje de error. El paso 2 falló como consecuencia.'},
      {text: 'En el paso 2: el botón «Reservar 09:00» no existe en la aplicación.', correct: false, why: 'La página nunca llegó a mostrar los horarios: no se puede saber si el botón existe, porque el paso 1 no avanzó.'},
      {text: 'En el entorno: el servidor no respondió.', correct: false, why: 'El servidor respondió: la página cargó y mostró la validación del DNI.'},
    ],
  },
  {
    question: '¿Qué cambio hace que, la próxima vez, un problema así falle en el lugar de la causa?',
    options: [
      {text: 'Subir el timeout del paso 2.', correct: false, why: 'El botón no iba a aparecer nunca: más tiempo solo hace que el test tarde más en fallar.'},
      {text: 'Mover el click de «Continuar» al paso 2.', correct: false, why: 'Reordena el código, pero el fallo seguiría apareciendo en el botón de reserva, lejos de la causa.'},
      {text: 'Terminar el paso 1 con una assertion de que aparecieron los horarios disponibles.', correct: true, why: 'Con esa verificación, el test falla en el paso 1, con un mensaje que apunta a que no avanzó.'},
    ],
  },
];
