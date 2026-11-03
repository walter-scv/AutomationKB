import type {MatchItem} from '@site/src/components/Match';
import type {SpotTokenRound} from '@site/src/components/SpotToken';
import type {OrderItem, OrderRule} from '@site/src/components/Order';

export const ACTION_LEFT: MatchItem[] = [
  {id: 'fill', text: 'Escribir el email en un campo de texto común.'},
  {id: 'press', text: 'Escribir el número de tarjeta en un campo que agrega espacios con cada tecla.'},
  {id: 'select', text: 'Elegir «Córdoba» en la lista desplegable nativa de provincias.'},
  {id: 'check', text: 'Dejar marcada «Acepto los términos», esté como esté al empezar.'},
  {id: 'radio', text: 'Elegir «Retiro en sucursal» entre las opciones de envío.'},
  {id: 'set', text: 'Marcar o desmarcar «Factura A» según un dato del test que vale true o false.'},
];
export const ACTION_RIGHT: MatchItem[] = [
  {id: 'set', text: '`setChecked(esEmpresa)`'},
  {id: 'select', text: "`selectOption('Córdoba')`"},
  {id: 'radio', text: '`check()` sobre esa opción'},
  {id: 'fill', text: "`fill('ana@mail.com')`"},
  {id: 'check', text: '`check()` sobre la casilla'},
  {id: 'press', text: "`pressSequentially('4509953566233704')`"},
];
export const ACTION_WHY: Record<string, string> = {
  fill: 'Un campo común reacciona al evento `input`: `fill` alcanza y es lo más rápido.',
  press: 'El formato se aplica con cada tecla: hace falta escribir carácter por carácter.',
  select: 'Un `<select>` nativo se maneja con `selectOption`, por el texto visible de la opción.',
  check: '`check` es idempotente: deja la casilla marcada sin importar cómo estaba. `click` la invertiría.',
  radio: 'Un radio se elige con `check`; el navegador desmarca la opción anterior del grupo.',
  set: '`setChecked` recibe un booleano: el estado sale del dato del test.',
};

export const METHOD_PROMPT = '¿Qué parte de esta línea elige la forma equivocada de completar el campo?';
export const METHOD_ROUNDS: SpotTokenRound[] = [
  {
    line: "await page.getByLabel('Acepto los términos').click(); // tiene que quedar marcada",
    targetIndex: 3,
    why: '`click` invierte el estado: si la casilla ya estaba marcada, la desmarca. Para dejarla marcada, `check()`.',
    hint: '¿Qué pasa con esta línea si la casilla ya estaba marcada?',
  },
  {
    line: "await page.getByLabel('Provincia').fill('Córdoba'); // es un <select> nativo",
    targetIndex: 1,
    why: 'Un `<select>` no es un campo de texto: `fill` falla. Se usa `selectOption(\'Córdoba\')`.',
    hint: '¿Con qué acción se elige una opción de un `<select>`?',
  },
  {
    line: "await page.getByLabel('Envío a domicilio').uncheck(); // pasar a retiro en sucursal",
    targetIndex: 3,
    why: 'Un radio no se desmarca: `uncheck` falla. Se marca la otra opción, «Retiro en sucursal», con `check()`.',
    hint: '¿Cómo se desmarca un radio en un formulario?',
  },
  {
    line: "await page.getByLabel('Cuotas').selectOption({ index: 2 }); // elegir 3 cuotas",
    targetIndex: 2,
    why: '`index` elige por posición: si cambia el orden de las opciones, elige otra cantidad de cuotas. Se elige por el texto, «3 cuotas».',
    hint: '¿Qué parte de la línea depende del orden de las opciones?',
  },
  {
    line: "await page.getByLabel('Número de tarjeta').fill('4509953566233704'); // el campo agrega espacios al tipear",
    targetIndex: 3,
    why: 'El campo reacciona a cada tecla: `fill` pone el texto sin eventos de tecla y el formato no se aplica. Hace falta `pressSequentially`.',
    hint: '¿Esta acción dispara los eventos de cada tecla?',
  },
];

export const FORM_ITEMS: OrderItem[] = [
  {id: 'dir', what: 'Línea', code: "await page.getByLabel('Dirección').fill('Av. Colón 1200');"},
  {id: 'pay', what: 'Línea', code: "await page.getByRole('button', { name: 'Pagar' }).click();"},
  {id: 'prov', what: 'Línea', code: "await page.getByLabel('Provincia').selectOption('Córdoba');"},
  {id: 'ok', what: 'Línea', code: "await expect(page.getByText('Pedido confirmado')).toBeVisible();"},
  {id: 'radio', what: 'Línea', code: "await page.getByLabel('Envío a domicilio').check();"},
  {id: 'goto', what: 'Línea', code: "await page.goto('/checkout');"},
  {id: 'terms', what: 'Línea', code: "await page.getByLabel('Acepto los términos').check();"},
  {id: 'city', what: 'Línea', code: "await page.getByLabel('Ciudad').selectOption('Villa María');"},
];
export const FORM_CORRECT = ['goto', 'prov', 'city', 'radio', 'dir', 'terms', 'pay', 'ok'];
export const FORM_RULES: OrderRule[] = [
  {before: 'goto', after: 'prov', why: 'Primero hay que abrir el checkout.'},
  {before: 'prov', after: 'city', why: 'La lista de ciudades se completa según la provincia elegida.'},
  {before: 'city', after: 'radio', why: 'Las opciones de envío aparecen recién con la ciudad elegida.'},
  {before: 'radio', after: 'dir', why: 'El campo Dirección aparece al elegir envío a domicilio.'},
  {before: 'dir', after: 'terms', why: 'La casilla de términos se habilita cuando la dirección está completa.'},
  {before: 'terms', after: 'pay', why: 'Pagar se habilita con los términos aceptados.'},
  {before: 'pay', after: 'ok', why: 'La verificación va después de la acción que produce el resultado.'},
];

export const COVER_ACCEPTED = [
  "await page.getByLabel('Cobertura').selectOption('OSDE')",
  "await page.getByLabel('Cobertura').selectOption('OSDE');",
  "await page.getByLabel(\"Cobertura\").selectOption(\"OSDE\")",
  "await page.getByLabel(\"Cobertura\").selectOption(\"OSDE\");",
  "await page.getByLabel('Cobertura').selectOption({ label: 'OSDE' })",
  "await page.getByLabel('Cobertura').selectOption({ label: 'OSDE' });",
  "await page.getByLabel(\"Cobertura\").selectOption({ label: \"OSDE\" })",
  "await page.getByLabel(\"Cobertura\").selectOption({ label: \"OSDE\" });",
  "await page.getByLabel('Cobertura').selectOption({label: 'OSDE'})",
  "await page.getByLabel('Cobertura').selectOption({label: 'OSDE'});",
  "await page.getByLabel(\"Cobertura\").selectOption({label: \"OSDE\"})",
  "await page.getByLabel(\"Cobertura\").selectOption({label: \"OSDE\"});",
  "await page.getByLabel('Cobertura').selectOption({ label:'OSDE' })",
  "await page.getByLabel('Cobertura').selectOption({ label:'OSDE' });",
  "await page.getByLabel(\"Cobertura\").selectOption({ label:\"OSDE\" })",
  "await page.getByLabel(\"Cobertura\").selectOption({ label:\"OSDE\" });",
  "await page.getByLabel('Cobertura').selectOption({label:'OSDE'})",
  "await page.getByLabel('Cobertura').selectOption({label:'OSDE'});",
  "await page.getByLabel(\"Cobertura\").selectOption({label:\"OSDE\"})",
  "await page.getByLabel(\"Cobertura\").selectOption({label:\"OSDE\"});",
  "await page.getByLabel('Cobertura').selectOption({ value: 'osde' })",
  "await page.getByLabel('Cobertura').selectOption({ value: 'osde' });",
  "await page.getByLabel(\"Cobertura\").selectOption({ value: \"osde\" })",
  "await page.getByLabel(\"Cobertura\").selectOption({ value: \"osde\" });",
  "await page.getByLabel('Cobertura').selectOption({value: 'osde'})",
  "await page.getByLabel('Cobertura').selectOption({value: 'osde'});",
  "await page.getByLabel(\"Cobertura\").selectOption({value: \"osde\"})",
  "await page.getByLabel(\"Cobertura\").selectOption({value: \"osde\"});",
  "await page.getByRole('combobox', { name: 'Cobertura' }).selectOption('OSDE')",
  "await page.getByRole('combobox', { name: 'Cobertura' }).selectOption('OSDE');",
  "await page.getByRole(\"combobox\", { name: \"Cobertura\" }).selectOption(\"OSDE\")",
  "await page.getByRole(\"combobox\", { name: \"Cobertura\" }).selectOption(\"OSDE\");",
  "await page.getByRole('combobox', { name: 'Cobertura' }).selectOption({ label: 'OSDE' })",
  "await page.getByRole('combobox', { name: 'Cobertura' }).selectOption({ label: 'OSDE' });",
  "await page.getByRole(\"combobox\", { name: \"Cobertura\" }).selectOption({ label: \"OSDE\" })",
  "await page.getByRole(\"combobox\", { name: \"Cobertura\" }).selectOption({ label: \"OSDE\" });",
  "await page.getByRole('combobox', { name: 'Cobertura' }).selectOption({label: 'OSDE'})",
  "await page.getByRole('combobox', { name: 'Cobertura' }).selectOption({label: 'OSDE'});",
  "await page.getByRole(\"combobox\", { name: \"Cobertura\" }).selectOption({label: \"OSDE\"})",
  "await page.getByRole(\"combobox\", { name: \"Cobertura\" }).selectOption({label: \"OSDE\"});",
  "await page.getByRole('combobox', { name: 'Cobertura' }).selectOption({ label:'OSDE' })",
  "await page.getByRole('combobox', { name: 'Cobertura' }).selectOption({ label:'OSDE' });",
  "await page.getByRole(\"combobox\", { name: \"Cobertura\" }).selectOption({ label:\"OSDE\" })",
  "await page.getByRole(\"combobox\", { name: \"Cobertura\" }).selectOption({ label:\"OSDE\" });",
  "await page.getByRole('combobox', { name: 'Cobertura' }).selectOption({label:'OSDE'})",
  "await page.getByRole('combobox', { name: 'Cobertura' }).selectOption({label:'OSDE'});",
  "await page.getByRole(\"combobox\", { name: \"Cobertura\" }).selectOption({label:\"OSDE\"})",
  "await page.getByRole(\"combobox\", { name: \"Cobertura\" }).selectOption({label:\"OSDE\"});",
  "await page.getByRole('combobox', { name: 'Cobertura' }).selectOption({ value: 'osde' })",
  "await page.getByRole('combobox', { name: 'Cobertura' }).selectOption({ value: 'osde' });",
  "await page.getByRole(\"combobox\", { name: \"Cobertura\" }).selectOption({ value: \"osde\" })",
  "await page.getByRole(\"combobox\", { name: \"Cobertura\" }).selectOption({ value: \"osde\" });",
  "await page.getByRole('combobox', { name: 'Cobertura' }).selectOption({value: 'osde'})",
  "await page.getByRole('combobox', { name: 'Cobertura' }).selectOption({value: 'osde'});",
  "await page.getByRole(\"combobox\", { name: \"Cobertura\" }).selectOption({value: \"osde\"})",
  "await page.getByRole(\"combobox\", { name: \"Cobertura\" }).selectOption({value: \"osde\"});"
];
export const COVER_HINTS = [
  'Revisá dos cosas: que el locator encuentre el campo (por su etiqueta o por su rol) y que la acción sea la que corresponde a un `<select>` nativo.',
  'La acción recibe la opción a elegir; lo más legible es su texto visible.',
];
export const COVER_EXPLANATION =
  "`await page.getByLabel('Cobertura').selectOption('OSDE')` elige la opción por su texto visible. Por el `value` (`'osde'` o `{ value: 'osde' }`) también funciona, pero el texto es lo que ve la persona y es más legible.";
export const COVER_HTML = `<label for="cob">Cobertura</label>
<select id="cob">
  <option value="">Elegí</option>
  <option value="part">Particular</option>
  <option value="osde">OSDE</option>
  <option value="pami">PAMI</option>
</select>`;
