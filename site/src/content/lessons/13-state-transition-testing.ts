import type {CodeLine} from '@site/src/components/FindInCode';
import type {DecisionNode} from '@site/src/components/DecisionPath';
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

/** Tabla de estados del ticket de soporte: [estado actual, evento, estado siguiente]. */
export const TICKET_TABLE: [string, string, string][] = [
  ['Abierto', 'Tomar', 'En progreso'],
  ['En progreso', 'Resolver', 'Resuelto'],
  ['Resuelto', 'Confirmar', 'Cerrado'],
  ['Resuelto', 'Reabrir', 'En progreso'],
];
export const TICKET_START = 'tomar';
export const TICKET_NODES: Record<string, DecisionNode> = {
  tomar: {
    id: 'tomar',
    situation: 'El ticket está Abierto y llega el evento Tomar. ¿En qué estado queda?',
    options: [
      {text: 'Resuelto', correct: false, why: 'Desde Abierto, la única flecha es Tomar → En progreso. Resolver es otro evento, que todavía no ocurrió.'},
      {text: 'En progreso', correct: true, why: 'La tabla tiene la flecha Abierto + Tomar → En progreso.', next: 'confirmar'},
      {text: 'Sigue Abierto: el evento se rechaza', correct: false, why: 'Tomar sí es válido en Abierto: está en la tabla.'},
    ],
  },
  confirmar: {
    id: 'confirmar',
    situation: 'Está En progreso y llega el evento Confirmar. ¿Qué pasa?',
    options: [
      {text: 'Pasa a Cerrado', correct: false, why: 'Confirmar → Cerrado existe, pero solo desde Resuelto. En este estado esa flecha no está.'},
      {text: 'Pasa a Resuelto', correct: false, why: 'Para llegar a Resuelto el evento tiene que ser Resolver, no Confirmar.'},
      {text: 'Se rechaza: sigue En progreso', correct: true, why: 'No hay ninguna flecha En progreso + Confirmar: es una transición inválida y el estado no cambia. Es justo el tipo de caso que esta técnica obliga a probar.', next: 'reabrir'},
    ],
  },
  reabrir: {
    id: 'reabrir',
    situation: 'Llega Resolver (queda Resuelto), pero el cliente responde que el problema sigue: llega Reabrir. ¿En qué estado queda?',
    options: [
      {text: 'En progreso', correct: true, why: 'La tabla dice Resuelto + Reabrir → En progreso: vuelve a trabajarse.', next: 'final'},
      {text: 'Abierto, porque "reabrir" suena a volver al principio', correct: false, why: 'Eso es asumir la transición por el nombre del evento. La tabla es la que manda: Reabrir lleva a En progreso.'},
      {text: 'Se rechaza: un ticket resuelto no se puede tocar', correct: false, why: 'Desde Resuelto hay dos flechas válidas: Confirmar y Reabrir.'},
    ],
  },
  final: {
    id: 'final',
    situation: 'Más tarde se resuelve y se confirma: queda Cerrado. Una semana después, alguien intenta Reabrir. ¿Qué pasa?',
    options: [
      {text: 'Pasa a En progreso, igual que desde Resuelto', correct: false, why: 'Que Reabrir funcione desde Resuelto no dice nada sobre Cerrado. Suponerlo por analogía es justo el error de asumir una transición que la tabla no tiene.'},
      {text: 'Pasa a Abierto', correct: false, why: 'No hay ninguna flecha que salga de Cerrado, y ninguna que vuelva a Abierto.'},
      {text: 'Se rechaza: Cerrado no tiene transiciones de salida', correct: true, why: 'Cerrado es un estado final: ningún evento lo saca de ahí. Intentarlo es una transición inválida que el sistema tiene que rechazar.'},
    ],
  },
};
export const TICKET_EXPLANATION =
  'Cada respuesta salió de la tabla, no del nombre del evento ni de la intuición: la misma acción (Reabrir, Confirmar) es válida en un estado e inválida en otro. Por eso un buen plan prueba las flechas que existen y también intenta las que no existen, incluidas las que salen de un estado final.';

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
