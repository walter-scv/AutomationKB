# Especificación: reescritura de las actividades de la sección Foundations

Contexto: la sección I. Foundations (38 lecciones) tiene actividades que son demasiado
directas. Dos problemas concretos:

1. **Las respuestas se adivinan por posición.** En los quizzes la opción correcta
   alternaba 1-2-1-2 o estaba siempre en la misma posición; en las actividades
   `FindInCode` los problemas aparecían siempre en el orden de las reglas (1→2→3→4).
2. **Los ejemplos son obvios.** Cada línea que viola una regla es el anti-patrón
   textual de la teoría, y las líneas "están bien" son obviamente correctas. El
   lector no necesita aplicar el concepto: reconoce la forma.

Este documento define cómo tienen que quedar las actividades después de reescribirlas.

---

## 1. Reglas generales

- Español rioplatense (voseo), mismo tono que el resto del sitio.
- Los ejemplos de código siguen las convenciones del proyecto: TypeScript + Playwright,
  Page Object Model, `test.step` numerados, data-attributes de la entrada 08.
- Los ejemplos son **genéricos e inventados**. No hace falta atarlos a la app real
  ("Show me the money!"), pero tampoco uses el vocabulario de dominio de esa app
  (Ternium, "Mi portfolio", etc.): usá un dominio neutro (formularios, usuarios,
  carrito, pedidos, emails, un panel de métricas...).
- No toques los archivos de otra lección. No cambies los nombres de los exports
  (el `.mdx` los importa por nombre).
- Si cambiás el número de líneas o de reglas de una actividad, revisá que el `.mdx`
  correspondiente (la consigna, el "Lo que necesitás saber", el `goal`) siga siendo
  coherente. Si el `.mdx` enumeraba "estas cuatro situaciones", actualizalo.
- Si agregás o cambiás una regla (un `RULE_LABEL`), el `rule:` de cada línea tiene que
  seguir apuntando a la posición correcta de ese array (1-indexado, `0` = "está bien").

---

## 2. Actividad `FindInCode` (clasificar líneas)

Una actividad es un conjunto de 6 a 8 líneas. Cada línea se clasifica con UNA regla
o con "está bien" (`rule: 0`).

### 2.1 Estructura obligatoria

- **6 a 8 líneas** por actividad.
- **Al menos 2 líneas "está bien"** (`rule: 0`) y al menos el 30% del total.
- **Todas las reglas del array deben aparecer** como problema en al menos una línea
  (si tenés 3 reglas, las 3 tienen que tener su línea problemática).
- Los problemas **no** pueden aparecer en orden 1→2→3 ni 3→2→1 en el recorrido de
  las líneas: intercalá las líneas que rompen reglas distintas.

### 2.2 Qué hace que una línea sea un buen ejercicio

**Trampa A — la forma delata la regla.** La línea no puede *parecer* la regla.
Ejemplo de línea INVALIDA: `` `let intentosMaximos: number = 3;` `` con la regla
"usa `let` sin necesidad de reasignar" — el lector ve `let` y contesta, sin leer.

Ejemplo de línea VÁLIDA, que exige leer el contexto:
```
function enviarFormulario(datos: FormData) {
  let reintentos = 3;
  return fetch('/api/form', {method: 'POST', body: datos, retries: reintentos});
}
```
Acá `let` aparece, pero hay que verificar si `reintentos` se reasigna en algún lado
para saber si la regla se rompe.

**Trampa B — la línea "bien" es obviamente bien.** Una línea `rule: 0` tiene que
parecer sospechosa. Ejemplos que funcionan:
- Un `let` que sí se reasigna (parece `let` mal usado, pero está bien).
- Un `const` cuyo objeto se muta (`const config = {}; config.retentos = 3;` — `const`
  impide reasignar la variable, no mutar el objeto).
- Una línea que roza un anti-patrón de otra lección.

**Trampa C — dos reglas seem适用 y solo una es la correcta.** La línea debe tener una
solución única. Cuando dos reglas apliquen, la `why` tiene que explicar por qué la
elegida es la que corresponde (y por qué la otra no).

**Trampa D — la `why` regala la regla.** La `why` explica el *por qué* del problema,
no repite textualmente el label de la regla. Y el `hint` (solo para líneas con
problema) **no revela la respuesta**: hace una pregunta que obliga a mirar otra cosa.
Ejemplo de hint VÁLIDO: `"¿Este valor se vuelve a asignar en algún punto del código?"`.
Ejemplo de hint INVÁLIDO: `"El nombre debería describir el contenido."`.

### 2.3 Qué escriben `why` y `hint`

- `why`: 1-3 frases. Explica qué está mal (o por qué está bien) **razonando**, no
  definiendo la regla. Si la línea tiene un detalle numérico o un nombre concreto,
  citá ese detalle: "con 3 intentos y 2 reintentos el máximo real es 6, no 3".
- `hint`: solo en líneas con problema. Es una pregunta que guía la mirada, no la
  respuesta. Progresiva: si el lector clasificó mal, ve el hint y reintenta.

### 2.4 Consigna de la actividad (en el `.mdx`)

La consigna no puede decir qué regla rompe cada línea. Ejemplos de consignas que
sirven: "cada línea es una escena de equipo real: una parece sospechosa y otra pasa
 inadvertida. Revisá todas y justificá." / "más de una parece rota y solo una lo
está: elegí bien."

---

## 3. Quiz de cierre

### 3.1 Estructura obligatoria

- **3 opciones por pregunta** (nunca 2: con 2 opciones el lector adivina por
  eliminación y no hay distractor real). Si tenés 4, mejor — pero 3 es el piso.
- **3 a 5 preguntas** por quiz.
- Cada opción incorrecta es un **malentendido plausible**, no un distractor de
  cartón. Ninguna puede ser absurda ("TypeScript no permite nombres cortos").
- La `why` de cada opción explica por qué esa opción es correcta o incorrecta —
  incluso las incorrectas. En la incorrecta, la `why` dice **en qué se equivoca**,
  no solo "es incorrecto".

### 3.2 Qué hace que una pregunta sea un buen ejercicio

- **No es de recordar la definición.** "Según la entrada, ¿qué es testing?" es
  demasiado directo. La pregunta tiene que aplicar el concepto a una situación
  nueva y con algún detalle que obliga a pensar.
- **El detalle es la clave.** La situación tiene que incluir un dato (un número, un
  nombre, un ticket) que cambie el veredicto si no se lee con cuidado.
- **La respuesta no es la más "bonita".** Si la opción correcta es la más completa
  y Armorada y las otras dos son réplicas, se adivina por forma. Las tres opciones
  tienen que tener longitud y tono parecidos.

---

## 4. Actividad `Order` (ordenar)

- Los ítems tienen que ser **pasos concretos con secuencia**, no definiciones.
- Las líneas de código que se ordenan son la parte real del ejercicio: el lector
  ordena código, no frases.
- El `correctOrder` tiene que ser el único orden que compila y hace lo esperado.

---

## 5. Cómo verificar

Desde `site/`:

```bash
node scripts/check-exercises.mjs        #Balanceo de posiciones + problemas de contenido
node scripts/check-exercises.mjs --verbose
npm run build                            # el sitio tiene que compilar
npm run typecheck
```

Mensajes del checker:

- `no hay ninguna línea "está bien"`, `sin distractores suficientes`, `solo N opciones`,
  `no queda ninguna regla sin usar`, `hay una regla N pero solo hay M labels` →
  **hay que corregirlos**.
- `patrón predecible`, `las posiciones ... van en orden`, `distribución global` →
  los resuelve `node scripts/balance-answers.mjs` (un script que reordena las
  respuestas y reescribe los `rule:`). No hace falta que los arregles a mano.
