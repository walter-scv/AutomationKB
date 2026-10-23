import type {CodeLine} from '@site/src/components/FindInCode';

export const CATEGORY_RULE_LABELS = ['Basada en experiencia (conocimiento/intuición de quien testea)', 'White-box (estructura interna del código)'];

export const CATEGORY_LINES: CodeLine[] = [
  {
    code: 'Revisar en el reporte qué ramas del `if` de validación nunca se ejecutaron al correr la suite.',
    rule: 2,
    why: 'Para saber qué ramas no se ejecutaron hay que mirar la estructura del código y la instrumentación de la suite. El comportamiento visible no alcanza.',
    hint: '¿Ese dato sale de lo que el usuario ve o de lo que pasó dentro del código?',
  },
  {
    code: 'Probar el campo "edad" con 17, 18 y 19, porque la especificación dice que el registro requiere ser mayor de edad.',
    rule: 0,
    why: 'Los valores 17, 18 y 19 salen de la regla escrita, con 18 como límite, no de leer el código. Es boundary value analysis black-box.',
    hint: '¿Estos valores salen de leer el código, o de la especificación?',
  },
  {
    code: 'Un tester con años en el sistema prueba primero el botón "Cancelar" porque "siempre es el que rompe".',
    rule: 1,
    why: 'La decisión de empezar por ese botón no sale de la especificación ni del código: sale de la experiencia de quien ya vio fallar ese botón antes.',
    hint: '¿De dónde sale la idea de empezar justo por ese botón?',
  },
  {
    code: 'Armar una tabla con las combinaciones de "envío express" y "pago contrareembolso" que permite la especificación.',
    rule: 0,
    why: 'Las combinaciones están definidas en la especificación. No hace falta ver cómo está implementado el cálculo para armarlas.',
    hint: '¿Hace falta ver cómo está implementado para armar esta tabla?',
  },
  {
    code: 'Medir qué porcentaje de las funciones del módulo de pagos fue llamado por los tests, según el informe de instrumentación.',
    rule: 2,
    why: 'El porcentaje de funciones llamadas es una medida de la estructura interna: necesita instrumentación del código, no solo probar la pantalla.',
    hint: '¿Ese número mide lo que se ve desde afuera o lo que se ejecutó por dentro?',
  },
  {
    code: 'Explorar la pantalla de devoluciones sin un guion fijo, siguiendo lo que llama la atención mientras se usa.',
    rule: 1,
    why: 'No hay un procedimiento definido antes: las acciones se eligen sobre la marcha, según lo que aparece. Eso es testing exploratorio, basado en experiencia.',
    hint: '¿Hay un procedimiento decidido antes de empezar, o se arma mientras se usa?',
  },
  {
    code: 'Derivar los casos de una historia de usuario: para "descuento del 10% con más de 3 ítems", probar 3 y 4 ítems.',
    rule: 0,
    why: 'Los valores salen del texto de la historia, que es especificación. No se mira cómo está programado el descuento.',
    hint: '¿Estos valores salen del texto de la historia, o de mirar el código?',
  },
];

export const PRACTICE_RULE_LABELS = ['Depende solo de experiencia en un sistema crítico', 'Usa siempre la misma técnica por costumbre'];

export const PRACTICE_LINES: CodeLine[] = [
  {
    code: 'El equipo arma todos los casos del nuevo módulo de turnos con equivalence partitioning, aunque el comportamiento cambia según el estado de la reserva: pendiente, confirmada o cancelada.',
    rule: 2,
    why: 'La técnica elegida mira valores de entrada, pero acá el resultado depende del estado en que está la reserva. Aplicar siempre la misma técnica deja afuera ese cambio de estado.',
    hint: '¿El resultado depende solo del valor ingresado o también del estado del registro?',
  },
  {
    code: 'Para el formulario de contacto, el equipo usa boundary value analysis porque la especificación fija un máximo de 500 caracteres; para el flujo de reserva, arma una tabla de estados.',
    rule: 0,
    why: 'La elección cambia según lo que pide cada parte del sistema: la especificación del campo justifica boundary, y el flujo con estados justifica state transition.',
    hint: '¿La técnica elegida cambia según lo que necesita cada parte del sistema?',
  },
  {
    code: 'El área de salud de una app audita accesos a historias clínicas solo con sesiones exploratorias de dos testers, sin casos formales.',
    rule: 1,
    why: 'Un sistema crítico cubierto únicamente por intuición deja puntos ciegos. La exploración suma, pero necesita cobertura formal de respaldo.',
    hint: '¿Qué pasa si los dos testers no están disponibles la semana del release?',
  },
  {
    code: 'El equipo deja una sesión exploratoria al final de cada release para lo que no anticipó, pero antes corrió los casos formales de la especificación.',
    rule: 0,
    why: 'Combina una técnica formal con experiencia, cada una en el lugar donde aporta. La sesión no reemplaza los casos formales: los complementa.',
    hint: '¿La exploración reemplaza los casos formales, o los complementa?',
  },
  {
    code: 'Pase lo que pase, el equipo abre el primer caso con error guessing; aunque la especificación de la nueva API trae las reglas completas, nadie las usa para diseñar.',
    rule: 2,
    why: 'La especificación daba una base para una técnica formal. Elegir siempre la misma técnica por costumbre desperdicia la información disponible.',
    hint: '¿Qué información estaba disponible y se dejó de lado?',
  },
  {
    code: 'El único control de un sistema que mueve pagos internacionales es la intuición de un tester senior; no hay casos documentados ni cobertura formal.',
    rule: 1,
    why: 'La experiencia de una sola persona no alcanza como único control en un sistema de alto impacto. Sin casos formales, no hay respaldo si esa persona falta o si algo cambia.',
    hint: '¿Qué queda sin cubrir si esa persona no está, o si el sistema cambia?',
  },
  {
    code: 'El equipo suma testing exploratorio a un sistema con especificación completa, porque quiere cubrir combinaciones que el documento no menciona.',
    rule: 0,
    why: 'La exploración complementa la cobertura formal cuando se busca lo que la especificación no anticipó. No reemplaza los casos formales: agrega otra mirada.',
    hint: '¿Esto reemplaza la cobertura formal, o la complementa?',
  },
];

