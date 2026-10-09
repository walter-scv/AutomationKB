# Data-attributes: el contrato con frontend para selectores estables

## El problema que ya vimos, visto de nuevo desde el otro lado

En [Centralizando los selectores](./08-centralizando-selectores.md),
`portfolioAssetButton(name)` termina apoyándose en una clase CSS
(`.my-investments__items__name`) porque es la única forma disponible de
acotar la búsqueda a la sección "Mi portfolio" y no a "Inversiones
disponibles". Esa solución es correcta *dado lo que hay* — pero lo que hay
es una limitación de la aplicación, no una limitación de Playwright. Si
frontend pudiera tocarse, el problema no existiría: bastaría con que cada
fila de "Mi portfolio" tuviera un atributo que dijera, sin ambigüedad,
"esto es un ítem de portfolio".

Esta entrada es esa otra mitad: la convención real que usamos en otros
proyectos de la empresa para que ese atributo exista *antes* de que un
selector se rompa, no después.

## La práctica: un atributo por tipo de elemento, no uno genérico

Un solo `data-testid` genérico invita a usarlo para cualquier cosa, sin
criterio. La convención que mejor funciona en la práctica separa el
atributo según **qué tipo de elemento es**, para que el nombre del atributo
ya adelante qué se puede hacer con ese elemento:

| Atributo | Para qué elemento | Ejemplo |
|---|---|---|
| `data-action` | Algo clickeable: botones, links, ítems de un menú | `data-action="confirm-purchase"` |
| `data-input` | Campos de formulario: inputs, selects, checkboxes | `data-input="quantity-field"` |
| `data-context` | Contenedores que agrupan algo con sentido propio: una fila, una sección, un modal | `data-context="portfolio-item"` |
| `data-label` | Texto que no se interactúa, pero sí se lee o se verifica: títulos, estados | `data-label="status"` |
| `data-option` | Una opción dentro de un dropdown o lista | `data-option="status-active"` |

`data-context` es el que resuelve exactamente el caso de `portfolioAssetButton`:
en vez de depender de una clase CSS que existe por razones de estilo, cada
fila de "Mi portfolio" llevaría `data-context="portfolio-item"`, y el test
buscaría por ese contrato, no por cómo frontend decidió nombrar sus clases.

## Regla de oro: el atributo va en el elemento interactivo, nunca en el wrapper

El error más común al agregar estos atributos es ponerlos en el `<div>` que
envuelve al elemento real, no en el elemento mismo:

```tsx
{/* ❌ El atributo queda en el wrapper — Playwright encuentra el div, no el input */}
<div data-input="email-field">
  <input type="email" />
</div>
```

```tsx
{/* ✅ El atributo va en el elemento con el que el test realmente interactúa */}
<div>
  <input type="email" data-input="email-field" />
</div>
```

Con el primero, `page.getByTestId('email-field')` (o el selector que sea)
devuelve un `<div>` — y llamar a `.fill()` sobre eso falla, porque un `div`
no acepta texto. El atributo tiene que estar en el nodo que el test va a
clickear, llenar o leer, nunca un nivel arriba "porque es más fácil".

Mismo cuidado aplica a `data-context`: tiene que envolver exactamente lo
que agrupa, sin arrastrar elementos que no son parte de ese contexto.

```tsx
{/* ❌ El contexto incluye el label — un test que busca "dentro de este
    contexto" también encontraría el label, aunque no sea parte del dato */}
<div data-context="tags-editor">
  <label>Tags</label>
  <div className="input-container">...</div>
</div>
```

```tsx
{/* ✅ El contexto empieza donde empieza el dato, no antes */}
<div>
  <label>Tags</label>
  <div data-context="tags-editor" className="input-container">...</div>
</div>
```

## Nombrarlos bien

El valor del atributo sigue siempre el mismo criterio: kebab-case, y
describe **qué es**, no **dónde está** ni **cómo se ve**.

- `data-action`: `{verbo}-{sustantivo}` → `confirm-purchase`, `delete-item`
- `data-input`: `{campo}-field` → `email-field`, `quantity-field`
- `data-context`: `{sección}` o `{tipo de elemento}` → `portfolio-item`, `filter-bar`
- `data-label`: `{propósito}` → `title`, `status`, `error-message`

`buy-button-1` no dice nada cuando el proyecto crece a quince botones de
compra distintos; `confirm-purchase` sigue siendo correcto sin importar
cuántos haya.

## Así quedaría resuelto el caso real de esta base

Con `data-context="portfolio-item"` en cada fila de "Mi portfolio",
`portfolioAssetButton` deja de necesitar la clase CSS:

```typescript
// Antes (lo que hay hoy, sin poder tocar la app — ver 08):
portfolioAssetButton(name: string): Locator {
  return this.page.locator('.my-investments__items__name', { hasText: name });
}

// Con el atributo acordado con frontend:
portfolioAssetButton(name: string): Locator {
  return this.page.locator('[data-context="portfolio-item"]', { hasText: name });
}
```

La firma del método no cambia, ni cómo lo usa el test — cambia únicamente
*qué* usa adentro para encontrar el elemento. Eso es, en una línea, todo el
valor de pedir el atributo: el resto de la Page Object queda intacto.

## Verificar que el atributo llegó al elemento que correspondía

Agregar el atributo en el código no alcanza — antes de confiar en él hay
que confirmarlo contra el DOM renderizado, no contra el JSX. Un componente
de terceros (un dropdown de alguna librería de UI, por ejemplo) puede
recibir la prop y no pasarla al elemento final, o pasarla a un wrapper
interno en vez de al botón real. La forma de confirmarlo es simple:
inspeccionar el elemento en el navegador (o con una consulta al DOM) y
comprobar que el atributo está en la etiqueta que se espera —un `BUTTON`,
no un `DIV`— antes de escribir el selector que depende de él.

**Siguiente:** [BaseTest — lo que comparten todos los tests](./10-basetest.md)
