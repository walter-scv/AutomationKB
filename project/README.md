# Proyecto de ejemplo — Show me the money!

Framework de automation real (Playwright + TypeScript), usado como ejemplo
de implementación en toda la base de conocimiento de
[`../docs/best-practices/`](../docs/best-practices/). No es un proyecto de
juguete armado para ilustrar: es la suite E2E real de una app de inversiones
personales, con sus bugs reales documentados incluidos.

> App bajo test: https://sea-lion-app-7celq.ondigitalocean.app

## Dónde está cada cosa, y qué entrada la explica

| Archivo / carpeta | Qué es | Entrada que lo explica |
|---|---|---|
| `playwright.config.ts` | Configuración de la suite | [Configuración base](../docs/best-practices/03-configuracion-base.md) |
| `pages/BasePage.ts` | Clase base de la que heredan las Page Objects | [BasePage](../docs/best-practices/05-basepage.md) |
| `pages/PortfolioPage.ts` | Page Object real de la única pantalla de la app | [Page Object Model](../docs/best-practices/04-page-object-model.md), [Centralizando selectores](../docs/best-practices/07-centralizando-selectores.md) |
| `tests/base-test.ts` | Fixture de test extendido (`seedPosition`) — el único punto de donde importan todos los tests | [BaseTest](../docs/best-practices/09-basetest.md), [Setup & Cleanup](../docs/best-practices/11-setup-and-cleanup.md) |
| `tests/portfolio/portfolio.spec.ts` | Los tests reales, con el bug conocido documentado | [Anatomía de un test](../docs/best-practices/06-anatomia-de-un-test.md), [Errores que se pagan caro](../docs/best-practices/20-errores-que-se-pagan-caro.md) |
| `helpers/api.ts`, `helpers/order.builder.ts` | Llamadas directas a la API (`buyAsset`/`sellAsset`) y el builder que arma sus datos | [Setup & Cleanup](../docs/best-practices/11-setup-and-cleanup.md) |
| `docs/specs/portfolio.md` | Casos de uso y bugs conocidos de la app | [Otras formas de escribir tests](../docs/best-practices/12-otras-formas-de-escribir-tests.md) |
| `.github/workflows/` | CI/CD: corrida manual + regresión diaria | [CI/CD](../docs/best-practices/18-ci-cd.md), [Tags y subsets](../docs/best-practices/17-tags-y-subsets.md) |
| `.github/actions/publish-allure/` | Publica el reporte a GitHub Pages con historial | [Reportes con Allure](../docs/best-practices/15-reportes-allure.md) |
| `.github/actions/slack-notification/` | Notifica el resultado de cada corrida | [CI/CD](../docs/best-practices/18-ci-cd.md) |
| `pages/ExamplePage.template.ts`, `tests/example.spec.template.ts` | Plantillas en blanco para empezar una pantalla/test nuevo | — |

## Correrlo

```bash
npm install
npx playwright install chromium

npm test                 # toda la suite
npm run test:smoke       # solo @smoke
npm run test:ui          # modo interactivo
npm run report:allure    # reporte Allure, local
```

No hace falta ningún `.env` para correr la suite — cada valor tiene un
default inline en el código (ver
[Parametrización de datos](../docs/best-practices/10-parametrizacion-de-datos.md)).
Si querés apuntar a otro entorno o cambiar algún dato, copiá `.env.example`
a `.env` (`cp .env.example .env`) y completá ahí los valores que necesites.

No requiere ninguna credencial — la app es de acceso abierto.
