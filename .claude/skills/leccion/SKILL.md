---
name: leccion
description: Crear, ampliar o corregir lecciones y actividades de site/ (teoría, ejercicios, integradores), con la verificación completa antes de entregar.
---

# Crear o ampliar lecciones y actividades

Seguí los pasos en orden. Las reglas de contenido están en `.claude/rules/lecciones.md` y
`.claude/rules/componentes.md`, que se cargan al abrir un `.mdx` o un `.ts` de lección:
leelas antes del paso 3 si todavía no las tenés en contexto. Todos los comandos se corren
desde `site/`.

## 1. Entender el pedido y lo que existe

- Leé la lección (o sus vecinas, si es nueva), sus datos en
  `src/content/lessons/<archivo>.ts` y los componentes que vas a usar.
- `python3 scripts/coverage-map.py <filtro>` muestra los `###` de cada lección y sus
  actividades. `python3 scripts/activity-stats.py` muestra la distribución del track.
- Si el pedido cambia el formato o el criterio de muchas lecciones, hacé primero 1 a 3,
  mostralas y esperá la aprobación de Walter antes de seguir.

## 2. Investigar

- Fuente oficial del tema: ISTQB CTFL v4.0, Pro Git, git-scm.com, GitHub Docs, TypeScript
  Handbook, MDN o javascript.info. Compará con cursos establecidos para detectar temas que
  faltan. Si falta un tema, agregá la sección o la lección nueva.
- Ejecutá en un directorio temporal todo lo que vayas a mostrar: comandos de Git, la salida de
  `tsc` (`node_modules/.bin/tsc --noEmit --strict archivo.ts`) y el resultado de
  JavaScript (`node -e`).

## 3. Escribir la teoría

- Escribí desde `## Conceptos` hasta `## Anti-patrones`, con un `###` por concepto, ejemplos
  trabajados y salidas reales (reglas completas en `lecciones.md`).
- Antes de cada ejemplo, mirá los datos de las actividades: la teoría usa otro escenario.

## 4. Diseñar las actividades

- Armá la lista de `###` y asigná cada uno a una actividad, o a un ítem, ronda o nodo dentro
  de una. Mínimo 3 actividades, cada una sobre un subtema distinto.
- Elegí la mecánica según lo que el lector tiene que hacer, priorizando los tipos menos usados
  del track. Nunca dos actividades seguidas de la misma familia.
- Escribí los datos en TypeScript con los tipos del componente (`ClassifyItem`,
  `DecisionNode`, `MatchItem`, `TerminalStep`, `FillBlankSlot`, etc.).
- Si es una lección nueva de un bloque con integrador, sumala al integrador (paso 5).

## 5. Generar los archivos

- **Lección nueva**: escribí la teoría en un `.md`, los datos en
  `src/content/lessons/<archivo>.ts` y un spec en Python. Después corré
  `python3 scripts/lessons/new_lesson.py spec.py`, que genera el `.mdx` con imports,
  funciones de actividad y `## Práctica`.
- **Agregar actividades a una lección existente**: escribí el bloque `.ts` y un spec, y corré
  `python3 scripts/lessons/add_activity.py spec.py`. El script agrega los datos, los imports,
  la función y la etiqueta en `## Práctica` (después de `after` o al final), y actualiza el
  conteo de ejercicios.
- El formato de los dos specs, con ejemplos reales, está en [referencia.md](referencia.md).
- Los cambios de consigna se hacen con reemplazos acotados a esa actividad, nunca globales.

## 6. Verificar (obligatorio antes de entregar)

1. `npx tsc --noEmit -p .`
2. `node scripts/check-exercises.mjs`; si tocaste quizzes o FindInCode, además
   `node scripts/balance-answers.mjs`.
3. `python3 scripts/spot-tokens.py` si hay SpotToken, y `python3 scripts/activity-stats.py`:
   sin mecánicas seguidas y con la distribución pareja.
4. `npm run build` sin errores.
5. **En el navegador**: con el dev server en 3100, escribí un test con los helpers de
   `scripts/browser/lib.cjs` (ver [referencia.md](referencia.md)). Cada actividad nueva o
   cambiada se resuelve mal primero (tiene que dar feedback y dejar reintentar) y bien
   después (tiene que completarse), sin errores de consola.
6. **Mobile**: captura a 390 px de cada actividad con bloques de código, tablas o textos
   largos. Miralas: no tiene que haber scroll horizontal de la página ni datos cortados.
7. **Coherencia**:
   - la consigna y la ayuda coinciden con lo que el ejercicio acepta;
   - los textos con conteos ("Son N", "las N entradas") están actualizados;
   - no quedan notas internas visibles.

## 7. Cerrar la tanda

- Al terminar una tanda de lecciones, lanzá un solo agente sin el contexto de la sesión para
  que las recorra como un estudiante sin experiencia: que interactúe con cada actividad (mal
  y bien) y reporte cualquier confusión, sin asumir que algo "es a propósito".
- En el informe a Walter:
  - qué agregaste o cambiaste, por lección;
  - la verificación que corriste y su resultado;
  - lo que no se pudo cubrir y por qué;
  - las decisiones pendientes.
- No hagas commit salvo que lo pida.
