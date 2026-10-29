import type {CodeLine} from '@site/src/components/FindInCode';
import type {QuizQuestion} from '@site/src/components/Quiz';
import type {DecisionNode} from '@site/src/components/DecisionPath';
import type {MatchItem} from '@site/src/components/Match';

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

export const SIMPLIFY_LEFT: MatchItem[] = [
  {id: 'emptyelse', text: '`if (usuario.activo) { mostrarPanel(usuario); } else { }`'},
  {id: 'boolassign', text: '`let esNuevo: boolean; if (pedidos.length === 0) { esNuevo = true; } else { esNuevo = false; }`'},
  {id: 'negated', text: '`if (!pedido.pagado) { mostrarBotonPagar(); } else { mostrarConfirmacion(); }`'},
  {id: 'boolreturn', text: '`if (edad >= 18) { return true; } return false;`'},
];
export const SIMPLIFY_RIGHT: MatchItem[] = [
  {id: 'boolreturn', text: '`return edad >= 18;`'},
  {id: 'negated', text: '`if (pedido.pagado) { mostrarConfirmacion(); } else { mostrarBotonPagar(); }`'},
  {id: 'emptyelse', text: '`if (usuario.activo) { mostrarPanel(usuario); }`'},
  {id: 'boolassign', text: '`const esNuevo = pedidos.length === 0;`'},
];
export const SIMPLIFY_WHY: Record<string, string> = {
  emptyelse: 'Un `else` vacío no hace nada: se borra y el comportamiento es el mismo.',
  boolassign: 'La comparación ya da `true` o `false`: se asigna directo, y además puede ser `const`.',
  negated: 'Invertir la condición saca el `!` y deja primero el caso "positivo", sin cambiar qué se ejecuta en cada caso.',
  boolreturn: 'Igual que al asignar: si la condición ya es el booleano que se quiere, se devuelve directo.',
};

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

export const GRADE_START = 'nota4';
export const GRADE_NODES: Record<string, DecisionNode> = {
  nota4: {
    id: 'nota4',
    situation: 'Con `nota = 4`, ¿qué queda guardado en `resultado`?',
    options: [
      {
        text: '`Desaprobado`',
        correct: false,
        why: '`<` es "menor estricto": `4 < 4` es falso, porque 4 no es menor que sí mismo. Entonces no entra en la primera rama.',
      },
      {
        text: '`Aprobado`',
        correct: true,
        why: '`4 < 4` es falso, así que se evalúa la siguiente: `4 <= 7` es verdadero y entra ahí.',
        next: 'nota7',
      },
      {
        text: '`Promocionado`',
        correct: false,
        why: 'El `else` final solo se ejecuta si ninguna condición anterior fue verdadera. Revisá qué pasa con la segunda.',
      },
    ],
  },
  nota7: {
    id: 'nota7',
    situation: 'Ahora con `nota = 7`, ¿qué queda guardado en `resultado`?',
    options: [
      {
        text: '`Promocionado`',
        correct: false,
        why: '`<=` incluye el propio valor: `7 <= 7` es verdadero. No hace falta llegar al `else`.',
      },
      {
        text: '`Desaprobado`',
        correct: false,
        why: '`7 < 4` es falso, así que no entra en la primera rama.',
      },
      {
        text: '`Aprobado`',
        correct: true,
        why: '`7 < 4` es falso y `7 <= 7` es verdadero: `<=` significa "menor o igual", así que el 7 entra.',
        next: 'nota9',
      },
    ],
  },
  nota9: {
    id: 'nota9',
    situation: 'Por último, con `nota = 9`, ¿qué queda guardado en `resultado`?',
    options: [
      {
        text: '`Promocionado`',
        correct: true,
        why: 'Ni `9 < 4` ni `9 <= 7` son verdaderas, así que cae al `else` final.',
      },
      {
        text: '`Aprobado`',
        correct: false,
        why: '`nota <= 7` pide que la nota sea 7 o menos — 9 no cumple esa condición.',
      },
      {
        text: 'Ninguno: `resultado` queda vacío',
        correct: false,
        why: 'Una cadena que termina en `else` siempre ejecuta alguna rama: si ninguna condición es verdadera, se ejecuta el `else`.',
      },
    ],
  },
};
export const GRADE_EXPLANATION =
  'Las condiciones se evalúan de arriba hacia abajo y se ejecuta solo la primera verdadera. En los límites manda el operador: `4 < 4` es falso (por eso el 4 aprueba) y `7 <= 7` es verdadero (por eso el 7 todavía no promociona). Y como la cadena termina en `else`, siempre se ejecuta alguna rama.';

export const SWITCH_CODE = `const plan = 'pro';
let mensaje = '';

switch (plan) {
  case 'basico':
    mensaje += 'A';
    break;
  case 'pro':
    mensaje += 'B';
  case 'empresa':
    mensaje += 'C';
    break;
  default:
    mensaje += 'D';
}

const etiqueta = mensaje.length > 1 ? 'doble' : 'simple';
console.log(mensaje, etiqueta);`;
export const SWITCH_ACCEPTED = ['BC doble', 'BC, doble', "'BC' 'doble'"];
export const SWITCH_HINTS = [
  'Seguí el switch: ¿con qué case coincide plan, y qué hay al final de ese case?',
  "En el case 'pro' falta el break: la ejecución sigue con el case siguiente aunque no coincida.",
  'mensaje termina con dos letras. Con eso, resolvé el ternario: ¿la condición es verdadera o falsa?',
];
export const SWITCH_EXPLANATION =
  "`plan` coincide con `'pro'` y se agrega `B`; como ese `case` no tiene `break`, sigue con el de `'empresa'` y agrega `C`, y ahí sí corta. `mensaje` queda `'BC'`, su largo es 2 y el ternario elige `'doble'`. Un `break` olvidado es exactamente esto: dos acciones donde se esperaba una.";
