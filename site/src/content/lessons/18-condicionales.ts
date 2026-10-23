import type {CodeLine} from '@site/src/components/FindInCode';
import type {QuizQuestion} from '@site/src/components/Quiz';

export const CONDITIONAL_RULE_LABELS = [
  'Repite en el `else if` la condición negada que ya cubría el `else`',
  'Anida `if` en vez de combinar las condiciones o usar `else if`',
];

export const CONDITIONAL_LINES: CodeLine[] = [
  {
    code: 'if (pago.aprobado) {\n  if (pago.monto === pedido.total) {\n    despacharPedido(pedido);\n  }\n}',
    rule: 2,
    why: 'Las dos verificaciones son requisitos del mismo envío, pero están en niveles distintos: hay que abrir dos `if` para ver que ambas tienen que cumplirse. `if (pago.aprobado && pago.monto === pedido.total)` dice lo mismo en una sola condición.',
    hint: '¿Cuántos niveles hay que leer para darse cuenta de que las dos condiciones tienen que cumplirse?',
  },
  {
    code: "if (stock === 0) {\n  mostrarAgotado();\n} else if (stock < 3) {\n  mostrarUltimasUnidades();\n} else {\n  habilitarCompra();\n}",
    rule: 0,
    why: 'Cada rama cubre un rango distinto que las anteriores ya descartaron, y el `else` final no repite ninguna condición. Es un uso correcto de `else if`, aunque el orden no sea el de menor a mayor.',
  },
  {
    code: 'if (usuario.registrado) {\n  enviarBienvenida();\n} else if (!usuario.registrado) {\n  ofrecerRegistro();\n}',
    rule: 1,
    why: 'Cuando el primer `if` da falso, ya se sabe que `usuario.registrado` es falso: la condición del `else if` es su negación exacta y siempre entra. Un `else` simple cubre ese caso sin volver a comparar.',
    hint: '¿Qué casos pueden llegar al `else if` después de evaluar el `if`?',
  },
  {
    code: 'if (usuario.activo) {\n  if (usuario.emailVerificado) {\n    enviarRecordatorio(usuario);\n  }\n}',
    rule: 2,
    why: 'El recordatorio depende de dos condiciones que se cumplen juntas; anidarlas esconde la segunda detrás de la primera. Combinadas con `&&`, la regla completa se lee de una vez.',
    hint: '¿La segunda condición se entiende sola, o depende de haber leído la primera?',
  },
  {
    code: "if (nota >= 4 && nota <= 7) {\n  resultado = 'Aprobado';\n} else if (nota > 7) {\n  resultado = 'Excelente';\n} else {\n  resultado = 'Insuficiente';\n}",
    rule: 0,
    why: 'La primera condición cubre de 4 a 7; el `else if` cubre lo que quedó arriba y el `else` lo que quedó abajo. Los tres casos son excluyentes y ninguno repite una comparación anterior.',
  },
  {
    code: "if (estado === 'pendiente') {\n  mostrarPendiente();\n} else if (estado !== 'pendiente') {\n  mostrarResuelto();\n}",
    rule: 1,
    why: '`!== \'pendiente\'` es el complemento exacto de la primera condición: si el `if` no entró, este `else if` entra siempre. El `else` ya expresa ese caso sin escribir la comparación otra vez.',
    hint: '¿Puede darse una situación en la que no entre ninguna de las dos ramas?',
  },
  {
    code: 'if (!usuario.activo) {\n  bloquearAcceso();\n}',
    rule: 0,
    why: 'Acá la negación no complica nada: no hay otra rama que poner primero, y salir temprano cuando el usuario no está activo es más directo que anidar el caso normal.',
  },
];

export const PRACTICE_RULE_LABELS = [
  'Deja una rama `else` vacía que se puede borrar',
  'Asigna `true`/`false` con `if/else` en vez de usar la comparación directo',
  'Niega la condición y complica la lectura cuando se podría invertir',
];

export const PRACTICE_LINES: CodeLine[] = [
  {
    code: 'if (!pedido.pagado) {\n  mostrarBotonPagar();\n} else {\n  mostrarConfirmacion();\n}',
    rule: 3,
    why: 'Para entender el caso habitual hay que leer primero una negación y después el `else`. Invertir las ramas pone el caso positivo en el `if`: `if (pedido.pagado) { mostrarConfirmacion(); } else { mostrarBotonPagar(); }`.',
    hint: '¿Cuántas veces hay que negar mentalmente la condición para entender la rama principal?',
  },
  {
    code: "const puedeCancelar = estado === 'pendiente' && horasDesdeCompra < 24;",
    rule: 0,
    why: 'Combina dos condiciones del mismo tipo con `&&`; las dos son necesarias y no hay negaciones ni un `if/else` de más. El nombre describe la regla completa.',
  },
  {
    code: 'let clienteNuevo: boolean;\nif (pedidosDelCliente.length === 0) {\n  clienteNuevo = true;\n} else {\n  clienteNuevo = false;\n}',
    rule: 2,
    why: 'Las dos ramas asignan exactamente el resultado de la comparación y su negación. `const clienteNuevo = pedidosDelCliente.length === 0;` produce el mismo booleano sin cuatro líneas que mantener.',
    hint: '¿Qué diferencia hay entre el valor que asigna la primera rama y el de la segunda?',
  },
  {
    code: 'if (usuario.activo) {\n  mostrarPanel(usuario);\n} else {\n  // el usuario inactivo no tiene panel\n}',
    rule: 1,
    why: 'La rama `else` no ejecuta nada: borrarla deja el mismo comportamiento y una sola rama que leer. Un comentario que explica por qué no hay nada no cambia el flujo.',
    hint: '¿Qué cambia en el programa si se borra todo el `else`?',
  },
  {
    code: 'if (total === 0) {\n  mostrarCarritoVacio();\n} else {\n  habilitarCheckout();\n}',
    rule: 0,
    why: 'Cada rama hace algo distinto y necesario; no hay ninguna asignación booleana ni una negación que invertir. Es la forma directa de manejar dos casos.',
  },
  {
    code: 'if (!usuario.activo) {\n  bloquearAcceso();\n} else {\n  mostrarPanel();\n}',
    rule: 3,
    why: 'La condición negada obliga a leer el `else` para encontrar el caso normal. Con `if (usuario.activo) { mostrarPanel(); } else { bloquearAcceso(); }` la rama principal se entiende sin dar vuelta la condición.',
    hint: '¿La rama que más se usa quedó expresada en positivo, o hay que pasar por el `else` para encontrarla?',
  },
  {
    code: 'const bloqueado = intentosFallidos >= 3;',
    rule: 0,
    why: 'La comparación ya devuelve un booleano y se asigna directo, sin `if/else`. El nombre `bloqueado` describe el valor resultante.',
  },
];

export const CLOSING_QUIZ: QuizQuestion[] = [
  {
    question:
      'Con `if (nota < 4) { ... } else if (nota <= 7) { ... } else { ... }`, un test ingresa la nota `7`. ¿Qué rama se ejecuta?',
    options: [
      {
        text: 'La primera: `7` no es menor que `4`, así que entra por el `if`.',
        correct: false,
        why: '`7` no cumple `nota < 4`, así que la primera rama no se ejecuta. La confusión aparece al leer la condición al revés.',
      },
      {
        text: 'La tercera: `7` no es menor que `4` ni menor o igual que `7`.',
        correct: false,
        why: '`7 <= 7` es verdadero, así que la segunda rama sí lo toma. La tercera solo recibe valores mayores que 7.',
      },
      {
        text: 'La segunda: `7` no es menor que `4`, pero sí cumple `nota <= 7`.',
        correct: true,
        why: 'El primer `if` descarta la nota por abajo; el `else if` toma el valor porque `7` está incluido en `<= 7`. El `else` queda solo para las notas mayores a 7.',
      },
    ],
  },
  {
    question:
      '`if (pagoAprobado) { if (stockDisponible) { enviarPedido(); } } else { cancelarPedido(); }` — ¿qué pasa si el pago está aprobado pero no hay stock?',
    options: [
      {
        text: 'Se cancela el pedido, porque el `else` también cubre ese caso.',
        correct: false,
        why: 'El `else` pertenece al `if` externo: solo se ejecuta cuando `pagoAprobado` es falso. Con el pago aprobado y sin stock no hay ninguna rama que se ejecute.',
      },
      {
        text: 'No se ejecuta ninguna de las dos acciones.',
        correct: true,
        why: 'El `if` externo entra, pero el interno no, y no hay un `else` para el interno. Ese hueco es el riesgo de anidar `if` sin cubrir todos los caminos: con el pago aprobado y sin stock, el pedido no se envía ni se cancela.',
      },
      {
        text: 'Se envía el pedido igual, porque el pago ya está aprobado.',
        correct: false,
        why: 'La acción de enviar está dentro del segundo `if`, que exige stock. Sin stock, el envío no se ejecuta aunque el pago esté aprobado.',
      },
    ],
  },
];


