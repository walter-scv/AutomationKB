# Triage de tests inestables

Un test que falla una vez y pasa al reintentar no es automáticamente un
"flaky conocido" que se puede ignorar — es una señal pendiente de
investigar. El proceso, no solo el concepto (ya definido en
[Qué es automatizar](./01-que-es-automatizar.md)), es lo que separa un
equipo que confía en su suite de uno que aprendió a ignorar el rojo.

## Lo que el retry de CI es, y lo que no es

```typescript
// playwright.config.ts
retries: process.env.CI ? 2 : 0,
```

Este retry existe para absorber inestabilidad de **infraestructura**
(latencia de red variable en un entorno compartido), no para taparle la
boca a un test mal escrito. La distinción importa: un test que necesita el
reintento para pasar *a veces* está diciendo algo — y ese algo hay que
investigarlo, no solo dejar que el retry lo esconda.

## El proceso, paso a paso

1. **Contá cuántas veces reintentó, no solo si al final pasó.** El reporte
   de Allure ([entrada anterior](./16-reportes-allure.md)) muestra los
   intentos de cada test — un test que necesita 2 de 2 reintentos cada vez
   que corre no es lo mismo que uno que reintentó una vez en 50 corridas.
2. **Mirá el trace del intento que falló**, no solo el que pasó. El intento
   que falló tiene la evidencia real; el que pasó después no explica nada
   por sí solo.
3. **Clasificá la causa**, no la etiquetes de "flaky" sin más:
   - **Timing real** — una espera que debería ser explícita (`waitFor`) y
     no lo es. Se arregla en la Page Object, no subiendo el timeout.
   - **Estado compartido** — el test depende de datos que otra corrida
     modificó mientras tanto (ver [Setup & Cleanup](./12-setup-and-cleanup.md)
     para el caso de esta app en particular).
   - **Infraestructura del entorno de CI** — recursos limitados, red
     lenta. Legítimamente fuera del control del test.
4. **Solo después de clasificarlo, decidí la acción** — arreglar el test,
   arreglar el dato, o (si de verdad es infraestructura) aceptar que el
   retry lo cubre y seguir.

## La trampa a evitar

Subir un timeout o agregar un retry extra sin haber completado el paso 3 no
es una solución — es la misma práctica que ya se señaló como la más cara de
todas en [Anti-patrones](./21-errores-que-se-pagan-caro.md): tapar el
síntoma en vez de mirar la causa.

**Siguiente:** [Errores que se pagan caro](./21-errores-que-se-pagan-caro.md)
