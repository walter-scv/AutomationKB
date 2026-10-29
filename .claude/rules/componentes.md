---
paths:
  - "site/docs/**/*.mdx"
  - "site/src/content/lessons/**/*.ts"
  - "site/src/components/**"
  - "site/src/css/**"
---

# Componentes de actividad: detalles que ya fallaron

Cómo armar cada tipo, con datos y ejemplos: `.claude/skills/leccion/tipos-de-ejercicio.md`.

- **Tipos**: FindInCode, Classify, SpotToken, Quiz, Order, Compare, FillBlank, TypeAnswer,
  Match, CommandBuilder, MultiSelect, DecisionPath, Terminal. Cada actividad va envuelta en
  `<Activity title kind goal consigna done>` y usa `useLessonProgress(LESSON_SLUG, ['id'])`.
- **`alreadyDone`**: todos los componentes reciben `onSolved`, y todos salvo Quiz, Order y
  Compare reciben además `alreadyDone={isDone('id')}`. (Sin `alreadyDone`, la actividad
  decía "Completada" y al mismo tiempo mostraba "0 de N".)
- **`Classify`**: solo con 2 o 3 columnas en total; con 4 o más va `FindInCode`. Pinta como
  código las palabras con mayúscula inicial, así que el texto en prosa puede verse
  coloreado.
- **`Terminal`**:
  - Compara respetando mayúsculas (`-d` ≠ `-D`). `accepted` admite `*` como comodín.
  - Con `promptSymbol=">"` y `commentPrefix="//"` funciona como consola de JavaScript.
  - Las instrucciones son texto plano, sin comillas invertidas; las pistas sí admiten
    código entre comillas invertidas.
- **`TypeAnswer`** normaliza a minúsculas: no sirve para respuestas donde el caso importa.
- **`SpotToken`**: `targetIndex` cuenta palabras separadas por espacios, con la puntuación
  pegada. Verificalo con `scripts/spot-tokens.py`, nunca a ojo.
- **`FillBlank`**: cada ficha se usa una vez. No pongas dos fichas con el mismo texto, y
  ofrecé distractores plausibles.
- **`Order`**: compara contra un único orden correcto. Cada `rule` explica un par antes/después.
- **Texto en los datos** (`InlineText`):
  - Solo entiende comillas invertidas como código: no hay `**negrita**` ni `*cursiva*`.
  - Un template string (con sus comillas invertidas) dentro de código entre comillas
    invertidas rompe el render: usá concatenación o reformulá.
  - En `title`, `goal` y `consigna` del `.mdx` no van comillas dobles.
- **Bloques de código de una actividad** (tablas, matrices, contratos, árboles de carpetas):
  como máximo unos 35 caracteres por línea, para que se lean a 390 px sin perder datos.
- **Estilos**: un único tema oscuro neón. Usá los tokens `--akb-*` de `site/src/css/custom.css`,
  nunca colores fijos. Las variables `--ifm-*` que Infima redefine por selector propio
  (`.navbar--dark`, `.footer--dark`) se pisan con ese mismo selector.
- **Layout**: en grid o flex, agrupá el texto mixto (texto más `<code>`) en un solo elemento.
  (El código inline se mostraba letra por letra en vertical.)
