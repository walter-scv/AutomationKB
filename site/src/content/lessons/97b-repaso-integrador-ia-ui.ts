import type {DecisionNode} from '@site/src/components/DecisionPath';
import type {ClassifyItem} from '@site/src/components/Classify';
import type {FillBlankSlot} from '@site/src/components/FillBlank';
import type {OrderItem, OrderRule} from '@site/src/components/Order';
import type {CodeLine} from '@site/src/components/FindInCode';
import type {MatchItem} from '@site/src/components/Match';
import type {QuizQuestion} from '@site/src/components/Quiz';
import type {MultiSelectQuestion} from '@site/src/components/MultiSelect';
import type {BuilderStep} from '@site/src/components/CommandBuilder';

// 1. Escenario encadenado (79, 81, 82, 84, 86)
export const GROW_START = 'forget';
export const GROW_NODES: Record<string, DecisionNode> = {
  forget: {
    id: 'forget',
    situation: 'Cada mañana, el equipo le vuelve a explicar al agente cómo se corre la suite de la agenda y que los locators van en los Page Objects. ¿Qué cambia?',
    options: [
      {text: 'Pegar las mismas explicaciones al empezar, desde un archivo que cada persona guarda.', correct: false, why: 'Es justo lo que las instrucciones del proyecto evitan, y cada persona termina con su versión.'},
      {text: 'Un CLAUDE.md versionado con los comandos y las convenciones de la suite.', correct: true, why: 'Lo que el agente necesita en cada sesión va en el archivo que se carga al empezar (entrada 79).', next: 'review'},
      {text: 'Usar un modelo más grande, que recuerde lo que se le explicó el día anterior.', correct: false, why: 'Ningún modelo recuerda entre sesiones.'},
    ],
  },
  review: {
    id: 'review',
    situation: 'Las revisiones de Page Objects las hace el mismo agente que los escribe, y aprueba casi todo. ¿Qué agregás?',
    options: [
      {text: 'Un subagente revisor, de solo lectura, que devuelve un veredicto fijo.', correct: true, why: 'Contexto propio, herramientas mínimas y una salida que se puede leer (entradas 82 y 86).', next: 'legacy'},
      {text: 'Una línea en el CLAUDE.md que le pida ser más crítico al revisar.', correct: false, why: 'Sigue revisando con el mismo contexto y los mismos supuestos.'},
      {text: 'Una skill que le recuerde las reglas mientras escribe, sin revisar después.', correct: false, why: 'Ayuda a escribir mejor, pero no reemplaza una revisión independiente.'},
    ],
  },
  legacy: {
    id: 'legacy',
    situation: 'A pesar de la instrucción del CLAUDE.md, el agente editó un archivo de la carpeta legacy/, que el equipo congeló. ¿Qué hacés?',
    options: [
      {text: 'Repetir la instrucción en mayúsculas al principio del CLAUDE.md.', correct: false, why: 'Una instrucción es contexto, no un bloqueo.'},
      {text: 'Activar el modo plan en todas las sesiones del equipo.', correct: false, why: 'Frena todas las ediciones y no protege legacy/ una vez aprobado el plan.'},
      {text: 'Agregar un deny para Edit(/legacy/**) en .claude/settings.json.', correct: true, why: 'Lo que no puede pasar nunca se bloquea con permisos (entrada 84).'},
    ],
  },
};
export const GROW_EXPLANATION =
  'Instrucciones del proyecto para lo que se repite en cada sesión, un subagente para revisar con independencia y un permiso para lo que no puede pasar nunca.';

// 2. Clasificar (79, 80, 81, 84, 85)
export const PIECE_COLUMNS = ['CLAUDE.md o regla', 'Comando o skill', 'Permiso o hook'];
export const PIECE_ITEMS: ClassifyItem[] = [
  {code: 'La suite se corre con npx playwright test y los tipos se revisan con npx tsc --noEmit.', column: 0, why: 'Contexto que el agente necesita en casi todas las tareas (entrada 79).', hint: '¿Es contexto general o una tarea?'},
  {code: 'El procedimiento para reportar un defecto en Jira, con la plantilla y ejemplos.', column: 1, why: 'Una tarea con archivos de apoyo, que conviene invocar a pedido (entrada 81).', hint: '¿Es una tarea con su propio material?'},
  {code: 'Que el agente nunca lea el .env.', column: 2, why: 'Tiene que cumplirse siempre: una regla deny (entrada 84).', hint: '¿Alcanza con pedírselo?'},
  {code: 'Que en cualquier acción del agente solo aparezcan emails de las cuentas de prueba.', column: 2, why: 'Necesita lógica propia y cumplirse siempre: un hook (entrada 85).', hint: '¿Un patrón fijo alcanza para expresarlo?'},
  {code: 'Los Page Objects declaran sus locators como readonly en el constructor.', column: 0, why: 'Una convención que se carga al trabajar en pages/: una regla con paths (entrada 79).', hint: '¿Es una convención o una tarea?'},
  {code: 'Un atajo de un solo archivo, /qa:resumen-nocturno, que arma el resumen de la regresión de cada noche.', column: 1, why: 'Un pedido que se repite, en un archivo de .claude/commands/qa/ (entrada 80).', hint: '¿Es contexto, una tarea que se invoca o algo que tiene que cumplirse siempre?'},
  {code: 'El procedimiento para armar el reporte de una exploración, con la plantilla del reporte y un ejemplo.', column: 1, why: 'Una tarea con archivos de apoyo, que se invoca a pedido (entrada 81).', hint: '¿Es una tarea con su propio material?'},
];

// 3. Completar huecos (81)
export const SKILL_TEMPLATE = `---
name: reportar-defecto
{{a}}: Reporta en Jira un defecto confirmado de la agenda, con el formato del equipo.
{{b}}: "<test> <ticket del Pull Request>"
{{c}}: true
---

1. Leé el error-context.md del test $0.
2. Armá el reporte según [plantilla.md](plantilla.md).
3. Mostrame el borrador y {{d}} antes de crear el ticket.`;
export const SKILL_SLOTS: FillBlankSlot[] = [
  {id: 'a', answer: 'description'},
  {id: 'b', answer: 'argument-hint'},
  {id: 'c', answer: 'disable-model-invocation'},
  {id: 'd', answer: 'esperá mi confirmación'},
];
export const SKILL_BANK = ['description', 'argument-hint', 'disable-model-invocation', 'context', 'esperá mi confirmación', 'crealo directamente', 'tools'];
export const SKILL_EXPLANATION =
  'La descripción dice qué hace, `argument-hint` qué recibe, y `disable-model-invocation: true` hace que solo la invoques vos, porque crea tickets; además espera confirmación antes del efecto externo (entrada 81).';

// 4. Ordenar (93, 94)
export const ROUTER_ITEMS: OrderItem[] = [
  {id: 'adj', what: 'Paso', code: 'Un adjudicador independiente aprueba o rechaza cada veredicto.'},
  {id: 'analyze', what: 'Paso', code: 'El análisis en CI agrupa los fallos por causa y los atribuye a Pull Requests.'},
  {id: 'dispatch', what: 'Paso', code: 'Cada grupo aprobado va a su rama de reparación, o a un issue.'},
  {id: 'valve', what: 'Paso', code: 'La válvula de seguridad decide si va al router o es una regresión amplia.'},
  {id: 'repro', what: 'Paso', code: 'El router siembra un entorno limpio y reproduce los grupos en serie.'},
  {id: 'classify', what: 'Paso', code: 'El router clasifica cada grupo con su evidencia.'},
];
export const ROUTER_CORRECT = ['analyze', 'valve', 'repro', 'classify', 'adj', 'dispatch'];
export const ROUTER_RULES: OrderRule[] = [
  {before: 'analyze', after: 'valve', why: 'La válvula decide sobre los grupos que armó el análisis (entrada 94).'},
  {before: 'valve', after: 'repro', why: 'Solo llega al router lo que la válvula no frenó.'},
  {before: 'repro', after: 'classify', why: 'Se clasifica con la evidencia de la reproducción en limpio (entrada 93).'},
  {before: 'classify', after: 'adj', why: 'El adjudicador revisa la clasificación ya hecha.'},
  {before: 'adj', after: 'dispatch', why: 'Solo se actúa sobre veredictos aprobados.'},
];

// 5. Buscar en el código (78, 79, 82, 83, 84)
export const CFG_RULE_LABELS = [
  'Secreto expuesto',
  'Protección que no protege',
  'Alcance demasiado amplio',
];
export const CFG_LINES: CodeLine[] = [
  {
    code: '"headers": { "Authorization": "Bearer ${JIRA_TOKEN}" }   (.mcp.json)',
    rule: 0,
    why: 'El token llega por una variable de entorno: el archivo se versiona sin el secreto (entrada 83).',
    hint: '¿Dónde está el valor real del token?',
  },
  {
    code: '"allow": ["Bash(*)", "Edit(~/**)"]   (settings.json del equipo)',
    rule: 3,
    why: 'Aprueba cualquier comando y cualquier edición en el usuario: mucho más de lo que hace falta (entrada 84).',
    hint: '¿Qué queda sin preguntar con estas reglas?',
  },
  {
    code: '## Reglas — No edites nunca la carpeta legacy/.   (CLAUDE.md, sin regla deny)',
    rule: 2,
    why: 'Es una instrucción: el agente puede no cumplirla. Lo intocable va en un deny (entradas 79 y 84).',
    hint: '¿Qué impide que el agente edite legacy/?',
  },
  {
    code: 'tools: Read, Grep, Glob   (revisor-pom.md)',
    rule: 0,
    why: 'El revisor solo puede leer y buscar (entrada 82).',
    hint: '¿Puede editar lo que revisa?',
  },
  {
    code: 'Cuenta de staging: marta@clinica.test / Marta2024!   (CLAUDE.md)',
    rule: 1,
    why: 'Una contraseña en un archivo que se versiona y entra a cada sesión (entradas 78 y 79).',
    hint: '¿Quién puede leer este archivo?',
  },
  {
    code: '"deny": ["Read(./.env)", "Read(./playwright/.auth/**)"]   (settings.json)',
    rule: 0,
    why: 'Bloquea la lectura de secretos y sesiones guardadas (entrada 84).',
    hint: '¿Qué protege?',
  },
  {
    code: 'name: revisor-datos   (frontmatter sin el campo tools)',
    rule: 3,
    why: 'Sin `tools`, el subagente hereda todas las herramientas, incluida la edición (entrada 82).',
    hint: '¿Qué herramientas tiene este revisor?',
  },
];

// 6. Emparejar (89, 91, 93, 96, 97)
export const AUTO_LEFT: MatchItem[] = [
  {id: 'heal', text: 'Un Pull Request cambió el texto de un botón y la suite del Pull Request falla buscando el texto viejo.'},
  {id: 'router', text: 'La regresión nocturna falla con causas mezcladas: datos, locators y un posible defecto.'},
  {id: 'explore', text: 'Un Pull Request cambia la reprogramación y la suite no cubre sus caminos laterales.'},
  {id: 'design', text: 'Un Pull Request de diseño cambia la tarjeta de turno y diseño tiene que aprobarlo.'},
  {id: 'pipeline', text: 'Hay que automatizar los 12 casos de uso de la pantalla de pacientes, con revisión y documentación.'},
  {id: 'agents', text: 'Hay que cubrir rápido una pantalla nueva con un primer plan y sus borradores, con lo que trae Playwright.'},
];
export const AUTO_RIGHT: MatchItem[] = [
  {id: 'design', text: 'Design review con capturas antes y después'},
  {id: 'agents', text: 'Los agentes de Playwright: planner, generator y healer'},
  {id: 'heal', text: 'Auto-heal en el Pull Request'},
  {id: 'pipeline', text: 'Un pipeline multiagente propio, con gates y revisores'},
  {id: 'explore', text: 'Testing exploratorio disparado por el Pull Request'},
  {id: 'router', text: 'Router de causa raíz'},
];
export const AUTO_WHY: Record<string, string> = {
  heal: 'Un locator desactualizado por un cambio del propio Pull Request (entrada 91).',
  router: 'Causas mezcladas que hay que clasificar con evidencia (entrada 93).',
  explore: 'Cobertura extra en lo que la suite no cubre (entrada 96).',
  design: 'Diseño compara pares de capturas, no un diff (entrada 97).',
  pipeline: 'Varias fases con roles, gates y documentación (entradas 87 y 88).',
  agents: 'Un sistema ya armado para planificar, generar y reparar (entrada 89).',
};

// 7. Elegí la opción (75, 77, 95)
export const READ_QUIZ: QuizQuestion[] = [
  {
    question: 'El agente propone, para un test de la agenda, await page.getByRole(\'button\', { name: \'Reservar\' }).clickWhenReady(). ¿Qué hacés?',
    options: [
      {text: 'Comprobar que el método existe: lo más probable es que sea inventado.', correct: true, why: 'Un método que no conocés se verifica; TypeScript lo marca si no existe (entradas 75 y 77).'},
      {text: 'Aceptarlo, porque el agente conoce bien Playwright.', correct: false, why: 'Un modelo puede escribir con seguridad un método que no existe.'},
      {text: 'Actualizar Playwright a la última versión para que el método esté disponible.', correct: false, why: 'Primero hay que saber si el método existe en alguna versión.'},
    ],
  },
  {
    question: 'Fallan los 40 tests de la regresión en el mismo paso de la fixture de ingreso. ¿Por dónde empezás?',
    options: [
      {text: 'Por el primer test de la lista, revisando su locator.', correct: false, why: 'Si todos fallan en el mismo paso, es un solo problema: no se va test por test.'},
      {text: 'Pidiéndole al auto-heal que repare los 40.', correct: false, why: 'Un fallo sistémico no es un locator: además, supera el tope de fallos.'},
      {text: 'Por el ingreso y el entorno: es un problema sistémico.', correct: true, why: 'El ingreso es el canario; se descarta lo sistémico antes que nada (entrada 95).'},
    ],
  },
  {
    question: 'Un test generado de reprogramar pasa a la primera. Cambiás el valor esperado por uno imposible y sigue pasando. ¿Qué indica?',
    options: [
      {text: 'Que el test es estable y se puede integrar a la suite sin cambios.', correct: false, why: 'Un test que pasa con cualquier valor esperado no verifica nada.'},
      {text: 'Que la assertion no verifica: le falta el await o apunta a otro elemento.', correct: true, why: 'Con un valor imposible tendría que fallar; romper a propósito lo que verifica es la prueba de que el test sirve (entrada 77).'},
      {text: 'Que staging devuelve valores distintos según la hora en que corre.', correct: false, why: 'Antes de sospechar del entorno, se revisa la assertion del propio test.'},
    ],
  },
  {
    question: 'En una sesión, el agente reescribió AgendaPage.ts y además corrió un script que regeneró fixtures/turnos.json. Querés volver todo atrás. ¿Qué usás?',
    options: [
      {text: '/rewind para lo que editó el agente, y git diff y Git para lo que cambió el script.', correct: true, why: '/rewind vuelve las ediciones del agente; lo que cambió un comando de la terminal se revisa y se descarta con Git (entrada 78a).'},
      {text: '/clear, que vacía la conversación y deshace sus cambios.', correct: false, why: '/clear vacía el contexto; los archivos quedan como están.'},
      {text: '/rewind, que vuelve todo lo que pasó en la sesión, incluidos los comandos.', correct: false, why: 'Lo que cambia un comando de la terminal no siempre queda registrado para /rewind.'},
    ],
  },
];

// 8. Marcar todas (92)
export const SCOPE_QUESTIONS: MultiSelectQuestion[] = [
  {
    prompt: 'En el diff de un auto-heal de la rama «locator desactualizado», ¿qué cambios se aceptan? Marcá todos los que correspondan.',
    options: [
      {text: 'La entrada del contrato con el texto nuevo del componente.', correct: true, why: 'Es lo que permite esta rama.'},
      {text: 'Un locator que pasa de buscar por posición a buscar la fila por la hora.', correct: true, why: 'Angosta el locator: permitido en cualquier rama.'},
      {text: 'Un toHaveText(\'Libre\') que pasa a toBeAttached().', correct: false, why: 'Afloja la verificación: se rechaza siempre.'},
      {text: 'Un .first() para esquivar un error de strict mode.', correct: false, why: 'Elige un elemento cualquiera: se rechaza siempre.'},
      {text: 'Un timeout mayor en el test de reprogramar.', correct: false, why: 'Esta rama no toca tests, y un timeout mayor tapa un cuelgue.'},
    ],
  },
];

// 9. Armar (76, 91, 92)
export const HEAL_PREFIX = '';
export const HEAL_STEPS: BuilderStep[] = [
  {options: ['Fallaron 3 tests de la agenda en CI; revisá la suite y arreglá lo que haga falta. ', 'Fallaron 3 tests de cancelación: el Pull Request cambió «Cancelar» por «Cancelar turno». ', 'Fallaron 3 tests de cancelación después del último Pull Request de la agenda. '], correct: 'Fallaron 3 tests de cancelación: el Pull Request cambió «Cancelar» por «Cancelar turno». ', hint: '¿Cuál dice qué falló y por qué?'},
  {options: ['Podés modificar locators.ts, pages/*.ts y los tests, sin tocar la aplicación. ', 'Podés modificar solo locators.ts y pages/*.ts. ', 'Podés modificar lo necesario, salvo la configuración de Playwright. '], correct: 'Podés modificar solo locators.ts y pages/*.ts. ', hint: '¿Cuál define el alcance de una reparación de locators?'},
  {options: ['Verificá corriendo solo esos 3 tests con --grep. ', 'Verificá corriendo la suite completa en todos los navegadores. ', 'Verificá con npx tsc --noEmit que no haya errores de tipos. '], correct: 'Verificá corriendo solo esos 3 tests con --grep. ', hint: '¿Cuál verifica lo justo, con una ejecución real?'},
  {options: ['Si no podés, marcá los tests con test.fixme y explicá por qué.', 'Si no podés, subí lo que tengas para que alguien lo termine.', 'Si no podés, detenete, explicá por qué y no subas nada.'], correct: 'Si no podés, detenete, explicá por qué y no subas nada.', hint: '¿Qué hace un agente de reparación cuando no puede?'},
];
export const HEAL_EXPLANATION =
  'Qué falló y por qué, el alcance estricto, una verificación acotada y qué hacer si no puede: el pedido del auto-heal (entradas 76, 91 y 92).';

// 10. Respuesta escrita (84)
export const RULE_ACCEPTED = ["Read(./.env)", "\"Read(./.env)\"", "Read(.env)", "\"Read(.env)\"", "Read(/.env)", "\"Read(/.env)\""];
export const RULE_HINTS = [
  'Es una regla que nombra la herramienta de lectura y, entre paréntesis, el archivo.',
  'La herramienta es Read y el archivo es el .env del directorio actual.',
];
export const RULE_EXPLANATION =
  '`Read(./.env)` en la lista `deny` impide que el agente lea el `.env`, aunque se lo pidan (entrada 84).';

// 11. Clasificar (85a, 85b, 85c, 85d)
export const BASE_COLUMNS = ['Casos de uso o mapa', 'Entorno y datos', 'Agente en CI'];
export const BASE_ITEMS: ClassifyItem[] = [
  {code: 'El agente que explora valida que se puede cancelar 1 hora antes, porque nadie escribió que el límite es 2 horas.', column: 0, why: 'Faltan las reglas del caso de uso (entrada 85a).', hint: '¿Le faltó saber qué tiene que pasar, dónde trabajar o cómo correr solo?'},
  {code: 'El agente no encuentra el diálogo de reprogramar porque no sabe que se abre desde la fila de un turno reservado.', column: 0, why: 'Falta la transición en el mapa de navegación, con lo que requiere (entrada 85b).', hint: '¿Le faltó saber qué tiene que pasar, cómo llegar o dónde trabajar?'},
  {code: 'El agente creó cuarenta turnos en staging y la regresión de la noche falló por horarios ocupados.', column: 1, why: 'Necesitaba un entorno propio y descartable (entrada 85c).', hint: '¿El problema es dónde trabajó?'},
  {code: 'La herramienta de datos creó turnos contra producción porque BASE_URL apuntaba ahí.', column: 1, why: 'El control de «solo local» tiene que estar en la herramienta (entrada 85c).', hint: '¿Qué control le faltaba a la herramienta?'},
  {code: 'El auto-heal subió una corrección y la suite no volvió a correr sobre ese commit.', column: 2, why: 'Los commits hechos con GITHUB_TOKEN no disparan otros workflows (entrada 85d).', hint: '¿Es un problema del documento, del entorno o de cómo corre en GitHub Actions?'},
  {code: 'Un agente en un workflow dio vueltas durante dos horas y consumió el límite del día.', column: 2, why: 'Faltaban --max-turns y timeout-minutes (entrada 85d).', hint: '¿Qué límite le faltaba al workflow?'},
];
