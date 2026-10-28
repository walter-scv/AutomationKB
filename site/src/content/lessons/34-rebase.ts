import type {CodeLine} from '@site/src/components/FindInCode';
import type {QuizQuestion} from '@site/src/components/Quiz';
import type {TerminalStep} from '@site/src/components/Terminal';

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

export const REBASE_STEPS: TerminalStep[] = [
  {
    instruction: 'Estás en feature/cupones, una rama que solo usás vos y ya subiste una vez. Rebaseala sobre la última versión de main del remoto (ya hiciste fetch).',
    accepted: ['git rebase origin/main'],
    hint: 'Es `git rebase` seguido de la rama sobre la que querés reaplicar tus commits: la copia remota de main.',
    output: 'Auto-merging cupones.ts\nCONFLICT (content): Merge conflict in cupones.ts\nerror: could not apply 4c2d1e0... Validar largo del código de cupón',
  },
  {
    instruction: 'Resolviste el conflicto de ese commit leyendo las dos versiones y probaste que compila. Marcá cupones.ts como resuelto.',
    accepted: ['git add cupones.ts'],
    hint: 'Un conflicto se marca como resuelto igual que cualquier cambio: agregándolo al staging area.',
    output: '',
  },
  {
    instruction: 'Seguí con el próximo commit del rebase, sin cancelarlo.',
    accepted: ['git rebase --continue'],
    hint: 'Es el mismo `git rebase`, con el flag que dice "seguí".',
    output: 'Successfully rebased and updated refs/heads/feature/cupones.',
  },
  {
    instruction: 'Re-subí la rama rebaseada, pero sin pisar commits que alguien pudiera haber subido mientras tanto.',
    accepted: ['git push --force-with-lease', 'git push --force-with-lease origin feature/cupones'],
    hint: '`--force` a secas pisa cualquier cosa que haya en el remoto. Hay una versión del flag que primero chequea que el remoto no haya cambiado.',
    output: '+ 9a1b2c3...7f8e9d0 feature/cupones -> feature/cupones (forced update)',
  },
];
export const REBASE_EXPLANATION =
  'Un rebase con conflictos se resuelve commit por commit: resolvés, probás, marcás con `git add` y seguís con `--continue` (o cancelás todo con `--abort`, pero nunca lo dejás a medias). Y como los commits cambiaron, se re-sube con `--force-with-lease`, que se niega a pisar el remoto si alguien subió algo mientras tanto.';

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
