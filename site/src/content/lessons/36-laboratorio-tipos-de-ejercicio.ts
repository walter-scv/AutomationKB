import type {FillBlankSlot} from '@site/src/components/FillBlank';
import type {MatchItem} from '@site/src/components/Match';
import type {BuilderStep} from '@site/src/components/CommandBuilder';
import type {MultiSelectQuestion} from '@site/src/components/MultiSelect';
import type {DecisionNode} from '@site/src/components/DecisionPath';
import type {SpotTokenRound} from '@site/src/components/SpotToken';
import type {TerminalStep} from '@site/src/components/Terminal';

// 1. FillBlank — completar un comando con fichas (cloze, sin escribir).
export const FILLBLANK_TEMPLATE = 'git {{verb}} {{file}}';
export const FILLBLANK_SLOTS: FillBlankSlot[] = [
  {id: 'verb', answer: 'restore'},
  {id: 'file', answer: 'src/cart.ts'},
];
export const FILLBLANK_BANK = ['revert', 'restore', 'reset', 'cart.ts', 'src/cart.ts'];
export const FILLBLANK_EXPLANATION =
  '`restore` descarta cambios sin confirmar en el working directory — que es justo la situación. `revert` deshace un commit ya confirmado y `reset` mueve HEAD: ninguno de los dos aplica acá. La ruta completa (`src/cart.ts`) es la que coincide con el archivo real; `cart.ts` solo, sin carpeta, podría no encontrar el archivo si hay otro con el mismo nombre en otra carpeta del proyecto.';

// 2. TypeAnswer — escribir un comando corto, validado contra variantes aceptadas.
export const TYPEANSWER_ACCEPTED = ['git fetch', 'git fetch origin', 'git fetch --all'];
export const TYPEANSWER_HINTS = [
  'Pensá en el comando que solo actualiza las referencias remotas, sin tocar todavía tu working directory.',
  'No es `pull` (ese además mergea) ni `clone` (eso es solo para la primera copia del repo). Es `git` más una palabra de cinco letras que empieza con "f".',
];
export const TYPEANSWER_EXPLANATION =
  '`git fetch` trae los commits y ramas nuevas del remoto, pero no toca tu working directory ni tu rama actual — a diferencia de `pull`, que además hace merge automáticamente.';

// 3. Match — emparejar comando con lo que hace (pares 1 a 1, no "meter varios en pocas cajas").
export const MATCH_LEFT: MatchItem[] = [
  {id: 'a', text: '`git log --oneline`'},
  {id: 'b', text: '`git diff`'},
  {id: 'c', text: '`git branch -d nombre`'},
  {id: 'd', text: '`git stash pop`'},
  {id: 'e', text: '`git blame archivo.ts`'},
];
export const MATCH_RIGHT: MatchItem[] = [
  {id: 'd', text: 'Recupera el último cambio guardado sin confirmar y lo saca de la pila.'},
  {id: 'a', text: 'Historial resumido, una línea por commit.'},
  {id: 'e', text: 'Muestra quién modificó cada línea de un archivo, y en qué commit.'},
  {id: 'c', text: 'Borra una rama que ya se mergeó — si no se mergeó, lo rechaza.'},
  {id: 'b', text: 'Diferencia entre el working directory y el último commit.'},
];
export const MATCH_WHY: Record<string, string> = {
  a: '`--oneline` compacta cada commit a una línea: hash corto + mensaje, útil para mirar el historial rápido.',
  b: 'Sin argumentos, `git diff` compara el working directory contra el último commit — lo que todavía no confirmaste.',
  c: '`-d` (minúscula) es la versión segura: si la rama tiene commits que no llegaron a ningún lado, Git se niega a borrarla.',
  d: '`pop` aplica el cambio guardado con `stash` y además lo elimina de la pila, a diferencia de `apply`, que lo deja guardado.',
  e: '`blame` recorre línea por línea y dice en qué commit (y de quién) vino cada una — útil para encontrar el origen de un bug.',
};

// 4. CommandBuilder — armar el comando fragmento a fragmento.
export const BUILDER_PREFIX = 'git ';
export const BUILDER_STEPS: BuilderStep[] = [
  {
    options: ['branch', 'switch', 'log'],
    correct: 'switch',
    hint: 'Ese comando sirve para listar o borrar ramas, pero no te mueve a ninguna vos mismo.',
  },
  {
    options: ['-d', '-c', '-a'],
    correct: '-c',
    hint: '`-d` es para borrar una rama, no para crear una.',
  },
  {
    options: ['main', 'origin', 'feature/nueva-funcion'],
    correct: 'feature/nueva-funcion',
    hint: 'Ese nombre no tiene sentido como rama nueva para esta situación.',
  },
];
export const BUILDER_EXPLANATION =
  '`git switch -c` crea la rama y te mueve a ella en un solo paso — la versión moderna, pensada solo para cambiar de rama, de lo que antes se hacía con `git checkout -b`.';

// 5. MultiSelect — marcar TODAS las prácticas que corresponden, no una por una.
export const MULTISELECT_QUESTIONS: MultiSelectQuestion[] = [
  {
    prompt: 'Antes de abrir un Pull Request, ¿cuáles de estas prácticas corresponden? Marcá todas las que apliquen.',
    options: [
      {
        text: 'Traer los últimos cambios de main y resolver los conflictos localmente.',
        correct: true,
        why: 'Resolver el conflicto en tu máquina, con contexto, es más simple que resolverlo durante el merge del PR.',
      },
      {
        text: 'Revisar que los commits tengan mensajes que describan el cambio real.',
        correct: true,
        why: 'El historial sirve para quien lo lea después — un mensaje claro ahorra tiempo de revisión y de debugging futuro.',
      },
      {
        text: 'Hacer rebase de una rama que ya comparten dos compañeros más.',
        correct: false,
        why: 'Reescribe commits que esos compañeros ya tienen: sus copias quedan desincronizadas. Una rama compartida se integra con merge.',
      },
      {
        text: 'Asegurarte de que los tests pasen localmente antes de pedir revisión.',
        correct: true,
        why: 'Pedir revisión con tests rotos hace perder tiempo al revisor en algo que podrías haber visto vos primero.',
      },
      {
        text: 'Mergear directo en main sin abrir el PR, para ahorrar tiempo.',
        correct: false,
        why: 'Eso salta la revisión por completo — el PR existe justamente para que alguien más mire el cambio antes de integrarlo.',
      },
    ],
  },
];

// 6. DecisionPath — escenario encadenado, cada decisión lleva a la siguiente situación.
export const DECISION_START = 'start';
export const DECISION_NODES: Record<string, DecisionNode> = {
  start: {
    id: 'start',
    situation: 'Tenés cambios sin confirmar en tu rama y te piden atender un bug urgente en otra rama, ya mismo.',
    options: [
      {
        text: 'Guardar el trabajo con `git stash` y cambiar de rama.',
        correct: true,
        why: '`stash` guarda el cambio sin confirmarlo y deja el working directory limpio para moverte sin perder nada.',
        next: 'bug',
      },
      {
        text: 'Confirmar el cambio a medias con un commit "wip" para poder cambiar de rama.',
        correct: false,
        why: 'Un commit "wip" ensucia el historial con un mensaje que no describe nada real — justo para esto existe `stash`.',
      },
      {
        text: 'Cambiar de rama igual, dejando los cambios sin confirmar sueltos.',
        correct: false,
        why: 'Git puede directamente rechazar el cambio de rama si hay conflicto con los archivos modificados.',
      },
    ],
  },
  bug: {
    id: 'bug',
    situation: 'Arreglaste el bug en la otra rama y ya lo subiste. Volvés a tu rama original a seguir con lo de antes.',
    options: [
      {
        text: 'Volver a tu rama y recuperar el trabajo guardado con `git stash pop`.',
        correct: true,
        why: '`pop` aplica el último stash guardado y lo saca de la pila: tu working directory vuelve a como estaba.',
      },
      {
        text: 'Volver a tu rama y rehacer el cambio de nuevo, total era poco.',
        correct: false,
        why: 'Repetir el trabajo es evitable — el stash ya lo tiene guardado completo, esperando.',
      },
      {
        text: 'Hacer `git stash drop` y empezar de cero.',
        correct: false,
        why: '`drop` descarta el stash sin aplicarlo primero — perderías el cambio guardado.',
      },
    ],
  },
};
export const DECISION_EXPLANATION =
  '`stash` existe para este escenario exacto: pausar trabajo sin confirmar, atender algo urgente en otra rama, y retomarlo después con `pop` sin perder nada.';

// 7. SpotToken — señalar la palabra exacta dentro de la línea, no la línea entera.
export const SPOTTOKEN_PROMPT = '¿Cuál es la palabra de esta línea que causa el problema?';
export const SPOTTOKEN_ROUNDS: SpotTokenRound[] = [
  {
    line: 'git branch -D feature/login',
    targetIndex: 2,
    why: '`-D` (mayúscula) fuerza el borrado aunque la rama no esté mergeada a ningún lado — se pueden perder commits para siempre. La minúscula (`-d`) rechaza el borrado en ese caso.',
    hint: '¿Qué pasa si esta rama todavía no se mergeó en ningún lado?',
  },
  {
    line: 'git push --force origin main',
    targetIndex: 2,
    why: '`--force` sobrescribe el historial remoto sin preguntar — si alguien más tiene commits ahí, se pierden. Y la rama de destino acá es `main`, compartida por todo el equipo.',
    hint: '¿Qué rama está recibiendo este push — es tuya sola, o la comparte todo el equipo?',
  },
  {
    line: 'git checkout -- .',
    targetIndex: 3,
    why: 'El punto (`.`) aplica el descarte sobre TODO el working directory, no solo un archivo — se pierden todos los cambios sin confirmar, no solo el que se quería descartar.',
    hint: '¿Este comando afecta un archivo puntual, o todo el directorio?',
  },
];

// 8. Terminal — flujo de varios pasos, un comando real por paso.
export const TERMINAL_STEPS: TerminalStep[] = [
  {
    instruction: 'Actualizá tu main local con lo último del remoto, trayendo y fusionando en un solo paso.',
    accepted: ['git pull', 'git pull origin main'],
    hint: 'Es el comando que combina fetch + merge en un solo paso.',
    output: 'Updating 1a2b3c4..4d5e6f7\nFast-forward',
  },
  {
    instruction: 'Creá la rama fix/navbar-overlap y movete a ella en un solo comando.',
    accepted: ['git checkout -b fix/navbar-overlap', 'git switch -c fix/navbar-overlap'],
    hint: 'Usá el flag que crea Y cambia de rama a la vez (`checkout -b`, o `switch -c`).',
    output: "Switched to a new branch 'fix/navbar-overlap'",
  },
  {
    instruction: 'Confirmá el cambio en src/navbar.css con un mensaje que describa el arreglo.',
    accepted: ['git commit -m *'],
    hint: 'Tiene que ser `git commit -m` seguido de un mensaje entre comillas.',
    output: '[fix/navbar-overlap 9f1c2aa] mensaje de commit\n 1 file changed, 1 insertion(+), 1 deletion(-)',
  },
  {
    instruction: 'Subí la rama al remoto por primera vez, vinculándola con su upstream.',
    accepted: ['git push -u origin fix/navbar-overlap', 'git push --set-upstream origin fix/navbar-overlap'],
    hint: 'Como la rama es nueva en el remoto, hace falta el flag que la vincula (upstream), además de `origin` y el nombre.',
    output: "Branch 'fix/navbar-overlap' set up to track 'origin/fix/navbar-overlap'.",
  },
];
export const TERMINAL_EXPLANATION =
  'Este es el flujo típico de una feature chica: actualizar main, crear la rama, confirmar con un mensaje claro, y subirla vinculada al remoto para después abrir el Pull Request.';
