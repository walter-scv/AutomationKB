import type {CodeLine} from '@site/src/components/FindInCode';
import type {TerminalStep} from '@site/src/components/Terminal';

export const REVIEW_STEPS: TerminalStep[] = [
  {
    instruction: 'Modificaste checkout.ts y todavía no lo agregaste. Mirá línea por línea qué cambió.',
    accepted: ['git diff', 'git diff checkout.ts'],
    hint: 'Es el comando que compara lo que todavía no está en staging contra el último commit.',
    output: '-  const TIMEOUT_MS = 30000;\n+  const TIMEOUT_MS = 3000;\n   const reintentos = 3;',
  },
  {
    instruction: 'El timeout de 3000 era un error y ya lo corregiste a 30000 en el editor. Pasá checkout.ts al staging area.',
    accepted: ['git add checkout.ts'],
    hint: 'Nombrá el archivo exacto que querés agregar.',
    output: '',
  },
  {
    instruction: 'Antes de confirmar, revisá exactamente lo que quedó en staging (no lo que quedó suelto).',
    accepted: ['git diff --staged', 'git diff --cached', 'git diff --staged checkout.ts'],
    hint: '`git diff` solo muestra lo que todavía no agregaste. Para lo que ya está en staging hace falta un flag.',
    output: '+  // reintenta el cobro si el proveedor no responde\n   const TIMEOUT_MS = 30000;',
  },
  {
    instruction: 'Antes de tocar validar.ts, que no abrís hace meses, mirá su historial: quién lo cambió, cuándo y por qué.',
    accepted: ['git log -- validar.ts', 'git log validar.ts', 'git log --oneline -- validar.ts', 'git log --oneline validar.ts'],
    hint: 'Es `git log`, acotado a un archivo puntual.',
    output: 'commit 8b1d2e4\nAuthor: Lucía <lucia@tienda.com>\n    Aceptar emails con + en la validación (pedido de soporte)',
  },
];
export const REVIEW_EXPLANATION =
  '`git diff` muestra lo que todavía no agregaste, `git diff --staged` lo que ya está listo para el commit (son cosas distintas cuando ya agregaste una parte), y `git log -- archivo` cuenta la historia de un archivo antes de modificarlo. Revisar antes de confirmar fue lo que atrapó el timeout equivocado.';

export const PRACTICE_RULE_LABELS = [
  'Modificó el archivo sin mirar su historial',
  'Asumió el historial de memoria en vez de revisarlo',
  'Revisó solo las líneas cambiadas y no el contexto',
  'Quedó en estado "detached HEAD" sin darse cuenta',
];

export const PRACTICE_LINES: CodeLine[] = [
  {
    code: 'Antes de tocar una función vieja, se corre `git log -- validar.ts` para ver quién la escribió y por qué.',
    rule: 0,
    why: 'El historial del archivo muestra el contexto de cada cambio. Revisarlo antes de modificarlo evita romper algo que estaba así por una razón.',
    hint: '¿Se revisó el contexto del archivo antes de modificarlo?',
  },
  {
    code: 'Se hace `git checkout 3f2a9c1`, se editan dos archivos y se commitea ahí; después se vuelve a `main` sin guardar esos commits en una rama.',
    rule: 4,
    why: 'Al hacer checkout a un commit puntual, Git queda en detached HEAD. Los commits nuevos no pertenecen a ninguna rama y pueden perderse al cambiar de rama.',
    hint: '¿Ese id es una rama con nombre, o un punto fijo del historial?',
  },
  {
    code: 'Se modifica `reportes.ts` sin abrir su historial; se borra una línea que estaba por una razón que el `git log` explicaba.',
    rule: 1,
    why: 'El historial del archivo habría mostrado por qué se agregó esa línea. Sin ese contexto, un cambio que parece una limpieza puede romper una decisión anterior.',
    hint: '¿Hay alguna forma de saber por qué esa línea estaba ahí antes de borrarla?',
  },
  {
    code: 'Dos personas discuten si un campo "siempre fue obligatorio" o se agregó hace poco, y deciden no mirar `git log` porque "los dos se acuerdan bien".',
    rule: 2,
    why: 'El historial tiene la respuesta exacta: quién, cuándo y con qué mensaje se agregó el campo. Discutir de memoria cuando el comando está a mano es innecesario.',
    hint: '¿Hay una forma de confirmar esto sin depender de lo que cada uno recuerda?',
  },
  {
    code: 'Para mirar una versión vieja, se hace `git checkout <id-de-commit>` solo para inspeccionar y después se vuelve a `main` sin commitear nada.',
    rule: 0,
    why: 'El detached HEAD es un problema cuando se sigue trabajando y confirmando ahí. Para mirar y volver, el checkout a un commit puntual es un uso correcto.',
    hint: '¿Se siguió editando y confirmando en ese estado, o solo se miró y se volvió?',
  },
  {
    code: 'Se revisa el diff y solo se miran las líneas verdes y rojas; no se nota que la línea siguiente, sin cambios, dependía de la variable que se renombró.',
    rule: 3,
    why: 'El diff muestra las líneas cambiadas, pero el efecto del cambio puede estar en las líneas de contexto. Leer solo lo resaltado deja pasar ese tipo de error.',
    hint: '¿Qué líneas no aparecen resaltadas en el diff y qué dependía de ellas?',
  },
  {
    code: 'Antes de discutir si un archivo cambió, se corre `git log -1 --stat` y se ve el último commit con los archivos que tocó.',
    rule: 0,
    why: '`git log -1 --stat` muestra el último commit y el resumen de archivos. Es una forma directa de confirmar el cambio sin depender de la memoria del equipo.',
    hint: '¿Esto resuelve la duda con el historial, o se sigue discutiendo de memoria?',
  },
];

export const LOG_OUTPUT = `$ git log --oneline
9c1e4b7 Mostrar el total con dos decimales en el carrito
a3f9c21 Aceptar emails con + en el registro
5d20e88 Agregar test del cupón vencido
1b7f3aa Validar el largo del código de cupón`;
export const LOG_ACCEPTED = ['5d20e88'];
export const LOG_HINTS = [
  'Cada línea es un commit: primero su id corto y después el mensaje. Buscá primero el que habla de emails con +.',
  '`git log` lista del commit más reciente (arriba) al más viejo (abajo). El que vino antes está más abajo.',
];
export const LOG_EXPLANATION =
  'El commit de los emails con + es `a3f9c21`. Como `git log` muestra primero lo más reciente, el que vino justo antes es el de abajo: `5d20e88`. Con ese id podés, por ejemplo, mirar con `git checkout` cómo estaba el registro antes del cambio.';
