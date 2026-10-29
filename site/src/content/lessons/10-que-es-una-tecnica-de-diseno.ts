import type {CodeLine} from '@site/src/components/FindInCode';
import type {DecisionNode} from '@site/src/components/DecisionPath';
import type {MultiSelectQuestion} from '@site/src/components/MultiSelect';

export const CATEGORY_RULE_LABELS = ['Basada en experiencia (conocimiento/intuición de quien testea)', 'White-box (estructura interna del código)'];

export const CATEGORY_LINES: CodeLine[] = [
  {
    code: 'Revisar en el reporte qué ramas del `if` de validación nunca se ejecutaron al correr la suite.',
    rule: 2,
    why: 'Para saber qué ramas no se ejecutaron hay que mirar la estructura del código y la instrumentación de la suite. El comportamiento visible no alcanza.',
    hint: '¿Ese dato sale de lo que el usuario ve o de lo que pasó dentro del código?',
  },
  {
    code: 'Probar el campo "edad" con 17, 18 y 19, porque la especificación dice que el registro requiere ser mayor de edad.',
    rule: 0,
    why: 'Los valores 17, 18 y 19 salen de la regla escrita, con 18 como límite, no de leer el código. Es boundary value analysis black-box.',
    hint: '¿Estos valores salen de leer el código, o de la especificación?',
  },
  {
    code: 'Un tester con años en el sistema prueba primero el botón "Cancelar" porque "siempre es el que rompe".',
    rule: 1,
    why: 'La decisión de empezar por ese botón no sale de la especificación ni del código: sale de la experiencia de quien ya vio fallar ese botón antes.',
    hint: '¿De dónde sale la idea de empezar justo por ese botón?',
  },
  {
    code: 'Armar una tabla con las combinaciones de "envío express" y "pago contrareembolso" que permite la especificación.',
    rule: 0,
    why: 'Las combinaciones están definidas en la especificación. No hace falta ver cómo está implementado el cálculo para armarlas.',
    hint: '¿Hace falta ver cómo está implementado para armar esta tabla?',
  },
  {
    code: 'Medir qué porcentaje de las funciones del módulo de pagos fue llamado por los tests, según el informe de instrumentación.',
    rule: 2,
    why: 'El porcentaje de funciones llamadas es una medida de la estructura interna: necesita instrumentación del código, no solo probar la pantalla.',
    hint: '¿Ese número mide lo que se ve desde afuera o lo que se ejecutó por dentro?',
  },
  {
    code: 'Explorar la pantalla de devoluciones sin un guion fijo, siguiendo lo que llama la atención mientras se usa.',
    rule: 1,
    why: 'No hay un procedimiento definido antes: las acciones se eligen sobre la marcha, según lo que aparece. Eso es testing exploratorio, basado en experiencia.',
    hint: '¿Hay un procedimiento decidido antes de empezar, o se arma mientras se usa?',
  },
  {
    code: 'Derivar los casos de una historia de usuario: para "descuento del 10% con más de 3 ítems", probar 3 y 4 ítems.',
    rule: 0,
    why: 'Los valores salen del texto de la historia, que es especificación. No se mira cómo está programado el descuento.',
    hint: '¿Estos valores salen del texto de la historia, o de mirar el código?',
  },
];

export const CHOICE_START = 'contacto';
export const CHOICE_NODES: Record<string, DecisionNode> = {
  contacto: {
    id: 'contacto',
    situation: 'Te toca el formulario de contacto. La especificación es clara: el mensaje es obligatorio y admite hasta 500 caracteres. No tenés acceso al código. ¿Por dónde empezás?',
    options: [
      {
        text: 'Con una técnica white-box, midiendo qué ramas de la validación se ejecutan.',
        correct: false,
        why: 'White-box necesita ver el código fuente, y no lo tenés. Además, la especificación ya da todo lo necesario para diseñar casos desde afuera.',
      },
      {
        text: 'Con una técnica black-box, derivando los casos de la regla de los 500 caracteres.',
        correct: true,
        why: 'Hay una especificación clara: es el punto de partida natural para black-box.',
        next: 'pagos',
      },
      {
        text: 'Con una sesión exploratoria: es un formulario simple y no hace falta más.',
        correct: false,
        why: 'Teniendo una regla documentada, empezar sin usarla desaprovecha lo que el caso tiene para ofrecer. La exploración puede sumarse después.',
      },
    ],
  },
  pagos: {
    id: 'pagos',
    situation: 'Ahora, un sistema que procesa pagos internacionales. Hay especificación para las reglas principales, pero varias combinaciones de monedas no están documentadas. ¿Cómo lo cubrís?',
    options: [
      {
        text: 'Casos formales black-box para lo especificado, más sesiones exploratorias para las combinaciones sin documentar.',
        correct: true,
        why: 'Se combinan categorías: cobertura formal donde hay especificación, y experiencia donde hay zonas grises.',
        next: 'turnos',
      },
      {
        text: 'Que lo cubra el tester senior con su intuición: conoce el sistema mejor que nadie.',
        correct: false,
        why: 'En un sistema crítico, depender solo de la experiencia deja sin cubrir los puntos ciegos de esa persona, y ahí los errores salen caros.',
      },
      {
        text: 'Solo los casos formales de la especificación: lo que no está documentado no se prueba.',
        correct: false,
        why: 'Justamente donde no hay documentación es donde la experiencia aporta: quedarse solo con black-box deja esas combinaciones sin mirar.',
      },
    ],
  },
  turnos: {
    id: 'turnos',
    situation: 'El módulo de turnos se probaba bien con particiones de equivalencia. En este release, una reserva pasa a comportarse distinto según su estado: pendiente, confirmada o cancelada. ¿Qué hacés con los casos?',
    options: [
      {
        text: 'Seguir con las mismas particiones: siempre funcionaron para este módulo.',
        correct: false,
        why: 'Usar siempre la misma técnica por costumbre deja afuera los defectos que esa técnica no está pensada para atrapar, como los que dependen del estado.',
      },
      {
        text: 'Reemplazar los casos por sesiones exploratorias, porque el módulo se volvió más complejo.',
        correct: false,
        why: 'La complejidad nueva sigue estando especificada (los tres estados), así que corresponde una técnica formal que la cubra, no abandonar la cobertura formal.',
      },
      {
        text: 'Revisar la técnica: ahora el comportamiento depende del estado, así que hace falta una técnica pensada para estados.',
        correct: true,
        why: 'Cuando el sistema cambia, la técnica elegida se revisa: lo que alcanzaba con un campo simple deja de alcanzar cuando aparecen estados.',
      },
    ],
  },
};
export const CHOICE_EXPLANATION =
  'La técnica se elige según lo que tiene cada caso: especificación clara → black-box; zonas sin documentar → sumar experiencia; código disponible → white-box del lado de desarrollo. Y la elección se revisa cuando el sistema cambia.';

export const MANUAL_QUESTIONS: MultiSelectQuestion[] = [
  {
    prompt: '¿Cuáles de estas tareas puede hacer un QA manual sin acceso al código fuente? Marcá todas las que correspondan.',
    options: [
      {text: 'Probar el cupo de una reserva con 0, 1, 8 y 9 personas, según la regla de la especificación.', correct: true, why: 'Es black-box: los valores salen de la especificación, sin mirar el código.'},
      {text: 'Medir qué porcentaje de las ramas del `if` de validación se ejecutaron al correr la suite.', correct: false, why: 'Es white-box: necesita ver la estructura interna del código.'},
      {text: 'Recorrer una checklist de accesibilidad en cada pantalla nueva.', correct: true, why: 'Es basada en experiencia: la lista guía qué revisar desde afuera del sistema.'},
      {text: 'Explorar sin guion la pantalla de favoritos durante 40 minutos, anotando lo que encuentra.', correct: true, why: 'Es testing exploratorio, basado en experiencia: no requiere el código.'},
      {text: 'Revisar qué funciones del módulo de pagos nunca fueron llamadas por los tests.', correct: false, why: 'Es white-box: para saber qué funciones se llamaron hay que instrumentar y leer el código.'},
      {text: 'Armar casos para las combinaciones de tipo de cuenta y país que define la especificación.', correct: true, why: 'Es black-box: las combinaciones salen de la especificación.'},
    ],
  },
];
