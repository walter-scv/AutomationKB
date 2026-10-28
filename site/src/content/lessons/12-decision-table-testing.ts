import type {DecisionNode} from '@site/src/components/DecisionPath';
import type {CodeLine} from '@site/src/components/FindInCode';
import type {MatchItem} from '@site/src/components/Match';

export const ROWS_ACCEPTED = ['16', 'dieciséis', 'dieciseis'];
export const ROWS_HINTS = [
  'Arrancá por lo que ya sabés: con 2 condiciones de sí/no, la tabla de la teoría tiene 4 filas. ¿Qué le pasa a esa cantidad al sumar una condición más?',
  'Cada condición nueva de sí/no duplica las filas: cada fila que ya tenías aparece una vez con "sí" y otra con "no". Contá: 2 condiciones → 4, 3 → 8, 4 → ...',
];
export const ROWS_EXPLANATION =
  'Con 4 condiciones de sí/no hay 2 × 2 × 2 × 2 = 16 combinaciones. Por eso una decision table incluye solo las condiciones que de verdad interactúan en el resultado: cada condición de más duplica el trabajo.';

export const TECHNIQUE_MATCH_LEFT: MatchItem[] = [
  {id: 'bva', text: 'La edad para registrarse tiene que estar entre 18 y 99 años.'},
  {id: 'ep', text: 'El país y la moneda se validan cada uno con sus propias reglas, sin que uno afecte al otro.'},
  {id: 'dt', text: 'Una función nueva se muestra solo si el usuario es premium Y además está en la lista de beta testers.'},
  {id: 'dtcut', text: 'El envío es gratis si el monto supera $5000 Y la cuenta es premium; el formulario también pide el idioma, que no cambia el envío.'},
];
export const TECHNIQUE_MATCH_RIGHT: MatchItem[] = [
  {id: 'dtcut', text: 'Decision table con las combinaciones de las condiciones que deciden, dejando afuera la que no influye.'},
  {id: 'bva', text: 'Boundary value analysis sobre los dos bordes del rango.'},
  {id: 'dt', text: 'Decision table con todas las combinaciones de las dos condiciones.'},
  {id: 'ep', text: 'Una partición por campo, probando cada uno por separado.'},
];
export const TECHNIQUE_MATCH_WHY: Record<string, string> = {
  bva: 'Un solo campo con un rango ordenado: lo importante está en los bordes (17, 18, 99 y 100).',
  ep: 'Si los campos no interactúan, combinarlos multiplica filas sin sumar cobertura: alcanza con probar cada uno por separado.',
  dt: 'El resultado depende de cómo se combinan las dos condiciones: hay que cubrir las cuatro combinaciones, incluida "premium sin beta".',
  dtcut: 'Monto y premium interactúan, así que van en la tabla. El idioma no cambia el envío: sumarlo duplicaría las filas sin agregar cobertura.',
};

export const PRACTICE_RULE_LABELS = [
  'Repite una combinación ya cubierta con otro dato',
  'Deja afuera una combinación relevante',
  'Combina un campo independiente e infla la tabla',
];

export const PRACTICE_LINES: CodeLine[] = [
  {
    code: 'Se cruzan «monto > $5000» con «cuenta premium» y quedan las 4 combinaciones posibles.',
    rule: 0,
    why: 'Las dos condiciones interactúan en la lógica de envío gratis, y la tabla cubre el cruce completo. Es exactamente lo que pide la técnica.',
  },
  {
    code: 'Se agrega «color del botón de compra» a la misma tabla, duplicando las filas, aunque no cambia el envío.',
    rule: 3,
    why: 'El color no interactúa con el monto ni con la cuenta premium en esta lógica. Combinarlo solo infla la tabla sin sumar cobertura real.',
    hint: '¿Esa condición cambia el resultado de las otras dos, o es independiente?',
  },
  {
    code: 'La tabla tiene 3 filas: falta «monto ≤ $5000 + cuenta premium».',
    rule: 2,
    why: 'Con dos condiciones binarias hay cuatro combinaciones posibles. Faltar una deja sin probar un caso real que un usuario premium puede encontrar.',
    hint: '¿La tabla tiene las cuatro combinaciones posibles entre las dos condiciones?',
  },
  {
    code: 'Se agrega una fila con «$6000 + premium», que ya estaba cubierta por «monto > $5000 + premium».',
    rule: 1,
    why: '$6000 cae en la misma condición que ya estaba en la tabla: es el mismo cruce de condiciones con otro número, no una combinación nueva.',
    hint: '¿Esta combinación de condiciones, más allá del dato exacto, ya está en otra fila?',
  },
  {
    code: 'Se documenta aparte que «monto negativo + premium» no es una combinación válida del sistema.',
    rule: 0,
    why: 'Marcar explícitamente una combinación imposible evita que alguien piense después que se olvidaron de ella. Es una decisión documentada, no una omisión.',
  },
  {
    code: 'La tabla lista «monto > $5000 + sin premium» y «monto ≤ $5000 + sin premium», pero no la combinación con premium.',
    rule: 2,
    why: 'Quedaron las dos filas sin premium y ninguna con premium. Falta justo el cruce que puede cambiar el resultado del envío.',
    hint: '¿Están cubiertas las dos variantes de la condición premium?',
  },
  {
    code: 'Se documenta que con monto en 0 el envío se cobra igual, en vez de omitir esa fila en silencio.',
    rule: 0,
    why: 'Una combinación que el sistema resuelve de una forma particular queda explícita. Así nadie la confunde con un olvido al leer la tabla.',
  },
];

export const RENTAL_START = 'hueco';
export const RENTAL_NODES: Record<string, DecisionNode> = {
  hueco: {
    id: 'hueco',
    situation: 'Requisito de una agencia de alquiler de autos: «Se confirma el alquiler si el conductor tiene licencia vigente y tarjeta de crédito. Si además tiene más de 25 años, no paga recargo. Sin licencia vigente, siempre se rechaza.» Al armar la tabla, la combinación «licencia vigente, sin tarjeta de crédito» no tiene resultado en el texto. ¿Qué hacés?',
    options: [
      {text: 'Asumir que se rechaza, que es lo más lógico, y seguir con la tabla.', correct: false, why: 'Podría ser rechazo, pago con débito o un depósito en efectivo: es una decisión de negocio, no de quien prueba. Asumirla esconde un defecto del requisito.'},
      {text: 'Consultarlo con el responsable del producto antes de diseñar los casos.', correct: true, why: 'Una combinación sin resultado definido es un defecto del requisito, y encontrarlo antes de ejecutar es uno de los aportes de la técnica.', next: 'simplificar'},
      {text: 'Sacar esa combinación de la tabla, porque el requisito no la menciona.', correct: false, why: 'Que el requisito no la mencione no la hace imposible: un conductor sin tarjeta va a llegar al mostrador igual.'},
    ],
  },
  simplificar: {
    id: 'simplificar',
    situation: 'El responsable confirma que sin tarjeta también se rechaza. Ahora, las cuatro reglas sin licencia vigente dan «Rechazado», tenga o no tarjeta y sea cual sea la edad. ¿Cómo se simplifican?',
    options: [
      {text: 'Se eliminan: con licencia vencida es obvio que se rechaza.', correct: false, why: 'Que el resultado parezca obvio no lo saca de la cobertura: sin esa regla, ningún caso comprueba que el sistema rechace.'},
      {text: 'Se unen en una sola regla: licencia = No, tarjeta = –, edad = – → Rechazado.', correct: true, why: 'Tarjeta y edad no cambian el resultado cuando no hay licencia: se marcan con guion y las cuatro reglas pasan a ser una.', next: 'riesgo'},
      {text: 'Se unen también con las reglas con licencia, porque en todas la edad parece no importar.', correct: false, why: 'Con licencia y tarjeta, la edad sí decide si hay recargo: no es irrelevante ahí y esas reglas no se pueden unir.'},
    ],
  },
  riesgo: {
    id: 'riesgo',
    situation: 'Alquilarle un auto a alguien sin licencia vigente expone a la agencia a una sanción legal. La regla unida representa cuatro combinaciones. ¿Cuántas probás?',
    options: [
      {text: 'Al menos dos de las combinaciones unidas, por ejemplo con y sin tarjeta.', correct: true, why: 'La simplificación asume que el sistema ignora tarjeta y edad cuando no hay licencia. Con un riesgo alto, conviene confirmar esa suposición con más de una combinación.', next: 'caso'},
      {text: 'Una sola: la regla unida es una regla.', correct: false, why: 'Para la cobertura alcanza una, pero si el sistema tuviera un defecto en alguna de las combinaciones unidas, un solo caso no lo vería. Con este riesgo, no conviene.'},
      {text: 'Ninguna: el sistema seguramente valida la licencia.', correct: false, why: 'Una regla sin caso queda sin cobertura, y es justamente la de mayor riesgo.'},
    ],
  },
  caso: {
    id: 'caso',
    situation: 'Diseñando los casos concretos: conductor de 22 años, licencia vigente, tarjeta de crédito. ¿Qué resultado esperado lleva ese caso?',
    options: [
      {text: 'Rechazado, porque es menor de 25.', correct: false, why: 'La edad no decide si se confirma, solo si paga recargo.'},
      {text: 'Confirmado sin recargo.', correct: false, why: 'El alquiler sin recargo exige más de 25 años.'},
      {text: 'Confirmado, con recargo.', correct: true, why: 'Cumple licencia y tarjeta, así que se confirma; como no supera los 25 años, paga recargo. Es la regla «licencia Sí, tarjeta Sí, > 25 No».'},
    ],
  },
};
export const RENTAL_EXPLANATION =
  'La tabla primero encontró un hueco en el requisito; después se simplificó uniendo lo que no cambia el resultado, se decidió cuánto probar de lo unido según el riesgo, y cada regla factible se convirtió en un caso con datos concretos.';
