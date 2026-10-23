import type {CodeLine} from '@site/src/components/FindInCode';

export const VARIABLE_RULE_LABELS = [
  'El tipo es `any`, y TypeScript deja de revisar ese dato',
  'Declara con `let` un valor que nunca se reasigna',
  'El nombre no dice qué contiene el valor',
];

export const VARIABLE_LINES: CodeLine[] = [
  {
    code: 'const longitudMinima: number = 8;',
    rule: 0,
    why: 'El valor no cambia, el tipo está declarado y el nombre dice exactamente qué es. No hay nada que ajustar acá.',
  },
  {
    code: 'let totalCarrito = 0;\nfor (const producto of carrito) {\n  totalCarrito += producto.precio * producto.cantidad;\n}',
    rule: 0,
    why: 'Aunque arranque en `let`, el valor se reasigna en cada vuelta del `for` — ahí `let` es lo correcto. El tipo se infiere como `number` y el nombre describe qué acumula.',
    hint: 'Mirá cuántas veces cambia el valor de esta variable a lo largo del código.',
  },
  {
    code: 'const resultado = await guardarPedido(pedido);',
    rule: 3,
    why: '"resultado" no dice qué contiene: podría ser el pedido guardado, un `boolean` que indique si se guardó, o un error. Quien lea esta línea tiene que ir a la función `guardarPedido` a averiguarlo.',
    hint: 'Con solo el nombre, ¿se puede saber qué guarda esta variable?',
  },
  {
    code: 'function reintentarEnvio(cuerpo: string) {\n  let intentos = 3;\n  return enviar(cuerpo, intentos);\n}',
    rule: 2,
    why: '`intentos` se lee y se pasa a `enviar`, pero en ningún momento se le asigna otro valor: es un límite fijo. Declararlo `let` le dice a quien lee que en algún momento va a cambiar, y eso no va a pasar.',
    hint: 'Buscá si a esta variable se le asigna un valor distinto del que recibe al declararse.',
  },
  {
    code: 'const configuracion = {timeout: 5000, reintentos: 3};\nconfiguracion.reintentos = 5;',
    rule: 0,
    why: 'Acá no se reasigna la variable: se muta una propiedad del objeto que contiene. `const` impide reasignar la referencia, no cambiar lo que hay adentro — y este patrón es correcto.',
    hint: 'Fijate si cambia la variable o cambia una propiedad del objeto que tiene adentro.',
  },
  {
    code: 'const cuerpo: any = JSON.parse(crudo);',
    rule: 1,
    why: 'Con `any`, TypeScript deja de verificar ese dato: más abajo se puede llamar `cuerpo.cualquierCosa()` y no va a avisar, aunque en el JSON real no exista ese campo. El error aparece recién en producción.',
    hint: '¿TypeScript sigue revisando este valor o acepta cualquier cosa que se le haga después?',
  },
  {
    code: 'const valor = 1500;',
    rule: 3,
    why: '"valor" no dice qué contiene: ¿es el precio? ¿el límite? ¿un id? Un nombre como `limiteEnvioGratis` dice lo mismo en el mismo lugar, sin obligar a nadie a rastrearlo.',
    hint: 'Leé el nombre como si fueras otra persona del equipo: ¿te dice qué es?',
  },
];

export const PRACTICE_RULE_LABELS = [
  'Reasigna una variable que se declaró `const`',
  'El `any` apaga el chequeo de tipos de ese dato',
  'Usa `object` donde corresponde un tipo más preciso',
];

export const PRACTICE_LINES: CodeLine[] = [
  {
    code: 'const nombre = \'Ana\';',
    rule: 0,
    why: 'El tipo se infiere como `string` sin ambigüedad y el nombre describe el valor. No hace falta anotar el tipo cuando el valor asignado ya lo deja claro.',
    hint: '¿Hace falta anotar el tipo cuando el valor asignado ya dice cuál es?',
  },
  {
    code: 'function procesar(dato: any) {\n  return dato.cualquierPropiedadQueSeMeOcurra;\n}',
    rule: 2,
    why: 'Con `any` en el parámetro, TypeScript acepta cualquier propiedad. Si el dato real no tiene `cualquierPropiedadQueSeMeOcurra`, el error recién aparece cuando la función corre con datos reales.',
    hint: '¿TypeScript puede avisar acá si esa propiedad no existe en el dato que llega?',
  },
  {
    code: 'const total = 0;\ntotal = total + precio;',
    rule: 1,
    why: 'Esto es un error de compilación: `total` se declaró `const` y después se le asigna otro valor. Si el total tiene que ir cambiando, se declara `let` desde el principio.',
    hint: '¿Esta variable se declaró de una forma que permita cambiarle el valor después?',
  },
  {
    code: 'const usuarios: Usuario[] = await obtenerUsuarios();',
    rule: 0,
    why: 'Tipo específico (`Usuario[]`), y no genérico: TypeScript puede avisar si más abajo se usa una propiedad que `Usuario` no tiene, o si se le pasa algo que no es un `Usuario`.',
    hint: '¿Este tipo le deja a TypeScript revisar los usos que le siguen?',
  },
  {
    code: 'const configuracion: object = {timeout: 5000};',
    rule: 3,
    why: '`object` es tan genérico como `any` para efectos de chequeo: no dice qué propiedades tiene. Un tipo como `{timeout: number}` o una interfaz `Configuracion` le permiten a TypeScript revisar los usos.',
    hint: '¿Este tipo dice qué se puede hacer con la variable, o solo que es "algo"?',
  },
  {
    code: 'const pedidos: Pedido[] = await obtenerPedidos();',
    rule: 0,
    why: 'Tipo preciso y declarado: `Pedido[]` documenta qué se guarda y activa el chequeo de tipos en cada uso posterior.',
    hint: '¿El tipo elegido le permite a TypeScript revisar lo que se hace con la lista?',
  },
  {
    code: 'let pendientes: any[] = [];',
    rule: 2,
    why: 'El `any` está en el tipo del elemento: cada pendiente puede ser de cualquier forma, y TypeScript no va a avisar cuando se le acceda a una propiedad que no existe.',
    hint: 'Mirá el tipo de cada elemento del array, no solo el del array.',
  },
];

