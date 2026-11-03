import type {ClassifyItem} from '@site/src/components/Classify';
import type {FillBlankSlot} from '@site/src/components/FillBlank';
import type {MultiSelectQuestion} from '@site/src/components/MultiSelect';
import type {TerminalStep} from '@site/src/components/Terminal';

export const VALUE_COLUMNS = ['Variable de entorno', 'Constante con nombre en el código', 'Locator en el Page Object'];
export const VALUE_ITEMS: ClassifyItem[] = [
  {code: 'La dirección del servidor de la clínica contra el que corre la suite.', column: 0, why: 'Cambia según dónde corre la suite: `BASE_URL`.', hint: '¿El valor es el mismo en todas las máquinas?'},
  {code: 'La contraseña de la recepcionista de prueba.', column: 0, why: 'Es un secreto: nunca va en el código, va en `.env` o en los secretos de CI.', hint: '¿Puede quedar escrito en el repositorio?'},
  {code: 'El plazo de 60 segundos que tarda en generarse el reporte mensual.', column: 1, why: 'No depende del entorno y se reutiliza: una constante como `TIMEOUTS.reporte`.', hint: '¿Cambia entre tu máquina y CI?'},
  {code: 'El botón «Cancelar turno» de la agenda.', column: 2, why: 'Es conocimiento de la pantalla: va en el Page Object de la agenda.', hint: '¿Es un dato o un elemento de la pantalla?'},
  {code: 'El token para la API de turnos que usa la fixture de siembra.', column: 0, why: 'Es un secreto y además distinto en cada entorno: variable de entorno.', hint: '¿Tendría que verlo cualquiera que lea el repositorio?'},
  {code: 'La cantidad máxima de turnos por paciente que fija el reglamento: 3.', column: 1, why: 'Es una regla del negocio, igual en todos los entornos: una constante con nombre, no un número suelto en cada test.', hint: '¿Depende del servidor contra el que corre la suite?'},
  {code: 'El DNI del paciente de prueba que se cargó en la base de datos de cada entorno.', column: 0, why: 'Cambia según el entorno: `PACIENTE_DNI`, nombrado por su rol.', hint: '¿Es el mismo paciente en los dos entornos?'},
];

export const DD_TEMPLATE = `const casos = [
  { hora: '08:00', resultado: 'Turno confirmado' },
  { hora: '19:30', resultado: 'Turno confirmado' },
  { hora: '20:00', resultado: 'Fuera del horario de atención' },
];

const dni = variable('PACIENTE_DNI');

for ({{a}} caso {{b}} casos) {
  test(\`reservar a las \${caso.hora} muestra \${caso.resultado}\`,
    async ({ agendaPage }) => {
      await agendaPage.reservar(caso.{{c}}, dni);
      await expect(agendaPage.mensaje).toHaveText(caso.{{d}});
    });
}`;
export const DD_SLOTS: FillBlankSlot[] = [
  {id: 'a', answer: 'const'},
  {id: 'b', answer: 'of'},
  {id: 'c', answer: 'hora'},
  {id: 'd', answer: 'resultado'},
];
export const DD_BANK = ['in', 'hora', 'let i', 'of', 'resultado', 'const', 'casos', 'mensaje'];
export const DD_EXPLANATION =
  '`for (const caso of casos)` recorre los casos y declara un test por cada uno, con la hora y el resultado de ese caso; el DNI del paciente sale del entorno, con `variable`. El título usa un template string con los datos del caso: Playwright exige títulos distintos, y así el reporte dice qué caso falló.';

export const PR_QUESTIONS: MultiSelectQuestion[] = [
  {
    prompt: 'Revisás un Pull Request de la suite de turnos. ¿Qué cambios son un problema? Marcá todos los que correspondan.',
    options: [
      {text: 'Agrega `.env` al repositorio «para que todos tengan la configuración».', correct: true, why: '`.env` tiene secretos y valores de cada persona: no se versiona. Para eso está `.env.example`.'},
      {text: 'Agrega `PACIENTE_DNI` a `.env.example`, con un texto que explica qué completar.', correct: false, why: 'Es lo correcto: la plantilla le avisa a quien clona el repositorio qué variable falta.'},
      {text: 'Renombra la variable `RECEPCIONISTA_EMAIL` a `MARTA_EMAIL`, porque la cuenta de prueba es de Marta.', correct: true, why: 'El nombre tiene que describir el rol del dato: si cambia la cuenta, habría que renombrar la variable en todo el código.'},
      {text: 'Reemplaza `process.env.CLAVE ?? \'\'` por `variable(\'CLAVE\')`, que falla con un mensaje si falta.', correct: false, why: 'Es una mejora: el error dice qué falta, en lugar de aparecer más adelante, lejos de la causa.'},
      {text: 'Usa `fakerES.string.numeric(8)` como DNI en el test que verifica el límite de 8 dígitos.', correct: true, why: 'Un caso de valor límite necesita el valor exacto, no uno al azar.'},
    ],
  },
];

export const ENV_STEPS: TerminalStep[] = [
  {
    instruction: 'Clonaste la suite de turnos. Creá tu archivo de variables a partir de la plantilla versionada.',
    accepted: ['cp .env.example .env'],
    hint: 'Es `cp`, el archivo de origen y el de destino.',
    output: '',
  },
  {
    instruction: 'Corré los tests @smoke contra staging, https://staging.clinica.test, sin tocar el archivo .env ni el código.',
    accepted: ["BASE_URL=https://staging.clinica.test npx playwright test --grep \"@smoke\"", "BASE_URL=https://staging.clinica.test npx playwright test --grep '@smoke'", "BASE_URL=https://staging.clinica.test npx playwright test --grep @smoke", "BASE_URL=https://staging.clinica.test npx playwright test --grep=@smoke", "BASE_URL=https://staging.clinica.test npx playwright test -g \"@smoke\"", "BASE_URL=https://staging.clinica.test npx playwright test -g '@smoke'", "BASE_URL=https://staging.clinica.test npx playwright test -g @smoke", "BASE_URL=https://staging.clinica.test/ npx playwright test --grep \"@smoke\"", "BASE_URL=https://staging.clinica.test/ npx playwright test --grep '@smoke'", "BASE_URL=https://staging.clinica.test/ npx playwright test --grep @smoke", "BASE_URL=https://staging.clinica.test/ npx playwright test --grep=@smoke", "BASE_URL=https://staging.clinica.test/ npx playwright test -g \"@smoke\"", "BASE_URL=https://staging.clinica.test/ npx playwright test -g '@smoke'", "BASE_URL=https://staging.clinica.test/ npx playwright test -g @smoke"],
    hint: 'La variable se define delante del comando, con la forma NOMBRE=valor, y vale solo para esa ejecución.',
    output: 'Running 2 tests using 2 workers\n  ✓  2 [chromium] › tests/agenda.spec.ts:4:7 › Agenda › reservar el primer horario libre @smoke @p0 @agenda (205ms)\n  ✓  1 [chromium] › tests/pacientes.spec.ts:4:7 › Pacientes › buscar un paciente por DNI @smoke @p0 @pacientes (205ms)\n  2 passed (621ms)',
  },
];
export const ENV_EXPLANATION =
  '`.env.example` se copia a `.env` y se completa con los valores propios. Una variable definida delante del comando le gana a la de `.env` solo para esa ejecución: así se cambia de entorno sin tocar nada.';
