import type {CodeLine} from '@site/src/components/FindInCode';
import type {QuizQuestion} from '@site/src/components/Quiz';

export const STRUCTURE_QUIZ: QuizQuestion[] = [
  {
    question:
      'Un caso dice: "Precondición: no existe una cuenta con el email indicado. Pasos: completar el formulario con los datos del ticket. Resultado esperado: aparece el texto \'Cuenta creada\'." ¿Qué parte está floja?',
    options: [
      {
        text: 'La precondición: no aclara cuál es el email indicado.',
        correct: false,
        why: 'La precondición sí dice qué estado hace falta: que no exista una cuenta con ese email. El problema aparece después, cuando los pasos no dicen cuál usar.',
      },
      {
        text: 'Los pasos: "los datos del ticket" no dice qué valores completar.',
        correct: true,
        why: 'Cada persona podría tomar datos distintos del ticket. Sin el email y la contraseña exactos, dos ejecuciones prueban cosas diferentes.',
      },
      {
        text: 'El resultado esperado: "Cuenta creada" admite interpretación.',
        correct: false,
        why: 'Es un texto exacto y verificable; cualquiera puede confirmar si aparece o no.',
      },
    ],
  },
  {
    question:
      'Dos personas ejecutan el mismo caso: una obtiene "Cuenta creada" y la otra "El email ya está registrado". El caso no menciona cuentas existentes. ¿Qué parte falta?',
    options: [
      {
        text: 'La precondición: no dice si tiene que existir una cuenta con ese email.',
        correct: true,
        why: 'Sin ese dato, una ejecución crea la cuenta y la otra se encuentra con una que ya estaba. El estado de partida es parte del caso.',
      },
      {
        text: 'Los pasos: no dicen qué botón tocar al final.',
        correct: false,
        why: 'El resultado distinto no viene de un botón, sino de que cada ejecución arrancó desde un estado distinto de la base.',
      },
      {
        text: 'El resultado esperado: debería aceptar los dos mensajes.',
        correct: false,
        why: 'Aceptar los dos mensajes escondería el problema. El caso tiene que definir desde qué estado arranca, no ampliar qué considera éxito.',
      },
    ],
  },
  {
    question: '"Resultado esperado: la pantalla de confirmación se ve completa y ordenada." ¿Qué problema tiene?',
    options: [
      {
        text: 'Le falta la precondición.',
        correct: false,
        why: 'La precondición es el estado previo a los pasos; el problema señalado está en cómo se describe el resultado, no en lo que falta antes de empezar.',
      },
      {
        text: 'Los pasos son genéricos.',
        correct: false,
        why: 'El fragmento no muestra los pasos; lo que falla es la forma de describir el resultado esperado.',
      },
      {
        text: 'Es subjetivo: "completa y ordenada" no se puede confirmar sin opinar.',
        correct: true,
        why: 'Dos personas pueden mirar la misma pantalla y decidir distinto. Un resultado verificable diría qué texto, qué URL o qué valor tiene que aparecer.',
      },
    ],
  },
];

export const PRACTICE_RULE_LABELS = ['Resultado esperado subjetivo', 'Pasos genéricos, sin datos concretos', 'Falta la precondición'];

export const PRACTICE_LINES: CodeLine[] = [
  {
    code: 'Pasos: tocar "Olvidé mi contraseña", escribir "carla@mail.com" y tocar "Enviar". Resultado esperado: aparece el texto "Revisá tu casilla de email".',
    rule: 3,
    why: 'Los datos y el resultado son concretos, pero el caso no dice si esa cuenta existe. Si no existe, el sistema puede mostrar otro mensaje y el caso falla por una condición que nunca se declaró.',
    hint: '¿Qué pasaría si ese email no tuviera ninguna cuenta asociada?',
  },
  {
    code: 'Precondición: no existe una cuenta con "nueva@mail.com". Pasos: completar email con "nueva@mail.com", contraseña y confirmación con "Abcd1234!", tildar términos y tocar "Crear cuenta". Resultado esperado: aparece el texto "Cuenta creada".',
    rule: 0,
    why: 'Están las tres partes: un estado de partida explícito, cada dato concreto y un texto exacto para comparar.',
    hint: '¿Las tres partes (precondición, pasos, resultado) están completas y concretas?',
  },
  {
    code: 'Precondición: existe una cuenta con "carla@mail.com". Pasos: seguir el flujo de recuperación con los datos correspondientes. Resultado esperado: aparece el texto "Revisá tu casilla de email".',
    rule: 2,
    why: '"Los datos correspondientes" deja la entrada a criterio de quien ejecuta. Aunque el resultado sea exacto, dos personas pueden probar emails distintos.',
    hint: '¿Dos personas completarían exactamente el mismo valor en ese paso?',
  },
  {
    code: 'Precondición: existe una cuenta con "diego@mail.com" y la sesión está cerrada. Pasos: tocar "Olvidé mi contraseña", escribir "diego@mail.com", tocar "Enviar". Resultado esperado: aparece el texto "Revisá tu casilla de email".',
    rule: 0,
    why: 'El estado de partida incluye la sesión cerrada, el paso usa el mismo email de la precondición y el resultado es un texto exacto.',
    hint: '¿El paso usa el mismo dato que declaró la precondición?',
  },
  {
    code: 'Precondición: existe una cuenta con "carla@mail.com". Pasos: tocar "Olvidé mi contraseña", escribir "carla@mail.com", tocar "Enviar". Resultado esperado: el flujo se siente rápido y sin pasos de más.',
    rule: 1,
    why: '"Se siente rápido" es una impresión. Dos personas pueden estar en desacuerdo sobre el mismo flujo sin que el sistema haya cambiado.',
    hint: '¿Dos personas podrían discutir si este resultado se cumplió?',
  },
  {
    code: 'Precondición: no existe una cuenta con "nueva@mail.com". Pasos: completar el registro con un email válido y una contraseña segura. Resultado esperado: aparece el texto "Cuenta creada".',
    rule: 2,
    why: '"Válido" y "segura" son adjetivos, no datos. Una persona puede usar mayúsculas y símbolos y otra no, y las dos creer que cumplieron el paso.',
    hint: '¿Qué valor exacto escribirías en cada campo?',
  },
  {
    code: 'Pasos: completar el formulario con "sofia@mail.com" y "Abcd1234!", tildar términos y tocar "Crear cuenta". Resultado esperado: aparece el texto "Cuenta creada".',
    rule: 3,
    why: 'Falta el estado de partida: si ya existe una cuenta con ese email, el resultado esperado no se va a dar. El caso no anticipa esa condición.',
    hint: '¿Qué pasaría si ya existiera una cuenta con ese email?',
  },
  {
    code: 'Precondición: existe una cuenta con "carla@mail.com" y ya se pidió un enlace hace diez minutos. Pasos: tocar "Olvidé mi contraseña", escribir "carla@mail.com", tocar "Enviar". Resultado esperado: aparece el texto "Esperá unos minutos antes de pedir otro enlace".',
    rule: 0,
    why: 'Aunque el resultado esperado sea un mensaje de error, es un texto exacto y la precondición explica por qué corresponde. La estructura está completa.',
    hint: '¿El resultado esperado es un texto exacto, aunque sea un mensaje de error?',
  },
];

export const CLOSING_QUIZ: QuizQuestion[] = [
  {
    question:
      'Un caso de regresión empieza con "el usuario ya inició sesión", pero no dice con qué cuenta ni cómo se creó. ¿Qué parte hay que completar y por qué?',
    options: [
      {
        text: 'Los pasos: falta indicar en qué botón tocar para iniciar sesión.',
        correct: false,
        why: 'El caso no pide iniciar sesión: dice que ya está iniciado. Lo que falta es saber con qué cuenta se llegó a ese estado.',
      },
      {
        text: 'El resultado esperado: "ya inició sesión" no es verificable.',
        correct: false,
        why: 'El resultado esperado no es la sesión: es lo que se verifica después de los pasos. La ambigüedad está en el estado de partida.',
      },
      {
        text: 'La precondición: qué usuario existe, con qué contraseña y desde qué estado se parte.',
        correct: true,
        why: 'La precondición es el estado de partida y tiene que ser alcanzable. Sin la cuenta concreta, dos personas preparan escenarios distintos.',
      },
    ],
  },
  {
    question:
      'Un caso exitoso dice: "Resultado esperado: se muestra un mensaje de confirmación". Dos personas ven mensajes distintos y las dos lo dan por bueno. ¿Qué hay que ajustar?',
    options: [
      {
        text: 'La precondición: falta declarar el estado de la cuenta.',
        correct: false,
        why: 'El caso puede tener una precondición perfecta y aun así no definir qué mensaje exacto cuenta como éxito.',
      },
      {
        text: 'Los pasos: hay que agregar un paso que compare los dos mensajes.',
        correct: false,
        why: 'No se resuelve agregando pasos, sino escribiendo qué hecho concreto confirma el caso.',
      },
      {
        text: 'El resultado esperado: tiene que nombrar el texto exacto que debe aparecer.',
        correct: true,
        why: 'Si cualquier mensaje sirve, el caso no distingue el comportamiento correcto de otro que no lo es.',
      },
    ],
  },
];
