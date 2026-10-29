import type {MatchItem} from '@site/src/components/Match';
import type {MultiSelectQuestion} from '@site/src/components/MultiSelect';
import type {CodeLine} from '@site/src/components/FindInCode';
import type {QuizQuestion} from '@site/src/components/Quiz';
import type {DecisionNode} from '@site/src/components/DecisionPath';

export const ACTIVITY_RULE_LABELS = [
  'Es debugging, no testing',
  'No es ninguna de las dos: no hay fallo ni evaluación',
];

export const ACTIVITY_LINES: CodeLine[] = [
  {
    code: 'Un desarrollador reescribe la función de validación de email porque le parece más ordenada, sin que nadie haya reportado un fallo ni haya un criterio que comparar.',
    rule: 2,
    why: 'No hay un fallo que investigar ni una evaluación contra un criterio: es una mejora de código motivada por preferencia personal. No encaja en ninguna de las dos actividades.',
    hint: '¿Hay un fallo reportado o un criterio contra el cual comparar el cambio?',
  },
  {
    code: 'Un tester confirma con el documento de requisitos que el alta rechaza emails sin arroba, y anota el resultado.',
    rule: 0,
    why: 'Compara el comportamiento real contra un criterio documentado y registra el hallazgo. Eso identifica si hay o no un fallo: es testing, aunque no toque el código.',
    hint: '¿Hay un fallo ya reportado, o se está evaluando contra un criterio?',
  },
  {
    code: 'Después de que un reporte dice que el total del pedido sale mal, un desarrollador recorre la función de descuentos con breakpoints hasta encontrar un redondeo duplicado.',
    rule: 1,
    why: 'Parte de un fallo ya reportado y busca su causa en el código. Encontrar el redondeo duplicado es explicar por qué ocurre el síntoma, no descubrir un fallo nuevo.',
    hint: '¿Esta actividad parte de un síntoma ya conocido y busca su causa, o está evaluando un comportamiento contra un criterio?',
  },
  {
    code: 'Un tester reproduce el caso que reportó un usuario y confirma que el total sigue mostrando un valor distinto al esperado; adjunta la captura al ticket.',
    rule: 0,
    why: 'Reproducir un caso y confirmar que el síntoma sigue ahí es testing: documenta el fallo observable. No investiga ni corrige la causa en el código, que sería debugging.',
    hint: '¿Esto investiga una causa en el código, o documenta un síntoma?',
  },
  {
    code: 'Un desarrollador agrega un `console.log` para mirar un valor intermedio mientras arma una feature nueva, sin que exista ningún fallo reportado.',
    rule: 2,
    why: 'Está instrumentando su propio código para entenderlo mientras desarrolla. No hay un fallo que perseguir ni una evaluación contra un criterio, así que no es debugging ni testing.',
    hint: '¿Ese `console.log` persigue un fallo reportado o solo ayuda a entender el código mientras se escribe?',
  },
  {
    code: 'El desarrollador lee los logs del servidor de pagos y confirma que el error viene de un campo nulo en la respuesta de la API.',
    rule: 1,
    why: 'Está rastreando la causa de un fallo ya observado hasta un punto concreto del sistema. Confirmar el origen del error es debugging, no una evaluación de comportamiento.',
    hint: '¿Está buscando por qué ocurre un fallo que ya se conoce, o comprobando si algo cumple un requisito?',
  },
  {
    code: 'Antes de que se programe, el tester revisa la historia de usuario y detecta que no define qué pasa si el email ya existe.',
    rule: 0,
    why: 'Evalúa un producto de trabajo y encuentra un problema antes de que exista código. Sigue siendo testing: no hay fallo en ejecución, pero sí una evaluación contra lo que la historia debería cubrir.',
    hint: '¿Hay código en ejecución acá, o se está evaluando un documento?',
  },
  {
    code: 'Un desarrollador corrige el operador de comparación después de confirmar que era la causa del rechazo de contraseñas de 8 caracteres.',
    rule: 1,
    why: 'Ya había un fallo confirmado y una causa identificada; ahora la corrige. Esa corrección es la segunda mitad del debugging, no el descubrimiento de un fallo nuevo.',
    hint: '¿Qué parte del trabajo está haciendo: encontrar la causa, o corregirla una vez confirmada?',
  },
];

export const REPORT_FLOW_START = 'reporte';
export const REPORT_FLOW_NODES: Record<string, DecisionNode> = {
  reporte: {
    id: 'reporte',
    situation: 'Probando el checkout con el cupón `VERANO20` sobre un pedido de $1000, el total muestra $1000 en vez de $800. ¿Cómo lo reportás?',
    options: [
      {
        text: '"Probé con el cupón de 20% y el pedido anduvo mal."',
        correct: false,
        why: 'Mezcla la entrada con el resultado en una frase ambigua: "anduvo mal" puede ser un total incorrecto, un error en pantalla o un pedido que no se guardó.',
      },
      {
        text: '"El total no aplica el descuento; seguramente la API de cupones devuelve el porcentaje desactualizado."',
        correct: false,
        why: 'Agrega una causa que nadie confirmó. Si la API no tiene nada que ver, la investigación arranca en la dirección equivocada.',
      },
      {
        text: 'Pedido de $1000, cupón `VERANO20`, pasos para aplicarlo, total esperado $800, total real $1000, captura adjunta.',
        correct: true,
        why: 'Separa entrada, pasos, esperado y real, sin adivinar causas. Cualquiera puede reproducirlo sin preguntar nada.',
        next: 'confirmar',
      },
      {
        text: 'Anotarlo y esperar al final del sprint para reportarlo junto con otros fallos del checkout.',
        correct: false,
        why: 'Un fallo reportado tarde queda escondido detrás de cambios posteriores, y cuesta más encontrar dónde se originó.',
      },
    ],
  },
  confirmar: {
    id: 'confirmar',
    situation: 'Desarrollo encontró un redondeo que se aplicaba dos veces y lo corrigió. Te pregunta qué tiene que pasar para dar el fallo por resuelto. ¿Qué le respondés?',
    options: [
      {
        text: 'Que vuelva a correr exactamente el caso del reporte: pedido de $1000 con `VERANO20`, y que el total dé $800.',
        correct: true,
        why: 'Indicar el caso exacto evita que desarrollo tenga que adivinar qué probar para confirmar la corrección.',
        next: 'cierre',
      },
      {
        text: 'Que pruebe el checkout en general, a ver si anda bien.',
        correct: false,
        why: '"En general" deja que cada uno adivine qué probar. Puede probar diez cosas y ninguna ser el caso que falló.',
      },
      {
        text: 'Que no hace falta nada más: si encontró la causa y la corrigió, ya está resuelto.',
        correct: false,
        why: 'Encontrar y corregir una causa no confirma que el síntoma reportado desapareció. Eso se confirma volviendo a probar.',
      },
    ],
  },
  cierre: {
    id: 'cierre',
    situation: 'El commit con la corrección ya está mergeado y el ticket sigue abierto, asignado a vos. ¿Qué hacés antes de cerrarlo?',
    options: [
      {
        text: 'Cerrarlo: el código ya cambió y el commit explica la causa.',
        correct: false,
        why: 'Confiar en que "el código cambió" no confirma nada: el cambio pudo corregir otra cosa y dejar el fallo original intacto.',
      },
      {
        text: 'Probar un cupón distinto para ver si el descuento funciona en otro caso.',
        correct: false,
        why: 'Puede ser útil después, pero no confirma el fallo reportado: primero hay que volver al caso exacto que falló.',
      },
      {
        text: 'Volver a ejecutar el caso original con los mismos datos y cerrarlo solo si el total da $800.',
        correct: true,
        why: 'Re-testear el caso original, con los mismos datos, es lo que confirma que el defecto reportado quedó resuelto.',
      },
    ],
  },
};
export const REPORT_FLOW_EXPLANATION =
  'El recorrido completo: testing reporta el síntoma con datos reproducibles y sin adivinar la causa; debugging encuentra y corrige la causa; y el cierre se confirma volviendo a testear el caso original. Cada mitad tiene su trabajo, y el ticket se cierra con evidencia, no con confianza.';

export const CLOSING_QUIZ: QuizQuestion[] = [
  {
    question:
      'Un reporte dice: "el botón de pago a veces no responde; probé en Chrome y Firefox con el mismo pedido". No incluye el pedido, ni el resultado esperado, ni qué ocurrió exactamente. ¿Cuál es el problema principal?',
    options: [
      {
        text: 'Adivina la causa del fallo en vez de describir solo el síntoma.',
        correct: false,
        why: 'No propone ninguna causa: dice que el botón no responde. El problema es la falta de datos para reproducirlo, no una hipótesis sobre el origen.',
      },
      {
        text: 'Cierra el defecto sin haber vuelto a testearlo.',
        correct: false,
        why: 'El defecto está recién reportado, no cerrado. El cierre prematuro sería otro problema, posterior a este reporte.',
      },
      {
        text: 'No hay pasos ni datos reproducibles: quien lo recibe no puede volver a provocar el fallo.',
        correct: true,
        why: 'Mencionar navegadores no alcanza si falta el pedido concreto y la secuencia. Sin eso, la primera tarea de debugging es adivinar cómo reproducirlo, y se pierde tiempo antes de investigar.',
      },
    ],
  },
];

export const ISOLATION_TABLE = `Fallo: el SMS de confirmación
de un turno no llega.

Prueba 1: 11 5555-0101
  Movistar → no llega
Prueba 2: 11 5555-0102
  Claro → llega
Prueba 3: +54 9 11 5555-0101
  Movistar → llega
Prueba 4: 11 5555-0103
  Personal → llega
Prueba 5: 341 555-0104
  Movistar → no llega
Prueba 6: +54 9 341 555-0104
  Movistar → llega`;
export const ISOLATION_QUESTIONS: MultiSelectQuestion[] = [
  {
    prompt: 'Con las seis pruebas, ¿qué afirmaciones respaldan los resultados? Marcá todas las que correspondan.',
    options: [
      {text: 'El fallo ocurre con teléfonos de Movistar cargados sin el prefijo +54 9.', correct: true, why: 'Es la condición mínima: las pruebas 1 y 5 fallan, y el mismo número con prefijo (3 y 6) funciona.'},
      {text: 'El fallo ocurre con todos los teléfonos de Movistar.', correct: false, why: 'Las pruebas 3 y 6 son de Movistar y el SMS llega: la operadora sola no alcanza para que falle.'},
      {text: 'El fallo ocurre con cualquier teléfono sin prefijo, de cualquier operadora.', correct: false, why: 'Las pruebas 2 y 4 no tienen prefijo y funcionan: la falta de prefijo sola tampoco alcanza.'},
      {text: 'No depende del código de área: falla con 11 y con 341.', correct: true, why: 'Las pruebas 1 y 5 tienen códigos de área distintos y fallan igual, así que ese factor quedó descartado.'},
      {text: 'El servicio de SMS de Movistar está caído.', correct: false, why: 'Es una causa que nadie verificó, y además la contradicen las pruebas 3 y 6, donde Movistar sí recibe el SMS.'},
    ],
  },
  {
    prompt: 'Desarrollo corrigió el defecto: ahora el sistema agrega +54 9 a todo teléfono que no lo tenga antes de enviar. ¿Qué pruebas entran en la regresión? Marcá todas las que correspondan.',
    options: [
      {text: 'Enviar el SMS a un teléfono que ya estaba cargado con +54 9.', correct: true, why: 'El cambio toca justamente el prefijo: hay que confirmar que no lo duplique en los teléfonos que ya lo tenían.'},
      {text: 'Enviar el SMS a teléfonos de Claro y Personal sin prefijo.', correct: true, why: 'Antes funcionaban, y ahora pasan por la normalización nueva: el cambio los puede afectar.'},
      {text: 'El recordatorio por WhatsApp, que toma el teléfono del mismo campo y lo normaliza con la misma función.', correct: true, why: 'Usa el mismo código que se cambió, así que puede romperse aunque nadie lo haya tocado directamente.'},
      {text: 'Repetir la prueba 1, con el teléfono de Movistar sin prefijo.', correct: false, why: 'Hay que hacerla, pero es confirmation testing: comprueba que el fallo reportado ya no ocurre. La regresión revisa lo que antes funcionaba.'},
      {text: 'El envío del recordatorio por email.', correct: false, why: 'No usa el teléfono ni la función modificada: el cambio no lo puede afectar.'},
      {text: 'El inicio de sesión con contraseña.', correct: false, why: 'No tiene relación con el envío de mensajes: incluirlo no aporta información sobre este cambio.'},
    ],
  },
];

export const STATE_LEFT: MatchItem[] = [
  {id: 'reopened', text: 'Desarrollo subió la corrección, pero al repetir los pasos del reporte el turno sigue sin enviar el SMS.'},
  {id: 'rejected', text: 'El reporte dice que el turno no se puede cancelar a 1 hora del horario; el requisito fija un mínimo de 2 horas.'},
  {id: 'duplicate', text: 'El mismo fallo de la agenda figura en otro reporte, abierto el martes por otra persona.'},
  {id: 'resolved', text: 'La corrección ya está integrada y nadie volvió a ejecutar todavía el caso que falló.'},
  {id: 'notrepro', text: 'Con los pasos y datos del reporte, ni quien lo escribió ni desarrollo logran que el fallo vuelva a aparecer.'},
];
export const STATE_RIGHT: MatchItem[] = [
  {id: 'resolved', text: 'Resuelto'},
  {id: 'notrepro', text: 'No reproducible'},
  {id: 'reopened', text: 'Reabierto'},
  {id: 'duplicate', text: 'Duplicado'},
  {id: 'rejected', text: 'Rechazado'},
];
export const STATE_WHY: Record<string, string> = {
  reopened: 'El re-test falló: el defecto vuelve al ciclo como Reabierto, no se crea un reporte nuevo.',
  rejected: 'El sistema se comporta como pide el requisito: no hay defecto, y el reporte se rechaza.',
  duplicate: 'Ya existe un reporte del mismo fallo: este se marca como Duplicado y se vincula al original.',
  resolved: 'Hay una corrección, pero falta el re-test. Resuelto no es Cerrado: el cierre llega cuando el re-test confirma que funciona.',
  notrepro: 'Con la información disponible no se logra provocar el fallo; suele pedirse más información antes de descartarlo del todo.',
};
