import type {FillBlankSlot} from '@site/src/components/FillBlank';
import type {DecisionNode} from '@site/src/components/DecisionPath';
import type {CodeLine} from '@site/src/components/FindInCode';
import type {QuizQuestion} from '@site/src/components/Quiz';
import type {MatchItem} from '@site/src/components/Match';
import type {TerminalStep} from '@site/src/components/Terminal';
import type {SpotTokenRound} from '@site/src/components/SpotToken';
import type {MultiSelectQuestion} from '@site/src/components/MultiSelect';

export const DIAGNOSIS_RULE_LABELS = [
  'El mensaje de commit no describe el cambio real',
  'Confundió `restore`, `stash` y `revert`',
  'No trajo los cambios del remoto antes de empezar a trabajar',
  'Reescribió una rama que ya estaba compartida (rebase o force push)',
  'Commiteó directo en main sin abrir una rama',
];

export const DIAGNOSIS_LINES: CodeLine[] = [
  {
    code: 'Quiere descartar un cambio sin confirmar y corre `git revert HEAD`, deshaciendo el último commit, que era de otra persona.',
    rule: 2,
    why: 'Revert deshace un commit confirmado, no un cambio del working directory: acá se borró el trabajo de otra persona y el cambio que se quería descartar sigue ahí. Correspondía `restore` sobre el archivo.',
    hint: '¿El cambio que quiere descartar ya está en un commit, o todavía no se confirmó?',
  },
  {
    code: 'Alguien crea `fix/validar-cupon` para un cambio de una línea, hace un commit con el motivo y abre un PR.',
    rule: 0,
    why: 'Aunque el cambio sea chico, pasa por rama y revisión: el tamaño no es excusa para saltear el flujo. Es el camino esperado.',
    hint: '¿Este cambio se hizo en una rama propia, con PR, aunque sea chico?',
  },
  {
    code: 'Un hotfix de dos líneas se commitea directo en main porque "total, es urgente".',
    rule: 5,
    why: 'La urgencia explica el apuro, no la ausencia de revisión: en main el cambio se mezcla con el trabajo de todos sin que nadie lo haya mirado. Una rama y un PR rápido también sirven para un hotfix.',
    hint: '¿En qué rama quedó registrado este cambio y quién lo revisó?',
  },
  {
    code: 'Un commit llamado "cosas" corrige un bug y ajusta estilos en el mismo archivo.',
    rule: 1,
    why: 'El mensaje no permite encontrar el cambio dentro de seis meses: "cosas" no dice qué se corrigió ni por qué. El nombre debería describir el cambio real.',
    hint: '¿Ese mensaje alcanza para encontrar este cambio dentro de seis meses?',
  },
  {
    code: 'Un commit con mensaje "Corrige el cálculo de envío para pedidos con más de 3 ítems" incluye también el test que lo cubre.',
    rule: 0,
    why: 'El mensaje describe el cambio real y el test es parte de la misma corrección: no son dos temas distintos. Es un commit coherente y fácil de leer.',
    hint: '¿El mensaje describe el cambio real?',
  },
  {
    code: 'Para "prolijar" antes del release, alguien rebasea main y fuerza el push; dos compañeros tenían commits locales sobre esa rama.',
    rule: 4,
    why: 'Rebasear main reescribe commits que esos compañeros ya tienen: sus copias quedan desincronizadas y el force push borra lo que hubiera en el remoto. Una rama compartida se integra con merge, no se reescribe.',
    hint: '¿Qué pasa con los commits locales de esos dos compañeros?',
  },
  {
    code: 'Alguien arranca el lunes una rama nueva sin traer los cambios que el equipo subió el viernes; el primer push del día es rechazado.',
    rule: 3,
    why: 'La rama partió de una versión vieja del remoto. Traer los cambios al empezar habría mostrado el conflicto temprano, en vez de descubrirlo en el primer push.',
    hint: '¿La rama partió de la versión más reciente del remoto?',
  },
  {
    code: 'Antes de cambiar de rama para atender un bug, alguien guarda su trabajo a medias con `git stash` y lo recupera al volver.',
    rule: 0,
    why: 'El trabajo no estaba confirmado y se conserva para después: es el uso correcto de stash, no una confusión con restore ni revert.',
    hint: '¿Se usó la herramienta correcta para guardar trabajo sin confirmar?',
  },
];

export const INTEGRATIVE_QUIZ: QuizQuestion[] = [
  {
    question:
      'Estás por empezar una feature nueva. ¿Cuál es el orden correcto combinando control de versiones, ramas y el remoto?',
    options: [
      {
        text: 'Traer los últimos cambios del remoto, crear la rama desde ahí, trabajar con commits chicos, y al final subir y abrir el PR.',
        correct: true,
        why: 'Partir actualizado reduce conflictos, la rama aísla el trabajo y el PR llega cuando el cambio está listo para revisión.',
      },
      {
        text: 'Crear la rama primero y traer los cambios del remoto solo si aparece un conflicto al final.',
        correct: false,
        why: 'Esperar al final junta la divergencia y hace más grande el conflicto. Además, la rama ya nace vieja respecto de main.',
      },
      {
        text: 'Trabajar directo en main con commits chicos, y crear la rama recién para abrir el PR.',
        correct: false,
        why: 'Los commits ya estarían en main sin revisión: la rama creada después no aísla nada. El PR dejaría de ser un paso previo a la integración.',
      },
    ],
  },
];

// ---- Contexto común de las actividades nuevas: agregar una lista de deseos a la tienda ----

export const WHERE_MATCH_LEFT: MatchItem[] = [
  {id: 'wd', text: 'Editaste `lista-deseos.ts` y lo guardaste con Ctrl+S.'},
  {id: 'stage', text: 'Corriste `git add lista-deseos.ts`.'},
  {id: 'commit', text: 'Corriste `git commit -m "Agregar botón de lista de deseos"`.'},
  {id: 'ignore', text: 'Tenés un `.env` con la clave real del servicio de emails.'},
  {id: 'log', text: 'Antes de tocar `favoritos.ts`, querés saber quién lo cambió y por qué.'},
];
export const WHERE_MATCH_RIGHT: MatchItem[] = [
  {id: 'ignore', text: 'Va en `.gitignore`: nunca tiene que entrar al historial.'},
  {id: 'commit', text: 'Quedó guardado en el historial del repositorio local.'},
  {id: 'log', text: '`git log -- favoritos.ts`'},
  {id: 'wd', text: 'Está en el working directory, modificado y sin agregar.'},
  {id: 'stage', text: 'Está en el staging area, listo para el próximo commit.'},
];
export const WHERE_MATCH_WHY: Record<string, string> = {
  wd: 'Guardar el archivo no lo confirma: el cambio sigue en el working directory hasta que lo agregues (entrada 27).',
  stage: '`git add` lo pasa al staging area: lo marca para el próximo commit, pero todavía no es parte del historial (entrada 27).',
  commit: 'El commit guarda la foto en el historial local; para que el equipo lo vea falta el `push` (entradas 27 y 32).',
  ignore: 'Una credencial que entra al historial queda ahí aunque se borre después: se excluye desde el principio (entrada 26).',
  log: '`git log` acotado a un archivo cuenta su historia antes de modificarlo (entrada 29).',
};

export const INTEGRATE_STEPS: TerminalStep[] = [
  {
    instruction: 'Estás en feature/lista-deseos y main avanzó mucho desde que creaste la rama. Traé main a tu rama.',
    accepted: ['git merge main'],
    hint: 'Parado en tu rama, es el comando que suma los commits de otra rama a la actual.',
    output: 'Auto-merging producto.ts\nCONFLICT (content): Merge conflict in producto.ts\nAutomatic merge failed; fix conflicts and then commit the result.',
  },
  {
    instruction: 'Mirá qué archivos quedaron en conflicto y cuáles ya se integraron solos.',
    accepted: ['git status'],
    hint: 'Es el comando que solo informa el estado, sin cambiar nada.',
    output: 'You have unmerged paths.\nChanges to be committed:\n  modified:   carrito.ts\nUnmerged paths:\n  both modified:   producto.ts',
  },
  {
    instruction: 'Combinaste a mano las dos versiones de producto.ts y volviste a correr los tests. Marcá el archivo como resuelto.',
    accepted: ['git add producto.ts'],
    hint: 'Un conflicto resuelto se marca agregándolo al staging area, con el nombre del archivo.',
    output: '',
  },
  {
    instruction: 'Confirmá el merge.',
    accepted: ['git commit', 'git commit -m *'],
    hint: 'Es el mismo comando que confirma cualquier cambio (Git ya propone un mensaje para el merge).',
    output: "[feature/lista-deseos 5e6f7a8] Merge branch 'main' into feature/lista-deseos",
  },
];
export const INTEGRATE_EXPLANATION =
  'Traer main a la rama seguido evita que el conflicto crezca (entrada 31). `git status` separa lo que se integró solo de lo que está en conflicto (entrada 27), y un conflicto resuelto a mano se marca con `git add` y se confirma con `git commit`, después de volver a probar.';

export const WORD_PROMPT = '¿Qué palabra del comando no corresponde con lo que se quiere hacer (lo que dice el comentario)?';
export const WORD_ROUNDS: SpotTokenRound[] = [
  {
    line: 'git add .   # para confirmar solo login.ts; también hay un debug.log nuevo',
    targetIndex: 2,
    why: 'El punto agrega todos los archivos cambiados, incluido el `debug.log`. Para confirmar solo un archivo hay que nombrarlo: `git add login.ts` (entrada 28).',
    hint: '¿Este comando agrega un archivo puntual o todo lo que cambió?',
  },
  {
    line: 'git pull   # quiero ver qué hay de nuevo en el remoto, sin mezclar nada todavía',
    targetIndex: 1,
    why: '`pull` trae y además mezcla en tu rama. Para solo traer y revisar antes de decidir, es `git fetch` (entrada 32).',
    hint: '¿Este comando se queda en traer, o también mezcla con tu rama?',
  },
  {
    line: 'git push --force   # re-subir mi rama rebaseada sin pisar lo que haya subido otra persona',
    targetIndex: 2,
    why: '`--force` pisa el remoto sin mirar si alguien subió algo. Para re-subir sin ese riesgo es `--force-with-lease`, que se niega si el remoto cambió (entrada 34).',
    hint: '¿Este flag chequea algo antes de pisar el remoto?',
  },
];

export const IGNORE_QUESTIONS: MultiSelectQuestion[] = [
  {
    prompt: '¿Qué tiene que quedar fuera del repositorio (en `.gitignore`)? Marcá todo lo que corresponda.',
    options: [
      {text: '`node_modules/`, las dependencias instaladas.', correct: true, why: 'Se reconstruyen solas con el gestor de paquetes: versionarlas solo infla el repo.'},
      {text: '`lista-deseos.ts`, el código de la feature.', correct: false, why: 'Es el código del proyecto: justamente lo que se versiona.'},
      {text: '`.env`, con la clave real del servicio de emails.', correct: true, why: 'Una credencial no puede entrar al historial: quedaría ahí aunque se borre después.'},
      {text: '`.env.example`, con los nombres de las variables y los valores vacíos.', correct: false, why: 'No tiene secretos y le dice a quien clone el repo qué variables tiene que completar: se versiona.'},
      {text: '`dist/`, lo que genera el build.', correct: true, why: 'Es un resultado que se regenera en cada build: no hace falta versionarlo.'},
      {text: '`package-lock.json`, las versiones exactas de las dependencias.', correct: false, why: 'Se versiona: asegura que todo el equipo instale exactamente las mismas versiones.'},
    ],
  },
];

export const RELEASE_PATH_START = 'auth';
export const RELEASE_PATH_NODES: Record<string, DecisionNode> = {
  auth: {
    id: 'auth',
    situation: 'Terminaste los commits de `feature/lista-deseos` y hacés el primer push. Git pide usuario y contraseña; escribís la contraseña de tu cuenta de GitHub y falla con «Support for password authentication was removed». ¿Qué hacés?',
    options: [
      {text: 'Volver a intentar: seguramente escribiste mal la contraseña.', correct: false, why: 'El mensaje no dice que la contraseña esté mal: dice que GitHub ya no acepta contraseñas para operaciones de Git (entrada 32).'},
      {text: 'Generar un token de acceso personal con permiso sobre el repositorio y usarlo en lugar de la contraseña (o configurar una clave SSH).', correct: true, why: 'Son las dos formas de autenticarse que acepta GitHub (entrada 32).', next: 'pr'},
      {text: 'Pedirle a un compañero su token, que ya le funciona.', correct: false, why: 'Un token es una credencial personal: compartirlo es exponerla, y además los cambios quedarían subidos con la identidad de otra persona (entrada 32).'},
    ],
  },
  pr: {
    id: 'pr',
    situation: 'La rama ya está en el remoto. El trabajo responde al issue #84, «Permitir guardar productos para después». Abrís el Pull Request: ¿qué incluye la descripción, además de qué cambia y cómo probarlo?',
    options: [
      {text: 'Nada más: el issue se cierra a mano cuando alguien se acuerde.', correct: false, why: 'Sin vínculo no queda registrado qué cambio resolvió el issue, y el cierre depende de la memoria de alguien (entrada 34b).'},
      {text: 'Un enlace al tablero del equipo.', correct: false, why: 'El tablero no vincula el PR con el issue: GitHub no los relaciona ni cierra el issue al integrar (entrada 34b).'},
      {text: '`Closes #84`, para que GitHub vincule los dos y cierre el issue al integrar el PR.', correct: true, why: 'La palabra clave seguida del número deja el vínculo en las dos direcciones y cierra el issue con el merge (entrada 34b).', next: 'review'},
    ],
  },
  review: {
    id: 'review',
    situation: 'Mientras esperás la revisión, un compañero sube al remoto `feature/compartir-lista`, que parte de tu rama, y te pide que la pruebes. Todavía no la tenés en tu repositorio. ¿Qué corrés?',
    options: [
      {text: '`git fetch` y después `git switch feature/compartir-lista`.', correct: true, why: '`fetch` trae la rama como `origin/feature/compartir-lista`, y `switch` con ese nombre crea la rama local que la sigue (entrada 32a).', next: 'flow'},
      {text: '`git switch -c feature/compartir-lista`.', correct: false, why: '`-c` crea una rama nueva desde donde estás parado, sin nada del trabajo del compañero (entrada 32a).'},
      {text: '`git pull` estando en `main`.', correct: false, why: 'Actualiza `main`, pero no te deja parado en la rama del compañero, que es la que hay que probar (entrada 32a).'},
    ],
  },
  flow: {
    id: 'flow',
    situation: 'El equipo usa GitHub flow: lo que se integra a `main` se publica ese mismo día. ¿Cuándo se prueba la lista de deseos?',
    options: [
      {text: 'Después del merge, en `main`.', correct: false, why: 'En GitHub flow `main` se publica enseguida: probar después del merge es probar algo que ya está saliendo a producción (entrada 35a).'},
      {text: 'En una rama `release/*`, antes de publicar.', correct: false, why: 'Las ramas `release/*` son de Git flow; en GitHub flow no existen (entrada 35a).'},
      {text: 'En la rama del Pull Request, antes del merge.', correct: true, why: 'Es el único momento en que el cambio está aislado y todavía no salió a producción (entrada 35a).', next: 'bisect'},
    ],
  },
  bisect: {
    id: 'bisect',
    situation: 'Ya se publicó la versión etiquetada v2.3.0. Un usuario reporta que el contador del carrito muestra 0 aunque haya productos; en la v2.2.0 funcionaba. Entre las dos etiquetas hay 40 commits y nada indica qué archivo está involucrado. ¿Cómo encontrás el commit que lo introdujo?',
    options: [
      {text: '`git blame` sobre `carrito.ts`.', correct: false, why: '`blame` sirve cuando ya se sabe qué líneas mirar; acá no hay ninguna pista sobre el código (entrada 33b).'},
      {text: 'Revertir el merge de la lista de deseos, que es lo más nuevo.', correct: false, why: 'Que sea lo más reciente no lo convierte en la causa: hay otros 39 commits en el medio, y revertir sin saber deshace trabajo que puede estar bien (entradas 33 y 33b).'},
      {text: '`git bisect`, marcando la v2.3.0 como `bad` y la v2.2.0 como `good`.', correct: true, why: 'Con una versión buena y una mala, y sin pista sobre el código, `bisect` encuentra el commit probando el comportamiento en unos seis pasos (entradas 33a y 33b).'},
    ],
  },
};
export const RELEASE_PATH_EXPLANATION =
  'Un cambio recorre todo el bloque: se sube autenticado con token o SSH, se vincula con su issue, convive con ramas remotas de otras personas, se prueba donde indica el flujo del equipo, y cuando algo falla después de publicar, las etiquetas de versión permiten acotar la búsqueda con `bisect`.';

export const RELEASE_TEMPLATE = `# El PR de la lista de deseos ya se integró a main.
$ git switch main
$ git {{traer}}
$ git branch {{borrar}} feature/lista-deseos
$ git tag {{anotada}} v2.3.0 -m "Versión 2.3.0: lista de deseos"
$ git push origin {{subir}}`;
export const RELEASE_SLOTS: FillBlankSlot[] = [
  {id: 'traer', answer: 'pull'},
  {id: 'borrar', answer: '-d'},
  {id: 'anotada', answer: '-a'},
  {id: 'subir', answer: 'v2.3.0'},
];
export const RELEASE_BANK = ['-D', 'pull', 'main', '-d', 'fetch', '-a', 'v2.3.0', '-m'];
export const RELEASE_EXPLANATION =
  '`git pull` deja `main` igual al remoto, con el PR integrado. `-d` borra la rama solo porque ya está integrada (`-D` la borraría aunque no lo estuviera). `-a` crea una etiqueta anotada, y `git push origin v2.3.0` la sube: `git push origin main` no sube etiquetas (entradas 30, 32, 33a y 35).';
