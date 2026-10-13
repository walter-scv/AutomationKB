# Parametrización de datos de test y configuración

## El problema: un valor compartido, escrito en el lugar equivocado

Un timeout, una URL, el id de un dato de referencia — cualquiera de estos,
tipeado directo dentro de un test o de una Page Object, funciona hoy. El
problema aparece después: el día que ese valor cambie (el timeout resulta
corto, la app se mueve a otro entorno, el dato de referencia deja de
existir), hay que encontrar **todas** las copias — y es fácil actualizar
tres de cuatro y dejar la suite con un fantasma inconsistente, fallando en
un solo lugar sin razón aparente.

## La regla

Si un valor se repetiría en más de un test, o si cambiarlo debería afectar
a toda la suite a la vez, no va escrito dentro del test — va en **un**
lugar nombrado, y el test lo referencia desde ahí:

| Tipo de valor | Dónde vive, en general | Así se ve en esta base | Se desarrolla en |
|---|---|---|---|
| Timeouts de espera | Una constante nombrada en la clase base de la que heredan las Page Objects | `TIMEOUTS` en [`BasePage.ts`](../../project/pages/BasePage.ts) | [BasePage](./05-basepage.md) |
| Selectores de una pantalla | Propiedades de la Page Object de esa pantalla | Propiedades `readonly` de `PortfolioPage` | [Centralizando los selectores](./07-centralizando-selectores.md) |
| Datos conocidos que pueden volverse inválidos (ids de catálogo, usuarios) | Variable de entorno, nombrada por el rol que cumple el dato, leída directo donde se usa, con un default inline | `process.env.ASSET_PRIMARY_ID ?? 'a1'` en [`order.builder.ts`](../../project/helpers/order.builder.ts) y [`portfolio.spec.ts`](../../project/tests/portfolio/portfolio.spec.ts) | el resto de esta entrada |
| Config de entorno y secretos | Variables de entorno — locales vía un archivo, en CI vía el mecanismo de secretos de la plataforma | `.env` localmente, Secrets de GitHub Actions en CI | el resto de esta entrada |

Las primeras dos filas se desarrollan en sus propias entradas, linkeadas
arriba. Las últimas dos se desarrollan acá.

## Datos que pueden volverse inválidos: variable de entorno, nombrada por rol

Nombrar un valor repetido en una constante —`export const ITEM_ID = 'x1'`—
parece el paso obvio. Pero resuelve el problema equivocado: el día que el
dato de origen cambie (otro entorno asigna otro id, el registro deja de
existir), cambiar el valor sigue necesitando un commit, sin importar en
cuántos lugares esté repetido. La solución es la misma que ya resuelve
`BASE_URL`: leer la variable de entorno directo donde se necesita, con un
default inline — la variable de entorno ya es la fuente de verdad, sin
constante ni archivo intermedio.

```typescript
// helpers/order.builder.ts
itemId: process.env.ASSET_PRIMARY_ID ?? 'a1',
```

```bash
# .env — override sin tocar código, sin commit
ASSET_PRIMARY_ID=a9-nuevo-id-en-staging
```

Dos reglas más se aplican a esta variable:

**Nombrala por el rol, no por el valor de hoy.** `ASSET_ALUAR_ID` sería el
mismo error que `REGION_US_EAST_URL`: el día que la región primaria pase a
ser otra, cambiar el *valor* no alcanza — también habría que cambiar el
*nombre* de la variable, exactamente el commit que se quería evitar. Por
eso acá es `ASSET_PRIMARY_ID` / `ASSET_SECONDARY_ID`: el nombre describe
qué rol cumple el dato en la suite, no cuál activo lo ocupa hoy.

**Si el dato tiene más de una forma, las dos salen de `.env`.** Aluar
tiene dos identidades — el id que usa la API (`'a3'`) y el nombre que
muestra la UI (`'Aluar'`) — y un test real necesita ambas. Externalizar
solo una y dejar la otra hardcodeada las desincroniza: cambiás el id para
apuntar a otro entorno y la UI sigue buscando, a ciegas, el nombre viejo.

```typescript
// tests/portfolio/portfolio.spec.ts
const secondaryAssetId = process.env.ASSET_SECONDARY_ID ?? 'a3';
await seedPosition(anOrder().forAsset(secondaryAssetId).withAmount(50).build());
await portfolioPage.portfolioAssetButton(process.env.ASSET_SECONDARY_NAME ?? 'Aluar').click();
```

No hace falta un archivo para agrupar id y nombre — eso solo movería el
problema. Lo que los mantiene sincronizados no es un archivo compartido:
es que los dos viven en el mismo `.env` y se cambian juntos ahí.

El mismo criterio aplica a usuarios/passwords: el **nombre** de la
variable (`ADMIN_EMAIL`) es libre — es vocabulario del test. El **valor**
real nunca va de default inline: una password no tiene un valor
"razonable" para dejar en el código.

## `.env` local, Secrets en CI

[`.env.example`](../../project/.env.example) se commitea al repo como
plantilla — sin datos, solo qué variable hay que completar y con qué:

```bash
# ASSET_PRIMARY_ID=<catalog id of the primary asset>
# ASSET_PRIMARY_NAME=<display name shown in the UI for the primary asset>
```

Cada quien copia ese archivo a `.env` (`cp .env.example .env`) y ahí sí
pone valores reales. `.env` **nunca** se commitea — está excluido en
[`.gitignore`](../../project/.gitignore). `playwright.config.ts` lo carga
con `dotenv` antes de armar la config, y desde ahí cada valor se lee como
variable de entorno:

```typescript
// playwright.config.ts
dotenv.config({ path: path.resolve(__dirname, '.env') });
```

En CI no hay archivo — GitHub Actions tiene su propio mecanismo (repo →
*Settings* → *Secrets and variables* → *Actions*), con valores que nunca
aparecen en el código ni en los logs. Una composite action no puede leer
`secrets.*` directamente — solo el workflow que la llama tiene acceso —
así que el secreto se pasa como `input`:

```yaml
# .github/workflows/e2e-tests.yml
slack-webhook-url: ${{ secrets.SLACK_WEBHOOK_URL }}
```

```yaml
# .github/actions/slack-notification/action.yml
env:
  SLACK_WEBHOOK_URL: ${{ inputs.slack-webhook-url }}   # ← del input, no de secrets.* directo
```

## El criterio: si tu test usa un dato, parametrizalo

La pregunta es una sola: ¿esto es un dato que tu test necesita para armar
el escenario que prueba (un id, un nombre, una cantidad, una credencial)?
Entonces va en `.env` localmente, y en Secrets/variables de entorno en CI
— nunca hardcodeado en el test ni en el Setup. No importa si hoy parece
"específico de este test puntual": el día que haya que correr contra otro
entorno, o que te pidan cambiar qué datos usás, la diferencia entre
cambiar una variable y cambiar código es exactamente lo que esta entrada
existe para evitar.

Lo único que no entra en esta regla es un valor que no es un dato
independiente, sino el resultado matemático de otro dato dentro del mismo
test — `unitsBefore - 1`, o el `1` que queda después de vender "casi
todo". Eso no es algo para parametrizar: es la verificación en sí, la
relación que el test comprueba, no una entrada configurable.

**Siguiente:** [Setup & Cleanup — dónde nace y muere la data](./11-setup-and-cleanup.md)
