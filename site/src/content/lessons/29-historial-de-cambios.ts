import type {CodeLine} from '@site/src/components/FindInCode';

export const DIFF_RULE_LABELS = [
  'Usó el comando equivocado para lo que quería ver',
  'Revisó solo los cambios sueltos y no lo que ya estaba en staging',
  'No se revisó el diff antes de confirmar',
];

export const DIFF_LINES: CodeLine[] = [
  {
    code: 'Antes de hacer `git add`, se corre `git diff` y se confirma que el cambio es solo el esperado.',
    rule: 0,
    why: '`git diff` muestra los cambios que todavía no están en staging: es justo lo que hace falta mirar antes de agregarlos.',
    hint: '¿Este `git diff` se corrió antes o después de confirmar el commit?',
  },
  {
    code: 'Se confirma un cambio de configuración sin abrir el diff; el commit incluye un timeout bajado de 30s a 3s por error.',
    rule: 3,
    why: 'El diff habría mostrado el valor nuevo antes de confirmar. Sin esa revisión, un cambio numérico chico pasa inadvertido aunque rompa el comportamiento.',
    hint: '¿Qué habría mostrado el diff sobre esa línea que se confirmó?',
  },
  {
    code: 'Ya agregaste dos archivos con `git add`; corrés `git diff` (sin `--staged`), ves solo el tercero y confirmás los tres creyendo que revisaste todo.',
    rule: 2,
    why: '`git diff` sin `--staged` muestra solo lo que quedó fuera del staging. Los dos archivos ya agregados no aparecen, así que no se revisaron.',
    hint: '¿Qué parte de los cambios deja de mostrar `git diff` después de `git add`?',
  },
  {
    code: 'Cuando ya agregaste todo, corrés `git diff --staged` para revisar exactamente lo que va a entrar en el commit.',
    rule: 0,
    why: '`--staged` compara el staging contra el último commit: es la vista correcta de lo que se va a confirmar.',
    hint: '¿`--staged` compara contra lo que ya está en staging, o contra lo que quedó afuera?',
  },
  {
    code: 'Para saber quién escribió una línea hace tres meses, corrés `git diff` sobre el archivo y esperás ver el autor.',
    rule: 1,
    why: '`git diff` muestra contenido que cambió, no autores ni fechas. Para eso sirven `git log` o `git blame`; el diff no puede responder esa pregunta.',
    hint: '¿Qué comando muestra autor y mensaje de cada cambio, y cuál solo muestra el contenido?',
  },
  {
    code: 'Antes de confirmar, se abre el diff y se nota que el cambio de una línea rompe una función que la usaba; se corrige antes del commit.',
    rule: 0,
    why: 'Revisar el diff no es solo leer las líneas verdes y rojas: también es ver el contexto y preguntarse qué depende de eso. Acá la revisión evitó el problema.',
    hint: '¿Se revisó el contexto alrededor del cambio, o solo las líneas resaltadas?',
  },
  {
    code: 'Se corre `git add .` sin mirar qué archivos cambiaron, y el commit termina incluyendo un archivo de configuración local que no debía subirse.',
    rule: 3,
    why: 'Sin revisar el diff (o al menos `git status`) antes de agregar, es fácil incluir algo sin darse cuenta. El archivo queda en el historial aunque se borre después.',
    hint: '¿Se confirmó, antes de este commit, exactamente qué archivos se estaban incluyendo?',
  },
  {
    code: 'Después de `git add`, se corre `git diff` para ver los cambios que quedaron fuera del staging antes de decidir si van en el mismo commit.',
    rule: 0,
    why: 'Después de agregar, `git diff` muestra justamente lo que no está en staging. Usarlo así sirve para separar lo que entra ahora de lo que queda para otro commit.',
    hint: '¿Qué parte de los cambios muestra `git diff` después de un `git add` parcial?',
  },
];

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

