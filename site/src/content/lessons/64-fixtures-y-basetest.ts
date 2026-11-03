import type {OrderItem, OrderRule} from '@site/src/components/Order';
import type {FillBlankSlot} from '@site/src/components/FillBlank';
import type {MultiSelectQuestion} from '@site/src/components/MultiSelect';

export const FIX_CODE = `const test = base.extend<{
  sede: string;
  profesional: string;
  turno: string;
}>({
  sede: async ({}, use) => {
    console.log('sede: abrir la agenda de Centro');
    await use('Centro');
    console.log('sede: cerrar la agenda de Centro');
  },
  profesional: async ({ sede }, use) => {
    console.log('profesional: cargar a la Dra. Paz en', sede);
    await use('Dra. Paz');
    console.log('profesional: quitar a la Dra. Paz');
  },
  turno: async ({ profesional }, use) => {
    console.log('turno: crear el de las 09:30 con', profesional);
    await use('09:30');
    console.log('turno: borrar el de las 09:30');
  },
});

test('cancelar el turno', async ({ turno }) => {
  console.log('test: cancela el turno de las', turno);
});`;

export const FIX_ITEMS: OrderItem[] = [
  {id: 'prof2', what: 'Se imprime', code: '// profesional: quitar a la Dra. Paz'},
  {id: 'turno1', what: 'Se imprime', code: '// turno: crear el de las 09:30 con Dra. Paz'},
  {id: 'sede2', what: 'Se imprime', code: '// sede: cerrar la agenda de Centro'},
  {id: 'test', what: 'Se imprime', code: '// test: cancela el turno de las 09:30'},
  {id: 'sede1', what: 'Se imprime', code: '// sede: abrir la agenda de Centro'},
  {id: 'turno2', what: 'Se imprime', code: '// turno: borrar el de las 09:30'},
  {id: 'prof1', what: 'Se imprime', code: '// profesional: cargar a la Dra. Paz en Centro'},
];
export const FIX_CORRECT = ['sede1', 'prof1', 'turno1', 'test', 'turno2', 'prof2', 'sede2'];
export const FIX_RULES: OrderRule[] = [
  {before: 'sede1', after: 'prof1', why: '`profesional` pide `sede`: Playwright arma primero la fixture de la que depende.'},
  {before: 'prof1', after: 'turno1', why: '`turno` pide `profesional`, así que se arma después.'},
  {before: 'turno1', after: 'test', why: 'El test pidió `turno`: corre cuando las tres fixtures entregaron su valor con `use`.'},
  {before: 'test', after: 'turno2', why: 'Lo que está después de `use` corre al terminar el test.'},
  {before: 'turno2', after: 'prof2', why: 'Se desarman en orden inverso: primero la última que se armó.'},
  {before: 'prof2', after: 'sede2', why: '`sede` fue la primera en armarse, así que es la última en desarmarse.'},
];

export const BT_TEMPLATE = `import { {{a}} as base, expect } from '@playwright/test';
import { AgendaPage } from '../pages/AgendaPage';

type Fixtures = { agendaPage: AgendaPage; agendaAbierta: AgendaPage };

export const test = base.{{b}}<Fixtures>({
  agendaPage: async ({ page }, use) => {
    await use(new AgendaPage(page));
  },
  agendaAbierta: async ({ {{c}} }, use) => {
    await agendaPage.abrir();
    await {{d}}(agendaPage);
  },
});

export { {{e}} };`;
export const BT_SLOTS: FillBlankSlot[] = [
  {id: 'a', answer: 'test'},
  {id: 'b', answer: 'extend'},
  {id: 'c', answer: 'agendaPage'},
  {id: 'd', answer: 'use'},
  {id: 'e', answer: 'expect'},
];
export const BT_BANK = ['page', 'describe', 'use', 'agendaPage', 'expect', 'extend', 'return', 'test'];
export const BT_EXPLANATION =
  '`test` se importa como `base` y se extiende con `extend`. `agendaAbierta` pide la fixture `agendaPage`, abre la pantalla y la entrega con `use`. El archivo reexporta `expect` para que los tests importen todo de un solo lugar.';

export const FIX_QUESTIONS: MultiSelectQuestion[] = [
  {
    prompt: 'La suite de la agenda agrega a `base-test.ts` la fixture `turnoDePrueba`, que crea un turno por API antes de `use` y lo borra después. ¿Qué afirmaciones son correctas? Marcá todas las que correspondan.',
    options: [
      {text: 'Un test que no pide `turnoDePrueba` no crea ningún turno.', correct: true, why: 'Las fixtures se crean solo si el test las pide.'},
      {text: 'Si el test falla, el turno igual se borra.', correct: true, why: 'Lo que está después de `use` corre al terminar el test, pase o falle.'},
      {text: 'Hay que agregar un `afterEach` en cada archivo para borrar el turno.', correct: false, why: 'La limpieza ya está en la fixture, después de `use`: ningún test la repite.'},
      {text: 'Para usarla, cada test tiene que importar `test` de `base-test.ts`, no de `@playwright/test`.', correct: true, why: 'Solo el `test` extendido conoce la fixture nueva.'},
      {text: 'Conviene sumar otra fixture que envuelva cada test para guardar una captura cuando falla.', correct: false, why: 'Eso ya lo hace la configuración con `screenshot: \'only-on-failure\'`: una fixture para lo mismo es código de más.'},
      {text: 'La fixture se ejecuta una vez para toda la suite, antes del primer test.', correct: false, why: 'Una fixture común se arma para cada test que la pide, y se desarma al terminar ese test.'},
    ],
  },
];
