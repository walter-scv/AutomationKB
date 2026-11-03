import type {MatchItem} from '@site/src/components/Match';
import type {CodeLine} from '@site/src/components/FindInCode';
import type {MultiSelectQuestion} from '@site/src/components/MultiSelect';

export const FIELD_LEFT: MatchItem[] = [
  {id: 'desc', text: 'Que el agente la use cuando alguien pide revisar los datos de prueba de la agenda.'},
  {id: 'nomodel', text: 'Que la skill que crea tickets en Jira corra solo cuando la pedís vos.'},
  {id: 'hint', text: 'Que el menú muestre que la skill espera el número del Pull Request.'},
  {id: 'tools', text: 'Que la skill pueda correr los tests de la agenda sin pedir permiso cada vez.'},
  {id: 'fork', text: 'Que la revisión corra en un contexto propio, sin cargar la conversación principal.'},
];
export const FIELD_RIGHT: MatchItem[] = [
  {id: 'tools', text: '`allowed-tools: Bash(npx playwright test *)`'},
  {id: 'fork', text: '`context: fork`'},
  {id: 'desc', text: '`description` con qué hace y cuándo usarla'},
  {id: 'hint', text: '`argument-hint: "<número del PR>"`'},
  {id: 'nomodel', text: '`disable-model-invocation: true`'},
];
export const FIELD_WHY: Record<string, string> = {
  desc: 'El agente decide usar una skill leyendo su descripción.',
  nomodel: 'Con ese campo, el agente no puede invocarla por su cuenta.',
  hint: '`argument-hint` muestra los argumentos esperados en el menú.',
  tools: '`allowed-tools` aprueba ese comando durante el turno en que se invoca la skill; leer archivos no necesita aprobación.',
  fork: '`context: fork` la corre en un subagente con su propio contexto.',
};

export const SKILL_RULE_LABELS = [
  'Descripción que no sirve para elegirla',
  'Contenido que no va en una skill',
  'Efecto externo sin control',
];
export const SKILL_LINES: CodeLine[] = [
  {
    code: 'name: revisar-datos',
    rule: 0,
    why: 'Un nombre corto y descriptivo para el atajo.',
    hint: '¿Hay algo que impida usarla bien?',
  },
  {
    code: '## Anexo: guía completa de Playwright (420 líneas copiadas de la documentación)',
    rule: 2,
    why: 'Es conocimiento general y ocupa contexto cada vez que la skill se usa.',
    hint: '¿El agente necesita que le copien eso?',
  },
  {
    code: 'description: Ayuda con los tests.',
    rule: 1,
    why: 'No dice qué hace ni cuándo usarla: el agente no tiene cómo elegirla en el momento justo.',
    hint: '¿Con esta frase, en qué situación la usaría el agente?',
  },
  {
    code: 'Usá la cuenta recepcion@clinica.test con la clave Marta2024! para ingresar.',
    rule: 2,
    why: 'Es un secreto: la skill se versiona y entra al contexto cada vez que se usa.',
    hint: '¿Puede quedar esto en el repositorio?',
  },
  {
    code: '1. Leé el test $ARGUMENTS y las reglas de [datos.md](datos.md).',
    rule: 0,
    why: 'Recibe el archivo como argumento y lleva el detalle a un archivo de apoyo.',
    hint: '¿Dónde está el detalle de las reglas?',
  },
  {
    code: '4. Si encontrás un dato compartido entre tests, creá el ticket en Jira directamente, sin mostrármelo.',
    rule: 3,
    why: 'Crear un ticket es un efecto externo: la skill tiene que mostrar el borrador y esperar confirmación, o no poder invocarse sola.',
    hint: '¿Qué pasa afuera si este paso se equivoca?',
  },
  {
    code: '5. Respondé APROBADO o RECHAZADO, y por cada problema la línea y la regla.',
    rule: 0,
    why: 'Un formato de salida definido, que otra persona o agente puede leer.',
    hint: '¿Se sabe qué devuelve la skill?',
  },
];

export const DESC_QUESTIONS: MultiSelectQuestion[] = [
  {
    prompt: '¿Cuáles de estas descripciones le permiten al agente decidir bien cuándo usar la skill? Marcá todas las que correspondan.',
    options: [
      {text: 'Revisa que los tests no compartan datos ni los creen por la interfaz. Usala cuando se crea o modifica un archivo en tests/.', correct: true, why: 'Dice qué hace y en qué situaciones.'},
      {text: 'Skill de calidad.', correct: false, why: 'No dice qué hace ni cuándo.'},
      {text: 'Acota qué casos manuales hacen falta en una versión a partir de su changelog. Usala cuando piden el alcance de la regresión de una versión.', correct: true, why: 'Tarea concreta y la situación que la dispara.'},
      {text: 'Hace todo lo relacionado con testing de la agenda.', correct: false, why: 'Es tan amplia que se cargaría en cualquier tarea, o en ninguna.'},
      {text: 'Reporta un defecto en Jira con el formato del equipo. Usala cuando confirmaste un defecto y hay que reportarlo.', correct: true, why: 'Dice qué hace y cuándo; al tener efecto externo, además conviene que solo la invoques vos.'},
    ],
  },
  {
    prompt: 'Sobre el contexto dinámico y el mantenimiento de una skill, ¿qué afirmaciones son correctas? Marcá todas las que correspondan.',
    options: [
      {text: 'Con !`gh pr diff --name-only`, la lista de archivos cambiados llega a la skill antes de que el agente la lea.', correct: true, why: 'El comando se ejecuta al invocar la skill y su salida reemplaza al marcador.'},
      {text: 'Si las reglas de permisos no permiten ese comando, el agente pregunta antes de correrlo.', correct: false, why: 'No pregunta: la invocación de la skill se cancela. Se habilita con `allowed-tools`.'},
      {text: 'allowed-tools: Bash(gh pr diff *) habilita el comando para esa skill.', correct: true, why: 'Lo pre-aprueba durante el turno en que se invoca.'},
      {text: 'Cuando la revisión se equivoca dos veces por la misma trampa del proyecto, la corrección va a la skill o a su archivo de trampas conocidas.', correct: true, why: 'Lo aprendido vuelve a la skill, para que no lo redescubra la próxima persona.'},
      {text: 'Las correcciones conviene hacerlas en cada test afectado, sin tocar la skill.', correct: false, why: 'Así la skill sigue cometiendo el mismo error.'},
    ],
  },
];
