import type {MatchItem} from '@site/src/components/Match';
import type {FillBlankSlot} from '@site/src/components/FillBlank';
import type {QuizQuestion} from '@site/src/components/Quiz';

export const NEED_LEFT: MatchItem[] = [
  {id: 'base', text: 'La suite tiene que correr contra el entorno de staging en lugar del local, sin tocar los tests.'},
  {id: 'only', text: 'Alguien subió un test marcado con `.only` y CI terminó en verde corriendo un solo test.'},
  {id: 'workers', text: 'La máquina de CI se queda sin memoria cuando corren muchos tests a la vez.'},
  {id: 'dir', text: 'Los archivos de test están en la carpeta `e2e/`, no en `tests/`.'},
  {id: 'trace', text: 'Hace falta ver, acción por acción, qué pasó en un test que falló en CI.'},
  {id: 'server', text: 'La aplicación tiene que estar levantada en la máquina antes de que empiece el primer test.'},
  {id: 'retries', text: 'Un corte breve de red en CI no debería dar por fallado un test que funciona.'},
  {id: 'projects', text: 'La suite también tiene que correr en el motor de Safari.'},
];
export const NEED_RIGHT: MatchItem[] = [
  {id: 'server', text: '`webServer`'},
  {id: 'trace', text: '`use.trace`'},
  {id: 'projects', text: '`projects`'},
  {id: 'only', text: '`forbidOnly`'},
  {id: 'dir', text: '`testDir`'},
  {id: 'retries', text: '`retries`'},
  {id: 'base', text: '`use.baseURL`'},
  {id: 'workers', text: '`workers`'},
];
export const NEED_WHY: Record<string, string> = {
  base: '`baseURL` define el servidor una sola vez; los tests navegan con rutas relativas y no cambian.',
  only: 'Con `forbidOnly` activo en CI, un `.only` olvidado detiene la corrida en lugar de dar un verde falso.',
  workers: '`workers` limita cuántos procesos corren tests al mismo tiempo.',
  dir: '`testDir` indica en qué carpeta buscar los archivos de test.',
  trace: 'El trace registra cada acción, el DOM, la red y la consola, y se abre en el trace viewer.',
  server: '`webServer` ejecuta el comando que levanta la aplicación y espera a que responda antes de empezar.',
  retries: '`retries` vuelve a correr un test que falla; si un reintento pasa, el resultado queda como flaky.',
  projects: 'Cada proyecto corre la suite con su propio navegador; WebKit es el motor de Safari.',
};

export const CONFIG_TEMPLATE = `export default defineConfig({
  testDir: './e2e',
  forbidOnly: {{a}}process.env.CI,
  retries: process.env.CI {{b}} 2 : 0,
  use: {
    {{c}}: 'https://staging.tienda.test',
    trace: '{{d}}',
    screenshot: '{{e}}',
  },
});`;
export const CONFIG_SLOTS: FillBlankSlot[] = [
  {id: 'a', answer: '!!'},
  {id: 'b', answer: '?'},
  {id: 'c', answer: 'baseURL'},
  {id: 'd', answer: 'on-first-retry'},
  {id: 'e', answer: 'only-on-failure'},
];
export const CONFIG_BANK = ['on', 'only-on-failure', '&&', 'url', '!!', 'baseURL', '?', 'off', 'on-first-retry', '||'];
export const CONFIG_EXPLANATION =
  '`!!process.env.CI` es `true` solo en CI, y el ternario con `?` da 2 reintentos en CI y 0 en local. `baseURL` define el servidor de staging. El trace se graba en el primer reintento (`on-first-retry`) y la captura, solo cuando un test falla (`only-on-failure`).';

export const RUN_OUTPUT = `Corrida en CI, reporter list:

✘ 1 [chromium]
  › tests/carrito.spec.ts:3:5
  › agregar un producto suma uno
    al carrito (1.3s)
✓ 2 [chromium]
  › tests/carrito.spec.ts:3:5
  › agregar un producto suma uno
    al carrito (retry #1) (442ms)

  1 flaky

Archivos en test-results/:
carrito-agregar-...-chromium/
  test-failed-1.png
  error-context.md
carrito-agregar-...-retry1/
  trace.zip`;

export const RUN_QUIZ: QuizQuestion[] = [
  {
    question: 'La corrida de arriba usa `retries: process.env.CI ? 2 : 0`, `trace: \'on-first-retry\'` y `screenshot: \'only-on-failure\'`, como en la teoría, y el reporter `list`. ¿Qué pasó con el test?',
    options: [
      {text: 'Falló una vez y pasó en el primer reintento: Playwright lo marca como flaky.', correct: true, why: 'La línea con ✘ es el intento original y la de ✓, el `retry #1`. El resumen dice `1 flaky`, no `1 passed`.'},
      {text: 'Pasó: el resultado final es verde, así que no hay nada que revisar.', correct: false, why: 'Que haya hecho falta un reintento es justamente la señal: el resumen lo marca como flaky para que se investigue.'},
      {text: 'Corrió dos veces porque hay dos proyectos configurados.', correct: false, why: 'Las dos líneas son del mismo proyecto, `chromium`. La segunda dice `retry #1`: es un reintento.'},
    ],
  },
  {
    question: '¿Por qué el `trace.zip` quedó en la carpeta que termina en `-retry1` y no en la del primer intento?',
    options: [
      {text: 'Porque el trace solo se graba cuando el test pasa.', correct: false, why: 'No depende de si pasa: `on-first-retry` lo graba en el primer reintento, pase o falle.'},
      {text: 'Porque Playwright mueve el trace al último intento.', correct: false, why: 'Cada intento tiene su carpeta y su evidencia; no se mueve nada.'},
      {text: 'Porque `on-first-retry` graba el trace solo en el primer reintento.', correct: true, why: 'El intento original no tuvo trace; el `retry #1`, que es el primer reintento, sí.'},
    ],
  },
  {
    question: 'Una compañera corre el mismo test en su computadora, sin la variable CI, y la aplicación se comporta igual que en la corrida de arriba. ¿Qué ve?',
    options: [
      {text: '`1 flaky`, igual que en CI.', correct: false, why: 'Sin la variable CI, `retries` vale 0: no hay reintento que pueda pasar.'},
      {text: '`1 failed`, con la captura del fallo y sin trace.', correct: true, why: 'Sin reintentos, el primer fallo es el resultado final. La captura se guarda por `only-on-failure`; el trace no, porque no hubo reintento.'},
      {text: '`1 failed`, con la captura del fallo y el trace.', correct: false, why: '`on-first-retry` necesita un reintento para grabar, y en local `retries` es 0.'},
    ],
  },
];
