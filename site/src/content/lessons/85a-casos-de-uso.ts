import type {CodeLine} from '@site/src/components/FindInCode';
import type {ClassifyItem} from '@site/src/components/Classify';
import type {DecisionNode} from '@site/src/components/DecisionPath';

export const UC_RULE_LABELS = [
  'Resultado o regla que no se puede comprobar',
  'Detalle de implementación',
  'No alcanza para preparar los datos',
];
export const UC_LINES: CodeLine[] = [
  {
    code: '**Actor:** recepcionista',
    rule: 0,
    why: 'Dice quién hace el recorrido: el agente sabe con qué cuenta ingresar.',
    hint: '¿Le falta algo para saber con qué usuario probar?',
  },
  {
    code: '- Hay turnos en la agenda.',
    rule: 3,
    why: 'No dice qué turno hace falta: para reprogramar se necesita uno reservado a futuro, y para E1 un horario ocupado.',
    hint: '¿Con esta precondición se sabe qué datos crear?',
  },
  {
    code: '2. Presiona el botón con data-testid="btn-reprog" en la fila del turno.',
    rule: 2,
    why: 'El caso de uso describe lo que ve el usuario («Reprogramar»); los locators van en los Page Objects o en el contrato.',
    hint: '¿Es lo que ve el usuario o cómo está hecha la pantalla?',
  },
  {
    code: '4. El sistema funciona correctamente.',
    rule: 1,
    why: 'No dice qué se ve: el resultado tiene que poder comprobarse, por ejemplo «el turno aparece a las 11:00».',
    hint: '¿Cómo sabría un agente si el paso salió bien?',
  },
  {
    code: '- E1. El horario elegido está ocupado: se muestra «Ese horario ya está reservado» y el turno no cambia.',
    rule: 0,
    why: 'Condición, mensaje exacto y estado final: se puede comprobar.',
    hint: '¿Se puede comprobar lo que dice?',
  },
  {
    code: '- RN-1. Se puede reprogramar con anticipación suficiente.',
    rule: 1,
    why: 'Sin un valor concreto, el agente toma como correcto lo que permita la aplicación.',
    hint: '¿Cuánta anticipación es suficiente?',
  },
  {
    code: '- RN-2. El cambio se guarda con PUT /api/turnos/:id.',
    rule: 2,
    why: 'Es cómo está hecho, no una regla para el usuario: puede cambiar sin que cambie la funcionalidad.',
    hint: '¿Lo ve o lo decide el usuario?',
  },
  {
    code: '| Principal | reprogramar un turno lo mueve |',
    rule: 0,
    why: 'La fila de cobertura une el flujo con su test.',
    hint: '¿Qué dice esta fila de la tabla de cobertura?',
  },
];

export const DOC_COLUMNS = ['Caso de uso', 'Page Object', 'Instrucciones del proyecto'];
export const DOC_ITEMS: ClassifyItem[] = [
  {code: 'Un turno se puede cancelar hasta 2 horas antes de su horario.', column: 0, why: 'Una regla de negocio de una funcionalidad.', hint: '¿Dice qué tiene que hacer la aplicación, cómo lo encuentra el test o cómo se trabaja en la suite?'},
  {code: 'La suite se corre con npx playwright test y los locators van en pages/.', column: 2, why: 'Una convención de la suite que el agente necesita en cada sesión: va en el CLAUDE.md.', hint: '¿Es sobre la aplicación o sobre cómo se trabaja en la suite?'},
  {code: 'El botón «Cancelar turno» se encuentra por su rol y su nombre, dentro de la fila.', column: 1, why: 'Cómo encuentra el test un elemento: eso es un locator.', hint: '¿Lo necesita el usuario o el test?'},
  {code: 'Al confirmar la cancelación, el turno se muestra como «Libre».', column: 0, why: 'El resultado esperado de un flujo.', hint: '¿Dice qué tiene que pasar o cómo se prueba?'},
  {code: 'Si el horario está ocupado, se muestra «Ese horario ya está reservado».', column: 0, why: 'Un flujo de error, con su resultado.', hint: '¿Dice qué tiene que pasar o cómo se prueba?'},
  {code: 'AgendaPage busca la fila de un turno por su hora.', column: 1, why: 'Cómo el Page Object encuentra un elemento.', hint: '¿Es una regla del negocio o un detalle del test?'},
  {code: 'No usar waitForTimeout en ningún test. (Causó la mitad de los tests inestables.)', column: 2, why: 'Una regla de la suite, con su motivo: va en el CLAUDE.md.', hint: '¿Es sobre la aplicación o sobre cómo se escriben los tests?'},
];

export const START_START = 'first';
export const START_NODES: Record<string, DecisionNode> = {
  first: {
    id: 'first',
    situation: 'La agenda no tiene ningún documento, y el equipo quiere sumar un agente que explore la reserva, la cancelación y la reprogramación de turnos. ¿Por dónde empezás?',
    options: [
      {text: 'Escribir los casos de uso de toda la aplicación antes de usar ningún agente.', correct: false, why: 'Se arma por partes: con los flujos críticos alcanza para empezar, y el resto se suma después.'},
      {text: 'Los casos de uso de esos tres flujos, con sus reglas y su cobertura.', correct: true, why: 'Es lo mínimo para que el agente sepa qué tiene que pasar en cada flujo y qué ya está probado.', next: 'draft'},
      {text: 'Dejar que el agente explore sin documentos y escribir lo que encuentre.', correct: false, why: 'Sin reglas, el agente toma como correcto lo que muestra la aplicación.'},
    ],
  },
  draft: {
    id: 'draft',
    situation: 'Un agente escribió el borrador de UC-07 recorriendo la agenda. Dice: «RN-1. Un turno se puede cancelar hasta 1 hora antes». ¿Qué hacés con esa regla?',
    options: [
      {text: 'Aceptarla, porque el agente la comprobó en la aplicación.', correct: false, why: 'Comprobó lo que hace la aplicación, no lo que tiene que hacer: si la regla es 2 horas, hay un defecto.'},
      {text: 'Borrarla y dejar el caso de uso sin reglas hasta tener tiempo.', correct: false, why: 'Sin la regla, nadie puede decidir si la cancelación está bien.'},
      {text: 'Confirmarla con los criterios de aceptación o con quien define el producto.', correct: true, why: 'Las reglas salen de quien las conoce; el borrador sigue marcado hasta confirmarlas.', next: 'trace'},
    ],
  },
  trace: {
    id: 'trace',
    situation: 'La suite ya tiene 12 tests de la agenda, sin ninguna relación con los casos de uso nuevos. ¿Cómo hacés que la cobertura sea confiable?',
    options: [
      {text: 'Agregar el tag del caso de uso a cada test y completar las tablas de cobertura.', correct: true, why: 'El tag une cada test con su caso de uso, y se puede buscar y correr con --grep.'},
      {text: 'Llevar en una planilla aparte qué test cubre cada flujo.', correct: false, why: 'Una planilla a mano se desactualiza con el primer test nuevo, y el agente no la consulta.'},
      {text: 'Que el agente lea todos los tests cada vez y deduzca qué cubren.', correct: false, why: 'Cuesta más en cada corrida y es una deducción, no un dato.'},
    ],
  },
};
export const START_EXPLANATION =
  'Se empieza por los casos de uso de los flujos críticos, las reglas se confirman con quien define el producto, y los tags unen la suite con los documentos.';
