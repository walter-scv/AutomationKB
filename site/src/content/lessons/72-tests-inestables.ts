import type {BuilderStep} from '@site/src/components/CommandBuilder';
import type {MatchItem} from '@site/src/components/Match';
import type {DecisionNode} from '@site/src/components/DecisionPath';
import type {MultiSelectQuestion} from '@site/src/components/MultiSelect';

export const MEASURE_PREFIX = 'npx playwright test reservar ';
export const MEASURE_BUILD: BuilderStep[] = [
  {options: ['--retries=2 ', '--repeat-each=30 ', '--fail-on-flaky-tests '], correct: '--repeat-each=30 ', hint: 'Para saber qué tan seguido falla, el test tiene que correr muchas veces en la misma corrida.'},
  {options: ['--retries=0 ', '--retries=2 ', '--last-failed '], correct: '--retries=0 ', hint: '¿Qué opción puede convertir una falla en un resultado que no cuenta como falla?'},
  {options: ["--trace=retain-on-failure", "--trace=on-first-retry", "--headed"], correct: "--trace=retain-on-failure", hint: 'Para investigar, hace falta el trace del intento que falla.'},
];
export const MEASURE_EXPLANATION =
  '`npx playwright test reservar --repeat-each=30 --retries=0 --trace=retain-on-failure` corre el test 30 veces sin reintentos, así que la cantidad de fallas es la frecuencia real, y conserva el trace de cada intento que falló. En la agenda dio `2 failed, 28 passed`.';

export const CAUSE_LEFT: MatchItem[] = [
  {id: 'wait', text: 'El trace del intento que falló muestra que el test leyó el estado «Libre» un instante antes de que la tabla mostrara «Reservado».'},
  {id: 'data', text: 'Falla solo desde que la suite corre con 4 workers, y el error es strict mode: hay dos filas con el mismo paciente.'},
  {id: 'order', text: 'Pasa en la suite completa, pero falla siempre que se corre solo con su número de línea.'},
  {id: 'env', text: 'En la pestaña Network del trace, el pedido de horarios respondió 503 después de 30 segundos, y a la misma hora fallaron tests de otros archivos.'},
  {id: 'bug', text: 'El test hace un solo click en Reservar, y a veces la agenda muestra el turno duplicado. Desarrollo lo reproduce a mano con una conexión lenta.'},
];
export const CAUSE_RIGHT: MatchItem[] = [
  {id: 'bug', text: 'Defecto intermitente de la aplicación'},
  {id: 'env', text: 'El entorno de pruebas'},
  {id: 'wait', text: 'Una espera mal hecha'},
  {id: 'order', text: 'Dependencia del orden'},
  {id: 'data', text: 'Datos compartidos'},
];
export const CAUSE_WHY: Record<string, string> = {
  wait: 'El test leyó antes de que la página terminara de cambiar: hace falta una assertion web-first.',
  data: 'El choque aparece al correr en paralelo: dos tests tocan los mismos datos.',
  order: 'Solo pasa si otro test corrió antes y dejó algo preparado: no es independiente.',
  env: 'El servidor de pruebas no respondió, y no fue un solo test: es el entorno.',
  bug: 'La aplicación se comporta mal a veces, también fuera del test: es un defecto a reportar.',
};

export const TRIAGE_START = 'ci';
export const TRIAGE_NODES: Record<string, DecisionNode> = {
  ci: {
    id: 'ci',
    situation: 'El test de cancelar un turno aparece como flaky en 3 de las últimas 10 corridas de CI. Siempre pasa en el reintento. ¿Cuál es el primer paso?',
    options: [
      {text: 'Subir `retries` a 4, para que no vuelva a frenar a nadie.', correct: false, why: 'Ya pasa en el reintento: subirlos no cambia nada y la causa sigue sin conocerse.'},
      {text: 'Ponerlo en cuarentena sin investigarlo.', correct: false, why: 'La cuarentena es para mientras se investiga, no un reemplazo: primero hace falta la evidencia.'},
      {text: 'Abrir el trace del intento que falló, con `trace` en `retain-on-failure`.', correct: true, why: 'La evidencia está en el intento que falló; el que pasó no explica nada.', next: 'trace'},
    ],
  },
  trace: {
    id: 'trace',
    situation: 'En el trace del intento que falló, el test lee el estado con `textContent()` justo después del click, y la foto muestra «Cancelando…». Medio segundo después dice «Cancelado». ¿Qué corregís?',
    options: [
      {text: 'Reemplazar la lectura y el `expect` por `await expect(agendaPage.estado(\'09:30\')).toHaveText(\'Cancelado\')`.', correct: true, why: 'La assertion web-first reintenta hasta que aparece «Cancelado»: la causa era leer una sola vez.', next: 'measure'},
      {text: 'Agregar `waitForTimeout(1000)` antes de leer.', correct: false, why: 'Funciona hasta el día que el servidor tarde más de un segundo, y suma un segundo a cada corrida.'},
      {text: 'Subir el timeout del test a 60 segundos.', correct: false, why: 'El timeout no cambia nada: `textContent()` lee una sola vez, no espera.'},
    ],
  },
  measure: {
    id: 'measure',
    situation: 'Con la corrección, ¿cómo confirmás que el test dejó de ser inestable?',
    options: [
      {text: 'Corriéndolo una vez: si pasa, está resuelto.', correct: false, why: 'Antes también pasaba la mayoría de las veces: una corrida no distingue.'},
      {text: 'Corriéndolo con `--repeat-each=50 --retries=0` y comparando con la medición de antes.', correct: true, why: 'La misma medición, antes y después, muestra si la frecuencia de fallas bajó a cero.'},
      {text: 'Esperando una semana de corridas de CI.', correct: false, why: 'Sirve para confirmar, pero tarda una semana: la medición local responde en minutos.'},
    ],
  },
};
export const TRIAGE_EXPLANATION =
  'Evidencia del intento que falló, causa clasificada, corrección de la causa y la misma medición antes y después.';

export const RETRY_QUESTIONS: MultiSelectQuestion[] = [
  {
    prompt: 'Sobre los reintentos y los resultados flaky, ¿qué afirmaciones son correctas? Marcá todas las que correspondan.',
    options: [
      {text: 'Una corrida con 1 flaky y ninguna falla termina con código de salida 0, como una que pasó entera.', correct: true, why: 'Para CI, un flaky es verde: por eso puede pasar desapercibido.'},
      {text: 'Con `trace: \'on-first-retry\'`, se conserva el trace del intento que falló.', correct: false, why: 'Graba el reintento, que en un flaky es el que pasó: el intento que falló queda sin trace.'},
      {text: 'Subir `retries` reduce la cantidad de tests inestables.', correct: false, why: 'Reduce cuántas corridas quedan en rojo, no cuántos tests son inestables: los esconde.'},
      {text: '`--fail-on-flaky-tests` hace que una corrida con algún flaky termine como fallida.', correct: true, why: 'Los reintentos siguen mostrando cuál es, pero la corrida no pasa.'},
      {text: 'Mientras se investiga, el test puede ir en cuarentena: con un tag como @cuarentena, excluido con --grep-invert de las corridas que deciden, en la regresión nocturna y con un responsable y un plazo.', correct: true, why: 'Deja de frenar al equipo sin dejar de correr, y alguien se ocupa de cerrarlo.'},
      {text: 'Un test inestable puede estar mostrando un defecto real de la aplicación.', correct: true, why: 'Un defecto intermitente produce justamente un test que a veces falla: por eso no se borra sin investigar.'},
    ],
  },
];
