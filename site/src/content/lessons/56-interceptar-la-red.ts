import type {FillBlankSlot} from '@site/src/components/FillBlank';
import type {SpotTokenRound} from '@site/src/components/SpotToken';
import type {MultiSelectQuestion} from '@site/src/components/MultiSelect';

export const MOCK_TEMPLATE = `test('si el cálculo de envío falla, se avisa', async ({ page }) => {
  await page.{{a}}('**/api/envios*', (route) =>
    route.{{b}}({ {{c}}: 503, body: 'error' }));
  await page.{{d}}('/checkout');
  await page.getByLabel('Código postal').fill('5000');
  await page.getByRole('button', { name: 'Calcular envío' }).click();
  await expect(page.getByText('No pudimos calcular el envío'))
    .toBeVisible();
});`;
export const MOCK_SLOTS: FillBlankSlot[] = [
  {id: 'a', answer: 'route'},
  {id: 'b', answer: 'fulfill'},
  {id: 'c', answer: 'status'},
  {id: 'd', answer: 'goto'},
];
export const MOCK_BANK = ['abort', 'goto', 'json', 'waitForResponse', 'fulfill', 'fetch', 'route', 'status'];
export const MOCK_EXPLANATION =
  '`page.route` intercepta los pedidos al cálculo de envío y `route.fulfill({ status: 503, ... })` los responde con un error, sin llegar al servidor. La ruta se registra antes de navegar, y el test verifica lo que ve la persona cuando el servicio falla.';

export const NET_PROMPT = '¿Qué parte de esta línea hace que la intercepción no funcione o haga más de lo que el test pretende?';
export const NET_ROUNDS: SpotTokenRound[] = [
  {
    line: "await page.getByRole('button', { name: 'Calcular envío' }).click(); await page.route('**/api/envios*', (route) => route.abort());",
    targetIndex: 8,
    why: 'La ruta se registra después del click que hace el pedido: el pedido ya salió y llegó al servidor real sin interceptar.',
    hint: '¿En qué orden pasan el click que pide el envío y el registro de la ruta?',
  },
  {
    line: "await page.route('**/api/envio', (route) => route.fulfill({ json: [] }));",
    targetIndex: 1,
    why: 'La pantalla pide `/api/envios?cp=5000`. El patrón no tiene la `s` ni el comodín final: no coincide, y el pedido llega al servidor sin ningún aviso.',
    hint: 'La pantalla pide /api/envios?cp=5000. ¿Coincide con el patrón?',
  },
  {
    line: "await page.getByRole('button', { name: 'Calcular envío' }).click(); const respuesta = await page.waitForResponse('**/api/envios*');",
    targetIndex: 11,
    why: 'La espera empieza después del click: según cuánto tarde el servidor, la respuesta llega antes o después de que el test empiece a esperarla. Es una carrera que vuelve inestable al test.',
    hint: '¿En qué momento empieza a esperar el test la respuesta?',
  },
  {
    line: "await page.route('**/api/**', (route) => route.fulfill({ status: 500, body: 'error' })); // probar el error del cálculo de envío",
    targetIndex: 1,
    why: 'El patrón intercepta todos los pedidos a la API, no solo el de envíos: el carrito, el usuario y los productos también fallan, y el test ya no prueba solo lo que dice el comentario.',
    hint: '¿Qué pedidos coinciden con ese patrón, además del de envíos?',
  },
];

export const WHEN_QUESTIONS: MultiSelectQuestion[] = [
  {
    prompt: 'En la suite de la tienda, ¿qué tests conviene escribir simulando la respuesta con `page.route`? Marcá todos los que correspondan.',
    options: [
      {text: 'Lo que ve la persona cuando el cálculo de envío responde con un error 503.', correct: true, why: 'El entorno de pruebas no falla a pedido: simular el error es la única forma de probar ese caso de forma repetible.'},
      {text: 'El flujo principal de compra, de punta a punta, con el carrito, el pago y la confirmación.', correct: false, why: 'Es lo que el test tiene que probar contra el servidor real: simularlo dejaría de probar la aplicación completa.'},
      {text: 'La pantalla de pago, que depende de un servicio externo de tarjetas que el equipo no controla.', correct: true, why: 'Playwright recomienda simular las dependencias de terceros: su disponibilidad no depende del equipo.'},
      {text: 'Que el carrito muestre «Tu carrito está vacío» cuando la API devuelve una lista vacía.', correct: true, why: 'Con `fulfill({ json: [] })` el caso se prueba sin tener que vaciar el carrito real.'},
      {text: 'Que al aplicar un cupón, la página envíe el código del cupón al servidor.', correct: false, why: 'No hace falta simular nada: `waitForRequest` y `postDataJSON()` verifican lo que la página mandó al servidor real.'},
    ],
  },
];
