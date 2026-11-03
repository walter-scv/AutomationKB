import type {ClassifyItem} from '@site/src/components/Classify';
import type {FillBlankSlot} from '@site/src/components/FillBlank';
import type {QuizQuestion} from '@site/src/components/Quiz';

export const WHERE_COLUMNS = ['CLAUDE.md del proyecto', 'Regla con paths', 'En ninguno de los dos'];
export const WHERE_ITEMS: ClassifyItem[] = [
  {code: 'Cómo se corre la suite de turnos y cómo se revisan los tipos.', column: 0, why: 'Hace falta en casi todas las tareas: va en el archivo que se carga siempre.', hint: '¿Lo necesita el agente en casi cualquier tarea?'},
  {code: 'Los Page Objects declaran sus locators como readonly en el constructor y no hacen assertions.', column: 1, why: 'Solo importa cuando trabaja en `pages/`: una regla con `paths` la carga en ese momento.', hint: '¿Importa en todo el proyecto o en una carpeta?'},
  {code: 'La contraseña de la recepcionista de prueba, para que el agente pueda ingresar.', column: 2, why: 'Es un secreto: el archivo se versiona y entra al contexto en cada sesión.', hint: '¿Lo pondrías en el repositorio?'},
  {code: 'No usar waitForTimeout, porque fue la causa de la mitad de los tests inestables.', column: 0, why: 'Es una regla de toda la suite, con su motivo.', hint: '¿Aplica a todos los tests?'},
  {code: 'El manual completo de Playwright, copiado para que el agente lo tenga a mano.', column: 2, why: 'El agente ya lo conoce, y ocuparía contexto en cada sesión.', hint: '¿Es algo que el agente no sabe y que necesita siempre?'},
  {code: 'Cómo tiene que estar armado tests/base-test.ts: cada fixture crea sus turnos por la API y los borra al terminar.', column: 1, why: 'Aplica cuando trabaja con las fixtures: una regla con `paths` sobre `tests/base-test.ts` y los helpers.', hint: '¿En qué archivos importa esta regla?'},
  {code: 'Que el linter rechaza las variables sin usar.', column: 2, why: 'Ya lo controla una herramienta: no hace falta explicarlo.', hint: '¿Hay algo que ya lo hace cumplir?'},
];

export const RULE_TEMPLATE = `---
{{a}}:
  - "{{b}}"
---

# Fixtures de la agenda

- Los turnos se crean con la API en la fixture, nunca dentro del test.
- Ningún test crea datos por la interfaz. ({{c}})`;
export const RULE_SLOTS: FillBlankSlot[] = [
  {id: 'a', answer: 'paths'},
  {id: 'b', answer: 'tests/base-test.ts'},
  {id: 'c', answer: 'Un alta por interfaz rompió 40 tests cuando cambió el formulario.'},
];
export const RULE_BANK = ['files', 'paths', 'tests/base-test.ts', 'pages/**/*.ts', 'Un alta por interfaz rompió 40 tests cuando cambió el formulario.', 'Es una buena práctica.'];
export const RULE_EXPLANATION =
  '`paths` hace que la regla se cargue solo al trabajar con `tests/base-test.ts`. La regla lleva su motivo concreto, no una frase genérica.';

export const FOLLOW_QUIZ: QuizQuestion[] = [
  {
    question: 'El CLAUDE.md de turnos dice «No edites los archivos de legacy/», una carpeta que el equipo congeló. Ayer el agente editó uno igual. ¿Qué corresponde?',
    options: [
      {text: 'Escribir la instrucción en mayúsculas y repetirla al final del archivo.', correct: false, why: 'Sigue siendo una instrucción: el agente puede no seguirla.'},
      {text: 'Agregar una regla de permisos que deniegue la edición de legacy/.', correct: true, why: 'Las instrucciones son contexto; lo que no puede pasar nunca se bloquea con permisos.'},
      {text: 'Moverla al principio del CLAUDE.md, para que la lea primero.', correct: false, why: 'Cambia el orden, no la naturaleza: sigue sin ser un bloqueo.'},
    ],
  },
  {
    question: 'El CLAUDE.md de turnos tiene 900 líneas, y el agente ignora seguido reglas que están escritas. ¿Qué es lo más probable?',
    options: [
      {text: 'Que el agente no lee archivos tan largos, y hay que pasar todo a una skill que se invoque.', correct: false, why: 'Lo lee, pero ocupa mucho contexto y las reglas se diluyen o se contradicen.'},
      {text: 'Que hay que importar cada sección con @ desde otro archivo, para que cargue completo.', correct: false, why: 'Lo importado se carga igual: no ahorra contexto.'},
      {text: 'Que es demasiado largo: hay que recortarlo y pasar lo específico a reglas por ruta.', correct: true, why: 'La documentación recomienda menos de 200 líneas por archivo, y las reglas por ruta cargan solo cuando hacen falta.'},
    ],
  },
  {
    question: 'Corregiste dos veces al agente porque sembraba turnos por la interfaz en lugar de usar la fixture. ¿Qué hacés?',
    options: [
      {text: 'Agregar la regla, con su motivo, en una regla con paths sobre las fixtures.', correct: true, why: 'Una corrección que se repite es memoria del proyecto: va a las instrucciones, y como solo aplica a las fixtures, en una regla por ruta.'},
      {text: 'Recordárselo al principio de cada conversación, pegando la regla de las fixtures.', correct: false, why: 'Es justo lo que el archivo de instrucciones evita.'},
      {text: 'Cambiar a un modelo más grande, que recuerde mejor las correcciones anteriores.', correct: false, why: 'Ningún modelo recuerda entre sesiones: lo que tiene que perdurar va escrito.'},
    ],
  },
];
