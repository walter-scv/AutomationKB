import type {CodeLine} from '@site/src/components/FindInCode';
import type {QuizQuestion} from '@site/src/components/Quiz';

export const DIAGNOSIS_RULE_LABELS = [
  'Faltó aplicar boundary value analysis en el límite exacto',
  'Se priorizó lo de bajo impacto antes que lo crítico',
  'Faltó una decision table para la combinación de condiciones',
  'El caso no era preciso: no definía un valor ni un resultado verificable',
];

export const DIAGNOSIS_LINES: CodeLine[] = [
  {
    code: 'El equipo pasó dos días escribiendo casos detallados para el selector de idioma mientras el flujo de pago quedó sin ningún caso formal.',
    rule: 2,
    why: 'Se dedicó esfuerzo a lo de bajo impacto mientras lo crítico quedó sin cobertura formal. Es un problema de priorización, no de cómo se escribió cada caso.',
    hint: '¿El problema está en cómo se escribió cada caso, o en qué se eligió cubrir primero?',
  },
  {
    code: 'Un caso dice: con 7 caracteres el registro muestra «mínimo 8 caracteres» y no crea la cuenta.',
    rule: 0,
    why: 'El caso fija el valor exacto, el resultado esperado y qué mensaje debe aparecer. Con esos datos, dos personas ejecutan exactamente lo mismo.',
    hint: '¿El caso fija un valor y un resultado exacto?',
  },
  {
    code: '«Crear cuenta» queda habilitado con el checkbox de términos destildado solo cuando la contraseña tiene 8 caracteres: una combinación que nadie probó junta.',
    rule: 3,
    why: 'El bug solo aparece al combinar dos condiciones: por separado cada una puede funcionar. Sin una tabla que cruce ambas, esa fila no existe.',
    hint: '¿El bug aparece con un campo solo, o con la combinación de dos?',
  },
  {
    code: 'El equipo probó el registro con 8, 7, 64 y 65 caracteres, y además con el campo vacío.',
    rule: 0,
    why: 'Cubre los dos bordes de cada límite y suma la partición de ausencia de valor. No falta ningún caso relevante de ese campo.',
    hint: '¿Cubre los bordes de cada límite?',
  },
  {
    code: 'En producción, una contraseña de exactamente 8 caracteres queda rechazada, y solo se habían probado 3 y 20.',
    rule: 1,
    why: 'Se probaron valores del medio de cada partición, no los bordes. El error de comparación justo en 8 pasa inadvertido.',
    hint: '¿Esos valores estaban en el borde del rango o en el medio?',
  },
  {
    code: 'Dos personas ejecutan el caso de registro: una dice que 8 caracteres fue aceptado, la otra que fue rechazado. El caso solo decía «probar con una contraseña corta».',
    rule: 4,
    why: 'El caso no fija ni el valor de entrada ni el resultado esperado. La discrepancia es del caso, no necesariamente del sistema.',
    hint: '¿El caso definía un valor exacto y un resultado esperado?',
  },
  {
    code: 'El plan cubre Creado → Pagado → Enviado → Entregado, además de Creado → Cancelado y Pagado → Cancelado; también verifica que cancelar desde Enviado se rechace.',
    rule: 0,
    why: 'Cubre el camino principal, las dos cancelaciones válidas y una transición inválida. El mapa de estados queda bien recorrido.',
    hint: '¿Este plan cubre el camino principal, las ramas y una transición inválida?',
  },
  {
    code: 'El checkout tiene casos detallados y se ejecuta en cada release; el texto de ayuda se revisa con una sesión exploratoria de 30 minutos.',
    rule: 0,
    why: 'Prioriza el detalle en lo que se usa siempre y deja una pasada acotada para lo de bajo impacto. Es una decisión de riesgo razonable.',
    hint: '¿El detalle del testing sigue al riesgo acá?',
  },
];

export const INTEGRATIVE_QUIZ: QuizQuestion[] = [
  {
    question:
      'Un pedido de compra pasa por Creado → Pagado → Enviado → Entregado, y también puede cancelarse desde Creado o Pagado. El equipo tiene tiempo limitado antes del release. ¿Qué combinación de criterios decide qué cubrir primero?',
    options: [
      {
        text: 'State transition para mapear las transiciones, y risk-based testing para decidir cuáles probar primero.',
        correct: true,
        why: 'El diagrama da el mapa completo de lo que existe; el criterio de riesgo decide, dentro de ese mapa, qué priorizar cuando no alcanza el tiempo.',
      },
      {
        text: 'Alcanza con state transition testing: una vez mapeadas las transiciones, se prueban todas por igual.',
        correct: false,
        why: 'Mapear es necesario, pero no decide el orden. Con tiempo limitado, dos transiciones igual de válidas pueden tener impacto muy distinto si fallan.',
      },
      {
        text: 'Alcanza con risk-based testing: se prioriza por impacto sin necesidad de mapear los estados.',
        correct: false,
        why: 'Sin el mapa de estados no se sabe qué casos existen. Se puede priorizar solo lo que ya se conoce, y dejar una transición inválida entera sin cubrir.',
      },
    ],
  },
  {
    question:
      'Encontrás un defecto: el total de una compra se calcula mal solo cuando el carrito tiene más de 20 productos distintos Y se aplica un cupón. ¿Qué técnicas lo hubieran anticipado?',
    options: [
      {
        text: 'Equivalence partitioning, probando un carrito grande y un cupón por separado.',
        correct: false,
        why: 'Probar cada condición por separado es justo lo que deja pasar un bug que solo aparece en la combinación. Hace falta cruzar las dos.',
      },
      {
        text: 'Solo testing exploratorio, porque la combinación es demasiado rara para planificarla.',
        correct: false,
        why: 'Exploratorio puede complementar, pero dejar librada al azar una combinación específica no es una estrategia de cobertura.',
      },
      {
        text: 'Decision table para la combinación de producto y cupón, más boundary value analysis en el límite de 20.',
        correct: true,
        why: 'Hay dos condiciones que interactúan y una de ellas tiene un límite numérico. Cada técnica cubre una parte distinta del mismo caso.',
      },
    ],
  },
  {
    question:
      'Un ícono mal alineado aparece en la pantalla de pago, la más usada. Un error 500 aparece en una pantalla de configuración que casi nadie abre. ¿Cómo se comparan en severidad y prioridad?',
    options: [
      {
        text: 'El error 500 es siempre más urgente que cualquier problema cosmético, sin importar dónde aparezca.',
        correct: false,
        why: 'La severidad técnica del 500 es mayor, pero la prioridad depende también de cuánta gente lo encuentra. No siempre es lo primero a arreglar.',
      },
      {
        text: 'El ícono tiene baja severidad pero prioridad media por estar en pago; el 500 tiene alta severidad y prioridad baja por su poco uso.',
        correct: true,
        why: 'Severidad mide el impacto técnico del defecto; prioridad mide cuándo conviene arreglarlo, y eso depende también de cuánta gente lo sufre.',
      },
      {
        text: 'Los dos tienen la misma prioridad porque los dos son defectos y se reportaron la misma semana.',
        correct: false,
        why: 'Severidad y prioridad existen para no tratar todos los defectos por igual. El momento del reporte no define la urgencia.',
      },
    ],
  },
];
