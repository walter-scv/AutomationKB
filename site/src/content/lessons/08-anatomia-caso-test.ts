import type {FillBlankSlot} from '@site/src/components/FillBlank';
import type {CodeLine} from '@site/src/components/FindInCode';
import type {QuizQuestion} from '@site/src/components/Quiz';
import type {BuilderStep} from '@site/src/components/CommandBuilder';

export const CASE_PREFIX = 'Caso: cambiar la contraseña desde el perfil';
export const CASE_STEPS: BuilderStep[] = [
  {
    options: [
      '\nPrecondición: existe una cuenta con "leo@mail.com" y contraseña "Abcd1234!", con la sesión iniciada.',
      '\nPrecondición: el usuario tiene una cuenta.',
      '\nPrecondición: ninguna; se parte desde donde quedó el caso anterior.',
    ],
    correct: '\nPrecondición: existe una cuenta con "leo@mail.com" y contraseña "Abcd1234!", con la sesión iniciada.',
    hint: 'Con esa precondición, ¿cualquier persona sabría con qué cuenta, con qué contraseña y en qué estado arrancar?',
  },
  {
    options: [
      '\nPasos: cambiar la contraseña con datos válidos y guardar.',
      '\nPasos: probar varias contraseñas nuevas hasta que alguna sea aceptada.',
      '\nPasos: 1) Ir a Perfil > Seguridad. 2) Escribir "Abcd1234!" en contraseña actual. 3) Escribir "Nueva5678!" en nueva contraseña y en confirmación. 4) Tocar "Guardar".',
    ],
    correct: '\nPasos: 1) Ir a Perfil > Seguridad. 2) Escribir "Abcd1234!" en contraseña actual. 3) Escribir "Nueva5678!" en nueva contraseña y en confirmación. 4) Tocar "Guardar".',
    hint: 'Si dos personas siguen estos pasos en días distintos, ¿escribirían exactamente los mismos valores?',
  },
  {
    options: [
      '\nResultado esperado: el cambio de contraseña funciona correctamente.',
      '\nResultado esperado: aparece el texto "Contraseña actualizada".',
      '\nResultado esperado: aparece "Contraseña actualizada", se cierran las otras sesiones y llega un email de aviso.',
    ],
    correct: '\nResultado esperado: aparece el texto "Contraseña actualizada".',
    hint: '¿Ese resultado se puede confirmar sin opinar? Y si falla, ¿queda claro qué fue lo que se rompió?',
  },
];
export const CASE_EXPLANATION =
  'La precondición dice la cuenta exacta, su contraseña y el estado de partida; los pasos usan datos concretos que cualquiera repite igual; y el resultado esperado es un solo hecho verificable. "Funciona correctamente" es subjetivo, y juntar tres verificaciones en un resultado hace que, si falla, no se sepa cuál se rompió: esas otras dos merecen sus propios casos.';

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

export const CONCRETE_TEMPLATE = `Caso lógico: transferir más que el saldo disponible → se rechaza.

CT-105 · Transferencia mayor al saldo
Precondición: la cuenta {{cuenta}} tiene un saldo de {{saldo}}.
Pasos: transferir {{monto}} a la cuenta 0002-7781 y confirmar.
Resultado esperado: aparece el mensaje {{mensaje}} y no se genera ningún movimiento.`;
export const CONCRETE_SLOTS: FillBlankSlot[] = [
  {id: 'cuenta', answer: '0001-5520'},
  {id: 'saldo', answer: '$ 10.000'},
  {id: 'monto', answer: '$ 12.000'},
  {id: 'mensaje', answer: '«Saldo insuficiente»'},
];
export const CONCRETE_BANK = ['$ 8.000', '0001-5520', 'un monto alto', '$ 12.000', 'una cuenta con saldo', '«Saldo insuficiente»', '$ 10.000', 'un mensaje de error'];
export const CONCRETE_EXPLANATION =
  'Un caso concreto fija cada dato: una cuenta identificable, un saldo exacto, un monto que efectivamente lo supera ($ 12.000 contra $ 10.000; $ 8.000 no probaría el caso lógico) y el texto exacto del mensaje. "Un monto alto" o "un mensaje de error" dejan que dos personas ejecuten pruebas distintas y las den por buenas.';
