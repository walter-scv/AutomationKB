import type {MatchItem} from '@site/src/components/Match';
import type {DecisionNode} from '@site/src/components/DecisionPath';
import type {CodeLine} from '@site/src/components/FindInCode';
import type {SpotTokenRound} from '@site/src/components/SpotToken';
import type {QuizQuestion} from '@site/src/components/Quiz';
import type {TerminalStep} from '@site/src/components/Terminal';
import type {FillBlankSlot} from '@site/src/components/FillBlank';

export const COMBINED_RULE_LABELS = [
  'El `catch` oculta el error real en vez de manejarlo',
  'Usa `=` o `==` donde debería ir `===`',
  'Falta `await` antes de una operación asíncrona',
  'Modifica el array/objeto recibido en vez de devolver uno nuevo',
];

export const COMBINED_LINES: CodeLine[] = [
  {
    code: 'function ordenarPorFecha(pedidos: Pedido[]): Pedido[] {\n  pedidos.sort((a, b) => a.fecha.localeCompare(b.fecha));\n  return pedidos;\n}',
    rule: 4,
    why: '`sort` ordena el array original en el lugar: quien pasó `pedidos` descubre que su lista cambió sin pedirlo. Devolver `[...pedidos].sort(...)` ordenaría una copia y dejaría intacto el array recibido.',
    hint: '¿`sort` devuelve una lista nueva o reordena la que ya existe?',
  },
  {
    code: "async function obtenerPedidosDe(usuarioId: string): Promise<Pedido[]> {\n  const respuesta = await fetch('/api/usuarios/' + usuarioId + '/pedidos');\n  return respuesta.json();\n}",
    rule: 0,
    why: 'Espera la respuesta antes de leerla, y devolver `respuesta.json()` desde una función `async` es correcto: la promesa se resuelve con la lista. No modifica ningún dato recibido.',
  },
  {
    code: 'async function resumirPedidos(usuarioId: string): Promise<number> {\n  const pedidos = obtenerPedidosDe(usuarioId);\n  return pedidos.reduce((acc, pedido) => acc + pedido.total, 0);\n}',
    rule: 3,
    why: '`pedidos` es una promesa, no un array: `.reduce` no existe sobre ella y la función falla al ejecutar. Falta `await` justo en la llamada que tarda, aunque el tipo de retorno esté bien declarado.',
    hint: '¿Qué contiene `pedidos` en el momento en que se llama a `.reduce`?',
  },
  {
    code: "const administradores = usuarios.filter((usuario) => usuario.rol = 'admin');",
    rule: 2,
    why: "El `=` asigna `'admin'` al rol de cada usuario y devuelve ese string, que es siempre verdadero: el filtro deja pasar a todos y además modifica los datos. La comparación correcta es `usuario.rol === 'admin'`.",
    hint: '¿Ese operador compara dos valores o le asigna uno al primero?',
  },
  {
    code: 'async function actualizar(usuario: Usuario): Promise<boolean> {\n  try {\n    await actualizarPerfil(usuario);\n  } catch {\n    return true;\n  }\n  return true;\n}',
    rule: 1,
    why: 'Si `actualizarPerfil` falla, el `catch` devuelve `true` igual que el camino feliz: el error real desaparece y quien llama cree que todo salió bien. Es peor que no manejar el error, porque además miente sobre el resultado.',
    hint: '¿Qué diferencia hay entre el valor que devuelve el `catch` y el del camino sin error?',
  },
  {
    code: "async function actualizar(usuario: Usuario): Promise<void> {\n  try {\n    await actualizarPerfil(usuario);\n  } catch (error) {\n    console.error('No se pudo actualizar el perfil:', error);\n    throw error;\n  }\n}",
    rule: 0,
    why: 'Espera la operación, registra el error real y lo relanza para que quien llamó decida qué hacer. No modifica datos recibidos ni oculta el fallo: combina bien async y manejo de errores.',
  },
  {
    code: 'function filtrarActivos(usuarios: Usuario[]): Usuario[] {\n  return usuarios.filter((usuario) => usuario.activo === true);\n}',
    rule: 0,
    why: '`filter` crea un array nuevo y no toca el recibido; además usa `===` para comparar. Es el contraste correcto con la línea que mutaba el array.',
  },
  {
    code: 'function buscarPorId(usuarios: Usuario[], id: string): Usuario | undefined {\n  return usuarios.find((usuario) => usuario.id == id);\n}',
    rule: 2,
    why: "`==` convierte tipos antes de comparar: si el `id` guardado es numérico, `'1' == 1` da verdadero y el filtro encuentra un usuario que con `===` no coincidiría. La convención del proyecto es comparar siempre con `===`.",
    hint: '¿Qué hace `==` con los tipos de los dos valores antes de compararlos?',
  },
];

export const INTEGRATIVE_QUIZ: QuizQuestion[] = [
  {
    question:
      'Tenés `async function obtenerUsuarios(): Promise<Usuario[]>` que a veces falla porque el servidor no responde. ¿Qué combinación usás para llamarla de forma segura?',
    options: [
      {
        text: '`await` para esperar el resultado, dentro de un `try/catch` para manejar el caso en que falle.',
        correct: true,
        why: '`await` espera el resultado real y hace que el rechazo de la promesa pase por el `catch` de esa llamada. Sin esperar, el `try` termina antes de que la operación falle.',
      },
      {
        text: 'Solo `await`: el `try/catch` es necesario únicamente si la función no es async.',
        correct: false,
        why: 'Es al revés: las operaciones asíncronas son las que más necesitan `try`/`catch`, porque fallan por motivos externos como la red o un timeout.',
      },
      {
        text: '`try/catch` sin `await`: así el error se captura antes de que llegue la promesa.',
        correct: false,
        why: 'Sin `await`, el error de la promesa no pasa por el `catch` de esa llamada: el `try` termina antes de que la promesa se rechace.',
      },
    ],
  },
  {
    question:
      'Escribís una función que recibe un array tipado con una interface y le hacés `.push()` para agregar un elemento. ¿Qué problema combina esto?',
    options: [
      {
        text: 'TypeScript no permite `.push()` sobre un array tipado con interface.',
        correct: false,
        why: '`.push()` es una operación válida sobre cualquier array. La interface describe la forma de cada elemento, no bloquea los métodos del array.',
      },
      {
        text: 'El tipado no impide mutar: la función cambia el array de quien la llamó sin avisar.',
        correct: true,
        why: 'La interface controla la forma de los datos, no si el array se puede modificar. El array original cambia aunque el tipo sea correcto, y eso puede sorprender a quien lo pasó.',
      },
      {
        text: 'El `.push()` rompe la interface porque el array deja de ser del tipo declarado.',
        correct: false,
        why: 'Agregar un elemento con la misma forma mantiene el tipo. El problema no es de tipos: es que se muta el array recibido.',
      },
    ],
  },
  {
    question: 'Un `catch` vacío deja pasar un error sin hacer nada. ¿Por qué es peor que no tener `try`/`catch`?',
    options: [
      {
        text: 'Porque el error desaparece del flujo sin dejar rastro, mientras que sin `try`/`catch` al menos se ve.',
        correct: true,
        why: 'Sin manejo, el error suele aparecer en la consola o en los logs. Con un `catch` vacío, el programa sigue como si nada y el problema se vuelve invisible.',
      },
      {
        text: 'Porque un `catch` vacío hace que el programa se detenga más tarde y con menos información.',
        correct: false,
        why: 'No lo detiene más tarde: lo deja seguir como si nada hubiera fallado. Justamente esa continuación silenciosa es el problema.',
      },
      {
        text: 'Porque TypeScript no permite un `catch` vacío y obliga a agregar un `throw`.',
        correct: false,
        why: 'Un `catch` vacío es válido para TypeScript. El problema aparece al ejecutar, cuando el error se pierde, no en la compilación.',
      },
    ],
  },
  {
    question:
      '¿Qué dos problemas combina este fragmento?\n`try { const usuarios = obtenerUsuarios(); console.log(usuarios.length); } catch {}`',
    options: [
      {
        text: 'Solo falta `await`: el `catch` vacío no afecta porque no hay errores posibles.',
        correct: false,
        why: 'La llamada asíncrona puede rechazar por red o por servidor. El `catch` vacío es el segundo problema, no un detalle inocuo.',
      },
      {
        text: 'Solo el `catch` vacío: `obtenerUsuarios()` devuelve el array aunque no se espere.',
        correct: false,
        why: 'Sin `await`, la llamada devuelve una promesa, no el array. Los dos problemas están presentes y se combinan.',
      },
      {
        text: 'Falta `await` antes de `obtenerUsuarios()` y el `catch` vacío oculta cualquier error.',
        correct: true,
        why: 'Sin `await`, `usuarios` es una promesa y `.length` no representa la cantidad de usuarios. Además, si la promesa rechaza, el `catch` vacío no deja ningún rastro del fallo.',
      },
    ],
  },
];

export const TOKEN_PROMPT = '¿Qué palabra de esta línea hay que cambiar para que haga lo que pretende?';
export const TOKEN_ROUNDS: SpotTokenRound[] = [
  {
    line: 'const totalCarrito = items.reduce((acc, item) => acc + item.precio, 1);',
    targetIndex: 9,
    why: 'El último argumento de `reduce` es el valor inicial del acumulador. Para sumar tiene que arrancar en `0`: con `1`, el total siempre queda una unidad por encima del real.',
    hint: 'Imaginá que `items` tiene un solo item de precio 100. ¿Qué valor termina teniendo `totalCarrito`?',
  },
  {
    line: 'const usuarios: Usuario = await obtenerUsuarios();',
    targetIndex: 2,
    why: '`obtenerUsuarios()` devuelve una lista y la variable se llama en plural, pero el tipo declarado es un solo `Usuario`. Tiene que ser `Usuario[]`, un array de usuarios.',
    hint: 'Compará cuántos valores sugiere el nombre de la variable con lo que declara su tipo.',
  },
  {
    line: 'const configuracion: any = JSON.parse(texto);',
    targetIndex: 2,
    why: '`any` apaga el chequeo de tipos: si `texto` trae una propiedad mal escrita o falta una, TypeScript no avisa nada y el error aparece en ejecución. Declarar una interface (por ejemplo `Configuracion`) mantiene el chequeo en todo lo que use `configuracion` después.',
    hint: 'Si al JSON le falta una propiedad que el resto del código usa, ¿quién te avisa antes de ejecutar?',
  },
];

// ---- Contexto común de las actividades nuevas: el carrito de la tienda ----

export const CART_CODE = `interface Item {
  nombre: string;
  precio: number;
  cantidad: number;
}

const carrito = {
  cliente: 'Ana',
  items: [
    {nombre: 'Teclado', precio: 15000, cantidad: 1},
    {nombre: 'Mouse', precio: 5000, cantidad: 2},
  ],
  cupon: null,
};`;

/** Acepta la expresión sola, con `;` al final, o envuelta en `console.log(...)`. */
function consoleVariants(...expressions: string[]): string[] {
  return expressions.flatMap((e) => [e, e + ';', `console.log(${e})`, `console.log(${e});`]);
}

export const CART_CONSOLE_STEPS: TerminalStep[] = [
  {
    instruction: 'Mostrá cuántos items distintos tiene el carrito.',
    accepted: consoleVariants('carrito.items.length'),
    hint: 'Primero llegá a la lista de items con un punto; después pedile su cantidad de elementos.',
    output: '2',
  },
  {
    instruction: 'Mostrá el nombre del último item, sin escribir su posición a mano.',
    accepted: consoleVariants('carrito.items[carrito.items.length - 1].nombre', 'carrito.items[carrito.items.length-1].nombre', 'carrito.items.at(-1).nombre'),
    hint: 'El último índice depende de cuántos elementos hay; y una vez en el item, el nombre se lee con un punto.',
    output: "'Mouse'",
  },
  {
    instruction: 'Comprobá si el precio del primer item es exactamente el número 15000, sin conversión de tipos.',
    accepted: consoleVariants('carrito.items[0].precio === 15000'),
    hint: 'El primer item está en la posición 0, y la comparación sin conversión de tipos usa tres signos.',
    output: 'true',
  },
  {
    instruction: 'Comprobá si el carrito no tiene cupón (está en null).',
    accepted: consoleVariants('carrito.cupon === null', '!carrito.cupon'),
    hint: 'Compará la propiedad `cupon` contra `null` con la comparación estricta.',
    output: 'true',
  },
];
export const CART_CONSOLE_EXPLANATION =
  'Índice y punto se combinan para llegar a cualquier dato (entradas 20 y 22): `carrito.items[0].precio`. El último elemento siempre es `length - 1`, y `===` compara valor y tipo sin conversiones (entrada 17).';

export const SHIPPING_TRACE_CODE = `function calcularEnvio(items: Item[]): number {
  let unidades = 0;
  for (const item of items) {
    unidades = unidades + item.cantidad;
  }
  if (unidades >= 3) {
    return 0;
  } else if (unidades === 2) {
    return 500;
  }
  return 1200;
}

const envio = calcularEnvio(carrito.items);`;
export const SHIPPING_TRACE_ACCEPTED = ['0'];
export const SHIPPING_TRACE_HINTS = [
  'Seguí el loop vuelta por vuelta: ¿qué se suma en cada una, la cantidad de items o la `cantidad` de cada item?',
  'Teclado suma 1 y Mouse suma 2. Con ese total, evaluá las condiciones en orden: se ejecuta la primera verdadera.',
];
export const SHIPPING_TRACE_EXPLANATION =
  'El loop suma la `cantidad` de cada item: 1 + 2 = 3 unidades (entrada 21). `3 >= 3` es verdadero, así que la función devuelve 0 en la primera rama y las demás ni se evalúan (entradas 18 y 19). Si respondiste 500, contaste items (2) en vez de unidades.';

export const LOAD_CART_TEMPLATE =
  "async function cargarCarrito(id: {{ptype}}): {{ret}} {\n  try {\n    return {{aw}} obtenerCarrito(id);\n  } catch (error) {\n    console.error('No se pudo cargar el carrito:', error);\n    {{th}} error;\n  }\n}";
export const LOAD_CART_SLOTS: FillBlankSlot[] = [
  {id: 'ptype', answer: 'string'},
  {id: 'ret', answer: 'Promise<Carrito>'},
  {id: 'aw', answer: 'await'},
  {id: 'th', answer: 'throw'},
];
export const LOAD_CART_BANK = ['Carrito', 'any', 'throw', 'string', 'return', 'Promise<Carrito>', 'await', 'async'];
export const LOAD_CART_EXPLANATION =
  'El id es un texto (`string`; `any` apagaría el chequeo, entrada 16). Una función `async` siempre devuelve una Promise: `Promise<Carrito>`, no `Carrito` (entradas 23 y 24). Sin `await`, el `catch` no atrapa el rechazo (entrada 25). Y `throw error` avisa a quien llamó que falló; con `return error` la función devolvería el error como si fuera un carrito.';

export const CART_PATH_START = 'json';
export const CART_PATH_NODES: Record<string, DecisionNode> = {
  json: {
    id: 'json',
    situation: 'El carrito ahora llega de una API como texto. Al probar, `JSON.parse(texto)` falla con `SyntaxError: Unexpected token \'<\', "<!DOCTYPE "... is not valid JSON`. ¿Qué significa?',
    options: [
      {text: 'Que el JSON del carrito tiene una coma de más.', correct: false, why: 'Una coma final da otro mensaje («Expected double-quoted property name»). Acá el texto ni siquiera empieza con `{` (entrada 23c).'},
      {text: 'Que el servidor no devolvió JSON sino una página HTML, probablemente de error: hay que revisar la respuesta.', correct: true, why: 'El texto empieza con `<`, como una página HTML. El problema está en la respuesta, no en el código que la lee (entrada 23c).', next: 'cupon'},
      {text: 'Que `JSON.parse` no sirve para objetos con arrays adentro.', correct: false, why: '`JSON.parse` maneja objetos y arrays anidados sin límite (entrada 23c).'},
    ],
  },
  cupon: {
    id: 'cupon',
    situation: 'Con la API arreglada, un usuario escribe el cupón como `\' verano10 \'` y el sistema lo rechaza, aunque el cupón guardado es `\'VERANO10\'`. ¿Qué comparación lo acepta sin aceptar cupones distintos?',
    options: [
      {text: "`ingresado.trim().toUpperCase() === 'VERANO10'`", correct: true, why: 'Quita los espacios de los costados y unifica mayúsculas antes de comparar con `===` (entrada 17a).', next: 'nulo'},
      {text: "`ingresado.toUpperCase() === 'VERANO10'`", correct: false, why: 'Unifica mayúsculas pero deja los espacios: `\' VERANO10 \'` sigue siendo distinto (entrada 17a).'},
      {text: "`ingresado.toUpperCase().includes('VERANO10')`", correct: false, why: 'También aceptaría `\'VERANO100\'` o `\'XVERANO10\'`: `includes` no exige que sea el mismo texto (entrada 17a).'},
    ],
  },
  nulo: {
    id: 'nulo',
    situation: 'El campo del cupón está declarado como `string | null`, porque puede no haberse cargado. Al escribir `cupon.trim()`, TypeScript informa `TS18047: \'cupon\' is possibly \'null\'`. ¿Cómo se resuelve?',
    options: [
      {text: 'Declarar el campo como `string`, para que el error desaparezca.', correct: false, why: 'El dato puede faltar de verdad: cambiar el tipo esconde el caso, y el programa fallaría al ejecutar con `null` (entrada 23).'},
      {text: 'Declararlo como `any`.', correct: false, why: '`any` apaga la revisión de tipos y deja el mismo error para la ejecución (entrada 23).'},
      {text: 'Comprobar `if (cupon !== null)` antes de usar `trim()`.', correct: true, why: 'La comprobación acota el tipo: dentro del `if`, `cupon` es `string` (entrada 23).', next: 'privado'},
    ],
  },
  privado: {
    id: 'privado',
    situation: 'El equipo pasó la lógica a una clase `Carrito` con `private items: Item[] = []`. Querés mostrar en un resumen cuántos items tiene, y `carrito.items.length` da `TS2341: Property \'items\' is private`. ¿Qué corresponde?',
    options: [
      {text: 'Usar un método público de la clase, como `cantidadDeItems()`, que devuelve `this.items.length`.', correct: true, why: '`private` hace que los items solo se lean y cambien a través de los métodos de la clase; un método público ofrece el dato sin exponer la lista (entrada 23a).', next: 'import'},
      {text: 'Sacar el `private` de `items`.', correct: false, why: 'Cualquier parte del código podría modificar la lista sin pasar por las validaciones de la clase (entrada 23a).'},
      {text: 'Crear otra instancia con `new Carrito()` y leer sus items.', correct: false, why: 'Una instancia nueva tiene su propio estado, vacío: no es el carrito del usuario (entrada 23a).'},
    ],
  },
  import: {
    id: 'import',
    situation: 'La clase está en `src/tienda/carrito.ts` como `export default class Carrito`. La vas a usar en `src/tienda/checkout.ts`. ¿Qué import va?',
    options: [
      {text: "`import { Carrito } from './carrito';`", correct: false, why: 'Con llaves se importan los exports con nombre; un export por defecto va sin llaves (TS2614, entrada 23b).'},
      {text: "`import Carrito from './carrito';`", correct: true, why: 'Export por defecto, sin llaves, y la ruta `./` porque los dos archivos están en `src/tienda/` (entrada 23b).', next: 'revisar'},
      {text: "`import Carrito from '../carrito';`", correct: false, why: '`../` sube a `src/`, donde no hay ningún `carrito.ts` (TS2307, entrada 23b).'},
    ],
  },
  revisar: {
    id: 'revisar',
    situation: 'Terminaste los cambios en checkout.ts. Antes de ejecutarlo, querés asegurarte de que no quedó ningún error de tipos en el proyecto. ¿Qué corrés?',
    options: [
      {text: '`npx tsx src/tienda/checkout.ts`', correct: false, why: 'tsx quita los tipos y ejecuta sin revisarlos: un error de tipos pasaría sin aviso (entrada 16a).'},
      {text: '`node src/tienda/checkout.ts`', correct: false, why: 'Node ejecuta; no revisa tipos, aunque pueda quitar las anotaciones de un `.ts` (entrada 16a).'},
      {text: '`npx tsc --noEmit`', correct: true, why: 'Revisa los tipos de todo el proyecto sin generar archivos; si no imprime nada, no hay errores (entrada 16a).'},
    ],
  },
};
export const CART_PATH_EXPLANATION =
  'El mismo carrito cruzó seis entradas: leer qué devolvió la API, normalizar un texto antes de compararlo, acotar un union type con `null`, respetar el `private` de una clase, importarla con el formato y la ruta correctos, y revisar los tipos antes de ejecutar.';

export const SYMPTOM_LEFT: MatchItem[] = [
  {id: 'break', text: 'Con el método de envío «express», el carrito suma el costo de express y también el de «programado».'},
  {id: 'await', text: 'Donde tendría que verse el total, la consola muestra `Promise { <pending> }`.'},
  {id: 'decimal', text: 'La comparación `total === 30.3` da `false`, aunque en pantalla el total se ve como 30.3.'},
  {id: 'optional', text: "Al abrir el carrito de un cliente sin dirección cargada, el programa se detiene con `TypeError: Cannot read properties of undefined (reading 'ciudad')`."},
  {id: 'every', text: 'Un carrito sin ningún item pasa la validación «todos los items tienen stock».'},
  {id: 'template', text: 'El encabezado del carrito muestra literalmente `Hola, ${cliente}`.'},
];
export const SYMPTOM_RIGHT: MatchItem[] = [
  {id: 'every', text: '`every` devuelve `true` con un array vacío: hay que validar aparte que haya items.'},
  {id: 'template', text: 'El texto está entre comillas simples: para insertar el valor hacen falta comillas invertidas.'},
  {id: 'break', text: 'A un `case` del `switch` le falta el `break` y la ejecución sigue con el siguiente.'},
  {id: 'optional', text: 'Se lee una propiedad de algo `undefined`: si la ausencia es válida, `?.` con un valor por defecto `??`.'},
  {id: 'await', text: 'Falta `await` antes de la operación que calcula el total.'},
  {id: 'decimal', text: 'La suma de decimales no es exacta: hay que redondear a dos decimales u operar en centavos.'},
];
export const SYMPTOM_WHY: Record<string, string> = {
  break: 'Dos acciones donde se esperaba una es la señal típica de un `break` olvidado (entrada 18).',
  await: 'Una Promise sin esperar todavía está pendiente: el dato llega recién con `await` (entrada 24).',
  decimal: 'Los decimales no siempre se representan exactos; con dinero se redondea antes de comparar (entrada 17).',
  optional: 'El mensaje dice que se leyó `ciudad` de algo `undefined`: la dirección no existe (entrada 22).',
  every: '«Todos cumplen» es verdadero cuando no hay ninguno: `every` sobre un array vacío da `true` (entrada 20).',
  template: '`${...}` solo se reemplaza dentro de un template string, con comillas invertidas (entrada 17a).',
};
