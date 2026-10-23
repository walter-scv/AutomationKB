import type {CodeLine} from '@site/src/components/FindInCode';
import type {QuizQuestion} from '@site/src/components/Quiz';
import type {OrderItem, OrderRule} from '@site/src/components/Order';

export const BOUNDARY_RULE_LABELS = ['Redundante: la partición ya está cubierta por otro valor del plan'];

export const BOUNDARY_LINES: CodeLine[] = [
  {
    code: 'Con la regla «entre 8 y 64 caracteres», el plan ya prueba 8 y 64. Se agrega un usuario de 31 caracteres.',
    rule: 1,
    why: '31 cae en la misma partición válida que ya cubren 8 y 64: cualquier valor del medio se comporta igual, así que no agrega información nueva.',
    hint: '¿31 cae en una partición distinta de la que ya cubren 8 y 64?',
  },
  {
    code: 'Al mismo plan se agrega un usuario de 7 caracteres.',
    rule: 0,
    why: '7 es el primer valor inválido por abajo: prueba el otro lado del límite inferior, que 8 por sí solo no cubre. Sí suma cobertura.',
  },
  {
    code: 'Al mismo plan se agrega un usuario de 65 caracteres.',
    rule: 0,
    why: '65 es el primer valor inválido por arriba. Aunque parezca un caso más, es justo el borde que un error de comparación dejaría pasar.',
  },
  {
    code: 'Al mismo plan se agrega un usuario de 9 caracteres.',
    rule: 1,
    why: '9 está dentro del rango válido, igual que 8 y 64: no roza ningún límite real. Suma tiempo de ejecución, no cobertura.',
    hint: '¿9 está en el borde del rango o en el medio?',
  },
  {
    code: 'Se agrega el campo vacío al plan, y se espera «campo obligatorio», no «demasiado corto».',
    rule: 0,
    why: 'El vacío es una partición inválida distinta de «muy corto», y el mensaje esperado también es distinto. Sí suma cobertura.',
  },
  {
    code: 'Se agrega un usuario de 12 caracteres porque «nunca se probó ese largo».',
    rule: 1,
    why: '12 está en el medio del rango válido: si 8 y 64 pasan, 12 también. Es la misma partición con otro número.',
    hint: '¿Qué información nueva aporta un valor del medio si los dos límites ya se probaron?',
  },
  {
    code: 'Se agrega un usuario de 63 caracteres, distinto de 64, para cubrir el otro extremo.',
    rule: 1,
    why: '63 no es el límite: el límite es 64. Probar un vecino del límite no reemplaza al límite, y la partición válida ya estaba cubierta.',
    hint: '¿63 es el límite del rango, o solo un número cerca de él?',
  },
];

export const BOUNDARY_ORDER_ITEMS: OrderItem[] = [
  {id: 'invalid-pair', what: 'Paso', code: 'Probar 12 y 121, los dos límites del lado inválido.'},
  {id: 'range', what: 'Paso', code: 'Leer la regla del campo edad: entero entre 13 y 120.'},
  {id: 'valid-pair', what: 'Paso', code: 'Probar 13 y 120, los dos límites del lado válido.'},
];

export const BOUNDARY_ORDER_CORRECT = ['range', 'valid-pair', 'invalid-pair'];

export const BOUNDARY_ORDER_RULES: OrderRule[] = [
  {before: 'range', after: 'valid-pair', why: 'no se pueden elegir 13 y 120 sin leer primero cuál es el rango de la regla.'},
  {before: 'range', after: 'invalid-pair', why: 'no se pueden elegir 12 y 121 sin leer primero cuál es el rango de la regla.'},
  {before: 'valid-pair', after: 'invalid-pair', why: 'si los límites válidos ya fallan, el defecto está en el rango y no en el rechazo: por eso primero se confirma que se acepta lo que debe aceptarse.'},
];

export const APPLIES_QUIZ: QuizQuestion[] = [
  {
    question: 'El campo «cantidad de unidades a comprar» acepta un número entero del 1 al 10. ¿Se le puede aplicar boundary value analysis?',
    options: [
      {text: 'No: los números no tienen límites; BVA solo sirve para fechas y textos.', correct: false, why: 'Los rangos numéricos tienen un mínimo y un máximo, que son límites reales. La técnica no depende del tipo de dato sino de que exista un orden.'},
      {text: 'Sí, pero solo si antes se prueba un valor del medio de cada partición.', correct: false, why: 'Probar el medio es lo que BVA justamente evita repetir: el valor del medio de una partición no agrega nada frente a sus límites.'},
      {text: 'Sí: es un rango ordenado con mínimo en 1 y máximo en 10, así que tiene bordes que probar.', correct: true, why: 'Ese es justo el caso donde BVA aplica: hay un orden y dos límites claros. Los valores a probar serían 0, 1, 10 y 11.'},
    ],
  },
  {
    question: 'El checkbox de «Acepto los términos» solo tiene dos estados: tildado o destildado. ¿Tiene sentido aplicar boundary value analysis sobre este campo?',
    options: [
      {text: 'No: al no haber un orden entre tildado y destildado, no existe un límite intermedio que analizar.', correct: true, why: 'BVA necesita un rango ordenado para que haya un «antes» y un «después» del límite. Dos estados sin orden son una condición binaria, no un rango.'},
      {text: 'Sí: cualquier campo con dos valores posibles tiene un límite entre ellos.', correct: false, why: 'Tener dos valores no alcanza. Hace falta que estén ordenados en un rango para que exista un límite real entre uno y otro.'},
      {text: 'Sí: el límite es el momento exacto en que el usuario cambia de un estado al otro.', correct: false, why: 'Ese cambio es una transición de estado, no un valor límite de una partición ordenada. Son conceptos distintos.'},
    ],
  },
  {
    question: 'El campo «fecha de nacimiento» acepta fechas desde el 1 de enero de 1900 hasta hoy. ¿Qué conjunto de valores aplica mejor boundary value analysis?',
    options: [
      {text: 'Solo hoy, porque es el único límite que cambia todos los días.', correct: false, why: 'Hoy es un límite, pero el otro extremo también existe y no cambia por ser fijo. Probar uno solo deja la mitad de los bordes sin cubrir.'},
      {text: '1900-01-01 y hoy, más 1899-12-31 y mañana: los dos lados de cada límite.', correct: true, why: 'Cubre el último valor válido y el primero inválido en cada extremo. Ahí es donde un operador de comparación mal escrito se nota.'},
      {text: '1900-01-01 y 1950-01-01, para cubrir dos épocas distintas del rango.', correct: false, why: '1950-01-01 cae en el medio de la partición válida y no es ningún límite. Repite una cobertura que ya dan los extremos.'},
    ],
  },
];

export const CLOSING_QUIZ: QuizQuestion[] = [
  {
    question: 'Para un código de descuento de 6 a 10 caracteres, alguien propone probar 5, 6, 10 y 11. ¿Qué le decís?',
    options: [
      {text: 'Está completo: cubre los dos lados de cada límite, que es lo que busca boundary value analysis.', correct: true, why: '5 y 11 son los primeros inválidos de cada lado, y 6 y 10 los últimos válidos. Los cuatro bordes están cubiertos.'},
      {text: 'Está incompleto: falta un valor del medio del rango para confirmar que el caso válido funciona.', correct: false, why: 'Un valor del medio de la partición válida se comporta igual que 6 y 10. Agregarlo suma tiempo, no información nueva sobre los límites.'},
      {text: 'Está de más: con 5 y 11 alcanza para detectar cualquier problema del campo.', correct: false, why: 'Probar solo los inválidos deja sin confirmar que los válidos se aceptan. Un error en el otro lado del límite pasaría sin notarse.'},
    ],
  },
  {
    question: 'La regla de un campo cambia de «entre 8 y 64 caracteres» a «entre 10 y 64». El plan de test sigue probando 7, 8, 64 y 65. ¿Qué pasa con ese plan?',
    options: [
      {text: 'Sigue siendo válido, porque los números son los mismos que antes.', correct: false, why: 'Los límites de la regla cambiaron: ahora el mínimo es 10. Probar los números viejos da una falsa sensación de cobertura.'},
      {text: '7 y 8 dejaron de ser los bordes: el plan ahora prueba valores del medio sin tocar los límites nuevos.', correct: true, why: 'Con el mínimo en 10, los bordes pasan a ser 9, 10, 64 y 65. Los valores viejos ya no verifican la regla que rige hoy.'},
      {text: 'Solo hay que agregar 9 y 10; el resto sigue probando los bordes actuales.', correct: false, why: '7 y 8 ya no son bordes del rango nuevo: quedaron en la zona inválida. El plan actualizado tiene que reemplazarlos, no solo sumar valores.'},
    ],
  },
];

export const PRACTICE_RULE_LABELS = [
  'Solo probó un lado del límite',
  'Olvidó la partición de ausencia de valor',
  'Usó un límite redondo en vez del límite real',
  'Redundante (misma partición ya cubierta)',
];

export const PRACTICE_LINES: CodeLine[] = [
  {
    code: 'Se prueban 13, 12, 120 y 121: los cuatro valores que rodean los dos límites del rango.',
    rule: 0,
    why: 'Cubre el último válido y el primero inválido en cada extremo. Es exactamente el conjunto que pide boundary value analysis.',
  },
  {
    code: 'Además de 13 y 120, se agrega 45 «para estar más seguros».',
    rule: 4,
    why: '45 cae en la misma partición válida que ya cubrieron 13 y 120: no suma cobertura nueva, solo tiempo de ejecución.',
    hint: '¿Ese valor del medio cae en una partición que ya probaste con el límite?',
  },
  {
    code: 'Se prueban 13 y 120 válidos y 121 inválido, pero nunca 12.',
    rule: 1,
    why: 'Falta el lado inválido del límite inferior. Un error de comparación en ese borde solo se detecta probando 12, no con los valores válidos.',
    hint: '¿Qué pasaría si el sistema rechazara un valor que debería aceptar?',
  },
  {
    code: 'Se prueba el campo vacío y se espera «campo obligatorio», distinto de «edad fuera de rango».',
    rule: 0,
    why: 'La ausencia de valor es una partición inválida distinta de «muy joven» o «muy viejo», y el sistema suele manejarla con otro mensaje.',
  },
  {
    code: 'Se prueban 10 y 100 porque son números redondos, en lugar de 13 y 120.',
    rule: 3,
    why: '10 y 100 no son los límites de la regla. Si el defecto está justo en 13 o en 120, probar números cómodos nunca lo va a encontrar.',
    hint: '¿Esos valores son los límites que define la regla, o valores cómodos de recordar?',
  },
  {
    code: 'Se prueban los cuatro valores límite (12, 13, 120 y 121), pero nunca el campo vacío.',
    rule: 2,
    why: 'Vacío es una clase inválida distinta de «fuera de rango». Sin ese caso, un sistema que acepta el campo sin completar pasaría la prueba.',
    hint: '¿Probaron qué pasa si el campo directamente no se completa?',
  },
  {
    code: 'Se prueban 12, 13, 120 y 121, y además se verifica el mensaje de error en 12 y en 121.',
    rule: 0,
    why: 'Cubre el último válido y el primero inválido de cada lado, y confirma el mensaje solo donde corresponde. Es el plan completo de boundary value analysis.',
  },
  {
    code: 'Se prueban 30, 45 y 60 dentro del rango «para cubrir distintas edades».',
    rule: 4,
    why: 'Los tres pertenecen a la misma partición válida: si uno funciona, los otros también. Probar tres representantes del mismo grupo no cambia el resultado.',
    hint: '¿Esos tres valores caen en particiones distintas o en la misma?',
  },
];
