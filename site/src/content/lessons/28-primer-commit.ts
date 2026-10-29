import type {CodeLine} from '@site/src/components/FindInCode';
import type {QuizQuestion} from '@site/src/components/Quiz';
import type {TerminalStep} from '@site/src/components/Terminal';

export const FIRST_COMMIT_STEPS: TerminalStep[] = [
  {
    instruction: 'Estás en la carpeta tienda/, con registro.ts y un debug.log que generó tu editor. Convertí la carpeta en un repositorio.',
    accepted: ['git init'],
    hint: 'Es el comando que se ejecuta una sola vez por proyecto, para empezar a llevar historial.',
    output: 'Initialized empty Git repository in /home/vos/tienda/.git/',
  },
  {
    instruction: 'Mirá qué archivos hay y en qué estado están, sin cambiar nada.',
    accepted: ['git status'],
    hint: 'Es el comando que solo informa: qué cambió, qué está en staging y qué no.',
    output: 'On branch main\nNo commits yet\nUntracked files:\n  debug.log\n  registro.ts',
  },
  {
    instruction: 'Pasá al staging area solo el archivo del cambio: el log es local y no tiene que entrar al historial.',
    accepted: ['git add registro.ts'],
    hint: 'Nombrá el archivo exacto: con `git add .` también entraría el debug.log.',
    output: 'Changes to be committed:\n  new file:   registro.ts\nUntracked files:\n  debug.log',
  },
  {
    instruction: 'Confirmá lo que está en staging con un mensaje que describa el cambio.',
    accepted: ['git commit -m *'],
    hint: 'Es `git commit -m` seguido del mensaje entre comillas.',
    output: '[main (root-commit) 3f2a1c9] (tu mensaje)\n 1 file changed, 24 insertions(+)\n create mode 100644 registro.ts',
  },
];
export const FIRST_COMMIT_EXPLANATION =
  '`git init` crea el repositorio, `git status` muestra qué hay sin tocar nada, `git add` con el nombre del archivo elige exactamente qué entra, y `git commit -m` lo guarda en el historial. El `debug.log` quedó sin seguimiento, como tenía que ser.';

export const COMMIT_MESSAGE_RULE_LABELS = [
  'Se agregó sin revisar qué se estaba incluyendo',
  'Mezcla cambios sin relación en un mismo commit',
  'Se confirma código que no compila o con tests en rojo',
  'El mensaje no describe qué cambió',
];

export const COMMIT_MESSAGE_LINES: CodeLine[] = [
  {
    code: 'git commit -m "Agregar validación de longitud de contraseña"',
    rule: 0,
    why: 'Dice qué se agregó y dónde; alguien que lea el historial entiende el cambio sin abrir el diff.',
    hint: '¿Este mensaje permite entender el cambio sin abrir el diff?',
  },
  {
    code: 'Se confirman juntos el arreglo del bug de login y la actualización del README, con el mensaje "Arreglar login y actualizar README".',
    rule: 2,
    why: 'El README no tiene relación con el bug. Si hay que revertir solo el arreglo, se va también la actualización, y el commit mezcla dos unidades de trabajo distintas.',
    hint: '¿Qué pasaría si hubiera que revertir solo el arreglo de login?',
  },
  {
    code: 'git commit -m "listo para revisar"',
    rule: 4,
    why: 'No dice qué cambió: "listo" puede ser cualquier cosa. Quien mire el historial va a tener que abrir el diff para saber qué se hizo.',
    hint: '¿Qué cambió, según este mensaje?',
  },
  {
    code: 'git commit -m "Corregir formato de email en el registro de usuarios"',
    rule: 0,
    why: 'Describe el cambio y el lugar. No hace falta que sea más largo: con esto se entiende qué se tocó.',
    hint: '¿Hace falta abrir el diff para saber qué cambió, según este mensaje?',
  },
  {
    code: 'Se corre `git add .` desde la raíz y el commit incluye también `coverage/` y `debug.log`, que nadie revisó.',
    rule: 1,
    why: '`git add .` agrega todo lo que encontró, no lo que querías. Sin `git status` previo, esos archivos entran al historial sin que nadie los haya elegido.',
    hint: '¿Se revisó qué archivos estaban entrando antes de confirmar?',
  },
  {
    code: 'Se confirma el cambio aunque `npm test` muestra dos tests en rojo, porque "se arreglan en el próximo commit".',
    rule: 3,
    why: 'Un commit con tests en rojo rompe la garantía de que cualquier punto del historial es seguro. Conviene corregir antes de confirmar, o al menos no presentarlo como un estado válido.',
    hint: '¿Qué pasa si alguien vuelve a este commit para investigar un bug y los tests ya fallaban?',
  },
  {
    code: 'git commit -m "cambios de la reunión"',
    rule: 4,
    why: 'Dice cuándo se hizo, no qué cambió. "La reunión" no describe el contenido del commit, así que el mensaje no ayuda a entender el historial.',
    hint: '¿El mensaje describe el cambio o solo el contexto en el que se hizo?',
  },
  {
    code: 'Antes de confirmar, se corre `git status` y se verifica que en staging esté solo `validarContraseña.ts`.',
    rule: 0,
    why: 'Revisar el staging antes del commit es lo que evita que entren archivos que no correspondían. Acá la verificación se hizo.',
    hint: '¿Se revisó qué iba a entrar en el commit antes de confirmar?',
  },
];

export const CLOSING_QUIZ: QuizQuestion[] = [
  {
    question: 'Corrés `git init` en una carpeta que ya tenía archivos viejos, sin relación con el proyecto. ¿Qué pasa con esos archivos?',
    options: [
      {text: 'Se borran para que el repositorio arranque limpio.', correct: false, why: '`git init` no toca el contenido de la carpeta. Si se borraran, no podrías recuperarlos desde Git porque todavía no estaban versionados.'},
      {text: 'Se confirman automáticamente en un commit inicial.', correct: false, why: 'Un `git init` no crea ningún commit: solo prepara el repositorio. El primer commit lo hacés vos, después de elegir qué agregar.'},
      {text: 'Quedan como estaban, sin seguimiento: `git init` solo convierte la carpeta en repositorio y no confirma nada.', correct: true, why: '`git init` habilita el historial en la carpeta; no borra ni agrega archivos. Recién con `git add` y `git commit` esos archivos podrían entrar al historial.'},
    ],
  },
  {
    question: 'Estás por hacer el primer commit y ves que entre los archivos cambiados hay un `.env` con credenciales locales. ¿Qué hacés?',
    options: [
      {text: 'Agregás solo los archivos del cambio con `git add <archivo>` (después de mirar `git status`) y confirmás esos; el `.env` queda afuera del commit.', correct: true, why: 'Elegir archivo por archivo evita que el `.env` entre al historial. Si se agregara con `git add .`, viajaría con el commit.'},
      {text: 'Nada: el archivo no se sube al remoto hasta el `push`, así que no puede quedar en el historial.', correct: false, why: 'El push publica commits, no archivos sueltos. Si `.env` entra en el commit, queda en el historial y viaja al remoto con ese commit.'},
      {text: 'Hacés el commit y después lo borrás con `git rm .env`; así desaparece del historial.', correct: false, why: '`git rm` borra el archivo del working directory y del próximo commit, pero no borra la versión que ya quedó en commits anteriores. Una vez confirmado, sigue en el historial.'},
    ],
  },
  {
    question: '¿Cuándo conviene hacer el primer commit de un proyecto?',
    options: [
      {text: 'Cuando el proyecto está terminado y ya no va a cambiar más.', correct: false, why: 'Si esperás al final, todo el historial anterior queda fuera y no se puede reconstruir. Además, el proyecto nunca deja de cambiar.'},
      {text: 'Apenas tenés un cambio coherente que compila, aunque el proyecto esté incompleto.', correct: true, why: 'El valor de versionar empieza desde el primer cambio: cada commit es un punto al que se puede volver. No hace falta esperar a que todo esté terminado.'},
      {text: 'Cuando hay al menos diez archivos, para que el primer commit tenga sentido.', correct: false, why: 'La cantidad de archivos no define cuándo empezar. Un proyecto de un solo archivo también se beneficia de tener historial desde el principio.'},
    ],
  },
];
