import type {CodeLine} from '@site/src/components/FindInCode';
import type {QuizQuestion} from '@site/src/components/Quiz';
import type {MultiSelectQuestion} from '@site/src/components/MultiSelect';

export const DIFF_RULE_LABELS = [
  'Afloja una verificación',
  'Fuera del alcance de la rama',
  'Cambio no permitido en la aplicación',
];
export const DIFF_LINES: CodeLine[] = [
  {
    code: "locators.ts · name: 'Cancelar'  →  name: 'Cancelar turno'",
    rule: 0,
    why: 'Corrige la entrada del contrato con el texto nuevo: es justo lo que permite esta rama.',
    hint: '¿Qué archivo toca y qué cambia?',
  },
  {
    code: "agenda.spec.ts · expect(agendaPage.estado('09:30')).toHaveText('Libre')  →  expect(agendaPage.estado('09:30')).toBeAttached()",
    rule: 1,
    why: 'Cambia la verificación del estado por una que pasa siempre que la celda exista: afloja el test.',
    hint: '¿Qué deja de verificar el test con este cambio?',
  },
  {
    code: "AgendaPage.ts · this.fila(hora).getByRole('button', { name: 'Reservar' })  →  page.getByRole('button', { name: 'Reservar' }).first()",
    rule: 1,
    why: 'Esquiva el error de strict mode eligiendo el primero, en lugar de acotar a la fila: el test puede reservar otro horario.',
    hint: '¿El locator nuevo encuentra el mismo botón que el test quería?',
  },
  {
    code: "helpers/turnos.ts · const HORARIO_INICIAL = '09:00'  →  const HORARIO_INICIAL = '10:00'",
    rule: 2,
    why: 'Cambia un dato de los helpers: eso corresponde a la rama de datos, no a una reparación de locator.',
    hint: '¿Esta rama puede modificar los helpers de datos?',
  },
  {
    code: "AgendaPage.ts · this.fila(hora).getByRole('cell').nth(2)  →  this.fila(hora).getByRole('cell', { name: /Libre|Reservado|Cancelado/ })",
    rule: 0,
    why: 'Angosta el locator para que encuentre la celda de estado por su contenido, no por posición: permitido en cualquier rama.',
    hint: '¿El locator nuevo es más preciso o más laxo?',
  },
  {
    code: "src/agenda/FilaTurno.tsx · se agrega: if (turno.estado === 'Libre') return mostrarError();",
    rule: 3,
    why: 'Cambia lógica de la aplicación: un auto-heal, como máximo, agrega un atributo de test a un elemento existente.',
    hint: '¿Esto es un atributo de test o lógica?',
  },
  {
    code: "src/agenda/FilaTurno.tsx · al <tr> que ya existe se le agrega: data-testid=\"fila-turno\"",
    rule: 0,
    why: 'Un atributo de test en un elemento existente, sin lógica: es lo máximo permitido en la aplicación.',
    hint: '¿Cambia algo del comportamiento de la aplicación?',
  },
];

export const TABLE_QUIZ: QuizQuestion[] = [
  {
    question: 'La reparación es de la rama «datos»: la fixture de turnos creaba los turnos con un horario que ya no existe. ¿Qué puede tocar?',
    options: [
      {text: 'Solo el contrato y los Page Objects, como en la rama de locators.', correct: false, why: 'Eso es la rama de locator desactualizado: los datos se corrigen en su origen.'},
      {text: 'La fixture y los helpers, sin aflojar ninguna assertion.', correct: true, why: 'El dato se arregla donde se crea, y el test puede ajustar su preparación explicando por qué.'},
      {text: 'Cualquier archivo de la suite, mientras los tests vuelvan a pasar.', correct: false, why: 'Que pasen no es el criterio: el alcance lo es.'},
    ],
  },
  {
    question: 'El Pull Request #318 cambió a propósito el mensaje «Turno reservado» por «Reserva confirmada», y el caso de uso ya dice el mensaje nuevo. ¿Qué rama puede actualizar la assertion?',
    options: [
      {text: 'La de cambio documentado, citando su fuente.', correct: true, why: 'Es la única rama que puede tocar una assertion, y solo para un comportamiento nuevo documentado.'},
      {text: 'La de locator desactualizado, porque cambió un texto visible.', correct: false, why: 'Esa rama no toca assertions: el texto es lo que se verifica, no lo que se busca.'},
      {text: 'Ninguna: las assertions no se tocan nunca en un auto-heal.', correct: false, why: 'Cuando la aplicación cambió a propósito y está documentado, el test tiene que verificar el comportamiento nuevo.'},
    ],
  },
  {
    question: 'El diagnóstico concluye «defecto»: la agenda permite reservar dos turnos a la misma hora. ¿Qué hace la rama de defecto?',
    options: [
      {text: 'Agrega test.fixme al test hasta que se corrija.', correct: false, why: 'La rama de defecto no toca ningún archivo de test.'},
      {text: 'Ajusta la assertion para que acepte las dos reservas.', correct: false, why: 'Sería esconder el defecto.'},
      {text: 'Reproduce el defecto y lo reporta, sin tocar ningún archivo.', correct: true, why: 'El test está bien: lo que hay que corregir es la aplicación.'},
    ],
  },
];

export const GAMING_QUESTIONS: MultiSelectQuestion[] = [
  {
    prompt: 'Un revisor de auto-heal tiene que rechazar siempre algunos cambios, vengan de un agente o de una persona. ¿Cuáles? Marcá todos los que correspondan.',
    options: [
      {text: 'Un texto exacto que pasa a ser una expresión regular más laxa.', correct: true, why: 'Afloja la verificación.'},
      {text: 'Un locator que pasa de buscar por posición a buscar la fila por la hora.', correct: false, why: 'Lo angosta: encuentra exactamente lo que el test quería.'},
      {text: 'Un timeout más grande para que un test colgado llegue a pasar.', correct: true, why: 'Tapa un cuelgue real en lugar de corregir su causa.'},
      {text: 'Una assertion que desaparece del test.', correct: true, why: 'El test deja de verificar algo.'},
      {text: 'La entrada del contrato actualizada con el texto nuevo del componente.', correct: false, why: 'Es la reparación de un locator desactualizado.'},
      {text: 'Un .first() agregado para esquivar un error de strict mode.', correct: true, why: 'Elige un elemento cualquiera en lugar de acotar el locator.'},
    ],
  },
];
