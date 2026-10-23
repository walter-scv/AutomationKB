import type {CodeLine} from '@site/src/components/FindInCode';
import type {QuizQuestion} from '@site/src/components/Quiz';

export const COMBINATION_RULE_LABELS = [
  'Repite una combinación que ya está cubierta',
  'Combina una condición que no interactúa con la lógica',
  'Deja afuera una combinación relevante',
];

export const COMBINATION_LINES: CodeLine[] = [
  {
    code: '«Monto > $5000 + cuenta premium» → envío gratis.',
    rule: 0,
    why: 'Es una de las cuatro combinaciones posibles entre monto y cuenta: con premium y monto alto. Suma una fila que la tabla necesita.',
  },
  {
    code: 'Se agrega «idioma de la interfaz = español» a la tabla, duplicando las filas, aunque el idioma no cambia si el envío es gratis.',
    rule: 2,
    why: 'El idioma no participa en la decisión de envío gratis: combinarlo multiplica filas sin que cambie ningún resultado.',
    hint: '¿Esta condición cambia el resultado de las otras dos, o es independiente?',
  },
  {
    code: '«Monto ≤ $5000 + cuenta premium» → sin envío gratis.',
    rule: 0,
    why: 'Aunque la cuenta sea premium, el monto no alcanza. Es una combinación distinta a la de premium con monto alto, y la tabla la necesita.',
  },
  {
    code: 'La tabla lista tres filas y deja afuera «monto ≤ $5000 + sin premium».',
    rule: 3,
    why: 'Con dos condiciones binarias hay cuatro combinaciones. Faltar una deja sin probar un caso que un usuario real puede encontrar.',
    hint: '¿Cuántas combinaciones posibles hay entre dos condiciones binarias?',
  },
  {
    code: '«Monto > $5000 + sin premium» → sin envío gratis.',
    rule: 0,
    why: 'Completa el cruce: monto alto sin premium. No repite ninguna fila anterior y documenta un resultado distinto.',
  },
  {
    code: 'Se agrega una fila con «$8000 + premium», que repite la combinación de «monto > $5000 + premium».',
    rule: 1,
    why: 'El número cambia, pero la combinación de condiciones es la misma que ya está en la tabla: con premium y monto alto.',
    hint: '¿Cambia la combinación de condiciones, o solo el número del monto?',
  },
  {
    code: 'Se agrega «método de pago = tarjeta» como tercera condición, aunque no cambia si el envío es gratis.',
    rule: 2,
    why: 'El método de pago no afecta la regla de envío gratis. Agregarlo infla la tabla sin sumar una combinación relevante.',
    hint: '¿El método de pago interviene en la decisión de envío gratis?',
  },
];

export const WHEN_QUIZ: QuizQuestion[] = [
  {
    question: 'El acceso a una función nueva depende de si el usuario tiene cuenta premium Y de si está en la lista de beta testers: ambas condiciones juntas definen si la ve o no. ¿Qué técnica conviene?',
    options: [
      {text: 'Equivalence partitioning sobre cada condición, sin combinarlas.', correct: false, why: 'Eso dejaría sin probar combinaciones como premium sin beta tester, que es un caso real que la lógica contempla.'},
      {text: 'Decision table: el resultado depende de cómo se combinen las dos condiciones.', correct: true, why: 'Exactamente el caso: dos condiciones que interactúan, y el resultado cambia según la combinación. Hay cuatro filas posibles.'},
      {text: 'Boundary value analysis sobre la antigüedad de la cuenta.', correct: false, why: 'La antigüedad no es la condición que define el acceso acá. BVA miraría límites de un dato que no participa en esta decisión.'},
    ],
  },
  {
    question: 'El campo «país» y el campo «moneda» son independientes: cada uno se valida con sus propias reglas, sin que uno afecte al otro. ¿Conviene armar una decision table para estos dos campos?',
    options: [
      {text: 'Sí, porque cualquier par de campos del mismo formulario interactúa en la validación.', correct: false, why: 'Estar en el mismo formulario no implica interacción. Lo que importa es si el resultado de uno cambia según el valor del otro.'},
      {text: 'Sí, pero solo si se combinan también con el idioma de la interfaz.', correct: false, why: 'Sumar otra condición independiente solo agranda la tabla. El problema no es cuántas condiciones hay, sino si interactúan.'},
      {text: 'No: si no interactúan, alcanza con probar cada uno por separado.', correct: true, why: 'Una decision table se justifica cuando el resultado depende de la combinación. Si son independientes, combinarlos multiplica filas sin sumar cobertura.'},
    ],
  },
  {
    question: 'Un sistema de envíos calcula el costo según el peso del paquete Y el tipo de envío elegido (estándar o urgente). Las dos condiciones juntas determinan el costo final. ¿Qué técnica se aplica?',
    options: [
      {text: 'Decision table, combinando rangos de peso con tipo de envío.', correct: true, why: 'El resultado depende de la combinación de dos condiciones, no de cada una por separado. La tabla hace explícitas las filas que hay que cubrir.'},
      {text: 'Boundary value analysis sobre el peso, sin considerar el tipo de envío.', correct: false, why: 'Cubriría bien los bordes del peso, pero dejaría sin probar cómo cambia el costo al combinarlo con cada tipo de envío.'},
      {text: 'Testing exploratorio, porque el costo cambia según el contexto.', correct: false, why: 'Que el resultado dependa del contexto no lo vuelve exploratorio: acá las condiciones están definidas y se pueden combinar de forma sistemática.'},
    ],
  },
];

export const CLOSING_QUIZ: QuizQuestion[] = [
  {
    question: '¿Por qué una decision table no enumera combinaciones de TODOS los campos de un formulario grande, solo de los que interactúan en la lógica?',
    options: [
      {text: 'Porque el formato de tabla no admite más de tres columnas.', correct: false, why: 'No hay un límite técnico de columnas. El límite es de criterio: solo tiene sentido incluir las condiciones que se afectan entre sí.'},
      {text: 'Porque combinar campos que no interactúan multiplica filas sin agregar cobertura real.', correct: true, why: 'El valor de la tabla está en capturar las combinaciones que sí cambian el resultado. Sumar condiciones independientes solo infla el trabajo.'},
      {text: 'Porque cada campo siempre se valida con una tabla aparte y después se suman los resultados.', correct: false, why: 'Eso es justamente lo que una decision table evita cuando hay interacción: el resultado puede depender de la combinación, no de sumar validaciones aisladas.'},
    ],
  },
  {
    question: 'Un sistema otorga un descuento solo cuando el cliente es nuevo Y el monto supera $10.000. ¿Qué técnica anticipa mejor los casos?',
    options: [
      {text: 'Boundary value analysis sobre el monto, sin mirar si el cliente es nuevo.', correct: false, why: 'El monto solo no explica el descuento: un cliente recurrente con el mismo monto no lo recibe. Falta la otra condición.'},
      {text: 'State transition: el cliente pasa de nuevo a recurrente.', correct: false, why: 'El estado del cliente puede cambiar con el tiempo, pero el descuento de esta compra depende del cruce con el monto, no de una transición entre estados.'},
      {text: 'Decision table: el descuento depende de la combinación de las dos condiciones.', correct: true, why: 'Hay dos condiciones que interactúan y cuatro combinaciones posibles. La tabla obliga a cubrir, por ejemplo, cliente nuevo con monto bajo.'},
    ],
  },
];

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
