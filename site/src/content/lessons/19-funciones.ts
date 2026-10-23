import type {CodeLine} from '@site/src/components/FindInCode';

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

export const PRACTICE_RULE_LABELS = [
  'El nombre no dice qué hace la función',
  'Modifica el objeto o array recibido en vez de devolver uno nuevo',
  'Demasiados parámetros sueltos',
  'Depende de una variable externa en vez de un parámetro',
];

export const PRACTICE_LINES: CodeLine[] = [
  {
    code: 'let descuentoActivo = true;\n\nfunction calcularTotal(precio: number, cantidad: number): number {\n  return descuentoActivo ? precio * cantidad * 0.9 : precio * cantidad;\n}',
    rule: 4,
    why: 'Con el mismo `precio` y la misma `cantidad`, el resultado cambia si alguien modificó `descuentoActivo` entre dos llamadas. El dato que decide el resultado no aparece en la firma, así que quien lee la llamada no puede saber qué va a recibir.',
    hint: '¿Los parámetros alcanzan para explicar por qué dos llamadas iguales dan resultados distintos?',
  },
  {
    code: "function procesar(datos: Pedido[]): number {\n  return datos.filter((pedido) => pedido.estado === 'pendiente').length;\n}",
    rule: 1,
    why: 'El nombre `procesar` no dice que cuenta pedidos pendientes: podría filtrar, transformar o validar. `contarPendientes` describe el resultado sin obligar a leer el cuerpo.',
    hint: 'Si solo vieras el nombre y el tipo de retorno, ¿sabrías qué número devuelve?',
  },
  {
    code: 'function aplicarDescuento(pedido: Pedido): void {\n  pedido.total = pedido.total * 0.9;\n}',
    rule: 2,
    why: 'Modifica el objeto que recibió: quien llamó sigue teniendo la misma referencia, ahora con otro total, aunque no haya pedido ese cambio. Devolver un pedido nuevo deja el original intacto.',
    hint: '¿El pedido que tenía quien llamó sigue igual después de ejecutar la función?',
  },
  {
    code: 'function calcularTotal(precio: number, cantidad: number): number {\n  return precio * cantidad;\n}',
    rule: 0,
    why: 'Usa solo los parámetros, no modifica nada externo y con las mismas entradas siempre devuelve lo mismo. Es la versión confiable de la función de arriba.',
  },
  {
    code: 'function registrarEnvio(nombre: string, calle: string, ciudad: string, codigoPostal: string, email: string): void {\n  // ...\n}',
    rule: 3,
    why: 'Cinco parámetros del mismo tipo se pueden pasar en cualquier orden sin que TypeScript avise: invertir `calle` y `ciudad` compila igual y el error aparece recién en los datos guardados. Un objeto con nombres evita esa confusión.',
    hint: '¿Qué pasa si quien llama invierte dos de estos valores del mismo tipo?',
  },
  {
    code: "function crearPedido(datos: DatosPedido): Pedido {\n  return {id: generarId(), ...datos, estado: 'pendiente'};\n}",
    rule: 0,
    why: 'Recibe un solo objeto con los datos agrupados y devuelve un pedido nuevo; no toca el objeto recibido ni depende de nada externo.',
  },
  {
    code: 'function contarActivos(usuarios: Usuario[]): number {\n  return usuarios.filter((usuario) => usuario.activo).length;\n}',
    rule: 0,
    why: 'El nombre dice exactamente qué cuenta y la función solo lee el array que recibió: no lo modifica ni consulta nada externo. `filter` crea una lista nueva y el original queda igual.',
  },
];


