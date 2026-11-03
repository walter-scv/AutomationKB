import type {DecisionNode} from '@site/src/components/DecisionPath';
import type {CodeLine} from '@site/src/components/FindInCode';
import type {MultiSelectQuestion} from '@site/src/components/MultiSelect';

export const GATE_START = 'plan';
export const GATE_NODES: Record<string, DecisionNode> = {
  plan: {
    id: 'plan',
    situation: 'La regla de la clínica dice que un paciente puede tener como máximo 3 turnos futuros. El plan de la reserva no incluye el caso de intentar reservarle un cuarto turno, que la agenda tiene que rechazar, y el revisor de plan lo rechaza por eso. El orquestador tiene apuro. ¿Qué corresponde?',
    options: [
      {text: 'Que el constructor arranque con los casos aprobados mientras se agrega el que falta.', correct: false, why: 'El gate es bloqueante: lo que se construya sobre un plan incompleto hereda el problema.'},
      {text: 'Aprobar el plan y sumar el caso del cuarto turno cuando el resto esté escrito.', correct: false, why: 'Es justo el caso con más riesgo: el valor límite de la regla.'},
      {text: 'Devolver el plan al planificador con el motivo, y esperar un plan aprobado.', correct: true, why: 'Un plan rechazado vuelve con los motivos; el constructor espera un plan aprobado.', next: 'review'},
    ],
  },
  review: {
    id: 'review',
    situation: 'De los tres revisores, dos aprueban y el de datos rechaza: un test de cancelación usa un turno compartido con otros tests. ¿Qué hace el orquestador?',
    options: [
      {text: 'Volver al constructor con el motivo del revisor de datos y revisar otra vez.', correct: true, why: 'El constructor corrige esa causa y el código vuelve a revisarse.', next: 'loop'},
      {text: 'Avanzar, porque dos de los tres revisores aprobaron el código.', correct: false, why: 'Se avanza solo si todos aprueban: cada revisor mira una cosa distinta.'},
      {text: 'Repetir la revisión de datos con otro modelo, a ver si esta vez aprueba.', correct: false, why: 'Correr de nuevo esperando otro veredicto no corrige la causa.'},
    ],
  },
  loop: {
    id: 'loop',
    situation: 'El revisor de Page Objects rechazó tres veces el locator de la fila del turno, y el constructor alterna entre dos versiones que el revisor rechaza. El tope es tres. ¿Qué pasa ahora?',
    options: [
      {text: 'Se sube el tope a diez intentos, porque el constructor está cerca.', correct: false, why: 'Alternar entre dos versiones rechazadas no es acercarse: falta un criterio que tiene que dar una persona.'},
      {text: 'Se detiene y escala a una persona, con los intentos y las opciones.', correct: true, why: 'Superado el tope, seguir intentando solo consume uso.'},
      {text: 'Se le pide al revisor que sea menos estricto con este locator.', correct: false, why: 'Bajar la exigencia del revisor para que apruebe es lo que los gates evitan.'},
    ],
  },
};
export const GATE_EXPLANATION =
  'El gate del plan bloquea, todos los revisores tienen que aprobar, y superado el tope se escala con un informe en lugar de insistir.';

export const LOG_RULE_LABELS = [
  'Validación que no es real',
  'Gate o tope que no se respetó',
  'Rol que se saltea la separación',
];
export const LOG_LINES: CodeLine[] = [
  {
    code: '[1] Búsqueda: 3 casos de uso y 2 tests existentes de turnos.',
    rule: 0,
    why: 'El orquestador revisa documentos y tests antes de planificar.',
    hint: '¿Hay algo que falte o sobre en este paso?',
  },
  {
    code: '[4] Ejecución completa: npx playwright test --list encontró los 6 tests nuevos.',
    rule: 1,
    why: '`--list` no ejecuta nada: la fase de ejecución necesita una corrida real.',
    hint: '¿Los tests corrieron?',
  },
  {
    code: '[2] Revisión del plan: RECHAZADO (falta el caso del cuarto turno, que se rechaza). Vuelve al planificador, intento 2 de 3.',
    rule: 0,
    why: 'El gate bloquea y el plan vuelve con el motivo, dentro del tope.',
    hint: '¿El sistema respetó el gate?',
  },
  {
    code: '[3] El orquestador escribió agenda.spec.ts directamente, para ahorrar un paso.',
    rule: 3,
    why: 'Solo el escritor puede escribir los tests, después de comprobar que estén todos los obligatorios del plan.',
    hint: '¿Quién tiene permitido escribir los archivos de test?',
  },
  {
    code: '[3] Revisión del código: Page Objects APROBADO, estructura APROBADO, datos APROBADO.',
    rule: 0,
    why: 'Todos los revisores aprobaron: se puede avanzar.',
    hint: '¿Aprobaron todos?',
  },
  {
    code: '[3] Revisión de Page Objects: RECHAZADO, intento 4 de 3. Se reintenta.',
    rule: 2,
    why: 'Superado el tope, el sistema tiene que escalar a una persona, no seguir.',
    hint: '¿Cuántos intentos permite el tope?',
  },
  {
    code: '[5] Cobertura de UC-07 actualizada con el test «cancelar un turno lo libera».',
    rule: 0,
    why: 'La documentación se actualiza después de una ejecución real.',
    hint: '¿Es un paso del pipeline?',
  },
];

export const BLOCK_QUESTIONS: MultiSelectQuestion[] = [
  {
    prompt: 'Una regla de estructura de la suite dice que un test no tiene lógica propia: prepara, actúa y verifica. El revisor de estructura rechaza un test de turnos porque calcula la fecha esperada con un bucle dentro del test. ¿Qué reacciones son correctas? Marcá todas las que correspondan.',
    options: [
      {text: 'Mover el cálculo a un helper o al Page Object, y volver a revisar.', correct: true, why: 'Se corrige la causa que señaló el revisor.'},
      {text: 'Volver a correr la revisión, por si esta vez aprueba.', correct: false, why: 'El código es el mismo: esperar otro veredicto no corrige nada.'},
      {text: 'Si el mismo rechazo se repite en otros tests, sumar la regla a las instrucciones del constructor.', correct: true, why: 'Una lección repetida vuelve al sistema para no repetir el error.'},
      {text: 'Quitarle esa regla al revisor, porque frena el pipeline.', correct: false, why: 'Bajar la exigencia para que apruebe es lo que los gates evitan.'},
      {text: 'Aceptar el test porque pasa al correrlo.', correct: false, why: 'Un test que pasa no prueba que respete las reglas de la suite.'},
    ],
  },
];
