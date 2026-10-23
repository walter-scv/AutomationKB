import type {CodeLine} from '@site/src/components/FindInCode';
import type {QuizQuestion} from '@site/src/components/Quiz';

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
