import type {CodeLine} from '@site/src/components/FindInCode';
import type {QuizQuestion} from '@site/src/components/Quiz';

export const BRANCH_RULE_LABELS = [
  'El cambio se hace directo en main, sin rama propia',
  'Creó la rama después de empezar a editar en main',
  'El nombre no describe qué se está haciendo',
];

export const BRANCH_LINES: CodeLine[] = [
  {
    code: 'git checkout -b fix/validacion-email-registro',
    rule: 0,
    why: 'El nombre dice qué se corrige y en qué parte. Quien vea la rama en el remoto entiende el alcance sin abrirla.',
    hint: '¿Este nombre dice qué cambio contiene la rama?',
  },
  {
    code: 'git checkout -b pruebas-finales',
    rule: 3,
    why: '"pruebas-finales" no dice qué se está probando ni qué cambio contiene. En una semana no se distingue de cualquier otra rama olvidada.',
    hint: '¿Este nombre te dice qué cambio contiene la rama?',
  },
  {
    code: 'Para no abrir un Pull Request por un arreglo de dos líneas, el commit del login se hace sobre la rama que todo el equipo usa a diario.',
    rule: 1,
    why: 'Aunque sea un cambio chico, el commit va directo a la rama compartida. Sin una rama propia no hay forma de revisarlo ni de sacarlo sin afectar a los demás.',
    hint: '¿Este cambio se hizo en una rama separada, o directo en la rama principal?',
  },
  {
    code: 'Antes de empezar, se corre `git checkout main`, después `git pull`, y recién ahí `git checkout -b fix/operador-comparacion`.',
    rule: 0,
    why: 'La rama nueva parte de main actualizado: no arrastra cambios viejos y evita conflictos innecesarios cuando llegue el momento de integrarla.',
    hint: '¿La rama parte de main actualizado, o de un estado viejo?',
  },
  {
    code: 'Ya hay dos archivos modificados en `main`; recién ahí se crea `feature/validar-contraseña` y se mueven los cambios.',
    rule: 2,
    why: 'Crear la rama después de editar obliga a mover cambios que ya estaban mezclados con main. Es más simple crear la rama antes de tocar nada.',
    hint: '¿La rama existía antes de que empezaran los cambios en main?',
  },
  {
    code: 'git checkout -b mejoras',
    rule: 3,
    why: '"mejoras" puede ser cualquier cosa: rendimiento, textos, estilos. El nombre no acota el cambio, así que no ayuda a revisarlo ni a decidir cuándo mergearlo.',
    hint: '¿Qué tipo de mejora contiene esta rama, según el nombre?',
  },
  {
    code: 'Se crea `fix/timeout-carrito` desde `main` actualizado, se hace un solo commit y se mergea el mismo día.',
    rule: 0,
    why: 'Una rama corta, con un cambio acotado y creada desde main al día, es fácil de revisar y de integrar.',
    hint: '¿Esta rama vive mucho tiempo antes de mergearse, o es corta?',
  },
];

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
