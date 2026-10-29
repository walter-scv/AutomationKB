# QAFoundry

Base de conocimiento de prácticas de Quality Engineering: testing manual y automatizado.
El orden de este repo importa: primero se establecen las **buenas prácticas**
(cómo encaramos QA y automatización), y recién al final se habla de **IA** —
como una capa que se apoya sobre esas prácticas, no como un reemplazo de
ellas.

**Stack de referencia:** todos los ejemplos de código de esta base son
**Playwright con TypeScript**, tomados de un proyecto real —
[`project/`](./project/), la suite E2E de una app de inversiones ("Show me
the money!") — no pseudo-código inventado. Cada entrada linkea al archivo
real que ilustra.

**Audiencia:** QA con experiencia en testing manual que se inician en
automation. Se da por sabido el vocabulario y el criterio de QA en general
(bugs, criterios de aceptación, ciclo de release); se explica con precisión
solo lo que es específico de automation antes de usarlo.

## Estructura

```
docs/
  best-practices/       ← el foco inicial. Una entrada por práctica.
  ai-recommendations/   ← al final. Recomendaciones de uso de IA en QA,
                           con las implementaciones reales que hicimos como
                           evidencia de cada una.
project/                ← el framework de automation real que ilustra cada
                           entrada de best-practices. Corre de verdad — ver
                           project/README.md.
```

## Buenas prácticas (`docs/best-practices/`)

### Introducción al automation y patrones de diseño

Pensadas para leerse en orden — cada entrada cierra con un link a la
siguiente, y varias dan por sabido lo que ya se explicó antes. El orden
sigue el momento en que cada cosa se vuelve necesaria si estuvieras
armando este proyecto desde cero:

| # | Entrada |
|---|---|
| 1 | [¿Qué es automatizar, y por qué nos importa?](./docs/best-practices/01-que-es-automatizar.md) |
| 2 | [Estructura de un proyecto de automation: carpetas y capas](./docs/best-practices/02-estructura-y-capas.md) |
| 3 | [Configuración base del proyecto](./docs/best-practices/03-configuracion-base.md) |
| 4 | [Page Object Model](./docs/best-practices/04-page-object-model.md) |
| 5 | [BasePage — lo que comparten las Page Objects](./docs/best-practices/05-basepage.md) |
| 6 | [Anatomía de un test](./docs/best-practices/06-anatomia-de-un-test.md) |
| 7 | [Centralizando los selectores](./docs/best-practices/07-centralizando-selectores.md) |
| 8 | [Data-attributes: el contrato con frontend para selectores estables](./docs/best-practices/08-data-attributes-con-frontend.md) |
| 9 | [BaseTest — lo que comparten los tests](./docs/best-practices/09-basetest.md) |
| 10 | [Parametrización de datos de test y configuración](./docs/best-practices/10-parametrizacion-de-datos.md) |
| 11 | [Setup & Cleanup — dónde nace y muere la data (incluye Factory/Builders)](./docs/best-practices/11-setup-and-cleanup.md) |
| 12 | [Otras formas de escribir tests](./docs/best-practices/12-otras-formas-de-escribir-tests.md) |
| 13 | [Screenplay](./docs/best-practices/13-screenplay.md) |
| 14 | [Sesión reutilizada / autenticación](./docs/best-practices/14-sesion-reutilizada.md) |
| 15 | [Reportes con Allure](./docs/best-practices/15-reportes-allure.md) |
| 16 | [Debugging: trace viewer y modo UI](./docs/best-practices/16-debugging.md) |
| 17 | [Tags y cómo correr subsets](./docs/best-practices/17-tags-y-subsets.md) |
| 18 | [CI/CD: un pipeline que se mantiene verde](./docs/best-practices/18-ci-cd.md) |
| 19 | [Triage de tests inestables](./docs/best-practices/19-triage-de-flaky-tests.md) |
| 20 | [Errores que se pagan caro](./docs/best-practices/20-errores-que-se-pagan-caro.md) |

### Próximas entradas

- [ ] Entender qué le importa al negocio antes de diseñar la estrategia de
      tests (risk-based testing)
- [ ] *(agregar acá las próximas a medida que las definamos)*

## Recomendaciones de uso de IA (`docs/ai-recommendations/`)

Pendiente — se escribe al final, una vez que las buenas prácticas de base
estén asentadas. Cuando lleguemos a esta sección, cada recomendación se narra
junto con la implementación real que la sostiene (auto-heal, exploratory
testing dirigido por PR, generación de documentación viva, etc.).

- [ ] *(a definir)*

## El proyecto de ejemplo (`project/`)

Un framework de automation real y funcional, no un conjunto de snippets
sueltos — ver [`project/README.md`](./project/README.md) para cómo correrlo
y el mapeo completo de qué archivo ilustra cada entrada de arriba.

## Cómo se trabaja este repo

Una entrada a la vez. No se llena una sección entera de una sola pasada —
cada buena práctica se escribe, se revisa y se cierra antes de pasar a la
siguiente.
