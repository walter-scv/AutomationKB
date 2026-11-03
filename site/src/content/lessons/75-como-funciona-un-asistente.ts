import type {ClassifyItem} from '@site/src/components/Classify';
import type {QuizQuestion} from '@site/src/components/Quiz';
import type {MultiSelectQuestion} from '@site/src/components/MultiSelect';

export const KNOW_COLUMNS = ['Lo sabe por su entrenamiento', 'Lo sabe porque está en el contexto', 'No lo puede saber'];
export const KNOW_ITEMS: ClassifyItem[] = [
  {code: 'Cómo se escribe un locator por rol en Playwright.', column: 0, why: 'Es conocimiento general, muy presente en el texto con el que se entrenó.', hint: '¿Es algo propio de tu proyecto o algo general?'},
  {code: 'El error del test de reservar que pegaste hace dos mensajes.', column: 1, why: 'Lo tiene porque vos se lo pasaste en esta conversación.', hint: '¿Quién se lo dio?'},
  {code: 'Que en la reunión de ayer la clínica decidió pasar el límite de cancelación de 2 a 4 horas, algo que todavía nadie escribió.', column: 2, why: 'No está en su entrenamiento, nadie se lo dijo y no está escrito en ningún lado: no tiene cómo saberlo.', hint: '¿De dónde sacaría esa información?'},
  {code: 'La regla de que un paciente tiene como máximo 3 turnos futuros, escrita en el archivo de instrucciones que el agente lee al empezar la sesión.', column: 1, why: 'Está en un archivo de instrucciones que se carga al empezar la sesión.', hint: '¿Es una regla general o una de tu negocio, escrita en algún lado?'},
  {code: 'Un método agregado en una versión de Playwright publicada después de su fecha de corte.', column: 2, why: 'No estaba en su entrenamiento, y si no le pasás la documentación, no lo conoce.', hint: '¿Cuándo se publicó esa versión respecto de su entrenamiento?'},
  {code: 'El contenido de AgendaPage.ts, que el agente leyó con su herramienta de lectura.', column: 1, why: 'Al leer el archivo, su contenido entró al contexto.', hint: '¿Cómo llegó ese contenido a la conversación?'},
  {code: 'La sintaxis de una interface de TypeScript.', column: 0, why: 'Es conocimiento general del lenguaje.', hint: '¿Hace falta conocer tu proyecto para saberlo?'},
];

export const MODEL_QUIZ: QuizQuestion[] = [
  {
    question: 'Le pediste dos veces a un asistente, con el mismo texto, el test de cancelar un turno. La primera versión verifica el estado de la fila; la segunda, que aparezca un mensaje. ¿Qué indica?',
    options: [
      {text: 'Que el asistente tiene un defecto y conviene pasar a otra herramienta para este tipo de tests.', correct: false, why: 'Es el comportamiento normal de un modelo de lenguaje: con el mismo pedido puede producir respuestas distintas.'},
      {text: 'Que cada respuesta se verifica por separado, y que el pedido no dejó claro qué tenía que verificar el test.', correct: true, why: 'Las respuestas varían; un pedido que dice qué verificar reduce la variación, y la revisión es igual de necesaria.'},
      {text: 'Que la segunda respuesta es la correcta, porque el asistente corrigió lo que había respondido antes.', correct: false, why: 'El orden no dice nada sobre cuál es correcta.'},
    ],
  },
  {
    question: 'Un asistente de chat y un agente reciben el mismo pedido: arreglar el test de reprogramar. ¿Cuál es la diferencia?',
    options: [
      {text: 'El agente puede leer el test, correrlo y editarlo por su cuenta; el asistente de chat solo responde con texto que vos tenés que aplicar.', correct: true, why: 'El agente tiene herramientas y trabaja en un ciclo de actuar, mirar y decidir.'},
      {text: 'El agente usa un modelo distinto, que no alucina, y por eso sus cambios no hace falta revisarlos.', correct: false, why: 'El modelo es el mismo tipo de programa: las alucinaciones siguen siendo posibles.'},
      {text: 'El asistente de chat conoce mejor tu proyecto, porque guarda lo que le pegaste en conversaciones anteriores.', correct: false, why: 'Ninguno conoce tu proyecto más allá de lo que tiene en el contexto.'},
    ],
  },
];

export const CTX_QUESTIONS: MultiSelectQuestion[] = [
  {
    prompt: 'Llevás tres horas en la misma conversación con un agente: arreglaste tests de reservas, revisaste un Page Object de pacientes y armaste datos para la agenda. Las respuestas empiezan a mezclar nombres de pantallas. ¿Qué afirmaciones son correctas? Marcá todas las que correspondan.',
    options: [
      {text: 'La ventana de contexto está ocupada con información de tareas que ya terminaron.', correct: true, why: 'Todo lo de la conversación sigue en el contexto y compite con lo que importa ahora.'},
      {text: 'Empezar una conversación nueva, con un resumen de lo que importa, suele mejorar las respuestas.', correct: true, why: 'El contexto queda limpio y enfocado en la tarea actual.'},
      {text: 'Lo que le explicaste en la conversación va a estar disponible mañana en una sesión nueva.', correct: false, why: 'Cada conversación empieza vacía: lo que tiene que perdurar va en un archivo de instrucciones (unidad 2).'},
      {text: 'Cuantos más archivos lea el agente, mejores van a ser sus respuestas.', correct: false, why: 'Más contexto no siempre es mejor: lo que no hace falta ocupa lugar y diluye lo importante.'},
      {text: 'Cada archivo que leyó y cada comando que corrió sumó tokens a la conversación.', correct: true, why: 'Las lecturas y las salidas entran al contexto y tienen costo.'},
    ],
  },
];
