import type {CodeLine} from '@site/src/components/FindInCode';
import type {QuizQuestion} from '@site/src/components/Quiz';
import type {DecisionNode} from '@site/src/components/DecisionPath';

export const CLASSIFY_RULE_LABELS = [
  'No es ninguna: no compara contra la especificación ni contra usuarios reales',
  'Es Validación, no Verificación',
];

export const CLASSIFY_LINES: CodeLine[] = [
  {
    code: 'Confirmar que el formulario de alta pide exactamente los campos que lista el documento de requisitos.',
    rule: 0,
    why: 'Compara el sistema contra un documento escrito. Esa es la pregunta de la verificación: ¿estamos construyendo lo que la especificación pide?',
    hint: '¿Esto compara contra un documento, o contra usuarios reales?',
  },
  {
    code: 'Un grupo de usuarios reales intenta completar el alta sin ayuda y dos abandonan porque no entienden el formato de teléfono, aunque el formulario cumple la especificación.',
    rule: 2,
    why: 'El sistema cumple el documento, pero no resuelve la necesidad real: los usuarios se traban. Esa brecha entre la especificación y el uso es lo que detecta la validación.',
    hint: '¿El problema aparece al comparar contra un documento, o al mirar a alguien que intenta usar el sistema?',
  },
  {
    code: 'Un analista usa el alta para crear su propio usuario y después sigue con su trabajo.',
    rule: 1,
    why: 'Está usando el sistema para una tarea real, no evaluándolo. No hay comparación contra una especificación ni observación de usuarios representativos, así que no es verificación ni validación.',
    hint: '¿Se está comparando el resultado contra una especificación o contra el uso de personas reales?',
  },
  {
    code: 'Mostrar el panel de reportes a cinco analistas reales y observar si pueden armar el reporte mensual sin explicaciones.',
    rule: 2,
    why: 'La evidencia viene de usuarios reales intentando una tarea concreta, no de un documento. Eso responde si el producto sirve, que es la pregunta de la validación.',
    hint: '¿La evidencia que se usa viene de un documento o de usuarios reales haciendo una tarea?',
  },
  {
    code: 'Revisar que el mensaje de error del alta diga exactamente el texto que especifica el documento de diseño.',
    rule: 0,
    why: 'El documento de diseño es la referencia contra la que se compara. No importa si el mensaje resulta claro para un usuario: la pregunta acá es si coincide con la especificación.',
    hint: '¿Importa acá si el mensaje es claro para un usuario, o si coincide con el documento?',
  },
  {
    code: 'El equipo repite el recorrido de alta que hizo ayer, sin documento ni usuarios, solo para confirmar que "sigue andando".',
    rule: 1,
    why: 'No hay una especificación contra la cual comparar ni usuarios reales observados. La memoria de cómo anduvo ayer no es evidencia de verificación ni de validación.',
    hint: '¿Qué evidencia queda de esta repetición: un documento, usuarios observados, o solo el recuerdo de ayer?',
  },
  {
    code: 'El tester ejecuta los casos derivados del criterio de aceptación y compara cada resultado con lo que pide el documento.',
    rule: 0,
    why: 'Los casos salen del documento y cada resultado se contrasta contra él. Es verificación: se evalúa si el sistema cumple lo acordado, sin consultar a usuarios finales.',
    hint: '¿Esta comparación involucra usuarios reales, o solo el documento?',
  },
  {
    code: 'El equipo revisa que el panel muestre las columnas exactas que pide el documento de requisitos.',
    rule: 0,
    why: 'La comparación es contra el documento, columna por columna. Que un analista después pueda usarlo es otra pregunta, que esta revisión no responde.',
    hint: '¿Esto confirma que el panel sirve a un analista, o que coincide con el documento?',
  },
];

export const PLAN_START = 'encarar';
export const PLAN_NODES: Record<string, DecisionNode> = {
  encarar: {
    id: 'encarar',
    situation: 'El nuevo panel de reportes para analistas está listo para testear, con su documento de requisitos. ¿Cómo encara el equipo las dos preguntas?',
    options: [
      {
        text: 'Revisarlo contra el documento; si pasa todos los casos derivados de ahí, también les va a servir a los analistas.',
        correct: false,
        why: 'Eso asume que verificado implica validado. Son preguntas independientes: el panel puede cumplir el documento y no servirle a nadie.',
      },
      {
        text: 'Saltear la revisión contra el documento: si a los analistas les sirve, ya está.',
        correct: false,
        why: 'Saltea la verificación: nadie confirma que el panel cumple lo acordado con el negocio, aunque a alguien le resulte útil.',
      },
      {
        text: 'Revisarlo contra el documento y, por separado, probarlo con analistas.',
        correct: true,
        why: 'Cada pregunta se responde por su lado: la verificación contra el documento y la validación con quienes lo van a usar.',
        next: 'quien',
      },
    ],
  },
  quien: {
    id: 'quien',
    situation: 'Para la validación, ¿a quién le piden que use el panel?',
    options: [
      {
        text: 'A la persona que escribió el documento de requisitos, que sabe exactamente qué se pidió.',
        correct: false,
        why: 'Esa persona solo puede confirmar que el panel coincide con lo que ella imaginó, no detectar que la idea estaba equivocada.',
      },
      {
        text: 'A analistas reales que no participaron en la definición, con una tarea concreta, y registrando con quiénes se hizo.',
        correct: true,
        why: 'Usuarios reales, ajenos a la especificación, con una tarea concreta y registrada: así la validación no es una charla informal con alguien ya convencido.',
        next: 'cuando',
      },
      {
        text: 'Al equipo de QA, que conoce todos los casos de test del panel.',
        correct: false,
        why: 'QA conoce los casos derivados del documento: eso es verificación. Validar es confirmar la necesidad real de quien lo usa.',
      },
    ],
  },
  cuando: {
    id: 'cuando',
    situation: 'Quedan tres semanas de desarrollo. ¿Cuándo hacen la validación con los analistas?',
    options: [
      {
        text: 'Una vez que el panel esté en producción, cuando lo usen de verdad.',
        correct: false,
        why: 'Validar al final obliga a rehacer trabajo que ya se dio por terminado si la especificación no capturaba la necesidad real.',
      },
      {
        text: 'Desde ahora y a medida que el panel toma forma, en varias rondas cortas.',
        correct: true,
        why: 'Validar en paralelo con el desarrollo hace que un malentendido aparezca cuando todavía es barato corregirlo.',
      },
      {
        text: 'Al terminar las tres semanas, en una única sesión larga con todos los analistas.',
        correct: false,
        why: 'Sigue siendo validar una sola vez y al final: lo que se descubra ahí llega cuando ya no queda tiempo para corregir sin rehacer.',
      },
    ],
  },
};
export const PLAN_EXPLANATION =
  'Verificar y validar son dos preguntas distintas que se hacen en paralelo: contra el documento, por un lado, y con usuarios reales que no escribieron la especificación, por el otro, desde temprano y en varias rondas.';

export const CLOSING_QUIZ: QuizQuestion[] = [
  {
    question:
      'Un sistema cumple exactamente los requisitos documentados, pero los usuarios reales se confunden al usarlo. ¿Qué pasó?',
    options: [
      {
        text: 'Es imposible: si cumple los requisitos documentados, tiene que servirle al usuario.',
        correct: false,
        why: 'Los requisitos pueden estar incompletos o describir algo distinto de lo que el usuario necesita. Cumplirlos al pie de la letra no garantiza que el resultado sea útil.',
      },
      {
        text: 'Está verificado pero no validado: la especificación no capturó bien la necesidad real.',
        correct: true,
        why: 'Cumplir el documento responde una pregunta y usar bien el producto responde otra. Puede estar verificado y, aun así, no servirle al usuario porque la especificación estaba incompleta o mal pensada.',
      },
      {
        text: 'No está ni verificado ni validado: si los usuarios se confunden, algo del documento no se cumplió.',
        correct: false,
        why: 'La confusión del usuario no implica que el documento se haya incumplido. Puede cumplirse perfectamente y aun así no resolver la necesidad real.',
      },
    ],
  },

];
