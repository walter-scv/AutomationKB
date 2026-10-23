import type {CodeLine} from '@site/src/components/FindInCode';
import type {QuizQuestion} from '@site/src/components/Quiz';

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

export const PRACTICE_RULE_LABELS = [
  'Marca `async` una función que no usa `await` adentro',
  'Espera operaciones independientes de a una, pudiendo ir en paralelo',
];

export const PRACTICE_LINES: CodeLine[] = [
  {
    code: 'const usuario = await obtenerUsuario(id);\nconst pedidos = await obtenerPedidosDe(usuario.id);',
    rule: 0,
    why: 'Acá la secuencia es obligatoria: la segunda operación necesita el `id` que devuelve la primera. No se pueden lanzar juntas sin conocer ese dato.',
  },
  {
    code: 'const cotizacion = await obtenerCotizacion();\nconst clima = await obtenerClima();',
    rule: 2,
    why: 'Las dos operaciones son independientes y se esperan una después de la otra: el tiempo total es la suma de ambas. Con `Promise.all` tardaría lo que la más lenta.',
    hint: '¿La segunda operación necesita algún dato que devuelva la primera?',
  },
  {
    code: 'async function formatearFecha(fecha: Date): Promise<string> {\n  return fecha.toISOString();\n}',
    rule: 1,
    why: 'La función no usa `await` adentro: `toISOString()` devuelve el valor al instante. Marcarla `async` obliga a quien la llama a esperar una promesa que no aporta nada.',
    hint: '¿Hay alguna operación que tarde dentro de esta función?',
  },
  {
    code: 'const [resumen, alertas] = await Promise.all([obtenerResumen(), obtenerAlertas()]);',
    rule: 0,
    why: 'Las dos operaciones son independientes y se lanzan juntas; el `await` espera el conjunto. Es el patrón correcto para no sumar los tiempos.',
  },
  {
    code: 'const usuarios = await obtenerUsuarios();\nconst productos = await obtenerProductos();\nconst pedidos = await obtenerPedidosDe(usuarios[0].id);',
    rule: 2,
    why: 'Usuarios y productos no dependen entre sí y podrían pedirse en paralelo; solo los pedidos necesitan el `id` de un usuario. Así, las dos primeras se esperan de a una sin necesidad.',
    hint: '¿Cuáles de estas tres operaciones necesitan el resultado de otra?',
  },
  {
    code: "async function validarEmail(email: string): Promise<boolean> {\n  return email.includes('@');\n}",
    rule: 1,
    why: '`includes` es síncrono: no hay ningún `await` en la función. El `async` agrega una promesa que quien llama tiene que esperar igual, sin ninguna operación lenta que lo justifique.',
    hint: '¿Esta función espera algo, o devuelve el resultado en el acto?',
  },
  {
    code: 'async function guardar(datos: Pedido): Promise<void> {\n  await enviarPedido(datos);\n}',
    rule: 0,
    why: 'La función usa `await` para esperar el envío: el `async` es necesario y el resultado no se usa antes de estar listo.',
  },
  {
    code: 'function calcularTotal(lineas: Linea[]): number {\n  return lineas.reduce((acc, linea) => acc + linea.precio, 0);\n}',
    rule: 0,
    why: 'Es un cálculo síncrono: no hay ninguna operación que tarde y por eso no lleva `async` ni `await`. Está bien que sea una función común.',
  },
];

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
