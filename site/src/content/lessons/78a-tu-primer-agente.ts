import type {TerminalStep} from '@site/src/components/Terminal';
import type {MatchItem} from '@site/src/components/Match';
import type {DecisionNode} from '@site/src/components/DecisionPath';

export const START_STEPS: TerminalStep[] = [
  {
    instruction: 'Instalaste Claude Code y abriste una terminal nueva. Comprobá que quedó instalado, mostrando su versión.',
    accepted: ['claude --version', 'claude -v'],
    hint: 'Es el comando del agente, claude, con la opción que muestra la versión.',
    output: '2.1.308 (Claude Code)',
  },
  {
    instruction: 'Primer día ordenado, paso 1: estás en la carpeta agenda-e2e. Comprobá el estado del repositorio.',
    accepted: ['git status'],
    hint: 'El paso 1 del primer día ordenado usa el comando que lista todos los cambios pendientes, incluidos los archivos nuevos.',
    output: 'On branch main\nnothing to commit, working tree clean',
  },
  {
    instruction: 'Primer día ordenado, paso 2: creá la rama propia agente/cancelacion para la tarea.',
    accepted: ['git switch -c agente/cancelacion', 'git checkout -b agente/cancelacion'],
    hint: 'Es git switch con la opción -c y el nombre de la rama.',
    output: "Switched to a new branch 'agente/cancelacion'",
  },
];
export const START_EXPLANATION =
  'Versión comprobada, repositorio sin cambios pendientes y una rama propia: lo que haga el agente se ve entero con git diff y se descarta con un comando.';

export const CMD_LEFT: MatchItem[] = [
  {id: 'clear', text: 'Terminaste de arreglar el test de cancelar y vas a empezar con los Page Objects de pacientes.'},
  {id: 'compact', text: 'Llevás una hora con la misma tarea, la conversación es larga y querés seguir sin perder el hilo.'},
  {id: 'context', text: 'Las respuestas empezaron a perder detalle y querés ver cuánto contexto está ocupado.'},
  {id: 'usage', text: 'Querés saber cuánto del límite de tu plan consumió esta sesión.'},
  {id: 'rewind', text: 'El agente editó dos archivos que no querías tocar y querés volverlos a como estaban antes de tu último pedido.'},
  {id: 'model', text: 'Vas a pedir tareas mecánicas y simples, y querés un modelo más chico y barato.'},
];
export const CMD_RIGHT: MatchItem[] = [
  {id: 'usage', text: '`/usage`'},
  {id: 'rewind', text: '`/rewind`'},
  {id: 'clear', text: '`/clear`'},
  {id: 'model', text: '`/model`'},
  {id: 'context', text: '`/context`'},
  {id: 'compact', text: '`/compact`'},
];
export const CMD_WHY: Record<string, string> = {
  clear: 'Una tarea nueva empieza con el contexto vacío.',
  compact: 'Resume la conversación y libera contexto en la misma tarea.',
  context: 'Muestra qué ocupa el contexto.',
  usage: 'Muestra el costo de la sesión y los límites del plan.',
  rewind: 'Vuelve los archivos al momento de un pedido anterior.',
  model: 'Cambia el modelo de la sesión.',
};

export const APPROVE_START = 'run';
export const APPROVE_NODES: Record<string, DecisionNode> = {
  run: {
    id: 'run',
    situation: 'El agente pide correr npx playwright test tests/agenda/cancelar.spec.ts. Lo vas a pedir muchas veces hoy. ¿Qué elegís?',
    options: [
      {text: 'No, porque correr tests siempre lo tiene que hacer una persona.', correct: false, why: 'Correr los tests es lo que el agente necesita para verificar lo que escribe.'},
      {text: 'Yes, and don\'t ask again: es un comando que entendés y solo corre la suite.', correct: true, why: 'Guarda una regla para comandos que empiezan así, y no modifica nada fuera de la suite.', next: 'env'},
      {text: 'Pasar a un modo que no pregunte nada, para no ver más avisos hoy.', correct: false, why: 'Dejaría pasar también lo que sí querés revisar, como editar o borrar archivos.'},
    ],
  },
  env: {
    id: 'env',
    situation: 'Para entender por qué falla el ingreso, el agente pide correr cat .env. ¿Qué hacés?',
    options: [
      {text: 'Yes: necesita ver la configuración para encontrar el problema.', correct: false, why: 'El contenido de .env, con contraseñas, viajaría al proveedor del modelo.'},
      {text: 'Yes, and don\'t ask again, porque es un comando que solo lee.', correct: false, why: 'Que solo lea no lo hace seguro: lo que lee entra al contexto y sale de tu computadora.'},
      {text: 'No, y con Tab le explicás que mire .env.example y los nombres de las variables.', correct: true, why: 'Puede razonar con los nombres de las variables sin ver los valores secretos.', next: 'undo'},
    ],
  },
  undo: {
    id: 'undo',
    situation: 'El agente reescribió AgendaPage.ts de una forma que no querés, y además regeneró un archivo con un script de la terminal. ¿Cómo volvés atrás?',
    options: [
      {text: 'Con /rewind lo que editó el agente, y con Git lo que generó el script.', correct: true, why: '/rewind vuelve las ediciones del agente; lo que cambió un comando se revisa y se descarta con Git.'},
      {text: 'Con /rewind, que vuelve todo lo que pasó en la sesión, incluidos los comandos.', correct: false, why: 'Lo que cambió un comando de la terminal no siempre queda registrado para /rewind.'},
      {text: 'Con /clear, que borra la conversación y los cambios que hizo el agente.', correct: false, why: '/clear vacía el contexto; los archivos quedan como están.'},
    ],
  },
};
export const APPROVE_EXPLANATION =
  'Se aprueba lo que se entiende, se rechaza lo que expone secretos, y para deshacer se combinan /rewind y Git.';
