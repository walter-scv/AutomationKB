import type {ClassifyItem} from '@site/src/components/Classify';
import type {CodeLine} from '@site/src/components/FindInCode';
import type {MatchItem} from '@site/src/components/Match';
import type {MultiSelectQuestion} from '@site/src/components/MultiSelect';

export const OBJECTIVE_MATCH_LEFT: MatchItem[] = [
  {id: 'eval', text: 'Antes de programar, el tester revisa el diseño de la pantalla de alta para decidir si está listo; marca que no está definido qué mostrar cuando el email ya existe.'},
  {id: 'risk', text: 'El equipo concentra la última semana de testing en el alta y el cobro, y deja el cambio de idioma para una revisión rápida, porque un fallo en el cobro cuesta ventas.'},
  {id: 'req', text: 'El tester ejecuta el alta con los tres casos del criterio de aceptación —email nuevo, repetido y con formato inválido— y compara cada resultado con lo que pide el documento.'},
  {id: 'defect', text: 'El equipo recorre la importación de datos probando escenarios variados, para encontrar la mayor cantidad de errores posible y que desarrollo los corrija antes del lanzamiento.'},
  {id: 'confidence', text: 'Antes de la firma, QA entrega al cliente un resumen de lo que se probó y la evidencia de cada ejecución, para que el cliente firme con respaldo.'},
];
export const OBJECTIVE_MATCH_RIGHT: MatchItem[] = [
  {id: 'req', text: 'Verificar que se cumple un requisito'},
  {id: 'confidence', text: 'Dar confianza a los interesados'},
  {id: 'eval', text: 'Evaluar un producto de trabajo (requisito, historia o diseño)'},
  {id: 'defect', text: 'Disparar la corrección de defectos'},
  {id: 'risk', text: 'Reducir el riesgo de que algo falle en uso'},
];
export const OBJECTIVE_MATCH_WHY: Record<string, string> = {
  eval: 'Lo que se evalúa es el diseño, un producto de trabajo que todavía no es código. La revisión sirve para decidir si está listo.',
  risk: 'El esfuerzo se reparte según el impacto de un fallo: el cobro pesa más que el cambio de idioma. Eso es reducir el riesgo donde más duele.',
  req: 'Hay un criterio documentado y cada resultado se compara contra él: el objetivo es confirmar que el alta cumple lo especificado.',
  defect: 'El propósito declarado es encontrar fallas para que se corrijan, no confirmar un criterio ni priorizar por impacto.',
  confidence: 'El destinatario es el cliente y el propósito es que tenga evidencia para decidir. Eso es dar confianza a los interesados.',
};

export const IS_TESTING_QUESTIONS: MultiSelectQuestion[] = [
  {
    prompt: '¿Cuáles de estas situaciones son testing? Marcá todas las que correspondan.',
    options: [
      {
        text: 'Un analista usa el panel para armar el reporte mensual de su área y comenta que la pantalla carga rápido.',
        correct: false,
        why: 'Usa el sistema para su trabajo real, sin un criterio contra el cual comparar. "Carga rápido" es una impresión de uso, no un resultado de testing.',
      },
      {
        text: 'Antes del release, QA corre la lista de casos de regresión del login y registra cuáles pasaron y cuáles no.',
        correct: true,
        why: 'Cada caso tiene un resultado esperado y se registra qué pasó: es una evaluación sistemática contra un criterio.',
      },
      {
        text: 'El equipo hace una demo del alta a un cliente y anota sus comentarios de diseño para la próxima iteración.',
        correct: false,
        why: 'La demo muestra el producto y recoge opiniones, pero no compara el comportamiento contra un criterio. Mostrar no es evaluar.',
      },
      {
        text: 'Una persona que se suma al equipo recorre el alta para conocerla antes de una reunión, sin registrar nada.',
        correct: false,
        why: 'Explorar para aprender, sin criterio ni registro de resultados, no es una evaluación sistemática.',
      },
      {
        text: 'Una tester compara los mensajes de error del alta contra la lista que define el documento de UX y anota los dos que no coinciden.',
        correct: true,
        why: 'Hay un criterio escrito (la lista de UX), se compara contra él y se registra la diferencia: eso es testing.',
      },
      {
        text: 'Una persona de marketing recorre la app para sacar capturas para la página del producto y elige las pantallas que mejor se ven.',
        correct: false,
        why: 'Elige pantallas por su aspecto; no compara funcionalidad contra ningún criterio. Es uso con otro fin.',
      },
      {
        text: 'El equipo carga un reporte de 10.000 filas para confirmar que cumple el requisito de abrirse en menos de 3 segundos.',
        correct: true,
        why: 'El requisito define un número concreto y la prueba lo contrasta: es verificar un requisito, aunque sea de rendimiento.',
      },
    ],
  },
];

export const PRACTICE_RULE_LABELS = [
  'Esperó a que exista código para empezar a testear',
  'Testeó sin un objetivo claro',
  'Midió el éxito por cantidad, no por objetivo cumplido',
  'Confundió "lo usé" con "lo testeé"',
];

export const PRACTICE_LINES: CodeLine[] = [
  {
    code: 'El equipo reporta 500 casos ejecutados esta semana, pero no puede decir cuántos tocaron el checkout, que es donde se cobra.',
    rule: 3,
    why: 'El número mide volumen, no cobertura: se pueden ejecutar 500 casos y no haber mirado la parte donde un fallo cuesta dinero. El objetivo cumplido no aparece en el reporte.',
    hint: '¿El número de casos dice algo sobre qué parte del sistema quedó cubierta?',
  },
  {
    code: 'Antes de la sesión, el equipo anota qué flujo evalúa y contra qué criterio de aceptación.',
    rule: 0,
    why: 'Hay un objetivo explícito y un criterio documentado contra el cual comparar. Eso es lo que hace que el resultado de la sesión se pueda repetir y auditar.',
    hint: '¿Hay un objetivo y un criterio antes de empezar?',
  },
  {
    code: 'Un tester recorre el alta "para ver qué aparece", sin lista ni criterio, y anota lo que le llama la atención.',
    rule: 2,
    why: 'Sin un objetivo previo, dos personas pueden recorrer la misma pantalla y mirar cosas distintas. Lo anotado no se puede comparar con nada ni saber si quedó cubierto.',
    hint: '¿Qué se decidió evaluar antes de empezar, y contra qué se compara lo que aparece?',
  },
  {
    code: 'El equipo dedica la mañana a revisar el requisito de facturación y detecta una regla de redondeo sin definir.',
    rule: 0,
    why: 'Evaluar el requisito antes de que exista código es testing: el producto de trabajo es el documento, y el hallazgo evita que el problema llegue a implementación.',
    hint: '¿Hace falta código para poder evaluar esto?',
  },
  {
    code: 'El equipo decide no revisar las historias de usuario y arrancar el testing recién cuando el build esté completo.',
    rule: 1,
    why: 'Deja pasar la etapa en la que un problema de requisito sale barato de corregir. Cuando llegue el build, ese mismo problema ya estará implementado y costará más.',
    hint: '¿Qué se podría haber evaluado antes de que existiera el build?',
  },
  {
    code: 'El reporte del sprint detalla, por criterio de aceptación, qué se cubrió y qué quedó pendiente.',
    rule: 0,
    why: 'El éxito se mide contra criterios concretos, no por cantidad de casos. Además permite ver qué hueco quedó, en vez de cerrar con un "todo OK" global.',
    hint: '¿Se mide por cantidad de casos, o por criterios cubiertos?',
  },
  {
    code: 'Un desarrollador usa el alta con su email personal, ve que funciona y marca el ticket como testeado.',
    rule: 4,
    why: 'Usar el flujo una vez con un dato propio no es evaluarlo contra un requisito. Cualquier caso distinto al que probó —otro email, otro formato— puede fallar sin que nadie lo sepa.',
    hint: '¿Se comparó el resultado contra un criterio, o solo se comprobó que el camino feliz anduvo?',
  },
  {
    code: 'El equipo corre 80 casos y puede explicar cuál cubre cada uno de los riesgos priorizados.',
    rule: 0,
    why: 'Acá el número está respaldado por una justificación: cada caso tiene un riesgo asignado. La cantidad sola no sería suficiente, pero acá no se está midiendo por cantidad.',
    hint: '¿Hay una justificación detrás de este número de casos?',
  },
];

export const STATIC_COLUMNS = ['Testing estático', 'Testing dinámico', 'Aseguramiento de la calidad'];
export const STATIC_ITEMS: ClassifyItem[] = [
  {code: 'Antes de que se programe, una tester lee la historia del check-in online y anota que no dice hasta cuántas horas antes del vuelo se habilita.', column: 0, why: 'Evalúa un producto de trabajo (la historia) sin ejecutar nada y encuentra un defecto directamente: es testing estático.', hint: '¿Hay algo ejecutándose en este momento?'},
  {code: 'Con la versión de prueba instalada, un tester hace el check-in de una reserva con dos pasajeros y compara las tarjetas de embarque con el criterio de aceptación.', column: 1, why: 'Ejecuta el sistema y compara lo que pasa con un criterio: es testing dinámico.', hint: '¿Se está usando el sistema funcionando o se está leyendo un documento?'},
  {code: 'Después de tres sprints con historias sin datos de prueba, el equipo acuerda que ninguna historia entra al desarrollo sin ellos.', column: 2, why: 'No evalúa un producto: cambia la forma de trabajar para que el problema no vuelva a aparecer. Es aseguramiento de la calidad, orientado al proceso.', hint: '¿Lo que cambia es un producto concreto o la forma de trabajar del equipo?'},
  {code: 'En la revisión del código del cálculo de equipaje, una desarrolladora detecta que el límite de peso está escrito como 23 cuando el requisito dice 23,5 kg.', column: 0, why: 'El código también es un producto de trabajo: revisarlo sin ejecutarlo es testing estático, y el defecto se encuentra directamente.', hint: 'Que lo haga una desarrolladora y sobre código, ¿cambia si se ejecutó algo?'},
  {code: 'Se carga una reserva con un pasajero de 85 años y se confirma que el sistema ofrece la asistencia especial que pide el requisito.', column: 1, why: 'Se ejecuta el sistema con un dato concreto y se compara el resultado con el requisito: testing dinámico.', hint: '¿El resultado se observa en el sistema funcionando?'},
  {code: 'El equipo incorpora una checklist de revisión obligatoria para toda historia que mencione plazos o vencimientos.', column: 2, why: 'Es una medida preventiva sobre el proceso: busca que los defectos de ese tipo no se produzcan. Usarla después, sobre una historia concreta, sí sería testing estático.', hint: '¿Se está evaluando una historia en particular o definiendo cómo se van a revisar todas?'},
  {code: 'Al revisar el diseño de la pantalla de pago, el tester nota que no contempla qué se muestra si la tarjeta es rechazada.', column: 0, why: 'Un diseño es un producto de trabajo; revisarlo sin ejecutar encuentra la omisión antes de programarla: testing estático.', hint: '¿Existe todavía una pantalla funcionando para probar?'},
];
