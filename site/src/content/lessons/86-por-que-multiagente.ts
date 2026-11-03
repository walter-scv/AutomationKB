import type {DecisionNode} from '@site/src/components/DecisionPath';
import type {ClassifyItem} from '@site/src/components/Classify';
import type {MultiSelectQuestion} from '@site/src/components/MultiSelect';

export const SIZE_COLUMNS = ['Un pedido a un agente', 'Una skill', 'Un sistema multiagente'];
export const SIZE_ITEMS: ClassifyItem[] = [
  {code: 'Corregir el locator del botón Reservar después de un rediseño aprobado.', column: 0, why: 'Un cambio chico y puntual: un pedido bien escrito alcanza.', hint: '¿Cuántas fases tiene la tarea?'},
  {code: 'Automatizar los 12 casos de uso de la pantalla de pacientes, con Page Objects, revisión y documentación.', column: 2, why: 'Muchas fases que se benefician de roles distintos y de una revisión independiente.', hint: '¿Hay fases distintas que convenga separar?'},
  {code: 'Aplicar las reglas de Page Objects de la suite cada vez que el agente escribe uno.', column: 1, why: 'Instrucciones con reglas propias que el agente aplica mientras escribe.', hint: '¿Es una tarea de varias fases o reglas para el trabajo en curso?'},
  {code: 'Explicar por qué falló anoche el test de cancelar, a partir del error-context.md.', column: 0, why: 'Un pedido con buen contexto: no necesita fases ni roles.', hint: '¿Necesita varios agentes?'},
  {code: 'Cada semana, tomar las historias nuevas de turnos, explorar, planificar, escribir, revisar, correr y documentar los tests.', column: 2, why: 'Proceso completo que se repite: vale la pena armarlo con roles.', hint: '¿Se repite y tiene varias fases?'},
  {code: 'Reportar en Jira un defecto confirmado, con el formato del equipo.', column: 1, why: 'Una tarea con formato propio que se repite: una skill.', hint: '¿Hace falta más de un rol?'},
];

export const SPLIT_START = 'one';
export const SPLIT_NODES: Record<string, DecisionNode> = {
  one: {
    id: 'one',
    situation: 'Un solo agente automatizó los casos de la agenda en una conversación de dos horas, y al final aprobó su propio código. En el Pull Request aparecen tests que no verifican lo que prometen. ¿Qué cambiás primero?',
    options: [
      {text: 'Usar un modelo más grande.', correct: false, why: 'El problema es la falta de independencia, no el tamaño del modelo.'},
      {text: 'Pedirle al mismo agente que revise todo de nuevo, con más cuidado.', correct: false, why: 'Revisa con el mismo contexto y los mismos supuestos con los que escribió.'},
      {text: 'Separar la revisión en un agente que no vio cómo se escribió el código.', correct: true, why: 'Quien escribió el código tiende a aprobarlo con sus mismos supuestos.', next: 'pass'},
    ],
  },
  pass: {
    id: 'pass',
    situation: 'El explorador le pasa al constructor el snapshot completo de cada pantalla, miles de líneas. El constructor tarda y mezcla elementos de pantallas distintas. ¿Qué cambiás?',
    options: [
      {text: 'Que el explorador devuelva solo los locators verificados que necesitan los escenarios.', correct: true, why: 'Un resultado condensado le da al constructor lo que necesita, sin llenarle el contexto.', next: 'cost'},
      {text: 'Sumar también las capturas de cada pantalla, para que el constructor compare.', correct: false, why: 'Más contexto no es mejor: el problema es el exceso.'},
      {text: 'Que el constructor recorra las pantallas por su cuenta, sin el explorador.', correct: false, why: 'Vuelve a mezclar exploración y construcción en el mismo contexto.'},
    ],
  },
  cost: {
    id: 'cost',
    situation: 'Para ir más rápido, el orquestador lanza 8 agentes en paralelo, uno por caso de uso. En media hora se agota el uso disponible del día. ¿Qué hacés?',
    options: [
      {text: 'Relanzarlos al día siguiente con la misma configuración, cuando se renueve el uso.', correct: false, why: 'Va a volver a consumir lo mismo: el diseño no cambió.'},
      {text: 'Medir el consumo, limitar cuántos corren a la vez y elegir el modelo por rol.', correct: true, why: 'El consumo es parte del diseño: se mide y se ajusta.'},
      {text: 'Subir el plan de uso, para que los 8 agentes puedan correr juntos todos los días.', correct: false, why: 'Puede hacer falta, pero primero hay que ver si el consumo está justificado.'},
    ],
  },
};
export const SPLIT_EXPLANATION =
  'La revisión con contexto propio, resultados condensados entre agentes, y un consumo medido: lo que hace que un sistema multiagente valga lo que cuesta.';

export const ORCH_QUESTIONS: MultiSelectQuestion[] = [
  {
    prompt: 'Sobre el orquestador de un sistema que automatiza los casos de la agenda, ¿qué afirmaciones son correctas? Marcá todas las que correspondan.',
    options: [
      {text: 'Decide qué agente trabaja, le pasa lo que necesita y lee lo que devuelve.', correct: true, why: 'Es su rol: coordinar.'},
      {text: 'Conviene que escriba él mismo los tests, para ahorrar un agente.', correct: false, why: 'Mezcla coordinación y trabajo, y pierde la separación de roles.'},
      {text: 'Lleva el estado: en qué fase está, cuántos intentos van, qué quedó aprobado.', correct: true, why: 'Sin estado, no puede decidir el paso siguiente.'},
      {text: 'Una lista de tareas con una entrada por paso, cada una dependiendo de la anterior, evita que se saltee una fase.', correct: true, why: 'Se ve qué falta y en qué orden.'},
      {text: 'Normalmente es un agente aparte, distinto del agente principal de la sesión.', correct: false, why: 'Normalmente es el agente principal, guiado por una skill o un comando que describe el proceso.'},
    ],
  },
];
