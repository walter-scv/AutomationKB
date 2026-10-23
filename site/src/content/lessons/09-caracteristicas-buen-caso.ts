import type {CodeLine} from '@site/src/components/FindInCode';
import type {QuizQuestion} from '@site/src/components/Quiz';

export const QUALITY_RULE_LABELS = ['No es Claro', 'No es Independiente', 'No es Verificable', 'No es Repetible'];

export const QUALITY_LINES: CodeLine[] = [
  {
    code: 'El caso da por bueno el alta solo si el email de bienvenida llega en menos de dos segundos; a fin de mes, con más carga, tarda más y falla sin que el alta esté rota.',
    rule: 4,
    why: 'El resultado depende de una condición externa que varía con la carga del servidor. Los mismos pasos dan distinto veredicto según cuándo se ejecuten.',
    hint: '¿Qué cambia entre correrlo un martes a la mañana y correrlo el último día del mes?',
  },
  {
    code: 'El caso crea su propia cuenta con un email generado en el momento y la borra al terminar; no reutiliza ninguna cuenta de otro caso.',
    rule: 0,
    why: 'Se abastece de sus propios datos y los limpia después, así que no depende de lo que haya corrido antes. Que el email sea distinto en cada corrida no cambia el resultado esperado.',
    hint: '¿Este caso depende de lo que dejó otro caso antes?',
  },
  {
    code: 'El caso pide "cargar el comprobante en el formato que acepta el sistema", y cada persona tiene que averiguar cuál es ese formato.',
    rule: 1,
    why: 'La instrucción deja una decisión abierta. Si una persona sube un PDF y otra una imagen, no están ejecutando el mismo caso.',
    hint: '¿Dos personas del equipo llegarían al mismo archivo sin preguntar?',
  },
  {
    code: 'El caso usa la fecha fija "2025-03-15" en el campo de vencimiento y compara contra el texto exacto "Pago aprobado".',
    rule: 0,
    why: 'La fecha fija hace que la corrida no dependa del día en que se ejecuta, y el texto exacto se puede confirmar sin opinar.',
    hint: '¿El resultado puede variar según el día en que se ejecute?',
  },
  {
    code: 'El caso asume que el pedido "#4412" ya lo creó el caso de carrito, que suele correr antes en la misma suite.',
    rule: 2,
    why: 'Si se ejecuta solo, o si el caso de carrito cambió, este no puede arrancar. Depende de un estado que dejó otro caso, no de su propia precondición.',
    hint: '¿Qué pasa si alguien corre este caso solo, en una base limpia?',
  },
  {
    code: 'El paso final pide que el panel quede "prolijo y ordenado", y dos personas revisan por separado si eso se cumple.',
    rule: 3,
    why: '"Prolijo" no es un hecho: cada persona puede mirar elementos distintos y llegar a veredictos opuestos sobre la misma pantalla.',
    hint: '¿Cómo se escribe qué significa "prolijo" para que dos personas coincidan?',
  },
  {
    code: 'El caso espera el texto exacto "Contraseña actualizada" y la URL "/login"; la cuenta "qa_09@mail.com" la crea la precondición si no existe.',
    rule: 0,
    why: 'El resultado es un hecho verificable y los datos que necesita los prepara el propio caso, así que no depende de otro ni de la hora.',
    hint: '¿Este caso depende de algo externo o de otro caso?',
  },
];

export const TROUBLESHOOT_RULE_LABELS = ['No es Verificable: el resultado no es objetivo', 'No es Claro: los pasos son ambiguos', 'No es Independiente: falta una precondición'];

export const TROUBLESHOOT_LINES: CodeLine[] = [
  {
    code: 'Una persona corre el caso en una base recién sembrada y ve "Cuenta creada"; otra lo corre después de otro caso y ve "El email ya está registrado". El caso no menciona cuentas existentes.',
    rule: 3,
    why: 'Las dos ejecuciones parten de estados distintos. El caso nunca declaró si la cuenta tenía que existir, así que el resultado cambia por el punto de partida.',
    hint: '¿Desde qué estado arranca el sistema en cada una de las dos corridas?',
  },
  {
    code: 'Dos personas completan el campo "monto" con valores distintos porque el paso dice "ingresar un monto razonable"; una recibe un error de límite y la otra no.',
    rule: 2,
    why: '"Razonable" no fija un valor. Cada persona elige un número y el sistema responde distinto, sin que nadie haya cambiado el caso.',
    hint: '¿Las dos personas hicieron exactamente la misma acción?',
  },
  {
    code: 'Una persona corre el caso por la mañana y otra por la tarde; las dos ven el mismo texto "Pedido confirmado" y el mismo número de orden.',
    rule: 0,
    why: 'El caso no depende de la hora ni de datos externos: mismo paso, mismo hecho verificable, mismo resultado.',
    hint: '¿El resultado cambió entre las dos corridas?',
  },
  {
    code: 'El resultado dice "el panel se ve actualizado" y una persona lo da por bueno mientras la otra espera a que aparezca el número nuevo.',
    rule: 1,
    why: '"Se ve actualizado" no dice qué mirar. Una persona confirma con el color y otra con el dato, y las dos creen haber verificado lo mismo.',
    hint: '¿Qué hecho concreto confirma que el panel se actualizó?',
  },
  {
    code: 'El paso dice "esperar a que cargue" sin indicar cuánto ni qué elemento esperar; una persona espera dos segundos y otra diez.',
    rule: 2,
    why: 'La espera queda a criterio de cada persona. Una puede seguir antes de que el sistema termine y la otra después: no es el mismo caso.',
    hint: '¿Dos personas esperan lo mismo con esa instrucción?',
  },
  {
    code: 'El caso usa la cuenta "qa_08@mail.com", que la precondición crea si no existe; dos personas obtienen el mismo resultado.',
    rule: 0,
    why: 'Los datos están fijados y el caso los prepara antes de empezar. No hay nada externo que haga variar el resultado entre personas.',
    hint: '¿Hay algo externo o ambiguo que pueda hacer variar el resultado acá?',
  },
  {
    code: 'El caso espera el texto exacto "Suscripción confirmada" y la URL "/cuenta"; se ejecuta con la cuenta "qa_10@mail.com" que crea la precondición.',
    rule: 0,
    why: 'El resultado es un hecho concreto y la cuenta la prepara el propio caso, así que dos personas llegan al mismo veredicto.',
    hint: '¿El resultado es un hecho concreto, y los datos los prepara el propio caso?',
  },
];

export const CLOSING_QUIZ: QuizQuestion[] = [
  {
    question:
      'Un caso crea su propio usuario, usa siempre el mismo email y espera "Cuenta creada". Al ejecutarlo dos veces seguidas, la segunda falla porque el email ya existe. ¿Qué característica rompe?',
    options: [
      {
        text: 'Independiente: depende de un caso que crea el usuario antes.',
        correct: false,
        why: 'El caso no depende de otro caso: crea su propio usuario. Lo que falla es que no limpia ni varía el dato entre corridas.',
      },
      {
        text: 'Repetible: los mismos pasos no dan el mismo resultado en una segunda ejecución.',
        correct: true,
        why: 'La segunda corrida encuentra el estado que dejó la primera. Para ser repetible, el caso tiene que crear o limpiar su dato antes de empezar.',
      },
      {
        text: 'Claro: no dice qué email usar.',
        correct: false,
        why: 'El email está fijado; el problema no es la ambigüedad de la instrucción sino el estado que persiste entre ejecuciones.',
      },
    ],
  },
  {
    question:
      'Dos personas ejecutan el mismo caso y una marca "pasó" y la otra "falló", porque el resultado esperado decía "el listado se ve completo". ¿Qué característica falla?',
    options: [
      {
        text: 'Verificable: "se ve completo" admite opinión en vez de un hecho concreto.',
        correct: true,
        why: 'Si el resultado esperado no nombra qué elementos o qué texto tienen que estar, cada persona completa el criterio a su manera.',
      },
      {
        text: 'Claro: el caso no explica cómo llegar al listado.',
        correct: false,
        why: 'Las dos personas llegaron al listado y ejecutaron lo mismo; la diferencia aparece al decidir si el resultado se cumplió.',
      },
      {
        text: 'Independiente: el caso depende de otro que carga los datos.',
        correct: false,
        why: 'No hay ningún otro caso mencionado. La discusión es sobre cómo interpretar el resultado, no sobre el orden de ejecución.',
      },
    ],
  },
];
