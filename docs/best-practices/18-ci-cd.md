# CI/CD: un pipeline que se mantiene verde

Un pipeline de CI que corre la suite pero no deja evidencia cuando algo
falla —o que se corta antes de notificar a nadie— no sirve de mucho más
que un semáforo. Así se ve esa idea resuelta en dos workflows reales de
[`project/.github/workflows/`](../../project/.github/workflows/), cada
uno con un propósito distinto:

| Workflow | Dispara | Para qué |
|---|---|---|
| [`e2e-tests.yml`](../../project/.github/workflows/e2e-tests.yml) | Manual (`workflow_dispatch`), con tag/video/workers elegibles | Correr bajo demanda — antes de un release, para validar un cambio puntual |
| [`daily-regression.yml`](../../project/.github/workflows/daily-regression.yml) | Cron, todos los días a las 6 AM UTC | Regresión completa sin intervención humana, para detectar algo que se rompió sin que nadie lo disparara |

Los dos comparten la misma estructura de pasos — instalar dependencias,
cachear los browsers de Playwright, correr la suite, publicar el reporte,
notificar, y fallar el job si algo quedó rojo:

```yaml
- name: Run E2E tests
  id: test-execution
  continue-on-error: true          # no corta acá — necesitamos publicar igual
  run: npx playwright test --project=chromium

- name: Publish Allure Report
  if: always()                     # se publica pase lo que pase
  uses: ./.github/actions/publish-allure

- name: Send Slack Notification
  if: always()
  uses: ./.github/actions/slack-notification

- name: Fail job if tests failed    # recién acá se decide el resultado del job
  if: steps.test-execution.outcome == 'failure'
  run: exit 1
```

## Por qué `continue-on-error` + un step de fail separado al final

Si el step de tests fallara el job inmediatamente, los dos steps
siguientes (publicar el reporte, avisar por Slack) nunca correrían — el
equipo se enteraría de que algo rompió, pero sin evidencia ni aviso. Separar
"correr" de "decidir si el job falla" es lo que garantiza que **siempre**
haya reporte y notificación, haya pasado lo que haya pasado.

## Caché de los browsers de Playwright

```yaml
- uses: actions/cache@v4
  with:
    path: ~/.cache/ms-playwright
    key: ${{ runner.os }}-playwright-chromium-${{ hashFiles('package-lock.json') }}
```

Descargar Chromium en cada corrida cuesta minutos reales. La key del caché
incluye el hash de `package-lock.json` — si la versión de Playwright
cambia, la key cambia, y el caché se regenera solo; si no cambió nada, se
reutiliza.

## Notificación a Slack

[`slack-notification/action.yml`](../../project/.github/actions/slack-notification/action.yml)
parsea el JSON de resultados de Playwright y arma un mensaje con contadores
reales (pasaron/fallaron/porcentaje), los nombres de los primeros 5 tests
fallidos si los hay, y links directos al reporte y a la corrida de GitHub
Actions — para que enterarse de un fallo no signifique tener que entrar a
buscarlo. La URL del webhook nunca aparece en el código: el workflow se la
pasa como `${{ secrets.SLACK_WEBHOOK_URL }}` — ver
[Parametrización de datos](./10-parametrizacion-de-datos.md) para cómo funciona
ese mecanismo y por qué una composite action no puede leer `secrets.*`
directamente.

**Siguiente:** [Triage de tests inestables](./19-triage-de-flaky-tests.md)
