# Plan — Sitio interactivo (`site/`)

Fase 0. Resultado de leer `CLAUDE.md`, el README raíz, las 20 entradas de
`docs/best-practices/`, `project/README.md`, las Page Objects reales
(`BasePage.ts`, `PortfolioPage.ts`), `base-test.ts`, `portfolio.spec.ts`,
`helpers/`, `docs/specs/portfolio.md`, y de leer **y probar en el
navegador** `site/reference/demo-06-anatomia.html` completa. También
investigué en la documentación oficial de Docusaurus (ver fuentes al final)
para resolver con datos reales, no supuestos, la tensión markdown/MDX y el
despliegue a GitHub Pages.

No se tocó nada fuera de este archivo. Espera aprobación antes de Fase 1.

---

## 1. Qué confirmé probando la demo

Lectura línea por línea de las 920 líneas + interacción real en el
navegador. Resumen de lo que define "el formato aprobado" y que el port a
React/Docusaurus tiene que preservar exactamente (no solo visualmente):

- **El dato real "que rompe la ilusión" vive detrás de un click, nunca en
  la prosa pasiva.** La explicación de por qué `terniumArgentinaButton`
  necesita `.first()` (porque "Ternium Argentina" aparece dos veces) no
  está en el texto de la sección 2 — aparece recién si el lector activa el
  modo "Ver qué hay detrás" y hace click en ESE botón puntual. Lo verifiqué
  en el navegador: con el modo en "Usar la app", nada la revela. Esta es la
  regla de CLAUDE.md #7 llevada a su forma más estricta, y la aplico a
  todas las entradas nuevas.
- **`<FindInCode>` no es "marcar y listo"**: cada línea clickeada abre un
  panel de clasificación (¿rompe la regla 1/2/3, o está bien?). Si el
  lector elige mal una línea que SÍ tiene problema, recibe una pista
  específica de esa línea y puede reintentar sin que se revele la regla
  correcta. Si elige una categoría para una línea que en realidad está
  bien, se le explica por qué está bien (no es un fallo mudo). El contador
  "X de 3 problemas encontrados" solo cuenta problemas reales encontrados,
  no líneas correctas clasificadas. Lo verifiqué interactuando con la línea
  5 del test malo: una respuesta incorrecta (regla 2) dio una pista sin
  spoilear; la correcta (regla 1) reveló la explicación completa.
- **`<FixCode>` no es un editor "a ver si compila"**: las reglas son
  predicados de texto (regex/funciones) sobre el código actual, se tildan
  en vivo con cada tecla, y el resaltado de las líneas a corregir
  desaparece cuando esa línea deja de matchear el patrón "sospechoso" — no
  cuando se llega a un número de línea fijo. Las pistas son progresivas (un
  botón, revela una pista más por click, hasta agotarlas).
- **`<ConsoleHunt>` es secuencial, no todo junto**: una pregunta a la vez;
  clickear la línea incorrecta la marca en rojo 1.6s y vuelve atrás, con un
  hint específico según QUÉ línea incorrecta clickeaste (no un genérico).
  Recién al responder todas las preguntas de click aparece la pregunta de
  opción múltiple de cierre.
- **`<Order>`** combina drag-and-drop nativo y botones ↑/↓ (accesible por
  teclado), y al verificar no dice solo "mal" — cita hasta 2 reglas de
  adyacencia concretas rotas ("X va antes que Y porque...").
- **`<Quiz>`** da la explicación por opción (acertada o no), no bloquea
  reintentar otras opciones, y se da por completada la pregunta en cuanto
  se clickeó alguna vez la opción correcta.
- El toggle claro/oscuro no existe como control en la demo: las variables
  CSS usan `prefers-color-scheme` **y** `:root[data-theme="dark"]` /
  `:root[data-theme="light"]` explícitos — exactamente la convención que
  usa el tema de Docusaurus para su propio switch claro/oscuro. Confirma
  que la demo está pensada para integrarse al tema de Docusaurus, no para
  tener su propio toggle.

---

## 2. Cómo conviven `docs/best-practices/` y el sitio

### La tensión, concretamente

Si una entrada de `docs/best-practices/*.md` contuviera JSX
(`<Activity>...`), dos problemas: en GitHub se ve como texto literal (o se
sanitiza), y Docusaurus, si no se configura nada, procesa `.md` como MDX
por default — con lo cual un `<` suelto en la prosa (common en ejemplos de
TypeScript, genéricos, comparaciones) puede directamente romper el build.

### Lo que la documentación oficial de Docusaurus dice (no supuse nada)

- `markdown.format` acepta `"mdx"` (default histórico), `"md"` o
  `"detect"`. Con `"detect"`, los `.md` se parsean como **CommonMark puro**
  (ningún JSX se interpreta, es inerte) y los `.mdx` como MDX completo. Es
  exactamente la opción que Docusaurus recomienda para este caso.
- El mecanismo de "partials" (un archivo que se importa dentro de otro con
  `import X from './_archivo.mdx'`) está documentado y probado solo para
  `.mdx`. No hay garantía de que un `.md` bajo `format: 'detect'` (que no
  pasa por el compilador MDX) se pueda `import`ar como componente — intentar
  esto sería apoyarse en un comportamiento no documentado.
- El plugin de docs puede apuntar su `path` a una carpeta fuera de `site/`
  (ej. `../docs/best-practices`), pero la propia documentación advierte no
  apuntarlo al padre directo del sitio (mezclaría `site/blog`, `site/src`,
  etc.) — no es nuestro caso si se apunta puntualmente a la subcarpeta.

### Decisión

**`docs/best-practices/*.md` no se toca y Docusaurus no lo renderiza en
absoluto — ni como plugin de docs, ni importado, ni migrado a MDX.** Sigue
siendo exactamente lo que es hoy: la referencia completa, versionada,
legible en GitHub tal cual.

Cada entrada tiene además una **lección en `site/docs/XX-slug.mdx`** —un
artefacto propio, no una transclusión— que:
- Es una narrativa adaptada al formato interactivo (como ya hace la demo
  real de la entrada 06: reescribe la teoría con sus propias secciones,
  intercalando `<AppDemo>`/`<PageObjectTable>`/actividades), consistente
  con la entrada pero no copiada letra por letra.
- Al final linkea a la entrada completa en GitHub y a los archivos reales
  de `project/` que ilustra — **exactamente el patrón que ya usa la demo**
  en su `.endnav` (`github.com/walter-scv/AutomationKB/blob/main/docs/...`).

Evalué la alternativa de generar también una vista Docusaurus de
`docs/best-practices/` (para navegarlos sin salir del sitio) y la descarto
por ahora: no la pide ningún criterio de terminado, suma una segunda
instancia del plugin de docs y configuración de `markdown.format` por
poco valor — la entrada completa ya es legible en GitHub, un click afuera.
Si en el futuro se quiere, es un cambio aislado y reversible.

**Ningún archivo de `docs/best-practices/` cambia en esta fase.** (Dejo
como pregunta abierta en la sección 8 si querés que además agregue, como en
la base anterior, una única línea de link al final de cada entrada — el
brief de esta vuelta no lo pide explícitamente.)

---

## 3. Hallazgo importante: CI/GitHub Pages — no hay conflicto, pero hay que saberlo

Antes de planear el despliegue, confirmé el estado real (no asumido):

```
$ find .github -type f        → No existe .github/ en la raíz del repo
$ gh api repos/walter-scv/AutomationKB/pages   → 404 (Pages no está habilitado)
$ gh workflow list             → vacío (ningún workflow activo en GitHub)
```

Los workflows reales de `project/.github/workflows/` (`e2e-tests.yml`,
`daily-regression.yml`) **viven en la ruta equivocada para que GitHub los
detecte** — GitHub Actions solo escanea `.github/workflows/` en la **raíz**
del repo, no `project/.github/workflows/`. Son archivos de referencia
documentados y linkeados desde las entradas 15/17/18 (correctos como
ejemplo de contenido), pero hoy **no corren en GitHub** y GitHub Pages
**no está activo** para este repo.

Consecuencia práctica: **no hay ningún sitio ni dashboard de Allure
ocupando GitHub Pages hoy**, así que el workflow de publicación del sitio
que arma la Fase 1 va a ser el primer uso real de Pages en este repo, sin
riesgo de pisar nada. Esto no es algo que yo vaya a "arreglar" en
`project/` (no se pidió y está fuera de alcance) — lo dejo documentado acá
porque cambia directamente cómo diseño el despliegue (sin necesidad de
convivir con otro publicador en la misma rama `gh-pages`).

---

## 4. Catálogo de componentes y su esquema de datos

Todos en `site/src/components/`, en TypeScript, tipados con una interfaz de
props por componente. Ya probé el comportamiento exacto de cada uno en la
demo (sección 1) — acá está el contrato de datos que lo reproduce.

### `<Activity>` — contenedor común
```ts
type ActivityProps = {
  id: string;                 // usado como clave de progreso
  title: string;
  kind: string;                // etiqueta visible, ej. "Ordenar", "Buscar en el código"
  goal: string;                 // "Qué practicás" — una oración
  need: React.ReactNode;        // "Lo que necesitás saber" — bullets
  poReference?: React.ReactNode; // <details> opcional con <PageObjectTable>
  consigna: React.ReactNode;    // "Tu tarea"
  children: React.ReactNode;    // el componente de actividad específico
};
```
Maneja el estado "Completada" (ícono/texto) leyendo el progreso global y
expone un contexto para que el hijo reporte `markDone()`.

### `<Order>`
```ts
type OrderItem = { id: string; what: string; code: string };
type OrderRule = { before: string; after: string; why: string }; // igual a ORDER_RULES de la demo
type OrderProps = {
  items: OrderItem[];       // en el orden MEZCLADO inicial (sin aleatoriedad — reproducible en tests)
  correctOrder: string[];
  rules: OrderRule[];        // citadas en el feedback cuando se viola alguna
  onCorrect?: (finalCodeComment: string) => void; // ej. para mostrar el AAA final comentado
};
```

### `<FindInCode>`
```ts
type CodeLine = {
  code: string;
  rule: 0 | 1 | 2 | 3;        // 0 = está bien; 1..N = qué regla rompe
  why: string;                 // explicación completa (se revela al clasificar bien, o al confirmar que está bien)
  hint?: string;                // pista específica de ESTA línea si se clasifica mal (solo si rule > 0)
};
type FindInCodeProps = {
  lines: CodeLine[];
  ruleLabels: string[];        // ["Rompe la regla 1", "Rompe la regla 2", "Rompe la regla 3"], "Está bien" es implícito
  language?: 'ts' | 'plain';   // 'plain' reutiliza el mismo componente para listas sin código (entradas 01, 12)
};
```
Reproduce exactamente la máquina de estados verificada en el navegador:
clasificación por línea, hint sin spoiler en el primer intento fallido,
contador que solo cuenta problemas reales.

### `<FixCode>`
```ts
type FixRule = { label: string; test: (code: string) => boolean };
type FixCodeProps = {
  startCode: string;
  markPatterns: RegExp[];       // qué líneas quedan resaltadas como "sospechosas" mientras no se corrigen
  rules: FixRule[];              // se tildan en vivo
  hints: string[];                // progresivas
  solution: string;
};
```

### `<FillCode>`
```ts
type Blank = { id: string; accepted: string[]; what: string; hint: string };
type FillCodeProps = {
  template: string;   // con {{id}} por cada hueco
  blanks: Blank[];
};
```

### `<ConsoleHunt>`
```ts
type OutputLine = { text: string; id?: string };
type SequentialQuestion = {
  question: string;
  wantId: string;                         // id de la línea correcta
  ok: string;                              // explicación al acertar
  hints: Record<string, string>;           // hint específico por id de línea incorrecta clickeada
};
type FinalChoice = { label: string; correct: boolean; why: string };
type ConsoleHuntProps = {
  output: OutputLine[];
  sequential: SequentialQuestion[];
  finalQuestion?: { prompt: string; choices: FinalChoice[] };
};
```
Entradas 15/16/19 reutilizan el mismo componente con una `output` que
simula un reporte de Allure en vez de una terminal de error — el
componente no sabe ni le importa qué texto es, solo opera sobre líneas.

### `<Quiz>`
```ts
type QuizOption = { text: string; correct: boolean; why: string };
type QuizQuestion = { question: string; options: QuizOption[] };
type QuizProps = { questions: QuizQuestion[] };
```

### `<AppDemo>`
```ts
type AppDemoProps = {
  initialMode?: 'use' | 'inspect';
  initialAsset?: string | null;
};
```
Una sola instancia de datos para toda la base (hay una sola pantalla real):
`site/src/data/portfolioApp.ts` exporta `ASSETS` y `PO_INFO` (lo que hoy son
constantes sueltas en el `<script>` de la demo), consumidos por
`<AppDemo>` sin importar qué entrada lo use. Si una entrada necesita
ocultar ciertos elementos inspeccionables (por ejemplo, para no adelantar
algo que esa entrada todavía no explicó), `AppDemoProps` suma
`inspectableKeys?: string[]` como allowlist opcional.

### `<PageObjectTable>`
```ts
type PoRow = { member: string; does: string; returns: string };
type PageObjectTableProps = { rows?: PoRow[] }; // default: todas las filas de portfolioApp.ts
```

### Barra de progreso de la entrada
Un hook `useLessonProgress(lessonSlug, activityIds: string[])` —puerto
directo de las ~10 líneas de progreso de la demo (`KEY`, `ACTS`, `done`,
`try/catch` en cada acceso a `localStorage`)— expuesto vía un
`<ProgressProvider>` que envuelve cada página de lección y que
`<Activity>`/`<Quiz>` consumen para marcar/leer estado. Clave:
`akb:<slug>:v1` (mismo esquema que la demo, versionado por si el formato de
datos cambia más adelante).

---

## 5. Plan lección por lección

Mismo formato que usé para auditar la base de conocimiento completa:
objetivo · contexto necesario · actividades (componente + consigna) ·
qué evalúan. **06 ya existe** (la demo) — se porta tal cual a los
componentes de arriba, sirve de patrón para las otras 19.

**01 — ¿Qué es automatizar, y qué no resuelve?**
Objetivo: reconocer cuándo automatizar un caso amortiza su costo.
Contexto: ninguno de pantalla (entrada previa al código).
- `<FindInCode language="plain">`: 6 situaciones de testing (ninguna es
  código) clasificadas contra "vale la pena" / "mejor exploratorio" / "no
  amortiza el costo", con distractores (una situación que *parece* no
  valer la pena pero sí, y viceversa).
- `<Quiz>` (3): F.I.R.S.T., flaky vs. roto, el criterio de "vale la pena".

**02 — Estructura de un proyecto: carpetas y capas**
Objetivo: ubicar la responsabilidad correcta en Test / Page Object /
Helper / Data-Fixture y detectar invasión de capas.
Contexto: `PortfolioPage.ts` (sin `<AppDemo>` todavía — es la primera vez
que aparece el concepto de Page Object, se reserva para la 04).
- `<FindInCode>`: el snippet real de la entrada (`user sees their
  balance`) — 3 líneas, cada una rompe una capa distinta.
- `<Order>`: las 4 capas en el orden en que un test las atraviesa (Test →
  Page Object → Helper/Service → Data/Fixture).
- `<Quiz>` (3).

**03 — Configuración base del proyecto**
Objetivo: justificar cada opción de `playwright.config.ts` por su razón de
negocio (CI vs. local).
- `<FillCode>`: huecos en `playwright.config.ts` (`retries`, `workers`,
  `trace`), cada hueco explica la razón al validar.
- `<Quiz>` (3).

**04 — Page Object Model**
Objetivo: aplicar la prioridad de selectores y las 3 reglas de POM.
Contexto: primera aparición de `<AppDemo>` (modo inspección) +
`<PageObjectTable>`.
- Exploración libre de `<AppDemo>` en modo inspección (sin actividad
  formal, como la demo en sus secciones 1-2) para familiarizarse antes de
  practicar.
- `<Order>`: tabla de prioridad de selectores.
- `<FindInCode>`: fragmento con un assert dentro de una Page Object y un
  método sin significado de negocio — cuál de las 3 reglas rompe cada uno.
- `<Quiz>` (3).

**05 — BasePage**
Objetivo: decidir qué va en `BasePage` y qué en la Page Object concreta.
- `<FindInCode>`: lista de comportamientos (`navigate()`,
  `clickRealizarCompra()`, `TIMEOUTS`, `fillComprar()` con
  `pressSequentially`) clasificados "va en BasePage" / "va en la Page
  Object concreta" — con `fillComprar()` como distractor (parece genérico,
  no lo es).
- `<FillCode>`: completar una Page Object nueva mínima que extiende
  `BasePage` (pasar `url` al `super()`, reusar `click()`/`waitForVisible()`).
- `<Quiz>` (3): por qué `fillComprar` no usa `BasePage.fill()`.

**06 — Anatomía de un test** → puerto directo de la demo existente.

**07 — Centralizando los selectores**
Objetivo: declarar locators fijos como propiedades; reconocer cuándo un
locator necesita ser un método con parámetro.
- `<FindInCode>`: versión de `ProductPage` con el mismo selector repetido 3
  veces dentro de métodos.
- `<FixCode>`: refactorizarla moviendo el locator al constructor.
- `<Quiz>` (3): fijo-como-propiedad vs. método-con-parámetro (el caso real
  de `portfolioAssetButton(name)`).

**08 — Data-attributes: el contrato con frontend**
Objetivo: elegir `data-action`/`data-input`/`data-context`/`data-label`
correcto; detectar el atributo en el wrapper en vez del elemento real.
- `<FindInCode>` (clasificar, sin bug): elementos reales de `<AppDemo>` →
  qué atributo les correspondería.
- `<FindInCode>` (bug real): 2 pares de JSX, atributo en wrapper vs. en
  elemento interactivo.
- `<Quiz>` (3).

**09 — BaseTest**
Objetivo: `test.extend()` como único punto de fixtures; orden de `use()`.
- `<Order>`: eventos de `seedPosition` (`SETUP: buying` → corre el test →
  `CLEANUP: selling`), igual mecánica que el `<Order>` de la demo pero con
  eventos de log en vez de líneas de test.
- `<FindInCode>`: una fixture que envuelve cada `expect` para sacar
  screenshot a mano — marcarla innecesaria (Playwright ya lo hace solo).
- `<Quiz>` (3).

**10 — Parametrización de datos**
Objetivo: dónde vive un valor y cómo nombrarlo.
- `<FindInCode>` (clasificar): 6 valores (`TIMEOUTS.standard`,
  `ASSET_PRIMARY_ID`, `ADMIN_PASSWORD`, un selector, `unitsBefore - 1`,
  `BASE_URL`) → su lugar correcto, incluida la opción "no se parametriza".
- `<FindInCode>` (bug): `ASSET_ALUAR_ID` como nombre de variable.
- `<Quiz>` (3): `.env` local vs. Secrets de CI.

**11 — Setup & Cleanup**
Objetivo: fixture automática vs. manual; medir en vez de asumir.
- `<FindInCode>` (clasificar situaciones, no código): 3 escenarios de test
  → fixture / Setup-Cleanup manual, con la explicación de qué se rompe si
  se elige mal (reemplaza al "árbol de decisiones" del catálogo anterior —
  ver nota en sección 7).
- `<FindInCode>` (bug): assert con saldo semilla hardcodeado en vez de
  medido (`toBeCloseTo(42000 - price, 2)`).
- `<Quiz>` (3).

**12 — Otras formas de escribir tests**
Objetivo: reconocer de nombre BDD/Gherkin, data-driven, keyword-driven,
Screenplay.
- `<FindInCode language="plain">` (clasificar liviano): 4 descripciones →
  el nombre del estilo, incluido el caso real de
  `docs/specs/portfolio.md` como "Gherkin de facto".
- `<Quiz>` (2-3, entrada corta).

**13 — Screenplay**
Objetivo: cuándo Page Object se queda chico.
- `<Order>`: piezas de `advisor.attemptsTo(BuyAsset.called(...))` en el
  orden de ejecución real.
- `<Quiz>` (3), con una pregunta de escenario ("esta app agrega un rol
  Asesor...") resuelta como opción múltiple con explicación por opción.

**14 — Sesión reutilizada / autenticación**
Objetivo: qué costo resuelve una fixture de login vs. `storageState`.
- `<Order>`: los 4 pasos de configurar `storageState`
  (`global-setup.ts` corre una vez → guarda en disco → `playwright.config`
  lo referencia → el test arranca ya logueado).
- `<Quiz>` (3), con 3 apps hipotéticas como preguntas (login costoso por
  UI y 200 corridas / sesión anónima / carrito costoso de armar) → cuál
  conviene.

**15 — Reportes con Allure**
Objetivo: de dónde sale cada pieza de evidencia; leer un reporte.
- `<ConsoleHunt>` reutilizando el mismo patrón de la demo pero con un
  `output` que recrea los steps de un reporte (modelado 1:1 sobre
  `portfolio.spec.ts`, con un paso marcado como fallido) en vez de una
  terminal — mismo componente, datos distintos.
- `<Quiz>` (3).

**16 — Debugging: trace viewer y modo UI**
Objetivo: elegir la herramienta correcta según el momento.
- Reutiliza el `output` de 15 para la pregunta final de interpretación
  (`finalQuestion` de `<ConsoleHunt>`): "¿qué herramienta usarías acá?".
- `<Quiz>` (3): los 4 escenarios de la tabla "cuál usar según el momento".

**17 — Tags y cómo correr subsets** — ver propuesta de extensión en
sección 7 (no hay un componente del catálogo que valide un patrón
`--grep` libre contra una lista de tests).
- `<Quiz>` (3): qué significa cada tag real (`@smoke`, `@p0`, `@p1`,
  `@portfolio`).

**18 — CI/CD: un pipeline que se mantiene verde**
Objetivo: por qué se separa "correr" de "decidir si falla".
- `<Order>`: steps de un workflow (checkout → instalar → cachear browsers
  → correr con `continue-on-error` → publicar Allure → notificar Slack →
  fallar el job).
- `<FindInCode>`: YAML alterado con `exit 1` antes de publicar/notificar.
- `<Quiz>` (3): `e2e-tests.yml` (manual) vs. `daily-regression.yml` (cron).

**19 — Triage de tests inestables** — ver propuesta de extensión en
sección 7 (el "árbol de decisiones" original no tiene componente propio).
- `<ConsoleHunt>`: recorrer evidencia de un reporte con 2 reintentos.
- `<Quiz>` (3) con las decisiones encadenadas como preguntas sucesivas
  (contar reintentos → mirar el trace que falló → clasificar la causa).

**20 — Errores que se pagan caro**
Objetivo: reconocer los 5 errores más caros — cierre de la base.
- `<FindInCode>` (capstone): 15-20 líneas con los 5 errores a la vez y
  distractores (líneas correctas que parecen sospechosas), cada una
  remite a la entrada donde se explicó primero.
- `<Quiz>` (3): el caso real del bug documentado
  (`buying beyond available balance...`).

---

## 6. Estructura de `site/`

```
site/
  docusaurus.config.ts
  sidebars.ts
  package.json
  tsconfig.json
  reference/
    demo-06-anatomia.html        ← se conserva, como ya existe
  docs/
    01-que-es-automatizar.mdx
    02-estructura-y-capas.mdx
    ...
    20-errores-que-se-pagan-caro.mdx
  src/
    components/
      Activity/ Order/ FindInCode/ FixCode/ FillCode/ ConsoleHunt/ Quiz/
      AppDemo/ PageObjectTable/
    content/
      lessons/
        01-que-es-automatizar.ts   ← datos pesados (líneas, reglas, quiz) por entrada
        ...
    data/
      portfolioApp.ts              ← ASSETS + PO_INFO + PO_ROWS, compartido
    hooks/
      useLessonProgress.ts
    css/
      custom.css                   ← tokens portados de la demo (paleta, fuentes)
  README.md                        ← Fase 4
tests/                               (fuera de site/, ver nota)
  pages/
  lessons/
```

Nota de ubicación de `tests/`: Docusaurus genera su propio `build/` y corre
sobre el contenido de `site/` — los tests de Playwright (Fase 3) van en
`site/tests/`, con su propio `playwright.config.ts` apuntando al
`npm start`/`npm run build && npm run serve` de Docusaurus como
`webServer`, igual que se hizo para el framework real de `project/`.

---

## 7. Dos extensiones propuestas sobre el catálogo cerrado de componentes

El catálogo de 9 componentes cubre 18 de las 20 entradas de forma directa.
Dos casos no encajan limpio y prefiero decírtelo ahora, no improvisar en
Fase 2:

1. **Entrada 17 (tags y `--grep`).** La actividad natural es "escribí un
   patrón de `--grep` y mirá qué tests de esta lista correrían" — ninguno
   de los 9 componentes valida un patrón de texto libre contra una lista.
   Propongo extender `<FillCode>` para este caso puntual: el "código" a
   completar es `npx playwright test --grep "{{pattern}}"`, y en vez de
   comparar el string contra una respuesta fija, el blank `pattern` lleva
   un validador (`matchesExpected: (value: string, tests: TestRow[]) =>
   boolean`) que corre el patrón como regex contra los títulos+tags reales
   de los 7 tests de `portfolio.spec.ts` y compara el subset resultante.
   Es la misma idea de `<FillCode>`, con un validador por función en vez de
   por lista de strings aceptados — no es un componente nuevo.
2. **Entrada 19 (triage de flaky).** El "escenario con decisiones
   encadenadas" original no tiene equivalente directo. Lo resuelvo sin
   componente nuevo: `<ConsoleHunt>` para recorrer la evidencia (cuántos
   reintentos, qué dice el trace que falló) y un `<Quiz>` cuyas 3
   preguntas están redactadas como la secuencia de decisiones (clasificar
   la causa → elegir la acción), cada una con su explicación. No es
   interactivamente idéntico a un árbol de decisiones, pero cubre el mismo
   objetivo de aprendizaje sin inventar un componente fuera de la lista
   que diste.

Si preferís que sume un componente dedicado para alguno de los dos casos
(o que loosen la lista cerrada), decímelo antes de Fase 2 — para Fase 1
(entrada 06) no aplica ninguno de los dos.

---

## 8. Decisiones técnicas adicionales

- **Docusaurus 3.10.x** (última estable de la línea 3.x, confirmado contra
  la documentación oficial), template TypeScript:
  `npx create-docusaurus@latest site classic --typescript`.
- **`markdown.format: 'detect'`** en `docusaurus.config.ts`, aunque hoy no
  haya ningún `.md` dentro de `site/` que lo necesite — lo dejo explícito
  para que cualquier `.md` que se agregue ahí en el futuro sea
  CommonMark-seguro por default, y porque es la config que la propia
  documentación de Docusaurus recomienda para este escenario.
- **Snippets de código reales, en vivo:** propongo sumar
  `remark-code-import` (paquete chico, sin runtime en el browser, solo
  build-time) para que los bloques de código de ejemplo —como el AAA final
  de la entrada 06— se importen directamente de líneas reales de
  `project/tests/portfolio/portfolio.spec.ts` en vez de reescribirse a
  mano en el MDX. La demo actual hardcodea esos bloques; esto evita que se
  desincronicen del código real con el tiempo. Es una mejora sobre la
  demo, no un requisito del brief — decime si lo sumo o prefiero que cada
  MDX siga el patrón de la demo (bloques de código escritos a mano,
  revisados contra `project/` manualmente).
- **Despliegue a GitHub Pages:** workflow nuevo en la raíz del repo,
  `.github/workflows/deploy-site.yml` (el primero que existe ahí — ver
  hallazgo de la sección 3), usando el patrón oficial actual:
  `actions/checkout` → `actions/setup-node` → `npm ci && npm run build`
  (en `site/`) → `actions/upload-pages-artifact` (`site/build`) →
  `actions/deploy-pages`. `docusaurus.config.ts`:
  `url: 'https://walter-scv.github.io'`, `baseUrl: '/AutomationKB/'`,
  `organizationName: 'walter-scv'`, `projectName: 'AutomationKB'`.
  Esto crea un `.github/` en la raíz del repo por primera vez — no toca
  nada de `project/.github/`, viven en rutas distintas sin superponerse.
- **Progreso:** `localStorage`, clave `akb:<slug>:v1`, try/catch en cada
  acceso — puerto directo del mecanismo ya probado en la demo.

---

## 9. Fases siguientes (resumen, el detalle completo ya está en el brief)

- **Fase 1:** Docusaurus configurado con los 9 componentes + hook de
  progreso + `portfolioApp.ts`, entrada 06 portada completa (tiene que
  andar igual o mejor que la demo — ya la probé, así que "igual" tiene una
  vara concreta: ver sección 1), workflow de publicación. Paro y la
  muestro antes de seguir.
- **Fase 2:** entradas 01-05 y 07-20 en tandas. Propongo agrupar las
  tandas igual que el orden temático del README (01-03 fundamentos, 04-08
  POM/selectores, 09-12 tests/datos, 13-14 patrones avanzados, 15-18
  reportes/CI, 19-20 cierre) — mismo criterio que usé para auditar toda la
  base, ahora aplicado a la Fase 2 de este brief.
- **Fase 3:** tests Playwright+TS en `site/tests/`, con Page Objects del
  propio sitio (`LessonPage`, `HomePage`) — dogfooding de lo que la KB
  enseña, como ya pide el brief.
- **Fase 4:** `site/README.md` + link desde el README raíz.

---

## 10. Preguntas abiertas para la aprobación

1. ~~¿docs/best-practices/ intacto y sin vista navegable en el sitio?~~
   **Confirmado 2026-10-15:** queda solo a nivel del repo. Docusaurus no lo
   renderiza — se usa como insumo para diseñar las actividades, el lector
   del sitio solo ve las lecciones interactivas.
2. ~~¿Link desde cada entrada .md a su lección?~~ **Confirmado: fuera de
   alcance.** La documentación markdown se mantiene como está hasta que el
   sitio interactivo esté cerrado; no se toca `docs/best-practices/` en
   esta ronda.
3. Extensiones de la sección 7 (entradas 17 y 19) — **pendiente, el
   usuario pidió más detalle** (ver respuesta en el chat).
4. `remark-code-import` (sección 8) — **pendiente, el usuario pidió más
   detalle** (ver respuesta en el chat).

Con luz verde en 3 y 4 arranca la Fase 1, con la entrada 06 como primer
entregable.

---

**Fuentes consultadas (Docusaurus):**
- https://docusaurus.io/docs/api/docusaurus-config (markdown.format)
- https://github.com/facebook/docusaurus/pull/9097 (origen de `format: detect`)
- https://docusaurus.io/docs/markdown-features/react (partials, solo .mdx)
- https://docusaurus.io/docs/api/plugins/@docusaurus/plugin-content-docs (`path` fuera de site/)
- https://docusaurus.io/docs/deployment (despliegue a GitHub Pages vía Actions)
- https://docusaurus.io/blog/releases/3.10 (versión estable actual)
