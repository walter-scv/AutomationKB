import type {CodeLine} from '@site/src/components/FindInCode';

export const ARRAY_RULE_LABELS = [
  'Usa un nombre en singular para una lista de valores',
  'El nombre de la lista no dice qué contiene',
  'Accede a una posición que no existe',
];

export const ARRAY_LINES: CodeLine[] = [
  {
    code: "const intentos = ['', 'Abc123', 'Abc1234', 'Abc12345', 'Abc123456'];\nconst ultimoIntento = intentos[5];",
    rule: 3,
    why: 'La lista tiene cinco elementos, así que las posiciones válidas son 0 a 4. `intentos[5]` no da un error: devuelve `undefined`, y el problema aparece más adelante cuando se usa como si fuera un string.',
    hint: '¿Cuántos elementos hay declarados y cuál es el último índice que existe?',
  },
  {
    code: 'async enviarBienvenidas(): Promise<void> {\n  const emails = await this.page.locator(\'[data-input="email-field"]\').allTextContents();\n  if (emails.length > 0) {\n    await enviarBienvenida(emails[0]);\n  }\n}',
    rule: 0,
    why: 'Confirma que hay al menos un elemento antes de leer la posición 0; si la lista está vacía, no se ejecuta nada. El nombre está en plural y `allTextContents()` devuelve un `string[]` homogéneo.',
  },
  {
    code: "const candidato: string[] = ['', 'Abcd123'];",
    rule: 1,
    why: 'El contenido es una lista de dos valores, pero el nombre está en singular: quien lea `candidato` va a esperar un solo string y puede pasarlo donde se espera uno. `candidatos` dice lo que realmente es.',
    hint: '¿Este nombre describe un valor o una colección de valores?',
  },
  {
    code: "const datos: string[] = ['ana@mail.com', 'luis@mail.com'];",
    rule: 2,
    why: '`datos` no dice qué contiene: podrían ser emails, nombres o ids. `emails` describe la lista sin obligar a mirar los valores para adivinarlo.',
    hint: 'Si borrás el lado derecho de la asignación, ¿el nombre alcanza para saber qué guarda?',
  },
  {
    code: "const pedidosPendientes = pedidos.filter((pedido) => pedido.estado === 'pendiente');",
    rule: 0,
    why: 'El nombre en plural describe el contenido y `filter` devuelve una lista nueva del mismo tipo, sin tocar la original. No hay ninguna posición fija ni acceso fuera de rango.',
  },
  {
    code: 'const ultimoPedido = pedidos[pedidos.length];',
    rule: 3,
    why: '`.length` es la cantidad de elementos, no el último índice. Con tres pedidos, `pedidos[3]` no existe y devuelve `undefined`; el último está en `length - 1`.',
    hint: '¿Qué número devuelve `.length` comparado con la última posición válida?',
  },
  {
    code: 'const indiceUltimo = candidatos.length - 1;\nconst ultimo = candidatos[indiceUltimo];',
    rule: 0,
    why: 'Con `length - 1` se obtiene el último índice válido: para cinco elementos da 4. Es la forma correcta de llegar al final sin escribir un número fijo.',
  },
];

export const PRACTICE_RULE_LABELS = [
  'Asume una cantidad fija de elementos en vez de usar `.length`',
  'Accede a una posición sin confirmar que el array no esté vacío',
  'Mezcla datos sin relación en un array en vez de un objeto',
];

export const PRACTICE_LINES: CodeLine[] = [
  {
    code: 'const registro = [usuario.email, usuario.intentosFallidos, usuario.activo];',
    rule: 3,
    why: 'Un email, un número y un booleano quedan detrás de índices 0, 1 y 2. Quien lea `registro[1]` no sabe si es un contador, un id u otra cosa, y el tipo del array pasa a ser una unión de tres tipos. Un objeto con nombres resuelve las dos cosas.',
    hint: '¿Quién lee `registro[1]` puede saber qué representa sin buscar la declaración?',
  },
  {
    code: 'if (candidatos.length === 0) {\n  return;\n}\nconst primerCandidato = candidatos[0].toUpperCase();',
    rule: 0,
    why: 'El guard confirma que hay al menos un elemento antes de leer la posición 0; si la lista está vacía, la función sale antes de tocar `undefined`.',
  },
  {
    code: 'for (let i = 0; i < 3; i++) {\n  revisar(candidatos[i]);\n}',
    rule: 1,
    why: 'El `3` quedó fijo: si mañana hay cinco candidatos, dos no se revisan; si hay dos, la tercera vuelta usa `candidatos[2]`, que es `undefined`. `candidatos.length` sigue al array real.',
    hint: '¿Qué pasa con este loop si la lista cambia de tamaño?',
  },
  {
    code: 'const primerPedido = pedidos[0].id;',
    rule: 2,
    why: 'Si `pedidos` está vacío —por ejemplo, al abrir la pantalla antes de cargar datos—, `pedidos[0]` es `undefined` y leer `.id` revienta con un error lejos de la causa. Falta confirmar que haya algo.',
    hint: '¿Qué hay en `pedidos[0]` cuando la lista todavía no tiene elementos?',
  },
  {
    code: 'const pedidosPagados = pedidos.filter((pedido) => pedido.pagado);',
    rule: 0,
    why: 'Filtra con una condición booleana y devuelve una lista nueva; no asume cantidad ni accede a posiciones puntuales. El nombre en plural describe el resultado.',
  },
  {
    code: 'const fila = [cliente.nombre, cliente.email, cliente.edad];',
    rule: 3,
    why: 'Nombre y email son strings, edad es number: el array mezcla tipos y significados que solo existen por su posición. Un objeto `{nombre, email, edad}` dice qué es cada dato y le deja a TypeScript revisar los accesos.',
    hint: '¿Los tres valores se usan de la misma forma, o cada uno representa otra cosa?',
  },
  {
    code: 'for (const candidato of candidatos) {\n  revisar(candidato);\n}',
    rule: 0,
    why: 'Recorre la lista completa sin asumir cuántos elementos hay y sin usar índices. Si la lista crece o se achica, el loop sigue funcionando.',
  },
];


