import type {TerminalStep} from '@site/src/components/Terminal';
import type {CodeLine} from '@site/src/components/FindInCode';
import type {QuizQuestion} from '@site/src/components/Quiz';
import type {FillBlankSlot} from '@site/src/components/FillBlank';

export const START_BRANCH_TEMPLATE = 'git checkout {{base}}\ngit {{update}}\ngit checkout {{flag}} {{name}}';
export const START_BRANCH_SLOTS: FillBlankSlot[] = [
  {id: 'base', answer: 'main'},
  {id: 'update', answer: 'pull'},
  {id: 'flag', answer: '-b'},
  {id: 'name', answer: 'fix/total-con-envio'},
];
export const START_BRANCH_BANK = ['feature/reportes', '-d', 'pull', 'mejoras', 'main', 'push', 'fix/total-con-envio', '-b'];
export const START_BRANCH_EXPLANATION =
  'Primero te parás en `main` y lo actualizás con `pull`, para que la rama nueva arranque del código más reciente (partir de `feature/reportes`, una rama de otro compañero sin mergear, arrastraría cambios sin revisar). Después, `-b` crea la rama y te mueve a ella (`-d` es para borrar). Y el nombre dice qué se arregla: `mejoras` no le dice nada a nadie dentro de una semana.';

export const PRACTICE_RULE_LABELS = [
  'Quedaron ramas viejas acumuladas, sin resolver ni borrar',
  'Se creó a partir de otra rama vieja, no de main actualizado',
  'La rama mezcla varios cambios sin relación',
];

export const PRACTICE_LINES: CodeLine[] = [
  {
    code: 'La rama `feature/validar-contraseña` también corrige el README y actualiza una dependencia sin relación.',
    rule: 3,
    why: 'Una rama con tres cambios distintos es difícil de revisar y de mergear: si hay que revertir la validación, se van también el README y la dependencia.',
    hint: '¿Todos los cambios de esta rama tienen que ver con una sola cosa?',
  },
  {
    code: '`feature/exportar-pdf` se crea desde main actualizado, se mergea a los dos días y se borra.',
    rule: 0,
    why: 'Rama corta, un solo cambio y creada desde main: se revisa rápido y no acumula diferencias con la rama principal.',
    hint: '¿Esta rama queda acumulada después de mergearse, o se borra?',
  },
  {
    code: 'Después de mergear tres features, las tres ramas siguen en el repositorio y nadie recuerda cuáles ya se mergearon.',
    rule: 1,
    why: 'Una rama mergeada que sigue viva genera ruido: no aporta trabajo pendiente y confunde sobre cuáles siguen activas.',
    hint: '¿Esas ramas siguen teniendo trabajo pendiente, o ya se mergearon?',
  },
  {
    code: 'Antes de crear la rama, se corre `git checkout main` y `git pull`.',
    rule: 0,
    why: 'Partir de main actualizado evita arrastrar cambios viejos y reduce los conflictos del merge. Es un paso previo, no parte del cambio.',
    hint: '¿Este paso evita arrastrar cambios viejos a la rama nueva?',
  },
  {
    code: '`fix/operador-comparacion` se crea desde `feature/reportes`, una rama de otro compañero que todavía no se mergeó.',
    rule: 2,
    why: 'La rama nueva arrastra los cambios no revisados de la otra. Cuando ambas se integren, el merge es más difícil y puede meter código que nadie aprobó.',
    hint: '¿Esta rama nueva parte de main, o de otra rama que todavía no se mergeó?',
  },
  {
    code: 'Hay una rama `experimento-2024` que nadie tocó en ocho meses y nadie recuerda si su cambio llegó a main.',
    rule: 1,
    why: 'Una rama vieja sin mergear ni borrar deja una duda abierta: no se sabe si contiene trabajo pendiente o si ya se integró. Conviene resolverla o borrarla.',
    hint: '¿Qué trabajo pendiente tiene esa rama, y alguien lo va a mergear?',
  },
  {
    code: 'Antes de mergear, se actualiza la rama con main, se corren los tests y después se borra la rama.',
    rule: 0,
    why: 'Actualizar antes del merge reduce conflictos, los tests confirman que el cambio sigue funcionando y borrar la rama después evita que quede como ruido.',
    hint: '¿Queda esta rama viva después de mergeada?',
  },
];

export const CLOSING_QUIZ: QuizQuestion[] = [
  {
    question: '¿Por qué conviene hacer un cambio en una rama propia en vez de directo en `main`?',
    options: [
      {text: 'Porque Git compila más rápido cuando los commits están repartidos en varias ramas.', correct: false, why: 'La velocidad de Git no depende de la cantidad de ramas. Lo que cambia es el aislamiento del trabajo y la posibilidad de revisarlo antes de integrarlo.'},
      {text: 'Porque aísla el trabajo: podés cambiar, deshacer o seguir editando sin afectar lo que el resto del equipo tiene en main.', correct: true, why: 'Además, permite que el equipo revise el cambio en un Pull Request antes de que llegue a la rama principal.'},
      {text: 'Porque así el cambio nunca puede generar conflictos al mergearse.', correct: false, why: 'Trabajar en una rama no elimina los conflictos: si main cambió en las mismas líneas, el conflicto aparece igual. La rama aísla, no sincroniza mágicamente.'},
    ],
  },
  {
    question: '¿Qué hace exactamente `git checkout -b fix/timeout-carrito`?',
    options: [
      {text: 'Guarda los cambios sin confirmar para poder cambiar de rama sin perderlos.', correct: false, why: 'Eso es `git stash`. `checkout -b` crea y cambia de rama; no toca los cambios pendientes por sí solo.'},
      {text: 'Clona el repositorio en una carpeta nueva con el nombre de la rama.', correct: false, why: '`checkout -b` no clona nada: trabaja dentro del mismo repositorio. El clon crea otra copia completa, no una rama.'},
      {text: 'Crea la rama `fix/timeout-carrito` y se cambia a ella en el mismo paso.', correct: true, why: 'Equivale a `git branch fix/timeout-carrito` (crear) más `git checkout fix/timeout-carrito` (cambiarse). Al terminar, los próximos commits van a esa rama.'},
    ],
  },
];

export const BRANCHES_STEPS: TerminalStep[] = [
  {
    instruction: 'Mostrá las ramas locales y en cuál estás trabajando.',
    accepted: ['git branch'],
    hint: 'Es el comando de ramas sin ninguna opción ni nombre.',
    output: '  fix/fecha-vencida\n* feature/exportar-pdf\n  main',
  },
  {
    instruction: 'Cambiá a main.',
    accepted: ['git switch main', 'git checkout main'],
    hint: 'Es el comando que cambia a una rama que ya existe.',
    output: 'error: Your local changes to the following files would be overwritten by checkout:\n        reporte.ts\nPlease commit your changes or stash them before you switch branches.',
  },
  {
    instruction: 'Git se negó. El cambio de reporte.ts ya está terminado: agregalo para confirmarlo.',
    accepted: ['git add reporte.ts'],
    hint: 'Antes de un commit, el archivo tiene que pasar al staging area.',
    output: '',
  },
  {
    instruction: 'Confirmalo con un mensaje que describa el cambio.',
    accepted: ['git commit -m *'],
    hint: 'Es git commit con la opción del mensaje, y el mensaje entre comillas.',
    output: '[feature/exportar-pdf 4c2b9e1] Agregar el pie de página al reporte en PDF\n 1 file changed, 6 insertions(+)',
  },
  {
    instruction: 'El equipo pidió que la rama se llame feature/exportar-reporte-pdf. Renombrala.',
    accepted: ['git branch -m feature/exportar-pdf feature/exportar-reporte-pdf', 'git branch -m feature/exportar-reporte-pdf'],
    hint: 'Es git branch con la opción de renombrar, seguida del nombre actual y el nuevo.',
    output: '',
  },
  {
    instruction: 'Ahora sí, cambiá a main.',
    accepted: ['git switch main', 'git checkout main'],
    hint: 'Es el mismo comando que antes: ahora no hay cambios sin confirmar.',
    output: "Switched to branch 'main'",
  },
  {
    instruction: 'La rama fix/fecha-vencida ya se integró a main hace días. Borrala de forma segura.',
    accepted: ['git branch -d fix/fecha-vencida'],
    hint: 'Es git branch con la opción de borrado que se niega si hay trabajo sin integrar (en minúscula).',
    output: 'Deleted branch fix/fecha-vencida (was 2a7d3f0).',
  },
];
export const BRANCHES_EXPLANATION =
  '`git branch` marca con `*` la rama actual. Con cambios sin confirmar que chocan con la rama de destino, Git se niega a cambiar: se confirman (o se guardan con stash) y recién después se cambia. `git branch -m` renombra y `-d` borra solo si la rama ya está integrada; `-D` la borraría aunque no lo estuviera.';
