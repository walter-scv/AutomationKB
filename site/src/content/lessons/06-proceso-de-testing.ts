import type {QuizQuestion} from '@site/src/components/Quiz';
import type {OrderItem, OrderRule} from '@site/src/components/Order';
import type {CodeLine} from '@site/src/components/FindInCode';

export const PROCESS_ORDER_ITEMS: OrderItem[] = [
  {id: 'implementacion', what: 'Paso', code: 'Alguien crea las dos cuentas de prueba, carga el archivo de emails y deja el entorno de pruebas con la versión candidata.'},
  {id: 'planificacion', what: 'Paso', code: 'En la reunión de arranque, el equipo acuerda que este sprint cubre el alta de usuarios y que se prueba en el entorno de pruebas con dos días de margen.'},
  {id: 'ejecucion', what: 'Paso', code: 'Se corren los seis casos, uno por uno, y se anota que el alta con email repetido devuelve un mensaje distinto al esperado.'},
  {id: 'diseno', what: 'Paso', code: 'Con la lista de reglas a mano, el equipo elige particiones de equivalencia para el email y valores límite para la contraseña, y deja seis casos escritos.'},
  {id: 'finalizacion', what: 'Paso', code: 'Antes de cerrar el sprint, el equipo documenta el desvío del email repetido y acuerda reservar más tiempo para ese caso en el próximo ciclo.'},
  {id: 'analisis', what: 'Paso', code: 'Una analista lee las historias del alta de usuarios y marca las reglas que hay que cubrir: email único, contraseña mínima y términos obligatorios.'},
];

export const PROCESS_ORDER_CORRECT = ['planificacion', 'analisis', 'diseno', 'implementacion', 'ejecucion', 'finalizacion'];

export const PROCESS_ORDER_RULES: OrderRule[] = [
  {before: 'planificacion', after: 'analisis', why: 'el objetivo y el ambiente se acuerdan en el arranque; recién con eso se puede decidir qué partes del alta cubrir.'},
  {before: 'analisis', after: 'diseno', why: 'la lista de reglas sale de leer las historias; sin esa lista, elegir las técnicas sería adivinar.'},
  {before: 'diseno', after: 'implementacion', why: 'los seis casos tienen que estar escritos para saber qué cuentas y qué archivo de datos preparar.'},
  {before: 'implementacion', after: 'ejecucion', why: 'no se pueden correr los seis casos hasta que existan las cuentas y el entorno de pruebas tenga la versión candidata.'},
  {before: 'ejecucion', after: 'finalizacion', why: 'el desvío del email repetido se documenta después de haberlo visto al correr los casos.'},
];

export const PRACTICE_RULE_LABELS = ['Se saltea Análisis', 'Se saltea Finalización', 'Monitoreo tratado como paso único, no continuo'];

export const PRACTICE_LINES: CodeLine[] = [
  {
    code: 'El equipo revisa cada lunes, contra el plan, cuántos casos lleva cubiertos y qué se desvió; si el ritmo no alcanza, recorta alcance antes del release.',
    rule: 0,
    why: 'Revisa el avance real contra lo planificado mientras el ciclo sigue, y ajusta el plan con esa información. Es Monitoreo y control funcionando como actividad continua.',
    hint: '¿Esto pasa una sola vez, o se repite mientras avanza el ciclo?',
  },
  {
    code: 'Terminada la regresión, el equipo archiva el reporte de la herramienta y abre el sprint siguiente sin anotar por qué dos casos tardaron el doble de lo previsto.',
    rule: 2,
    why: 'Guardar el reporte no es lo mismo que sacar conclusiones. La demora queda sin explicación y el próximo ciclo arranca con la misma estimación que falló.',
    hint: '¿Qué se lleva el equipo al próximo ciclo de lo que pasó en este?',
  },
  {
    code: 'Apenas se enteró de la nueva pantalla de facturas, el equipo abrió el editor y escribió diez casos; nadie se detuvo a mirar qué reglas de negocio tenía esa pantalla.',
    rule: 1,
    why: 'Los diez casos se escribieron sin una lista de qué cubrir. Es fácil que cubran lo que se ve a simple vista y dejen afuera una regla de negocio importante.',
    hint: '¿En algún momento se acordó qué partes de la pantalla había que cubrir?',
  },
  {
    code: 'Para una corrección de una línea, dos personas charlan cinco minutos y acuerdan que alcanza con probar el mensaje de error; después escriben un solo caso.',
    rule: 0,
    why: 'El Análisis existe aunque sea breve: se acordó qué cubrir antes de escribir el caso. La formalidad se adaptó al tamaño del cambio, que es lo esperable.',
    hint: '¿Se acordó qué cubrir antes de escribir el caso, aunque haya sido breve?',
  },
  {
    code: 'El equipo define el plan completo en la primera reunión y lo deja cerrado: si a mitad del ciclo aparece un bloqueo, lo resuelve sobre la marcha sin revisar lo planificado.',
    rule: 3,
    why: 'El plan se usa una sola vez al principio. Cuando aparece el bloqueo, nadie compara ese desvío con lo previsto ni ajusta fechas o alcance, que es justamente lo que aporta el monitoreo.',
    hint: '¿Qué pasa con lo planificado cuando la realidad del ciclo cambia a mitad de camino?',
  },
  {
    code: 'Antes de ejecutar, el equipo confirma que las cuentas de prueba y el ambiente con la versión candidata están listos; si falta algo, lo completa.',
    rule: 0,
    why: 'La Implementación ocurrió antes de la Ejecución: datos y entorno están preparados. Así los fallos que aparezcan se pueden atribuir al sistema y no a la preparación.',
    hint: '¿Esto pasa antes o después de ejecutar los casos?',
  },
  {
    code: 'El equipo eligió los casos copiando la lista de chequeo del proyecto anterior, sin revisar si la nueva pantalla tenía reglas propias.',
    rule: 1,
    why: 'Se diseñó a partir de una lista vieja, sin un Análisis de las reglas de esta pantalla. Los casos pueden quedar cómodos de escribir y no tocar lo que cambió.',
    hint: '¿La lista que se usó describe esta pantalla o una anterior?',
  },
];

export const CLOSING_QUIZ: QuizQuestion[] = [
  {
    question:
      'Antes de la regresión mensual, el equipo reutiliza una cuenta que otro compañero borró la semana pasada. Tres casos fallan por datos inexistentes y se reportan como defectos. ¿Qué actividad estaba incompleta?',
    options: [
      {
        text: 'Ejecución: no se comparó el resultado real contra el esperado.',
        correct: false,
        why: 'Los casos se corrieron y se compararon; el problema es que arrancaron con datos que no existían, así que la comparación no podía ser confiable.',
      },
      {
        text: 'Finalización: no se documentaron las lecciones del ciclo anterior.',
        correct: false,
        why: 'El faltante es previo a la ejecución. Documentar al final no habría creado la cuenta que faltaba en ese momento.',
      },
      {
        text: 'Implementación: no se prepararon los datos y el entorno antes de ejecutar.',
        correct: true,
        why: 'La Implementación incluye dejar listos cuentas, datos y ambiente. Sin eso, la ejecución produce fallos del entorno que se confunden con bugs del sistema.',
      },
    ],
  },
];
