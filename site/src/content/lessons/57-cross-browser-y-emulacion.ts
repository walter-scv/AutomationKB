import type {FillBlankSlot} from '@site/src/components/FillBlank';
import type {TerminalStep} from '@site/src/components/Terminal';
import type {QuizQuestion} from '@site/src/components/Quiz';

export const PROJECTS_TEMPLATE = `export default defineConfig({
  use: {
    {{a}}: 'es-AR',
    {{b}}: 'America/Argentina/Cordoba',
  },
  projects: [
    { name: 'webkit',
      use: { ...devices['Desktop Safari'] } },
    { name: 'edge',
      use: { ...devices['Desktop Edge'],
             {{c}}: 'msedge' } },
    { name: 'iphone',
      use: { ...{{d}}['iPhone 13'] } },
  ],
});`;
export const PROJECTS_SLOTS: FillBlankSlot[] = [
  {id: 'a', answer: 'locale'},
  {id: 'b', answer: 'timezoneId'},
  {id: 'c', answer: 'channel'},
  {id: 'd', answer: 'devices'},
];
export const PROJECTS_BANK = ['browserName', 'devices', 'timezoneId', 'viewport', 'locale', 'channel', 'geolocation', 'projects'];
export const PROJECTS_EXPLANATION =
  '`locale` fija el idioma y el formato regional, y `timezoneId` la zona horaria, para que las fechas se vean igual en cualquier máquina. `channel: \'msedge\'` usa el Edge instalado, y `devices[\'iPhone 13\']` trae el perfil completo del celular.';

export const MOBILE_STEPS: TerminalStep[] = [
  {
    instruction: 'La suite de la tienda tiene los proyectos chromium, firefox, webkit, mobile-chrome y mobile-safari. Listá en qué proyectos correría el archivo carrito.',
    accepted: ['npx playwright test carrito --list', 'npx playwright test --list carrito', 'npx playwright test carrito.spec.ts --list', 'npx playwright test --list carrito.spec.ts'],
    hint: 'Es el filtro por archivo, con la opción que lista sin ejecutar.',
    output: 'Listing tests:\n  [chromium] › carrito.spec.ts:2:5 › agregar un producto suma uno al carrito\n  [firefox] › carrito.spec.ts:2:5 › agregar un producto suma uno al carrito\n  [webkit] › carrito.spec.ts:2:5 › agregar un producto suma uno al carrito\n  [mobile-chrome] › carrito.spec.ts:2:5 › agregar un producto suma uno al carrito\n  [mobile-safari] › carrito.spec.ts:2:5 › agregar un producto suma uno al carrito\nTotal: 5 tests in 1 file',
  },
  {
    instruction: 'Corré el archivo carrito solo en los dos proyectos de celular.',
    accepted: ["npx playwright test carrito --project=mobile-chrome --project=mobile-safari", "npx playwright test --project=mobile-chrome --project=mobile-safari carrito", "npx playwright test carrito --project mobile-chrome --project mobile-safari", "npx playwright test --project mobile-chrome --project mobile-safari carrito", "npx playwright test carrito --project=mobile-safari --project=mobile-chrome", "npx playwright test --project=mobile-safari --project=mobile-chrome carrito", "npx playwright test carrito --project mobile-safari --project mobile-chrome", "npx playwright test --project mobile-safari --project mobile-chrome carrito", "npx playwright test carrito.spec.ts --project=mobile-chrome --project=mobile-safari", "npx playwright test --project=mobile-chrome --project=mobile-safari carrito.spec.ts", "npx playwright test carrito.spec.ts --project mobile-chrome --project mobile-safari", "npx playwright test --project mobile-chrome --project mobile-safari carrito.spec.ts", "npx playwright test carrito.spec.ts --project=mobile-safari --project=mobile-chrome", "npx playwright test --project=mobile-safari --project=mobile-chrome carrito.spec.ts", "npx playwright test carrito.spec.ts --project mobile-safari --project mobile-chrome", "npx playwright test --project mobile-safari --project mobile-chrome carrito.spec.ts", "npx playwright test tests/carrito.spec.ts --project=mobile-chrome --project=mobile-safari", "npx playwright test --project=mobile-chrome --project=mobile-safari tests/carrito.spec.ts", "npx playwright test tests/carrito.spec.ts --project mobile-chrome --project mobile-safari", "npx playwright test --project mobile-chrome --project mobile-safari tests/carrito.spec.ts", "npx playwright test tests/carrito.spec.ts --project=mobile-safari --project=mobile-chrome", "npx playwright test --project=mobile-safari --project=mobile-chrome tests/carrito.spec.ts", "npx playwright test tests/carrito.spec.ts --project mobile-safari --project mobile-chrome", "npx playwright test --project mobile-safari --project mobile-chrome tests/carrito.spec.ts"],
    hint: '`--project` se repite, una vez por cada proyecto.',
    output: 'Running 2 tests using 2 workers\n  ✓  1 [mobile-chrome] › tests/carrito.spec.ts:2:5 › agregar un producto suma uno al carrito (442ms)\n  ✓  2 [mobile-safari] › tests/carrito.spec.ts:2:5 › agregar un producto suma uno al carrito (770ms)\n  2 passed (1.7s)',
  },
];
export const MOBILE_EXPLANATION =
  'Cada proyecto es una corrida del mismo test: cinco proyectos dan cinco ejecuciones. `--project` se repite para elegir varios, y así se corre solo lo que interesa en cada momento.';

export const CROSS_QUIZ: QuizQuestion[] = [
  {
    question: 'El test del resumen de compra pasa en chromium y firefox, y falla en webkit: espera «Retirá hasta las 11:00» y recibe «Retirá hasta las 11:00 p.m.». El texto se arma con `toLocaleString()`. ¿Qué hacés?',
    options: [
      {text: 'Agregar `if (browserName === \'webkit\')` con otro texto esperado.', correct: false, why: 'Esconde la diferencia en lugar de mostrarla: las personas con Safari siguen viendo un formato distinto.'},
      {text: 'Sacar webkit de los proyectos, porque falla solo ahí.', correct: false, why: 'Webkit es el motor de Safari y de los iPhone: sacarlo deja sin probar a esas personas.'},
      {text: 'Reportar la diferencia de formato: la misma pantalla muestra la hora distinto según el navegador.', correct: true, why: 'Es justo lo que los proyectos de varios navegadores existen para encontrar. La aplicación debería formatear la hora de forma explícita.'},
    ],
  },
  {
    question: 'En el proyecto `mobile-safari`, la ficha de un producto mide 980 píxeles de ancho, aunque el iPhone 13 tiene 390. ¿Qué es lo más probable?',
    options: [
      {text: 'A la página le falta `<meta name="viewport" content="width=device-width">`.', correct: true, why: 'Sin esa etiqueta, el navegador del celular dibuja la página con ancho de escritorio, igual que un teléfono real.'},
      {text: 'El perfil `iPhone 13` de Playwright tiene mal configurado el tamaño.', correct: false, why: 'El perfil define 390 de ancho. Que la página use 980 depende de cómo está hecha la página.'},
      {text: 'WebKit no soporta pantallas chicas.', correct: false, why: 'Safari se usa todos los días en celulares: el ancho depende de la página, no del motor.'},
    ],
  },
  {
    question: 'Un test que verifica «Turno del 14/11» pasa en todas las computadoras del equipo y falla en CI con «Turno del 15/11». El turno es el 15/11 a las 02:00 UTC. ¿Qué cambio lo vuelve repetible?',
    options: [
      {text: 'Esperar «15/11» en CI y «14/11» en local, con `process.env.CI`.', correct: false, why: 'El test pasaría a depender de dónde corre. El problema es que el resultado depende de la zona horaria de la máquina.'},
      {text: 'Fijar `timezoneId` en la configuración.', correct: true, why: 'Con la zona horaria fijada, el navegador muestra la fecha igual en cualquier máquina, también en CI, que suele estar en UTC.'},
      {text: 'Subir el timeout de la assertion.', correct: false, why: 'El texto no tarda en aparecer: aparece con otra fecha.'},
    ],
  },
];
