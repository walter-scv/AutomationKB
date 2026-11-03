import type {DecisionNode} from '@site/src/components/DecisionPath';
import type {FillBlankSlot} from '@site/src/components/FillBlank';
import type {MultiSelectQuestion} from '@site/src/components/MultiSelect';

export const ENV_START = 'where';
export const ENV_NODES: Record<string, DecisionNode> = {
  where: {
    id: 'where',
    situation: 'El equipo quiere que un agente explore la reprogramación de turnos sin que nadie mire cada paso. ¿Dónde trabaja?',
    options: [
      {text: 'En staging, pero solo de lectura, para no gastar en otro entorno.', correct: false, why: 'Para explorar tiene que crear turnos; y aunque solo leyera, los datos de staging cambian y sus resultados no se pueden repetir.'},
      {text: 'En un entorno local propio, levantado y sembrado de cero para esa tarea.', correct: true, why: 'Puede crear y romper lo que necesite sin afectar a nadie, y los datos iniciales son siempre los mismos.', next: 'seed'},
      {text: 'En producción, con una cuenta de prueba, porque es donde están los datos reales.', correct: false, why: 'Un agente sin supervisión nunca trabaja contra producción, y los datos reales no se comparten con un asistente.'},
    ],
  },
  seed: {
    id: 'seed',
    situation: 'El script de siembra terminó diciendo «listo», pero el agente no encuentra la agenda de la doctora Paz y pierde media hora. El servidor no había terminado de arrancar. ¿Qué cambiás?',
    options: [
      {text: 'Que el script verifique al final, leyendo la agenda, y falle si no puede.', correct: true, why: 'Una siembra que se verifica no deja al agente trabajando sobre un entorno roto.', next: 'account'},
      {text: 'Agregarle al pedido del agente que espere cinco minutos antes de empezar a explorar.', correct: false, why: 'Es una espera fija: a veces sobra y a veces no alcanza.'},
      {text: 'Que el agente vuelva a correr la siembra cada vez que no encuentra un dato que necesita.', correct: false, why: 'Esconde el problema y puede dejar datos duplicados si el script no se puede repetir.'},
    ],
  },
  account: {
    id: 'account',
    situation: 'Para probar que una recepcionista sin agenda asignada no ve los turnos de nadie, ¿qué cuenta usa el agente?',
    options: [
      {text: 'La cuenta de una persona del equipo que todavía no tiene agenda asignada.', correct: false, why: 'Las cuentas personales tienen permisos y datos que nadie controla: el resultado no es confiable.'},
      {text: 'La cuenta de recepcionista de siempre, quitándole la agenda por la interfaz antes de probar.', correct: false, why: 'Modifica una cuenta que usan otros tests y otros agentes.'},
      {text: 'La cuenta aislada, que la siembra nunca une a ninguna agenda.', correct: true, why: 'Es la única forma limpia de probar que un usuario sin permisos no ve lo que no le corresponde.'},
    ],
  },
};
export const ENV_EXPLANATION =
  'Un entorno local propio, una siembra que se verifica y cuentas fijas por rol, con una aislada para los casos de permisos.';

export const GUARD_TEMPLATE = `const PERMITIDOS = ['localhost', '127.0.0.1'];
const url = new URL(process.env.{{a}} ?? 'http://localhost:3000');
if (!PERMITIDOS.{{b}}(url.hostname)) {
  console.error(\`Solo se puede usar contra el entorno local, no contra \${url.hostname}.\`);
  process.exit({{c}});
}`;
export const GUARD_SLOTS: FillBlankSlot[] = [
  {id: 'a', answer: 'BASE_URL'},
  {id: 'b', answer: 'includes'},
  {id: 'c', answer: '1'},
];
export const GUARD_BANK = ['BASE_URL', 'HOSTNAME', 'includes', 'startsWith', '0', '1'];
export const GUARD_EXPLANATION =
  'La herramienta lee la dirección de BASE_URL y, si no está en la lista de direcciones locales, termina con un código distinto de 0 antes de crear nada.';

export const SETUP_QUESTIONS: MultiSelectQuestion[] = [
  {
    prompt: '¿Qué va en el contrato de setup de la agenda? Marcá todas las que correspondan.',
    options: [
      {text: 'Los datos se crean en las fixtures, nunca dentro del test.', correct: true, why: 'Es una convención de datos que tienen que seguir quienes escriben tests.'},
      {text: 'Todo dato que crea un test se borra en su limpieza, aunque el test falle.', correct: true, why: 'Evita que los datos de un test afecten a otro.'},
      {text: 'Las contraseñas de las cuentas de prueba, para que el agente pueda ingresar.', correct: false, why: 'El contrato se sube al repositorio: las contraseñas van en .env.test.'},
      {text: 'Un test que modifica un turno usa uno propio; uno que solo lee puede usar los sembrados.', correct: true, why: 'Decide qué datos necesita cada test según lo que hace.'},
      {text: 'El texto de cada botón de la agenda, para que el agente lo encuentre.', correct: false, why: 'Cómo encontrar cada elemento lo dicen los Page Objects, no el contrato de datos.'},
    ],
  },
];
