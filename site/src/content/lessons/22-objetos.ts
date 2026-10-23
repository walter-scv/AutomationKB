import type {CodeLine} from '@site/src/components/FindInCode';
import type {QuizQuestion} from '@site/src/components/Quiz';

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

export const PRACTICE_RULE_LABELS = [
  'Nombre de objeto genérico, no dice qué entidad representa',
  'Propiedad con nombre genérico, no dice qué contiene',
  'Mezcla datos sin relación real en un mismo objeto',
];

export const PRACTICE_LINES: CodeLine[] = [
  {
    code: "const usuario = {\n  email: 'ana@mail.com',\n  rol: 'editor',\n  ultimoAcceso: '2024-05-02',\n};",
    rule: 0,
    why: '`rol` y `ultimoAcceso` parecen datos de otro tipo, pero los tres describen la misma cuenta de usuario. El nombre del objeto y el de cada propiedad dicen qué son.',
  },
  {
    code: "const sesion = {\n  usuario: 'ana',\n  expiraEn: '2024-06-30',\n  visitasDelMes: 4820,\n};",
    rule: 3,
    why: 'La sesión y las visitas del mes cambian por motivos distintos: una expira o se renueva, las otras son una métrica del panel. Meterlas en el mismo objeto hace creer que se actualizan juntas.',
    hint: '¿Todas estas propiedades cambian cuando cambia la sesión?',
  },
  {
    code: "const producto = {\n  nombre: 'Teclado USB',\n  precio: 15000,\n  valorSecundario: 'inalámbrico',\n};",
    rule: 2,
    why: '`valorSecundario` no dice qué contiene: podría ser el color, el conector o una observación. El nombre no alcanza para saberlo y obliga a rastrear dónde se usa.',
    hint: 'Si otro miembro del equipo lee solo el nombre de esa propiedad, ¿puede saber qué dato guarda?',
  },
  {
    code: "const datosDeContacto = {\n  email: 'ana@mail.com',\n  telefono: '+54 341 555-0199',\n};",
    rule: 0,
    why: '`datosDeContacto` es un nombre amplio, pero dice qué entidad agrupa y las dos propiedades son claramente parte de ella. No hay mezcla ni nombres que obliguen a adivinar.',
  },
  {
    code: "const registro = {\n  calle: 'Mitre 45',\n  ciudad: 'Rosario',\n  codigoPostal: '2000',\n};",
    rule: 1,
    why: '`registro` podría ser un usuario, un pedido o una dirección: no dice qué entidad agrupa. El nombre `direccionDeEnvio` diría lo mismo sin que nadie tenga que abrir las propiedades.',
    hint: '¿El nombre del objeto alcanza para saber qué entidad representa, o hay que leer las propiedades para descubrirlo?',
  },
  {
    code: "const reclamo = {\n  id: 'R-88',\n  estado: 'abierto',\n  detalle: 'El paquete llegó dañado',\n};",
    rule: 2,
    why: '`detalle` no dice qué guarda: podría ser una descripción, un importe o una fecha. En un reclamo, un nombre como `descripcionDelProblema` evita esa ambigüedad.',
    hint: '¿Ese nombre describe el valor, o podría contener cualquier cosa?',
  },
  {
    code: "const pedido = {\n  numero: 1042,\n  total: 15900,\n  versionDelNavegador: 'Chrome 126',\n};",
    rule: 3,
    why: 'El navegador del cliente puede interesar para métricas, pero no describe el pedido: cambia por una razón distinta y no se usa junto con el número y el total. Su lugar es otro objeto o una variable aparte.',
    hint: '¿Esa propiedad se actualizaría cuando cambia el pedido, o cuando cambia otra cosa?',
  },
  {
    code: "const datosDePago = {\n  titular: 'Ana Gómez',\n  ultimosCuatro: '4242',\n  vencimiento: '08/27',\n};",
    rule: 0,
    why: '`datosDePago` dice qué entidad representa y las tres propiedades son parte de la misma tarjeta. El nombre es amplio, pero coherente y sin datos de otra entidad.',
  },
];

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
