import type {MatchItem} from '@site/src/components/Match';
import type {MultiSelectQuestion} from '@site/src/components/MultiSelect';
import type {OrderItem, OrderRule} from '@site/src/components/Order';

export const WIDGET_LEFT: MatchItem[] = [
  {id: 'date', text: 'Un `<input type="date">` para la fecha del turno.'},
  {id: 'range', text: 'Un `<input type="range">` para la distancia máxima a la sede.'},
  {id: 'slider', text: 'Un `<div role="slider">` para la cantidad de estrellas mínima.'},
  {id: 'combo', text: 'Un `<div role="combobox">` que despliega la lista de sedes.'},
  {id: 'select', text: 'Un `<select>` nativo con las obras sociales.'},
  {id: 'auto', text: 'Un campo que sugiere profesionales mientras se escribe.'},
];
export const WIDGET_RIGHT: MatchItem[] = [
  {id: 'auto', text: "`pressSequentially('Pa')` y click en la opción sugerida"},
  {id: 'select', text: "`selectOption('OSDE')`"},
  {id: 'date', text: "`fill('2026-11-18')`"},
  {id: 'combo', text: "click en el combobox y click en `getByRole('option', { name: 'Centro' })`"},
  {id: 'slider', text: "`press('ArrowRight')` con el foco en el control"},
  {id: 'range', text: "`fill('10')`"},
];
export const WIDGET_WHY: Record<string, string> = {
  date: 'Un campo de fecha nativo acepta `fill` con el formato año-mes-día.',
  range: 'Un `range` nativo acepta `fill` con el valor.',
  slider: 'Un slider propio se maneja con el teclado; su valor queda en `aria-valuenow`.',
  combo: 'Una lista propia no es un `<select>`: se abre con un click y se elige la opción por su rol.',
  select: 'Un `<select>` nativo se maneja con `selectOption`.',
  auto: 'El campo reacciona a cada tecla: se escribe con `pressSequentially` y se elige la sugerencia.',
};

export const AGENDA_TABLE = `<table>
  <tr>
    <th>Hora</th><th>Profesional</th>
    <th>Sede</th><th>Estado</th>
  </tr>
  <tr>
    <td>09:00</td><td>Dra. Paz</td>
    <td>Centro</td><td>Libre</td>
  </tr>
  <tr>
    <td>09:30</td><td>Dr. Ruiz</td>
    <td>Belgrano</td><td>Ocupado</td>
  </tr>
  <tr>
    <td>10:00</td><td>Dra. Paz</td>
    <td>Belgrano</td><td>Libre</td>
  </tr>
</table>`;

export const CELL_ACCEPTED = ['Belgrano', "'Belgrano'", '"Belgrano"'];
export const CELL_HINTS = [
  'Primero ubicá la fila: ¿cuál contiene «Dr. Ruiz»?',
  '`nth` cuenta desde 0: la celda 0 es la hora. ¿Cuál es la celda 2?',
];
export const CELL_EXPLANATION =
  "`filter({ hasText: 'Dr. Ruiz' })` deja la fila de las 09:30, y `getByRole('cell').nth(2)` es su tercera celda, la de la sede: «Belgrano».";

export const PRICE_QUESTIONS: MultiSelectQuestion[] = [
  {
    prompt: 'Con la agenda de la actividad anterior, ¿qué locators encuentran solo la celda del estado del turno de las 10:00, aunque cambie el orden de las filas o el estado del turno? Marcá todos los que correspondan.',
    options: [
      {text: "`page.getByRole('row').filter({ hasText: '10:00' }).getByRole('cell').nth(3)`", correct: true, why: 'La fila se elige por su contenido y la celda por su columna: la cuarta es el estado.'},
      {text: "`page.getByRole('row').filter({ hasText: 'Dra. Paz' }).getByRole('cell').nth(3)`", correct: false, why: 'La Dra. Paz tiene dos turnos: el filtro deja dos filas, y `nth(3)` cuenta sobre las ocho celdas de las dos. Encuentra una sola celda, pero es el estado del turno de las 09:00.'},
      {text: "`page.getByRole('row').nth(3).getByRole('cell').nth(3)`", correct: false, why: 'Hoy es la fila de las 10:00, pero elegida por posición: si la agenda cambia de orden, es otro turno.'},
      {text: "`page.getByRole('row').filter({ hasText: '10:00' }).getByRole('cell').filter({ hasText: 'Libre' })`", correct: false, why: 'Hoy encuentra la celda, pero la busca por su valor: si el turno pasa a «Ocupado», deja de encontrarla. El dato que se quiere verificar no puede ser parte del locator.'},
      {text: "`page.getByRole('row').filter({ has: page.getByRole('cell', { name: '10:00', exact: true }) }).getByRole('cell').nth(3)`", correct: true, why: 'Elige la fila por la celda de la hora, exacta, y la celda por su columna: no depende del orden ni del estado.'},
      {text: "`page.getByRole('cell').filter({ hasText: 'Libre' })`", correct: false, why: 'Sin elegir la fila, encuentra las dos celdas «Libre» de la agenda.'},
    ],
  },
];

export const FILTER_ITEMS: OrderItem[] = [
  {id: 'pick', what: 'Línea', code: "await page.getByRole('option', { name: 'Dra. Paz' }).click();"},
  {id: 'open', what: 'Línea', code: "await page.getByRole('combobox', { name: 'Especialidad' }).click();"},
  {id: 'search', what: 'Línea', code: "await page.getByRole('button', { name: 'Buscar turnos' }).click();"},
  {id: 'spec', what: 'Línea', code: "await page.getByRole('option', { name: 'Dermatología' }).click();"},
  {id: 'rows', what: 'Línea', code: "await expect(page.getByRole('row').filter({ has: page.getByRole('cell') })).toHaveCount(4);"},
  {id: 'type', what: 'Línea', code: "await page.getByRole('combobox', { name: 'Profesional' }).pressSequentially('Pa');"},
  {id: 'date', what: 'Línea', code: "await page.getByLabel('Desde').fill('2026-11-18');"},
];
export const FILTER_CORRECT = ['open', 'spec', 'type', 'pick', 'date', 'search', 'rows'];
export const FILTER_RULES: OrderRule[] = [
  {before: 'open', after: 'spec', why: 'La opción aparece recién al abrir la lista.'},
  {before: 'spec', after: 'type', why: 'Los profesionales sugeridos dependen de la especialidad elegida.'},
  {before: 'type', after: 'pick', why: 'La sugerencia aparece mientras se escribe.'},
  {before: 'pick', after: 'date', why: 'La fecha se habilita con la profesional elegida.'},
  {before: 'date', after: 'search', why: 'Buscar se habilita cuando están todos los filtros.'},
  {before: 'search', after: 'rows', why: 'Las filas de resultados aparecen después de buscar.'},
];
