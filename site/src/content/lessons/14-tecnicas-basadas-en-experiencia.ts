import type {CodeLine} from '@site/src/components/FindInCode';
import type {QuizQuestion} from '@site/src/components/Quiz';

export const TECHNIQUE_QUIZ: QuizQuestion[] = [
  {
    question:
      'Quien testea entra a una pantalla de pago sin ningún caso escrito, y a medida que prueba una cosa decide qué probar a continuación según lo que va encontrando. ¿Qué técnica es esta?',
    options: [
      {text: 'Testing exploratorio: el diseño y la ejecución pasan al mismo tiempo, y lo que aparece guía el siguiente paso.', correct: true, why: 'Lo que se aprende mientras se prueba define la próxima acción, sin un script fijo definido antes de empezar.'},
      {text: 'Testing basado en checklists: hay una lista de condiciones generales que guía la sesión.', correct: false, why: 'Una checklist fija de antemano qué revisar. Acá no hay una lista previa: el rumbo se decide sobre la marcha con lo que aparece.'},
      {text: 'Error guessing: se anticipan defectos típicos de pantallas de pago antes de empezar.', correct: false, why: 'Error guessing parte de sospechas puntuales definidas antes de la sesión. Acá el siguiente paso depende de lo que se va encontrando.'},
    ],
  },
  {
    question:
      'Antes de probar el carrito, quien testea recuerda que en proyectos parecidos la cantidad 0 y los números negativos rompían el total, y arma casos para esos valores aunque la especificación no los mencione. ¿Qué técnica es esta?',
    options: [
      {text: 'Equivalence partitioning: se define una clase por cada valor posible de cantidad.', correct: false, why: 'No se están derivando clases de una regla: se anticipan valores puntuales a partir de defectos vistos en otros sistemas.'},
      {text: 'State transition: la cantidad cambia de estado a medida que se agregan productos.', correct: false, why: 'No hay un diagrama de estados detrás de esta decisión. Lo que guía es el historial de defectos, no una transición del sistema.'},
      {text: 'Error guessing: se parte de defectos ya vistos en sistemas parecidos, no de la especificación.', correct: true, why: 'La experiencia previa sugiere dónde mirar. Es una sospecha basada en patrones conocidos, no una técnica que derive casos de la regla.'},
    ],
  },
  {
    question:
      'Quien testea recorre una lista de 10 condiciones generales de accesibilidad sobre cada pantalla nueva, sin un caso detallado por condición. ¿Qué técnica es esta?',
    options: [
      {text: 'Testing basado en checklists: la lista marca qué cubrir, sin pasos detallados para cada ítem.', correct: true, why: 'La checklist define el alcance en alto nivel, pero no con qué datos ni qué resultado exacto esperar. Eso la distingue de un caso formal.'},
      {text: 'Testing exploratorio: no hay un caso detallado escrito de antemano.', correct: false, why: 'Acá las 10 condiciones ya están definidas antes de empezar. Lo exploratorio descubre el alcance mientras prueba, no lo recibe en una lista.'},
      {text: 'Decision table: cada condición de accesibilidad es una columna de la tabla.', correct: false, why: 'No se están combinando condiciones que interactúan. Se revisan una por una contra cada pantalla, sin cruzar resultados.'},
    ],
  },
];

export const USAGE_QUIZ: QuizQuestion[] = [
  {
    question:
      'Para un formulario chico, sin tiempo para documentar casos formales, quien testea usa su experiencia y prueba primero los valores que más seguido causan problemas en formularios parecidos. ¿Tiene sentido esta decisión?',
    options: [
      {text: 'No: primero hay que completar equivalence partitioning y boundary value analysis aunque no haya tiempo.', correct: false, why: 'Las técnicas formales no son obligatorias en todo escenario. Justamente la falta de tiempo es cuando las basadas en experiencia aportan más.'},
      {text: 'Sí: error guessing rinde cuando no hay tiempo para diseñar casos formales completos.', correct: true, why: 'Es el escenario donde la experiencia aporta más por menos esfuerzo. No reemplaza a las técnicas formales, pero sí sirve para empezar.'},
      {text: 'No: error guessing solo se usa cuando ya existe una checklist formal del sistema.', correct: false, why: 'Error guessing no depende de una checklist. Se apoya en el historial de defectos y en la experiencia de quien testea.'},
    ],
  },
  {
    question:
      'Un sistema de control de tráfico aéreo se testea únicamente con testing exploratorio, sin ningún caso formal. ¿Tiene sentido?',
    options: [
      {text: 'Sí: con suficiente experiencia en el dominio se cubren todos los casos importantes.', correct: false, why: 'La experiencia individual no garantiza cobertura completa. Siempre queda algo que esa persona no pensó en explorar.'},
      {text: 'Sí, siempre que la sesión tenga un timebox definido.', correct: false, why: 'El timebox ordena la sesión, pero no reemplaza la cobertura sistemática. Un límite de tiempo no hace aparecer los casos que nadie buscó.'},
      {text: 'No: en un sistema crítico conviene combinarlo con técnicas formales para no depender de una sola persona.', correct: true, why: 'Por más experiencia que tenga alguien, depender solo de su criterio deja puntos ciegos. En sistemas críticos las técnicas formales son el respaldo.'},
    ],
  },
  {
    question:
      'Una checklist de testing dice «verificar campos obligatorios», sin especificar cuáles ni con qué datos. ¿Qué tipo de técnica es?',
    options: [
      {text: 'Un caso formal de equivalence partitioning, solo que resumido.', correct: false, why: 'Un caso formal de EP definiría particiones y valores concretos. Una condición general sin datos no es un caso resumido: es otra cosa.'},
      {text: 'Testing basado en checklists: marca qué revisar, sin detallar datos ni resultados.', correct: true, why: 'La lista da el alcance general y deja los detalles a criterio de quien ejecuta. No confirma un resultado esperado por sí sola.'},
      {text: 'Testing exploratorio, porque no dice exactamente qué probar.', correct: false, why: 'Lo exploratorio no parte de una lista previa: va descubriendo el alcance. Acá hay un ítem ya definido, aunque sea general.'},
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
