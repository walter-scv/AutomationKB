import type {CodeLine} from '@site/src/components/FindInCode';
import type {QuizQuestion} from '@site/src/components/Quiz';

export const TOOL_RULE_LABELS = [
  'Había que descartar un cambio sin confirmar (`restore`), no deshacer un commit (`revert`)',
  'Había que guardar el cambio (`stash`), no descartarlo (`restore`)',
  'Había que deshacer un commit compartido (`revert`), no reescribir el historial',
];

export const TOOL_LINES: CodeLine[] = [
  {
    code: 'Con un cambio a medias que todavía sirve, alguien corre `git restore src/validar.ts` para cambiar de rama y atender un bug urgente.',
    rule: 2,
    why: '`restore` devuelve el archivo al último commit y borra lo que había sin confirmar: ese trabajo a medias se pierde. Para dejarlo guardado mientras se atiende otra cosa, `stash` es la herramienta.',
    hint: '¿Ese trabajo a medias se va a necesitar cuando termine el bug urgente?',
  },
  {
    code: 'Con cambios sin confirmar, alguien corre `git stash`, atiende el bug en otra rama y después recupera todo con `git stash pop`.',
    rule: 0,
    why: 'Guarda el trabajo sin confirmarlo, cambia de contexto y lo recupera: es el uso para el que existe stash. No se pierde nada ni se ensucia el historial.',
    hint: '¿El trabajo sin confirmar se pierde con este flujo, o se recupera después?',
  },
  {
    code: 'Alguien quiere descartar cambios sin confirmar en un archivo y corre `git revert HEAD` para "volver atrás".',
    rule: 1,
    why: '`revert` deshace el último commit creando otro, no toca los cambios sin confirmar del working directory. Acá se termina deshaciendo un commit entero (que puede ser de otra persona) y el archivo sigue como estaba.',
    hint: '¿El cambio que quiere descartar ya está en un commit, o todavía no se confirmó?',
  },
  {
    code: 'El último commit de main, que ya bajaron tres compañeros, se deshace con `git commit --amend` y `git push --force`.',
    rule: 3,
    why: 'Amend reescribe el último commit y el push forzado pisa el remoto: las copias de esos tres compañeros quedan desincronizadas. Para un commit compartido corresponde `revert`, que agrega uno nuevo sin tocar el historial existente.',
    hint: '¿Las otras personas ya tienen ese commit en sus clones?',
  },
  {
    code: 'Alguien prueba un cambio, no le convence y, antes de commitear, corre `git restore src/precios.ts` para volver al estado anterior.',
    rule: 0,
    why: 'El cambio no estaba confirmado y no servía: descartarlo con restore es exactamente el caso. No hay historial que reescribir ni trabajo que conservar.',
    hint: '¿Ese cambio ya estaba confirmado, o todavía no?',
  },
  {
    code: 'Antes de cambiar de rama, alguien guarda el trabajo a medias con `git stash` y lo recupera al volver.',
    rule: 0,
    why: 'El cambio no estaba confirmado y se conserva para después: es el uso correcto de stash, sin descartar ni reescribir ningún commit.',
    hint: '¿Ese cambio se pierde, se guarda o se reescribe?',
  },
  {
    code: 'Un commit compartido se deshace con `git revert`; el commit nuevo queda con un mensaje que explica qué se revirtió y por qué.',
    rule: 0,
    why: 'Revierte sin borrar el historial y deja el motivo escrito: cualquiera que vea ese commit entiende por qué el cambio anterior ya no aplica.',
    hint: '¿Este commit ya estaba compartido con el equipo?',
  },
];

export const PRACTICE_RULE_LABELS = [
  'Revirtió sin confirmar antes cuál era el commit correcto',
  'Revirtió algo compartido sin avisar al equipo',
  'Dejó un `stash` guardado y olvidado',
];

export const PRACTICE_LINES: CodeLine[] = [
  {
    code: 'Un compañero revierte un commit de main que ya habían bajado otros dos, y recién lo comenta en el daily del día siguiente.',
    rule: 2,
    why: 'El revert es correcto en sí, pero el equipo ve "desaparecer" un cambio sin saber por qué. Avisar en el momento evita que dos personas investiguen o vuelvan a introducir lo revertido.',
    hint: '¿Las otras personas saben por qué ese cambio ya no está?',
  },
  {
    code: 'Antes de revertir, la persona corre `git log --oneline` y confirma el id del commit que quiere deshacer.',
    rule: 0,
    why: 'Confirmar el id contra el cambio real evita revertir un commit parecido pero equivocado. Es la verificación previa que recomienda la entrada.',
    hint: '¿Se confirmó el commit correcto antes de revertir?',
  },
  {
    code: 'Alguien revierte el commit que está arriba de todo en `git log`, sin revisar si es el que introdujo el bug.',
    rule: 1,
    why: 'El commit más reciente no es necesariamente el culpable: puede ser un cambio de documentación hecho después. Revertirlo deshace otra cosa y el bug sigue.',
    hint: '¿Ese hash coincide con el cambio que realmente introdujo el problema?',
  },
  {
    code: 'Alguien guarda un stash con `git stash push -m "validación de teléfono a medias"` y lo recupera al día siguiente.',
    rule: 0,
    why: 'El mensaje identifica qué hay adentro y se recupera al día siguiente: no queda olvidado ni se pierde. Es el uso prolijo de stash.',
    hint: '¿Este stash queda identificado y se recupera, o se olvida?',
  },
  {
    code: 'En la rama hay un `git stash` de hace tres semanas con cambios de una validación; nadie recuerda qué contiene ni si sigue haciendo falta.',
    rule: 3,
    why: 'Un stash sin dueño claro ni descripción se vuelve basura que nadie se anima a borrar. Si nadie recuerda qué era, el trabajo que protegía ya está perdido en la práctica.',
    hint: '¿Alguien puede decir qué hay ahí sin abrirlo?',
  },
  {
    code: 'Se revierte un commit compartido con `git revert`, se avisa en el canal y el commit nuevo queda explicando qué se deshizo.',
    rule: 0,
    why: 'Revierte sin reescribir, avisa al equipo y deja el motivo en el historial: las tres cosas que hacen seguro deshacer algo compartido.',
    hint: '¿El equipo se entera de este revert, o queda en silencio?',
  },
  {
    code: 'Antes de descartar un cambio sin confirmar, la persona corre `git diff` para confirmar que no haya otra modificación mezclada en el archivo.',
    rule: 0,
    why: 'Revisar el diff antes de descartar evita borrar algo que no se quería perder. Descartar con restore es válido si primero se comprobó qué había.',
    hint: '¿Se revisó qué había antes de descartar con restore?',
  },
];

export const CLOSING_QUIZ: QuizQuestion[] = [
  {
    question:
      'Después de un `revert`, un compañero ve el commit nuevo con el mensaje "Revert ..." y propone borrarlo para que el historial quede limpio. ¿Qué le respondés?',
    options: [
      {text: 'Que lo borre con un rebase: un historial lineal siempre es preferible, aunque el commit ya esté compartido.', correct: false, why: 'Rebasear algo compartido reescribe commits que otros ya bajaron. La prolijidad no compensa romper las copias locales del equipo.'},
      {text: 'Que da igual: `revert` no deja ningún commit, solo mueve la rama hacia atrás.', correct: false, why: 'Revert no mueve la rama: crea un commit nuevo con el cambio inverso. Justamente por eso el historial conserva el registro.'},
      {text: 'Que lo deje: ese commit es el registro de que algo se deshizo, y borrarlo obligaría a reescribir historial compartido.', correct: true, why: 'El revert existe justamente para deshacer sin borrar. Eliminarlo después devuelve el problema original: reescribir commits que otros ya tienen.'},
    ],
  },
];
