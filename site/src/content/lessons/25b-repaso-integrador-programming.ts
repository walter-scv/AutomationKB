import type {CodeLine} from '@site/src/components/FindInCode';
import type {QuizQuestion} from '@site/src/components/Quiz';

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
