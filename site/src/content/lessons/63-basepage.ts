import type {ClassifyItem} from '@site/src/components/Classify';
import type {FillBlankSlot} from '@site/src/components/FillBlank';
import type {QuizQuestion} from '@site/src/components/Quiz';

export const BASE_COLUMNS = ['Va en BasePage', 'Va en el Page Object de la pantalla'];
export const BASE_ITEMS: ClassifyItem[] = [
  {code: 'abrir(): navega a la ruta de la pantalla.', column: 0, why: 'Es igual para todas las pantallas; solo cambia la ruta, que cada hija define.', hint: '¿Cambia algo más que la ruta entre pantallas?'},
  {code: 'cancelar(hora): cancela el turno de esa hora en la agenda.', column: 1, why: 'Es una acción de la agenda: ninguna otra pantalla cancela turnos.', hint: '¿Tiene sentido en la pantalla de pacientes?'},
  {code: 'esperarCarga(): espera a que desaparezca el indicador «Cargando…», que usan todas las pantallas de la aplicación.', column: 0, why: 'El indicador es común a toda la aplicación: un solo método para todas las pantallas.', hint: '¿Ese indicador aparece en una sola pantalla?'},
  {code: 'buscarPaciente(dni): escribe el DNI en el buscador de pacientes.', column: 1, why: 'El buscador es de la pantalla de pacientes.', hint: '¿Existe ese buscador en todas las pantallas?'},
  {code: 'completar(campo, texto): escribe el texto y saca el foco del campo, para que se valide como en toda la aplicación.', column: 0, why: 'Es una forma estándar de escribir en cualquier campo, sin saber de qué pantalla es.', hint: '¿Sabe algo de una pantalla en particular?'},
  {code: 'filtrarPorSede(sede): elige la sede en el filtro de la agenda y en el del reporte mensual, que funcionan distinto.', column: 1, why: 'Aunque dos pantallas filtren por sede, cada filtro funciona distinto: cada Page Object tiene el suyo.', hint: 'Dos pantallas lo tienen, pero ¿funciona igual en las dos?'},
  {code: 'cargarTelefono(numero): escribe el teléfono del paciente tecla por tecla, porque ese campo da formato mientras se escribe.', column: 1, why: 'El método común no sirve para ese campo: la pantalla de pacientes tiene el suyo, con el motivo escrito, sin cambiar `completar` para todas.', hint: '¿Todos los campos de la aplicación necesitan escribirse tecla por tecla?'},
  {code: 'estado(hora): devuelve la celda de estado de un turno.', column: 1, why: 'Es un locator de la agenda.', hint: '¿Qué pantalla tiene turnos con estado?'},
];

export const BASE_TEMPLATE = `export {{a}} class BasePage {
  protected abstract readonly ruta: string;

  constructor({{b}} readonly page: Page) {}

  async abrir(): Promise<void> {
    await this.page.goto(this.ruta);
  }
}

export class AgendaPage {{c}} BasePage {
  protected readonly ruta = '/agenda';
  readonly titulo: Locator;

  constructor(page: Page) {
    {{d}}(page);
    this.titulo = page.getByRole('heading', { name: 'Agenda del día' });
  }
}`;
export const BASE_SLOTS: FillBlankSlot[] = [
  {id: 'a', answer: 'abstract'},
  {id: 'b', answer: 'protected'},
  {id: 'c', answer: 'extends'},
  {id: 'd', answer: 'super'},
];
export const BASE_BANK = ['public', 'super', 'implements', 'abstract', 'this', 'extends', 'protected', 'static'];
export const BASE_EXPLANATION =
  '`abstract` impide crear una BasePage suelta y obliga a cada hija a definir `ruta`. `protected` deja la `page` disponible para las clases hijas pero no para el test. `extends` hace que AgendaPage herede `abrir`, y `super(page)` le pasa la página al constructor de la base.';

export const TSC_OUTPUT = `$ npx tsc --noEmit turnos.ts

turnos.ts(4,14): error TS2515:
  Non-abstract class 'AgendaPage' does
  not implement inherited abstract
  member ruta from class 'BasePage'.

turnos.ts(16,19): error TS2445:
  Property 'page' is protected and
  only accessible within class
  'BasePage' and its subclasses.`;

export const TSC_QUIZ: QuizQuestion[] = [
  {
    question: '¿Qué le falta a AgendaPage según el primer error?',
    options: [
      {text: 'Llamar a `super(page)` en su constructor.', correct: false, why: 'El error no habla del constructor: habla de un miembro abstracto sin implementar.'},
      {text: 'Declarar `protected readonly ruta = \'/agenda\'`.', correct: true, why: '`ruta` es abstracta en BasePage: cada clase hija tiene que definirla. Sin ruta, `abrir()` no sabría a dónde ir.'},
      {text: 'Declararse `abstract` también.', correct: false, why: 'Así compilaría, pero no se podría crear ninguna AgendaPage: el problema es que le falta la ruta.'},
    ],
  },
  {
    question: 'El segundo error viene de la línea `await pacientes.page.goto(\'/pacientes/nuevo\')`, dentro de un test. ¿Cuál es la corrección que respeta el patrón?',
    options: [
      {text: 'Cambiar `protected` por `public` en BasePage, para que el test pueda usar `page`.', correct: false, why: 'Compila, pero el test vuelve a tocar el navegador directamente, que es lo que el Page Object evita.'},
      {text: 'Que el test use la `page` de su propia fixture.', correct: false, why: 'Compila, pero el test sigue navegando a una ruta de la pantalla por su cuenta, en lugar de pedírselo al Page Object.'},
      {text: 'Agregar al Page Object un método como `abrirAlta()` que navegue a esa ruta, y usarlo en el test.', correct: true, why: 'El conocimiento de las rutas de la pantalla queda en el Page Object, y el test le pide la acción.'},
    ],
  },
];
