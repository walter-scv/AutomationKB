import type {MatchItem} from '@site/src/components/Match';
import type {CodeLine} from '@site/src/components/FindInCode';
import type {FillBlankSlot} from '@site/src/components/FillBlank';
import type {QuizQuestion} from '@site/src/components/Quiz';
import type {SpotTokenRound} from '@site/src/components/SpotToken';

export const DECLARED_RULE_LABELS = [
  'No declara la forma del objeto que recibe',
  'Repite la misma forma de objeto en vez de nombrarla una sola vez',
];

export const DECLARED_LINES: CodeLine[] = [
  {
    code: "function registrar(datos: {email: string; contrasena: string}): boolean {\n  return datos.email.includes('@') && datos.contrasena.length >= 8;\n}",
    rule: 0,
    why: 'La forma inline aparece una sola vez y describe exactamente lo que la función necesita. Nombrarla con una interface no agregaría nada mientras no se repita en otro lugar.',
  },
  {
    code: "function registrar(datos: {email: string; contrasena: string}) {\n  return datos.email.includes('@');\n}\nfunction actualizar(datos: {email: string; contrasena: string}) {\n  return datos.contrasena.length >= 8;\n}",
    rule: 2,
    why: 'La misma forma está escrita dos veces. Si mañana se agrega `telefono`, hay que acordarse de tocar las dos anotaciones; una interface `Credenciales` lo resolvería en un solo lugar.',
    hint: '¿Esta forma de objeto aparece una sola vez en el fragmento o se repite?',
  },
  {
    code: 'function calcularTotal(pedido) {\n  return pedido.lineas.reduce((acc, linea) => acc + linea.precio, 0);\n}',
    rule: 1,
    why: 'El parámetro no tiene tipo: queda como `any` implícito y TypeScript no puede avisar si `pedido` no tiene `lineas` o si `linea.precio` no es un número. El error aparece recién al ejecutar.',
    hint: '¿Qué sabe TypeScript sobre `pedido` antes de ejecutar la función?',
  },
  {
    code: "interface DireccionDeEnvio {\n  calle: string;\n  ciudad: string;\n  codigoPostal: string;\n}\nfunction etiquetar(direccion: DireccionDeEnvio): string {\n  return direccion.calle + ', ' + direccion.ciudad;\n}",
    rule: 0,
    why: 'La interface nombra la forma una sola vez y la función la usa como tipo. Cualquier llamada que omita `codigoPostal` o lo pase como número va a marcar error al escribir el código.',
  },
  {
    code: "type EstadoDePedido = 'pendiente' | 'enviado' | 'entregado';\nfunction avanzar(estado: EstadoDePedido): EstadoDePedido {\n  return estado === 'pendiente' ? 'enviado' : 'entregado';\n}",
    rule: 0,
    why: "El alias limita el estado a tres valores exactos: escribir `'enviadO'` o `'cancelado'` sería un error de tipos. Además el nombre dice qué representa.",
  },
  {
    code: 'function registrar({email, contrasena}) {\n  return email.includes(\'@\') && contrasena.length >= 8;\n}',
    rule: 1,
    why: 'Desestructurar el parámetro no le da un tipo: tanto `email` como `contrasena` quedan como `any` implícito. Que el código se vea moderno no reemplaza declarar la forma que se espera.',
    hint: '¿La desestructuración declara qué propiedades y tipos espera el parámetro?',
  },
  {
    code: 'function crear(datos: {nombre: string; email: string}) {\n  return {...datos, activo: true};\n}\nfunction editar(datos: {nombre: string; email: string}) {\n  return {...datos, activo: false};\n}',
    rule: 2,
    why: 'La forma `{nombre, email}` se repite en las dos funciones. Si se agrega `telefono`, hay que cambiarla en ambos lugares; una interface o un type alias evitaría ese olvido.',
    hint: 'Si mañana cambia la forma del objeto, ¿cuántos lugares habría que tocar?',
  },
];

export const DECL_TOKEN_PROMPT = '¿Qué palabra de esta línea hay que cambiar para que el tipo sea útil?';
export const DECL_TOKEN_ROUNDS: SpotTokenRound[] = [
  {
    line: 'interface Data { nombre: string; email: string; }',
    targetIndex: 1,
    why: '`Data` no dice qué entidad representa: con varias interfaces en el proyecto, obliga a abrirla para saber de qué se trata. `Contacto` o `Cliente` lo dirían.',
    hint: 'Si ves este tipo usado en otro archivo, ¿sabés qué representa sin abrirlo?',
  },
  {
    line: 'function totalizar(pedidos: any[]): number {',
    targetIndex: 2,
    why: '`any[]` apaga el chequeo justo en el dato que la función usa: si un pedido no tiene `total`, el error aparece en ejecución. `Pedido[]` lo mantiene.',
    hint: 'Si un elemento de `pedidos` no tiene la propiedad que la función usa, ¿quién avisa antes de ejecutar?',
  },
  {
    line: "type Info = 'pendiente' | 'aprobado' | 'rechazado';",
    targetIndex: 1,
    why: 'La unión está bien, pero `Info` no dice que son los estados de un pago. `EstadoDePago` lo dice sin tener que leer los valores.',
    hint: 'Los valores están bien. ¿El nombre dice qué representan?',
  },
];

export const CLOSING_QUIZ: QuizQuestion[] = [
  {
    question: 'Un compañero pone `any` en un parámetro para que TypeScript deje de marcar un error. ¿Qué conviene revisar?',
    options: [
      {
        text: 'Si conviene cambiar `any` por `object`, que es un tipo más preciso.',
        correct: false,
        why: '`object` también es genérico: no dice qué propiedades tiene y sigue sin permitir un chequeo útil. El error queda igual de escondido.',
      },
      {
        text: 'Si hay que agregar un cast `as any` para que el error desaparezca del todo.',
        correct: false,
        why: 'Un cast no arregla la forma del dato: solo mueve el problema y lo vuelve más difícil de encontrar cuando aparezca al ejecutar.',
      },
      {
        text: 'Si la forma del objeto se puede declarar con una interface y corregir el dato real.',
        correct: true,
        why: 'El error suele señalar que el dato no tiene la forma esperada. Declarar esa forma permite entender qué falta y conservar el chequeo en los usos posteriores.',
      },
    ],
  },
  {
      question: 'Una función recibe un único parámetro `email: string`. ¿Hace falta declarar una interface para eso?',
      options: [
        {
          text: 'No: un `string` ya tiene su tipo y no hay una forma de objeto que nombrar.',
          correct: true,
          why: 'Una interface sirve para nombrar la forma de un objeto con varias propiedades. Para un valor simple, el tipo `string` ya dice todo lo necesario.',
        },
        {
          text: 'Sí: una interface documenta mejor cualquier parámetro, aunque sea un valor simple.',
          correct: false,
          why: 'Declarar una interface para un solo `string` no agrega información: solo suma una indirección para llegar al mismo tipo que ya estaba escrito.',
        },
        {
          text: 'Sí, pero conviene un `type` alias en vez de una interface para un valor simple.',
          correct: false,
          why: 'El problema no es interface contra type: ninguno de los dos aporta algo cuando lo que hay que tipar es un `string` suelto.',
        },
      ],
    }
];

export const SHIPMENT_TEMPLATE =
  "type EstadoDeEnvio = 'preparando' | 'en camino' | 'entregado';\n\ninterface Envio {\n  codigo: string;\n  estado: {{estado}};\n  observaciones{{opt}} string;\n  pesoEnKilos: {{peso}};\n}\n\ninterface EnvioInternacional {{ext}} Envio {\n  paisDestino: string;\n}";
export const SHIPMENT_SLOTS: FillBlankSlot[] = [
  {id: 'estado', answer: 'EstadoDeEnvio'},
  {id: 'opt', answer: '?:'},
  {id: 'peso', answer: 'number'},
  {id: 'ext', answer: 'extends'},
];
export const SHIPMENT_BANK = ['string', ':', 'extends', 'number', 'any', 'EstadoDeEnvio', '|', '?:'];
export const SHIPMENT_EXPLANATION =
  '`estado` usa el type alias `EstadoDeEnvio`: con `string` se aceptaría cualquier texto, incluido un typo como `\'entregao\'`. `observaciones` lleva `?:` porque es la única propiedad que puede faltar; con `:` TypeScript obligaría a cargarla siempre. Y el peso es una cantidad, así que es `number` — `any` apagaría el chequeo justo en la propiedad que se usa para hacer cuentas. `EnvioInternacional` extiende a `Envio`: tiene sus cuatro propiedades más `paisDestino`, sin repetirlas.';

export const NARROW_LEFT: MatchItem[] = [
  {id: 'typeof', text: '`stock` es `number | string` porque un proveedor lo manda como texto, y hay que sumarlo.'},
  {id: 'null', text: '`supervisor` es `Empleado | null`, y hay que mostrar su nombre.'},
  {id: 'array', text: '`etiquetas` es `string | string[]`, y hay que recorrer todas.'},
  {id: 'disc', text: '`envio` es `{ modo: \'retiro\'; sucursal: string } | { modo: \'domicilio\'; direccion: string }`, y hay que mostrar la dirección.'},
];
export const NARROW_RIGHT: MatchItem[] = [
  {id: 'disc', text: "`if (envio.modo === 'domicilio')`"},
  {id: 'array', text: '`if (Array.isArray(etiquetas))`'},
  {id: 'typeof', text: "`if (typeof stock === 'string')`"},
  {id: 'null', text: '`if (supervisor !== null)`'},
];
export const NARROW_WHY: Record<string, string> = {
  typeof: 'Para distinguir tipos básicos se usa `typeof`: si es `\'string\'`, se convierte con `Number(...)` antes de sumar.',
  null: 'Un valor que puede ser `null` se compara directamente; dentro del `if`, TypeScript sabe que es un `Empleado`.',
  array: '`typeof` de un array da `\'object\'`; para distinguirlo de un valor suelto se usa `Array.isArray`.',
  disc: 'La propiedad `modo` distingue las dos formas: solo cuando vale `\'domicilio\'` existe `direccion`.',
};
