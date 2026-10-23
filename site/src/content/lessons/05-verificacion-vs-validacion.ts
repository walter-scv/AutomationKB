import type {CodeLine} from '@site/src/components/FindInCode';
import type {QuizQuestion} from '@site/src/components/Quiz';

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

export const PRACTICE_RULE_LABELS = [
  'Valida solo con quien escribió la especificación',
  'Deja la validación para el final',
  'Asume que verificado implica validado',
  'Saltea la verificación',
];

export const PRACTICE_LINES: CodeLine[] = [
  {
    code: 'El equipo nunca compara el panel contra el documento de requisitos; confía en que "si a los usuarios les sirve, ya está".',
    rule: 4,
    why: 'Que el producto le sirva a un usuario no reemplaza comprobar si cumple lo acordado con el negocio. Sin esa comparación, nadie sabe si faltó implementar algo que el documento pedía.',
    hint: '¿En algún momento se comparó el panel contra el documento que define lo que debe hacer?',
  },
  {
    code: 'El equipo revisa el panel contra el documento de requisitos y, por separado, lo prueba con cinco analistas reales.',
    rule: 0,
    why: 'Responde las dos preguntas con la evidencia que corresponde a cada una: el documento para la verificación, los usuarios reales para la validación. Ninguna se usa como atajo de la otra.',
    hint: '¿Se usó la misma evidencia para las dos preguntas, o cada una con la suya?',
  },
  {
    code: 'Para validar el panel, el equipo se lo muestra solo a la persona que escribió el documento de requisitos, que confirma que coincide con lo que pidió.',
    rule: 1,
    why: 'Esa persona está confirmando que el sistema coincide con su propia idea, que es casi lo mismo que ya decía el documento. No representa al usuario que va a usar el panel todos los días.',
    hint: '¿La persona que opina es quien va a usar el producto, o quien escribió la especificación?',
  },
  {
    code: 'El equipo documenta con qué analistas validó y qué tarea concreta les pidió.',
    rule: 0,
    why: 'Deja registro de la evidencia de validación: quiénes son los usuarios y qué hicieron. Así se puede distinguir una prueba real de una conversación informal con alguien que ya estaba de acuerdo.',
    hint: '¿Queda registro de quién validó y qué hizo?',
  },
  {
    code: 'El equipo concluye que, como el panel pasó todos los casos derivados del documento, seguro les va a servir a los analistas.',
    rule: 3,
    why: 'Pasar los casos documentados solo confirma que se cumple la especificación. Si la especificación no capturó bien la necesidad, el panel puede estar verificado y aun así no servir para el trabajo real.',
    hint: '¿Haber cumplido el documento dice algo sobre cómo lo va a usar un analista real?',
  },
  {
    code: 'El equipo deja la primera sesión con usuarios reales para la semana posterior al lanzamiento, cuando ya esté en producción.',
    rule: 2,
    why: 'Si la especificación no capturó la necesidad real, descubrirlo después de lanzar obliga a rehacer trabajo que ya estaba en manos de los usuarios. La validación tiene que acompañar el desarrollo, no llegar al final.',
    hint: '¿Qué margen queda para cambiar el producto si el problema se descubre después de lanzarlo?',
  },
  {
    code: 'El equipo valida el panel con analistas que no participaron en la definición del requisito.',
    rule: 0,
    why: 'Esos analistas representan a quien va a usar el producto, no a quien lo imaginó. Su experiencia es la evidencia que la validación necesita.',
    hint: '¿Estos analistas representan al usuario real, o a quien escribió el requisito?',
  },
  {
    code: 'El tester compara el resultado de cada caso con el criterio de aceptación documentado, antes de mostrarlo a usuarios.',
    rule: 0,
    why: 'Primero responde la pregunta de la verificación contra el documento. Después vendrá la validación con usuarios, que es una pregunta distinta y no se deduce de esta.',
    hint: '¿Esta comparación es contra el documento, o contra usuarios?',
  },
];

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
  {
    question: '¿Con quién se valida un producto?',
    options: [
      {
        text: 'Con usuarios reales o representantes del negocio que no escribieron la especificación.',
        correct: true,
        why: 'La validación mide si el producto sirve en la práctica. Para eso hace falta alguien que lo use para su tarea, no alguien que confirme su propia idea original.',
      },
      {
        text: 'Con la persona que escribió el documento de requisitos, para confirmar que el sistema lo cumple.',
        correct: false,
        why: 'Esa persona solo puede confirmar que el sistema coincide con lo que ella imaginó. Esa comparación se parece más a la verificación que a la validación.',
      },
      {
        text: 'Con el equipo de QA, que es quien conoce todos los casos de test del sistema.',
        correct: false,
        why: 'QA puede verificar contra el documento, pero no representa al usuario final. Conocer los casos de test no dice si el producto resuelve la necesidad de quien lo va a usar.',
      },
    ],
  },
];
