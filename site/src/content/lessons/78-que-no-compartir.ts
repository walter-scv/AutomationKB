import type {ClassifyItem} from '@site/src/components/Classify';
import type {QuizQuestion} from '@site/src/components/Quiz';
import type {MultiSelectQuestion} from '@site/src/components/MultiSelect';

export const SHARE_COLUMNS = ['Se puede compartir', 'No se comparte'];
export const SHARE_ITEMS: ClassifyItem[] = [
  {code: 'El error-context.md de un test que falló contra el entorno local, con datos sembrados por la fixture.', column: 0, why: 'Tiene el error, el código y el estado de una página con datos de prueba.', hint: '¿Hay algún secreto o dato real?'},
  {code: 'El archivo .env, para que el asistente entienda por qué falla el ingreso.', column: 1, why: 'Tiene contraseñas: lo que no va en el repositorio tampoco va en un pedido.', hint: '¿Ese archivo se versiona?'},
  {code: 'La regla de negocio: los turnos se pueden cancelar hasta 2 horas antes.', column: 0, why: 'Es la especificación que el asistente necesita, sin datos personales.', hint: '¿Expone a alguien o algún secreto?'},
  {code: 'playwright/.auth/recepcionista.json, para que el agente reproduzca el ingreso.', column: 1, why: 'Permite entrar como esa cuenta: es tan sensible como su contraseña.', hint: '¿Qué puede hacer quien tenga ese archivo?'},
  {code: 'Un paciente inventado con Faker, que reproduce el defecto de la búsqueda.', column: 0, why: 'Son datos inventados: se pueden compartir.', hint: '¿De quién son esos datos?'},
  {code: 'Una planilla con las historias clínicas reales que alguien copió a staging para probar.', column: 1, why: 'Son datos personales reales, aunque estén en un entorno de pruebas.', hint: '¿Que estén en staging los vuelve de prueba?'},
  {code: 'AgendaPage.ts, usando el asistente que la empresa aprobó para su código.', column: 0, why: 'Con una herramienta autorizada, el código de la suite es el contexto que el asistente necesita.', hint: '¿La empresa autorizó esa herramienta para su código?'},
];

export const POLICY_QUIZ: QuizQuestion[] = [
  {
    question: 'Tu equipo usa un agente en la suite de turnos. Nadie le pidió que lea el .env, pero está en la raíz del proyecto. ¿Cómo evitás que lo lea?',
    options: [
      {text: 'Escribiendo en las instrucciones del proyecto «no leas el .env».', correct: false, why: 'Las instrucciones son contexto, no un bloqueo: el agente puede no seguirlas (unidad 2).'},
      {text: 'Moviendo el .env a otra carpeta del mismo proyecto, donde el agente no lo busque.', correct: false, why: 'Sigue estando a su alcance: puede encontrarlo al buscar.'},
      {text: 'Con una regla de permisos que le impida leer ese archivo.', correct: true, why: 'Un permiso de denegación bloquea la lectura aunque el agente lo intente (entrada de permisos).'},
    ],
  },
  {
    question: 'El defecto de la búsqueda de pacientes solo aparece con un apellido con tilde de un paciente real. Querés pedirle ayuda a un asistente. ¿Qué hacés?',
    options: [
      {text: 'Crear un paciente inventado con un apellido con tilde, reproducir el defecto y compartir eso.', correct: true, why: 'El defecto se reproduce con datos equivalentes, sin exponer al paciente real.'},
      {text: 'Compartir los datos del paciente real, porque es la única forma de reproducirlo.', correct: false, why: 'Lo que importa es la característica del dato, el apellido con tilde, no la persona.'},
      {text: 'Compartir solo el nombre, sin el documento.', correct: false, why: 'Sigue siendo un dato personal real.'},
    ],
  },
];

export const DECIDE_QUESTIONS: MultiSelectQuestion[] = [
  {
    prompt: 'En la suite de turnos, ¿cuáles de estas tareas conviene delegarle a un agente, revisando su resultado? Marcá todas las que correspondan.',
    options: [
      {text: 'Recorrer la pantalla de reportes y listar sus elementos con rol y nombre.', correct: true, why: 'Es mecánico y se verifica rápido contra la página.'},
      {text: 'Decidir si la reserva de domingos es un defecto o una decisión del negocio.', correct: false, why: 'Depende de lo que decidió el negocio: lo decide una persona.'},
      {text: 'Escribir el borrador del test de un caso ya diseñado.', correct: true, why: 'Es un borrador que se revisa con las preguntas de la entrada anterior.'},
      {text: 'Aprobar el Pull Request con los tests nuevos de la agenda.', correct: false, why: 'Aprobar es una responsabilidad de una persona.'},
      {text: 'Elegir qué funcionalidades se prueban antes de la versión, según su riesgo.', correct: false, why: 'Sale del análisis de riesgo y del negocio.'},
      {text: 'Proponer causas posibles de un fallo a partir del error-context.md.', correct: true, why: 'Son hipótesis que se verifican contra la evidencia.'},
    ],
  },
];
