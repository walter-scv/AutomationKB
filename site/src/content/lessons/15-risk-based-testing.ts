import type {CodeLine} from '@site/src/components/FindInCode';
import type {QuizQuestion} from '@site/src/components/Quiz';
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

export const TROUBLESHOOT_RULE_LABELS = [
  'Un área crítica quedó sin ningún caso',
  'Se armó un caso detallado para una feature que todavía cambiaba demasiado',
  'Se priorizó algo de bajo impacto antes que lo crítico',
];

export const TROUBLESHOOT_LINES: CodeLine[] = [
  {
    code: 'El equipo priorizó registro y checkout, y dejó el cambio de tema para una pasada exploratoria liviana.',
    rule: 0,
    why: 'Pone primero lo de alto impacto y resuelve lo cosmético con menos esfuerzo. Es el criterio de riesgo aplicado correctamente.',
    hint: '¿Esto sigue el criterio de impacto y probabilidad?',
  },
  {
    code: 'El caso de test de una pantalla se reescribió cinco veces en un sprint porque diseño la seguía cambiando.',
    rule: 2,
    why: 'Se invirtió en documentar detalle una feature que todavía cambiaba: cada reescritura fue costo sin cobertura estable.',
    hint: '¿Esta feature ya se había estabilizado cuando se escribió el caso detallado?',
  },
  {
    code: 'Se escribieron casos detallados para el texto de ayuda, pero el checkout quedó sin ningún caso y un bug tardó dos semanas en notarse.',
    rule: 1,
    why: 'El checkout no tenía ningún caso que lo cubriera: esa falta de cobertura en un área crítica es el problema, y el bug tardó en aparecer justamente porque nadie la estaba mirando.',
    hint: '¿Dónde habría aparecido el bug si alguien hubiera estado ejercitando esa parte?',
  },
  {
    code: 'El equipo priorizó cubrir primero el cambio de tema claro/oscuro, antes que el flujo de registro, que quedó para el final del sprint.',
    rule: 3,
    why: 'Invirtió el orden: puso primero algo cosmético y dejó para el final el registro, que si falla bloquea la entrada de usuarios nuevos.',
    hint: '¿Cuál de las dos cosas tiene más impacto si falla?',
  },
  {
    code: 'La exportación cambió tres veces este mes, así que se cubrió con una sesión exploratoria y el caso formal quedó para cuando se estabilice.',
    rule: 0,
    why: 'Reconoce que documentar en detalle algo que todavía cambia es esfuerzo desperdiciado. Primero explora y documenta cuando se estabiliza.',
    hint: '¿Documentar en detalle algo que todavía cambia es un buen uso del esfuerzo?',
  },
  {
    code: 'El checkout tiene casos detallados y se ejecutan en cada release; el texto de ayuda se revisa con una pasada exploratoria.',
    rule: 0,
    why: 'Asigna el detalle a lo crítico y lo liviano a lo de bajo impacto. La profundidad del testing sigue al riesgo.',
    hint: '¿El detalle del testing sigue al riesgo acá?',
  },
  {
    code: 'Nadie armó casos para el registro porque «es una pantalla simple», y en producción un usuario nuevo no pudo crear su cuenta.',
    rule: 1,
    why: 'Se asumió que una pantalla simple no necesitaba casos, pero es el único punto de entrada: al fallar, nadie nuevo pudo registrarse.',
    hint: '¿Se evaluó el riesgo real de esa pantalla o se asumió por su tamaño?',
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
