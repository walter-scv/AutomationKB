import type {TerminalStep} from '@site/src/components/Terminal';
import type {CodeLine} from '@site/src/components/FindInCode';
import type {QuizQuestion} from '@site/src/components/Quiz';
import type {FillBlankSlot} from '@site/src/components/FillBlank';
import type {MultiSelectQuestion} from '@site/src/components/MultiSelect';
import type {BuilderStep} from '@site/src/components/CommandBuilder';

export const OPERATOR_RULE_LABELS = [
  'Usa `=` (asignación) donde iba una comparación',
  'Compara con `==` o `!=`, que convierten los tipos antes de comparar',
  'Compara con `===` dos valores de tipos distintos, y el resultado siempre es `false`',
];

export const OPERATOR_LINES: CodeLine[] = [
  {
    code: "const idDesdeUrl = params.get('id');\nconst mismoCliente = idDesdeUrl == pedido.clienteId;",
    rule: 2,
    why: '`params.get` devuelve un string (o `null`), mientras que `clienteId` es number. Con `==` uno se convierte al tipo del otro, así que el dato que nunca se convirtió pasa desapercibido.',
    hint: '¿Qué tipo devuelve `params.get` y qué tipo tiene el otro lado de la comparación?',
  },
  {
    code: 'let intentosRestantes = 3;\nwhile (intentosRestantes !== 0) {\n  intentosRestantes -= 1;\n}',
    rule: 0,
    why: 'Acá `let` se justifica porque el valor cambia en cada vuelta, y `!== 0` compara dos numbers sin conversión. El decremento garantiza que la condición llegue a ser falsa.',
  },
  {
    code: 'if (saldoDisponible = montoTotal) {\n  aprobarCompra();\n}',
    rule: 1,
    why: 'La condición no pregunta si el saldo alcanza: asigna el monto a `saldoDisponible` y evalúa ese número como booleano. Con cualquier monto distinto de 0 se entra, aunque el saldo fuera menor.',
    hint: '¿Qué valor queda guardado en `saldoDisponible` después de evaluar la condición?',
  },
  {
    code: "const cantidad = Number(input.value);\nif (cantidad === '0') {\n  marcarPedidoVacio();\n}",
    rule: 3,
    why: "`Number(...)` ya convirtió el valor a number, así que compararlo con el string '0' usando `===` da siempre `false`: el caso del pedido vacío nunca se detecta. Del otro lado del `===` va el número `0`.",
    hint: '¿Qué tipo tiene `cantidad` después de pasar por `Number(...)`?',
  },
  {
    code: "if (estado !== 'cancelado' && estado !== 'vencido') {\n  enviarRecordatorio(pedido);\n}",
    rule: 0,
    why: 'Las dos comparaciones son contra strings y usan `!==`, sin conversión. La doble negación se lee como "ni cancelado ni vencido" y no deja ningún caso afuera.',
  },
  {
    code: 'const numeroBuscado = searchInput.value;\nconst esMismoPedido = pedido.numero == numeroBuscado;',
    rule: 2,
    why: '`searchInput.value` siempre es texto y `pedido.numero` es number. `==` convierte el texto y la comparación parece funcionar hasta que aparece un formato distinto (espacios, ceros a la izquierda) y el bug se vuelve difícil de rastrear.',
    hint: '¿De dónde sale `numeroBuscado` y en qué tipo llega a la comparación?',
  },
  {
    code: 'const sinStock = articulo.stock === 0;',
    rule: 0,
    why: 'Compara dos numbers con `===` y el booleano resultante tiene justo el nombre de la condición. No hay coerción ni asignación escondida.',
  },
  {
    code: 'if (cupoDisponible = cupoMaximo - inscriptos) {\n  habilitarInscripcion();\n}',
    rule: 1,
    why: 'La condición guarda el cupo restante en vez de compararlo: el `if` se decide por si ese número es distinto de 0, no por si hay lugar. El resultado depende de un valor que nadie quiso evaluar así.',
    hint: '¿Esta condición compara el cupo contra algo, o guarda un cálculo?',
  },
];

export const EDIT_PREFIX = 'const puedeEditar = ';
export const EDIT_STEPS: BuilderStep[] = [
  {
    options: ['!(esAutor', 'esAutor', '(esAutor'],
    correct: '(esAutor',
    hint: 'Las dos primeras condiciones van juntas y se evalúan antes que la tercera. ¿Cómo lo dejás explícito?',
  },
  {
    options: ['&& !bloqueado)', '|| !bloqueado)', '&& bloqueado)'],
    correct: '&& !bloqueado)',
    hint: 'Tienen que cumplirse las dos a la vez: ser el autor y que el documento no esté bloqueado.',
  },
  {
    options: ['&& esAdmin;', '|| esAdmin;', '|| !esAdmin;'],
    correct: '|| esAdmin;',
    hint: 'Ser admin alcanza por sí solo, aunque no se cumpla lo anterior.',
  },
];
export const EDIT_EXPLANATION =
  '`(esAutor && !bloqueado) || esAdmin`: los paréntesis dejan claro que "autor y no bloqueado" se evalúa junto, `&&` exige las dos cosas, `!` niega solo `bloqueado`, y `||` deja pasar al admin aunque no sea el autor. Sin paréntesis, quien lea tiene que recordar qué operador se evalúa primero.';

export const CLOSING_QUIZ: QuizQuestion[] = [
  {
    question:
      'En el perfil, el estado "contacto verificado" se muestra si el email o el teléfono están verificados, pero nunca si no lo está ninguno. ¿Qué expresión lo representa?',
    options: [
      {
        text: '`emailVerificado || telefonoVerificado`',
        correct: true,
        why: '`||` da `true` cuando al menos uno de los dos está verificado, y `false` solo si los dos son falsos. Es exactamente la regla del perfil.',
      },
      {
        text: '`emailVerificado && telefonoVerificado`',
        correct: false,
        why: '`&&` exige los dos: con un solo dato verificado el estado no se mostraría, que es más estricto que la regla del perfil.',
      },
      {
        text: '`emailVerificado !== telefonoVerificado`',
        correct: false,
        why: 'Eso significa "uno sí y el otro no": con los dos verificados daría `false` y el estado no se mostraría, cuando la regla dice que debería.',
      },
    ],
  },
];

export const APPROVAL_TEMPLATE = 'const puedeAprobar = saldoDisponible {{cmp}} montoTotal {{logic}} terminosAceptados;';
export const APPROVAL_SLOTS: FillBlankSlot[] = [
  {id: 'cmp', answer: '>='},
  {id: 'logic', answer: '&&'},
];
export const APPROVAL_BANK = ['>=', '=', '==', '&&', '||'];
export const APPROVAL_EXPLANATION =
  'Hace falta que el saldo alcance Y que los términos estén aceptados, así que la unión correcta es `&&`: `||` aprobaría con que se cumpla una sola de las dos. Para comparar el saldo sin conversión de tipos corresponde `>=`: `=` asignaría el monto en vez de compararlo, y `==` convertiría tipos antes de comparar.';



export const TRUTH_QUESTIONS: MultiSelectQuestion[] = [
  {
    prompt: 'Con `edad = 18` (un `number`) y `tieneEntrada = false`, ¿cuáles de estas expresiones dan `true`? Marcá todas las que correspondan.',
    options: [
      {
        text: '`edad > 18`',
        correct: false,
        why: '`>` es estricto: 18 no es mayor que 18. Para incluir el 18 hace falta `>=`.',
      },
      {
        text: '`edad >= 18 || tieneEntrada`',
        correct: true,
        why: 'Con `||` alcanza con que una de las dos sea verdadera, y `edad >= 18` lo es.',
      },
      {
        text: "`edad === '18'`",
        correct: false,
        why: '`===` compara también el tipo: `18` es un `number` y `\'18\'` es un `string`, así que nunca son iguales.',
      },
      {
        text: '`!tieneEntrada`',
        correct: true,
        why: '`!` invierte el valor: `tieneEntrada` es `false`, así que `!tieneEntrada` es `true`.',
      },
      {
        text: '`edad >= 18 && tieneEntrada`',
        correct: false,
        why: 'Con `&&` las dos tienen que ser verdaderas, y `tieneEntrada` es `false`.',
      },
      {
        text: '`edad >= 18`',
        correct: true,
        why: '`>=` incluye el propio valor: 18 es mayor o igual que 18.',
      },
    ],
  },
];

function exprVariants(...expressions: string[]): string[] {
  return expressions.flatMap((e) => [e, e + ';', e.replace(/ /g, ''), e.replace(/ /g, '') + ';']);
}
export const ARITH_STEPS: TerminalStep[] = [
  {
    instruction: "En la consola existe const stock = '12', que llegó como texto desde un formulario. Mostrá cuánto queda en stock si entran 5 unidades más, como número.",
    accepted: exprVariants('Number(stock) + 5'),
    hint: "Con stock + 5 el resultado sería el texto '125': primero hay que convertir stock a número.",
    output: '17',
  },
  {
    instruction: 'Existe const mesas = 7. Escribí la expresión que da true si la cantidad de mesas es par.',
    accepted: exprVariants('mesas % 2 === 0'),
    hint: 'Un número es par cuando el resto de dividirlo por 2 es 0, y la comparación exacta usa tres signos.',
    output: 'false',
  },
  {
    instruction: 'Existen const envio = 10.10 y const seguro = 20.20. Sumalos redondeando el resultado a dos decimales.',
    accepted: exprVariants('Math.round((envio + seguro) * 100) / 100'),
    hint: 'Multiplicá la suma por 100, redondeala con Math.round y dividí el resultado por 100.',
    output: '30.3',
  },
  {
    instruction: "Existe const codigo = '', un código de descuento que la persona dejó vacío. Negalo con ! para ver cómo se comporta en una condición.",
    accepted: exprVariants('!codigo'),
    hint: 'Es el operador de negación delante del nombre de la variable.',
    output: 'true',
  },
];
export const ARITH_EXPLANATION =
  "Un texto que representa un número se convierte con `Number(...)` antes de sumarlo; `%` da el resto, y con `=== 0` dice si la división es exacta. Sin redondear, `envio + seguro` da `30.299999999999997`. Y `!codigo` da `true` porque el texto vacío es falsy: en una condición se comporta como `false`, igual que `0` o `null`.";
