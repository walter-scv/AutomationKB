import type {CodeLine} from '@site/src/components/FindInCode';
import type {QuizQuestion} from '@site/src/components/Quiz';

export const REBASE_RULE_LABELS = [
  'Rebasea por costumbre, sin un problema concreto que resolver',
  'Reescribe una rama que ya es compartida por el equipo',
];

export const REBASE_LINES: CodeLine[] = [
  {
    code: 'Para "prolijar" el historial antes del release, alguien rebasea main, que todo el equipo tiene descargada.',
    rule: 2,
    why: 'Más allá del motivo para querer un historial más prolijo, acá el problema es otro: main ya está en las copias de todos, y reescribirla deja a cada compañero con un historial distinto del remoto.',
    hint: '¿Quién más tiene esa rama en su máquina ahora?',
  },
  {
    code: 'Alguien rebasea su rama feature/exportar contra origin/main antes de subirla por primera vez.',
    rule: 0,
    why: 'La rama todavía no se subió y nadie más la tiene: reescribirla no afecta a nadie. Es el caso en el que rebase es seguro.',
    hint: '¿Alguien más tiene esta rama todavía?',
  },
  {
    code: 'Alguien rebasea su rama local después de cada commit, incluso cuando main no cambió, solo para que el historial quede recto.',
    rule: 1,
    why: 'Si main no cambió, no hay nada que reordenar: el rebase repite la misma historia con otro hash y suma una chance de conflicto. La costumbre no reemplaza un motivo.',
    hint: '¿Qué cambió en main entre un rebase y el siguiente?',
  },
  {
    code: 'Un compañero rebasea fix/logo contra main para que el PR no arrastre un commit de merge, en una rama propia que nadie más descargó.',
    rule: 0,
    why: 'Aunque el rebase sea una decisión de estilo, la rama es propia y nadie más la tiene: reescribirla no deja copias ajenas desincronizadas. El motivo además es concreto: evitar el commit de merge en el PR.',
    hint: '¿Esta rama ya la descargó alguien más?',
  },
  {
    code: 'Se rebasea la rama feature/login que un compañero bajó ayer para sumar sus propios commits.',
    rule: 2,
    why: 'Ese compañero ya la bajó para seguir trabajando: al reescribirla, su copia deja de coincidir con la rama remota. La rama ya no es solo del autor.',
    hint: '¿Quién más tiene esa rama en su máquina ahora?',
  },
  {
    code: 'Alguien hace `git pull --rebase` en su rama local de un día, sin push, para traer los últimos cambios de main.',
    rule: 0,
    why: 'Es una rama propia y local: traer main con rebase reescribe solo commits que nadie más tiene. Mantiene el historial lineal sin riesgo para el equipo.',
    hint: '¿Esta rama ya se compartió con el remoto?',
  },
  {
    code: 'La rama release/2.2 la usa QA para probar; alguien la rebasea para "dejarla al día" con main.',
    rule: 2,
    why: 'QA ya descargó esa rama para probar: reescribirla cambia los commits que tienen y les rompe la referencia. Una rama compartida se integra con merge, no se reescribe.',
    hint: '¿Quién más trabaja sobre esa rama de release?',
  },
];

export const PRACTICE_RULE_LABELS = [
  'Abandonó el rebase a mitad de camino sin resolver ni cancelar',
  'Usó `--force` en vez de `--force-with-lease` al re-subir',
  'Resolvió los conflictos sin entender ni probar cada paso',
];

export const PRACTICE_LINES: CodeLine[] = [
  {
    code: 'Durante un rebase de cinco commits, se resuelven los conflictos de los cinco de una vez y se prueba recién al final.',
    rule: 3,
    why: 'Si algo falla al final, no se sabe en cuál de los cinco commits se introdujo el error. Resolver y probar de a uno mantiene cada paso verificable.',
    hint: 'Si al final falla algo, ¿en qué commit se introdujo?',
  },
  {
    code: 'Después de rebasear su rama, la persona corre `git push --force-with-lease` para re-subirla.',
    rule: 0,
    why: 'Ese es el comando seguro para reescribir una rama propia en el remoto: rechaza el push si alguien subió algo que la persona no tenía.',
    hint: '¿Este comando pisa a ciegas, o frena si alguien más subió algo?',
  },
  {
    code: 'Para re-subir la rama rebaseada, alguien corre `git push --force` sin mirar si el remoto cambió.',
    rule: 2,
    why: '`--force` pisa el remoto sin comparar: si un compañero subió un commit mientras se rebaseaba, ese commit desaparece. `--force-with-lease` habría frenado el push.',
    hint: '¿Qué pasa si alguien subió un commit mientras rebaseabas?',
  },
  {
    code: 'Con tres conflictos pendientes, alguien cierra la terminal y deja el rebase a medias, sin `--abort` ni `--continue`.',
    rule: 1,
    why: 'El repositorio queda en un estado intermedio: HEAD separado y commits a medio aplicar. Hay que terminarlo o cancelarlo explícitamente, no abandonarlo.',
    hint: '¿En qué estado queda el repositorio para el próximo comando?',
  },
  {
    code: 'Un rebase queda a medias por un conflicto; la persona decide cancelarlo con `git rebase --abort` y volver al estado anterior.',
    rule: 0,
    why: 'Cancelar es una salida válida cuando no conviene seguir: `--abort` devuelve la rama al punto de partida sin dejar el repositorio colgado.',
    hint: '¿El repositorio queda en un estado intermedio confuso, o se resuelve?',
  },
  {
    code: 'Antes de rebasear, la persona avisa que va a reescribir su rama y confirma que nadie más la está usando.',
    rule: 0,
    why: 'La verificación de quién tiene la rama es la que hace seguro el rebase; avisar cubre el caso de alguien que empezó a mirarla sin descargarla formalmente.',
    hint: '¿Se verificó quién tiene la rama antes de reescribirla?',
  },
  {
    code: 'En un rebase con conflictos, se elige una versión al azar para poder avanzar rápido al siguiente commit.',
    rule: 3,
    why: 'Elegir sin entender qué hacía cada versión puede descartar un cambio necesario en un commit y arrastrar el problema a los siguientes. Cada conflicto se resuelve leyendo ambos lados.',
    hint: '¿Qué cambio de la otra versión puede quedar afuera?',
  },
];

export const CLOSING_QUIZ: QuizQuestion[] = [
  {
    question:
      '¿En qué se diferencia `git rebase` de `git merge` al integrar cambios de una rama en otra?',
    options: [
      {text: 'Merge agrega un commit que une los historiales; rebase reescribe los commits de una rama sobre la otra y deja el historial lineal.', correct: true, why: 'Los dos integran los mismos cambios, pero el resultado es distinto: con nudo (merge) o lineal (rebase).'},
      {text: 'Merge reescribe los commits existentes; rebase crea un commit nuevo que une los historiales.', correct: false, why: 'Es al revés: rebase reescribe commits y merge agrega un commit de unión sin tocarlos.'},
      {text: 'Los dos son equivalentes en el historial; la única diferencia es que rebase se usa solo en main.', correct: false, why: 'No son equivalentes: cambia la forma del historial y, sobre todo, si se reescriben commits. Además rebase no es para main justamente por eso.'},
    ],
  },
  {
    question:
      'Rebaseaste tu rama y, mientras tanto, un compañero subió un commit a esa misma rama. Al pushear, el remoto lo rechaza. ¿Qué hacés?',
    options: [
      {text: '`git push --force`, porque el rebase es tuyo y el commit del compañero se puede volver a subir después.', correct: false, why: 'El force borra del remoto el commit del compañero; no hay forma de "volver a subirlo" si se perdió la referencia. Forzar sin mirar es exactamente lo que hay que evitar.'},
      {text: 'Traer el commit nuevo con `git pull` (merge), resolver lo que haga falta y re-subir con `git push`, sin rebasear la rama compartida.', correct: true, why: 'La rama ya la usa otra persona: se integra lo que subió con merge y se publica sin reescribir. Volver a rebasear cambiaría los commits que el compañero ya tiene.'},
      {text: 'Volver a mergear todo en main y abrir un PR nuevo, porque la rama quedó inutilizable.', correct: false, why: 'La rama no está inutilizable: el push fue rechazado, no se perdió nada. Hay que integrar el commit nuevo y recién ahí re-subir.'},
    ],
  },
];
