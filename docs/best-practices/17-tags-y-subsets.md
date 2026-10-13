# Tags y cómo correr subsets

Correr la suite completa en cada ocasión no siempre tiene sentido — antes
de un deploy querés la certeza rápida de que lo crítico funciona, no
esperar la corrida completa. Los tags resuelven exactamente eso.

## Los tags reales de este proyecto

Visibles en los títulos de test de
[`project/tests/portfolio/portfolio.spec.ts`](../../project/tests/portfolio/portfolio.spec.ts):

```typescript
test('portfolio page overview and asset detail panel @smoke @p0 @portfolio', ...)
test('buying beyond available balance results in negative balance (known bug) @p1 @portfolio', ...)
```

| Tag | Significa |
|---|---|
| `@smoke` | Crítico, tiene que pasar siempre |
| `@p0` | Máxima prioridad, bloquea un release si falla |
| `@p1` | Prioridad alta, pero no bloquea |
| `@portfolio` | Tag de feature — agrupa todos los tests de esta pantalla |

## Correrlos filtrados, local

```bash
npm run test:smoke         # --grep @smoke
npm run test:p0            # --grep @p0
npx playwright test --grep @portfolio
```

## Correrlos filtrados, desde CI

El workflow real [`e2e-tests.yml`](../../project/.github/workflows/e2e-tests.yml)
expone el tag como un input elegible al disparar la corrida a mano:

```yaml
on:
  workflow_dispatch:
    inputs:
      tag:
        default: 'all'
        type: choice
        options: ['all', 'smoke', 'p0', 'portfolio']
# ...
run: |
  if [ "${{ inputs.tag }}" = "all" ]; then
    npx playwright test --project=chromium
  else
    npx playwright test --project=chromium --grep "@${{ inputs.tag }}"
  fi
```

Quien dispara la corrida elige el alcance desde la interfaz de GitHub
Actions, sin tocar código ni abrir un PR.

## El criterio para asignar un tag

Un tag no es decoración — responde a una pregunta concreta: *si esto
falla, ¿bloquea el release o no?* Un test sin `@smoke` ni `@p0`/`@p1`
normalmente significa que nadie definió todavía qué tan crítico es — vale
la pena no dejar tests sin clasificar por mucho tiempo, porque "todo es
p0" termina siendo lo mismo que no tener tags.

**Siguiente:** [CI/CD: un pipeline que se mantiene verde](./18-ci-cd.md)
