import type {CodeLine} from '@site/src/components/FindInCode';
import type {QuizQuestion} from '@site/src/components/Quiz';

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

export const PRACTICE_RULE_LABELS = [
  'Mezclar la entrada con el resultado en una frase ambigua',
  'Adivinar la causa en el reporte de testing',
  'Reportar sin pasos reproducibles',
  'Cerrar un defecto sin volver a testearlo',
];

export const PRACTICE_LINES: CodeLine[] = [
  {
    code: 'El reporte dice: "el guardado del pedido falla a veces, sobre todo con muchos ítems".',
    rule: 3,
    why: 'No hay un pedido concreto, ni cantidades, ni resultado esperado. Quien debuggea tiene que adivinar con qué datos reproducirlo antes de poder investigar nada.',
    hint: '¿Con qué datos exactos se podría volver a provocar este fallo siguiendo el reporte?',
  },
  {
    code: 'El reporte incluye el pedido de prueba, el total esperado, el total real y la captura de pantalla.',
    rule: 0,
    why: 'Separa la entrada de los resultados y adjunta evidencia. Con eso otra persona puede repetir el caso sin preguntarle nada a quien reportó.',
    hint: '¿Alguien podría reproducir este caso sin preguntar nada más?',
  },
  {
    code: 'El reporte de QA dice: "el total sale mal; debe ser que la API de precios devuelve un valor desactualizado".',
    rule: 2,
    why: 'Mezcla el síntoma con una causa que nadie confirmó. Si la API no tiene nada que ver, la investigación arranca en la dirección equivocada y el defecto real tarda más en aparecer.',
    hint: '¿Esa causa se confirmó mirando el código o los logs, o es una suposición de quien reporta?',
  },
  {
    code: 'El desarrollador adjunta al ticket el commit que corrige el redondeo y explica por qué el valor se redondeaba dos veces.',
    rule: 0,
    why: 'Acá la causa ya fue investigada y confirmada, y se documenta junto con la corrección. No es una causa adivinada en el reporte de testing: es el resultado del debugging.',
    hint: '¿Esta causa está confirmada, o es una suposición sin investigar?',
  },
  {
    code: 'El reporte dice: "probé con el cupón de 20% y el pedido anduvo mal".',
    rule: 1,
    why: 'No se distingue qué se ingresó de qué se observó. "Anduvo mal" puede ser un total incorrecto, un error en pantalla o un pedido que no se guardó, y cada uno lleva a una investigación distinta.',
    hint: '¿Qué dato se usó y qué resultado concreto se obtuvo?',
  },
  {
    code: 'Antes de cerrar, el tester vuelve a ejecutar el caso original del cupón con los mismos datos y confirma que el total ahora da $800.',
    rule: 0,
    why: 'Vuelve al caso exacto que había fallado, con los mismos datos, y comprueba el síntoma original. Eso es lo que confirma que el defecto realmente quedó resuelto.',
    hint: '¿Se volvió a probar el caso original antes de cerrar?',
  },
  {
    code: 'El desarrollador cambia el redondeo, marca el ticket como resuelto y pasa al siguiente sin volver a correr el caso del total.',
    rule: 4,
    why: 'El código cambió, pero nadie confirmó que el síntoma original desapareció. El cambio pudo corregir otra cosa y dejar el fallo reportado intacto.',
    hint: '¿Alguien volvió a ejecutar el caso que originalmente falló después del cambio?',
  },
  {
    code: 'El reporte dice: "no pude reproducir el fallo en tres intentos con los pasos y datos adjuntos".',
    rule: 0,
    why: 'Informar que no se pudo reproducir, junto con los pasos y datos usados, es un reporte útil: permite comparar con el caso original y ajustar la investigación, en vez de dejarla en "a veces falla".',
    hint: '¿Este reporte incluye pasos y datos, aunque no haya logrado reproducirlo?',
  },
];

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
