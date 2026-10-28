import type {MultiSelectQuestion} from '@site/src/components/MultiSelect';
import type {CodeLine} from '@site/src/components/FindInCode';
import type {MatchItem} from '@site/src/components/Match';

export const REMOTE_MATCH_LEFT: MatchItem[] = [
  {id: 'push', text: 'Hiciste tres commits hoy y querés que el equipo los vea en GitHub.'},
  {id: 'fetch', text: 'Querés saber si hay commits nuevos en el remoto, sin que se mezclen todavía con tu rama.'},
  {id: 'log', text: 'Ya descargaste lo nuevo del remoto y querés ver qué commits llegaron que tu `main` todavía no tiene.'},
  {id: 'pull', text: 'Arrancás el día y querés dejar tu `main` igual al remoto, trayendo y mezclando en un solo paso.'},
];
export const REMOTE_MATCH_RIGHT: MatchItem[] = [
  {id: 'log', text: '`git log main..origin/main`'},
  {id: 'pull', text: '`git pull`'},
  {id: 'push', text: '`git push`'},
  {id: 'fetch', text: '`git fetch`'},
];
export const REMOTE_MATCH_WHY: Record<string, string> = {
  push: '`push` sube tus commits locales al remoto: hasta entonces, solo existen en tu máquina.',
  fetch: '`fetch` descarga lo nuevo del remoto pero no toca tu rama: es el paso seguro para revisar antes de decidir.',
  log: 'Después de un `fetch`, `origin/main` tiene lo que trajo el remoto; `main..origin/main` lista los commits que están ahí y todavía no en tu `main`.',
  pull: '`pull` es `fetch` + `merge` en un paso: trae y mezcla directo, sin pausa para revisar.',
};

export const PRACTICE_RULE_LABELS = [
  'Pasó días sin traer los cambios del remoto',
  'Acumuló muchos commits sin compartirlos (`push`)',
  'Confundió "hice commit" con "ya lo compartí"',
  'Forzó el push sin entender por qué fue rechazado',
];

export const PRACTICE_LINES: CodeLine[] = [
  {
    code: 'El push es rechazado porque el remoto tiene commits nuevos; la persona corre `git push --force` para que suba igual.',
    rule: 4,
    why: '`--force` sobrescribe la rama remota con la copia local y puede borrar los commits que llegaron mientras tanto. El rechazo avisa que hay que integrar esos commits primero: `git pull`, resolver y volver a pushear.',
    hint: '¿Qué commits del remoto pueden desaparecer con este comando?',
  },
  {
    code: 'Antes de empezar a trabajar, se corre `git pull` y se revisa que no haya conflictos pendientes.',
    rule: 0,
    why: 'Partir de la última versión del remoto evita descubrir los cambios ajenos recién al hacer push. El chequeo de conflictos cierra el arranque.',
    hint: '¿Se partió de la última versión del remoto antes de seguir trabajando?',
  },
  {
    code: 'Alguien trabaja tres días sin hacer push y acumula doce commits que solo existen en su máquina.',
    rule: 2,
    why: 'Doce commits en un solo lugar: si el disco falla no hay copia en el remoto, y el equipo no puede ver ni revisar el avance. Subirlos seguido evita las dos cosas.',
    hint: '¿Dónde existe ese trabajo además de esa máquina?',
  },
  {
    code: 'Alguien hace commit de un cambio chico y lo deja en local hasta terminar la tarea, que calcula le lleva dos horas.',
    rule: 0,
    why: 'Dos horas de trabajo local no es acumular durante días: el commit existe y se va a compartir dentro de la misma jornada. No hay riesgo relevante de perder días de trabajo.',
    hint: '¿Dos horas sin compartir es lo mismo que acumular varios días de trabajo?',
  },
  {
    code: 'Alguien dice "listo, ya está en el repo" después de hacer `git commit`, sin haber corrido `git push`.',
    rule: 3,
    why: 'El commit vive en el repositorio local; para el resto del equipo todavía no existe. La palabra "repo" tapa la diferencia entre guardado en tu máquina y publicado en el remoto.',
    hint: '¿Qué falta para que ese commit esté en el remoto?',
  },
  {
    code: 'El equipo pasa cuatro días sin `fetch` ni `pull`; al quinto, el primer push de cada uno es rechazado.',
    rule: 1,
    why: 'Cuatro días de commits ajenos se acumularon sin que nadie los mirara. El rechazo es la consecuencia: hay que integrar todo junto, y cualquier conflicto va a ser más grande.',
    hint: '¿Cuánto avanzó el remoto mientras nadie lo miraba?',
  },
  {
    code: 'Después de revisar un commit propio, alguien corre `git push` para compartirlo y avisa en el canal del equipo qué cambió.',
    rule: 0,
    why: 'El push publica el commit en el remoto y el aviso permite que el resto sepa qué hay nuevo. Es el uso esperado: compartir lo propio y no dejar que se acumule.',
    hint: '¿Este commit queda compartido con el equipo, o solo en la máquina local?',
  },
  {
    code: 'Se hace `git push` de cada commit apenas está revisado, aunque la feature siga en progreso en otros archivos.',
    rule: 0,
    why: 'En una rama propia, compartir commits chicos y seguido no publica la feature: deja respaldo y visibilidad. El trabajo incompleto no llega a main hasta el PR.',
    hint: '¿Publicar commits chicos seguido publica la feature incompleta en main?',
  },
];

export const STATUS_OUTPUT = `$ git status
On branch main
Your branch is behind 'origin/main' by 2 commits, and can be fast-forwarded.

nothing to commit, working tree clean`;
export const STATUS_ACCEPTED = ['git pull', 'git pull origin main'];
export const STATUS_HINTS = [
  '"behind" quiere decir que el remoto tiene commits que tu `main` todavía no. ¿Hacia dónde tienen que viajar esos commits?',
  'Tienen que venir del remoto a tu rama y quedar mezclados, en un solo paso.',
];
export const STATUS_EXPLANATION =
  'Tu `main` está 2 commits atrás del remoto y no tenés cambios propios: `git pull` los trae y los mezcla en un paso. `git push` sería al revés (subir lo tuyo), y `git fetch` los traería sin dejarlos en tu rama.';

export const AUTH_QUESTIONS: MultiSelectQuestion[] = [
  {
    prompt: 'Vas a subir tu primera rama a un repositorio privado de GitHub desde una computadora nueva. ¿Qué formas de autenticarte funcionan y son seguras? Marcá todas las que correspondan.',
    options: [
      {text: 'Escribir la contraseña de tu cuenta de GitHub cuando Git la pide.', correct: false, why: 'GitHub dejó de aceptar la contraseña para operaciones de Git en 2021: el push falla con «Support for password authentication was removed».'},
      {text: 'Generar un token de acceso personal con vencimiento y permiso solo sobre ese repositorio, y pegarlo cuando Git pide la contraseña.', correct: true, why: 'Es la credencial para direcciones HTTPS, con el alcance mínimo necesario.'},
      {text: 'Iniciar sesión desde el navegador con Git Credential Manager, que guarda la credencial en el sistema.', correct: true, why: 'Es la misma autenticación por HTTPS, sin pegar el token en cada operación.'},
      {text: 'Generar un par de claves con `ssh-keygen`, cargar la pública en GitHub y usar la dirección `git@github.com:...` del repositorio.', correct: true, why: 'Es la autenticación por SSH: la clave privada queda en tu computadora y GitHub verifica con la pública.'},
      {text: 'Pedirle a un compañero el token que a él ya le funciona.', correct: false, why: 'Un token es una credencial personal: compartirlo la expone y los cambios quedarían subidos a nombre de otra persona.'},
      {text: 'Guardar el token en un archivo `credenciales.txt` del repositorio, para no perderlo.', correct: false, why: 'Todo lo que entra al historial queda visible para cualquiera con acceso al repositorio; un token expuesto hay que revocarlo.'},
    ],
  },
];
