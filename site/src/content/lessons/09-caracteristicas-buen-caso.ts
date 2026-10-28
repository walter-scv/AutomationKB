import type {DecisionNode} from '@site/src/components/DecisionPath';
import type {CodeLine} from '@site/src/components/FindInCode';
import type {QuizQuestion} from '@site/src/components/Quiz';
import type {SpotTokenRound} from '@site/src/components/SpotToken';

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

export const WORD_PROMPT = '¿Qué palabra de esta línea hace que el caso no se ejecute, o no se verifique, igual cada vez?';
export const WORD_ROUNDS: SpotTokenRound[] = [
  {
    line: 'Paso 2: ingresar un monto razonable en el campo "Monto".',
    targetIndex: 5,
    why: 'No es Claro: "razonable" deja el valor a criterio de quien ejecuta. Una persona pone 500 y otra 50.000, y solo una recibe el error de límite.',
    hint: 'Si dos personas leen este paso, ¿escriben el mismo número en el campo?',
  },
  {
    line: 'Resultado esperado: el panel de ventas queda prolijo.',
    targetIndex: 7,
    why: 'No es Verificable: "prolijo" es una opinión. Para confirmarlo hace falta un hecho concreto, como un texto o un valor exacto.',
    hint: '¿Dos personas mirando el mismo panel se pondrían de acuerdo en si pasó?',
  },
  {
    line: 'Pasos: iniciar sesión con la cuenta del caso anterior y abrir el carrito.',
    targetIndex: 8,
    why: 'No es Independiente: depende de que otro caso haya corrido antes y dejado la cuenta creada. Si se ejecuta solo, o en otro orden, falla sin que nada esté roto.',
    hint: '¿Este caso funciona si es el primero (o el único) que se ejecuta?',
  },
  {
    line: 'Resultado esperado: el reporte muestra los pedidos de hoy.',
    targetIndex: 8,
    why: 'No es Repetible: "hoy" cambia según el día en que se ejecuta. Mañana el mismo caso espera otros pedidos. Una fecha fija lo vuelve repetible.',
    hint: 'Si el caso se ejecuta mañana con los mismos pasos, ¿espera exactamente lo mismo?',
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

export const DIAG_START = 'datos';
export const DIAG_NODES: Record<string, DecisionNode> = {
  datos: {
    id: 'datos',
    situation: 'Dos testers ejecutan CT-31, «Reservar una clase con cupo disponible». A Ana le pasa; a Bruno le falla. Al comparar, Ana reservó Yoga del lunes y Bruno, Spinning del martes, que ya tenía el cupo lleno. ¿Qué hay que corregir en el caso?',
    options: [
      {text: 'Que sea repetible: hay que volver a correrlo hasta que dé lo mismo.', correct: false, why: 'Repetirlo no cambia nada: cada uno volvería a elegir su clase. El problema apareció porque usaron datos distintos.'},
      {text: 'Que sea claro: tiene que indicar qué clase, qué día y con qué cupo.', correct: true, why: 'Si cada persona elige sus datos, cada una prueba algo distinto. Es la señal de un caso que no es claro.', next: 'mensaje'},
      {text: 'Que sea verificable: el resultado esperado no es preciso.', correct: false, why: 'Los dos vieron resultados distintos porque hicieron cosas distintas, no porque interpretaran distinto lo mismo.'},
    ],
  },
  mensaje: {
    id: 'mensaje',
    situation: 'Con el caso corregido, los dos reservan Yoga del lunes y ven el mismo cartel: «Reserva registrada, pendiente de pago». Ana lo marca como pasado y Bruno como fallado. El resultado esperado dice «la reserva se completa». ¿Qué falta?',
    options: [
      {text: 'Que sea independiente: alguna reserva anterior influyó.', correct: false, why: 'Los dos vieron exactamente lo mismo; ninguna ejecución anterior cambió el resultado.'},
      {text: 'Que sea claro: los pasos no dicen qué clase elegir.', correct: false, why: 'Eso ya se corrigió: los dos hicieron lo mismo con los mismos datos.'},
      {text: 'Que sea verificable: el resultado esperado tiene que decir el texto exacto y el estado de la reserva.', correct: true, why: 'Vieron lo mismo y lo interpretaron distinto: «se completa» no permite decidir si «pendiente de pago» cumple o no.', next: 'orden'},
    ],
  },
  orden: {
    id: 'orden',
    situation: 'CT-32, «Cancelar una reserva», pasa siempre que corre después de CT-31, y falla cuando alguien lo ejecuta solo: no encuentra ninguna reserva para cancelar. ¿Qué característica rompe?',
    options: [
      {text: 'Independencia: depende de la reserva que crea otro caso; tiene que crear la suya en la precondición.', correct: true, why: 'Lo que cambia el resultado es qué se ejecutó antes: el caso no es independiente.', next: 'tiempo'},
      {text: 'Repetibilidad: da resultados distintos en distintas ejecuciones.', correct: false, why: 'Da resultados distintos, pero según qué corrió antes, no por el paso del tiempo. Eso señala la independencia.'},
      {text: 'Claridad: el paso «cancelar» es ambiguo.', correct: false, why: 'El paso se ejecuta igual en las dos situaciones; lo que falta es la reserva que lo hace posible.'},
    ],
  },
  tiempo: {
    id: 'tiempo',
    situation: 'CT-33, «Ver las clases de esta semana», espera que aparezca «Pilates · miércoles 6/11». Pasó el lunes y falló el jueves de la semana siguiente, sin ningún cambio de versión. ¿Qué característica rompe?',
    options: [
      {text: 'Verificabilidad: «aparece» no es preciso.', correct: false, why: 'El resultado esperado es exacto; lo que lo vuelve falso es que la semana cambió.'},
      {text: 'Independencia: otro caso borró la clase.', correct: false, why: 'Nada indica que otro caso haya intervenido; el resultado cambió con la fecha.'},
      {text: 'Repetibilidad: depende de la fecha en que se ejecuta; tiene que fijar la fecha o crear la clase en la semana actual.', correct: true, why: 'El mismo caso, sin cambios en el sistema, cambió de resultado con el tiempo: no es repetible.'},
    ],
  },
};
export const DIAG_EXPLANATION =
  'La diferencia entre dos resultados dice qué revisar: datos distintos → claridad; lo mismo interpretado distinto → verificabilidad; depende de lo que corrió antes → independencia; cambia con el tiempo → repetibilidad.';
