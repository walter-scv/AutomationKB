import type {CodeLine} from '@site/src/components/FindInCode';
import type {QuizQuestion} from '@site/src/components/Quiz';
import type {MatchItem} from '@site/src/components/Match';

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

export const CHAIN_MATCH_LEFT: MatchItem[] = [
  {id: 'error', text: 'Error'},
  {id: 'defecto', text: 'Defecto'},
  {id: 'fallo', text: 'Fallo'},
  {id: 'raiz', text: 'Causa raíz'},
];
export const CHAIN_MATCH_RIGHT: MatchItem[] = [
  {id: 'fallo', text: 'Una clienta con un carrito de exactamente $5000 ve que le cobran el envío.'},
  {id: 'raiz', text: 'El requisito dice "desde $5000" sin aclarar si incluye ese monto, y el equipo no acostumbra confirmar los límites con producto antes de programar.'},
  {id: 'defecto', text: 'En la función del envío queda escrita la condición `total > 5000`.'},
  {id: 'error', text: 'Al implementar, el desarrollador lee "desde $5000" y entiende "más de $5000".'},
];
export const CHAIN_MATCH_WHY: Record<string, string> = {
  error: 'Es la acción humana puntual: una interpretación equivocada en el momento de programar.',
  defecto: 'Es lo que ese error deja en el código. Todavía no se ve nada hasta que se ejecuta con el monto justo.',
  fallo: 'Es la desviación observable: lo esperado (envío gratis) contra lo que pasó (le cobran el envío).',
  raiz: 'Es el origen de fondo: mientras los límites ambiguos no se aclaren, el mismo error puede repetirse en cualquier otra condición con "desde" o "hasta".',
};

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
