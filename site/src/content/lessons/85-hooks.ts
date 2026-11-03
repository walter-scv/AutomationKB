import type {MatchItem} from '@site/src/components/Match';
import type {OrderItem, OrderRule} from '@site/src/components/Order';
import type {QuizQuestion} from '@site/src/components/Quiz';
import type {SpotTokenRound} from '@site/src/components/SpotToken';

export const EVENT_LEFT: MatchItem[] = [
  {id: 'pre', text: 'Impedir que el agente corra los tests contra producción, revisando el comando antes de ejecutarlo.'},
  {id: 'post', text: 'Correr el linter sobre cada archivo de pages/ que el agente acaba de editar.'},
  {id: 'prompt', text: 'Frenar un pedido que contiene una contraseña antes de que llegue al agente.'},
  {id: 'session', text: 'Agregar al contexto, al empezar, la rama actual y los tests que fallaron en la última corrida.'},
  {id: 'stop', text: 'Mandar una notificación cuando el agente termina de responder.'},
];
export const EVENT_RIGHT: MatchItem[] = [
  {id: 'stop', text: '`Stop`'},
  {id: 'session', text: '`SessionStart`'},
  {id: 'pre', text: '`PreToolUse`'},
  {id: 'prompt', text: '`UserPromptSubmit`'},
  {id: 'post', text: '`PostToolUse`'},
];
export const EVENT_WHY: Record<string, string> = {
  pre: 'Corre antes de la herramienta y puede bloquearla.',
  post: 'Corre después de que la herramienta terminó bien: el archivo ya está escrito.',
  prompt: 'Corre al enviar el pedido, antes de que el agente lo procese.',
  session: 'Corre al empezar o retomar la sesión, y su salida puede sumarse al contexto.',
  stop: 'Corre cuando el agente termina de responder.',
};

export const HOOK_ITEMS: OrderItem[] = [
  {id: 'exit2', what: 'Paso', code: 'Salir con código 2.'},
  {id: 'read', what: 'Paso', code: 'Leer el JSON del evento desde la entrada estándar.'},
  {id: 'ok', what: 'Paso', code: 'Si la dirección es de staging o de local, salir con código 0.'},
  {id: 'extract', what: 'Paso', code: 'Tomar tool_input.command, el comando que el agente quiere correr.'},
  {id: 'stderr', what: 'Paso', code: 'Escribir en la salida de errores: «Usá BASE_URL de staging; producción no se prueba».'},
  {id: 'find', what: 'Paso', code: 'Buscar en el comando el valor de BASE_URL.'},
];
export const HOOK_CORRECT = ['read', 'extract', 'find', 'ok', 'stderr', 'exit2'];
export const HOOK_RULES: OrderRule[] = [
  {before: 'read', after: 'extract', why: 'El comando está dentro del JSON que llega por la entrada estándar.'},
  {before: 'extract', after: 'find', why: 'Se busca la dirección dentro del comando.'},
  {before: 'find', after: 'ok', why: 'Con la dirección encontrada, se decide si se permite.'},
  {before: 'ok', after: 'stderr', why: 'Solo se llega al bloqueo si la dirección no es de un entorno de prueba.'},
  {before: 'stderr', after: 'exit2', why: 'El motivo se escribe antes de salir: es lo que el agente recibe para corregir.'},
];

export const HOOK_QUIZ: QuizQuestion[] = [
  {
    question: 'El hook que solo permite las cuentas de prueba no encuentra .env.test en este proyecto y deja pasar todas las acciones. ¿Cómo se describe esa decisión?',
    options: [
      {text: 'Es un defecto del hook: ante cualquier duda tendría que bloquear la acción.', correct: false, why: 'Es una de las dos opciones válidas; bloquear siempre frenaría todos los proyectos sin ese archivo.'},
      {text: 'Falla abierto: sin el archivo, elige no frenar el trabajo, a costa de no proteger.', correct: true, why: 'Es una decisión de diseño que hay que tomar a conciencia y dejar escrita en el hook.'},
      {text: 'Falla cerrado, porque no encontró lo que necesitaba para decidir si bloquear.', correct: false, why: 'Fallar cerrado sería bloquear; este deja pasar.'},
    ],
  },
  {
    question: 'Un hook PreToolUse sale con código 1 al encontrar un comando prohibido, en lugar de 2. ¿Qué pasa con el comando?',
    options: [
      {text: 'En la mayoría de los eventos, el comando se ejecuta: ese código es un error del hook, no un bloqueo.', correct: true, why: 'Para bloquear, el hook tiene que salir con 2 y explicar el motivo en la salida de errores.'},
      {text: 'Se bloquea, como con cualquier código distinto de 0, y el agente recibe el mensaje.', correct: false, why: 'Solo el código 2 bloquea la acción.'},
      {text: 'Claude Code se detiene y te pregunta qué hacer con ese comando antes de seguir.', correct: false, why: 'Lo trata como un error del hook y la acción sigue.'},
    ],
  },
  {
    question: 'Otro equipo te pasa un hook PreToolUse que «mejora la seguridad», configurado con matcher "*". ¿Qué hacés antes de activarlo?',
    options: [
      {text: 'Activarlo, porque viene de otro equipo de la empresa que ya lo usa en su proyecto.', correct: false, why: 'Un hook es código que corre en tu computadora, con tus permisos, en cada acción del agente.'},
      {text: 'Activarlo solo en el modo plan, donde el agente no edita archivos ni corre comandos.', correct: false, why: 'El hook corre igual en cada herramienta que coincida con el matcher.'},
      {text: 'Leer el script entero: qué hace, si falla abierto o cerrado y cuánto tarda.', correct: true, why: 'Se revisa como cualquier código que va a correr en cada acción.'},
    ],
  },
];

export const HOOKBUG_PROMPT = '¿Qué parte de esta línea hace que el hook no cumpla su objetivo?';
export const HOOKBUG_ROUNDS: SpotTokenRound[] = [
  {
    line: '"PostToolUse": [ // hook que tiene que impedir que los tests corran contra producción',
    targetIndex: 0,
    why: '`PostToolUse` corre después de que la herramienta terminó: el comando ya se ejecutó. Para impedirlo hace falta `PreToolUse`.',
    hint: '¿En qué momento corre este evento respecto del comando?',
  },
  {
    line: 'exit 1 # en el hook, cuando detecta que BASE_URL apunta a producción',
    targetIndex: 1,
    why: 'Solo el código 2 bloquea la acción; con 1, en la mayoría de los eventos el comando sigue.',
    hint: '¿Qué código de salida bloquea?',
  },
  {
    line: '"matcher": "Write", // el hook tiene que revisar cada archivo que el agente edita o escribe',
    targetIndex: 1,
    why: 'Con `Write` solo, las ediciones de archivos existentes no pasan por el hook: hace falta `Edit|Write`.',
    hint: '¿Qué herramientas cubre ese matcher?',
  },
];
