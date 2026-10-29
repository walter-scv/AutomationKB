# Guía de tipos de ejercicio

Cómo armar cada tipo de actividad del sitio: cuándo conviene, qué datos lleva, cómo se
conecta en el `.mdx` y qué ya falló. Los props salen de `site/src/components/<Tipo>/index.tsx`;
si esta guía y el componente no coinciden, manda el componente y se corrige la guía.

Las reglas de contenido (consignas, pistas, distractores, variedad) están en
`.claude/rules/lecciones.md` y `.claude/rules/componentes.md`. Esta guía no las repite: las
aplica a cada tipo.

## Anatomía común

Toda actividad tiene dos partes.

**1. Los datos**, en `site/src/content/lessons/NN-slug.ts`, tipados con los tipos que
exporta el componente:

```ts
import type {MatchItem} from '@site/src/components/Match';

export const CMD_LEFT: MatchItem[] = [/* ... */];
```

**2. La función de actividad**, en el `.mdx` de la lección, antes de la teoría:

```tsx
export function CmdMatchActivity() {
  const {isDone, markDone} = useLessonProgress(LESSON_SLUG, ['cmdmatch']);
  return (
    <Activity
      title="Emparejá cada comando con lo que hace"
      kind="Emparejar"
      goal="conectar cinco comandos de Git con su efecto real, uno a uno."
      done={isDone('cmdmatch')}
      consigna="Son 5 pares. Elegí un comando de la izquierda y después su efecto en la derecha (o al revés). Si el par no corresponde, se puede reintentar. La actividad se completa cuando emparejaste los 5."
    >
      <Match
        left={CMD_LEFT}
        right={CMD_RIGHT}
        leftLabel="Comando"
        rightLabel="Qué hace"
        why={CMD_WHY}
        alreadyDone={isDone('cmdmatch')}
        onSolved={() => markDone('cmdmatch')}
      />
    </Activity>
  );
}
```

Y la etiqueta `<CmdMatchActivity />` va en `## Práctica`. No escribas esto a mano: los
generadores `scripts/lessons/new_lesson.py` y `add_activity.py` arman los imports, la función
y la etiqueta a partir de un spec (ver [referencia.md](referencia.md)).

**Props de `Activity`:**

| Prop | Qué es |
|---|---|
| `title` | Título del ejercicio. Sin comillas dobles. |
| `kind` | Etiqueta visible de la mecánica. Usá la de la tabla de abajo, siempre la misma por tipo. |
| `goal` | Una oración que completa "Qué practicás: …". Arranca en minúscula. |
| `consigna` | Qué hacer, sobre cuántos elementos y cómo se completa. Admite código entre comillas invertidas. |
| `done` | `isDone('<id>')`. |
| `need` | Opcional, JSX. Un dato previo que la actividad necesita y que no es el tema de la lección (por ejemplo, qué hace `throw` en una actividad de try/catch). Más común en integradores. |

**Conexión con el progreso:**

- `useLessonProgress(LESSON_SLUG, ['<id>'])`, con un `id` único dentro de la lección.
- Todos los componentes reciben `onSolved={() => markDone('<id>')}`.
- Todos salvo `Quiz`, `Order` y `Compare` reciben también `alreadyDone={isDone('<id>')}`.

**Código de apoyo:** si el lector tiene que leer un bloque (una función, un stack trace, una
salida), va como `<CodeBlock language="ts">{NOMBRE_CONST}</CodeBlock>` dentro de `Activity`,
antes del componente (`import CodeBlock from '@theme/CodeBlock'`). En el spec es la clave
`code`. Máximo unos 35 caracteres por línea.

**Texto dentro de los datos:** pasa por `InlineText`, que solo entiende código entre comillas
invertidas. No hay negrita ni cursiva.

## Elegir el tipo

Se elige por lo que el lector tiene que **hacer**, no por el tema.

| El lector tiene que… | Tipo | `kind` |
|---|---|---|
| ubicar ítems en 2 o 3 categorías | `Classify` | Clasificar |
| diagnosticar ítems contra 3 o más reglas, o decidir si están bien | `FindInCode` | Clasificar |
| señalar la palabra exacta de una línea que causa el problema | `SpotToken` | Señalar en la línea |
| elegir la única respuesta correcta de un caso | `Quiz` | Elegí la opción |
| marcar el conjunto completo de opciones válidas | `MultiSelect` | Marcar todas |
| poner en orden los pasos de una secuencia real | `Order` | Ordenar |
| conectar pares uno a uno (comando ↔ efecto, término ↔ caso) | `Match` | Emparejar |
| completar huecos de un texto o comando con fichas | `FillBlank` | Completar huecos |
| construir un comando o expresión eligiendo fragmento por fragmento | `CommandBuilder` | Armar |
| escribir de memoria una respuesta corta | `TypeAnswer` | Respuesta escrita |
| escribir varios comandos seguidos de un flujo, viendo su salida | `Terminal` | Terminal |
| tomar decisiones encadenadas, donde cada una depende de la anterior | `DecisionPath` | Escenario encadenado |

`FindInCode`, `Classify` y `SpotToken` son una misma familia: nunca van seguidos. Para elegir
entre tipos que encajan, priorizá los menos usados del track
(`python3 scripts/activity-stats.py`).

---

## Classify

Arrastrar cada ítem a su columna. Drag-and-drop puro, sin alternativa de teclado (decisión de
diseño).

```ts
import type {ClassifyItem} from '@site/src/components/Classify';

export const LEVEL_COLUMNS = ['Prueba de componente', 'Prueba de sistema'];
export const LEVEL_ITEMS: ClassifyItem[] = [
  {
    code: 'Verificar que la función de descuento redondee a dos decimales.',
    column: 0,                       // índice en LEVEL_COLUMNS
    why: 'Prueba una unidad aislada, sin el resto de la aplicación.',
    hint: '¿Hace falta la aplicación entera para probar esto?',  // opcional, tras un error
  },
];
```

```tsx
<Classify items={LEVEL_ITEMS} columns={LEVEL_COLUMNS} itemLabel="Prueba"
  counterLabel="ubicadas en su nivel" alreadyDone={isDone('level')} onSolved={() => markDone('level')} />
```

- Solo 2 o 3 columnas. Con 4 o más, `FindInCode`.
- Pinta como código las palabras con mayúscula inicial: revisá cómo se ve la prosa.
- `itemLabel` y `counterLabel` con el nombre real, nunca los valores por defecto.
- Prueba: `classify(p, [[textoDelÍtem, nombreDeLaCaja]])`.

## FindInCode

Elegir cada ítem y decir qué regla rompe, o que está bien. Sirve para diagnosticar, no para
recordar.

```ts
import type {CodeLine} from '@site/src/components/FindInCode';

export const RISK_RULE_LABELS = ['Baja probabilidad de fallar', 'Bajo impacto si falla'];
export const RISK_LINES: CodeLine[] = [
  {code: 'El checkout de una compra.', rule: 0, why: 'Alto impacto: ...'},     // 0 = está bien
  {code: 'Un texto de ayuda que casi nadie abre.', rule: 2, why: 'Bajo impacto: ...',
   hint: '¿Cuánta gente depende de que esto funcione?'},                     // 2 = RISK_RULE_LABELS[1]
];
```

```tsx
<FindInCode lines={RISK_LINES} ruleLabels={RISK_RULE_LABELS} okLabel="Prioridad alta"
  prompt="¿por qué no es prioridad?" itemLabel="Parte" counterLabel="partes descartadas"
  alreadyDone={isDone('risk')} onSolved={() => markDone('risk')} />
```

- `rule` es 1-based contra `ruleLabels`; `0` es la categoría "sin problema", que el componente
  agrega solo con el texto de `okLabel`.
- La actividad se completa al encontrar todos los ítems con `rule > 0`: la consigna dice
  cuántos son.
- `okLabel`, `prompt`, `itemLabel` y `counterLabel` con el nombre real del dominio.
- Al menos 2 ítems correctos (y un 30% del total) tienen que parecer sospechosos.
- Los problemas no son todos de la misma regla. `check-exercises.mjs` controla ambas cosas.
- Si quedan 2 o 3 categorías, evaluá `Classify`.
- Después de escribirlo o cambiarlo: `node scripts/balance-answers.mjs`.

## SpotToken

Una línea por ronda; el lector hace click en la palabra exacta que causa el problema.

```ts
import type {SpotTokenRound} from '@site/src/components/SpotToken';

export const DANGER_PROMPT = '¿Qué palabra de esta línea causa el problema?';
export const DANGER_ROUNDS: SpotTokenRound[] = [
  {
    line: 'git branch -D feature/login',
    targetIndex: 2,                  // git=0, branch=1, -D=2
    why: '`-D` fuerza el borrado aunque la rama no esté mergeada.',
    hint: '¿Qué pasa si esta rama todavía no se mergeó?',
  },
];
```

```tsx
<SpotToken rounds={DANGER_ROUNDS} prompt={DANGER_PROMPT} itemLabel="Comando"
  alreadyDone={isDone('danger')} onSolved={() => markDone('danger')} />
```

- `targetIndex` es 0-based y cuenta palabras separadas por espacios, con la puntuación pegada
  a la palabra. Verificalo con `python3 scripts/spot-tokens.py`, nunca a ojo.
- La palabra buscada no está siempre en la misma posición entre rondas.
- Prueba: `spot(p, rondas)`.

## Quiz

Una o más preguntas de opción única, con explicación por opción.

```ts
import type {QuizQuestion} from '@site/src/components/Quiz';

export const MERGE_QUESTIONS: QuizQuestion[] = [
  {
    question: 'La rama ya la comparten dos compañeros. ¿Cómo la integrás con main?',
    options: [
      {text: 'Con `rebase`.', correct: false, why: 'Reescribe commits que otros ya tienen.'},
      {text: 'Con `merge`.', correct: true, why: 'No reescribe el historial compartido.'},
      {text: 'Con `reset --hard`.', correct: false, why: 'Descarta commits en vez de integrarlos.'},
    ],
  },
];
```

```tsx
<Quiz questions={MERGE_QUESTIONS} onSolved={() => markDone('merge')} />
```

- Sin `alreadyDone`.
- Exactamente una opción correcta y sin textos repetidos.
- 3 o más opciones; los distractores son malentendidos plausibles. La posición correcta no se
  repite, ni sigue un orden, ni alterna (`node scripts/check-exercises.mjs` y
  `node scripts/balance-answers.mjs`).
- Si solo pide recordar una definición, rediseñalo en otra mecánica.

## MultiSelect

Marcar todas las opciones que correspondan. Se resuelve con el conjunto exacto.

```ts
import type {MultiSelectQuestion} from '@site/src/components/MultiSelect';

export const PR_QUESTIONS: MultiSelectQuestion[] = [
  {
    prompt: 'Antes de abrir un Pull Request, ¿qué corresponde? Marcá todas las que apliquen.',
    options: [
      {text: 'Traer lo último de main y resolver conflictos localmente.', correct: true, why: '...'},
      {text: 'Hacer rebase de una rama compartida.', correct: false, why: '...'},
      {text: 'Correr los tests antes de pedir revisión.', correct: true, why: '...'},
    ],
  },
];
```

```tsx
<MultiSelect questions={PR_QUESTIONS} alreadyDone={isDone('pr')} onSolved={() => markDone('pr')} />
```

- La consigna dice cuántas preguntas y opciones hay, y que el conjunto tiene que ser exacto;
  no dice cuántas son correctas.
- Mezclá correctas e incorrectas; que no sean todas correctas ni una sola.
- Prueba: `multi(p, incorrectas, correctas)`.

## Order

Reordenar tarjetas con flechas o arrastrando, y comprobar.

```ts
import type {OrderItem, OrderRule} from '@site/src/components/Order';

export const PRIO_ITEMS: OrderItem[] = [         // ya mezclados: no hay aleatoriedad
  {id: 'prioritize', what: 'Paso', code: 'Ordenar primero lo de alto impacto y alta probabilidad.'},
  {id: 'impact', what: 'Paso', code: 'Anotar qué partes causarían más daño si fallan.'},
  {id: 'probability', what: 'Paso', code: 'Estimar qué tan probable es que cada una falle.'},
];
export const PRIO_CORRECT = ['impact', 'probability', 'prioritize'];
export const PRIO_RULES: OrderRule[] = [
  {before: 'impact', after: 'probability', why: '...'},
  {before: 'probability', after: 'prioritize', why: '...'},
];
```

```tsx
<Order items={PRIO_ITEMS} correctOrder={PRIO_CORRECT} rules={PRIO_RULES}
  onSolved={() => markDone('prio')} />
```

- Sin `alreadyDone`.
- `code` se resalta como TypeScript. `what` es el rótulo de la tarjeta. `kind: 'header'`
  marca un separador de sección (por ejemplo, `// ARRANGE`).
- Solo secuencias reales, con un único orden correcto. Cada `rule` explica un par
  antes/después.
- El orden inicial no puede coincidir con el correcto.
- Prueba: `solveOrder(p, textosEnOrden)`.

## Match

Emparejar cada ítem de la izquierda con uno de la derecha, click y click.

```ts
import type {MatchItem} from '@site/src/components/Match';

export const CMD_LEFT: MatchItem[] = [
  {id: 'a', text: '`git log --oneline`'},
  {id: 'b', text: '`git diff`'},
  {id: 'c', text: '`git stash pop`'},
];
export const CMD_RIGHT: MatchItem[] = [          // ya mezclada; el id indica el par
  {id: 'c', text: 'Recupera el último cambio guardado y lo saca de la pila.'},
  {id: 'a', text: 'Historial resumido, una línea por commit.'},
  {id: 'b', text: 'Diferencia entre el working directory y el último commit.'},
];
export const CMD_WHY: Record<string, string> = {a: '...', b: '...', c: '...'};
```

```tsx
<Match left={CMD_LEFT} right={CMD_RIGHT} leftLabel="Comando" rightLabel="Qué hace"
  why={CMD_WHY} alreadyDone={isDone('cmd')} onSolved={() => markDone('cmd')} />
```

- Pares 1 a 1. Si varios ítems van a la misma categoría, es `Classify`.
- La derecha no puede quedar en el mismo orden que la izquierda.
- `leftLabel` y `rightLabel` con el nombre real (los valores por defecto son "A" y "B").
- Prueba: `match(p, pares, [izq, der])`.

## FillBlank

Completar huecos de un texto con fichas de un banco.

```ts
import type {FillBlankSlot} from '@site/src/components/FillBlank';

export const RESTORE_TEMPLATE = 'git {{verb}} {{file}}';
export const RESTORE_SLOTS: FillBlankSlot[] = [
  {id: 'verb', answer: 'restore'},
  {id: 'file', answer: 'src/cart.ts'},
];
export const RESTORE_BANK = ['revert', 'restore', 'reset', 'cart.ts', 'src/cart.ts'];
export const RESTORE_EXPLANATION = '`restore` descarta cambios sin confirmar; ...';
```

```tsx
<FillBlank template={RESTORE_TEMPLATE} slots={RESTORE_SLOTS} bank={RESTORE_BANK}
  explanation={RESTORE_EXPLANATION} alreadyDone={isDone('restore')} onSolved={() => markDone('restore')} />
```

- Cada `{{id}}` del template tiene su slot con el mismo `id` (solo letras, números y `_`).
- Cada ficha se usa una vez: no repitas textos en el banco. El banco tiene distractores
  plausibles y ya viene mezclado.
- «Comprobar» se habilita con todos los huecos llenos.
- Prueba: `fill(p, fichasMal, fichasBien)`.

## CommandBuilder

Armar un comando eligiendo el fragmento correcto en cada paso; el siguiente se habilita al
acertar el anterior.

```ts
import type {BuilderStep} from '@site/src/components/CommandBuilder';

export const SWITCH_PREFIX = 'git ';
export const SWITCH_STEPS: BuilderStep[] = [
  {options: ['branch', 'switch', 'log'], correct: 'switch',
   hint: 'Ese comando lista o borra ramas, pero no te mueve a ninguna.'},
  {options: ['-d', '-c', '-a'], correct: '-c', hint: '`-d` es para borrar una rama.'},
  {options: ['main', 'origin', 'feature/nueva-funcion'], correct: 'feature/nueva-funcion',
   hint: 'Ese nombre no sirve como rama nueva para esta situación.'},
];
export const SWITCH_EXPLANATION = '`git switch -c` crea la rama y te mueve a ella.';
```

```tsx
<CommandBuilder prefix={SWITCH_PREFIX} steps={SWITCH_STEPS} explanation={SWITCH_EXPLANATION}
  alreadyDone={isDone('switch')} onSolved={() => markDone('switch')} />
```

- `hint` explica por qué la elección falla, sin nombrar la correcta.
- La posición de la opción correcta varía entre pasos.
- Sirve también para expresiones de TypeScript, no solo para comandos (`prefix` vacío).
- Prueba: `builder(p, pasos)`.

## TypeAnswer

Escribir una respuesta corta de memoria, con pistas progresivas.

```ts
export const FETCH_ACCEPTED = ['git fetch', 'git fetch origin', 'git fetch --all'];
export const FETCH_HINTS = [
  'Pensá en el comando que actualiza las referencias remotas sin tocar tu working directory.',
  'No es `pull`, que además fusiona.',
];
export const FETCH_EXPLANATION = '`git fetch` trae los commits nuevos del remoto sin fusionarlos.';
```

```tsx
<TypeAnswer accepted={FETCH_ACCEPTED} hints={FETCH_HINTS} explanation={FETCH_EXPLANATION}
  placeholder="git ..." alreadyDone={isDone('fetch')} onSolved={() => markDone('fetch')} />
```

- Normaliza espacios y pasa a minúsculas: no sirve cuando el caso importa (`-d` vs `-D`).
  Para eso, `Terminal`.
- `accepted` admite `*` como comodín (uno o más caracteres).
- Aceptá todas las formas correctas que la consigna o la teoría presentan como válidas.
- La última pista no puede dar la respuesta.
- Prueba: `typedIn(p, placeholder, incorrectas, correcta)`. Con varias actividades en la
  página, usá siempre el placeholder para encontrar el campo.

## Terminal

Terminal simulada: un comando por paso, con salida al acertar.

```ts
import type {TerminalStep} from '@site/src/components/Terminal';

export const FLOW_STEPS: TerminalStep[] = [
  {
    instruction: 'Creá la rama fix/navbar-overlap y movete a ella en un solo comando.',
    accepted: ['git switch -c fix/navbar-overlap', 'git checkout -b fix/navbar-overlap'],
    hint: 'Usá el flag que crea la rama y te mueve a ella a la vez.',
    output: "Switched to a new branch 'fix/navbar-overlap'",
  },
  {
    instruction: 'Confirmá el cambio con un mensaje que describa el arreglo.',
    accepted: ['git commit -m *'],
    hint: 'Tiene que ser `git commit -m` seguido de un mensaje entre comillas.',
    output: '[fix/navbar-overlap 9f1c2aa] ...\n 1 file changed, 1 insertion(+), 1 deletion(-)',
  },
];
export const FLOW_EXPLANATION = 'Es el flujo típico de una feature chica: ...';
```

```tsx
<Terminal steps={FLOW_STEPS} explanation={FLOW_EXPLANATION}
  alreadyDone={isDone('flow')} onSolved={() => markDone('flow')} />
```

- Respeta mayúsculas (`-d` ≠ `-D`) y normaliza espacios. `accepted` admite `*`.
- `instruction` es texto plano, sin comillas invertidas; `hint` sí admite código.
- Cada `output` es la salida real del comando: corrélo en un directorio temporal y copiala.
- Como consola de JavaScript: `promptSymbol=">"` y `commentPrefix="//"`, con el resultado
  real de `node -e` en `output`.
- Prueba: `term(p, pasos)`.

## DecisionPath

Escenario encadenado: cada decisión correcta lleva a la situación siguiente.

```ts
import type {DecisionNode} from '@site/src/components/DecisionPath';

export const STASH_START = 'start';
export const STASH_NODES: Record<string, DecisionNode> = {
  start: {
    id: 'start',                      // igual a la clave
    situation: 'Tenés cambios sin confirmar y te piden atender un bug urgente en otra rama.',
    options: [
      {text: 'Hacer un commit "wip" para poder cambiar.', correct: false, why: '...'},
      {text: 'Guardar el trabajo con `git stash` y cambiar de rama.', correct: true, why: '...',
       next: 'back'},
      {text: 'Cambiar de rama dejando los cambios sueltos.', correct: false, why: '...'},
    ],
  },
  back: {
    id: 'back',
    situation: 'Arreglaste el bug. Volvés a tu rama a seguir con lo de antes.',
    options: [
      {text: 'Hacer `git stash drop`.', correct: false, why: '...'},
      {text: 'Recuperar el trabajo con `git stash pop`.', correct: true, why: '...'},  // sin next: cierra
    ],
  },
};
export const STASH_EXPLANATION = '`stash` existe para pausar trabajo sin confirmar ...';
```

```tsx
<DecisionPath startId={STASH_START} nodes={STASH_NODES} explanation={STASH_EXPLANATION}
  alreadyDone={isDone('stash')} onSolved={() => markDone('stash')} />
```

- Un único camino correcto. La opción correcta con `next` avanza; la correcta sin `next`
  termina la actividad.
- Cada nodo tiene que depender de lo que se eligió antes; si los nodos son independientes,
  son preguntas de `Quiz`.
- La posición de la opción correcta varía entre nodos.
- Prueba: `decision(p, [[incorrectaRegex | null, correctaRegex]])`. Los textos son regex:
  escapá `(`, `?`, `{`.

## Compare

Muestra un "así no / así sí" con explicación. No es un ejercicio: no tiene `onSolved` ni se
completa, y hoy ninguna lección lo usa. El contraste "así no / así sí" va en la teoría; en
`## Práctica` solo van actividades que el lector resuelve.

```tsx
<Compare bad={{code: '...', explanation: <>...</>}} good={{code: '...', explanation: <>...</>}} />
```

## Antes de entregar

Seguí el paso 6 del skill `leccion`. Para los tipos de esta guía, lo mínimo es:

1. `npx tsc --noEmit -p .` (los tipos del `.ts` detectan props mal escritas).
2. `node scripts/check-exercises.mjs`, y `node scripts/balance-answers.mjs` si hay `Quiz` o
   `FindInCode`.
3. `python3 scripts/spot-tokens.py` si hay `SpotToken`.
4. `python3 scripts/activity-stats.py`: sin dos mecánicas seguidas de la misma familia.
5. Prueba en el navegador de cada actividad, mal y bien, con los helpers de
   `scripts/browser/lib.cjs`. `scripts/browser/example-all-types.cjs` tiene un ejemplo de
   cada tipo.
