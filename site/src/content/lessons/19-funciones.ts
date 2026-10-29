import type {DecisionNode} from '@site/src/components/DecisionPath';
import type {CodeLine} from '@site/src/components/FindInCode';
import type {FillBlankSlot} from '@site/src/components/FillBlank';
import type {MultiSelectQuestion} from '@site/src/components/MultiSelect';
import type {TerminalStep} from '@site/src/components/Terminal';

export const RETURN_RULE_LABELS = [
  'El tipo de retorno declarado no coincide con el tipo del valor que devuelve',
  'Devuelve en un camino y en otro no, así que a veces llega `undefined`',
  'Falta el `return`: la función calcula un resultado pero no lo entrega',
];

export const RETURN_LINES: CodeLine[] = [
  {
    code: 'function esEmailValido(email: string): boolean {\n  const tieneArroba = email.includes(\'@\');\n}',
    rule: 3,
    why: 'La función calcula `tieneArroba` y termina sin `return`: el valor se descarta y quien la llama no recibe nada. El cálculo está bien; lo que falta es entregarlo.',
    hint: '¿Dónde termina el valor de `tieneArroba` cuando la función se cierra?',
  },
  {
    code: 'function buscarUsuario(id: string): Usuario | undefined {\n  return usuarios.find((usuario) => usuario.id === id);\n}',
    rule: 0,
    why: '`find` devuelve un `Usuario` o `undefined`, y la firma lo declara exactamente así. El `return` está y el tipo contempla el caso de no encontrarlo.',
  },
  {
    code: "function contarPendientes(pedidos: Pedido[]): number {\n  return pedidos.filter((pedido) => pedido.estado === 'pendiente').length.toString();\n}",
    rule: 1,
    why: 'El `return` entrega un string por el `.toString()`, mientras la firma promete `number`. TypeScript marca el error en el `return`, y quien llame esperando un número va a terminar operando con texto.',
    hint: '¿Qué tipo tiene el valor que sale de esa expresión comparado con el que declara la firma?',
  },
  {
    code: 'function calcularDescuento(total: number, esCliente: boolean): number {\n  if (esCliente) {\n    return total * 0.9;\n  }\n}',
    rule: 2,
    why: 'Cuando `esCliente` es `false` no hay `return`, así que la función termina en un camino sin entregar nada. El problema es que solo devuelve en uno de los dos recorridos posibles.',
    hint: '¿Qué devuelve esta función cuando la condición del `if` no se cumple?',
  },
  {
    code: 'function esPedidoGrande(total: number): boolean {\n  if (total > 10000) {\n    return true;\n  }\n  return false;\n}',
    rule: 0,
    why: 'Tiene `return` en los dos caminos, así que siempre entrega un booleano. Se podría escribir en una sola línea, pero eso es una simplificación de estilo: no rompe ninguna regla de retorno.',
  },
  {
    code: "function armarSaludo(nombre: string): string {\n  const saludo = 'Hola, ' + nombre;\n}",
    rule: 3,
    why: 'Arma el saludo y lo guarda, pero nunca lo devuelve. La llamada que espera un string recibe `undefined`, y el trabajo hecho adentro se pierde.',
    hint: '¿El saludo armado sale de la función en algún momento?',
  },
  {
    code: "function validarEdad(edad: number): string {\n  return edad >= 18 ? 'adulto' : 'menor';\n}",
    rule: 0,
    why: 'El operador ternario devuelve un valor en los dos casos, así que la función siempre entrega un string. No hay ningún camino que termine sin `return`.',
  },
];

export const RELIABLE_QUESTIONS: MultiSelectQuestion[] = [
  {
    prompt: '¿Cuáles de estas funciones están bien diseñadas: reciben por parámetro todo lo que usan, no modifican lo que reciben, tienen pocos parámetros y un nombre que dice qué hacen? Marcá todas las que cumplan.',
    options: [
      {text: '`procesar(datos)` devuelve cuántos pedidos están pendientes.', correct: false, why: 'Funciona, pero el nombre no dice qué hace: quien la llama tiene que leer el cuerpo. `contarPendientes(pedidos)` lo diría solo.'},
      {text: '`calcularTotal(precio, cantidad)` devuelve `precio * cantidad`.', correct: true, why: 'Usa solo lo que recibe, no modifica nada y el nombre dice qué calcula.'},
      {text: '`calcularTotal(precio, cantidad)` aplica un 10% si la variable de afuera `descuentoActivo` está en `true`.', correct: false, why: 'Depende de algo que no recibió: con los mismos parámetros puede dar resultados distintos según cómo esté esa variable.'},
      {text: '`aplicarDescuento(pedido)` hace `pedido.total = pedido.total * 0.9` y no devuelve nada.', correct: false, why: 'Modifica el objeto que recibió: quien lo llamó ve cambiar su pedido "por abajo". Conviene devolver un pedido nuevo.'},
      {text: "`crearPedido(datos)` devuelve un objeto nuevo `{...datos, estado: 'pendiente'}`.", correct: true, why: 'Recibe todo lo que usa en un solo objeto y devuelve uno nuevo, sin tocar el original.'},
      {text: '`registrarEnvio(nombre, calle, ciudad, codigoPostal, email)` recibe cinco `string` sueltos.', correct: false, why: 'Cinco `string` seguidos se pueden pasar en otro orden sin que nada avise: conviene agruparlos en un objeto.'},
      {text: '`contarActivos(usuarios)` devuelve cuántos usuarios tienen `activo` en `true`.', correct: true, why: 'Nombre claro, un solo parámetro y no modifica la lista: usa `filter`, que devuelve un array nuevo.'},
    ],
  },
];

export const SHIPPING_TEMPLATE =
  "function etiquetarEnvio(peso: {{ptype}}): {{rtype}} {\n  if (peso > 20) {\n    return 'pesado';\n  }\n  {{kw}} 'estándar';\n}";
export const SHIPPING_SLOTS: FillBlankSlot[] = [
  {id: 'ptype', answer: 'number'},
  {id: 'rtype', answer: 'string'},
  {id: 'kw', answer: 'return'},
];
export const SHIPPING_BANK = ['void', 'number', 'console.log', 'string', 'return', 'boolean'];
export const SHIPPING_EXPLANATION =
  'El peso es una cantidad, así que el parámetro es `number`. Lo que la función entrega es un texto (`\'pesado\'` o `\'estándar\'`), así que el tipo de retorno es `string`: `void` diría que no devuelve nada y `boolean` que responde sí o no. Y el último camino también necesita `return`: `console.log` muestra el texto en la consola, pero no se lo entrega a quien llamó a la función — en ese camino recibiría `undefined`.';

/** Variantes de una llamada: comillas simples o dobles, con o sin espacio tras la coma, con o sin `;`. */
function callVariants(fn: string, text: string, numbers: number[], prefix = ''): string[] {
  return numbers.flatMap((n) =>
    [`'${text}'`, `"${text}"`].flatMap((q) =>
      [`${fn}(${q}, ${n})`, `${fn}(${q},${n})`].flatMap((call) => [prefix + call, prefix + call + ';']),
    ),
  );
}
const MORNING = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
const AFTERNOON = [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];

export const CALL_STEPS: TerminalStep[] = [
  {
    instruction: "Ya existe crearSaludo(nombre, hora), la de la teoría. Llamala para que devuelva 'Buen día, Ana'.",
    accepted: callVariants('crearSaludo', 'Ana', MORNING),
    hint: 'Primero el nombre (entre comillas) y después una hora en la que la función devuelve "Buen día".',
    output: "'Buen día, Ana'",
  },
  {
    instruction: "Ahora llamala para que devuelva 'Buenas tardes, Ana'.",
    accepted: callVariants('crearSaludo', 'Ana', AFTERNOON),
    hint: 'Mirá la condición de la función: ¿desde qué hora deja de ser "Buen día"?',
    output: "'Buenas tardes, Ana'",
  },
  {
    instruction: "Probá qué pasa si pasás los argumentos al revés: primero la hora 9 y después el nombre 'Ana'.",
    accepted: ["crearSaludo(9, 'Ana')", 'crearSaludo(9, "Ana")', "crearSaludo(9,'Ana')", 'crearSaludo(9,"Ana")', "crearSaludo(9, 'Ana');", 'crearSaludo(9, "Ana");'],
    hint: 'Es la misma función, con el 9 primero y el nombre después.',
    output: "error TS2345: Argument of type 'number' is not assignable to parameter of type 'string'.",
  },
  {
    instruction: "Guardá en la constante saludo el resultado para 'Beto' a las 10.",
    accepted: callVariants('crearSaludo', 'Beto', [10], 'const saludo = '),
    hint: 'Es `const saludo = ` seguido de la llamada con los argumentos en el orden correcto.',
    output: "undefined   // la declaración no imprime nada; saludo ahora vale 'Buen día, Beto'",
  },
];
export const CALL_EXPLANATION =
  'Los argumentos se pasan en el mismo orden que los parámetros: primero el nombre, después la hora. Al invertirlos, TypeScript avisa antes de ejecutar porque el tipo no coincide. Y el valor que devuelve la función se puede usar directo o guardar en una variable.';

export const LABEL_START = 'firma';
export const LABEL_NODES: Record<string, DecisionNode> = {
  firma: {
    id: 'firma',
    situation: 'Vas a escribir `armarEtiqueta`, que recibe el nombre del destinatario y la sucursal de despacho. Casi todos los envíos salen de la sucursal «Central». ¿Qué firma conviene?',
    options: [
      {text: '`function armarEtiqueta(sucursal: string = \'Central\', nombre: string): string`', correct: false, why: 'Los argumentos se asignan por posición: con el valor por defecto primero, para pasar el nombre igual habría que escribir algo en el lugar de la sucursal. Los parámetros con valor por defecto van al final.'},
      {text: '`function armarEtiqueta(nombre: string, sucursal?: string): string`, y usar `sucursal` directamente.', correct: false, why: 'Un parámetro opcional que no se pasa vale `undefined`: sin contemplarlo, la etiqueta diría «undefined».'},
      {text: '`function armarEtiqueta(nombre: string, sucursal: string = \'Central\'): string`', correct: true, why: 'Hay un valor razonable para cuando no se pasa nada, y el parámetro va al final: `armarEtiqueta(\'Rosa Díaz\')` ya funciona.', next: 'alcance'},
    ],
  },
  alcance: {
    id: 'alcance',
    situation: 'Dentro de la función armás `const texto = ...`. Después de llamarla, otra parte del código necesita ese texto para imprimirlo. ¿Cómo lo obtiene?',
    options: [
      {text: 'Devolviéndolo con `return texto` y guardando el resultado al llamar: `const etiqueta = armarEtiqueta(\'Rosa Díaz\');`.', correct: true, why: 'Lo que se declara adentro no existe afuera; la forma de sacar un valor de una función es devolverlo.', next: 'arrow'},
      {text: 'Usando `texto` después de la llamada, porque la función ya lo creó.', correct: false, why: '`texto` existe solo mientras la función se ejecuta: afuera, TypeScript informa que no encuentra ese nombre.'},
      {text: 'Declarando `let texto` afuera de la función y asignándolo adentro.', correct: false, why: 'Funciona, pero la función pasa a depender de una variable externa y a modificarla: es más difícil de probar y otra función podría pisarla.'},
    ],
  },
  arrow: {
    id: 'arrow',
    situation: 'El equipo escribe estas funciones como arrow functions. ¿Cuál es equivalente a la tuya?',
    options: [
      {text: '`const armarEtiqueta = (nombre: string, sucursal: string = \'Central\'): string => { nombre + \' · \' + sucursal };`', correct: false, why: 'Con llaves, la arrow function necesita `return`: así no devuelve nada (en TypeScript, además, no cumple el tipo de retorno `string`).'},
      {text: '`const armarEtiqueta = (nombre: string, sucursal: string = \'Central\'): string => nombre + \' · \' + sucursal;`', correct: true, why: 'El cuerpo es una sola expresión: sin llaves, la arrow function devuelve su valor sin escribir `return`.', next: 'prueba'},
      {text: '`const armarEtiqueta(nombre: string, sucursal: string = \'Central\'): string => nombre + \' · \' + sucursal;`', correct: false, why: 'Falta el `=` y los paréntesis forman parte de la función, no del nombre: es un error de sintaxis.'},
    ],
  },
  prueba: {
    id: 'prueba',
    situation: 'La función está lista. ¿Qué llamadas tiene que incluir la prueba para cubrir sus caminos?',
    options: [
      {text: 'Una sola: `armarEtiqueta(\'Rosa Díaz\', \'Norte\')`.', correct: false, why: 'Nunca usa el valor por defecto: si «Central» estuviera mal escrito, ninguna prueba lo vería.'},
      {text: '`armarEtiqueta(\'Rosa Díaz\')` y `armarEtiqueta(\'Rosa Díaz\', \'Norte\')`.', correct: true, why: 'Una ejercita el valor por defecto y la otra el valor pasado: son los dos comportamientos de la firma.'},
      {text: '`armarEtiqueta(\'Rosa Díaz\', \'Norte\', \'urgente\')`, para ver qué hace con un argumento de más.', correct: false, why: 'No llega a ejecutarse: TypeScript lo rechaza antes (TS2554, cantidad de argumentos incorrecta). No es un caso de prueba de la función.'},
    ],
  },
};
export const LABEL_EXPLANATION =
  'El valor por defecto va al final y cubre el caso habitual; lo que la función calcula sale con `return`, no por una variable externa; la arrow function de una sola expresión devuelve sin `return`; y la prueba cubre tanto el valor por defecto como el pasado.';
