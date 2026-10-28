import type {TerminalStep} from '@site/src/components/Terminal';
import type {CodeLine} from '@site/src/components/FindInCode';
import type {QuizQuestion} from '@site/src/components/Quiz';
import type {DecisionNode} from '@site/src/components/DecisionPath';
import type {SpotTokenRound} from '@site/src/components/SpotToken';

export const UNDO_START = 'sinconfirmar';
export const UNDO_NODES: Record<string, DecisionNode> = {
  sinconfirmar: {
    id: 'sinconfirmar',
    situation: 'Probaste un cambio en `precios.ts`, no te convence y no lo confirmaste. Querés que el archivo vuelva a estar como en el último commit. ¿Qué corrés?',
    options: [
      {
        text: '`git revert HEAD`',
        correct: false,
        why: '`revert` deshace un commit ya confirmado creando otro commit. Tu cambio no está confirmado: `revert` desharía el último commit, que no tiene nada que ver.',
      },
      {
        text: '`git stash`',
        correct: false,
        why: '`stash` guarda el cambio para recuperarlo después. Vos no lo querés recuperar: querés descartarlo, y un stash olvidado es justamente un anti-patrón.',
      },
      {
        text: '`git restore precios.ts`',
        correct: true,
        why: 'El cambio no está confirmado y lo querés descartar: `restore` vuelve el archivo al último commit.',
        next: 'compartido',
      },
    ],
  },
  compartido: {
    id: 'compartido',
    situation: 'Otro problema: ayer confirmaste y subiste a `main` un commit que rompió el cálculo de cuotas, y dos compañeros ya lo bajaron. ¿Cómo lo deshacés?',
    options: [
      {
        text: '`git restore cuotas.ts` y volver a subir.',
        correct: false,
        why: '`restore` solo descarta cambios sin confirmar. El commit ya está en el historial: el archivo ya coincide con él, así que no cambia nada.',
      },
      {
        text: '`git revert <id-del-commit>`, que crea un commit nuevo con el cambio contrario.',
        correct: true,
        why: 'Está confirmado y compartido: `revert` lo deshace sin reescribir el historial que tus compañeros ya tienen, y deja registro de que se deshizo.',
      },
      {
        text: 'Borrar ese commit del historial de `main` y volver a subir la rama, como si nunca hubiera existido.',
        correct: false,
        why: 'Eso reescribe un historial que otros ya bajaron: sus copias quedan desincronizadas con `main`, y no queda registro de qué se deshizo.',
      },
    ],
  },
};
export const UNDO_EXPLANATION =
  'La pregunta que decide es si el cambio ya está confirmado. Sin confirmar: `restore` para descartarlo (o `stash` si lo querés guardar). Confirmado y compartido: `revert`, que deshace con un commit nuevo en vez de borrar historia.';

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

export const CMD_PROMPT = '¿Qué palabra del comando no hace lo que dice el comentario?';
export const CMD_ROUNDS: SpotTokenRound[] = [
  {
    line: 'git stash drop   # recuperar el trabajo que guardé antes de cambiar de rama',
    targetIndex: 2,
    why: '`drop` descarta lo guardado sin aplicarlo: el trabajo se pierde. Para recuperarlo es `git stash pop`.',
    hint: 'Este comando, ¿aplica lo guardado o lo tira?',
  },
  {
    line: 'git revert carrito.ts   # descartar lo que cambié recién, todavía sin confirmar',
    targetIndex: 1,
    why: '`revert` deshace un commit ya confirmado. Para descartar un cambio sin confirmar es `git restore carrito.ts`.',
    hint: 'El cambio todavía no está confirmado. ¿Esta herramienta trabaja sobre cambios sueltos o sobre commits?',
  },
  {
    line: 'git restore carrito.ts   # deshacer el commit de ayer, que el equipo ya bajó',
    targetIndex: 1,
    why: '`restore` solo descarta cambios sin confirmar. Un commit compartido se deshace con `git revert <id>`, que deja registro sin reescribir el historial.',
    hint: 'Lo que se quiere deshacer ya está confirmado y compartido. ¿Cuál de las tres herramientas es para eso?',
  },
];

export const REFLOG_STEPS: TerminalStep[] = [
  {
    instruction: 'Hace un rato corriste git reset --hard HEAD~3 en tu rama fix/filtro-fechas y te diste cuenta de que esos tres commits sí servían. Mostrá el registro de movimientos de HEAD.',
    accepted: ['git reflog'],
    hint: 'Es el comando que lista las posiciones por las que pasó HEAD, no el historial de la rama.',
    output: '1c2d3e4 (HEAD -> fix/filtro-fechas) HEAD@{0}: reset: moving to HEAD~3\n8f9e0d1 HEAD@{1}: commit: Aceptar fechas con formato día/mes/año\n6a7b8c9 HEAD@{2}: commit: Rechazar una fecha final anterior a la inicial\n5e4f3a2 HEAD@{3}: commit: Agregar el filtro por rango de fechas\n1c2d3e4 HEAD@{4}: commit: Listar los pedidos del mes',
  },
  {
    instruction: 'Sin tocar la rama actual, creá una rama llamada filtro-recuperado que apunte a donde estaba la rama justo antes del reset.',
    accepted: ['git branch filtro-recuperado 8f9e0d1', 'git branch filtro-recuperado HEAD@{1}'],
    hint: 'Buscá en el reflog la línea inmediatamente anterior al reset, y usá `git branch <nombre> <commit>`.',
    output: '',
  },
  {
    instruction: 'Comprobá que la rama nueva tiene los tres commits: mostrá su historial en formato corto.',
    accepted: ['git log --oneline filtro-recuperado'],
    hint: '`git log` en formato de una línea, indicando el nombre de la rama nueva.',
    output: '8f9e0d1 (filtro-recuperado) Aceptar fechas con formato día/mes/año\n6a7b8c9 Rechazar una fecha final anterior a la inicial\n5e4f3a2 Agregar el filtro por rango de fechas\n1c2d3e4 (HEAD -> fix/filtro-fechas) Listar los pedidos del mes',
  },
];
export const REFLOG_EXPLANATION =
  'El reflog guarda dónde estuvo HEAD: `HEAD@{1}` (el commit `8f9e0d1`) es la posición anterior al reset. Crear una rama ahí recupera los tres commits sin modificar la rama actual; después se puede decidir con calma si se vuelve la rama con `git reset --hard 8f9e0d1` o se mergea.';
