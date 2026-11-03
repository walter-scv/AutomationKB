import type {ClassifyItem} from '@site/src/components/Classify';
import type {MultiSelectQuestion} from '@site/src/components/MultiSelect';
import type {CodeLine} from '@site/src/components/FindInCode';
import type {DecisionNode} from '@site/src/components/DecisionPath';

export const LAYER_COLUMNS = ['Componente', 'API o integración', 'UI'];

export const LAYER_ITEMS: ClassifyItem[] = [
  {
    code: 'El cálculo de envío gratis para compras de más de $50.000, con doce combinaciones de monto y provincia.',
    column: 0,
    why: 'Es una regla de cálculo pura: una función recibe monto y provincia y devuelve el costo. Las doce combinaciones corren en milisegundos sin servidor ni navegador.',
    hint: '¿Hace falta un navegador, o alcanza con darle números a una función?',
  },
  {
    code: 'Que el botón «Pagar» quede deshabilitado mientras el formulario de tarjeta muestra errores.',
    column: 2,
    why: 'Lo que se verifica es el estado de un elemento de la pantalla. Solo un test que mira la interfaz puede comprobar que el botón está deshabilitado.',
    hint: '¿Lo que se comprueba es un cálculo, o algo que la persona ve?',
  },
  {
    code: 'Que el servicio de stock responda con un error cuando se piden más unidades de las disponibles.',
    column: 1,
    why: 'Se verifica la respuesta de un servicio. Se le envía el pedido directamente y se lee la respuesta, sin abrir ninguna pantalla.',
    hint: '¿Quién da la respuesta que se verifica: una pantalla o un servicio?',
  },
  {
    code: 'Que el total del carrito se redondee a dos decimales.',
    column: 0,
    why: 'Es una regla de cálculo aislada. Probarla por la UI obligaría a armar un carrito entero por cada valor a redondear.',
    hint: '¿Cuántos valores distintos hay que probar, y cuánto tarda cada uno por la interfaz?',
  },
  {
    code: 'Que al confirmar una compra, el pedido aparezca en «Mis pedidos» con el total correcto.',
    column: 2,
    why: 'Es un flujo de punta a punta: atraviesa el carrito, el pago, el servicio de pedidos y la pantalla que los lista. Es el tipo de test que queda arriba de la pirámide.',
    hint: '¿Cuántas piezas de la aplicación recorre esta verificación?',
  },
  {
    code: 'Que el servicio de pedidos guarde un pedido nuevo con estado «pendiente».',
    column: 1,
    why: 'Se verifica lo que hace un servicio con un pedido, sin interfaz. Se envía el pedido y se consulta el estado guardado.',
    hint: '¿Hace falta ver una pantalla para saber qué estado quedó guardado?',
  },
  {
    code: 'Que la función que valida el formato del CUIT rechace un número de diez dígitos.',
    column: 0,
    why: 'Aunque el CUIT se carga en un formulario, lo que se verifica es una función que recibe un texto y responde si es válido. Se prueba aislada, sin servidor ni navegador.',
    hint: 'El dato se carga en un formulario, pero ¿qué es exactamente lo que se verifica?',
  },
  {
    code: 'Que el mensaje de falta de stock aparezca debajo del producto y no en un aviso emergente.',
    column: 2,
    why: 'Lo que importa es dónde y cómo se muestra el mensaje en la pantalla. El servicio puede responder bien y la pantalla mostrarlo mal.',
    hint: '¿La verificación es sobre el contenido de una respuesta, o sobre cómo se presenta?',
  },
  {
    code: 'Que el servicio de cupones rechace un cupón vencido.',
    column: 1,
    why: 'La respuesta del servicio a un cupón vencido se comprueba enviándole el cupón directamente, sin pasar por el carrito.',
    hint: '¿Hace falta recorrer el carrito para saber qué responde el servicio?',
  },
];

export const AUTOMATION_QUESTIONS: MultiSelectQuestion[] = [
  {
    prompt: 'Un equipo presenta este plan para automatizar la regresión de un homebanking. ¿Qué puntos del plan muestran alguno de los riesgos de automatizar? Marcá todos los que correspondan.',
    options: [
      {
        text: 'El presupuesto contempla dos meses para escribir los tests y ninguna hora para actualizarlos cuando cambien las pantallas.',
        correct: true,
        why: 'Estimación imprecisa: un test de UI se actualiza cada vez que cambia la pantalla que recorre. Ignorar el mantenimiento subestima el costo real.',
      },
      {
        text: 'La regresión de transferencias, que hoy lleva un día por versión, va a correr en cada cambio que se suba.',
        correct: false,
        why: 'Es un beneficio: feedback más rápido sobre una tarea repetitiva.',
      },
      {
        text: 'Una vez automatizada la suite, el equipo deja de hacer sesiones exploratorias porque «la herramienta ya lo cubre».',
        correct: true,
        why: 'Depender demasiado de la herramienta: un test automatizado solo comprueba lo que se le pidió, y deja de haber quien busque lo que nadie anticipó.',
      },
      {
        text: 'Se va a usar una librería de código abierto que no publica una versión nueva hace tres años.',
        correct: true,
        why: 'Software de código abierto abandonado: si deja de ser compatible con los navegadores nuevos, nadie la va a corregir.',
      },
      {
        text: 'Los casos se van a ejecutar siempre con los mismos datos y en el mismo orden de pasos.',
        correct: false,
        why: 'Es un beneficio: consistencia. Desaparecen los errores de quien ejecuta, como saltear un paso.',
      },
      {
        text: 'El plan promete que con la herramienta nueva cualquier persona va a automatizar un caso en cinco minutos.',
        correct: true,
        why: 'Expectativas irreales sobre la facilidad de uso de la herramienta.',
      },
    ],
  },
  {
    prompt: 'El test automatizado de una transferencia entre cuentas propias pasa. Verifica que aparezca «Transferencia realizada» y que el saldo de origen baje en el monto transferido. ¿Qué se puede afirmar a partir de ese resultado? Marcá todo lo que corresponda.',
    options: [
      {
        text: 'El mensaje y el nuevo saldo de origen coincidieron con lo esperado en esta corrida.',
        correct: true,
        why: 'Es exactamente lo que el test comprueba: esas dos verificaciones.',
      },
      {
        text: 'La pantalla de transferencias no tiene problemas visuales.',
        correct: false,
        why: 'El test no mira nada más que lo que se le pidió. Un botón tapado o un texto cortado pasan inadvertidos.',
      },
      {
        text: 'El saldo de la cuenta destino subió en el monto transferido.',
        correct: false,
        why: 'El test no verifica la cuenta destino. Si no está en el resultado esperado, el test no lo comprobó.',
      },
      {
        text: 'Los pasos se ejecutaron en el orden en que están escritos en el código del test.',
        correct: true,
        why: 'Es la consistencia que da la automatización: el código ejecuta siempre los mismos pasos, en el mismo orden.',
      },
    ],
  },
];

export const FIRST_RULE_LABELS = ['No se valida solo', 'No es independiente', 'No es rápido', 'No es repetible'];

export const FIRST_LINES: CodeLine[] = [
  {
    code: 'El test de alta de un plazo fijo usa la fecha de hoy como fecha de constitución y compara contra un vencimiento escrito a mano: «30/11».',
    rule: 4,
    why: 'El vencimiento esperado sale de una fecha que cambia cada día. Pasa el día en que se escribió y falla al siguiente sin que el sistema haya cambiado.',
    hint: '¿Qué pasa si se corre el mismo test mañana?',
  },
  {
    code: 'El test de pago de servicios crea su propia factura de prueba antes de pagarla y la elimina al terminar.',
    rule: 0,
    why: 'Prepara sus datos y los limpia, así que no depende de ningún otro test ni del orden en que corran.',
    hint: '¿Depende de algo que haya dejado otro test?',
  },
  {
    code: 'El test de débito automático guarda una captura del comprobante en una carpeta compartida, y una persona del equipo las revisa cada lunes.',
    rule: 1,
    why: 'Guardar la captura no es compararla con nada: el test termina igual sea cual sea el comprobante, y el veredicto lo da una persona días después.',
    hint: '¿Quién decide si el comprobante es correcto, y cuándo?',
  },
  {
    code: 'El test de baja de una tarjeta usa la tarjeta que dio de alta el test anterior de la misma suite.',
    rule: 2,
    why: 'Si se corre solo, en paralelo o en otro orden, la tarjeta no existe y el test falla aunque la baja funcione.',
    hint: '¿Qué pasa si este test corre primero?',
  },
  {
    code: 'El test de login espera un minuto fijo después de ingresar, «por si la pantalla tarda».',
    rule: 3,
    why: 'Agrega un minuto a cada corrida aunque la pantalla cargue en un segundo. Multiplicado por la suite, se deja de correr seguido.',
    hint: '¿Cuánto tarda este test cuando la pantalla carga enseguida?',
  },
  {
    code: 'El test de transferencias compara el saldo final contra el saldo que leyó al empezar, menos el monto transferido.',
    rule: 0,
    why: 'El resultado esperado se calcula a partir del estado real al empezar. Da el mismo veredicto con cualquier saldo inicial.',
    hint: '¿El resultado depende del saldo que tenga la cuenta ese día?',
  },
  {
    code: 'El test de cambio de domicilio tarda cuatro segundos y termina comparando el domicilio guardado con el ingresado.',
    rule: 0,
    why: 'Cuatro segundos es razonable para un flujo de UI, y termina en una comparación que decide sola si pasa o falla.',
    hint: '¿Hay algo que obligue a una persona a intervenir para saber el resultado?',
  },
  {
    code: 'El test de compra de dólares espera un total calculado con la cotización «$1.050», escrita a mano, mientras la cotización real cambia varias veces por día.',
    rule: 4,
    why: 'El resultado esperado depende de un dato externo que cambia: según la hora en que corra, el mismo test pasa o falla sin que la compra esté rota.',
    hint: '¿Da lo mismo correrlo a las 10 que a las 16?',
  },
];

export const PLAN_START = 'first';
export const PLAN_NODES: Record<string, DecisionNode> = {
  first: {
    id: 'first',
    situation: 'Te piden la primera suite de UI de una app de turnos médicos. Hay tiempo para un solo caso esta semana. ¿Con cuál empezás?',
    options: [
      {
        text: 'Revisar que la agenda rediseñada se vea clara para personas mayores.',
        correct: false,
        why: 'Es un juicio de usabilidad sin un resultado exacto. Se evalúa con personas, no con una comparación automática.',
      },
      {
        text: 'Las 30 combinaciones de la regla de cancelación, una por test de UI.',
        correct: false,
        why: 'Son combinaciones de una regla: se prueban mucho más rápido en la capa de componente. Por la UI, cada una exige ingresar y navegar.',
      },
      {
        text: 'Reservar un turno disponible y ver la confirmación, que se corre en cada versión.',
        correct: true,
        why: 'Se repite en cada versión, tiene resultado exacto y es el flujo principal de la app. Es el candidato más claro.',
        next: 'flaky',
      },
    ],
  },
  flaky: {
    id: 'flaky',
    situation: 'El test de reservar turno pasa siempre en tu máquina, pero en el servidor de integración falla una de cada cinco corridas sin que la app haya cambiado. ¿Qué hacés?',
    options: [
      {
        text: 'Configurar reintentos automáticos para que vuelva a correr hasta pasar.',
        correct: false,
        why: 'El test pasa al segundo intento y el fallo deja de molestar, pero su causa sigue ahí. El equipo aprende a ignorarlo.',
      },
      {
        text: 'Revisar qué cambia entre una corrida que pasa y una que falla.',
        correct: true,
        why: 'Un fallo intermitente sin cambios en la app tiene una causa. Hasta encontrarla, el resultado del test no es confiable.',
        next: 'cause',
      },
      {
        text: 'Atribuirlo al servidor de integración, porque en tu máquina pasa siempre.',
        correct: false,
        why: 'Que pase en tu máquina no descarta que el test tenga el problema: el servidor puede correrlo en otras condiciones, por ejemplo junto a otras corridas. Sin investigar, es una suposición.',
      },
    ],
  },
  cause: {
    id: 'cause',
    situation: 'Encontrás la causa: el test reserva siempre el turno de las 10:00 del 15/11, y cuando dos corridas coinciden, la segunda lo encuentra ocupado. ¿Cómo lo corregís?',
    options: [
      {
        text: 'Agregar una espera de diez segundos antes de reservar.',
        correct: false,
        why: 'La espera no libera el turno: si otra corrida lo tomó, sigue ocupado. Además vuelve más lento al test.',
      },
      {
        text: 'Correr el test siempre último, cuando no queda otra corrida en curso.',
        correct: false,
        why: 'El test seguiría dependiendo de lo que hacen las demás corridas. No es independiente.',
      },
      {
        text: 'Que el test busque un turno libre, lo reserve y lo cancele al terminar.',
        correct: true,
        why: 'El test prepara y limpia sus propios datos: se vuelve independiente y repetible, corra cuando corra.',
        next: 'combos',
      },
    ],
  },
  combos: {
    id: 'combos',
    situation: 'Producto pide sumar a la suite de UI las 30 combinaciones de la regla de cancelación: sin cargo con más de 24 h de anticipación, con cargo con menos, y excepciones por tipo de cobertura. ¿Qué proponés?',
    options: [
      {
        text: 'Probar las combinaciones en la capa de componente y sumar por UI una cancelación sin cargo y una con cargo.',
        correct: true,
        why: 'Las combinaciones de una regla van abajo de la pirámide, donde son rápidas. Por la UI alcanza con comprobar que la persona ve el resultado en los dos casos principales.',
      },
      {
        text: 'Escribir los 30 tests de UI, porque producto los pidió.',
        correct: false,
        why: 'Suma decenas de minutos de ejecución y 30 tests que mantener por una regla que se prueba en milisegundos más abajo.',
      },
      {
        text: 'No automatizarlas, porque son demasiadas.',
        correct: false,
        why: 'Muchas combinaciones de una regla exacta son, justamente, un buen candidato para automatizar, solo que en la capa correcta.',
      },
    ],
  },
};
export const PLAN_EXPLANATION =
  'Primero se elige qué automatizar (repetitivo, exacto, estable), después se investiga un fallo intermitente en vez de taparlo, se lo corrige haciendo al test independiente, y cada verificación se ubica en la capa más baja de la pirámide que la cubre.';
