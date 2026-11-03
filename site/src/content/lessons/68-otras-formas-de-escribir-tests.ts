import type {MatchItem} from '@site/src/components/Match';
import type {OrderItem, OrderRule} from '@site/src/components/Order';
import type {SpotTokenRound} from '@site/src/components/SpotToken';
import type {QuizQuestion} from '@site/src/components/Quiz';

export const FORM_LEFT: MatchItem[] = [
  {id: 'gherkin', text: 'La responsable de admisión aprueba cada caso nuevo antes de que se automatice, y no lee código.'},
  {id: 'outline', text: 'Un escenario de reserva que ya está en un .feature tiene que repetirse con cinco obras sociales.'},
  {id: 'keyword', text: 'Diez personas de calidad, sin experiencia en programación, arman casos combinando acciones ya definidas como «Buscar paciente» y «Reservar turno».'},
  {id: 'screenplay', text: 'Recepcionista, médica y paciente reservan turnos, cada una desde su pantalla, y el paso de reservar está copiado en tres Page Objects.'},
  {id: 'plain', text: 'Los casos los leen y los escriben solo las dos personas que programan la suite.'},
];
export const FORM_RIGHT: MatchItem[] = [
  {id: 'screenplay', text: 'Screenplay: una tarea que cada actor reutiliza'},
  {id: 'plain', text: 'Tests con Page Objects y `test.step` numerados'},
  {id: 'outline', text: '`Esquema del escenario` con una tabla `Ejemplos`'},
  {id: 'gherkin', text: 'Escenarios en Gherkin, con definiciones de pasos'},
  {id: 'keyword', text: 'Keyword-driven: casos como tablas de palabras clave'},
];
export const FORM_WHY: Record<string, string> = {
  gherkin: 'Gherkin se paga solo cuando alguien que no programa lee o valida los escenarios.',
  outline: 'Dentro de Gherkin, los datos que cambian van en una tabla `Ejemplos`: una fila por obra social.',
  keyword: 'Un vocabulario fijo de palabras clave deja componer casos sin programar.',
  screenplay: 'Varios roles con la misma tarea de negocio: la tarea se define una vez y cada actor la usa.',
  plain: 'Si nadie fuera del equipo técnico lee los casos, una capa más no aporta: alcanza con los tests de siempre.',
};

export const FEATURE_ITEMS: OrderItem[] = [
  {id: 'then', what: 'Línea', code: '    Entonces ve el mensaje "<mensaje>"'},
  {id: 'header', what: 'Línea', code: '      | hora  | mensaje          |'},
  {id: 'lang', what: 'Línea', code: '# language: es'},
  {id: 'when', what: 'Línea', code: '    Cuando la recepcionista reserva el horario "<hora>"'},
  {id: 'outline', what: 'Línea', code: '  Esquema del escenario: Reservar en el primer horario del día'},
  {id: 'row', what: 'Línea', code: '      | 08:00 | Turno confirmado |'},
  {id: 'feature', what: 'Línea', code: 'Característica: Reservar un turno'},
  {id: 'examples', what: 'Línea', code: '    Ejemplos:'},
  {id: 'given', what: 'Línea', code: '    Dado que la Dra. Paz tiene libre el horario "<hora>"'},
];
export const FEATURE_CORRECT = ['lang', 'feature', 'outline', 'given', 'when', 'then', 'examples', 'header', 'row'];
export const FEATURE_RULES: OrderRule[] = [
  {before: 'lang', after: 'feature', why: '`# language: es` va en la primera línea: sin eso, Gherkin no reconoce las palabras clave en español.'},
  {before: 'feature', after: 'outline', why: 'Los escenarios van dentro de una `Característica`.'},
  {before: 'outline', after: 'given', why: 'Los pasos pertenecen al escenario que los nombra.'},
  {before: 'given', after: 'when', why: 'Primero el estado inicial (`Dado`), después la acción (`Cuando`).'},
  {before: 'when', after: 'then', why: 'El resultado esperado (`Entonces`) va después de la acción.'},
  {before: 'then', after: 'examples', why: 'La tabla `Ejemplos` va al final del esquema, después de los pasos.'},
  {before: 'examples', after: 'header', why: 'La primera fila de la tabla nombra las columnas que usan `<hora>` y `<mensaje>`.'},
  {before: 'header', after: 'row', why: 'Las filas de datos van debajo del encabezado: cada una es un test.'},
];

export const DIAG_PROMPT = '¿Qué parte de esta línea causa el problema?';
export const DIAG_ROUNDS: SpotTokenRound[] = [
  {
    line: "{ palabra: 'Reservar Turno', valor: '10:30' }, // en el switch: case 'Reservar turno':",
    targetIndex: 3,
    why: 'La palabra clave se compara exacta: `Turno` con mayúscula no coincide con ningún `case`, y la corrida termina en el `default` con «Palabra clave desconocida: Reservar Turno».',
    hint: '¿El texto de la tabla coincide letra por letra con el del `case`?',
  },
  {
    line: "When('cancela el turno de la {string}', async ({ agendaPage }, hora: string) => { // el .feature dice: Cuando cancela el turno de las \"10:30\"",
    targetIndex: 4,
    why: 'La asociación entre el paso y su definición es exacta: «de la» no coincide con «de las», y `bddgen` informa «Missing step definitions: 1».',
    hint: 'Compará el texto de la definición con el del paso, palabra por palabra.',
  },
  {
    line: "const marta = new Actor('Marta'); // al correr: Error: Marta no sabe navegar la web",
    targetIndex: 4,
    why: 'El actor se crea sin habilidad. Falta `.queSabe(new NavegarLaWeb(page))`: la tarea pide el navegador y el actor no lo tiene.',
    hint: '¿Qué tiene que saber usar el actor para realizar una tarea en el navegador?',
  },
  {
    line: "await page.locator('#horario-' + hora).click(); // dentro de When('reserva el horario {string}', ...); AgendaPage ya tiene turno(hora)",
    targetIndex: 1,
    why: 'La definición del paso escribe su propio selector en lugar de usar `agendaPage.turno(hora)`. El selector queda repetido fuera del Page Object, y si el horario cambia hay que buscarlo en dos lugares.',
    hint: '¿Qué capa de la suite ya sabe cómo reservar un horario?',
  },
];

export const RUN_QUIZ: QuizQuestion[] = [
  {
    question: 'El .feature de reservas tiene un Esquema del escenario con dos filas en Ejemplos: 08:00 y 19:30, los límites del horario de atención. El reporte dice: › Ejemplos: #2 › Entonces ve el mensaje "Turno confirmado", con Expected: "Turno confirmado" y Received: "Fuera del horario de atención". ¿Qué concluís?',
    options: [
      {text: 'Falló la fila de las 08:00, en el paso Cuando.', correct: false, why: '`#2` es la segunda fila de `Ejemplos`, y el reporte nombra el paso que falló: `Entonces`.'},
      {text: 'Falló la fila de las 19:30: el sistema rechazó el último horario que debería aceptar.', correct: true, why: '`Ejemplos: #2` es la segunda fila, y el `Entonces` recibió el mensaje de fuera de horario. Es un valor límite rechazado: hay que confirmar si es un defecto o si cambió la regla.'},
      {text: 'Falta la definición del paso Entonces.', correct: false, why: 'Si faltara, `bddgen` no habría generado el test. El paso corrió y su assertion falló.'},
    ],
  },
  {
    question: 'Un compañero corrigió un error en .features-gen/features/reservar.feature.spec.js. En la corrida siguiente, el error volvió. ¿Por qué?',
    options: [
      {text: 'Porque Playwright guarda en caché la versión anterior del test.', correct: false, why: 'Playwright no guarda caché de los tests: corre los archivos que encuentra.'},
      {text: 'Porque CI tiene su propia copia de .features-gen, y el cambio tenía que hacerse también ahí.', correct: false, why: 'CI también genera esa carpeta desde los `.feature`: no hay una copia que mantener. El cambio va en el `.feature` o en la definición del paso.'},
      {text: 'Porque bddgen vuelve a generar ese archivo desde el .feature en cada corrida.', correct: true, why: 'El código generado no se edita: los cambios van en el `.feature` o en la definición del paso.'},
    ],
  },
  {
    question: 'En la planilla de keyword-driven de turnos, cada caso tiene 14 filas: Escribir campo DNI, Presionar botón Buscar, Hacer clic en fila 1, Presionar botón Reservar… ¿Qué mejora corresponde?',
    options: [
      {text: 'Definir palabras clave de negocio, como Reservar turno para paciente, que por debajo usen los Page Objects.', correct: true, why: 'Un vocabulario de negocio acorta los casos y deja los detalles de la pantalla en un solo lugar.'},
      {text: 'Agregar más palabras clave de bajo nivel, como Hacer doble clic, para cubrir todas las acciones.', correct: false, why: 'Hace los casos todavía más largos y más atados a la pantalla.'},
      {text: 'Pasar los casos a Screenplay, para que cada fila sea una tarea.', correct: false, why: 'El problema es el nivel de las palabras clave, no la forma: una tarea por clic repite el mismo error.'},
    ],
  },
];
