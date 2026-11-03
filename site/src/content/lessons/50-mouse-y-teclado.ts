import type {MatchItem} from '@site/src/components/Match';
import type {OrderItem, OrderRule} from '@site/src/components/Order';
import type {BuilderStep} from '@site/src/components/CommandBuilder';

export const GESTURE_LEFT: MatchItem[] = [
  {id: 'hover', text: 'El botón «Comparar» de cada producto aparece recién con el mouse encima de la tarjeta.'},
  {id: 'dbl', text: 'La cantidad del carrito se edita haciendo doble click sobre el número.'},
  {id: 'right', text: 'El click derecho sobre un producto abre «Guardar para después».'},
  {id: 'enter', text: 'El buscador de la tienda busca al presionar la tecla de confirmación, sin botón.'},
  {id: 'esc', text: 'La ventana del zoom de la foto se cierra con la tecla de escape, esté donde esté el foco.'},
  {id: 'drag', text: 'La lista de deseos se ordena arrastrando los productos.'},
];
export const GESTURE_RIGHT: MatchItem[] = [
  {id: 'esc', text: "`page.keyboard.press('Escape')`"},
  {id: 'drag', text: '`dragTo(destino)`'},
  {id: 'hover', text: '`hover()` sobre la tarjeta'},
  {id: 'enter', text: "`press('Enter')` sobre el buscador"},
  {id: 'right', text: "`click({ button: 'right' })`"},
  {id: 'dbl', text: '`dblclick()`'},
];
export const GESTURE_WHY: Record<string, string> = {
  hover: 'El botón está oculto hasta que el mouse pasa por la tarjeta: primero `hover()`, después el click.',
  dbl: 'La interfaz responde al doble click: `dblclick()`.',
  right: '`button: \'right\'` hace click derecho y abre el menú contextual de la página.',
  enter: 'El buscador escucha la tecla Enter: `press(\'Enter\')` sobre el campo prueba ese camino.',
  esc: 'La tecla actúa sobre la página entera, no sobre un elemento: `page.keyboard.press`.',
  drag: '`dragTo` arrastra el elemento y lo suelta sobre el destino.',
};

export const KEYS_ITEMS: OrderItem[] = [
  {id: 'tab2', what: 'Línea', code: "await page.keyboard.press('Tab');  // segundo Tab"},
  {id: 'checked', what: 'Línea', code: "await expect(page.getByLabel('Recordarme')).toBeChecked();"},
  {id: 'email', what: 'Línea', code: "await page.getByLabel('Email').fill('ana@mail.com');"},
  {id: 'focusbox', what: 'Línea', code: "await expect(page.getByLabel('Recordarme')).toBeFocused();"},
  {id: 'tab1', what: 'Línea', code: "await page.keyboard.press('Tab');  // primer Tab"},
  {id: 'pass', what: 'Línea', code: "await page.getByLabel('Contraseña').fill('clave123');"},
  {id: 'space', what: 'Línea', code: "await page.keyboard.press('Space');"},
  {id: 'focuspass', what: 'Línea', code: "await expect(page.getByLabel('Contraseña')).toBeFocused();"},
];
export const KEYS_CORRECT = ['email', 'tab1', 'focuspass', 'pass', 'tab2', 'focusbox', 'space', 'checked'];
export const KEYS_RULES: OrderRule[] = [
  {before: 'email', after: 'tab1', why: 'El recorrido empieza en el email: el Tab sale desde ahí.'},
  {before: 'tab1', after: 'focuspass', why: 'Se verifica que el Tab haya llevado el foco a la contraseña.'},
  {before: 'focuspass', after: 'pass', why: 'El foco se verifica antes de escribir: `fill` pondría el foco en el campo por su cuenta y la verificación ya no probaría nada.'},
  {before: 'pass', after: 'tab2', why: 'El segundo Tab sale desde la contraseña.'},
  {before: 'tab2', after: 'focusbox', why: 'Se verifica que el foco llegó a la casilla.'},
  {before: 'focusbox', after: 'space', why: '`Space` marca la casilla que tiene el foco: primero hay que confirmar cuál lo tiene.'},
  {before: 'space', after: 'checked', why: 'La verificación del estado va después de la tecla que lo cambia.'},
];

export const DRAG_PREFIX = 'await page.getByRole(\'listitem\')';
export const DRAG_STEPS: BuilderStep[] = [
  {options: [".nth(2)", ".filter({ hasText: 'Termo' })", ".last()"], correct: ".filter({ hasText: 'Termo' })", hint: 'Ese fragmento elige el ítem por su posición: si la lista cambia de orden, arrastra otro producto.'},
  {options: ['.hover().click(', '.dragTo(', '.click('], correct: '.dragTo(', hint: 'Esa acción no arrastra el elemento hasta otro.'},
  {options: ["page.getByRole('listitem').filter({ hasText: 'Mochila urbana' })", 'page.mouse.move(120, 340)', "page.getByText('Mochila')"], correct: "page.getByRole('listitem').filter({ hasText: 'Mochila urbana' })", hint: 'El destino tiene que ser un locator que encuentre un solo ítem, sin coordenadas.'},
  {options: [');', '); await page.mouse.up();', ').first();'], correct: ');', hint: '`dragTo` ya suelta el elemento: no hace falta nada más.'},
];
export const DRAG_EXPLANATION =
  "`await page.getByRole('listitem').filter({ hasText: 'Termo' }).dragTo(page.getByRole('listitem').filter({ hasText: 'Mochila urbana' }));` arrastra el termo hasta la mochila urbana. Después se verifica el orden completo con `toHaveText([...])`.";

export const SHORTCUT_ACCEPTED = ["ControlOrMeta+A", "'ControlOrMeta+A'", "press('ControlOrMeta+A')", "press('ControlOrMeta+A');", "\"ControlOrMeta+A\"", "press(\"ControlOrMeta+A\")", "press(\"ControlOrMeta+A\");"];
export const SHORTCUT_HINTS = [
  'Es una combinación: dos teclas unidas con `+`.',
  'Hay un nombre de tecla que vale Control en Windows y Linux, y Cmd en macOS.',
];
export const SHORTCUT_EXPLANATION =
  "`press('ControlOrMeta+A')` selecciona todo el texto del campo en cualquier sistema operativo. Con `Control+A` fijo, el test fallaría en macOS.";
