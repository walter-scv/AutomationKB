import type {OrderItem, OrderRule} from '@site/src/components/Order';
import type {FillBlankSlot} from '@site/src/components/FillBlank';
import type {DecisionNode} from '@site/src/components/DecisionPath';

export const HEAL_ITEMS: OrderItem[] = [
  {id: 'rerun', what: 'Paso', code: 'El agente corre solo los tests que fallaron, con --grep.'},
  {id: 'fail', what: 'Paso', code: 'La suite del Pull Request falla en CI.'},
  {id: 'push', what: 'Paso', code: 'La corrección queda como commit en la rama, para revisar.'},
  {id: 'diag', what: 'Paso', code: 'El diagnóstico responde «sí»: los fallos los causó el cambio del Pull Request.'},
  {id: 'collect', what: 'Paso', code: 'Se juntan los tests que fallaron y sus errores.'},
  {id: 'fix', what: 'Paso', code: 'El agente abre los componentes del contrato y corrige locators.ts.'},
];
export const HEAL_CORRECT = ['fail', 'collect', 'diag', 'fix', 'rerun', 'push'];
export const HEAL_RULES: OrderRule[] = [
  {before: 'fail', after: 'collect', why: 'Sin una suite fallida no hay nada que juntar.'},
  {before: 'collect', after: 'diag', why: 'El diagnóstico trabaja sobre los errores juntados.'},
  {before: 'diag', after: 'fix', why: 'El agente solo actúa si el diagnóstico dice que el Pull Request causó los fallos.'},
  {before: 'fix', after: 'rerun', why: 'Se verifica la corrección corriendo los tests afectados.'},
  {before: 'rerun', after: 'push', why: 'Solo se sube una corrección verificada.'},
];

export const WF_TEMPLATE = `on:
  {{a}}:
    workflows: ["E2E agenda"]
    types: [completed]
    {{b}}:
      - 'auto-heal/**'

jobs:
  auto-heal:
    if: github.event.workflow_run.conclusion == '{{c}}'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      # ... diagnóstico y agente ...`;
export const WF_SLOTS: FillBlankSlot[] = [
  {id: 'a', answer: 'workflow_run'},
  {id: 'b', answer: 'branches-ignore'},
  {id: 'c', answer: 'failure'},
];
export const WF_BANK = ['push', 'workflow_run', 'branches', 'branches-ignore', 'failure', 'success', 'schedule'];
export const WF_EXPLANATION =
  '`workflow_run` dispara el auto-heal cuando termina la suite; `branches-ignore` evita repararse a sí mismo en las ramas `auto-heal/`; y la condición `failure` hace que solo actúe si la suite falló.';

export const DIAG_START = 'yes';
export const DIAG_NODES: Record<string, DecisionNode> = {
  yes: {
    id: 'yes',
    situation: 'El Pull Request de la agenda cambió «Cancelar» por «Cancelar turno» en FilaTurno.tsx. Fallan 3 tests de cancelación y el diagnóstico responde «Sí». ¿Qué hace el auto-heal?',
    options: [
      {text: 'No hace nada, porque cualquier cambio de texto en la aplicación hay que revisarlo a mano antes de tocar un test.', correct: false, why: 'El diagnóstico ya respondió que el Pull Request lo causó: el auto-heal está para eso, y la corrección igual se revisa.'},
      {text: 'Dispara el agente, que corrige botonCancelar en locators.ts y corre los 3 tests.', correct: true, why: 'Es el caso para el que existe: un cambio legítimo dejó desactualizado un locator.', next: 'no'},
      {text: 'Dispara el agente sobre toda la suite, por si hay más locators desactualizados.', correct: false, why: 'Se verifica solo lo que falló: correr todo es más lento y no aporta a esta corrección.'},
    ],
  },
  no: {
    id: 'no',
    situation: 'Otro Pull Request solo cambió un cálculo en el servidor. Falla el test del vencimiento: esperaba 24/11 y la agenda muestra 25/11. El diagnóstico responde «No». ¿Qué hace el auto-heal?',
    options: [
      {text: 'No interviene: el fallo tiene otra causa y lo mira una persona.', correct: true, why: '«No» es una salida válida del diagnóstico: el auto-heal solo repara locators desactualizados.', next: 'many'},
      {text: 'Dispara el agente igual, para que ajuste el valor esperado a 25/11.', correct: false, why: 'Cambiar el valor esperado escondería un posible defecto: el auto-heal no toca assertions.'},
      {text: 'Vuelve a correr el test hasta que pase.', correct: false, why: 'Un valor distinto no es inestabilidad: correrlo de nuevo no cambia nada.'},
    ],
  },
  many: {
    id: 'many',
    situation: 'Fallan 46 de los 50 tests de la suite, todos en el ingreso. El diagnóstico igual responde «Sí», porque el Pull Request tocó la pantalla de ingreso. ¿Qué corresponde?',
    options: [
      {text: 'Disparar el agente, porque el diagnóstico respondió «Sí» y hay muchos locators para revisar.', correct: false, why: 'Con casi todo roto en el mismo punto, lo probable es un problema general, no 46 locators: el tope frena aunque el diagnóstico diga «Sí».'},
      {text: 'Frenar: superar el tope de fallos indica un problema general, como el entorno o el ingreso.', correct: true, why: 'El gate de «demasiados fallos» protege de reparar lo que no es un locator.', next: 'prompt'},
      {text: 'Disparar el agente solo sobre los primeros 10 fallos, y dejar el resto para después.', correct: false, why: 'El problema no es la cantidad de trabajo: es que probablemente no sean locators.'},
    ],
  },
  prompt: {
    id: 'prompt',
    situation: 'El agente del auto-heal corre en una plataforma externa. Agregaste al archivo del pedido, en el repositorio, «nunca modifiques playwright.config.ts», y en la corrida siguiente el agente lo modificó igual. ¿Qué revisás primero?',
    options: [
      {text: 'Si la plataforma corre una copia del pedido guardada en su interfaz.', correct: true, why: 'Es la causa más común de «arreglé el prompt y no cambió nada»: lo que corre no es el archivo editado.'},
      {text: 'Si la regla está escrita con suficiente énfasis, y repetirla en mayúsculas.', correct: false, why: 'Antes de reforzar la regla hay que confirmar que el agente la recibe.'},
      {text: 'Si el modelo es demasiado chico, y pasar a uno más grande para el auto-heal.', correct: false, why: 'Ningún modelo cumple una regla que no está en el pedido que recibe.'},
    ],
  },
};
export const DIAG_EXPLANATION =
  'El auto-heal actúa cuando el diagnóstico dice «Sí» y hay pocos fallos; con «Posiblemente», «No» o demasiados fallos, lo mira una persona. Y si un cambio en el pedido no tiene efecto, primero se confirma qué pedido recibe el agente.';
