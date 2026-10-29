import type {TerminalStep} from '@site/src/components/Terminal';
import type {CodeLine} from '@site/src/components/FindInCode';
import type {QuizQuestion} from '@site/src/components/Quiz';
import type {MatchItem} from '@site/src/components/Match';
import type {DecisionNode} from '@site/src/components/DecisionPath';
import type {OrderItem} from '@site/src/components/Order';
import type {OrderRule} from '@site/src/components/Order';

export const ASYNC_RULE_LABELS = ['Falta `await` antes de una operación que tarda'];

export const ASYNC_LINES: CodeLine[] = [
  {
    code: 'const tarea = guardarPedido(pedido);\nawait tarea;',
    rule: 0,
    why: 'La promesa se guarda primero y se espera en la línea siguiente: cuando se usa el resultado, ya está resuelta. No falta ningún `await`.',
  },
  {
    code: 'const usuario = await obtenerUsuario(id);\nconst pedidos = obtenerPedidosDe(usuario.id);',
    rule: 1,
    why: 'La primera línea espera, la segunda no: `pedidos` queda como una promesa y no como la lista. Cualquier uso posterior (`.length`, `.map`) va a fallar o dar un resultado inesperado.',
    hint: '¿Las dos líneas esperan el resultado, o solo la primera?',
  },
  {
    code: "async function cargarPedidos(): Promise<Response> {\n  const respuesta = await fetch('/api/pedidos');\n  return respuesta;\n}",
    rule: 0,
    why: 'La función espera la respuesta con `await` y después la devuelve: el `async` se justifica porque usa `await` adentro, y quien la llama recibe el resultado cuando está listo.',
  },
  {
    code: "const respuesta = await fetch('/api/pedidos');\nconst pedidos = respuesta.json();",
    rule: 1,
    why: '`respuesta.json()` también tarda: sin `await`, `pedidos` es una promesa y no la lista de pedidos. El `await` de la línea anterior no alcanza para esta operación.',
    hint: '¿La segunda operación también tarda en dar el resultado?',
  },
  {
    code: 'const ids = lineas.map((linea) => linea.productoId);',
    rule: 0,
    why: '`map` es una operación síncrona: devuelve el array en el mismo momento. No hay ninguna promesa que esperar acá.',
  },
  {
    code: "async function obtenerResumen(): Promise<Response> {\n  const respuesta = fetch('/api/resumen');\n  return respuesta.json();\n}",
    rule: 1,
    why: '`fetch` devuelve una promesa; sin `await`, `respuesta` no es la respuesta sino la promesa, y `.json()` no existe ahí. El error aparece recién al ejecutar.',
    hint: '¿Qué devuelve `fetch` en el momento en que se asigna, antes de esperar?',
  },
  {
    code: 'const configuracion = cargarConfiguracion();\nconfiguracion.timeout = 5000;',
    rule: 1,
    why: '`cargarConfiguracion()` devuelve una promesa: la propiedad `timeout` se está asignando al objeto promesa, no a la configuración real. El valor se pierde y nadie se entera.',
    hint: '¿Qué objeto recibe la propiedad `timeout`: la configuración o lo que devuelve la llamada antes de esperar?',
  },
  {
    code: 'const [usuarios, pedidos] = await Promise.all([obtenerUsuarios(), obtenerPedidos()]);',
    rule: 0,
    why: '`Promise.all` espera las dos operaciones y devuelve los dos resultados en orden. El `await` está una sola vez porque espera el conjunto, no cada promesa por separado.',
  },
];

export const LOAD_START = 'paralelo';
export const LOAD_NODES: Record<string, DecisionNode> = {
  paralelo: {
    id: 'paralelo',
    situation: 'El panel tarda en cargar. Arranca con `obtenerResumen()` y `obtenerAlertas()`, que no dependen una de la otra. ¿Cómo las esperás?',
    options: [
      {text: 'Una después de la otra, con un `await` en cada línea.', correct: false, why: 'Son independientes: esperarlas de a una suma los dos tiempos sin ninguna necesidad.'},
      {text: 'Con `await Promise.all([obtenerResumen(), obtenerAlertas()])`.', correct: true, why: 'Las dos arrancan juntas y se espera a ambas: el panel tarda lo que tarda la más lenta, no la suma.', next: 'secuencia'},
      {text: 'Sin `await`, así ninguna frena a la otra.', correct: false, why: 'Sin `await` las variables guardan Promises, no los datos: el panel usaría valores que todavía no llegaron.'},
    ],
  },
  secuencia: {
    id: 'secuencia',
    situation: 'Después, `obtenerPedidosDe(usuario.id)` necesita el `usuario` que devuelve `obtenerUsuario(id)`. ¿Cómo las esperás?',
    options: [
      {text: 'Con `Promise.all` también, para ganar tiempo.', correct: false, why: 'No se puede: la segunda necesita un dato de la primera. Lanzarlas juntas deja `usuario` sin valor cuando arranca la segunda.'},
      {text: 'Primero `await obtenerUsuario(id)`, y con ese resultado `await obtenerPedidosDe(usuario.id)`.', correct: true, why: 'Una depende de la otra: tienen que ir en orden.', next: 'async'},
      {text: 'Llamar a `obtenerPedidosDe` sin esperar a `obtenerUsuario`, y completar el id después.', correct: false, why: 'El id no existe todavía: la llamada saldría sin el dato que necesita.'},
    ],
  },
  async: {
    id: 'async',
    situation: 'Revisando el código, ves `async function formatearFecha(fecha: Date): Promise<string> { return fecha.toISOString(); }`. ¿Qué hacés?',
    options: [
      {text: 'Agregar `await` delante de `fecha.toISOString()` para que tenga sentido el `async`.', correct: false, why: '`toISOString()` no tarda ni devuelve una Promise: no hay nada que esperar.'},
      {text: 'Dejarla así; que quien la llame use `await`.', correct: false, why: 'Obliga a todos los que la llaman a tratar como asíncrono un resultado inmediato.'},
      {text: 'Sacarle `async` y que devuelva `string` directo.', correct: true, why: 'No hay ninguna operación que esperar: una función normal alcanza.'},
    ],
  },
};
export const LOAD_EXPLANATION =
  'Lo independiente se espera junto con `Promise.all`, lo que depende de otro resultado va en orden, y `async` se reserva para funciones que de verdad esperan algo.';

export const CLOSING_QUIZ: QuizQuestion[] = [
  {
    question: '¿Por qué una operación como pedir datos a un servidor necesita `await`?',
    options: [
      {
        text: 'Porque así la operación deja de poder fallar.',
        correct: false,
        why: '`await` no evita fallas: solo espera el resultado. Si la operación rechaza, el error sigue existiendo y hay que manejarlo con `try`/`catch`.',
      },
      {
        text: 'Porque reduce la memoria que usa el programa mientras espera.',
        correct: false,
        why: 'El consumo de memoria no es el motivo. `await` existe para que el programa trabaje con el resultado real y no con uno que todavía no llegó.',
      },
      {
        text: 'Porque el resultado no está disponible al instante y hay que esperarlo antes de usarlo.',
        correct: true,
        why: 'Sin esperar, la línea siguiente trabaja con una promesa pendiente en lugar del dato real. `await` pausa esa parte del código hasta que el resultado llega.',
      },
    ],
  },
  {
    question: 'Te olvidás de poner `await` antes de una operación que tarda. ¿Qué es lo más probable que pase?',
    options: [
      {
        text: 'El programa no compila, porque TypeScript detecta la promesa sin esperar.',
        correct: false,
        why: 'No es un error de compilación: el código compila y el problema aparece al ejecutar. TypeScript no obliga a esperar toda promesa.',
      },
      {
        text: 'El código sigue antes de que el resultado esté listo, y a veces falla y a veces no.',
        correct: true,
        why: 'Según cuánto tarde la operación, el resultado puede llegar justo a tiempo o no. Esa variación hace que el bug parezca intermitente y cueste reproducirlo.',
      },
      {
        text: 'La operación se ejecuta dos veces: una sin esperar y otra cuando llega el resultado.',
        correct: false,
        why: 'La operación se ejecuta una sola vez. Lo que falta es esperar su resultado, no repetir la llamada.',
      },
    ],
  },
];

export const ASYNC_MATCH_LEFT: MatchItem[] = [
  {id: 'all2', text: '`await Promise.all([obtenerUsuario(id), obtenerPedidos(id)])`'},
  {id: 'allmap', text: '`await Promise.all(ids.map((id) => obtenerUsuario(id)))`'},
  {id: 'forawait', text: '`for (const id of ids) { await obtenerUsuario(id); }`'},
  {id: 'asyncnoawait', text: "`async function saludar(): Promise<string> { return 'Hola'; }`"},
  {id: 'json', text: '`const pedido = await respuesta.json();`'},
  {id: 'trycatch', text: '`try { await guardar(pedido); } catch (error) { ... }`'},
];
export const ASYNC_MATCH_RIGHT: MatchItem[] = [
  {id: 'forawait', text: 'La misma operación para cada elemento de una lista, una después de la otra.'},
  {id: 'json', text: 'Espera a que se lea el cuerpo de la respuesta y lo convierte en un objeto.'},
  {id: 'all2', text: 'Dos operaciones distintas e independientes, lanzadas a la vez.'},
  {id: 'trycatch', text: 'Si la operación que se espera falla, el error se atrapa ahí mismo.'},
  {id: 'allmap', text: 'La misma operación para cada elemento de una lista, todas a la vez.'},
  {id: 'asyncnoawait', text: 'Devuelve una Promise aunque no tenga nada que esperar.'},
];
export const ASYNC_MATCH_WHY: Record<string, string> = {
  all2: '`Promise.all` con un array de dos llamadas distintas las arranca juntas y espera a que terminen ambas.',
  allmap: '`map` arma una Promise por cada `id`, y `Promise.all` las espera todas juntas: no van en orden.',
  forawait: 'El `await` dentro del `for...of` frena cada vuelta hasta que termina la anterior: van en secuencia.',
  asyncnoawait: '`async` siempre envuelve el resultado en una Promise, aunque no haya ningún `await` adentro.',
  json: '`respuesta.json()` también tarda (lee el cuerpo), por eso lleva su propio `await`.',
  trycatch: 'Con `await` dentro del `try`, si la Promise se rechaza el control salta al `catch`.',
};

export const DEPS_ORDER_ITEMS: OrderItem[] = [
  {id: 'total', what: 'Línea', code: 'const total = calcularTotal(pedidos);'},
  {id: 'show', what: 'Línea', code: 'mostrarResumen(usuario.nombre, total);'},
  {id: 'usuario', what: 'Línea', code: 'const usuario = await obtenerUsuario(id);'},
  {id: 'pedidos', what: 'Línea', code: 'const pedidos = await obtenerPedidosDe(usuario.id);'},
];
export const DEPS_ORDER_CORRECT = ['usuario', 'pedidos', 'total', 'show'];
export const DEPS_ORDER_RULES: OrderRule[] = [
  {before: 'usuario', after: 'pedidos', why: '`obtenerPedidosDe` necesita `usuario.id`, y `usuario` recién existe después de su `await`.'},
  {before: 'pedidos', after: 'total', why: '`calcularTotal` recibe la lista de pedidos: tiene que estar esperada antes.'},
  {before: 'total', after: 'show', why: '`mostrarResumen` usa `total`: va al final, cuando ya está calculado.'},
];

export const PROMISE_STEPS: TerminalStep[] = [
  {
    instruction: 'Existe obtenerEnvio(), que consulta el estado de un envío y tarda un momento. Llamala y guardá lo que devuelve en const consulta, sin esperar.',
    accepted: ['const consulta = obtenerEnvio()', 'const consulta = obtenerEnvio();'],
    hint: 'Es una declaración con const, igual que cualquier otra: todavía sin await.',
    output: 'undefined',
  },
  {
    instruction: 'Mostrá qué hay en consulta en este momento.',
    accepted: ['consulta', 'consulta;', 'console.log(consulta)', 'console.log(consulta);'],
    hint: 'Alcanza con escribir el nombre de la variable.',
    output: 'Promise { <pending> }',
  },
  {
    instruction: 'Esperá a que la consulta termine y guardá el resultado en const envio.',
    accepted: ['const envio = await consulta', 'const envio = await consulta;', 'const envio = await obtenerEnvio()', 'const envio = await obtenerEnvio();'],
    hint: 'Es la palabra que indica «hasta que esto termine, no sigas», delante de consulta.',
    output: 'undefined',
  },
  {
    instruction: 'Mostrá el estado del envío.',
    accepted: ['envio.estado', 'envio.estado;', 'console.log(envio.estado)', 'console.log(envio.estado);'],
    hint: 'envio ya es el objeto con los datos: leé su propiedad estado.',
    output: "'en camino'",
  },
];
export const PROMISE_EXPLANATION =
  'Sin `await`, `consulta` es una Promise todavía pendiente, no el dato: `Promise { <pending> }` es la señal de que falta esperar. Con `await`, el programa se detiene hasta que la Promise se cumple y `envio` ya tiene el objeto. Si la consulta fallara, la Promise quedaría rechazada y el `await` lanzaría el error.';
