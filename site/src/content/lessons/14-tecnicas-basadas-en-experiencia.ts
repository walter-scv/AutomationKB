import type {CodeLine} from '@site/src/components/FindInCode';
import type {QuizQuestion} from '@site/src/components/Quiz';
import type {MatchItem} from '@site/src/components/Match';
import type {MultiSelectQuestion} from '@site/src/components/MultiSelect';

export const TECHNIQUE_MATCH_LEFT: MatchItem[] = [
  {id: 'guess', text: 'Antes de probar el nuevo carrito, la tester anota que en los dos sistemas anteriores la cantidad falló con 0 y con negativos, y arma casos solo para eso.'},
  {id: 'explore', text: 'Con 40 minutos y el objetivo de revisar el pago con cupones, el tester decide cada paso según lo que va apareciendo y anota los hallazgos.'},
  {id: 'checklist', text: 'Para cada pantalla nueva, el equipo revisa una lista de 10 condiciones de accesibilidad (contraste, foco visible, textos alternativos), sin casos detallados por ítem.'},
  {id: 'formal', text: 'La especificación dice "envío gratis desde 3 productos": el equipo prueba 2 y 3 productos, derivados de esa regla.'},
];
export const TECHNIQUE_MATCH_RIGHT: MatchItem[] = [
  {id: 'checklist', text: 'Testing basado en checklists'},
  {id: 'formal', text: 'Técnica formal (black-box), no basada en experiencia'},
  {id: 'explore', text: 'Testing exploratorio'},
  {id: 'guess', text: 'Error guessing'},
];
export const TECHNIQUE_MATCH_WHY: Record<string, string> = {
  guess: 'Los casos salen de defectos vistos antes en sistemas parecidos, no de la especificación: es anticipar dónde suele fallar.',
  explore: 'Hay objetivo y timebox, pero no pasos fijos: el diseño y la ejecución pasan al mismo tiempo y lo que aparece guía el próximo paso.',
  checklist: 'La lista marca qué condiciones revisar en alto nivel, sin datos ni resultados exactos por ítem.',
  formal: 'Los valores (2 y 3) se derivan de una regla escrita: es boundary value analysis, una técnica formal. No depende de la experiencia de nadie.',
};

export const USAGE_QUESTIONS: MultiSelectQuestion[] = [
  {
    prompt: '¿En cuáles de estas situaciones tiene sentido apoyarse en técnicas basadas en experiencia? Marcá todas las que correspondan.',
    options: [
      {
        text: 'Quedan dos horas para el release y no hay tiempo de diseñar casos formales para un cambio chico en el buscador.',
        correct: true,
        why: 'Falta de tiempo es justo cuando la experiencia rinde más por menos esfuerzo.',
      },
      {
        text: 'El sistema que calcula dosis de medicación se cubre solo con sesiones exploratorias de la tester más experimentada.',
        correct: false,
        why: 'En un sistema crítico, la experiencia de una sola persona tiene puntos ciegos: tiene que haber cobertura formal como respaldo.',
      },
      {
        text: 'Después de correr los casos formales de la especificación, el equipo suma una sesión exploratoria para buscar lo que no anticipó.',
        correct: true,
        why: 'Como complemento de la cobertura formal, encuentra lo que las técnicas sistemáticas no anticiparon.',
      },
      {
        text: 'La regla del descuento está especificada completa y sobra tiempo, pero el equipo descarta la especificación y prueba solo con error guessing.',
        correct: false,
        why: 'Con una especificación completa y tiempo, lo formal va primero: la experiencia complementa esa cobertura, no la reemplaza.',
      },
      {
        text: 'Una pantalla heredada no tiene documentación, y el tester conoce bien el dominio porque probó sistemas similares durante años.',
        correct: true,
        why: 'Sin documentación de la cual derivar casos, la experiencia en el dominio es la mejor guía disponible.',
      },
    ],
  },
];

export const CLOSING_QUIZ: QuizQuestion[] = [
  {
    question: '¿Por qué conviene documentar los hallazgos del testing exploratorio a medida que aparecen, en vez de esperar al final?',
    options: [
      {text: 'Para no perder trazabilidad de qué se probó y qué se encontró, porque no hay un caso escrito que lo registre.', correct: true, why: 'Sin un caso previo, el registro en el momento es la única forma de reconstruir la sesión. Al final es fácil olvidar lo primero.'},
      {text: 'Porque al final de la sesión alcanza con recordarlo de memoria para escribirlo completo.', correct: false, why: 'La memoria pierde detalle, sobre todo lo encontrado al principio. Sin registro previo, esa parte de la sesión se pierde.'},
      {text: 'Porque el testing exploratorio exige un script detallado antes de empezar.', correct: false, why: 'Exploratorio no usa un script detallado: justamente se adapta mientras prueba. Documentar los hallazgos no es lo mismo que escribir el script.'},
    ],
  },
];

export const PRACTICE_RULE_LABELS = [
  'Usa una checklist genérica, no basada en los defectos reales de este sistema',
  'Aplica a ciegas la experiencia de un sistema distinto, sin validarla acá',
  'Deja que lo exploratorio reemplace toda la planificación, sin objetivo ni timebox',
];

export const PRACTICE_LINES: CodeLine[] = [
  {
    code: 'La sesión de testing exploratorio tiene un objetivo concreto (el flujo de pago) y un timebox de 45 minutos.',
    rule: 0,
    why: 'Un objetivo y un límite de tiempo permiten comparar qué tan productiva fue la sesión y saber cuándo terminó. Es la forma correcta de encararla.',
    hint: '¿Esta sesión tiene objetivo y límite de tiempo?',
  },
  {
    code: 'Todo el plan de la release es «vamos explorando y vemos qué encontramos», sin objetivo ni timebox.',
    rule: 3,
    why: 'Sin objetivo ni timebox no hay forma de saber cuándo termina la sesión ni de comparar qué se cubrió. Se puede repetir lo mismo sin notarlo.',
    hint: '¿La sesión tiene un objetivo y un límite de tiempo, o no tiene marco?',
  },
  {
    code: 'Se prueban los mismos 3 bugs típicos de un e-commerce anterior en un sistema de facturación que no tiene nada que ver.',
    rule: 2,
    why: 'La experiencia de otro dominio sugiere sospechas, no garantiza que esos defectos existan acá. Hay que validarlas contra este sistema.',
    hint: '¿Ese historial de defectos viene de un sistema parecido a este?',
  },
  {
    code: 'La checklist de accesibilidad se armó con los 5 problemas que usuarios reales reportaron el último año en este sistema.',
    rule: 0,
    why: 'Una checklist basada en defectos reales de este sistema cubre sus puntos débiles específicos, no solo lo genérico. Es la forma correcta de armarla.',
    hint: '¿Esta checklist está basada en los defectos reales de este sistema?',
  },
  {
    code: 'Se usa una checklist genérica de buenas prácticas de UX bajada de internet, sin adaptarla al historial de este sistema.',
    rule: 1,
    why: 'Una lista genérica cubre lo obvio; los puntos débiles de este sistema están en su propio historial de defectos, que la lista no conoce.',
    hint: '¿Esta checklist se armó con los problemas reales de este sistema?',
  },
  {
    code: 'Se usa error guessing a partir de los incidentes de los últimos seis meses de este sistema, y después se confirman esos casos con pruebas formales.',
    rule: 0,
    why: 'Combina la experiencia con la verificación formal. La sospecha inicial viene de este sistema, y la confirmación no queda librada a la intuición.',
    hint: '¿La sospecha inicial se confirma con algo más, o queda solo en la intuición?',
  },
  {
    code: 'Se asume que los defectos del sistema de facturación van a ser los mismos que los del e-commerce anterior, sin revisar si aplican.',
    rule: 2,
    why: 'Aplicar a ciegas el historial de otro sistema puede hacer buscar defectos que no existen acá y dejar sin mirar los de este dominio.',
    hint: '¿Se confirmó que esos defectos tienen sentido en este dominio?',
  },
];
