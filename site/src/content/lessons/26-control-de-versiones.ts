import type {CodeLine} from '@site/src/components/FindInCode';
import type {QuizQuestion} from '@site/src/components/Quiz';

export const GIT_VS_GITHUB_RULE_LABELS = ['Es una función de GitHub (la plataforma)'];

export const GIT_VS_GITHUB_LINES: CodeLine[] = [
  {
    code: 'Hacer tres commits en una rama mientras viajás en un avión, sin conexión a internet.',
    rule: 0,
    why: 'Crear ramas y confirmar commits son operaciones sobre el repositorio local: Git no necesita consultar ningún servidor para eso. La conexión recién hace falta para subir el trabajo.',
    hint: '¿Confirmar un commit necesita contactar algún servidor?',
  },
  {
    code: 'Aprobar el cambio de un compañero desde la pestaña "Files changed" del repositorio, antes de mergearlo.',
    rule: 1,
    why: 'La revisión y aprobación de un cambio en una pestaña web es una función de la plataforma que aloja el repositorio. Git, en tu máquina, no tiene pestañas ni un botón de aprobar.',
    hint: '¿Esa pestaña existe en la terminal, o solo en el sitio web donde está alojado el repositorio?',
  },
  {
    code: 'Crear la etiqueta `v1.2.0` sobre el último commit con `git tag v1.2.0`, antes de conectarse a internet.',
    rule: 0,
    why: '`git tag` crea una referencia sobre el repositorio local; no se publica en ningún lado hasta hacer `git push --tags`.',
    hint: '¿Crear un tag local necesita conexión a algún servidor?',
  },
  {
    code: 'Abrir un Issue para reportar un bug que encontraste en producción, antes de empezar a arreglarlo.',
    rule: 1,
    why: 'Los Issues son un sistema de seguimiento que agrega la plataforma para registrar bugs y tareas. Un repositorio Git por sí solo no tiene Issues.',
    hint: '¿Ese sistema de reporte de bugs existe en un repositorio Git sin plataforma encima, o es algo que suma el sitio?',
  },
  {
    code: 'Borrar con `git branch -d feature/login` una rama que ya se mergeó, sin abrir el navegador.',
    rule: 0,
    why: '`git branch -d` trabaja sobre las ramas del repositorio local. Que la rama ya esté mergeada es lo que hace segura la operación; el navegador no participa.',
    hint: '¿Borrar una rama local requiere abrir el navegador?',
  },
  {
    code: 'Asignarle un bug a un compañero desde la lista de tareas del proyecto, para que le llegue la notificación.',
    rule: 1,
    why: 'La lista de tareas, las asignaciones y las notificaciones son herramientas de colaboración que agrega la plataforma. Un repositorio Git por sí solo no tiene usuarios ni tareas a los que asignar.',
    hint: '¿Esa lista de tareas y esas notificaciones existen en un repositorio Git sin plataforma encima?',
  },
  {
    code: 'Deshacer el último commit con `git reset --soft HEAD~1`, mientras el router sigue reiniciando.',
    rule: 0,
    why: '`git reset` reescribe el historial del repositorio local: no publica ni descarga nada del remoto, así que funciona igual con o sin conexión.',
    hint: '¿`git reset` sube o baja algo del servidor, o solo reescribe el historial que ya tenías guardado?',
  },
  {
    code: 'Configurar una regla para que nadie pueda hacer push directo a `main` sin pasar por un Pull Request.',
    rule: 1,
    why: 'Las reglas de protección de rama son una configuración de la plataforma sobre el repositorio alojado. Git, en tu máquina, no tiene ningún concepto de "rama protegida".',
    hint: '¿Esa regla vive en un archivo de tu repositorio local, o en la configuración del repositorio en la plataforma?',
  },
  {
    code: 'Ver con `git log --oneline` los últimos commits de un archivo, en la terminal y sin conexión.',
    rule: 0,
    why: 'El historial de commits está en el repositorio local. `git log` lo lee de ahí, así que funciona igual con o sin internet.',
    hint: '¿`git log` necesita contactar algún servidor para mostrar el historial?',
  },
];

export const PRACTICE_RULE_LABELS = [
  'Nunca se sube el trabajo a un remoto',
  'Se nombran versiones a mano en vez de usar el historial',
  'Se sigue compartiendo "por las dudas" fuera del control de versiones',
  'Archivos que no deberían versionarse',
];

export const PRACTICE_LINES: CodeLine[] = [
  {
    code: 'El archivo `config.local.ts`, con la clave de la API de pagos, se agrega y se confirma junto con el resto del código.',
    rule: 4,
    why: 'Una vez que la clave entra al historial, queda ahí aunque después se borre el archivo: hay que excluirla desde el principio con `.gitignore`, no limpiarla a posteriori.',
    hint: '¿Ese archivo tiene algo que no debería quedar guardado para siempre en el historial?',
  },
  {
    code: 'El `.gitignore` excluye `node_modules/` y `dist/`, pero sí versiona `package-lock.json`.',
    rule: 0,
    why: 'Las dependencias instaladas y el build se reconstruyen solos; el lockfile, en cambio, fija las versiones exactas que usa el equipo y conviene versionarlo.',
    hint: '¿`package-lock.json` se regenera solo como `node_modules`, o fija algo que el equipo necesita?',
  },
  {
    code: 'Todo el trabajo de las últimas tres semanas existe solo en la laptop de una persona; nunca se subió a un remoto.',
    rule: 1,
    why: 'Si esa máquina se rompe o se pierde, el historial se va con ella. Tener un remoto es la copia que no depende de una sola laptop.',
    hint: '¿Dónde más existe una copia de este historial además de esa máquina?',
  },
  {
    code: 'El equipo guarda `informe-v1.docx`, `informe-v2.docx` e `informe-FINAL.docx` en la misma carpeta, y no hay commits que expliquen qué cambió entre uno y otro.',
    rule: 2,
    why: 'Los nombres a mano no dicen qué cambió ni permiten volver a un punto intermedio. El historial de commits sí guarda cada cambio con su mensaje y su autor.',
    hint: '¿Alcanza con el nombre del archivo para saber qué se modificó entre una versión y la siguiente?',
  },
  {
    code: 'Además de commitear, al final de cada sprint alguien manda un `.zip` del proyecto por chat "por las dudas".',
    rule: 3,
    why: 'Ese canal paralelo compite con el repositorio como fuente de verdad: si el zip y el repo no coinciden, nadie sabe cuál es la versión buena.',
    hint: '¿Qué versión es la buena si el zip y el repositorio dicen cosas distintas?',
  },
  {
    code: 'La carpeta `coverage/`, que se regenera en cada corrida de tests, se versiona completa en cada commit.',
    rule: 4,
    why: 'Los reportes de cobertura son un producto generado: se reconstruyen corriendo los tests, y versionarlos agranda el repositorio sin agregar información propia.',
    hint: '¿Esa carpeta aporta algo que no se pueda volver a generar corriendo los tests?',
  },
  {
    code: 'Cada integrante trabaja sobre su clon local y sube sus commits al remoto al menos una vez por día.',
    rule: 0,
    why: 'El repositorio remoto es la copia compartida y el respaldo: subir seguido mantiene el trabajo fuera de una sola máquina.',
    hint: '¿Este hábito deja el historial viviendo en una sola máquina, o lo respalda en otro lado?',
  },
  {
    code: 'El `.env` con valores reales está en `.gitignore`, y se versiona un `.env.example` con las claves vacías.',
    rule: 0,
    why: 'El ejemplo documenta qué variables hacen falta sin exponer secretos. Es la forma de compartir la configuración sin versionar credenciales.',
    hint: '¿Ese archivo de ejemplo expone alguna credencial real?',
  },
];

export const CLOSING_QUIZ: QuizQuestion[] = [
  {
    question: 'Estás en un avión sin wifi y necesitás ver exactamente qué líneas cambiaron entre dos commits que ya tenés descargados. ¿Qué podés hacer?',
    options: [
      {text: 'Nada hasta tener conexión: `git diff` necesita consultar GitHub para comparar commits.', correct: false, why: 'Git compara los commits contra el historial local; no necesita GitHub para eso. La conexión solo haría falta para traer commits que no tenés.'},
      {text: 'Usar `git log` para ver el listado y esperar a tener conexión para ver las líneas.', correct: false, why: '`git log` muestra autores y mensajes, pero el contenido línea por línea de un cambio también está en el repositorio local: `git diff` lo puede mostrar sin conexión.'},
      {text: 'Correr `git diff <commit1> <commit2>`: los dos commits ya están en tu repositorio local.', correct: true, why: '`git diff` compara dos estados que ya tenés guardados. Si los commits fueron descargados antes, la comparación funciona sin red.'},
    ],
  },
];
