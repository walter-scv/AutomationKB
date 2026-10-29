---
paths:
  - "site/docs/**/*.mdx"
  - "site/src/content/lessons/**/*.ts"
---

# Reglas de contenido de las lecciones

Cada regla existe porque su error ya ocurrió; el motivo va entre paréntesis.

## Estructura de una lección

- Orden: introducción breve → `## Conceptos` → `## Cuándo usarlo` → `## Buenas prácticas` →
  `## Anti-patrones` → `## Práctica`. No hay `## Repaso`.
- `## Práctica` arranca con una línea que dice cuántos ejercicios hay, que son independientes
  y que cada bloque avisa cuando se resuelve. Las actividades nunca interrumpen la teoría.
- Una lección tiene como mínimo 3 actividades. Si sus hermanas tienen una sección
  equivalente, esta también la tiene.

## Teoría

- **Un `###` por concepto**, que arranca por el problema que resuelve. Si aplica algo ya
  visto, lo dice ("igual que en la sección anterior").
- **Nada se menciona sin mostrarse**:
  - un comando lleva sintaxis, opciones habituales y salida leída línea por línea;
  - una técnica de testing, un artefacto aplicado (caso, reporte, tabla, matriz);
  - una construcción de código, un ejemplo, su error típico con el mensaje real y un
    contraste "así no / así sí".

  (La teoría era un listado de ideas sueltas y el alumno no podía aplicarla.)
- **Aplicación trabajada de cada principio**. Por ejemplo, para "el testing exhaustivo es
  imposible": un set de pruebas desmedido para una funcionalidad simple y después los casos
  que sí corresponde probar.
- **Prosa antes que tablas**: tablas solo para datos realmente tabulares. Las secciones de
  cierre son breves y no repiten la teoría. (Las tablas repetitivas se rechazaron.)
- **Tono profesional y técnico**: sin escenas ni narrativa ("es tu primer día...").
- **Teoría completa antes de practicar**: todo lo que una actividad usa (sintaxis, métodos,
  categorías, valores límite) está explicado antes en esta lección o en una anterior.
  Revisá también el orden entre lecciones. (JSON quedó antes de interfaces y usaba
  `interface`; una actividad de arrays usaba objetos, que se enseñan después.)
- **No inventes**: ni conceptos ni relaciones entre conceptos que la fuente oficial no
  respalde. No generalices como regla universal una decisión de un proyecto puntual.

## Actividades

- **Escenarios distintos de la teoría**: otros datos, nombres y archivos. Antes de escribir un
  ejemplo de teoría, mirá los datos de las actividades de esa lección. (Si coinciden, la
  teoría regala la respuesta.)
- **Cobertura**: cada `###` se practica en al menos una actividad, o en un ítem, ronda o
  nodo dentro de una. Cada actividad practica un subtema distinto y ninguna repite el
  escenario de otra de la misma lección. Verificalo con `scripts/coverage-map.py`.
- **Hacer, no reconocer**: el lector produce, ordena, clasifica, decide, lee una salida o
  sigue una ejecución. Elegí la mecánica según lo que tiene que *hacer* con ese contenido.
- **`goal` y `consigna`**: `goal` es una oración ("Qué practicás"). La consigna dice qué
  hacer, sobre cuántos elementos y cómo se termina, y da cualquier dato que el ejercicio
  necesite.
- **Sin regalar la respuesta**: ni la consigna ni las pistas dicen cuál es ni dónde está. Las
  pistas son preguntas progresivas que obligan a mirar otro aspecto, y el feedback explica el
  porqué y cita la regla o la entrada.
- **Resistir el atajo**:
  - Los quizzes tienen 3 o más opciones, con distractores que sean malentendidos plausibles.
  - La posición correcta no se repite, ni sigue un orden, ni alterna.
  - En clasificar, al menos 2 ítems correctos (y un 30% del total) parecen sospechosos.
  - Los problemas no aparecen en el orden de las reglas.
- **Clasificar bien**:
  - Las categorías son completas y excluyentes, y la consigna las nombra todas.
  - La consigna da una regla de decisión para los casos dudosos.
  - `okLabel`, `prompt`, `counterLabel` e `itemLabel` usan el nombre real ("No es testing",
    "Situación"), nunca "Está bien" ni "Línea" por defecto.
- **Ordenar solo secuencias reales** (pasos, líneas de código). Una taxonomía no se ordena.
  Si el orden admite dos respuestas, reescribí los ítems hasta que haya una sola.
- **Un error nunca bloquea**: se reintenta sin recargar y nada queda resuelto hasta acertar.
- **Coherencia**: lo que la consigna o la ayuda presentan como válido es exactamente lo que el
  ejercicio acepta. No queda ninguna nota interna visible ("POC", "TODO"). Un mismo método se
  llama igual en todas las lecciones.
- **Quiz y FindInCode se ganan su lugar**:
  - Un quiz que solo pide recordar una definición, o que repite un caso de otra actividad, se
    rediseña en otra mecánica (no se borra).
  - Un FindInCode exige diagnosticar y justificar. Si tiene 2 o 3 categorías, se evalúa
    `Classify`.

## Variedad y distribución

- Nunca dos actividades seguidas de la misma mecánica. `FindInCode`, `Classify` y `SpotToken`
  son una misma familia. Se resuelve reordenando o intercalando, no borrando.
- La distribución de tipos en cada track es pareja: ningún tipo es mayoría y ninguno queda
  casi sin usar. Para una actividad nueva, priorizá los tipos menos usados que encajen;
  FindInCode y Quiz no son la opción por defecto. Medilo con `scripts/activity-stats.py`.

## Integradores (`15b`, `25b`, `35b`)

- Cubren todas las entradas del bloque y los subtemas que más se combinan, con muchas
  mecánicas distintas. Cada `goal` dice qué entradas repasa (por ejemplo, "entradas 17 y 22").
- Cuando se agrega una lección al bloque, se actualizan el integrador, su texto ("las N
  entradas") y el párrafo que dice cuántos ejercicios usan el proyecto común.
