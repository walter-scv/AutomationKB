import type {CodeLine} from '@site/src/components/FindInCode';
import type {MatchItem} from '@site/src/components/Match';
import type {OrderItem} from '@site/src/components/Order';
import type {OrderRule} from '@site/src/components/Order';

export const LOOP_RULE_LABELS = [
  'La condición ya es falsa al empezar, y el cuerpo no se ejecuta nunca',
  'Es un loop infinito: nada adentro cambia la condición',
];

export const LOOP_LINES: CodeLine[] = [
  {
    code: "let reintentos = 0;\nwhile (reintentos < 3) {\n  console.log('Reintentando...');\n  reintentos = reintentos - 1;\n}",
    rule: 2,
    why: 'El contador se actualiza, pero hacia el otro lado: pasa a -1, -2, y siempre sigue siendo menor que 3. La condición nunca se vuelve falsa y el loop no termina.',
    hint: '¿Cada vuelta acerca el contador al valor que corta el loop, o lo aleja?',
  },
  {
    code: 'let intentos = 0;\nwhile (intentos < 3) {\n  intentos++;\n  console.log(intentos);\n}',
    rule: 0,
    why: 'El incremento va en la dirección correcta: 1, 2, 3, y en la cuarta evaluación `intentos < 3` ya es falso. El loop termina solo, aunque el contador se actualice antes del `console.log`.',
  },
  {
    code: 'let pendientes = 0;\nwhile (pendientes > 0) {\n  procesarSiguiente();\n  pendientes--;\n}',
    rule: 1,
    why: 'La variable arranca en 0 y la condición pide un valor mayor que 0: la primera evaluación ya es falsa, así que el cuerpo no se ejecuta ni una vez. No es infinito, es un loop que nunca corre.',
    hint: '¿Con qué valor arranca la variable que aparece en la condición?',
  },
  {
    code: 'async cancelarPedidos(): Promise<void> {\n  const filas = await this.page.locator(\'[data-context="order-row"]\').all();\n  for (const fila of filas) {\n    await fila.locator(\'[data-action="cancel-order"]\').click();\n  }\n}',
    rule: 0,
    why: '`all()` devuelve un array finito de filas; `for...of` termina cuando se acaban y no hay ninguna condición externa que pueda quedar fija. El `async/await` no cambia la cantidad de vueltas.',
  },
  {
    code: 'let indice = 0;\nwhile (indice < pedidos.length) {\n  console.log(pedidos[indice]);\n  indice + 1;\n}',
    rule: 2,
    why: '`indice + 1` calcula un número pero no lo guarda en ningún lado: `indice` sigue en 0 en cada vuelta. La condición se mantiene verdadera y el loop no termina.',
    hint: '¿La línea que sigue al `console.log` deja el nuevo valor guardado en alguna variable?',
  },
  {
    code: 'let indice = 0;\nwhile (indice < pedidos.length) {\n  console.log(pedidos[indice]);\n  indice += 1;\n}',
    rule: 0,
    why: 'Casi igual al anterior, pero acá el resultado sí se guarda (`indice += 1`), así que el índice avanza hasta el final y el loop termina.',
  },
  {
    code: 'do {\n  intentos++;\n} while (intentos < 3 && !bloqueado);',
    rule: 0,
    why: '`do...while` ejecuta el cuerpo al menos una vez, pero la condición combina dos salidas: el contador llega a 3 o la cuenta se bloquea. En cualquiera de los dos casos el loop termina.',
  },
];

export const SKIP_ORDER_ITEMS: OrderItem[] = [
  {id: 'work', what: 'Línea', code: '  procesar(i);'},
  {id: 'open', what: 'Línea', code: 'while (i < 5) {'},
  {id: 'skip', what: 'Línea', code: '  if (i === 3) continue;'},
  {id: 'close', what: 'Línea', code: '}'},
  {id: 'init', what: 'Línea', code: 'let i = 0;'},
  {id: 'inc', what: 'Línea', code: '  i = i + 1;'},
];
export const SKIP_ORDER_CORRECT = ['init', 'open', 'inc', 'skip', 'work', 'close'];
export const SKIP_ORDER_RULES: OrderRule[] = [
  {before: 'init', after: 'open', why: '`i` tiene que existir antes de que el `while` evalúe `i < 5`.'},
  {before: 'open', after: 'inc', why: 'el incremento es parte del cuerpo: va adentro del `while`.'},
  {before: 'inc', after: 'skip', why: 'si el `continue` va antes del incremento, cuando `i` vale 3 salta la vuelta sin cambiar `i`, y el loop no termina nunca.'},
  {before: 'skip', after: 'work', why: 'si `procesar(i)` va antes del `if`, el 3 se procesa igual: el `continue` tiene que cortar la vuelta antes.'},
  {before: 'work', after: 'close', why: 'la llave cierra el cuerpo del `while`: todo lo que se repite va antes.'},
];

export const TRACE_CODE = `const usuarios = ['ana', '', 'beto', 'carla', 'x'.repeat(40), 'dario'];
let revisados = 0;

for (const usuario of usuarios) {
  if (usuario === '') {
    continue;
  }
  if (usuario.length > 30) {
    break;
  }
  revisados = revisados + 1;
}`;
export const TRACE_ACCEPTED = ['3'];
export const TRACE_HINTS = [
  'Recorré el array elemento por elemento y anotá qué pasa con cada uno: ¿llega a la línea que suma, se saltea, o corta el loop?',
  'Fijate en la diferencia entre `continue` y `break`: con uno el loop sigue con el próximo elemento, con el otro los elementos que quedan ni se miran.',
  'Contá solo las vueltas que llegan hasta `revisados = revisados + 1`. El string vacío no llega, y después del elemento de 40 caracteres no hay más vueltas.',
];
export const TRACE_EXPLANATION =
  "`'ana'` suma (1). `''` entra en el primer `if` y `continue` salta a la siguiente vuelta sin sumar. `'beto'` (2) y `'carla'` (3) suman. El de 40 caracteres entra en el segundo `if` y `break` corta el loop entero: `'dario'` nunca se revisa. Resultado: `3`. Si respondiste 4, contaste a `'dario'` como si `break` fuera `continue`; si respondiste 5 o 6, el string vacío o el largo también llegaron a sumar.";

export const LOOP_MATCH_LEFT: MatchItem[] = [
  {id: 'forof', text: '`for (const x of lista)`'},
  {id: 'while', text: '`while (condición)`'},
  {id: 'dowhile', text: '`do { ... } while (condición)`'},
  {id: 'entries', text: '`for (const [i, x] of lista.entries())`'},
  {id: 'break', text: '`break`'},
  {id: 'continue', text: '`continue`'},
];
export const LOOP_MATCH_RIGHT: MatchItem[] = [
  {id: 'continue', text: 'Saltear el elemento actual y seguir con el próximo.'},
  {id: 'dowhile', text: 'Pedir un dato al menos una vez, y repetir mientras no sea válido.'},
  {id: 'forof', text: 'Revisar cada elemento de una lista, sin importar en qué posición está.'},
  {id: 'break', text: 'Dejar de revisar en cuanto se encontró lo que se buscaba.'},
  {id: 'while', text: 'Reintentar algo sin saber de antemano cuántas veces va a hacer falta.'},
  {id: 'entries', text: 'Mostrar cada elemento de una lista junto con su número de posición.'},
];
export const LOOP_MATCH_WHY: Record<string, string> = {
  forof: '`for...of` da cada elemento de la lista, uno por vuelta, sin manejar índices.',
  while: '`while` repite mientras la condición sea verdadera: sirve cuando la cantidad de vueltas se descubre durante la ejecución.',
  dowhile: '`do...while` ejecuta el cuerpo antes de evaluar la condición, así que corre al menos una vez.',
  entries: '`entries()` devuelve pares `[posición, valor]`: hace falta cuando además del elemento se necesita su índice.',
  break: '`break` corta el loop entero: los elementos que quedan ni se miran.',
  continue: '`continue` termina solo la vuelta actual y el loop sigue con el próximo elemento.',
};
