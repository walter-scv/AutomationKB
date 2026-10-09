# Qué es automatizar, y qué no resuelve

Automatizar un test es codificar una verificación para que se ejecute sola,
de forma repetible, y dé el mismo resultado si nada cambió. El valor no está
en "usar código" — está en la repetibilidad: la misma verificación, corrida
cien veces, sin desgaste ni variación humana.

Dos puntos para alinear criterio antes de entrar en patrones:

- **Automation no reemplaza el testing exploratorio.** Un test automatizado
  verifica exactamente lo que decidiste verificar, ni un caso más. El
  criterio para encontrar lo que nadie anticipó sigue siendo humano (o, más
  adelante en esta base, un agente guiado para explorar activamente). Esto
  no es una limitación a lamentar — es simplemente el alcance real de la
  herramienta.
- **Un test flaky (uno que falla de forma inconsistente, sin que el
  comportamiento real haya cambiado) es peor que no tener test.** Entrena al
  equipo a ignorar el rojo, y el día que encuentre un bug real nadie le va a
  prestar atención. Preferí una suite más chica y confiable a una grande e
  inconsistente.

## Qué hace confiable a un test automatizado

Cinco propiedades — el acrónimo **F.I.R.S.T.** si te sirve de mnemotecnia,
el concepto importa más que la sigla:

| Propiedad | Qué significa en la práctica |
|---|---|
| **Fast** | Corre en segundos. Una suite lenta se deja de correr, o se corre cada vez menos seguido. |
| **Independent** | No depende del orden de ejecución ni del resultado de otro test. Esta es, en la práctica, la causa más común de una suite "inestable" — no es magia, es un test anterior dejando estado sucio. |
| **Repeatable** | Mismo resultado en tu máquina, en CI, hoy y en seis meses. |
| **Self-validating** | Pasa o falla solo, sin que alguien tenga que leer un log para decidir. |
| **Timely** | Se escribe cerca de cuando se escribe la feature, no como deuda técnica para "cuando haya tiempo". |

## Cuándo vale la pena automatizar

No todo amortiza el costo de mantenimiento de un test automatizado:

- **¿Se va a correr más de un puñado de veces?** Un flujo de una sola vez
  (una migración puntual) no lo justifica.
- **¿Hay un resultado exacto contra el cual comparar?** "El saldo de la
  caja de ahorro es $42.000,00" tiene un valor fijo — si no da eso, falló,
  sin ambigüedad. "El diseño se ve bien" no tiene ese valor — depende de
  quién lo mire, en qué pantalla, con qué contenido. Automatizar lo segundo
  termina en uno de dos problemas: un `expect` tan exacto que falla por
  cosas que no importan (test flaky), o uno tan relajado que deja de
  verificar nada real. Para ese tipo de criterio, la herramienta correcta
  sigue siendo el testing exploratorio o la revisión humana, no una
  aserción.
- **¿La feature ya se estabilizó, o todavía cambia de forma seguido?**
  Automatizar algo que todavía está mutando puede significar reescribir el
  test varias veces en una semana. A veces conviene cubrirlo a mano primero.

---

A partir de acá, todos los ejemplos de código de esta base usan el mismo
proyecto real: `project/` en la raíz de este repo, la suite E2E de una app
de inversiones ("Show me the money!"). No son fragmentos inventados — es
una suite que corre de verdad, con sus bugs reales documentados incluidos.

**Siguiente:** [Estructura de carpetas de un proyecto de automation](./02-estructura-de-carpetas.md)
