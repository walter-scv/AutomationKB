import type {FillBlankSlot} from '@site/src/components/FillBlank';
import type {ClassifyItem} from '@site/src/components/Classify';
import type {QuizQuestion} from '@site/src/components/Quiz';

export const AGENT_TEMPLATE = `---
{{a}}: revisor-datos
{{b}}: Revisa que los tests de la agenda no compartan datos ni los creen por la interfaz. Usalo después de crear o modificar un test.
{{c}}: Read, Grep, Glob
model: {{d}}
---

Sos el revisor de datos de prueba de la suite de turnos.
No edites nada.

Respondé solo con este formato:
VEREDICTO: {{e}}
PROBLEMAS:
- <línea> · <regla> · <corrección>`;
export const AGENT_SLOTS: FillBlankSlot[] = [
  {id: 'a', answer: 'name'},
  {id: 'b', answer: 'description'},
  {id: 'c', answer: 'tools'},
  {id: 'd', answer: 'sonnet'},
  {id: 'e', answer: 'APROBADO | RECHAZADO'},
];
export const AGENT_BANK = ['name', 'description', 'tools', 'allowed-tools', 'sonnet', 'APROBADO | RECHAZADO', 'lo que te parezca', 'title'];
export const AGENT_EXPLANATION =
  '`name` y `description` son obligatorios; `tools` limita al revisor a leer y buscar; `model` elige un modelo que razone bien; y la salida tiene un veredicto fijo que otro agente puede leer.';

export const KIND_COLUMNS = ['Comando', 'Skill', 'Subagente'];
export const KIND_ITEMS: ClassifyItem[] = [
  {code: 'Un pedido de un solo archivo para resumir la corrida nocturna, que invocás vos cada mañana.', column: 0, why: 'Es un pedido repetido y simple, sin archivos de apoyo: alcanza un comando.', hint: '¿Necesita archivos de apoyo o un contexto propio?'},
  {code: 'Una revisión independiente de los tests nuevos, hecha sin ver cómo se escribieron.', column: 2, why: 'La independencia requiere un contexto propio: un subagente.', hint: '¿Tiene que ver la conversación donde se escribieron?'},
  {code: 'El procedimiento para reportar defectos, con la plantilla y ejemplos de reportes bien hechos, que el agente usa cuando confirmás un defecto.', column: 1, why: 'Instrucciones con archivos de apoyo, que el agente carga cuando la tarea coincide.', hint: '¿Lleva archivos de apoyo y conviene que el agente la use cuando corresponde?'},
  {code: 'Buscar en 60 archivos de tests cuáles usan waitForTimeout, sin llenar la conversación principal.', column: 2, why: 'Lee mucho y solo importa la conclusión: el trabajo queda en el contexto del subagente.', hint: '¿Qué pasa con el contexto principal si lo hace el agente principal?'},
  {code: 'Las reglas para escribir Page Objects, con un ejemplo de referencia, que el agente aplica mientras escribe.', column: 1, why: 'Se aplican en el mismo contexto donde se escribe el código: una skill con archivos de apoyo.', hint: '¿Hace falta otro agente o instrucciones en el mismo trabajo?'},
  {code: 'Un atajo para correr la suite smoke y mostrar el resumen.', column: 0, why: 'Un pedido corto que se repite: un comando.', hint: '¿Qué tan complejo es el pedido?'},
];

export const AGENT_QUIZ: QuizQuestion[] = [
  {
    question: 'El agente principal lleva una hora hablando con vos sobre la regla de máximo 3 turnos y le pide al subagente revisor-datos que revise el test nuevo. El revisor aprueba el test aunque no verifica el límite de 3 turnos. ¿Qué pasó?',
    options: [
      {text: 'El revisor no vio la conversación: la regla tenía que estar en el pedido o en los archivos que lee.', correct: true, why: 'Un subagente arranca sin la conversación principal: sabe lo que le dicen en el pedido, lo que lee y las instrucciones del proyecto. La regla tenía que estar en el pedido, en el CLAUDE.md o en una regla.'},
      {text: 'El revisor ignoró la regla a propósito, porque prioriza que el código compile.', correct: false, why: 'Nunca la tuvo: no estaba en su contexto.'},
      {text: 'El modelo del revisor es demasiado chico para entender reglas que no son de código.', correct: false, why: 'El problema no es el modelo, sino la información que recibió.'},
    ],
  },
  {
    question: 'El subagente revisor-pom no tiene el campo tools. Al revisar, encontró un locator mal escrito y lo corrigió él mismo en AgendaPage.ts. ¿Qué corresponde?',
    options: [
      {text: 'Nada: está bien que arregle lo que encuentra.', correct: false, why: 'Un revisor que corrige deja ese cambio sin revisar.'},
      {text: 'Agregarle tools: Read, Grep, Glob para que solo pueda leer y buscar.', correct: true, why: 'Sin `tools`, heredó todas las herramientas del principal, incluida la edición.'},
      {text: 'Escribir en sus instrucciones «por favor, no edites».', correct: false, why: 'Ayuda, pero no lo impide: limitar las herramientas sí.'},
    ],
  },
];
