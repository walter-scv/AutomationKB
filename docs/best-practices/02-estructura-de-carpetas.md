# Estructura de carpetas de un proyecto de automation

Un proyecto de automation maduro separa Page Objects, tests, lógica
compartida y documentación de producto en carpetas propias — nunca todo
junto en un solo directorio, donde encontrar algo depende de recordar en
qué archivo quedó. Así se ve esa separación en un proyecto real,
`project/` (raíz de este repo) — la suite E2E de "Show me the money!", una
app de inversiones personales:

```
project/
├── pages/                  ← Page Objects (patrón en la siguiente entrada)
│   ├── BasePage.ts          clase base de la que heredan todas las pantallas
│   └── PortfolioPage.ts     la única pantalla de esta app
├── tests/
│   ├── base-test.ts         fixture de test extendido (BaseTest)
│   └── portfolio/
│       └── portfolio.spec.ts
├── helpers/                 lógica compartida que no es ni Page Object ni test
│   ├── index.ts              barrel export
│   ├── api.ts                 llamadas directas a la API (buyAsset, sellAsset)
│   └── order.builder.ts       builder para sembrar datos (ver Factory y builders)
├── docs/specs/               documentación de producto (no de implementación)
│   └── portfolio.md
├── .github/
│   ├── workflows/            CI/CD
│   └── actions/               pasos reusables entre workflows
├── playwright.config.ts
├── package.json
├── tsconfig.json
└── .env.example
```

## Por qué estas carpetas y no otras

- **`pages/` y `tests/` separados, nunca mezclados.** Es la misma separación
  en capas vista en la próxima entrada: nada que sepa del DOM vive dentro de
  `tests/`.
- **`helpers/` existe porque no todo encaja en Page Object o test.** Código
  compartido que no es "interactuar con una pantalla" (no es un Page Object)
  ni "verificar algo de negocio" (no es lógica de test) — en esta app, las
  llamadas directas a la API real (`api.ts`) y el builder que arma los datos
  que esas llamadas necesitan (`order.builder.ts`, ver
  [Setup & Cleanup](./12-setup-and-cleanup.md)). Cuando algo no encaja
  limpio en Page Object ni en test, esa es la señal de que pertenece acá.
- **`docs/specs/` vive en el repo, versionado junto al código.** La
  documentación de qué hace la app (casos de uso, bugs conocidos) queda al
  lado del test que la verifica, no en un doc separado que se desactualiza
  sin que nadie lo note.
- **Nada de datos de prueba sembrados en disco acá** — esta app no necesita
  un `setup.ts` que corra antes de toda la suite: cada test siembra lo
  puntual que necesita llamando a la API directo, vía `helpers/` (más sobre
  esto en la entrada de Setup & Cleanup).

**Siguiente:** [Configuración base del proyecto](./03-configuracion-base.md)
