import type {FillBlankSlot} from '@site/src/components/FillBlank';
import type {CodeLine} from '@site/src/components/FindInCode';
import type {QuizQuestion} from '@site/src/components/Quiz';

export const CONTRACT_TEMPLATE = `export const LOCATORS = {
  botonCancelar: {
    {{a}}: 'Cancelar turno',
    {{b}}: 'text',
    {{c}}: 'src/agenda/FilaTurno.tsx',
  },
} as const;

// en AgendaPage
this.botonCancelar = page.getByRole('button', { name: {{d}} });`;
export const CONTRACT_SLOTS: FillBlankSlot[] = [
  {id: 'a', answer: 'name'},
  {id: 'b', answer: 'source'},
  {id: 'c', answer: 'file'},
  {id: 'd', answer: 'LOCATORS.botonCancelar.name'},
];
export const CONTRACT_BANK = ['name', 'value', 'source', 'file', 'path', 'LOCATORS.botonCancelar.name', "'Cancelar turno'", 'LOCATORS.botonCancelar'];
export const CONTRACT_EXPLANATION =
  'La entrada dice el valor (`name`), de qué atributo sale (`source`) y qué componente es su dueño (`file`). El Page Object usa `LOCATORS.botonCancelar.name`, no el texto escrito.';

export const PO_RULE_LABELS = [
  'Texto fuera del contrato',
  'Entrada del contrato incompleta',
  'Locator frágil sin justificar',
];
export const PO_LINES: CodeLine[] = [
  {
    code: "this.campoDni = page.getByLabel(LOCATORS.campoDni.name);",
    rule: 0,
    why: 'Usa la entrada del contrato, con el locator por etiqueta.',
    hint: '¿De dónde sale el valor?',
  },
  {
    code: "this.filtroSede = page.locator('select').nth(2);",
    rule: 3,
    why: 'CSS y posición, sin un comentario que lo justifique: se rompe con cualquier cambio de orden.',
    hint: '¿Qué pasa si se agrega otro select antes?',
  },
  {
    code: "listaTurnos: { name: 'lista-turnos', source: 'testID', file: 'src/agenda/Agenda.tsx' },",
    rule: 0,
    why: 'Entrada completa: valor, atributo y componente.',
    hint: '¿Le falta algo?',
  },
  {
    code: "async reservar(hora: string) { await this.turno(hora).getByRole('button', { name: 'Reservar' }).click(); }",
    rule: 1,
    why: 'El texto «Reservar» está escrito en el método: si cambia, el contrato no dice dónde buscarlo.',
    hint: '¿Este texto está en el contrato?',
  },
  {
    code: "this.mensaje = page.getByRole('status'); // la agenda tiene una sola región de estado",
    rule: 0,
    why: 'Un rol sin nombre, con el comentario que justifica que es único en la pantalla.',
    hint: '¿Está justificado?',
  },
  {
    code: "botonExportar: { name: 'Exportar', source: 'text' },",
    rule: 2,
    why: 'Falta `file`: nadie sabe qué componente es el dueño del texto.',
    hint: '¿Dónde se busca este texto si cambia?',
  },
];

export const DRIFT_QUIZ: QuizQuestion[] = [
  {
    question: 'El chequeo de desvío reporta: botonCancelar · name «Cancelar turno» · no aparece en src/agenda/FilaTurno.tsx (text). ¿Qué hacés primero?',
    options: [
      {text: 'Abrir FilaTurno.tsx y ver qué texto tiene hoy el botón, y si el cambio está aprobado.', correct: true, why: 'El contrato dice exactamente dónde mirar; después se decide si se corrige el contrato o es un defecto.'},
      {text: 'Borrar la entrada botonCancelar del contrato y usar el texto en el Page Object.', correct: false, why: 'El botón sigue existiendo: hay que saber qué cambió.'},
      {text: 'Cambiar el test para que use getByText(/Cancelar/), que encuentra las dos versiones.', correct: false, why: 'Afloja el locator en lugar de averiguar qué cambió.'},
    ],
  },
  {
    question: '¿Por qué el contrato de locators le sirve a un agente de reparación?',
    options: [
      {text: 'Porque le permite cambiar cualquier archivo de la aplicación que use el locator.', correct: false, why: 'Un agente de reparación no debería tocar la aplicación: el contrato le dice dónde mirar, no dónde editar.'},
      {text: 'Porque `file` y `source` le dicen qué componente abrir y qué atributo comparar, sin adivinar.', correct: true, why: 'Con eso, comprobar si un locator cambió es mecánico y con evidencia.'},
      {text: 'Porque los locators del contrato nunca fallan cuando cambia la interfaz.', correct: false, why: 'Fallan igual: lo que cambia es lo rápido que se encuentra la causa.'},
    ],
  },
];
