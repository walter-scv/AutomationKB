import type {CodeLine} from '@site/src/components/FindInCode';

export const OBJECTIVE_RULE_LABELS = [
  'Verificar que se cumple un requisito',
  'Dar confianza a los interesados',
  'Disparar la corrección de un defecto',
  'Reducir el riesgo de que algo falle en uso',
  'Evaluar un producto de trabajo (requisito, historia o diseño)',
];

export const OBJECTIVE_LINES: CodeLine[] = [
  {
    code: 'Antes de programar, el tester revisa el diseño de la pantalla de alta para decidir si está listo; marca que no está definido qué mostrar cuando el email ya existe.',
    rule: 5,
    why: 'Lo que se evalúa es el diseño, un producto de trabajo que todavía no es código. La revisión sirve para decidir si está listo, no para encontrar fallas en el sistema ya construido.',
    hint: '¿Qué se está mirando: el comportamiento del sistema o el documento que lo describe?',
  },
  {
    code: 'Un analista usa el panel para armar el reporte mensual de su área y comenta que la pantalla carga rápido.',
    rule: 0,
    why: 'Está usando el sistema para su trabajo real, sin un criterio contra el cual comparar el resultado. Que la pantalla cargue rápido es una impresión de uso, no un resultado de testing.',
    hint: '¿Hay un criterio documentado contra el cual se compara el resultado acá?',
  },
  {
    code: 'El equipo concentra la última semana de testing en el alta y el cobro, y deja el cambio de idioma para una revisión rápida, porque un fallo en el cobro cuesta ventas.',
    rule: 4,
    why: 'El esfuerzo se distribuye según el impacto de un fallo: el cobro pesa más que el cambio de idioma. Eso es reducir el riesgo donde más duele.',
    hint: '¿Qué decide el equipo con ese reparto: qué parte tiene más impacto si falla, o qué parte es más fácil de probar?',
  },
  {
    code: 'El equipo hace una demo del alta a un cliente y anota sus comentarios de diseño para la próxima iteración.',
    rule: 0,
    why: 'La demo muestra el producto y recoge opiniones de diseño, pero no compara el comportamiento contra un criterio. Mostrar no es evaluar sistemáticamente.',
    hint: '¿Se compara el comportamiento contra un criterio, o se muestra y se recogen opiniones?',
  },
  {
    code: 'El tester ejecuta el alta con los tres casos del criterio de aceptación —email nuevo, repetido y con formato inválido— y compara cada resultado con lo que pide el documento, para confirmar que se cumple.',
    rule: 1,
    why: 'Hay un criterio documentado y cada resultado se compara contra él. El objetivo es confirmar que el alta cumple lo especificado.',
    hint: '¿Contra qué se compara cada resultado: una impresión personal o un criterio escrito?',
  },
  {
    code: 'Una persona que se suma al equipo abre la app y recorre el alta para conocerla antes de una reunión, sin registrar nada.',
    rule: 0,
    why: 'Recorre la app para conocerla, sin criterio ni registro de resultados. Explorar para aprender no es una evaluación sistemática.',
    hint: '¿Hay un criterio o un registro de lo que se encontró acá?',
  },
  {
    code: 'El equipo recorre la importación de datos probando escenarios variados, con un objetivo: encontrar la mayor cantidad de errores posible para que desarrollo los corrija antes del lanzamiento.',
    rule: 3,
    why: 'El propósito declarado es encontrar defectos para que se corrijan, no confirmar un criterio ni priorizar por impacto. La sesión existe para alimentar la corrección.',
    hint: '¿Para qué se ejecuta la sesión: para confirmar algo que ya está escrito o para encontrar fallas que haya que corregir?',
  },
  {
    code: 'Una persona de marketing recorre la app para sacar capturas para la página del producto y elige las pantallas que mejor se ven.',
    rule: 0,
    why: 'Elige capturas por su aspecto para la página del producto; no compara funcionalidad contra ningún criterio. Eso es uso con otro fin, no testing.',
    hint: '¿Se compara algo contra un criterio, o se elige por otro motivo?',
  },
  {
    code: 'Antes de la firma, QA entrega al cliente un resumen de lo que se probó y la evidencia de cada ejecución, para que el cliente firme con respaldo.',
    rule: 2,
    why: 'El destinatario es el cliente y el propósito es que tenga evidencia para decidir la firma. Eso es dar confianza a los interesados.',
    hint: '¿El resumen busca confirmar un requisito puntual o darle al cliente respaldo para decidir?',
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

