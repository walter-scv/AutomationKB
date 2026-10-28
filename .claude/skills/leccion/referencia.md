# Referencia: specs de los generadores y pruebas en el navegador

## Spec de `scripts/lessons/new_lesson.py` (lección nueva)

```python
D = '/ruta/temporal/'          # dónde escribiste la teoría
spec = {
  'track': 'git', 'file': '35a-flujos-de-trabajo', 'title': 'Flujos de trabajo con ramas',
  'position': 35.2, 'slug': 'foundations-flujos-de-trabajo',
  'intro': 'Una o dos oraciones que conectan con la lección anterior.',
  'theory': D + 'g35a.md',    # desde "## Conceptos" hasta el final de "## Anti-patrones"
  'activities': [
    {'fn': 'FlowClassifyActivity', 'id': 'flowclassify', 'title': '¿Qué flujo usa este equipo?',
     'kind': 'Clasificar', 'goal': '...', 'consigna': '...',
     'component': 'Classify',
     'props': {'items': 'FLOW_ITEMS', 'columns': 'FLOW_COLUMNS'},       # nombres exportados del .ts
     'literal': {'itemLabel': 'Equipo', 'counterLabel': 'ubicados en su caja'},  # props de texto
     # opcionales: 'code': 'NOMBRE_CONST' (CodeBlock antes del componente), 'code_lang': 'text'
    },
  ],
}
```

Los datos van antes en `src/content/lessons/35a-flujos-de-trabajo.ts`, con sus
`import type {...} from '@site/src/components/<Componente>'`.

## Spec de `scripts/lessons/add_activity.py` (agregar a una lección existente)

```python
spec = {
  'lesson': 'testing/09-caracteristicas-buen-caso',   # relativo a docs/01-foundations, sin .mdx
  'ts': '/ruta/temporal/t09.ts',                       # bloque que se agrega al final del .ts
  'ts_types': ['DecisionNode:DecisionPath'],           # import type que hace falta: Tipo:Componente
  'activities': [
    {'fn': 'DiagnoseActivity', 'id': 'diagnose', 'title': '¿Por qué dio distinto?',
     'kind': 'Escenario encadenado', 'goal': '...', 'consigna': '...',
     'component': 'DecisionPath',
     'props': {'startId': 'DIAG_START', 'nodes': 'DIAG_NODES', 'explanation': 'DIAG_EXPLANATION'},
     'after': 'ClosingQuizActivity'},                  # dónde va en ## Práctica; sin esto, al final
  ],
}
```

`title`, `goal` y `consigna` no pueden tener comillas dobles: el script lo verifica.

## Pruebas en el navegador (`scripts/browser/lib.cjs`)

```js
const L = require('./lib.cjs');
(async () => {
  const {b, p, errs} = await L.open();
  await L.go(p, 'testing/09-caracteristicas-buen-caso', '¿Por qué dio distinto?'); // ruta desde 01-foundations + título exacto
  await L.decision(p, [['Que sea repetible', 'Que sea claro'], ...]);  // [incorrecta|null, correcta] por nodo
  console.log('ERRS', errs);
  await b.close();
})();
```

**Helpers disponibles:**

| Componente | Helper |
|---|---|
| Match | `match(p, pares, [izq, der])` |
| DecisionPath | `decision(p, pasos)` |
| MultiSelect | `multi(p, incorrectas, correctas)` |
| FillBlank | `fill(p, fichasMal, fichasBien)` |
| CommandBuilder | `builder(p, pasos)` |
| SpotToken | `spot(p, rondas)` |
| Terminal | `term(p, pasos)` |
| Order | `solveOrder(p, textosEnOrden)` |
| Classify | `classify(p, [[ítem, caja]])` |
| TypeAnswer | `typedIn(p, placeholder, incorrectas, correcta)` |

Al final se imprime `errs` con los errores de consola. Hay un test completo, con una
actividad de cada tipo, en `scripts/browser/example-all-types.cjs`.

**Trampas de los localizadores, ya encontradas:**

- Los nombres accesibles no incluyen las comillas invertidas: buscá `git status lista
  agenda.ts`, no `` `agenda.ts` ``.
- En `match`, un texto izquierdo de una sola palabra se busca exacto, y uno con espacios, como
  prefijo. Si el ítem empieza con `¿`, incluilo.
- En `match`, el texto derecho se busca como subcadena literal, no como regex.
- En `decision`, los textos son regex: escapá `(`, `?`, `{`.
- `fill`: «Comprobar» se habilita solo con todos los huecos llenos; las fichas incorrectas
  tienen que llenarlos todos.
- Con varias actividades en la página, `getByRole('textbox').last()` puede agarrar la
  terminal: usá `typedIn` con el placeholder.
