import type {MatchItem} from '@site/src/components/Match';
import type {BuilderStep} from '@site/src/components/CommandBuilder';
import type {DecisionNode} from '@site/src/components/DecisionPath';

export const PART_LEFT: MatchItem[] = [
  {id: 'goal', text: 'Necesito un test que verifique que no se pueden reservar dos turnos a la misma hora para el mismo profesional.'},
  {id: 'ctx', text: 'La regla de la clínica: un profesional atiende un paciente por horario. El Page Object de la agenda está en pages/AgendaPage.ts.'},
  {id: 'limit', text: 'No modifiques AgendaPage.ts sin preguntarme, y no uses waitForTimeout.'},
  {id: 'format', text: 'Respondé con el test completo y, aparte, la lista de datos que la fixture tiene que sembrar.'},
  {id: 'done', text: 'Está terminado cuando el test pasa, y falla si se quita la validación del lado de la aplicación.'},
];
export const PART_RIGHT: MatchItem[] = [
  {id: 'format', text: 'Formato de la respuesta'},
  {id: 'goal', text: 'Objetivo'},
  {id: 'done', text: 'Criterio de terminado'},
  {id: 'limit', text: 'Restricciones'},
  {id: 'ctx', text: 'Contexto'},
];
export const PART_WHY: Record<string, string> = {
  goal: 'Dice qué hay que lograr, en una oración concreta.',
  ctx: 'Da lo que el asistente no sabe: la regla de negocio y dónde está el código.',
  limit: 'Marca lo que no puede hacer.',
  format: 'Dice qué se espera recibir y cómo.',
  done: 'Define cómo se comprueba que la tarea está hecha, incluida la prueba de que puede fallar.',
};

export const PROMPT_PREFIX = '';
export const PROMPT_STEPS: BuilderStep[] = [
  {options: ['Fallan algunos tests de turnos en CI desde la última versión de la agenda. ', 'El test «cancelar un turno lo libera» falla en CI desde ayer. ', 'El test de cancelar falla a veces, en CI o en local, no estoy seguro. '], correct: 'El test «cancelar un turno lo libera» falla en CI desde ayer. ', hint: '¿Cuál dice exactamente qué test y desde cuándo?'},
  {options: ['Adjunto AgendaPage.ts y el spec completo de la agenda, para que veas todo el código. ', 'Adjunto el error-context.md; un turno cancelado vuelve a «Libre». ', 'Adjunto una captura de la agenda de hoy, sin el error; cancelar libera el turno. '], correct: 'Adjunto el error-context.md; un turno cancelado vuelve a «Libre». ', hint: '¿Cuál le da la evidencia del fallo y la regla de negocio?'},
  {options: ['No cambies las assertions; si la aplicación está mal, decímelo. ', 'Ajustá lo que haga falta en el test para que vuelva a pasar en CI. ', 'Si hace falta, actualizá el valor esperado con lo que muestra la agenda. '], correct: 'No cambies las assertions; si la aplicación está mal, decímelo. ', hint: '¿Cuál evita que el test pase escondiendo un defecto?'},
  {options: ['Explicame en detalle cómo funciona la cancelación de turnos en la agenda.', 'Corregí el test directamente y avisame cuando esté listo para revisar.', 'Respondé con la causa y la evidencia; si proponés un cambio, como diff.'], correct: 'Respondé con la causa y la evidencia; si proponés un cambio, como diff.', hint: '¿Cuál dice qué formato de respuesta esperás?'},
];
export const PROMPT_EXPLANATION =
  'Test y momento concretos, evidencia y regla de negocio, una restricción que protege las assertions y un formato de respuesta: el asistente tiene todo para diagnosticar en lugar de adivinar.';

export const ITER_START = 'plan';
export const ITER_NODES: Record<string, DecisionNode> = {
  plan: {
    id: 'plan',
    situation: 'Querés que un agente automatice los 6 casos de prueba diseñados para la pantalla de pacientes. ¿Cómo empezás?',
    options: [
      {text: 'Pedirle un plan con los casos, los Page Objects y los datos, y esperar tu confirmación antes del código.', correct: true, why: 'Revisar un plan corto es más rápido que revisar mucho código hecho sobre una idea equivocada.', next: 'fix'},
      {text: 'Pedirle los 6 tests completos de una vez, para revisarlos todos juntos al final y ahorrar idas y vueltas.', correct: false, why: 'Si la idea de base está mal, hay que descartar mucho código.'},
      {text: 'Pedirle que decida qué casos conviene automatizar, ya que conoce bien Playwright.', correct: false, why: 'Los casos ya están diseñados, y decidir qué probar es tarea de una persona.'},
    ],
  },
  fix: {
    id: 'fix',
    situation: 'En la lista de pacientes hay un botón «Ver» por fila, uno por paciente. El test que escribió el agente para abrir la ficha de un paciente usa `getByRole(\'button\', { name: \'Ver\' }).first()`, que toma siempre el primero de la lista, sea quien sea. ¿Qué corrección le escribís?',
    options: [
      {text: '«Así no, hacelo de nuevo, pensando mejor cómo encontrar el botón de cada paciente.»', correct: false, why: 'No le dice qué está mal ni qué se espera.'},
      {text: '«Mejoralo un poco más, para que quede más robusto y no dependa de la posición.»', correct: false, why: 'Es igual de vago: no nombra el problema.'},
      {text: '«No uses .first(): hay un botón Ver por fila; buscá la fila por el DNI y dentro el botón.»', correct: true, why: 'Nombra el problema, el porqué y la forma esperada.', next: 'long'},
    ],
  },
  long: {
    id: 'long',
    situation: 'Después de quince correcciones, la conversación está llena de intentos fallidos y el agente repite errores que ya corregiste. ¿Qué hacés?',
    options: [
      {text: 'Seguir corrigiendo en la misma conversación, porque ya tiene todo el historial y eso le sirve para no repetir.', correct: false, why: 'El historial lleno de intentos fallidos es justamente lo que confunde las respuestas.'},
      {text: 'Empezar una conversación nueva con un pedido que resuma lo aprendido.', correct: true, why: 'El contexto queda limpio, con lo importante al principio.', next: 'verify'},
      {text: 'Cambiar de herramienta de IA.', correct: false, why: 'El problema es el contexto, no la herramienta.'},
    ],
  },
  verify: {
    id: 'verify',
    situation: 'El agente responde: «Listo, el test ya funciona». ¿Qué le pedís?',
    options: [
      {text: 'Nada más: si dice que funciona, se puede integrar.', correct: false, why: 'Una afirmación sin evidencia no es una verificación.'},
      {text: 'Que lo explique con más detalle, paso por paso, para entender bien lo que hizo.', correct: false, why: 'Una explicación tampoco prueba que el test corra ni que pueda fallar.'},
      {text: 'La salida real de la corrida, y que cambie el valor esperado para confirmar que falla.', correct: true, why: 'La salida es evidencia, y el cambio a propósito prueba que el test puede detectar un defecto.'},
    ],
  },
};
export const ITER_EXPLANATION =
  'Plan antes del código, correcciones con el porqué, conversación nueva cuando la actual se ensucia y la salida real como prueba de que está hecho.';
