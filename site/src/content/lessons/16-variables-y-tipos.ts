import type {CodeLine} from '@site/src/components/FindInCode';
import type {FillBlankSlot} from '@site/src/components/FillBlank';
import type {SpotTokenRound} from '@site/src/components/SpotToken';

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

export const TYPE_TOKEN_PROMPT = '¿Qué palabra de esta línea hay que cambiar para que quede bien declarada y TypeScript la siga revisando?';
export const TYPE_TOKEN_ROUNDS: SpotTokenRound[] = [
  {
    line: 'let pendientes: any[] = [];',
    targetIndex: 2,
    why: '`any[]` apaga el chequeo de cada elemento: TypeScript no avisa si se mete cualquier cosa en la lista. Con el tipo real (por ejemplo `Pedido[]`) el chequeo sigue activo.',
    hint: '¿Qué revisa TypeScript sobre los elementos que se agreguen a esta lista?',
  },
  {
    line: 'const intentos = 0; intentos = intentos + 1;',
    targetIndex: 0,
    why: 'Un `const` no se puede reasignar, y la segunda instrucción lo hace. Como el valor cambia, se declara con `let`.',
    hint: 'La segunda instrucción le asigna un valor nuevo. ¿La forma en que se declaró la variable lo permite?',
  },
  {
    line: "const opciones: object = {idioma: 'es', tema: 'oscuro'};",
    targetIndex: 2,
    why: '`object` acepta cualquier objeto y no dice qué propiedades tiene: después, `opciones.idioma` da error. Un tipo con la forma (`{idioma: string; tema: string}`) o la inferencia sí lo describen.',
    hint: 'Con ese tipo, ¿TypeScript sabe que `opciones` tiene una propiedad `idioma`?',
  },
];

export const DECLARATION_TEMPLATE = '{{kw}} intentosRestantes: {{type}} = 3;';
export const DECLARATION_SLOTS: FillBlankSlot[] = [
  {id: 'kw', answer: 'let'},
  {id: 'type', answer: 'number'},
];
export const DECLARATION_BANK = ['const', 'let', 'number', 'any', 'string'];
export const DECLARATION_EXPLANATION =
  'Esta variable guarda cuántos intentos quedan y se va descontando en cada intento fallido — como el valor cambia, tiene que ser `let`, no `const`. Y como cuenta una cantidad, el tipo correcto es `number`: `any` apagaría el chequeo de tipos, y `string` no es lo que se está contando.';
