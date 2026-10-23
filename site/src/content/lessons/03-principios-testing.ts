import type {CodeLine} from '@site/src/components/FindInCode';
import type {QuizQuestion} from '@site/src/components/Quiz';

export const PRACTICE_RULE_LABELS = [
  'Contradice el principio 4 (agrupación de defectos)',
  'Contradice el principio 3 (testing temprano)',
  'Contradice el principio 6 (depende del contexto)',
  'Contradice el principio 5 (paradoja del pesticida)',
  'Contradice el principio 1 (ausencia de defectos)',
];

export const PRACTICE_LINES: CodeLine[] = [
  {
    code: 'El equipo ejecuta 40 casos del módulo de pedidos sin fallos y el líder escribe en el acta: "módulo validado, sin defectos".',
    rule: 5,
    why: 'Los 40 casos que corrieron no encontraron nada, pero eso no prueba que no haya defectos: solo que esos casos no los encontraron. Convertir el silencio de una suite en una garantía es la conclusión que ningún testing puede respaldar.',
    hint: '¿Qué se puede afirmar exactamente cuando una suite no encuentra fallos?',
  },
  {
    code: 'La suite de regresión de pedidos suma cada mes dos casos nuevos a partir de incidentes reales.',
    rule: 0,
    why: 'La suite cambia y se alimenta de fallos concretos. Lejos de repetir siempre lo mismo, incorpora escenarios nuevos, que es justamente lo que evita que deje de encontrar defectos.',
    hint: '¿Esta suite se queda igual con el tiempo, o cambia?',
  },
  {
    code: 'El equipo reparte la misma cantidad de casos entre los 12 módulos, para no descuidar ninguno.',
    rule: 1,
    why: 'Repartir parejo ignora que los defectos no se distribuyen parejo. Si el historial muestra que unos pocos módulos concentran la mayoría de los fallos, dedicarles el mismo esfuerzo que al resto deja el riesgo principal desatendido.',
    hint: '¿El historial de defectos muestra que todos los módulos reciben la misma atención?',
  },
  {
    code: 'El equipo corre los mismos 15 casos de carrito desde hace dos años, aunque cambiaron las reglas de envío, y no agrega ninguno.',
    rule: 4,
    why: 'Los casos no cambiaron y las reglas del sistema sí. Una suite que repite exactamente lo mismo deja de mirar las partes nuevas, así que cada vez encuentra menos aunque el sistema siga teniendo defectos.',
    hint: '¿Qué cambió en el sistema desde la última vez que se actualizó la suite?',
  },
  {
    code: 'El equipo de una historia clínica exige doble revisión de cada cambio; el de la landing promocional revisa solo el flujo de conversión.',
    rule: 0,
    why: 'El rigor se ajusta al impacto de un fallo en cada sistema. No es incoherencia entre equipos: es aplicar el nivel de esfuerzo que cada contexto justifica.',
    hint: '¿Los dos sistemas tienen el mismo impacto si fallan?',
  },
  {
    code: 'El equipo de una app de recetas copia el plan de seguridad de un home banking y retrasa seis semanas el lanzamiento.',
    rule: 3,
    why: 'El plan de un home banking responde a un riesgo que una app de recetas no tiene. Aplicar el mismo nivel de exigencia sin mirar el contexto agrega costo sin un beneficio proporcional.',
    hint: '¿Qué consecuencias tendría un fallo de seguridad en cada uno de los dos sistemas?',
  },
  {
    code: 'El equipo planifica la primera sesión de testing de la facturación para después del code freeze, cuando ya no haya cambios.',
    rule: 2,
    why: 'Esperar a que el código esté congelado deja que cualquier problema de diseño llegue hasta el final. Cuanto más tarde se descubre, más caro sale corregirlo: eso contradice el principio de testear temprano.',
    hint: '¿Cuándo sería más barato encontrar un problema de diseño de la facturación?',
  },
  {
    code: 'Antes de programar la facturación, el tester revisa el requisito y marca que no define cómo redondear los centavos.',
    rule: 0,
    why: 'Revisar el requisito antes de que exista código es aplicar testing temprano. El hallazgo llega cuando corregirlo todavía es barato, no después de implementado.',
    hint: '¿Esto pasa antes o después de que exista código?',
  },
];

export const CLOSING_QUIZ: QuizQuestion[] = [
  {
    question:
      'Un sistema pasa todos sus casos de test, pero los usuarios lo abandonan porque no resuelve lo que necesitaban. ¿Qué principio explica la situación?',
    options: [
      {
        text: 'La falacia de "ausencia de errores": un sistema puede no tener defectos encontrados y aun así ser inútil.',
        correct: true,
        why: 'Pasar los casos solo confirma que el sistema hace lo que esos casos verificaron. Si lo verificado no era lo que el usuario necesitaba, no hay defecto visible y el producto igual fracasa.',
      },
      {
        text: 'Que testing exhaustivo es imposible.',
        correct: false,
        why: 'El problema no es la cantidad de combinaciones probadas, sino que se verificó algo que no coincidía con la necesidad real del usuario.',
      },
      {
        text: 'La paradoja del pesticida.',
        correct: false,
        why: 'Ese principio habla de suites que dejan de encontrar defectos por repetir los mismos casos, no de un producto que cumple los tests y no sirve para lo que el usuario necesita.',
      },
    ],
  },
  {
      question:
        'Un formulario tiene 5 campos, cada uno con 10 valores posibles. El equipo decide probar solo un subconjunto. ¿Qué principio respalda esa decisión?',
      options: [
        {
          text: 'Que las herramientas de testing no soportan tantos casos a la vez.',
          correct: false,
          why: 'El límite no es de la herramienta: aunque pudiera ejecutar 100.000 casos, el número de combinaciones crece demasiado rápido como para agotarlo en cualquier sistema real.',
        },
        {
          text: 'Que el testing exhaustivo es imposible y hay que elegir un subconjunto representativo.',
          correct: true,
          why: 'Las 100.000 combinaciones no se pueden agotar en la práctica. Elegir un subconjunto con criterio es la respuesta correcta a esa imposibilidad, no una concesión de calidad.',
        },
        {
          text: 'Que los defectos se agrupan en unos pocos módulos.',
          correct: false,
          why: 'La agrupación habla de dónde aparecen los defectos dentro del sistema, no de cuántas combinaciones de un mismo formulario conviene probar.',
        },
      ],
    }
];
