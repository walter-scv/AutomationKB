import type {CodeLine} from '@site/src/components/FindInCode';
import type {QuizQuestion} from '@site/src/components/Quiz';

export const PRACTICE_RULE_LABELS = [
  'Afirma la causa (error humano) sin evidencia',
  'Confunde fallo con defecto',
  'Corrige el síntoma sin investigar la causa raíz',
];

export const PRACTICE_LINES: CodeLine[] = [
  {
    code: 'El reporte dice: "el defecto está en el cálculo del envío; el total mostrado no coincide con el esperado".',
    rule: 2,
    why: 'Lo único observado es que el total no coincide, que es el fallo. Afirmar que el defecto está en el cálculo del envío ya es una conclusión sobre el código que nadie verificó todavía.',
    hint: '¿Se revisó el código para saber dónde está el problema, o solo se vio un resultado distinto al esperado?',
  },
  {
    code: 'El reporte dice: "con un pedido de $1000 y un cupón del 20%, se esperaba $800 y se mostró $980".',
    rule: 0,
    why: 'Describe un fallo con datos concretos: entrada, resultado esperado y resultado real. No afirma dónde está el defecto ni cuál es la causa, así que cada término queda en su lugar.',
    hint: '¿Esta frase afirma dónde está el defecto, o solo describe el fallo observado?',
  },
  {
    code: 'En la retro, el equipo acuerda "hablar con el desarrollador porque seguro interpretó mal el requisito", antes de que alguien mire el código.',
    rule: 1,
    why: 'Se está nombrando un error humano —una interpretación equivocada— sin evidencia del código ni del requisito. Puede ser cierta, pero por ahora es una suposición que salta dos pasos de la cadena.',
    hint: '¿Ya se revisó el código o el requisito para confirmar que el problema fue una mala interpretación?',
  },
  {
    code: 'El desarrollador ajusta el total mostrado en el detalle del pedido para que coincida, sin revisar la función que calcula el descuento.',
    rule: 3,
    why: 'Corrige el número visible, pero deja intacta la lógica que lo produce. El mismo cálculo puede volver a dar mal en otro pedido, porque la causa sigue ahí.',
    hint: '¿La corrección cambió el origen del valor, o solo el valor que se muestra?',
  },
  {
    code: 'El desarrollador encuentra que la función de descuento divide por 100 dos veces y revisa si el mismo patrón aparece en la función de envío.',
    rule: 0,
    why: 'No se queda en el caso puntual: busca el patrón que originó el defecto y lo rastrea en otro lugar donde podría repetirse. Eso es perseguir la causa raíz.',
    hint: '¿Se queda en el caso puntual, o busca el mismo patrón en otro lado?',
  },
  {
    code: 'El tester escribe en el ticket: "el bug está en la validación de cupones", basándose solo en que el cupón no se aplicó.',
    rule: 2,
    why: 'El cupón que no se aplica es el fallo visible; "la validación de cupones" es una ubicación supuesta en el código. Sin revisar esa validación, el defecto todavía no está identificado.',
    hint: '¿Qué se observó al ejecutar y qué se está afirmando sobre el código sin haberlo mirado?',
  },
  {
    code: 'El tester reporta: "el cupón DESC20 no se aplicó; esperado $800, real $1000" y adjunta el pedido de prueba.',
    rule: 0,
    why: 'Separa el hecho observable (el total no cambió) de cualquier hipótesis sobre el código, y adjunta los datos para reproducirlo. Un reporte de fallo no necesita saber todavía dónde está el defecto.',
    hint: '¿Esta frase afirma una causa, o describe el fallo con datos?',
  },
  {
    code: 'Para que el cupón funcione, el equipo agrega una excepción para el código DESC20, sin revisar por qué ese cupón toma otro camino.',
    rule: 3,
    why: 'La excepción hace desaparecer este caso, pero no explica el comportamiento distinto ni corrige el origen. Cualquier otro cupón con la misma particularidad va a volver a fallar.',
    hint: '¿Este arreglo explica por qué pasaba, o solo evita que pase en este cupón puntual?',
  },
];

export const VOCAB_QUIZ: QuizQuestion[] = [
  {
    question:
      'Un analista lee el requisito "mínimo 8 caracteres" y lo interpreta como "más de 8 caracteres". ¿Cómo se llama esa acción humana equivocada?',
    options: [
      {
        text: 'Defecto: la falla que queda en el código a partir de esa interpretación.',
        correct: false,
        why: 'El defecto es la consecuencia en el código. En el momento en que el analista interpreta mal, todavía no se escribió ninguna condición.',
      },
      {
        text: 'Error: la acción humana que produce un resultado incorrecto.',
        correct: true,
        why: 'El error ocurre en la interpretación de la persona, antes de que exista código. Todavía no hay ningún defecto ni ningún fallo: solo una decisión equivocada.',
      },
      {
        text: 'Fallo: el comportamiento visible que produce esa interpretación.',
        correct: false,
        why: 'El fallo aparece recién cuando el sistema se ejecuta y alguien observa un resultado distinto al esperado. Acá estamos antes de esa instancia.',
      },
    ],
  },
  {
    question:
      'Como consecuencia de esa interpretación, el código queda con `password.length > 8` en vez de `>= 8`. ¿Cómo se llama eso?',
    options: [
      {
        text: 'Error: la equivocación de quien escribió la condición.',
        correct: false,
        why: 'El error humano ya ocurrió antes, en la interpretación del requisito. Lo que estamos mirando ahora es su rastro concreto en el código.',
      },
      {
        text: 'Fallo: el síntoma que aparece al ejecutar la validación.',
        correct: false,
        why: 'La línea todavía no se ejecutó con un usuario real. Sin ejecución no hay síntoma observable, así que no puede ser un fallo.',
      },
      {
        text: 'Defecto: la falla en el código que resulta del error humano.',
        correct: true,
        why: 'El operador equivocado ya vive en el código, pero todavía no produjo ningún comportamiento visible. Esa es exactamente la definición de defecto.',
      },
    ],
  },
  {
    question:
      'Un usuario ingresa una contraseña de exactamente 8 caracteres, que debería ser válida, y el sistema la rechaza. ¿Cómo se llama lo que observó?',
    options: [
      {
        text: 'Fallo: la desviación observable entre el comportamiento esperado y el real.',
        correct: true,
        why: 'El usuario ve un resultado concreto que no coincide con lo esperado. Ese síntoma visible es el fallo, y es lo que dispara la investigación.',
      },
      {
        text: 'Defecto: la condición equivocada que está en el código.',
        correct: false,
        why: 'El defecto es la causa que está en el código, no lo que el usuario observa. El usuario no ve el operador: ve que le rechazan una contraseña válida.',
      },
      {
        text: 'Error: la interpretación equivocada del requisito.',
        correct: false,
        why: 'El error humano ya ocurrió mucho antes, cuando se leyó el requisito. Lo que el usuario observa ahora es la consecuencia visible de ese error, no el error en sí.',
      },
    ],
  },
  {
    question:
      'En el mismo incidente, ¿cuál de estas opciones describe la causa raíz y no solo el defecto puntual?',
    options: [
      {
        text: 'El operador `>` escrito en lugar de `>=` en la validación.',
        correct: false,
        why: 'Ese es el defecto concreto: donde se manifiesta el problema en el código. Corregirlo resuelve este caso, pero no impide que la misma mala interpretación genere otro defecto.',
      },
      {
        text: 'El mensaje de error que no explica que se necesitan 8 caracteres o más.',
        correct: false,
        why: 'Un mensaje más claro puede mejorar la experiencia, pero no es el origen de la condición equivocada. El defecto seguiría rechazando contraseñas válidas.',
      },
      {
        text: 'El malentendido original del requisito, que puede repetirse en otra condición parecida.',
        correct: true,
        why: 'Si solo se corrige el operador, el mismo malentendido puede volver a producir un defecto en otra validación. La causa raíz es lo que, si se elimina, evita que el patrón se repita.',
      },
    ],
  },
];

export const CLOSING_QUIZ: QuizQuestion[] = [
  {
    question:
      'Una persona de QA reporta: "Al tocar \'Crear cuenta\' con datos válidos, no aparece ningún mensaje de éxito." ¿Qué está reportando?',
    options: [
      {
        text: 'Un fallo: el comportamiento observado no coincide con el esperado.',
        correct: true,
        why: 'El reporte describe lo que se vio al ejecutar, sin afirmar dónde está el defecto ni cuál es la causa. Para reportar un fallo alcanza con documentar el síntoma.',
      },
      {
        text: 'Un error: la equivocación de quien programó el alta.',
        correct: false,
        why: 'El error humano ocurrió antes, en el código o en el requisito. Acá se está describiendo un resultado visible al usar el sistema, no la acción que lo originó.',
      },
      {
        text: 'Un defecto: la falla concreta que está en el código del alta.',
        correct: false,
        why: 'Todavía nadie revisó el código, así que no se sabe cuál es el defecto. Se puede reportar el fallo sin conocer su ubicación exacta.',
      },
    ],
  },
  {
    question:
      '¿Por qué conviene buscar la causa raíz de un defecto en vez de corregir solo el síntoma puntual?',
    options: [
      {
        text: 'Porque corregir el síntoma es más lento y siempre deja el código más desordenado.',
        correct: false,
        why: 'El problema no es la velocidad ni el orden del código: es que el origen sigue presente. Un arreglo rápido y prolijo del síntoma igual deja la puerta abierta a que reaparezca.',
      },
      {
        text: 'Porque mientras la causa siga ahí, el mismo tipo de defecto puede reaparecer en otro lugar.',
        correct: true,
        why: 'Corregir el síntoma resuelve ese caso, pero no el patrón que lo produjo. Si el origen fue, por ejemplo, un malentendido de requisito, puede repetirse en otra validación parecida.',
      },
      {
        text: 'Porque el equipo necesita asignarle el defecto a una persona responsable.',
        correct: false,
        why: 'Asignar responsabilidad es un tema de proceso, no de calidad técnica. La causa raíz importa por su efecto en el sistema, no para encontrar a quién culpar.',
      },
    ],
  },
];
