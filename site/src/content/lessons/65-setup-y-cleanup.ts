import type {ClassifyItem} from '@site/src/components/Classify';
import type {OrderItem, OrderRule} from '@site/src/components/Order';
import type {BuilderStep} from '@site/src/components/CommandBuilder';
import type {QuizQuestion} from '@site/src/components/Quiz';

export const SEED_COLUMNS = ['Fixture que siembra y limpia', 'Limpiar en el propio test', 'No hace falta sembrar'];
export const SEED_ITEMS: ClassifyItem[] = [
  {
    code: 'Reprogramar un turno de las 09:30 a las 11:00.',
    column: 0,
    why: 'El turno conserva su `id`: la fixture lo puede borrar al final aunque haya cambiado de hora.',
    hint: '¿El dato sigue siendo el mismo al terminar, aunque cambie un campo?',
  },
  {
    code: 'Transferir un turno a otro paciente: el sistema borra el turno original y crea uno nuevo.',
    column: 1,
    why: 'El dato que sembró la fixture ya no existe y apareció otro: solo el test sabe qué quedó para limpiar.',
    hint: '¿La fixture sabe cuál es el turno nuevo?',
  },
  {
    code: 'Verificar que el filtro de especialidades lista las 12 especialidades fijas del sistema.',
    column: 2,
    why: 'Son datos de referencia del sistema, que el test solo lee y no modifica: no hay nada que crear.',
    hint: '¿El test necesita que exista algo que no está en el sistema?',
  },
  {
    code: 'Cancelar un turno: pasa a estado «Cancelado».',
    column: 0,
    why: 'Cambia el estado, pero el dato es el mismo y la fixture lo puede borrar al terminar.',
    hint: '¿Cambia la identidad del turno o solo su estado?',
  },
  {
    code: 'Dar de alta un paciente desde el formulario de la pantalla, que es lo que prueba el test.',
    column: 1,
    why: 'El dato lo crea la propia acción bajo prueba, por la interfaz: el test no lo siembra, pero tiene que borrarlo al terminar.',
    hint: '¿Quién crea el paciente en este caso: la preparación o la acción que se prueba?',
  },
  {
    code: 'Ver en la agenda los turnos de un paciente que tiene tres turnos reservados.',
    column: 0,
    why: 'El test necesita tres turnos que no existen: los siembra por API con la fixture y quedan limpios al final.',
    hint: '¿Esos turnos existen antes del test?',
  },
];

export const FIXTURE_ITEMS: OrderItem[] = [
  {id: 'dt', what: 'Línea', code: '  await borrarTurno(request, turno.id);'},
  {id: 'use', what: 'Línea', code: '  await use({ paciente, turno });'},
  {id: 'head', what: 'Línea', code: 'pacienteConTurno: async ({ request }, use) => {'},
  {id: 'close', what: 'Línea', code: '},'},
  {id: 't', what: 'Línea', code: '  const turno = await crearTurno(request, unTurno().paraPaciente(paciente.dni).build());'},
  {id: 'dp', what: 'Línea', code: '  await borrarPaciente(request, paciente.dni);'},
  {id: 'p', what: 'Línea', code: '  const paciente = await crearPaciente(request, unPaciente().build());'},
];
export const FIXTURE_CORRECT = ['head', 'p', 't', 'use', 'dt', 'dp', 'close'];
export const FIXTURE_RULES: OrderRule[] = [
  {before: 'head', after: 'p', why: 'Todo va dentro de la función de la fixture.'},
  {before: 'p', after: 't', why: 'El turno necesita el DNI del paciente: el paciente se crea primero.'},
  {before: 't', after: 'use', why: 'Los dos datos se crean antes de entregarlos al test con `use`.'},
  {before: 'use', after: 'dt', why: 'La limpieza va después de `use`: corre cuando el test terminó.'},
  {before: 'dt', after: 'dp', why: 'El sistema no deja borrar un paciente con turnos: se borra en orden inverso al de creación.'},
  {before: 'dp', after: 'close', why: 'La llave cierra la función de la fixture.'},
];

export const SEED_PREFIX = 'await ';
export const SEED_STEPS: BuilderStep[] = [
  {options: ['crearTurno(request, ', 'sembrarTurno(', "page.goto('/turnos/nuevo'); "], correct: 'sembrarTurno(', hint: 'El test no llama al helper ni recorre la interfaz: pide la fixture, que además limpia al final.'},
  {options: ['unTurno()', "{ hora: '10:30', profesional: 'Dra. Paz', sede: 'Centro', paciente: '30111222' }", 'new Turno()'], correct: 'unTurno()', hint: 'El test solo necesita cambiar la hora: el resto puede salir de valores por defecto.'},
  {options: [".aLas('10:30')", ".conPaciente('30111222')", ".nth(2)"], correct: ".aLas('10:30')", hint: 'Lo único que este test necesita distinto del valor por defecto es la hora.'},
  {options: ['.build());', ');', '.build();'], correct: '.build());', hint: 'Falta construir el objeto y cerrar la llamada a la fixture.'},
];
export const SEED_EXPLANATION =
  "`await sembrarTurno(unTurno().aLas('10:30').build());` crea el turno por API con valores por defecto salvo la hora, y la fixture lo borra al terminar el test.";

export const STATE_QUIZ: QuizQuestion[] = [
  {
    question: 'Un test siembra un turno para la paciente Ana y verifica que su lista muestre 1 turno. En staging falla con Expected: 1, Received: 3: Ana ya tenía dos turnos de otras pruebas. ¿Qué corrección corresponde?',
    options: [
      {text: 'Borrar todos los turnos de Ana al principio de cada test.', correct: false, why: 'Puede borrar turnos que otro test, corriendo al mismo tiempo, está usando.'},
      {text: 'Verificar que la lista tenga al menos 1 turno.', correct: false, why: 'Afloja la verificación: pasaría aunque la siembra no hubiera creado nada.'},
      {text: 'Contar los turnos al empezar y verificar que haya uno más que antes.', correct: true, why: 'Se mide el estado real y se compara el cambio, sin suponer que Ana empezaba sin turnos.'},
    ],
  },
  {
    question: 'Dos personas corren la suite contra staging al mismo tiempo, y las dos siembran un paciente llamado Ana Ruiz. Un test que busca a Ana Ruiz falla con strict mode: el locator encuentra 2 elementos. ¿Qué corrección corresponde?',
    options: [
      {text: 'Que el builder genere un nombre único en cada corrida, por ejemplo con un sufijo como Date.now().', correct: true, why: 'Cada corrida busca su propio paciente, y dos corridas en paralelo dejan de pisarse.'},
      {text: 'Acordar que la suite contra staging la corra una sola persona por vez.', correct: false, why: 'Depende de que nadie se olvide, y frena al equipo: el problema está en el dato repetido.'},
      {text: 'Agregar .first() al locator del paciente.', correct: false, why: 'Elige uno de los dos al azar: el test podría verificar el paciente de la otra corrida.'},
    ],
  },
];
