import type {CodeLine} from '@site/src/components/FindInCode';
import type {QuizQuestion} from '@site/src/components/Quiz';
import type {OrderItem, OrderRule} from '@site/src/components/Order';

export const TRANSITION_RULE_LABELS = ['Transición inválida (no está permitida)'];

export const TRANSITION_LINES: CodeLine[] = [
  {
    code: 'Un pedido en estado Pagado se cancela: Pagado → Cancelado.',
    rule: 0,
    why: 'Cancelar desde Pagado sí está en el diagrama, aunque el pago ya se haya hecho. Es una de las salidas de cancelación previstas.',
    hint: '¿Esa flecha está dibujada en el diagrama de estados?',
  },
  {
    code: 'Un pedido ya Entregado se marca como Pagado: Entregado → Pagado.',
    rule: 1,
    why: 'Entregado es un estado final en el diagrama: no tiene flechas de salida. Volver a Pagado no está permitido, ni siquiera para corregir un error de cobro.',
    hint: '¿Qué flechas salen del estado Entregado en el diagrama?',
  },
  {
    code: 'Un pedido en estado Creado se cancela sin pagar: Creado → Cancelado.',
    rule: 0,
    why: 'Cancelar desde Creado es una de las dos salidas de cancelación que define el diagrama. No hay nada raro en que se permita.',
    hint: '¿El diagrama permite cancelar desde Creado?',
  },
  {
    code: 'Un pedido en estado Creado se envía directo: Creado → Enviado.',
    rule: 1,
    why: 'En el diagrama, Enviado solo se alcanza desde Pagado. Saltar ese paso deja el pedido sin el registro de pago que el flujo espera.',
    hint: '¿Cuál es el único estado desde el que se puede llegar a Enviado?',
  },
  {
    code: 'Un pedido en estado Enviado se marca como Entregado.',
    rule: 0,
    why: 'Enviado → Entregado es el último tramo del camino principal. Es una transición válida y esperada.',
    hint: '¿Esta transición forma parte del camino principal dibujado?',
  },
  {
    code: 'Un pedido en estado Pagado se envía: Pagado → Enviado.',
    rule: 0,
    why: 'Pagado → Enviado es la transición que hace avanzar el pedido hacia la entrega. Está explícitamente dibujada.',
    hint: '¿Esta flecha está explícitamente en el diagrama?',
  },
  {
    code: 'Un pedido en estado Enviado se cancela antes de entregarse: Enviado → Cancelado.',
    rule: 1,
    why: 'Aunque «cancelar antes de entregar» suene razonable, el diagrama solo permite cancelar desde Creado y desde Pagado. Desde Enviado no hay flecha hacia Cancelado.',
    hint: '¿Desde qué estados permite cancelar el diagrama?',
  },
];

export const BUILD_ORDER_ITEMS: OrderItem[] = [
  {id: 'invalid-cases', what: 'Paso', code: 'Agregar un caso que intente una flecha que no está: por ejemplo, cancelar un pedido en Enviado.'},
  {id: 'diagram', what: 'Paso', code: 'Dibujar los estados del pedido y las flechas que existen: Creado → Pagado, Pagado → Enviado, Enviado → Entregado, y las cancelaciones.'},
  {id: 'valid-cases', what: 'Paso', code: 'Escribir un caso por cada flecha del dibujo: por ejemplo, cancelar un pedido en Pagado.'},
];

export const BUILD_ORDER_CORRECT = ['diagram', 'valid-cases', 'invalid-cases'];

export const BUILD_ORDER_RULES: OrderRule[] = [
  {before: 'diagram', after: 'valid-cases', why: 'no se puede escribir el caso de cancelar en Pagado sin haber dibujado antes esa flecha.'},
  {before: 'diagram', after: 'invalid-cases', why: 'no se puede saber qué transición no existe sin haber dibujado antes el mapa completo.'},
  {before: 'valid-cases', after: 'invalid-cases', why: 'si una transición válida ya falla, el problema está en el flujo y no en el rechazo: por eso primero se prueba el camino que debería funcionar.'},
];

export const CLOSING_QUIZ: QuizQuestion[] = [
  {
    question: '¿Por qué state transition testing no alcanza con mirar solo el dato de entrada, como equivalence partitioning?',
    options: [
      {text: 'Porque los estados son más difíciles de programar que los datos de entrada.', correct: false, why: 'La dificultad de programación no define la técnica. Lo que cambia es que el comportamiento depende de la historia del sistema.'},
      {text: 'Porque el resultado depende también del estado previo del sistema, no solo del dato actual.', correct: true, why: 'La misma acción, como cancelar, puede ser válida o inválida según el estado en el que esté el pedido. Eso no lo captura mirar solo el dato.'},
      {text: 'Porque las técnicas de datos no admiten más de un campo por caso.', correct: false, why: 'No es una limitación de cantidad de campos. Incluso con un solo dato, el resultado puede depender del estado en que llegó el sistema.'},
    ],
  },
  {
    question: 'Un plan cubre Creado → Pagado → Enviado → Entregado, sin probar cancelaciones ni transiciones inválidas. ¿Qué le falta?',
    options: [
      {text: 'Probar al menos una rama alternativa y confirmar que una transición inválida se rechaza.', correct: true, why: 'Cubrir solo el camino feliz deja afuera las cancelaciones y los intentos que deberían fallar. Ambos son casos reales.'},
      {text: 'Nada: el camino principal es el que más usuarios recorre.', correct: false, why: 'El camino principal es solo una parte del diagrama. Las ramas alternativas y los rechazos también son comportamiento que hay que cubrir.'},
      {text: 'Probar dos veces el camino principal para confirmar que es estable.', correct: false, why: 'Repetir el mismo camino no agrega cobertura nueva: da el mismo resultado. Lo que falta son transiciones que el plan todavía no toca.'},
    ],
  },
  {
    question: 'En un pedido Enviado, el botón Cancelar no aparece en la pantalla. ¿Eso alcanza para dar por cubierta la transición inválida?',
    options: [
      {text: 'Sí: la ausencia del botón ya demuestra que la transición está bloqueada.', correct: false, why: 'La ausencia del botón es una forma de bloquearla, pero el caso no dice si además se espera un rechazo explícito. Queda ambiguo qué se verificó.'},
      {text: 'No: primero hay que volver a probar todas las transiciones válidas otra vez.', correct: false, why: 'Repetir las válidas no resuelve la ambigüedad del caso inválido. El problema es qué se espera exactamente en este caso.'},
      {text: 'No: conviene definir si se espera un rechazo con mensaje o la opción directamente no disponible, y probar ese comportamiento.', correct: true, why: 'Son dos formas válidas de prevenir la transición, pero distintas de verificar. Sin definirlo, dos personas pueden interpretar el mismo resultado de forma opuesta.'},
    ],
  },
];

export const PRACTICE_RULE_LABELS = [
  'No distingue entre «rechazo explícito» y «opción no disponible»',
  'Asume que las transiciones son simétricas sin verificarlo',
  'Prueba solo el camino feliz, sin ramas ni transiciones inválidas',
];

export const PRACTICE_LINES: CodeLine[] = [
  {
    code: 'El plan de una suscripción cubre Prueba gratis → Activa → Cancelada y también Activa → Suspendida → Activa al reintentar el pago.',
    rule: 0,
    why: 'Cubre el camino principal y una rama alternativa real, la suspensión con reintento. Es lo que pide la técnica sobre el diagrama completo.',
    hint: '¿Este plan prueba solo el camino principal, o también una rama alternativa?',
  },
  {
    code: 'El plan solo cubre Prueba gratis → Activa → Cancelada, sin probar nunca la suspensión por falla de pago.',
    rule: 3,
    why: 'Solo el camino principal deja afuera la rama de suspensión, que un usuario real puede encontrar cuando falla un pago.',
    hint: '¿El plan toca alguna rama que no sea el camino principal?',
  },
  {
    code: 'Se asume que, como Activa puede pasar a Suspendida, Suspendida también puede volver directo a Prueba gratis, sin confirmarlo en el diagrama.',
    rule: 2,
    why: 'Que exista Activa → Suspendida no implica la vuelta ni una salida hacia Prueba gratis. Cada flecha se confirma por separado en el diagrama.',
    hint: '¿El diagrama tiene una flecha de Suspendida a Prueba gratis?',
  },
  {
    code: 'Se verifica que, una vez Cancelada, el botón Reactivar ya no aparece en la pantalla.',
    rule: 0,
    why: 'Confirma de forma explícita un estado final, sin transiciones de salida. Es exactamente lo que hay que verificar en ese punto del diagrama.',
    hint: '¿Esto confirma un estado final sin transiciones de salida?',
  },
  {
    code: 'El caso dice «la cancelación debería fallar» para una suscripción ya Cancelada, sin aclarar si se espera un mensaje de error o que el botón no esté.',
    rule: 1,
    why: 'Rechazo con mensaje y opción ausente son dos comportamientos distintos. Sin definirlos, dos personas pueden interpretar el mismo resultado de forma opuesta.',
    hint: '¿El caso define qué forma toma el rechazo: mensaje o ausencia del botón?',
  },
  {
    code: 'Se recorre Activa → Suspendida → Activa y se verifica que los datos de la suscripción sigan intactos al reactivar.',
    rule: 0,
    why: 'Prueba una rama alternativa completa y además verifica el estado resultante. No se queda solo en que la transición exista.',
    hint: '¿Esto se queda solo en que la transición exista, o verifica algo más?',
  },
  {
    code: 'Se asume que desde Cancelada se puede volver a Activa porque el negocio «seguro lo necesita», sin revisar el diagrama.',
    rule: 2,
    why: 'El diagrama es la fuente de verdad: suponer una transición porque tiene sentido deja sin probar si el sistema realmente la permite.',
    hint: '¿Esa transición está dibujada o la está suponiendo el equipo?',
  },
];
