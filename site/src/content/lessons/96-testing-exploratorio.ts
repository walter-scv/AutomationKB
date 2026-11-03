import type {QuizQuestion} from '@site/src/components/Quiz';
import type {DecisionNode} from '@site/src/components/DecisionPath';
import type {MatchItem} from '@site/src/components/Match';
import type {MultiSelectQuestion} from '@site/src/components/MultiSelect';

export const GATE_START = 'docs';
export const GATE_NODES: Record<string, DecisionNode> = {
  docs: {
    id: 'docs',
    situation: 'Un Pull Request de la agenda solo cambia el README y un archivo de tests. ¿Qué pasa con la exploración?',
    options: [
      {text: 'El filtro grueso de CI la descarta: esos archivos no cambian lo que ve un usuario.', correct: true, why: 'El filtro por rutas descarta solo lo que nunca puede cambiar el comportamiento visible.', next: 'deps'},
      {text: 'Corre igual, porque cualquier cambio en el repositorio puede afectar la aplicación y conviene explorar todo.', correct: false, why: 'Documentación y tests no cambian la aplicación: explorar costaría media hora sin sentido.'},
      {text: 'Corre, pero solo sobre la pantalla que mencionan los tests modificados.', correct: false, why: 'Los tests no son la aplicación: no hay cambio visible que explorar.'},
    ],
  },
  deps: {
    id: 'deps',
    situation: 'Otro Pull Request solo actualiza la versión de la librería de calendarios en package.json. ¿Qué hace el filtro grueso?',
    options: [
      {text: 'Lo descarta, porque no cambia ningún archivo de código de la aplicación.', correct: false, why: 'Una dependencia sí puede cambiar el comportamiento: el filtro grueso no la descarta.'},
      {text: 'Lo deja pasar; la tarea decide adentro, leyendo el diff.', correct: true, why: 'El juicio fino es del agente: el filtro de CI solo descarta lo que nunca puede cambiar el comportamiento.', next: 'flag'},
      {text: 'Lo manda directo a una persona, porque las dependencias son demasiado riesgosas para un agente.', correct: false, why: 'Explorar el calendario después de actualizar su librería es justo para lo que sirve.'},
    ],
  },
  flag: {
    id: 'flag',
    situation: 'Un tercer Pull Request agrega la reserva de sobreturnos, detrás de un flag que está apagado en todos los entornos. El agente lee el diff. ¿Qué reporta?',
    options: [
      {text: 'Que encontró un defecto, porque la funcionalidad del Pull Request no aparece en la agenda.', correct: false, why: 'No aparece porque el flag está apagado: no es un defecto.'},
      {text: 'Nada: termina sin comentario para no hacer ruido en el Pull Request.', correct: false, why: 'Siempre deja un reporte; si no explora, dice por qué.'},
      {text: 'SKIPPED, con el motivo: la funcionalidad está detrás de un flag apagado y no tiene superficie visible.', correct: true, why: 'La tarea se auto-evalúa y deja el motivo, para que una persona decida si explora a mano.'},
    ],
  },
};
export const GATE_EXPLANATION =
  'El filtro grueso de CI descarta solo lo que nunca cambia lo visible; el juicio fino, con el diff, lo hace el agente, y si no explora, deja SKIPPED con su motivo.';

export const REPORT_LEFT: MatchItem[] = [
  {id: 'ok', text: 'El reporte dice que los 5 escenarios de reprogramación pasaron, sin hallazgos.'},
  {id: 'bug', text: 'El reporte dice que reprogramar a un horario ocupado lo acepta, con una captura.'},
  {id: 'doc', text: 'El reporte dice que la agenda permite cancelar hasta 1 hora antes, y el caso de uso dice 2 horas.'},
  {id: 'skip', text: 'El reporte dice SKIPPED: «refactor sin cambio visible», pero el Pull Request cambió el texto de un botón.'},
];
export const REPORT_RIGHT: MatchItem[] = [
  {id: 'doc', text: 'Decidir con quien define el producto cuál tiene razón, y corregir el caso de uso o reportar el defecto'},
  {id: 'skip', text: 'Explorar vos el cambio del botón, que el agente salteó por error'},
  {id: 'ok', text: 'Mirar las capturas por arriba: es confianza extra, no una aprobación'},
  {id: 'bug', text: 'Reproducirlo vos y, si se confirma, reportarlo con el formato del equipo'},
];
export const REPORT_WHY: Record<string, string> = {
  ok: 'Sin hallazgos no es una aprobación: es señal extra.',
  bug: 'Un hallazgo es una pista: se reproduce antes de reportarlo.',
  doc: 'Aplicación y documentación no coinciden: alguien tiene que decidir cuál está bien.',
  skip: 'El gate se equivoca hacia saltear a propósito; si el cambio sí es visible, lo explora una persona.',
};

export const EXPLORE_QUESTIONS: MultiSelectQuestion[] = [
  {
    prompt: 'El equipo de turnos va a sumar exploración disparada por Pull Request. ¿Qué reglas corresponden? Marcá todas las que correspondan.',
    options: [
      {text: 'Levantar un entorno propio y descartable para cada exploración.', correct: true, why: 'Nunca el compartido: el agente crea datos y actúa.'},
      {text: 'Explorar en staging, solo leyendo, para no gastar en otro entorno.', correct: false, why: 'Aunque sea solo lectura, el compartido queda fuera: el agente necesita preparar datos.'},
      {text: 'Correr una vez por Pull Request, no en cada push.', correct: true, why: 'Cada exploración es una corrida completa de agente: repetirla en cada push multiplica el costo.'},
      {text: 'Elegir escenarios que la suite automatizada no cubre.', correct: true, why: 'Lo cubierto ya tiene tests: la exploración agrega valor en lo que falta.'},
      {text: 'Crear el ticket en Jira apenas el agente encuentra un defecto.', correct: false, why: 'Un hallazgo es una pista: primero lo reproduce una persona.'},
      {text: 'Bloquear el merge si la exploración encuentra algo.', correct: false, why: 'Es señal extra, no un gate: el hallazgo se reproduce y se decide.'},
    ],
  },
  {
    prompt: 'Vas a usar la exploración a pedido sobre el ticket de reprogramación de turnos. ¿Qué tiene que hacer el agente? Marcá todas las que correspondan.',
    options: [
      {text: 'Traer del ticket solo el resumen, el estado y la prioridad.', correct: true, why: 'El resto del ticket llena el contexto sin aportar a la exploración.'},
      {text: 'Traer el ticket completo, con comentarios y adjuntos, para tener todo el contexto.', correct: false, why: 'Más contexto no es mejor: se piden solo los campos necesarios.'},
      {text: 'Revisar los defectos ya reportados, para no duplicarlos.', correct: true, why: 'Un hallazgo que ya está reportado no se vuelve a crear.'},
      {text: 'Recorrer el flujo principal, los alternativos y los de error del caso de uso.', correct: true, why: 'Los flujos alternativos y de error son donde más defectos aparecen.'},
      {text: 'Crear los tickets de los hallazgos sin preguntar, para ahorrar tiempo.', correct: false, why: 'Muestra cada hallazgo con su evidencia y espera tu aprobación antes de reportarlo.'},
    ],
  },
];

export const READY_QUIZ: QuizQuestion[] = [
  {
    question: 'El equipo tiene la suite de la agenda, el servidor MCP de Playwright y cuentas de prueba, pero ningún caso de uso. Un agente explora la cancelación y reporta «sin hallazgos». ¿Qué vale ese reporte?',
    options: [
      {text: 'Que la cancelación cumple las reglas, porque el agente recorrió todos los flujos.', correct: false, why: 'Sin casos de uso, no sabe qué flujos hay ni qué reglas tienen que cumplirse.'},
      {text: 'Poco: sin reglas escritas, el agente toma como correcto lo que muestra la agenda.', correct: true, why: 'Si la agenda deja cancelar 1 hora antes y la regla es 2, el agente no tiene cómo saberlo.'},
      {text: 'Lo mismo que el de una persona, porque usa el mismo navegador y la misma cuenta.', correct: false, why: 'La persona conoce las reglas del negocio; el agente solo sabe lo que está escrito.'},
    ],
  },
  {
    question: 'El agente no encuentra el diálogo de reprogramar: en la agenda del entorno no hay turnos reservados. ¿Qué faltaba?',
    options: [
      {text: 'El mapa de navegación y una forma de crear el turno sin pasar por la interfaz.', correct: true, why: 'La transición del mapa dice que el diálogo requiere un turno reservado; la herramienta de datos lo crea.'},
      {text: 'Un modelo con más contexto, que busque mejor en la aplicación.', correct: false, why: 'El diálogo no existe sin un turno reservado: no es un problema de búsqueda.'},
      {text: 'Una ruta propia para el diálogo, para que el agente navegue directo.', correct: false, why: 'Cambiar la aplicación no es la solución: hay que documentar cómo se llega y preparar el dato.'},
    ],
  },
  {
    question: 'El equipo quiere exploración automática en cada Pull Request y todavía no probó la exploración a pedido. ¿Qué conviene?',
    options: [
      {text: 'Empezar por la automática, porque es la que ahorra más tiempo del equipo.', correct: false, why: 'Sin una base probada, cada Pull Request paga una corrida cara con un reporte poco confiable.'},
      {text: 'Hacer las dos a la vez, para comparar sus reportes desde el primer día.', correct: false, why: 'La automática necesita el entorno por Pull Request y el agente en CI: se suma después.'},
      {text: 'Empezar a pedido, completar la documentación y después sumar la automática.', correct: true, why: 'A pedido se ve cada paso del agente y aparece rápido lo que le falta a la documentación.'},
    ],
  },
];
