import type {ClassifyItem} from '@site/src/components/Classify';
import type {BuilderStep} from '@site/src/components/CommandBuilder';
import type {MultiSelectQuestion} from '@site/src/components/MultiSelect';

export const WHERE_COLUMNS = ['Propiedad del Page Object', 'Método fábrica', 'Componente compartido'];
export const WHERE_ITEMS: ClassifyItem[] = [
  {
    code: 'El título «Agenda del día» de la pantalla de agenda.',
    column: 0,
    why: 'Siempre es el mismo elemento y solo está en esa pantalla: una propiedad armada en el constructor.',
    hint: '¿Depende de algún dato? ¿Aparece en otras pantallas?',
  },
  {
    code: 'La fila del turno de una hora que el test elige en cada llamada.',
    column: 1,
    why: 'Depende de la hora, que llega recién cuando el test la pide: un método como `turno(hora)` que devuelve el locator.',
    hint: '¿Se puede armar en el constructor sin saber la hora?',
  },
  {
    code: 'El menú lateral de la aplicación, con Agenda, Pacientes y Reportes.',
    column: 2,
    why: 'Se repite en todas las pantallas: un componente que cada Page Object incluye.',
    hint: '¿En cuántas pantallas aparece?',
  },
  {
    code: 'El botón Cancelar de la fila de un turno determinado.',
    column: 1,
    why: 'Depende de qué turno: se arma a partir del método fábrica de la fila, `turno(hora)`.',
    hint: '¿Es siempre el mismo botón?',
  },
  {
    code: 'El filtro de profesionales de la agenda.',
    column: 0,
    why: 'Un elemento fijo de esa pantalla: una propiedad.',
    hint: '¿Cambia según algún dato del test?',
  },
  {
    code: 'El nombre de la recepcionista y el botón «Cerrar sesión» del encabezado.',
    column: 2,
    why: 'Es una parte repetida en todas las pantallas: va en un componente `Encabezado`.',
    hint: '¿Hay que declararlo en cada Page Object?',
  },
  {
    code: 'La tarjeta de un paciente en el buscador, según el DNI buscado.',
    column: 1,
    why: 'Depende del DNI: un método `paciente(dni)` que construye el locator.',
    hint: '¿Qué tarjeta es depende de un dato?',
  },
];

export const FACTORY_PREFIX = '';
export const FACTORY_STEPS: BuilderStep[] = [
  {options: ['readonly turno = ', 'turno(hora: string): Locator {', 'async turno() {'], correct: 'turno(hora: string): Locator {', hint: 'La fila depende de la hora: no puede ser una propiedad fija, y el método tiene que recibir ese dato y devolver un locator.'},
  {options: [' await this.page', ' return this.page', ' expect(this.page'], correct: ' return this.page', hint: 'Un método fábrica no ejecuta acciones ni verifica: devuelve el locator.'},
  {options: [".getByRole('row').nth(2)", ".getByRole('row').filter({ hasText: hora })", ".locator('tr')"], correct: ".getByRole('row').filter({ hasText: hora })", hint: 'Esa forma no usa la hora para elegir la fila.'},
  {options: ['; }', '.click(); }', '.isVisible(); }'], correct: '; }', hint: 'El método termina devolviendo el locator, sin actuar sobre él.'},
];
export const FACTORY_EXPLANATION =
  "`turno(hora: string): Locator { return this.page.getByRole('row').filter({ hasText: hora }); }` arma el locator de la fila a partir de la hora. `cancelar(hora)` y `estado(hora)` lo reutilizan, así que la forma de encontrar un turno existe una sola vez.";

export const CENTRAL_QUESTIONS: MultiSelectQuestion[] = [
  {
    prompt: 'En el `AgendaPage` de la suite, la forma de encontrar la fila de un turno (`getByRole(\'row\').filter({ hasText: hora })`) está escrita en cuatro métodos. ¿Qué cambios centralizan el locator? Marcá todos los que correspondan.',
    options: [
      {text: 'Crear `turno(hora)` que devuelva el locator de la fila, y usarlo en los cuatro métodos.', correct: true, why: 'El método fábrica deja la forma de encontrar la fila en un solo lugar.'},
      {text: 'Declarar `readonly fila = page.getByRole(\'row\')` y usar `fila.nth(...)` en cada método.', correct: false, why: 'Cambia el filtro por la hora por una posición: deja de encontrar el turno correcto si cambia el orden.'},
      {text: 'Declarar `readonly turnoDeLas0930 = page.getByRole(\'row\').filter({ hasText: \'09:30\' })` y usarlo en los cuatro métodos.', correct: false, why: 'Sirve para un solo horario: para las 10:00 haría falta otra propiedad. La hora tiene que ser un parámetro del método fábrica.'},
      {text: 'Copiar el locator en un comentario al principio de la clase, para que se vea.', correct: false, why: 'Un comentario no evita la repetición: los cuatro métodos siguen teniendo su copia.'},
      {text: 'Pasar el locator de la fila a un componente compartido, aunque solo exista en la agenda.', correct: false, why: 'Un componente tiene sentido para partes repetidas en varias pantallas; acá alcanza con un método fábrica.'},
    ],
  },
];
