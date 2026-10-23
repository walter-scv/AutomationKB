import type {CodeLine} from '@site/src/components/FindInCode';

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

export const PRACTICE_RULE_LABELS = [
  'Usa un índice manual donde `for...of` alcanza',
  'Modifica el array mientras lo recorre con `for...of`',
  'Es un loop infinito: la condición nunca se vuelve falsa',
];

export const PRACTICE_LINES: CodeLine[] = [
  {
    code: 'let intentos = 0;\nwhile (intentos <= 3) {\n  if (intentos === 2) {\n    continue;\n  }\n  intentos++;\n}',
    rule: 3,
    why: 'Cuando `intentos` llega a 2, el `continue` salta al inicio del `while` sin ejecutar el incremento; la condición sigue verdadera con el mismo valor y el loop queda girando para siempre.',
    hint: '¿Qué instrucción deja de ejecutarse en la vuelta en la que `intentos` vale 2?',
  },
  {
    code: 'for (let i = 0; i < nombres.length; i++) {\n  console.log(nombres[i]);\n}',
    rule: 1,
    why: 'El índice se usa solo para llegar al valor, y `for...of` hace ese trabajo sin que haya que escribir el límite ni el incremento. Menos piezas significa menos lugar para un error de uno de más o de menos.',
    hint: '¿El índice se usa para algo además de acceder al elemento?',
  },
  {
    code: 'for (const [indice, nombre] of nombres.entries()) {\n  console.log(indice, nombre);\n}',
    rule: 0,
    why: 'Acá sí hace falta la posición además del valor, y `entries()` entrega las dos cosas juntas sin mantener un contador a mano.',
  },
  {
    code: 'for (const pedido of pedidos) {\n  if (pedido.cancelado) {\n    pedidos.splice(pedidos.indexOf(pedido), 1);\n  }\n}',
    rule: 2,
    why: 'Sacar un elemento del mismo array que se está recorriendo corre las posiciones: el elemento que seguía pasa al lugar del eliminado y `for...of` avanza, así que puede saltearse pedidos.',
    hint: 'Después de sacar un elemento, ¿en qué posición queda el que estaba justo después?',
  },
  {
    code: 'let reintentos = 0;\nwhile (reintentos < 5) {\n  reintentos = reintentos + 1;\n}',
    rule: 0,
    why: 'El contador aumenta en cada vuelta y la condición se vuelve falsa cuando llega a 5. El loop termina aunque el cuerpo solo actualice el contador.',
  },
  {
    code: 'for (let i = 0; i < usuarios.length; i++) {\n  enviarEmail(usuarios[i].email);\n}',
    rule: 1,
    why: 'Igual que el caso de `nombres`: el índice no aporta nada que `for...of` no dé. `for (const usuario of usuarios)` evita el límite y el incremento manuales.',
    hint: '¿El índice se usa para algo además de acceder al elemento?',
  },
  {
    code: 'const pendientes = [...pedidos];\nfor (const pedido of pendientes) {\n  if (pedido.cancelado) {\n    pendientes.splice(pendientes.indexOf(pedido), 1);\n  }\n}',
    rule: 2,
    why: 'La copia evita tocar `pedidos`, pero el loop recorre `pendientes`, que es justamente el array que se está modificando: el salto de posiciones sigue pasando.',
    hint: '¿El array que se recorre es el mismo que se modifica, aunque sea una copia?',
  },
  {
    code: 'for (const pedido of pedidos) {\n  if (!pedido.pagado) {\n    continue;\n  }\n  await test.step(\'2. despachar pedido\', async () => {\n    await despachar(pedido);\n  });\n}',
    rule: 0,
    why: 'El `continue` solo saltea un elemento sin modificar la lista ni la cantidad de vueltas; el loop termina cuando se acaban los pedidos, y el `test.step` no altera ese recorrido.',
  },
];


