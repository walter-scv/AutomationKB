import type {CodeLine} from '@site/src/components/FindInCode';
import type {QuizQuestion} from '@site/src/components/Quiz';

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

export const PRACTICE_RULE_LABELS = [
  'Usa `||` cuando las dos condiciones tienen que cumplirse',
  'Niega solo una parte de una condición compuesta',
  'Mezcla `&&` y `||` sin paréntesis, y no se lee qué se evalúa primero',
];

export const PRACTICE_LINES: CodeLine[] = [
  {
    code: 'const puedeContactar = tieneEmail && tieneTelefono || tieneDireccion;',
    rule: 3,
    why: 'Con `&&` y `||` mezclados, el resultado técnico es `(tieneEmail && tieneTelefono) || tieneDireccion`, pero quien lee tiene que recordar la precedencia para saberlo. Con paréntesis, la intención queda escrita.',
    hint: '¿Esta línea deja claro, sin recordar precedencias, cuál de las tres condiciones alcanza?',
  },
  {
    code: 'const puedeComprar = (edadValida && tieneDni) || esMenorConTutor;',
    rule: 0,
    why: 'Los paréntesis muestran que la primera opción exige las dos primeras condiciones y la segunda es una alternativa aparte. Sin ellos el resultado sería el mismo, pero acá la lectura no depende de la precedencia.',
  },
  {
    code: 'const sinDatosDeContacto = !tieneEmail && tieneTelefono;',
    rule: 2,
    why: 'El nombre dice "sin datos de contacto", pero la expresión solo exige que falte el email y que haya teléfono: da `true` justo cuando sí hay un dato de contacto. Falta negar también el teléfono.',
    hint: '¿Qué pasa con alguien que no tiene email pero sí teléfono?',
  },
  {
    code: 'const edadEnRango = edad > 18 || edad < 65;',
    rule: 1,
    why: 'Estar "en rango" pide las dos condiciones a la vez, pero `||` alcanza con una: una persona de 10 años cumple `< 65` y una de 80 cumple `> 18`, así que casi cualquier edad entra. Acá correspondía `&&`.',
    hint: '¿Qué edades hacen verdadera esta expresión: las que están dentro del rango, o casi todas?',
  },
  {
    code: 'const puedeReintentar = !bloqueado && intentos < 3;',
    rule: 0,
    why: 'La negación es correcta: se reintenta solo si no está bloqueado y quedan intentos. `&&` exige las dos condiciones y los dos lados son booleanos.',
  },
  {
    code: 'const alerta = !pedido.pagado && pedido.vencido || pedido.cancelado;',
    rule: 3,
    why: 'Otra mezcla sin paréntesis: `(!pedido.pagado && pedido.vencido) || pedido.cancelado`. Aunque la precedencia existe, la línea no la muestra, y agregar una condición más puede cambiar el significado sin que se note.',
    hint: '¿Qué parte de la expresión se agrupa con qué, sin mirar la tabla de precedencia?',
  },
  {
    code: 'const accesoTotal = esAdmin && !estaSuspendido;',
    rule: 0,
    why: 'Une dos booleanos con `&&` y niega una sola condición, sin ambigüedad: se necesita ser admin y no estar suspendido. No hay nada que agrupar de nuevo.',
  },
];

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


