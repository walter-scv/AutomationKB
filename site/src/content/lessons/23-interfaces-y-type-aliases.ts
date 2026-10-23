import type {CodeLine} from '@site/src/components/FindInCode';
import type {QuizQuestion} from '@site/src/components/Quiz';

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

export const PRACTICE_RULE_LABELS = [
  'Todas las propiedades opcionales sin necesidad',
  'Nombre de tipo genérico, no dice qué representa',
  'Usa `any` en vez de declarar el tipo',
];

export const PRACTICE_LINES: CodeLine[] = [
  {
    code: "interface Pedido {\n  numero: number;\n  total: number;\n  medioDePago: 'tarjeta' | 'efectivo';\n}",
    rule: 0,
    why: 'Todas las propiedades son obligatorias y el nombre dice qué entidad representa. La unión de `medioDePago` limita los valores posibles en vez de aceptar cualquier texto.',
  },
  {
    code: 'function totalizar(pedidos: any[]): number {\n  return pedidos.reduce((acc, pedido) => acc + pedido.total, 0);\n}',
    rule: 3,
    why: '`any[]` parece un tipo, pero apaga el chequeo de cada elemento: si un pedido no tiene `total`, TypeScript no avisa y la suma da `NaN` al ejecutar. `Pedido[]` sí permitiría detectarlo.',
    hint: '¿Qué revisa TypeScript sobre los elementos de un array tipado como `any[]`?',
  },
  {
    code: "interface DatosDeFactura {\n  cuit?: string;\n  importe?: number;\n  fecha?: string;\n}\nfunction emitir(datos: DatosDeFactura): string {\n  return datos.cuit + '-' + datos.importe + '-' + datos.fecha;\n}",
    rule: 1,
    why: 'La función usa las tres propiedades como si siempre estuvieran, pero las tres están marcadas opcionales. TypeScript no va a avisar si falta alguna y el resultado va a incluir `undefined`.',
    hint: '¿La función puede funcionar si alguna de esas propiedades no viene?',
  },
  {
    code: "type EstadoDePago = 'pendiente' | 'aprobado' | 'rechazado';",
    rule: 0,
    why: 'El alias tiene un nombre específico y limita los valores a tres exactos. No hay propiedades opcionales ni `any` que apaguen el chequeo.',
  },
  {
    code: 'interface Data {\n  nombre: string;\n  email: string;\n}',
    rule: 2,
    why: '`Data` no dice qué representa: con varias interfaces en el proyecto, quien lo lee tiene que abrir la declaración para saber si son usuarios, pedidos o formularios. `DatosDeContacto` diría qué entidad nombra.',
    hint: '¿El nombre del tipo alcanza para saber qué entidad describe?',
  },
  {
    code: 'function parsear(texto: string): any {\n  return JSON.parse(texto);\n}',
    rule: 3,
    why: 'El parámetro está tipado, pero el retorno es `any`: todo lo que se haga con el resultado queda sin chequeo. Un tipo como `Configuracion` o `Pedido` obligaría a validar la forma antes de usarla.',
    hint: '¿El tipo del retorno le permite a TypeScript revisar cómo se usa el resultado?',
  },
  {
    code: 'type Direccion = {\n  calle: string;\n  ciudad: string;\n  piso?: string;\n};',
    rule: 0,
    why: 'Solo `piso` es opcional, y eso es correcto: una dirección puede no tener piso, pero siempre tiene calle y ciudad. El resto obligatorio permite que TypeScript avise si falta.',
  },
  {
    code: "interface Usuario {\n  id?: string;\n  email?: string;\n}\nfunction buscar(id: string): Usuario {\n  return {id, email: id + '@mail.com'};\n}",
    rule: 1,
    why: 'La función siempre devuelve `id` y `email`, y siempre recibe un `id`; marcarlos opcionales hace que TypeScript no avise si alguien construye un `Usuario` sin ellos. Lo opcional tiene que reflejar lo que de verdad puede faltar.',
    hint: '¿Hay algún caso en el que estos datos puedan no estar?',
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
