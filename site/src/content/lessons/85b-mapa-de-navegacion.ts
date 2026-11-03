import type {QuizQuestion} from '@site/src/components/Quiz';
import type {FillBlankSlot} from '@site/src/components/FillBlank';
import type {DecisionNode} from '@site/src/components/DecisionPath';

export const READ_QUIZ: QuizQuestion[] = [
  {
    question: 'Según el diagrama de la agenda, ¿qué camino sigue el agente para llegar a la ficha de un paciente?',
    options: [
      {text: 'Ingreso → Ficha del paciente, porque la ficha tiene su propia dirección.', correct: false, why: 'En el diagrama no hay ninguna flecha de Ingreso a la ficha: el camino se sigue por las flechas.'},
      {text: 'Ingreso → Agenda del día → Lista de pacientes → Ficha del paciente.', correct: true, why: 'Es la secuencia de flechas desde el inicio hasta el nodo buscado.'},
      {text: 'Ingreso → Agenda del día → Diálogo de reprogramar → Ficha del paciente.', correct: false, why: 'Del diálogo de reprogramar no sale ninguna flecha hacia la ficha.'},
    ],
  },
  {
    question: 'Antes de recorrer la flecha de la agenda al diálogo de reprogramar, ¿qué campo de la transición le dice al agente qué tiene que preparar?',
    options: [
      {text: '`requiere`: un turno Reservado a futuro, que crea con la herramienta de datos.', correct: true, why: 'Sin ese turno, el botón «Reprogramar» no existe y la flecha no se puede recorrer.'},
      {text: '`accion`: el click en el botón, que crea el turno si no existe.', correct: false, why: 'La acción es el click; el turno tiene que existir antes.'},
      {text: '`verificada`: la fecha indica qué datos estaban cargados ese día.', correct: false, why: 'Indica cuándo se comprobó la flecha, no qué datos hacen falta.'},
    ],
  },
  {
    question: 'El agente hizo click en «Reprogramar». ¿Cómo sabe que llegó al diálogo correcto?',
    options: [
      {text: 'Porque el click no dio error.', correct: false, why: 'Un click puede funcionar y llevar a otra pantalla.'},
      {text: 'Porque la dirección del navegador cambió a /reprogramar.', correct: false, why: 'El diálogo no tiene dirección propia: en el mapa no tiene `ruta`.'},
      {text: 'Porque encuentra la señal de la pantalla, dialog "Reprogramar turno".', correct: true, why: 'La señal es el elemento, con su rol y su nombre, que confirma la llegada.'},
    ],
  },
];

export const EDGE_TEMPLATE = `transiciones:
  - {{a}}: pacientes
    {{b}}: ficha
    accion: escribir el DNI en searchbox "Buscar" y click en link "Ver"
    {{c}}: un paciente cargado
    verificada: 2026-10-21

pantallas:
  ficha:
    nombre: Ficha del paciente
    ruta: /pacientes/{id}
    {{d}}: heading con el nombre del paciente`;
export const EDGE_SLOTS: FillBlankSlot[] = [
  {id: 'a', answer: 'desde'},
  {id: 'b', answer: 'hacia'},
  {id: 'c', answer: 'requiere'},
  {id: 'd', answer: 'señal'},
];
export const EDGE_BANK = ['desde', 'hacia', 'requiere', 'señal', 'rol', 'inicio'];
export const EDGE_EXPLANATION =
  'La transición va desde la lista de pacientes hacia la ficha, requiere un paciente cargado, y la ficha se reconoce por su señal: el título con el nombre del paciente.';

export const ARRIVE_START = 'renamed';
export const ARRIVE_NODES: Record<string, DecisionNode> = {
  renamed: {
    id: 'renamed',
    situation: 'El agente hace click en «Reprogramar» y aparece un diálogo con los mismos campos de siempre, pero titulado «Cambiar horario». La señal del mapa es dialog "Reprogramar turno". El diseño nuevo está aprobado. ¿Qué hace?',
    options: [
      {text: 'Propone actualizar la señal del mapa, para que una persona lo revise.', correct: true, why: 'Es la pantalla correcta con otro nombre: el mapa quedó desactualizado.', next: 'other'},
      {text: 'Reporta un defecto, porque el título no coincide con el del mapa.', correct: false, why: 'El cambio está aprobado: el que quedó viejo es el mapa.'},
      {text: 'Borra la pantalla del mapa, porque su señal ya no se encuentra.', correct: false, why: 'La pantalla existe; solo cambió su título.'},
    ],
  },
  other: {
    id: 'other',
    situation: 'Otro día, el click en «Reprogramar» lleva a la ficha del paciente. ¿Qué hace el agente?',
    options: [
      {text: 'Cambia la transición del mapa para que diga que «Reprogramar» lleva a la ficha.', correct: false, why: 'Corregir el mapa a lo que hace la aplicación escondería un posible defecto.'},
      {text: 'No corrige el mapa: avisa que el camino está roto o que la aplicación tiene un defecto.', correct: true, why: 'Llegar a otra pantalla no es un mapa viejo: lo tiene que mirar una persona.', next: 'new'},
      {text: 'Prueba otros botones hasta encontrar el diálogo, y sigue explorando.', correct: false, why: 'Vuelve a la búsqueda a ciegas que el mapa evita, y deja el problema sin reportar.'},
    ],
  },
  new: {
    id: 'new',
    situation: 'Desde la agenda, el agente encuentra un botón nuevo, «Lista de espera», que abre una pantalla que el mapa no tiene. ¿Qué hace?',
    options: [
      {text: 'La ignora, porque no está en el mapa.', correct: false, why: 'Una pantalla nueva es justo lo que el mapa tiene que incorporar.'},
      {text: 'La agrega al mapa como confirmada, con su señal y su transición.', correct: false, why: 'Lo que registra un agente es lo que vio: lo confirma una persona.'},
      {text: 'La agrega al mapa marcada como «a confirmar», con su señal y su transición.', correct: true, why: 'Queda registrada, y una persona la revisa antes de confirmarla.'},
    ],
  },
};
export const ARRIVE_EXPLANATION =
  'Pantalla correcta con otro nombre: se propone actualizar el mapa. Otra pantalla: se avisa, sin corregir. Pantalla nueva: se agrega a confirmar.';
