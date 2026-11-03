import type {FillBlankSlot} from '@site/src/components/FillBlank';
import type {MultiSelectQuestion} from '@site/src/components/MultiSelect';
import type {SpotTokenRound} from '@site/src/components/SpotToken';
import type {DecisionNode} from '@site/src/components/DecisionPath';

export const CART_HTML = `<h1>Carrito</h1>
<ul>
  <li>
    <h3>Mochila urbana</h3>
    <p>$ 45.000</p>
    <button>Agregar uno</button>
    <button>Quitar</button>
  </li>
  <li>
    <h3>Mochila escolar</h3>
    <p>$ 32.000</p>
    <button>Agregar uno</button>
    <button>Quitar</button>
  </li>
  <li>
    <h3>Termo de acero</h3>
    <p>$ 28.000 · Sin stock</p>
    <button disabled>
      Agregar uno
    </button>
    <button>Quitar</button>
  </li>
</ul>
<button>Vaciar carrito</button>`;

export const CHAIN_TEMPLATE = `await page
  .getByRole('{{a}}')
  .{{b}}({ {{c}}: 'Mochila urbana' })
  .getByRole('button', { name: '{{d}}' })
  .click();`;
export const CHAIN_SLOTS: FillBlankSlot[] = [
  {id: 'a', answer: 'listitem'},
  {id: 'b', answer: 'filter'},
  {id: 'c', answer: 'hasText'},
  {id: 'd', answer: 'Quitar'},
];
export const CHAIN_BANK = ['nth', 'Quitar', 'list', 'hasText', 'filter', 'listitem', 'name', 'Vaciar carrito'];
export const CHAIN_EXPLANATION =
  'Cada producto es un `listitem`. `filter({ hasText: \'Mochila urbana\' })` se queda con el ítem de la mochila urbana, y dentro de él se busca el botón Quitar. `list` es la `<ul>` completa: filtrarla no separa los productos.';

export const PICK_QUESTIONS: MultiSelectQuestion[] = [
  {
    prompt: 'Con el carrito de arriba, ¿qué locators encuentran solo el botón Quitar de la mochila urbana, sin depender del orden de la lista? Marcá todos los que correspondan.',
    options: [
      {text: "`page.getByRole('listitem').filter({ hasText: 'Mochila urbana' }).getByRole('button', { name: 'Quitar' })`", correct: true, why: 'El filtro deja un solo ítem, y dentro de él hay un solo botón Quitar.'},
      {text: "`page.getByRole('listitem').filter({ hasText: 'Mochila' }).getByRole('button', { name: 'Quitar' })`", correct: false, why: '«Mochila» aparece en dos ítems: el locator encuentra dos botones Quitar.'},
      {text: "`page.getByRole('listitem').filter({ has: page.getByRole('heading', { name: 'Mochila urbana' }) }).getByRole('button', { name: 'Quitar' })`", correct: true, why: 'Identifica el ítem por su título y busca adentro el botón: encuentra uno solo.'},
      {text: "`page.getByRole('button', { name: 'Quitar' }).first()`", correct: false, why: 'Hoy encuentra ese botón, pero por posición: si el carrito se ordena distinto, quita otro producto.'},
      {text: "`page.getByRole('listitem').getByRole('button', { name: 'Quitar' })`", correct: false, why: 'Encadenar sin filtrar busca dentro de los tres ítems: encuentra tres botones.'},
    ],
  },
  {
    prompt: '¿Qué locators encuentran solo el ítem del termo, el que no tiene stock? Marcá todos los que correspondan.',
    options: [
      {text: "`page.getByRole('listitem').filter({ hasNotText: 'Sin stock' })`", correct: false, why: '`hasNotText` descarta el termo y se queda con las dos mochilas.'},
      {text: "`page.getByRole('listitem').filter({ has: page.getByRole('button', { name: 'Agregar uno', disabled: true }) })`", correct: true, why: 'Solo el ítem del termo contiene el botón Agregar uno deshabilitado.'},
      {text: "`page.getByRole('listitem').nth(2)`", correct: false, why: 'Hoy es el termo, por estar tercero. Si cambia el orden, es otro producto.'},
      {text: "`page.getByRole('listitem').filter({ hasText: 'Sin stock' })`", correct: true, why: 'Solo el ítem del termo contiene «Sin stock».'},
    ],
  },
];

export const WRONG_PROMPT = '¿Qué parte de esta línea hace que el locator encuentre otra cosa o más de un elemento?';
export const WRONG_ROUNDS: SpotTokenRound[] = [
  {
    line: "await page.getByRole('listitem').filter({ hasText: 'Mo' }).getByRole('button', { name: 'Quitar' }).click();",
    targetIndex: 3,
    why: "«Mo» está en las dos mochilas y también en «Termo»: el filtro deja los tres ítems y el click falla por strict mode.",
    hint: '¿En cuántos productos aparece ese texto, sin distinguir mayúsculas?',
  },
  {
    line: "await page.getByRole('button', { name: 'Quitar' }).nth(2).click();",
    targetIndex: 5,
    why: '`nth(2)` elige el tercer botón Quitar por posición. Si el carrito se ordena por precio, quita otro producto sin fallar.',
    hint: '¿Qué parte elige el botón por su lugar en la página?',
  },
  {
    line: "await expect(page.getByRole('listitem').filter({ has: page.getByRole('heading', { name: 'Termo de acero' }) }).getByRole('button')).toBeVisible();",
    targetIndex: 10,
    why: "El filtro deja bien el ítem del termo, pero `getByRole('button')` sin nombre encuentra sus dos botones, Agregar uno y Quitar: la assertion falla por strict mode.",
    hint: 'El ítem quedó bien elegido. ¿Cuántos botones tiene adentro?',
  },
];

export const SORT_START = 'wrong';
export const SORT_NODES: Record<string, DecisionNode> = {
  wrong: {
    id: 'wrong',
    situation: "El test «quitar la mochila urbana la saca del carrito» usa `page.getByRole('button', { name: 'Quitar' }).first()`. Desde que el carrito se ordena por precio de menor a mayor, el test pasa pero quita el termo. ¿Por qué?",
    options: [
      {text: 'El ordenamiento rompió el botón Quitar de la mochila.', correct: false, why: 'El botón funciona: el test hace click en otro, porque elige por posición.'},
      {text: '`first()` elige el primer botón de la página, y ahora el primero es el del termo, el más barato.', correct: true, why: 'Un locator por posición sigue al elemento que esté primero, no al producto que el test quería.', next: 'fix'},
      {text: 'Playwright ordena los elementos alfabéticamente antes de aplicar `first()`.', correct: false, why: '`first()` respeta el orden del DOM. Lo que cambió es el orden de la página.'},
    ],
  },
  fix: {
    id: 'fix',
    situation: '¿Cómo reescribís el locator?',
    options: [
      {text: "`page.getByRole('button', { name: 'Quitar' }).last()`.", correct: false, why: 'Sigue eligiendo por posición: hoy la mochila urbana es la más cara, mañana puede no serlo.'},
      {text: "`page.getByRole('listitem').filter({ hasText: 'Mochila urbana' }).getByRole('button', { name: 'Quitar' })`.", correct: true, why: 'Identifica el producto por lo que lo distingue y busca el botón adentro: no depende del orden.', next: 'verify'},
      {text: "`page.getByRole('listitem').getByRole('button', { name: 'Quitar' })`.", correct: false, why: 'Busca dentro de todos los ítems sin filtrar: encuentra tres botones y el click falla.'},
    ],
  },
  verify: {
    id: 'verify',
    situation: 'Después del click querés confirmar qué productos quedaron en el carrito, por nombre. ¿Qué leés?',
    options: [
      {text: "`await page.getByRole('heading').allTextContents()`.", correct: false, why: 'También incluye el título «Carrito», que no es un producto.'},
      {text: "`await page.getByRole('listitem').count()`.", correct: false, why: 'Dice cuántos quedaron, no cuáles: si se quitó el producto equivocado, el número es el mismo.'},
      {text: "`await page.getByRole('listitem').getByRole('heading').allTextContents()`.", correct: true, why: 'Los títulos dentro de los ítems son los nombres de los productos: se puede comprobar que la mochila urbana ya no está.'},
    ],
  },
};
export const SORT_EXPLANATION =
  'Un locator por posición sigue al elemento que esté en ese lugar. Se reemplaza por un filtro sobre lo que distingue al producto, y el resultado se confirma por nombre, no solo por cantidad.';
