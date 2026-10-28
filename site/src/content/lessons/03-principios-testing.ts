import type {CodeLine} from '@site/src/components/FindInCode';
import type {MatchItem} from '@site/src/components/Match';
import type {BuilderStep} from '@site/src/components/CommandBuilder';

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

export const PRINCIPLE_MATCH_LEFT: MatchItem[] = [
  {id: 'p1', text: '1. Testing muestra la presencia de defectos, no su ausencia'},
  {id: 'p2', text: '2. Testing exhaustivo es imposible'},
  {id: 'p3', text: '3. Testing temprano ahorra tiempo y dinero'},
  {id: 'p4', text: '4. Los defectos se agrupan'},
  {id: 'p5', text: '5. Paradoja del pesticida'},
  {id: 'p6', text: '6. Testing depende del contexto'},
  {id: 'p7', text: '7. Falacia de "ausencia de errores"'},
];
export const PRINCIPLE_MATCH_RIGHT: MatchItem[] = [
  {id: 'p5', text: 'Una suite que se corre igual desde hace dos años no encontró ningún defecto nuevo en los últimos diez releases, aunque el producto cambió mucho.'},
  {id: 'p3', text: 'Un requisito ambiguo detectado en la revisión se aclara en diez minutos; el mismo error detectado en producción obligó a corregir datos de miles de clientes.'},
  {id: 'p7', text: 'La app de turnos pasa todos sus casos sin un solo fallo, pero los pacientes la dejan de usar porque no permite reprogramar un turno.'},
  {id: 'p1', text: 'El informe dice que los 120 casos pasaron; una semana después aparece en producción un fallo en una situación que ningún caso cubría.'},
  {id: 'p6', text: 'El equipo descarta usar en la web de inscripción a un torneo barrial la misma checklist de 300 casos que usa el sistema de control de vuelos.'},
  {id: 'p2', text: 'Un buscador de vuelos combina origen, destino, fechas, pasajeros y clase: el equipo elige 40 combinaciones representativas en vez de intentar todas.'},
  {id: 'p4', text: 'Tres de los veinte módulos del sistema acumulan el 70% de los incidentes del año.'},
];
export const PRINCIPLE_MATCH_WHY: Record<string, string> = {
  p1: 'Que los 120 casos pasen solo dice que esos casos no encontraron nada; no prueba que no haya defectos en lo que no se miró.',
  p2: 'Las combinaciones posibles son demasiadas para probarlas todas: hay que elegir un subconjunto representativo.',
  p3: 'El mismo problema cuesta minutos en la revisión del requisito y mucho más una vez que llegó a producción.',
  p4: 'Pocos módulos concentran la mayoría de los defectos: es la señal para concentrar ahí el esfuerzo.',
  p5: 'Repetir los mismos casos sin cambios deja de encontrar defectos nuevos, aunque la suite siga en verde.',
  p6: 'El rigor se ajusta a qué tan crítico es el sistema: lo que se justifica en control de vuelos es desproporcionado en una inscripción barrial.',
  p7: 'Que no haya defectos encontrados no sirve si el sistema no resuelve lo que el usuario necesita.',
};

export const REPORT_PREFIX = 'Informe de cierre: módulo de pagos';
export const REPORT_STEPS: BuilderStep[] = [
  {
    options: [
      '\nSe ejecutaron 120 casos: el módulo de pagos no tiene defectos.',
      '\nSe ejecutaron 120 casos y no se encontraron defectos en lo que se probó.',
      '\nSe probaron todas las combinaciones posibles de medios de pago y montos.',
    ],
    correct: '\nSe ejecutaron 120 casos y no se encontraron defectos en lo que se probó.',
    hint: 'A partir de 120 casos, ¿qué puede afirmar el informe: algo sobre lo probado, o sobre todo el módulo?',
  },
  {
    options: [
      '\nEl próximo ciclo repite exactamente los mismos 120 casos, que siempre dan verde.',
      '\nComo no aparecieron defectos, el próximo ciclo se saltea pagos.',
      '\nPara el próximo ciclo se suman casos a partir de los incidentes reportados este mes.',
    ],
    correct: '\nPara el próximo ciclo se suman casos a partir de los incidentes reportados este mes.',
    hint: 'Una suite que no cambia nunca, ¿sigue encontrando defectos nuevos?',
  },
  {
    options: [
      '\nEl próximo ciclo prioriza pagos y facturación, que concentraron el 70% de los incidentes del año.',
      '\nEl esfuerzo del próximo ciclo se reparte igual entre los 12 módulos.',
      '\nPagos se testea con el mismo rigor que la página de ayuda.',
    ],
    correct: '\nEl próximo ciclo prioriza pagos y facturación, que concentraron el 70% de los incidentes del año.',
    hint: '¿Todos los módulos tienen la misma historia de defectos? ¿Y el mismo impacto si fallan?',
  },
];
export const REPORT_EXPLANATION =
  'El informe dice lo que el testing puede respaldar: que no aparecieron defectos en lo probado, no que no existan (principio 1; probar todas las combinaciones es imposible, principio 2). La suite se renueva para no caer en la paradoja del pesticida (principio 5), y el esfuerzo va donde se agrupan los defectos (principio 4) y donde el contexto lo exige (principio 6).';
