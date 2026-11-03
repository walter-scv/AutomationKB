import type {FillBlankSlot} from '@site/src/components/FillBlank';
import type {CodeLine} from '@site/src/components/FindInCode';

export const POM_TEMPLATE = `export class AgendaPage {
  readonly titulo: {{a}};

  {{b}}(private readonly page: Page) {
    this.titulo = page.getByRole('heading', { name: 'Agenda del día' });
  }

  turno(hora: string): Locator {
    return this.page.getByRole('row').filter({ hasText: hora });
  }

  async cancelar({{c}}: string): Promise<void> {
    await this.turno(hora)
      .getByRole('button', { name: 'Cancelar' }).click();
  }

  estado(hora: string): Locator {
    {{d}} this.turno(hora).getByRole('cell').nth(3);
  }
}`;
export const POM_SLOTS: FillBlankSlot[] = [
  {id: 'a', answer: 'Locator'},
  {id: 'b', answer: 'constructor'},
  {id: 'c', answer: 'hora'},
  {id: 'd', answer: 'return'},
];
export const POM_BANK = ['await', 'Page', 'constructor', 'return', 'hora', 'Locator', 'expect', 'turno'];
export const POM_EXPLANATION =
  'Los locators son propiedades de tipo `Locator` que se arman en el `constructor`. `cancelar` recibe la `hora` como parámetro, y `estado` devuelve (`return`) un locator para que el test lo verifique.';

export const POM_RULE_LABELS = [
  'Verifica dentro del Page Object',
  'Nombre técnico en lugar de negocio',
  'Hace un flujo entero en un método',
];
export const POM_LINES: CodeLine[] = [
  {
    code: "async verificarTurnoCancelado(hora: string) { await expect(this.estado(hora)).toHaveText('Cancelado'); }",
    rule: 1,
    why: 'La assertion tiene que estar en el test. El Page Object devuelve `estado(hora)` y el test decide qué espera.',
    hint: '¿Quién decide si «Cancelado» es el resultado correcto?',
  },
  {
    code: "async reservar(hora: string, dni: string) { await this.turno(hora).getByRole('button', { name: 'Reservar' }).click(); await this.dni.fill(dni); await this.confirmar.click(); }",
    rule: 0,
    why: 'Es una acción de negocio con lo que varía como parámetro. Tres pasos de la misma acción en un método es razonable.',
    hint: '¿Es una sola acción que la recepcionista reconocería?',
  },
  {
    code: "async clickBotonFila2() { await this.page.getByRole('row').nth(2).getByRole('button').click(); }",
    rule: 2,
    why: 'El nombre dice qué hace técnicamente, no qué logra, y además elige por posición. Debería ser algo como `cancelar(hora)`.',
    hint: '¿Una persona de negocio entiende qué hace este método?',
  },
  {
    code: 'estado(hora: string): Locator { return this.turno(hora).getByRole(\'cell\').nth(3); }',
    rule: 0,
    why: 'Devuelve el locator de la celda de estado, para que el test lo verifique con una assertion web-first.',
    hint: '¿Este método decide algo o solo expone un elemento?',
  },
  {
    code: "async reservarCancelarYReprogramar(hora: string) { await this.reservar(hora, '30111222'); await this.cancelar(hora); await this.reprogramar(hora, '11:00'); }",
    rule: 3,
    why: 'Tres acciones distintas en un método: el test ya no puede verificar el resultado de cada una por separado.',
    hint: '¿Cuántas acciones de negocio hace este método?',
  },
  {
    code: "async completarCampos() { await this.dni.fill('30111222'); await this.nombre.fill('Ana Ruiz'); }",
    rule: 2,
    why: 'El nombre no dice para qué se completan los campos, y los datos están fijos adentro: debería ser algo como `cargarPaciente(dni, nombre)`.',
    hint: '¿Qué logra este método, y sirve para otro paciente?',
  },
  {
    code: "async filtrarPorProfesional(nombre: string) { await this.filtroProfesional.selectOption(nombre); }",
    rule: 0,
    why: 'Nombre de negocio, parámetro para lo que varía y una sola acción.',
    hint: '¿Tiene nombre de negocio y recibe lo que varía?',
  },
];

export const USE_ACCEPTED = [
  "await agendaPage.cancelar('09:30');", "await agendaPage.cancelar('09:30')",
  'await agendaPage.cancelar("09:30");', 'await agendaPage.cancelar("09:30")',
];
export const USE_HINTS = [
  'El test no busca la fila ni el botón: le pide la acción al Page Object.',
  'Es el método de acción de `AgendaPage`, con la hora como parámetro, y lleva `await`.',
];
export const USE_EXPLANATION =
  "`await agendaPage.cancelar('09:30')` dice qué hace la recepcionista. Cómo se encuentra la fila y el botón queda dentro del Page Object.";
