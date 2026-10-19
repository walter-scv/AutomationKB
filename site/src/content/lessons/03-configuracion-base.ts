import type {CodeLine} from '@site/src/components/FindInCode';
import type {QuizQuestion} from '@site/src/components/Quiz';

export const CONFIG_RULE_LABELS = [
  'No distingue CI de local cuando debería',
  'Graba evidencia siempre, pesando en disco sin necesidad',
];

export const CONFIG_LINES: CodeLine[] = [
  {code: "testDir: './tests',", rule: 0, why: 'Define dónde están los tests — no depende de CI ni de local.'},
  {
    code: 'forbidOnly: !!process.env.CI,',
    rule: 0,
    why: 'En CI, un test.only() olvidado haría que el job corra uno solo y reporte todo verde — eso tiene que fallar el build. En local no molesta mientras iterás, por eso distingue el entorno.',
  },
  {
    code: 'retries: 2,',
    rule: 1,
    why: 'No distingue CI de local: en tu máquina, si falla, preferís verlo fallar la primera vez, no esperar 2 reintentos. CI sí los necesita por la latencia variable de un entorno compartido.',
    hint: '¿Esta línea se comporta distinto en CI que en tu máquina?',
  },
  {
    code: 'workers: 4,',
    rule: 1,
    why: 'Un número fijo de workers solo tiene sentido donde el recurso es compartido (CI). En local conviene dejar que Playwright use todos los cores disponibles.',
    hint: '¿Tu máquina y el servidor de CI tienen la misma cantidad de recursos disponibles?',
  },
  {
    code: "trace: 'on',",
    rule: 2,
    why: "Grabar el trace siempre pesa en disco y tiempo para información que casi nunca se usa. Grabarlo recién tras el primer fallo ('on-first-retry') es la señal de que ahí sí vale la pena esa evidencia.",
    hint: '¿Hace falta esa evidencia cuando el test pasa?',
  },
  {
    code: "baseURL: process.env.BASE_URL ?? 'https://app.example.com',",
    rule: 0,
    why: 'Sale de una variable de entorno con un default: el mismo config sirve sin configurar nada y además permite apuntar a otro entorno sin tocar código.',
  },
];

export const LESSON_03_QUIZ: QuizQuestion[] = [
  {
    question: '¿Por qué `workers` suele ser `undefined` en local pero un número fijo en CI?',
    options: [
      {text: 'Porque en CI hace falta ir más rápido siempre.', correct: false, why: 'No es velocidad — es que en CI el recurso (CPU) es compartido y limitado, mientras que en tu máquina Playwright puede usar todos los cores libremente.'},
      {text: 'Porque CI es un entorno con recursos compartidos y limitados; en local no hay ese límite.', correct: true, why: 'Un número fijo solo tiene sentido donde el recurso es compartido.'},
      {text: 'No hay ninguna razón — es una convención sin más.', correct: false, why: 'Cada opción del config responde a una decisión concreta, no a una convención arbitraria.'},
    ],
  },
  {
    question: '¿Por qué `trace: "on-first-retry"` y no `trace: "on"` siempre?',
    options: [
      {text: 'Porque "on" no existe como opción.', correct: false, why: '"on" sí existe — el punto es que grabar siempre pesa sin necesidad.'},
      {text: 'Porque grabar el trace en cada test (pase o falle) pesa en disco y tiempo para evidencia que casi nunca se usa.', correct: true, why: 'Solo tras el primer fallo esa evidencia vale la pena.'},
      {text: 'Porque "on-first-retry" es más rápido de escribir.', correct: false, why: 'La razón es de costo (disco/tiempo), no de longitud del código.'},
    ],
  },
  {
    question: '¿Qué resuelve `baseURL: process.env.BASE_URL ?? "https://app.example.com"`?',
    options: [
      {text: 'Que el mismo config sirva sin configurar nada, y también para apuntar a otro entorno sin tocar código.', correct: true, why: 'Exactamente — una variable de entorno con default inline resuelve los dos casos a la vez.'},
      {text: 'Que el test corra más rápido.', correct: false, why: 'No tiene que ver con velocidad, sino con dónde apunta la suite.'},
      {text: 'Que no haga falta tener internet.', correct: false, why: 'La URL sigue siendo necesaria — lo que cambia es de dónde sale su valor.'},
    ],
  },
];
