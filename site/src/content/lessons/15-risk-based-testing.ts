import type {MatchItem} from '@site/src/components/Match';
import type {CodeLine} from '@site/src/components/FindInCode';
import type {QuizQuestion} from '@site/src/components/Quiz';
import type {MultiSelectQuestion} from '@site/src/components/MultiSelect';
import type {OrderItem, OrderRule} from '@site/src/components/Order';

export const RISK_RULE_LABELS = ['Baja probabilidad de fallar o cambiar (ya muy estable)', 'Bajo impacto si falla'];

export const RISK_LINES: CodeLine[] = [
  {
    code: 'El checkout de una compra: si falla, se pierden ventas en el momento.',
    rule: 0,
    why: 'Alto impacto: un fallo acá cuesta ventas reales y afecta a cualquiera que quiera comprar. Es prioridad alta.',
    hint: '¿Cuánta gente depende de esto, y qué tan seguido cambia?',
  },
  {
    code: 'Un texto de ayuda secundario que casi nadie abre.',
    rule: 2,
    why: 'Bajo impacto: si falla, casi nadie lo nota ni depende de él para completar una tarea. No es donde conviene invertir primero.',
    hint: '¿Cuánta gente depende de que esto funcione?',
  },
  {
    code: 'El registro de usuarios nuevos, único punto de entrada a la app.',
    rule: 0,
    why: 'Es el único camino de entrada: si falla, ningún usuario nuevo puede empezar a usar la app. Impacto alto, prioridad alta.',
    hint: '¿Qué pasa si este único punto de entrada falla?',
  },
  {
    code: 'Una validación de código postal que lleva 2 años sin tocarse ni fallar.',
    rule: 1,
    why: 'Baja probabilidad: dos años sin cambios ni fallas es evidencia de estabilidad. Rinde menos ponerlo primero que algo que cambia seguido.',
    hint: '¿Qué tan seguido cambió o falló esto en los últimos años?',
  },
  {
    code: 'El cambio de tema claro/oscuro, que no bloquea ninguna tarea.',
    rule: 2,
    why: 'Bajo impacto: aunque falle, nadie deja de poder usar la app por el color de la interfaz. Puede esperar.',
    hint: '¿Qué tan grave sería para el negocio si esto falla?',
  },
  {
    code: 'El cálculo del total del carrito, que cambió tres veces este trimestre y se usa en cada compra.',
    rule: 0,
    why: 'Alto impacto y alta probabilidad: se usa en cada compra y cambió varias veces este trimestre. Combina las dos dimensiones que elevan el riesgo.',
    hint: '¿Esto es estable, o cambia seguido y se usa mucho?',
  },
  {
    code: 'La exportación a CSV de un reporte estable: no cambió desde 2021 y no falló en cuatro años.',
    rule: 1,
    why: 'Baja probabilidad: no cambia y no falla desde hace años, así que el riesgo de que se rompa hoy es bajo. Es la dimensión de probabilidad, no la de impacto.',
    hint: '¿Cuánto cambió o falló esto desde 2021?',
  },
];

export const PRIORITY_ORDER_ITEMS: OrderItem[] = [
  {id: 'deprioritize', what: 'Paso', code: 'Dejar el cambio de tema para una pasada exploratoria liviana.'},
  {id: 'impact', what: 'Paso', code: 'Anotar qué partes de la release causarían más daño si fallan: checkout, registro y tema visual.'},
  {id: 'prioritize', what: 'Paso', code: 'Ordenar primero lo que combina alto impacto con alta probabilidad de fallar.'},
  {id: 'probability', what: 'Paso', code: 'Estimar para cada una qué tan probable es que falle o que siga cambiando.'},
];

export const PRIORITY_ORDER_CORRECT = ['impact', 'probability', 'prioritize', 'deprioritize'];

export const PRIORITY_ORDER_RULES: OrderRule[] = [
  {before: 'impact', after: 'probability', why: 'el impacto se estima primero porque si es nulo la probabilidad deja de importar: no tiene sentido calcular el riesgo de algo que no duele si falla.'},
  {before: 'probability', after: 'prioritize', why: 'no se puede ordenar por riesgo sin haber estimado antes impacto y probabilidad de cada parte.'},
  {before: 'prioritize', after: 'deprioritize', why: 'decidir qué va primero es lo que permite decidir, por descarte, qué queda para después.'},
];

export const COVERAGE_QUESTIONS: MultiSelectQuestion[] = [
  {
    prompt: 'Release de una app de turnos médicos con tiempo limitado. ¿Qué partes tienen que quedar cubiertas con casos detallados? Marcá todas las que correspondan.',
    options: [
      {
        text: 'El selector de color del avatar del perfil.',
        correct: false,
        why: 'Bajo impacto: si falla, nadie pierde un turno ni dinero. Ponerlo antes que lo crítico invierte la prioridad.',
      },
      {
        text: 'La reserva del turno, que es lo único para lo que la mayoría abre la app.',
        correct: true,
        why: 'Impacto alto: si falla, la app deja de servir. Un área crítica no puede quedar sin casos.',
      },
      {
        text: 'El recordatorio por SMS 24 horas antes, que este mes cambió de proveedor.',
        correct: true,
        why: 'Impacto alto (un paciente que falta) y probabilidad alta (acaba de cambiar): es justo la combinación que va primero.',
      },
      {
        text: 'La pantalla de historial, que diseño rediseña cada semana y todavía no tiene versión final.',
        correct: false,
        why: 'Cambia demasiado: un caso detallado se reescribiría cada semana. Conviene una pasada exploratoria hasta que se estabilice.',
      },
      {
        text: 'El pago de la consulta online.',
        correct: true,
        why: 'Si falla, hay dinero en juego y turnos que no se confirman: impacto alto.',
      },
      {
        text: 'La página de preguntas frecuentes, que no cambió en dos años.',
        correct: false,
        why: 'Bajo impacto y muy estable: puede esperar o revisarse con una pasada liviana.',
      },
    ],
  },
];

export const CLOSING_QUIZ: QuizQuestion[] = [
  {
    question: '¿Cómo se calcula, en términos simples, el riesgo de una parte del sistema?',
    options: [
      {text: 'Cuánto tiempo llevaría escribir el caso de test.', correct: false, why: 'Eso es costo de armar el caso, no riesgo de la feature. Una feature puede ser fácil de testear y aun así ser crítica si falla.'},
      {text: 'La cantidad de usuarios que pidieron la feature en el último mes.', correct: false, why: 'Cuántos la piden puede dar una pista de uso, pero no dice cuánto cuesta que falle ni qué tan probable es que falle.'},
      {text: 'Impacto si falla por probabilidad de que falle o siga cambiando.', correct: true, why: 'Las dos dimensiones juntas. Ni el impacto solo ni la probabilidad sola alcanzan para decidir qué cubrir primero.'},
    ],
  },
];

export const PRACTICE_RULE_LABELS = [
  'Calcula el impacto sin involucrar a nadie de negocio',
  'Prioriza según la opinión más ruidosa, no según datos reales',
  'Trata bajo riesgo como «no hace falta testear nunca»',
];

export const PRACTICE_LINES: CodeLine[] = [
  {
    code: 'El equipo estima el impacto del proceso de cobro con Finanzas, y la probabilidad de falla con el equipo técnico.',
    rule: 0,
    why: 'Impacto de negocio y probabilidad técnica son dos estimaciones distintas, y cada una rinde mejor con quien tiene el contexto real para juzgarla.',
    hint: '¿Cada estimación la hace quien tiene el contexto real para juzgarla?',
  },
  {
    code: 'Se prioriza el rediseño del ícono de perfil porque el gerente insistió mucho en la reunión, aunque nadie midió su impacto.',
    rule: 2,
    why: 'La insistencia en una reunión no mide impacto ni probabilidad: es priorizar por ruido, no por riesgo real.',
    hint: '¿La decisión se basó en datos de impacto, o en quién habló más fuerte?',
  },
  {
    code: 'El dashboard interno es de bajo riesgo, así que el equipo decide no volver a mirarlo nunca, ni siquiera cuando se agreguen métricas nuevas.',
    rule: 3,
    why: 'Bajo riesgo significa menor prioridad hoy, no cero cobertura para siempre. Las métricas nuevas pueden cambiar el riesgo real.',
    hint: '¿Bajo riesgo significa nunca más, o no es lo primero pero se revisa si cambia algo?',
  },
  {
    code: 'Se usa una escala de alto/medio/bajo para impacto y probabilidad, en vez de buscar un número exacto de riesgo.',
    rule: 0,
    why: 'Lo que importa es el orden relativo entre features, no un valor exacto. Un número preciso da una falsa sensación de exactitud.',
    hint: '¿Importa acá el orden relativo, o un número exacto?',
  },
  {
    code: 'El equipo técnico decide solo, sin consultar a nadie de negocio, que el proceso de cobro es de bajo impacto.',
    rule: 1,
    why: 'El equipo técnico estima bien la probabilidad de falla, pero el costo de negocio lo conoce mejor quien trabaja con ese impacto.',
    hint: '¿Quién conoce el costo real de negocio de que falle el cobro?',
  },
  {
    code: 'La priorización se revisa cuando una feature de bajo riesgo empieza a usarse todos los días.',
    rule: 0,
    why: 'El riesgo no es fijo: una feature que cambia de uso merece una nueva estimación. Revisar la priorización es parte del criterio.',
    hint: '¿El riesgo de esta feature es fijo, o puede cambiar con el uso?',
  },
  {
    code: 'La exportación de reportes era de bajo riesgo, empezó a usarse a diario y nadie volvió a revisar su priorización.',
    rule: 3,
    why: 'El riesgo cambió con el uso: una feature que era de bajo riesgo y pasa a usarse a diario merece otra revisión, y nadie la hizo.',
    hint: '¿El uso de esta feature cambió desde la última priorización?',
  },
];

export const RESPONSE_LEFT: MatchItem[] = [
  {id: 'mitigate', text: 'La fórmula de la nota final de los cursos cambió este mes, y un error terminaría en certificados con notas equivocadas.'},
  {id: 'accept', text: 'En el modo oscuro del reproductor, los subtítulos tienen poco contraste; no hay reclamos y el arreglo exige rediseñar el reproductor.'},
  {id: 'transfer', text: 'Los pagos de inscripción los procesa una pasarela externa, con un contrato que fija su disponibilidad y su responsabilidad.'},
  {id: 'contingency', text: 'El cambio del servidor de videos a otro proveedor está programado para la noche anterior al inicio de clases.'},
  {id: 'project', text: 'La única persona que conoce el módulo de certificados se va de licencia justo en la semana de pruebas.'},
  {id: 'monitor', text: 'A mitad del ciclo se decide que el foro, hasta ahora de baja prioridad, también se use para entregar exámenes.'},
];
export const RESPONSE_RIGHT: MatchItem[] = [
  {id: 'project', text: 'Es un riesgo de proyecto: se gestiona en la planificación (traspaso de conocimiento, otra persona), no con más casos de prueba.'},
  {id: 'monitor', text: 'Volver a evaluar su impacto y cambiar su lugar en el registro de riesgos.'},
  {id: 'mitigate', text: 'Mitigar: casos detallados sobre el cálculo, con valores límite, y revisión de la fórmula con la coordinación académica.'},
  {id: 'contingency', text: 'Preparar un plan de contingencia: si los videos no cargan, volver esa misma noche al servidor anterior.'},
  {id: 'transfer', text: 'Transferirlo: la responsabilidad del procesamiento queda en el proveedor según el contrato; se prueba la integración, no la pasarela.'},
  {id: 'accept', text: 'Aceptarlo de forma consciente y dejarlo registrado como riesgo residual.'},
];
export const RESPONSE_WHY: Record<string, string> = {
  mitigate: 'Impacto alto y una probabilidad que subió con el cambio: la respuesta es reducir el riesgo con testing más profundo y una revisión.',
  accept: 'Impacto bajo y un costo alto de corregirlo: se acepta, pero de forma explícita, para que figure en el informe de cierre.',
  transfer: 'Parte del riesgo ya está cubierta por un tercero con un contrato; lo que queda del lado propio es la integración.',
  contingency: 'No se puede reducir mucho la probabilidad de que algo salga mal esa noche, pero sí preparar cómo volver atrás si ocurre.',
  project: 'No es un problema de calidad del software sino de la gestión: afecta el plazo y la capacidad del equipo.',
  monitor: 'El análisis de riesgos no se hace una sola vez: si cambia el uso de una funcionalidad, cambia su impacto.',
};
