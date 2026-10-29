import type {TerminalStep} from '@site/src/components/Terminal';
import type {CodeLine} from '@site/src/components/FindInCode';
import type {QuizQuestion} from '@site/src/components/Quiz';
import type {MatchItem} from '@site/src/components/Match';

export const GROUPING_RULE_LABELS = ['Son variables sueltas que en realidad describen la misma entidad'];

export const GROUPING_LINES: CodeLine[] = [
  {
    code: "const versionDeLaApp = '2.4.1';\nconst versionDelEsquema = 3;",
    rule: 0,
    why: 'Las dos hablan de versiones, pero son cosas distintas (la app y el esquema de datos) y no se usan juntas. Agruparlas solo porque comparten la palabra `version` no aclara qué representa cada una.',
  },
  {
    code: "const nombreParaElEmail = 'Ana';\nconst emailParaElEmail = 'ana@mail.com';\nawait enviarBienvenida(nombreParaElEmail, emailParaElEmail);",
    rule: 1,
    why: 'Los dos valores viajan siempre juntos como destinatario del mismo email: la función los recibe a la vez y en un orden que hay que recordar. Un objeto `destinatario` los agruparía y evitaría confundir un dato con el otro.',
    hint: '¿Estos valores se usan siempre juntos, o cada uno tiene vida propia en otras partes del código?',
  },
  {
    code: "const direccionDeFacturacion = {\n  calle: 'Mitre 45',\n  ciudad: 'Rosario',\n  codigoPostal: '2000',\n};",
    rule: 0,
    why: 'Ya está agrupada y las tres propiedades describen la misma dirección. El nombre del objeto dice qué entidad representa, así que no hay nada para cambiar acá.',
  },
  {
    code: "const emailIngresado = 'ana@mail.com';\nconst contrasenaIngresada = 'Abcd1234!';\nconst terminosAceptados = true;\nawait registrarUsuario(emailIngresado, contrasenaIngresada, terminosAceptados);",
    rule: 1,
    why: 'Los tres valores son el contenido del mismo formulario y se envían juntos: si mañana se agrega un campo, hay que cambiar la firma de la función y cada llamada. Un objeto `datosDeRegistro` los mantiene unidos.',
    hint: '¿Qué pasa con la firma de `registrarUsuario` si mañana se agrega un cuarto dato del mismo formulario?',
  },
  {
    code: "const reintentosMaximos = 3;\nconst emailDeSoporte = 'soporte@ejemplo.com';",
    rule: 0,
    why: 'Son dos valores sin relación (una política de reintentos y una dirección de contacto) que coinciden en el archivo, pero no viajan juntos ni describen la misma entidad.',
  },
  {
    code: "const resumenDelPedido = {\n  numero: 1042,\n  total: 15900,\n  estado: 'en preparación',\n};",
    rule: 0,
    why: 'Las tres propiedades son parte del mismo pedido y el nombre del objeto lo dice. Ya está agrupado como corresponde.',
  },
  {
    code: "const codigoDelProducto = 'TEC-01';\nconst descripcionDelProducto = 'Teclado USB';\nconst precioDelProducto = 15000;",
    rule: 1,
    why: 'Comparten el sufijo `DelProducto` y describen el mismo ítem, pero siguen siendo tres variables sueltas. Nombrarlas parecido no reemplaza agruparlas en un objeto `producto`.',
    hint: '¿El nombre repetido alcanza para que viajen juntos, o siguen siendo tres valores separados?',
  },
];

export const NAMING_LEFT: MatchItem[] = [
  {id: 'domicilio', text: "`const registro = {calle: 'Mitre', numero: 45, piso: '3B'}`"},
  {id: 'libro', text: "`const obj = {titulo: 'Rayuela', autor: 'Cortázar', paginas: 600}`"},
  {id: 'sesion', text: "`const info = {usuario: 'ana', token: 'x9f2', expiraEn: '2026-06-30'}`"},
  {id: 'conexion', text: "`valorSecundario: 'inalámbrico'`, dentro de `const teclado = {modelo: 'K120', precio: 15000, valorSecundario: 'inalámbrico'}`"},
];
export const NAMING_RIGHT: MatchItem[] = [
  {id: 'sesion', text: '`sesion`'},
  {id: 'conexion', text: '`conexion`'},
  {id: 'domicilio', text: '`domicilio`'},
  {id: 'libro', text: '`libro`'},
];
export const NAMING_WHY: Record<string, string> = {
  domicilio: 'Calle, número y piso describen un domicilio: `registro` no dice nada de eso.',
  libro: 'Título, autor y páginas son de un libro: `obj` obliga a leer las propiedades para entenderlo.',
  sesion: 'Usuario, token y vencimiento son los datos de una sesión: `info` es tan genérico como `datos`.',
  conexion: 'El nombre de una propiedad también tiene que decir qué guarda: "inalámbrico" es el tipo de conexión del teclado.',
};

export const CLOSING_QUIZ: QuizQuestion[] = [
  {
    question: 'Tenés un objeto `credenciales` con una propiedad `token`. ¿Cómo accedés a ese valor?',
    options: [
      {
        text: '`credenciales[0]`',
        correct: false,
        why: 'Esa forma accede a una posición de un array. Un objeto no tiene índices numéricos por el solo hecho de ser objeto, así que devuelve `undefined`.',
      },
      {
        text: '`credenciales.token`',
        correct: true,
        why: 'El punto accede a una propiedad del objeto por su nombre, sin depender del orden en que se declaró.',
      },
      {
        text: '`credenciales.token()`',
        correct: false,
        why: '`token` guarda un valor, no una función. Agregarle paréntesis intenta llamarlo y falla salvo que el valor sea realmente una función.',
      },
    ],
  },
  {
    question: 'Una función devuelve `nombre`, `email` y `fechaDeAlta` de un mismo usuario. ¿Qué conviene hacer?',
    options: [
      {
        text: 'Devolver un objeto `usuario` con esas tres propiedades.',
        correct: true,
        why: 'Los tres valores describen la misma entidad y viajan juntos: un objeto evita que quien recibe confunda el orden y deja explícito qué es cada dato.',
      },
      {
        text: 'Devolver un array con los tres valores en orden.',
        correct: false,
        why: 'El array obliga a recordar posiciones y no tiene nombres: quien lo reciba no puede saber cuál es la fecha y cuál el email sin mirar la función.',
      },
      {
        text: 'Devolver tres valores sueltos y que quien llama los junte.',
        correct: false,
        why: 'Tres valores sueltos se pueden intercambiar por error y no queda claro que pertenecen a la misma entidad. Es justo el problema que un objeto evita.',
      },
    ],
  },
  {
    question: 'Tenés `const persona = {nombre: "Ana", edad: 29}` y necesitás guardar también su email. ¿Qué conviene hacer?',
    options: [
      {
        text: 'Crear una variable suelta `email` para no modificar el objeto.',
        correct: false,
        why: 'Volvería al problema original: dos lugares separados para datos de la misma entidad, sin ninguna relación visible entre ellos.',
      },
      {
        text: 'Agregar `email` a `persona`, porque describe a la misma persona.',
        correct: true,
        why: 'El email es otro dato de la misma entidad: sumarlo al objeto mantiene unidos los datos que describen a la persona y no obliga a rastrear variables sueltas.',
      },
      {
        text: 'Crear `persona2` con el email y el nombre repetido.',
        correct: false,
        why: 'Duplica la entidad: si cambia el nombre, hay que acordarse de actualizarlo en dos objetos distintos, y tarde o temprano quedan desincronizados.',
      },
    ],
  },
  {
      question:
        'Tenés `emailDeContacto` (el email de una persona) y `totalDeVentasDelMes` (una métrica del negocio). ¿Conviene agruparlos en un objeto?',
      options: [
        {
          text: 'Sí: ambos son datos de la misma persona, así que pertenecen al mismo objeto.',
          correct: false,
          why: 'El total de ventas del mes es una métrica del negocio, no una propiedad de la persona. Aunque se pueda asociar a un vendedor, no describe al contacto.',
        },
        {
          text: 'Sí: cualquier par de datos numéricos y de texto se puede agrupar para reducir variables.',
          correct: false,
          why: 'Reducir la cantidad de variables no es un objetivo por sí mismo; agrupar datos sin relación agrega una capa de acceso sin aclarar nada.',
        },
        {
          text: 'No: describen entidades distintas y no se usan siempre juntos.',
          correct: true,
          why: 'Agrupar sirve cuando los valores forman parte de la misma entidad o viajan juntos; acá el único vínculo es que están declarados cerca.',
        },
      ],
    }
];

export const ACCESS_CODE = `const carrito = {
  cliente: {
    nombre: 'Ana',
    email: 'ana@mail.com',
  },
  items: [
    {producto: 'Teclado USB', cantidad: 1},
    {producto: 'Mouse', cantidad: 2},
    {producto: 'Monitor', cantidad: 1},
  ],
};`;
export const ACCESS_ACCEPTED = ['carrito.items[1].cantidad', 'carrito.items[1].cantidad;'];
export const ACCESS_HINTS = [
  'Leé el camino de afuera hacia adentro: ¿en qué propiedad de `carrito` están los items, y en qué posición de esa lista está el del Mouse?',
  'Acordate de que los índices de un array empiezan en 0. Una vez que llegás al objeto del item, la propiedad se lee con un punto.',
];
export const ACCESS_EXPLANATION =
  '`carrito.items` es el array de items; el del Mouse es el segundo, así que su índice es `1` (el primero es `0`). `carrito.items[1]` llega a ese objeto, y `.cantidad` lee la propiedad: `2`. El índice lleva al elemento de la lista, y el punto lleva a la propiedad — igual que `pedidos[0].total` en la teoría.';

function exprVariants(...expressions: string[]): string[] {
  return expressions.flatMap((e) => [e, e + ';', `console.log(${e})`, `console.log(${e});`]);
}
export const RESERVA_STEPS: TerminalStep[] = [
  {
    instruction: "Existe const reserva = {codigo: 'H-77', noches: 3, cochera: undefined}. Leé reserva.cochera.lugar sin que el programa se detenga si no hay cochera.",
    accepted: exprVariants('reserva.cochera?.lugar'),
    hint: 'Hay un operador que, si lo de la izquierda es undefined, devuelve undefined en lugar de fallar.',
    output: 'undefined',
  },
  {
    instruction: "Ahora lo mismo, pero que devuelva 'Sin cochera' cuando no hay.",
    accepted: exprVariants("reserva.cochera?.lugar ?? 'Sin cochera'", 'reserva.cochera?.lugar ?? "Sin cochera"'),
    hint: 'Sumale a la expresión anterior el operador que elige un valor alternativo cuando el de la izquierda es undefined o null.',
    output: "'Sin cochera'",
  },
  {
    instruction: 'Extraé codigo y noches de reserva en dos variables, en una sola línea.',
    accepted: ['const {codigo, noches} = reserva', 'const {codigo, noches} = reserva;', 'const { codigo, noches } = reserva', 'const { codigo, noches } = reserva;', 'const {noches, codigo} = reserva', 'const {noches, codigo} = reserva;', 'const { noches, codigo } = reserva', 'const { noches, codigo } = reserva;'],
    hint: 'Es la desestructuración: const, los nombres de las propiedades entre llaves, igual y el objeto.',
    output: 'undefined',
  },
  {
    instruction: "Existe const copiaDelSistema = {codigo: 'H-77', noches: 3, cochera: undefined}, con los mismos datos. Comprobá si las dos reservas tienen el mismo código.",
    accepted: exprVariants('reserva.codigo === copiaDelSistema.codigo', 'copiaDelSistema.codigo === reserva.codigo'),
    hint: 'Comparar los objetos con === da false aunque tengan los mismos datos: hay que comparar la propiedad.',
    output: 'true',
  },
];
export const RESERVA_EXPLANATION =
  '`?.` corta la lectura y devuelve `undefined` cuando falta lo de la izquierda, y `??` le da un valor por defecto. La desestructuración extrae varias propiedades en una línea (en la consola, una declaración muestra `undefined`). Y `reserva === copiaDelSistema` daría `false`: son dos objetos distintos, así que se comparan sus propiedades.';
