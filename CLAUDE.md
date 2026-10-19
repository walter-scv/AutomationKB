# AutomationKB: guía para Claude Code

AutomationKB es una knowledge base de test automation para QA con experiencia manual que se
inician en automation. `docs/best-practices/` tiene 20 entradas en markdown; `project/` tiene la
suite E2E real (Playwright + TypeScript) de la app "Show me the money!", que es la fuente de
todos los ejemplos. `site/` es el sitio interactivo (Docusaurus + MDX) donde cada entrada combina
teoría con actividades.

## Convenciones generales

- Stack: Playwright + TypeScript con `@playwright/test`. Nunca asumas otro stack; ante la duda,
  revisá `project/`.
- Todo el contenido para lectores va en español rioplatense (voseo), con el tono de los docs.
  Nombres de archivos, funciones y variables en inglés.
- El código de las actividades puede ser genérico e inventado si eso ayuda a que se entiendan
  por sí solas — no hace falta atarlas a la app real. Lo innegociable es que ese código respete
  las convenciones reales del proyecto: Page Object Model, TypeScript + Playwright, `test.step`
  numerados, tags, y la convención de data-attributes de la entrada 08 (ver aprendizaje 2).
- No modifiques `project/` salvo que se pida explícitamente.

## Aprendizajes de la revisión de actividades

Cada punto surgió de una corrección durante el diseño de la demo de la entrada 06
(`site/reference/demo-06-anatomia.html`). Aplicalos a toda actividad nueva o modificada.

### 1. Verificar el stack y el repo antes de proponer
**Qué pasó:** se propuso Python/pytest y una estructura nueva sin revisar el repo, que ya existía
y usa TypeScript.
**Regla:** antes de diseñar o generar algo, leé el README, las entradas involucradas y el código
real de `project/`. Construí sobre lo que existe.

### 2. Priorizar que la práctica se entienda, no que use la app real (actualizado 2026-10-16)
**Qué pasó:** esta regla originalmente pedía usar la app y las Page Objects reales de "Show me
the money!", porque la primera pantalla de práctica era una app inventada con convenciones que
contradecían los docs (`data-testid` en lugar de los data-attributes de la entrada 08). Esa regla
resolvió ese problema puntual, pero aplicada a rajatabla terminó sobrecargando las actividades
reales con vocabulario de dominio (nombres de activos, formato de moneda, "Mi portfolio") que no
aporta a lo que se quiere enseñar — las actividades dejaron de entenderse por sí solas.
**Regla:** las actividades usan ejemplos genéricos e inventados, elegidos por claridad — no hace
falta atarlos a la app real. Lo innegociable es que ese ejemplo respete las convenciones reales
del proyecto (Page Object Model, TypeScript + Playwright, `test.step` numerados, tags, y la
convención de data-attributes de la entrada 08), nunca algo que las contradiga. El código real de
`project/` queda como referencia opcional al final de la entrada (un link a los archivos reales),
no como la base del ejercicio.

### 3. Pensar en el formato para las 20 entradas, no en una lección suelta
**Qué pasó:** se construyó una lección puntual cuando el objetivo era un formato aplicable a
toda la knowledge base.
**Regla:** cada actividad se construye como componente reutilizable configurado por datos. Si
algo solo sirve para una entrada, replanteá el diseño.

### 4. Interactividad real: el lector hace, no solo marca
**Qué pasó:** se evaluó H5P y se descartó porque sus actividades se reducen a reaccionar a
contenido estático y apretar "Check".
**Regla:** las actividades tienen que hacer pensar y producir algo: ordenar, clasificar,
escribir o corregir código, buscar información en código o consola. El feedback llega mientras
el lector trabaja, no solo al final.

### 5. Los ejercicios vienen armados; no se ejecuta código
**Qué pasó:** se propuso cargar los tipos de Playwright y validar compilando, algo innecesario.
**Regla:** cada ejercicio valida la respuesta del lector contra lo esperado (reglas, respuestas
aceptadas, alternativas). No compiles ni ejecutes su código, y no agregues dependencias pesadas
para eso.

### 6. Contexto y teoría antes de la actividad
**Qué pasó:** los ejercicios pedían escribir código sin explicar cómo es la pantalla ni qué
ofrece la Page Object, y sin teoría que los respaldara.
**Regla:** el orden de una entrada es contexto (el caso manual, la pantalla, la Page Object),
después teoría con ejemplos de "así no" y "así sí", y recién después la actividad. Cada actividad
incluye:
- **Qué practicás:** el objetivo en una oración.
- **Lo que necesitás saber:** los conceptos y reglas que aplica, con referencias a la sección.
- **Herramientas disponibles:** los métodos y locators de la Page Object que puede usar.
- **Tu tarea:** la consigna concreta.

Si un hueco o ejercicio necesita conocimiento específico, explicalo junto al ejercicio.

### 7. No regalar la respuesta y obligar a razonar
**Qué pasó:** en "Encontrá los tres problemas", el recuadro de ayuda decía qué líneas estaban
bien y dónde estaban los errores, y los errores estaban juntos al final. Se resolvía sin pensar.
**Regla:**
- La consigna y los recuadros de ayuda nunca revelan la respuesta ni su ubicación.
- Los errores se reparten por el código, y hay distractores: líneas correctas que parecen
  sospechosas. Explicar por qué están bien es parte del aprendizaje.
- El lector justifica su respuesta, por ejemplo eligiendo qué regla rompe una línea, en lugar de
  solo marcarla.
- Si se equivoca, recibe una pista y puede reintentar; si marca como error algo correcto, se le
  explica por qué está bien.
- El feedback cita la regla o sección que aplica, y las pistas son progresivas.

### 8. Verificar visualmente cada actividad
**Qué pasó:** la lista de reglas de "Corregí el test" se veía rota: el código inline quedaba en la
columna angosta del layout y se mostraba letra por letra en vertical. Los tests de lógica pasaban.
**Regla:** además de probar la lógica, revisá cada actividad renderizada en escritorio y en
mobile, con la paleta neón única (ver aprendizaje 18). En layouts de grid o flex, agrupá el texto
mixto (texto más `<code>`) en un solo elemento.

### 9. Continuidad entre actividades y guiar la atención
**Qué pasó:** en "Corregí el test" el lector tenía que volver a buscar las líneas que ya había
encontrado en el ejercicio anterior.
**Regla:** si una actividad continúa a otra, reutilizá el resultado previo: resaltá lo que hay
que trabajar, explicá el resaltado en la consigna y hacé que desaparezca cuando el lector lo
resuelve (detectándolo por contenido, no por número de línea).

### 10. Teoría genérica antes de la actividad, nunca al revés (actualizado 2026-10-16)
**Qué pasó:** la primera versión de la lección 06 en Docusaurus arrancaba directo con el
escenario de "Show me the money" (Ternium Argentina, Mi portfolio, etc.) antes de explicar AAA en
abstracto. Era al revés de cómo está escrita la entrada real en `docs/best-practices/`, que
arranca con un ejemplo genérico e inventado (`DashboardPage`) y recién después muestra "así se ve
en el proyecto real". Originalmente esa sección "así se ve en el proyecto real" alimentaba
directo a la actividad; eso quedó obsoleto con el punto 2 (actualizado): la actividad ahora usa el
mismo ejemplo genérico de la teoría, no la app real.
**Regla:** el orden es teoría genérica (con su propio ejemplo inventado) → actividad, usando **el
mismo** ejemplo inventado de la teoría, para que no haga falta aprender dos vocabularios distintos
en una sola entrada. La app real de `project/` puede aparecer, si aporta algo, como una mención
breve o un link al final — nunca como la base de la actividad ni intercalada entre la teoría y la
práctica.

### 11. Una actividad después de cada bloque de teoría, nunca todas al final
**Qué pasó:** la lección 06 explicaba AAA y Page Object (dos bloques de teoría seguidos) antes
de la primera actividad — un tramo largo de solo texto.
**Regla:** cada concepto nuevo tiene su propia actividad de refuerzo inmediatamente después,
antes de pasar al siguiente concepto. Nunca se acumulan dos o más conceptos seguidos esperando
una sola actividad al final.

### 12. Cada sección se conecta explícitamente con la anterior
**Qué pasó:** AAA, Page Object y las reglas del assert se explicaban como tres mini-lecciones
independientes — ninguna decía por qué viene después de la otra. Eran ejemplos inconexos, no una
explicación (ver aprendizaje 6, versión estricta).
**Regla:** toda sección nueva arranca mostrando el problema que resuelve, nunca una definición
sin motivo — y si es una aplicación de algo ya visto, lo dice explícitamente ("es la misma idea
de arriba", "igual que en la sección anterior").

### 13. Ordenar/clasificar tiene que verificar el concepto, no una secuencia tangencial
**Qué pasó:** "Ordená AAA" pedía ordenar 5 líneas por secuencia lógica de uso de la app — se
podía resolver bien sin saber qué es Arrange/Act/Assert, porque ninguna regla de feedback
mencionaba AAA.
**Regla:** si la sección enseña una categorización, el ejercicio tiene que forzar esa
categorización explícitamente (por ejemplo, incluyendo las etiquetas de categoría como ítems a
ordenar), no una secuencia resoluble con sentido común ajeno al concepto.

### 14. No forzar un ejercicio de Ordenar sobre conceptos sin secuencia intuitiva
**Qué pasó:** "Ordená las capas" (entrada 02) pedía ordenar 4 tarjetas que repetían la definición
de cada capa, sin ninguna secuencia temporal o causal visible en el contenido mismo. El lector no
tenía forma de razonar el orden salvo copiar el diagrama que ya había leído arriba — ni la
sección ni el ejercicio se entendían.
**Regla:** `<Order>` funciona cuando los ítems son pasos concretos con una secuencia intuitiva
(líneas de un test, pasos de un proceso con un antes y un después real). Si lo que se enseña es
una jerarquía o clasificación sin secuencia temporal (como las capas de una arquitectura), no
fuerces un ejercicio de Ordenar — evaluá primero si ya alcanza con la teoría más otro tipo de
ejercicio (por ejemplo, uno que detecte una invasión entre capas), en vez de sumar una actividad
que no se puede resolver razonando. No toda sección necesita una actividad propia si la que sigue
ya ejercita el mismo concepto.

### 15. No presentar una decisión de un proyecto puntual como regla universal
**Qué pasó:** una pregunta del quiz de la entrada 02 afirmaba que "Data/Fixture nunca tiene
carpeta propia" — cierto para el proyecto real de esta base (siembra datos por API, no por
archivos), pero falso como regla general: hay proyectos donde esa capa sí vive en una carpeta
(`tests/fixtures/`, `test-data/`). Al generalizar un ejemplo de los docs reales a una lección con
ejemplos inventados, la afirmación quedó sin el contexto que la hacía cierta. Además, la lección
nunca había enseñado ese dato — rompía también el aprendizaje 6.
**Regla:** antes de reusar una afirmación de `docs/best-practices/` o de `project/` en una
lección con ejemplo genérico, preguntate si es un principio general o una decisión de diseño de
ese proyecto puntual. Si es lo segundo, no la generalices — elegí otra pregunta/ejemplo que sí
sea válido en abstracto, o aclará explícitamente que es una decisión posible entre varias.

### 16. No inventar una relación entre capas que la entrada real no afirma
**Qué pasó:** la lección 02 decía "cada capa le pide cosas a la siguiente — nunca al revés",
como si Test → Page Object → Helper → Data/Fixture fuera una cadena estricta. La entrada real
dice lo contrario: "cada test siembra lo puntual que necesita llamando a la API directo, vía
`helpers/`" — el test llama al Helper **directo**, sin pasar por la Page Object. Cada capa
individual estaba bien descripta, pero la relación entre ellas era inventada.
**Regla:** describir cada capa/concepto por separado no alcanza — si la lección afirma además
*cómo se relacionan* entre sí (quién le puede hablar a quién, en qué orden), esa relación tiene
que estar explícitamente respaldada por la entrada real, no inferida por parecer razonable. Ante
la duda, releé la entrada en vez de completar el mecanismo "a ojo".

### 17. Segunda pasada con un agente fresco, desde la perspectiva de un estudiante
**Qué pasó:** después de auditar manualmente las lecciones 01-06 contra el checklist, se
spawneó un agente **sin el contexto de la sesión** (para que no estuviera "contaminado" por mis
propias justificaciones) con la consigna de recorrerlas en orden como un QA manual sin experiencia
en automation, interactuando de verdad con cada actividad en el navegador (mal primero, bien
después). Encontró 6 problemas reales que la revisión manual no había visto, de tipos nuevos:
- Una actividad marcada "Completada" al recargar, pero con su contador interno en "0 de N" —
  mensaje contradictorio (¿ya la resolví o no?).
- El "Lo que necesitás saber" de una actividad aceptaba dos respuestas como válidas ("Helper o
  Page Object"), pero el ejercicio solo daba por correcta una — el texto de ayuda y lo que el
  ejercicio realmente acepta se habían desincronizado.
- La consigna mandaba a revisar una tabla de referencia que no incluía dos propiedades que el
  ejercicio sí usaba.
- Una nota interna de alcance ("este POC todavía no tiene...") había quedado visible en el
  contenido publicado.
- Una lección sin el quiz de cierre que sí tenían todas las demás — asimetría entre hermanas.
- El mismo método conceptual nombrado distinto en dos lecciones (`clickBuyButton` vs `clickBuy`)
  para la misma acción del mismo ejemplo genérico.
**Regla:** al terminar cada tanda de lecciones (no cada lección individual), spawneá un agente
nuevo —sin el contexto de la conversación— con instrucciones de recorrerlas en orden, interactuar
con cada actividad de verdad (no solo leer el código), y reportar cualquier punto de confusión sin
asumir que "seguramente es a propósito". Es un chequeo distinto al que uno mismo puede hacerse
releyendo lo que escribió.

### 18. El sitio pasó a un único tema oscuro "arcade neón" — no hay modo claro
**Qué pasó:** Walter pidió una portada con estética de menú de videojuego (fondo oscuro, colores
neón, botón "START!") y después pidió extender esa estética a toda la base, botones incluidos.
Como un menú de arcade no tiene una versión "modo claro" razonable, la decisión fue un único tema
oscuro con acentos neón en todo el sitio (`site/src/css/custom.css`, tokens `--akb-*` +
`colorMode: {defaultMode: 'dark', disableSwitch: true}` en `docusaurus.config.ts`), no dos paletas
alternables. El bloque `[data-theme='dark']` que existía en `custom.css` se eliminó: ahora todo
vive en un único `:root`.
**Regla:** no reintroduzcas un modo claro ni el switch de tema sin que Walter lo pida
explícitamente — es una decisión de diseño, no un olvido. Los ítems del checklist que mencionaban
"modo claro y oscuro" quedaron actualizados a "con la paleta neón única". Si agregás o tocás un
componente, usá los tokens `--akb-*` (nunca colores hardcodeados) para que seguir cambiando la
paleta siga siendo un cambio en un solo lugar, y las variables `--ifm-*` que Infima redefine por
selector propio (ej. `.footer--dark`, `.navbar--dark`) hay que pisarlas con ese mismo selector en
`custom.css`, no alcanza con cambiar el valor en `:root`.

## Checklist antes de dar por terminada una actividad

- [ ] El orden es teoría genérica → actividad, con el mismo ejemplo inventado en las dos, nunca al revés.
- [ ] Hay una actividad después de cada concepto nuevo — nunca dos o más bloques de teoría seguidos sin práctica.
- [ ] Cada sección nueva se conecta explícitamente con la anterior (problema → solución), no es una definición suelta.
- [ ] Si el ejercicio es de ordenar/clasificar, verifica el concepto enseñado — no una secuencia que se resuelve sin él.
- [ ] Un ejercicio de Ordenar tiene ítems con secuencia intuitiva (pasos, líneas de código) — nunca tarjetas de definición sin orden temporal real.
- [ ] Todo lo que pide se explicó antes en la entrada.
- [ ] Ninguna afirmación generaliza una decisión específica de `project/` como si fuera una regla universal.
- [ ] Si la lección describe cómo se relacionan varios conceptos entre sí (quién le habla a quién), esa relación está respaldada por la entrada real — releída, no inferida.
- [ ] Tiene "Qué practicás", "Lo que necesitás saber", herramientas disponibles y consigna.
- [ ] Ni la consigna ni la ayuda revelan la respuesta o dónde está.
- [ ] Obliga a razonar y tiene distractores cuando corresponde.
- [ ] El feedback explica el porqué, cita la regla y las pistas son progresivas.
- [ ] El código (real o inventado) sigue las convenciones del proyecto — Page Object Model,
      TypeScript + Playwright, data-attributes de la entrada 08, `test.step`, tags.
- [ ] Se completa con teclado (incluido ordenar, con arrastrar como agregado, no como reemplazo) y funciona en mobile.
- [ ] Se ve bien en escritorio y en mobile, con la paleta neón única del sitio (sin modo claro — ver aprendizaje 18), usando tokens `--akb-*` en vez de colores hardcodeados.
- [ ] Tiene un test que la resuelve con la solución declarada y otro con respuestas incorrectas.
- [ ] El "Lo que necesitás saber" y cualquier tabla de referencia coinciden exactamente con lo que el ejercicio acepta como correcto y con lo que usa — ninguna respuesta presentada como válida ahí es rechazada por el ejercicio, y ninguna propiedad/método que el ejercicio usa falta en la tabla.
- [ ] No queda ninguna nota interna de desarrollo (alcance de POC, TODO, referencia a fases internas) visible en el contenido publicado.
- [ ] Si una lección reutiliza el mismo ejemplo genérico de otra (ej. `DashboardPage`), los nombres de métodos coinciden entre lecciones — no hay dos nombres distintos para la misma acción.
- [ ] Si otras lecciones hermanas (incluida la anterior y la siguiente) tienen una sección equivalente (como un quiz de cierre), esta lección también la tiene — sin asimetrías sin justificar.

## Cómo mantener este archivo

Cuando Walter corrija algo sobre una actividad o el sitio, agregá un aprendizaje nuevo en la
sección anterior con el mismo formato (qué pasó y regla) y, si corresponde, un punto en la
checklist. Aplicá la corrección también a las actividades ya hechas que tengan el mismo problema.
