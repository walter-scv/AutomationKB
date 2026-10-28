import type {SpotTokenRound} from '@site/src/components/SpotToken';
import type {CodeLine} from '@site/src/components/FindInCode';
import type {QuizQuestion} from '@site/src/components/Quiz';
import type {MatchItem} from '@site/src/components/Match';
import type {FillBlankSlot} from '@site/src/components/FillBlank';
import type {BuilderStep} from '@site/src/components/CommandBuilder';
import type {MultiSelectQuestion} from '@site/src/components/MultiSelect';
import type {DecisionNode} from '@site/src/components/DecisionPath';

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

// ---- Contexto común de las actividades nuevas: cupones de descuento en una tienda online ----

export const CONCEPT_MATCH_LEFT: MatchItem[] = [
  {id: 'analisis', text: 'Antes de escribir casos, una analista lee las reglas de los cupones y lista qué hay que cubrir: largo del código, monto mínimo y vencimiento.'},
  {id: 'debugging', text: 'Un desarrollador sigue con breakpoints por qué el cupón `VERANO10` no descuenta, hasta encontrar la comparación que falla.'},
  {id: 'principio', text: 'Tras 60 casos sin fallos, el informe dice "no se encontraron defectos en lo probado", y no "los cupones no tienen defectos".'},
  {id: 'validacion', text: 'Cinco clientes reales intentan aplicar un cupón sin ayuda; tres no encuentran dónde escribirlo, aunque la pantalla cumple el diseño.'},
  {id: 'confianza', text: 'Antes del lanzamiento, QA le entrega a marketing la evidencia de qué se probó, para que decidan la fecha con respaldo.'},
];
export const CONCEPT_MATCH_RIGHT: MatchItem[] = [
  {id: 'validacion', text: 'Validación: ¿le sirve a quien lo usa?'},
  {id: 'confianza', text: 'Objetivo de testing: dar confianza a los interesados'},
  {id: 'analisis', text: 'Análisis, dentro del proceso de testing'},
  {id: 'principio', text: 'Principio: testing muestra la presencia de defectos, no su ausencia'},
  {id: 'debugging', text: 'Debugging: buscar la causa de un fallo ya conocido'},
];
export const CONCEPT_MATCH_WHY: Record<string, string> = {
  analisis: 'Determinar qué testear a partir de las reglas, antes de diseñar casos, es la actividad de Análisis (entrada 06).',
  debugging: 'Parte de un fallo ya observado y busca su causa en el código: es debugging, no testing (entrada 02).',
  principio: 'Que 60 casos no encuentren nada no prueba que no haya defectos: solo que no aparecieron en lo probado (entrada 03).',
  validacion: 'La pantalla cumple el diseño (verificada), pero no les sirve a los clientes reales: falla la validación (entrada 05).',
  confianza: 'El destinatario es marketing y el propósito es que decida con evidencia: dar confianza a los interesados (entrada 01).',
};

export const COUPON_BVA_TEMPLATE =
  'Regla: el código de cupón tiene entre 6 y 10 caracteres.\n\nValores a probar, de menor a mayor: {{a}}, {{b}}, {{c}} y {{d}} caracteres.';
export const COUPON_BVA_SLOTS: FillBlankSlot[] = [
  {id: 'a', answer: '5'},
  {id: 'b', answer: '6'},
  {id: 'c', answer: '10'},
  {id: 'd', answer: '11'},
];
export const COUPON_BVA_BANK = ['8', '11', '4', '6', '12', '5', '10', '7'];
export const COUPON_BVA_EXPLANATION =
  '5 y 11 son los primeros valores inválidos de cada lado, y 6 y 10 los últimos válidos (entrada 11). 7 y 8 caen en el medio de la partición válida, y 4 y 12 en el medio de las inválidas: ninguno de ellos es un límite.';

export const COUPON_ROWS_ACCEPTED = ['8', 'ocho'];
export const COUPON_ROWS_HINTS = [
  'Son tres condiciones de sí/no que interactúan. Acordate de cuántas filas tiene una tabla con dos condiciones, y qué pasa al sumar una.',
  'Cada condición de sí/no duplica las filas: 2 condiciones → 4 filas. Ahora sumá la tercera.',
];
export const COUPON_ROWS_EXPLANATION =
  'Tres condiciones de sí/no dan 2 × 2 × 2 = 8 combinaciones (entrada 12). La tabla obliga a cubrir casos que nadie probaría por separado, como "cupón válido, carrito de $5000 o más, pero cliente invitado".';

export const COUPON_CASE_PREFIX = 'Caso: aplicar un cupón válido en el checkout';
export const COUPON_CASE_STEPS: BuilderStep[] = [
  {
    options: [
      '\nPrecondición: el carrito tiene productos y hay cupones cargados.',
      '\nPrecondición: existe el cupón "VERANO10" activo, del 10%, y el carrito tiene un solo producto de $6000.',
      '\nPrecondición: se usa el carrito que dejó armado el caso anterior.',
    ],
    correct: '\nPrecondición: existe el cupón "VERANO10" activo, del 10%, y el carrito tiene un solo producto de $6000.',
    hint: '¿Con esta precondición, cualquiera sabe qué cupón existe, qué hay en el carrito y no depende de otro caso?',
  },
  {
    options: [
      '\nPasos: 1) Escribir "VERANO10" en el campo Cupón. 2) Tocar "Aplicar".',
      '\nPasos: aplicar un cupón válido.',
      '\nPasos: probar algunos códigos hasta que uno funcione.',
    ],
    correct: '\nPasos: 1) Escribir "VERANO10" en el campo Cupón. 2) Tocar "Aplicar".',
    hint: 'Si dos personas siguen estos pasos, ¿escriben exactamente el mismo código?',
  },
  {
    options: [
      '\nResultado esperado: el descuento se aplica bien.',
      '\nResultado esperado: el total se ve más barato que antes.',
      '\nResultado esperado: el total pasa de $6000 a $5400.',
    ],
    correct: '\nResultado esperado: el total pasa de $6000 a $5400.',
    hint: '¿Este resultado se puede confirmar sin opinar?',
  },
];
export const COUPON_CASE_EXPLANATION =
  'Precondición completa e independiente, pasos con el dato exacto y un resultado verificable (entradas 08 y 09). "Se aplica bien" y "se ve más barato" son opiniones; un carrito que dejó otro caso rompe la independencia.';

export const COUPON_TECHNIQUE_QUESTIONS: MultiSelectQuestion[] = [
  {
    prompt: 'Para diseñar los casos de los cupones, ¿qué enfoques corresponden? Marcá todos los que apliquen.',
    options: [
      {
        text: 'Boundary value analysis sobre el largo del código (6 a 10 caracteres).',
        correct: true,
        why: 'Es un rango ordenado con dos bordes: justo donde un operador mal escrito se nota (entrada 11).',
      },
      {
        text: 'White-box sobre la función de descuento, aunque QA no tiene acceso al código.',
        correct: false,
        why: 'White-box necesita ver el código fuente. Sin acceso, QA trabaja con técnicas black-box y de experiencia (entrada 10).',
      },
      {
        text: 'State transition sobre el cupón, que pasa de Activo a Usado o a Vencido.',
        correct: true,
        why: 'El mismo intento (aplicarlo) es válido en un estado e inválido en otro: es lo que esta técnica cubre (entrada 13).',
      },
      {
        text: 'Una sesión exploratoria con objetivo y timebox, después de los casos formales.',
        correct: true,
        why: 'Como complemento, encuentra lo que la especificación no anticipó (entrada 14).',
      },
      {
        text: 'Solo error guessing, porque los cupones "siempre fallan en lo mismo".',
        correct: false,
        why: 'Hay especificación clara: depender solo de la experiencia deja puntos ciegos, y la técnica formal va primero (entradas 10 y 14).',
      },
    ],
  },
];

export const INCIDENT_START = 'reporte';
export const INCIDENT_NODES: Record<string, DecisionNode> = {
  reporte: {
    id: 'reporte',
    situation: 'Probando, el cupón `verano10` (en minúsculas) muestra "Cupón inválido", y `VERANO10` funciona. ¿Cómo lo reportás?',
    options: [
      {
        text: '"El cupón falla a veces; debe ser un problema de la base de datos."',
        correct: false,
        why: 'No dice con qué datos reproducirlo y adivina una causa sin evidencia (entradas 02 y 04).',
      },
      {
        text: 'Con los pasos, el código exacto en minúsculas, lo esperado (descuento del 10%) y lo que pasó ("Cupón inválido").',
        correct: true,
        why: 'Describe el fallo observable, reproducible y sin suponer la causa: es lo que le sirve a quien va a debuggear.',
        next: 'raiz',
      },
      {
        text: '"Hay un defecto en la validación de cupones."',
        correct: false,
        why: 'Nombra un defecto que todavía nadie encontró: lo observado es un fallo, no un defecto confirmado (entrada 04).',
      },
    ],
  },
  raiz: {
    id: 'raiz',
    situation: 'Desarrollo encuentra que el código compara distinguiendo mayúsculas, porque el requisito no decía nada sobre eso y se asumió. ¿Qué ataca la causa raíz?',
    options: [
      {
        text: 'Pasar el código a mayúsculas antes de compararlo, y listo.',
        correct: false,
        why: 'Corrige este síntoma, pero la causa (un requisito que no define cómo tratar mayúsculas) sigue ahí y puede repetirse en otros campos.',
      },
      {
        text: 'Aclarar con producto cómo se tratan las mayúsculas en todos los códigos, corregir y revisar si otros campos tienen la misma suposición.',
        correct: true,
        why: 'Elimina el origen (el requisito ambiguo) y busca el mismo patrón en otro lado: eso es perseguir la causa raíz (entrada 04).',
        next: 'cierre',
      },
      {
        text: 'Avisar a los clientes que escriban los cupones siempre en mayúsculas.',
        correct: false,
        why: 'Esconde el fallo trasladándole el problema al usuario: el defecto sigue en el sistema.',
      },
    ],
  },
  cierre: {
    id: 'cierre',
    situation: 'La corrección está mergeada. ¿Qué tiene que pasar antes de cerrar el ticket?',
    options: [
      {
        text: 'Volver a probar `verano10` en minúsculas, con el mismo carrito, y confirmar que aplica el 10%.',
        correct: true,
        why: 'Re-testear el caso original con los mismos datos es lo que confirma que el fallo reportado desapareció (entrada 02).',
      },
      {
        text: 'Nada: el commit explica la causa, así que está resuelto.',
        correct: false,
        why: 'Que el código cambió no confirma que el síntoma desapareció.',
      },
      {
        text: 'Probar `VERANO10` en mayúsculas para confirmar que sigue andando.',
        correct: false,
        why: 'Eso ya andaba antes: no confirma nada sobre el caso que falló.',
      },
    ],
  },
};
export const INCIDENT_EXPLANATION =
  'Un mismo incidente recorre varias entradas: se reporta el fallo con datos y sin adivinar (02), se persigue la causa raíz y no solo el síntoma (04), y se cierra recién después de volver a probar el caso original (02).';

export const NOTES_PROMPT = '¿Qué palabra de esta anotación del proyecto es incorrecta?';
export const NOTES_ROUNDS: SpotTokenRound[] = [
  {
    line: 'Revisar las reglas de los cupones antes de programarlas es testing dinámico.',
    targetIndex: 11,
    why: 'Revisar un requisito sin ejecutar nada es testing estático (entrada 01).',
    hint: '¿Se está ejecutando el sistema en ese momento?',
  },
  {
    line: 'DEF-88: un cupón del 10% descuenta el 100% en cada compra. Severidad baja.',
    targetIndex: 12,
    why: 'Regalar la compra entera en cada uso es un impacto grave sobre el negocio: la severidad es alta (entrada 07).',
    hint: '¿Cuánto le cuesta al negocio cada vez que ocurre?',
  },
  {
    line: 'Desarrollo subió la corrección de DEF-88, así que el reporte pasa a Cerrado.',
    targetIndex: 12,
    why: 'Con la corrección subida el reporte queda Resuelto; recién pasa a Cerrado cuando el re-test confirma que funciona (entrada 02).',
    hint: '¿Alguien volvió a ejecutar el caso que falló?',
  },
  {
    line: 'CT-12, paso 1: aplicar un cupón cualquiera a un carrito de $6000.',
    targetIndex: 6,
    why: 'Un caso concreto indica el cupón exacto; con «cualquiera», cada persona prueba algo distinto (entradas 08 y 09).',
    hint: '¿Dos personas usarían el mismo dato con este paso?',
  },
  {
    line: 'Ningún caso traza a la regla del vencimiento, así que esa regla está cubierta.',
    targetIndex: 13,
    why: 'Si ningún caso traza a una regla, esa regla queda sin cobertura: es lo que la trazabilidad permite ver (entrada 06).',
    hint: '¿Qué significa que ningún caso apunte a una regla?',
  },
];
