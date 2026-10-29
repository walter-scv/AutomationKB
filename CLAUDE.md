# QAFoundry

Currícula interactiva de testing para QA que empiezan de cero (Docusaurus + MDX en `site/`).
Contenido en español rioplatense con voseo; tono profesional, no amistoso ni narrativo.

<!-- Mantenimiento: este archivo se carga en todas las sesiones; mantenelo bajo ~100 líneas.
Las reglas de contenido viven en .claude/rules/ (se cargan al tocar lecciones o componentes) y el
procedimiento completo para crear o ampliar lecciones, en el skill .claude/skills/leccion/.
Cada regla nueva va en una o dos líneas, con su motivo, en el archivo que le corresponde. -->

## Mapa

- `site/docs/<sección>/<track>/NN-slug.mdx`: teoría y funciones de actividad de cada lección.
  `site/src/content/lessons/NN-slug.ts`: los datos de esas actividades. Una lección insertada
  entre dos existentes usa un sufijo (`23a`) y un `sidebar_position` decimal (`23.5`).
- Secciones: I. Foundations (`01-foundations/`, tracks `testing/`, `programming/`, `git/`,
  cada uno con un integrador: `15b`, `25b`, `35b`), II. Testing Domains (tracks UI, API,
  Mobile y Performance) y III–VI, todavía sin contenido.
- `site/src/components/`: los componentes de actividad. `site/scripts/`: verificación y
  generadores.
- `project/` y `docs/best-practices/` están congelados: no se editan (lo bloquea
  `.claude/settings.json`) ni se usan como fuente de contenido.

## Comandos (desde `site/`)

- Dev server: `npm start -- --port 3100`. Siempre el puerto 3100; si ya está corriendo,
  reusalo.
- Tipos: `npx tsc --noEmit -p .`
- Build: `npm run build`
- Patrones adivinables en ejercicios: `node scripts/check-exercises.mjs`. Después de
  reescribir quizzes o FindInCode: `node scripts/balance-answers.mjs`.
- Distribución de tipos y mecánicas seguidas: `python3 scripts/activity-stats.py`
  (`--lessons` muestra el detalle por lección).
- Mapa teoría → actividades: `python3 scripts/coverage-map.py [filtro]`
- Índices de SpotToken: `python3 scripts/spot-tokens.py`
- Pruebas en el navegador: `node scripts/browser/<test>.cjs`, con los helpers de
  `scripts/browser/lib.cjs` y el dev server levantado. Ejemplo: `example-all-types.cjs`.

## Cómo trabajar

- **Leé antes de producir**: la lección, sus vecinas, sus datos `.ts` y el componente que vas
  a usar. Construí sobre lo que existe.
- **Fuentes oficiales**: ISTQB CTFL v4.0 (Testing), Pro Git, git-scm.com y GitHub Docs (Git),
  TypeScript Handbook, MDN y javascript.info (Programming). Compará con cursos establecidos
  para encontrar temas faltantes. Si falta un tema, se agrega la lección o la sección sin
  preguntar.
- **Ejecutá cada salida antes de mostrarla**: un comando de Git, un error de `tsc` o un
  resultado de JavaScript se corre en un directorio temporal antes de escribirlo. (Había
  salidas desactualizadas o inventadas.)
- **Prototipo antes de replicar**: un cambio de formato o de criterio se aplica primero a 1 a
  3 lecciones y se muestra a Walter; recién con su aprobación se extiende al resto. (Dos
  reescrituras masivas se rechazaron enteras.)
- **Un criterio vale para todo el sitio**: una corrección de Walter se aplica a todas las
  secciones y tracks, aunque la haya ejemplificado con uno solo.
- **Foundations es testing en general**: todo tiene que ser cierto para un tester 100% manual.
  La automatización (Playwright + TypeScript, Page Object Model, `test.step` numerados y
  tags) aparece recién desde la sección II.
- **Antes de entregar**, corré la verificación completa del skill `leccion` (paso 6). No
  digas que algo funciona sin haberlo probado en el navegador.
- Sin commits ni push salvo pedido explícito.
- Sin tandas de agentes en paralelo: el trabajo grande se hace secuencial. La única excepción
  es un agente revisor por tanda.

## Decisiones de diseño (no se revierten sin que Walter lo pida)

- Un único tema oscuro "arcade neón", sin modo claro ni selector de tema.
- `Classify` es drag-and-drop puro, sin alternativa de teclado.
- Ninguna lección tiene sección `## Repaso`: todas las actividades van en `## Práctica`.
