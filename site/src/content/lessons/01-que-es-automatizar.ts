import type {CodeLine} from '@site/src/components/FindInCode';
import type {QuizQuestion} from '@site/src/components/Quiz';

export const FIRST_RULE_LABELS = ['No es Independent', 'No es Fast', 'No es Self-validating'];

export const FIRST_LINES: CodeLine[] = [
  {
    code: 'El test crea su propio usuario de prueba al arrancar, y lo borra al terminar.',
    rule: 0,
    why: 'Es Independent: no depende de datos dejados por otro test ni de que algo haya corrido antes.',
  },
  {
    code: 'El test asume que ya existe un usuario "admin", creado por el test anterior.',
    rule: 1,
    why: 'Rompe Independent: si el test anterior no corrió (o corrió en otro orden), este falla sin que el comportamiento real esté roto. Es la causa más común de una suite "inestable".',
    hint: '¿Este test podría correr solo, sin que ningún otro haya corrido antes?',
  },
  {
    code: 'El test espera 45 segundos fijos a que cargue una página, pase lo que pase.',
    rule: 2,
    why: 'Rompe Fast: una suite con esperas fijas y largas se corre cada vez menos seguido.',
    hint: '¿Por qué tarda eso exactamente — hace falta esperar tanto siempre?',
  },
  {
    code: 'El test imprime un resultado en la consola y una persona decide si pasó.',
    rule: 3,
    why: 'Rompe Self-validating: el test tiene que decidir solo si pasó o falló, sin que alguien lea un log.',
    hint: '¿Quién decide, al final, si este test pasó o falló?',
  },
  {
    code: 'El test corre en 2 segundos y da el mismo resultado en cualquier máquina.',
    rule: 0,
    why: 'Es Fast y Repeatable — exactamente lo que se busca.',
  },
];

export const WORTH_IT_RULE_LABELS = [
  'No amortiza el costo (se corre una sola vez)',
  'No hay un resultado exacto para comparar',
  'La feature todavía cambia mucho',
];

export const WORTH_IT_LINES: CodeLine[] = [
  {
    code: 'Un test que verifica el login, pensado para correr en cada deploy.',
    rule: 0,
    why: 'Se corre muchas veces y tiene un resultado exacto (loguea o no) — vale la pena.',
  },
  {
    code: 'Una migración de datos que se corre una única vez, para pasar al sistema nuevo.',
    rule: 1,
    why: 'No importa cuán bien funcione el test: se usa una sola vez y nunca amortiza el costo de escribirlo.',
    hint: '¿Cuántas veces se va a correr esto en total?',
  },
  {
    code: 'Verificar que el nuevo diseño de una pantalla "se vea prolijo".',
    rule: 2,
    why: '"Prolijo" no tiene un valor fijo contra el cual comparar — es criterio humano, no un assert.',
    hint: '¿Contra qué valor exacto compararías el resultado?',
  },
  {
    code: 'Probar una pantalla que el equipo de producto todavía cambia dos veces por semana.',
    rule: 3,
    why: 'Automatizarla ahora significa reescribir el test cada vez que cambie — a veces conviene cubrirla a mano primero.',
    hint: '¿Esta pantalla ya se estabilizó, o todavía está cambiando seguido?',
  },
  {
    code: 'Verificar que el total de una compra sea exactamente precio × cantidad.',
    rule: 0,
    why: 'Se corre seguido y tiene un resultado exacto — vale la pena.',
  },
];

export const LESSON_01_QUIZ: QuizQuestion[] = [
  {
    question: 'Un test falla una vez y pasa al reintentar, sin que nadie haya tocado el código. ¿Qué es?',
    options: [
      {text: 'Un bug nuevo en la aplicación.', correct: false, why: 'Un bug cambiaría el comportamiento de forma consistente, no intermitente.'},
      {text: 'Un test flaky — hay que investigar la causa, no ignorarlo.', correct: true, why: 'Un test flaky es peor que no tener test: entrena al equipo a ignorar el rojo.'},
      {text: 'Normal, no hace falta mirar nada.', correct: false, why: 'Ignorar esto es exactamente lo que entrena al equipo a no confiar en la suite.'},
    ],
  },
  {
    question: '¿Cuál describe mejor "Independent" en F.I.R.S.T.?',
    options: [
      {text: 'El test no depende del orden de ejecución ni del resultado de otro test.', correct: true, why: 'Exacto — y es la causa más común de una suite "inestable" cuando se rompe.'},
      {text: 'El test corre independientemente del sistema operativo.', correct: false, why: 'Eso sería portabilidad, no Independent.'},
      {text: 'El test no necesita ninguna configuración.', correct: false, why: 'Eso no es lo que mide Independent.'},
    ],
  },
  {
    question: 'Un compañero quiere automatizar: "¿se ve lindo el botón nuevo?" ¿Qué le sugerís?',
    options: [
      {text: 'Mejor explorarlo a mano o con revisión humana — no hay un valor exacto para comparar.', correct: true, why: 'Automatizar un criterio sin valor fijo termina en un assert demasiado laxo o demasiado estricto.'},
      {text: 'Automatizarlo con un assert bien relajado, para que no moleste.', correct: false, why: 'Un assert relajado deja de verificar nada real.'},
      {text: 'Automatizarlo comparando contra un screenshot exacto.', correct: false, why: 'Eso rompería por cualquier cambio mínimo (una fuente, un píxel) sin que el diseño realmente esté mal — un test flaky por diseño.'},
    ],
  },
];
