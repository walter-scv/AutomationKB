import type {TerminalStep} from '@site/src/components/Terminal';
import type {ClassifyItem} from '@site/src/components/Classify';
import type {BuilderStep} from '@site/src/components/CommandBuilder';
import type {DecisionNode} from '@site/src/components/DecisionPath';

export const SETUP_STEPS: TerminalStep[] = [
  {
    instruction: 'Estás en la carpeta vacía turnos-e2e. Comprobá qué versión de Node.js tiene instalada la computadora.',
    accepted: ['node -v', 'node --version'],
    hint: 'Es el comando de Node.js con la opción de versión, la misma que se usó en Foundations.',
    output: 'v24.0.0',
  },
  {
    instruction: 'La versión sirve. Creá el proyecto de Playwright en esta carpeta, aceptando las opciones por defecto.',
    accepted: ['npm init playwright@latest', 'npm init playwright', 'npm create playwright@latest', 'npm create playwright', 'npx create-playwright@latest', 'npx create-playwright'],
    hint: 'Es `npm init` seguido del nombre del instalador de Playwright, en su última versión.',
    output:
      '✔ Do you want to use TypeScript or JavaScript? · TypeScript\n✔ Where to put your end-to-end tests? · tests\n✔ Add a GitHub Actions workflow? (Y/n) · true\n✔ Install Playwright browsers (can be done manually via \'npx playwright install\')? (Y/n) · true\nInstalling Playwright Test (npm install --save-dev @playwright/test)…\nInstalling Types (npm install --save-dev @types/node)…\nWriting playwright.config.ts.\nWriting .github/workflows/playwright.yml.\nWriting tests/example.spec.ts.\nWriting package.json.\nDownloading browsers (npx playwright install)…\n✔ Success! Created a Playwright Test project',
  },
  {
    instruction: 'Corré los tests de ejemplo para confirmar que la instalación funciona.',
    accepted: ['npx playwright test'],
    hint: 'Se ejecuta el runner de Playwright con `npx`, y la acción es `test`.',
    output:
      'Running 6 tests using 5 workers\n\n[1/6] [webkit] › tests/example.spec.ts:3:5 › has title\n[2/6] [chromium] › tests/example.spec.ts:3:5 › has title\n[3/6] [chromium] › tests/example.spec.ts:10:5 › get started link\n[4/6] [firefox] › tests/example.spec.ts:10:5 › get started link\n[5/6] [firefox] › tests/example.spec.ts:3:5 › has title\n[6/6] [webkit] › tests/example.spec.ts:10:5 › get started link\n  6 passed (8.5s)',
  },
  {
    instruction: 'Anotá en el README qué versión de Playwright quedó instalada. Consultala.',
    accepted: ['npx playwright --version', 'npx playwright -V'],
    hint: 'Es el mismo programa del paso anterior, con la opción de versión.',
    output: 'Version 1.64.1',
  },
];
export const SETUP_EXPLANATION =
  'Node.js primero, porque Playwright lo necesita. `npm init playwright@latest` instala el paquete, crea la configuración, el ejemplo y el workflow, y descarga los navegadores. `npx playwright test` confirma que todo funciona: dos tests por tres navegadores dan seis.';

export const GIT_COLUMNS = ['Se versiona', 'No se versiona'];
export const GIT_ITEMS: ClassifyItem[] = [
  {
    code: 'package-lock.json',
    column: 0,
    why: 'Registra la versión exacta de cada paquete. Versionado, todo el equipo y el servidor de integración instalan exactamente lo mismo.',
    hint: 'Si cada persona instala versiones distintas de las dependencias, ¿los tests se comportan igual?',
  },
  {
    code: 'node_modules/',
    column: 1,
    why: 'Se regenera con `npm install` a partir de `package.json` y `package-lock.json`. Subirlo agrega miles de archivos que nadie edita.',
    hint: '¿Se puede volver a generar con un comando?',
  },
  {
    code: 'playwright.config.ts',
    column: 0,
    why: 'Es la configuración de la suite: todo el equipo tiene que correr los tests con la misma.',
    hint: '¿Alguien lo escribió, o lo genera cada corrida?',
  },
  {
    code: 'test-results/',
    column: 1,
    why: 'Lo genera cada corrida con los resultados de esa ejecución. El `.gitignore` del instalador lo excluye.',
    hint: '¿Cambia cada vez que corrés los tests?',
  },
  {
    code: 'tests/turno.spec.ts',
    column: 0,
    why: 'Es un archivo de tests escrito por el equipo: es justamente lo que el repositorio existe para guardar.',
    hint: '¿Es código que alguien escribió?',
  },
  {
    code: 'playwright/.auth/',
    column: 1,
    why: 'Guarda sesiones de usuarios. Además de generarse solo, contiene datos de acceso que no pueden quedar en el repositorio.',
    hint: '¿Qué pasaría si cualquiera con acceso al repositorio pudiera leer lo que hay ahí?',
  },
  {
    code: '.github/workflows/playwright.yml',
    column: 0,
    why: 'Es la definición de cómo GitHub corre los tests. Tiene que estar en el repositorio para que GitHub la encuentre.',
    hint: '¿De dónde lee GitHub las instrucciones para correr la suite?',
  },
  {
    code: 'playwright-report/',
    column: 1,
    why: 'El reporte HTML se genera en cada corrida. Se comparte de otras formas, no versionándolo.',
    hint: '¿Este contenido lo escribe una persona?',
  },
  {
    code: 'package.json',
    column: 0,
    why: 'Declara las dependencias del proyecto. Sin él, `npm install` no sabe qué instalar.',
    hint: '¿Qué lee `npm install` para saber qué paquetes traer?',
  },
];

export const UPDATE_PREFIX = 'npm ';
export const UPDATE_STEPS: BuilderStep[] = [
  {options: ['init', 'run', 'install'], correct: 'install', hint: 'Ese comando no instala paquetes: `init` crea un proyecto nuevo y `run` ejecuta un script de `package.json`.'},
  {options: ['-D', '-g', '--no-save'], correct: '-D', hint: 'Esa opción no deja la versión nueva registrada en el proyecto: `-g` instala para toda la computadora y `--no-save` no actualiza `package.json`.'},
  {options: ['playwright@latest', '@types/node@latest', '@playwright/test@latest'], correct: '@playwright/test@latest', hint: 'Ese no es el paquete del runner de tests que usa el proyecto.'},
];
export const UPDATE_EXPLANATION =
  '`npm install -D @playwright/test@latest` actualiza el runner a la última versión y lo deja como dependencia de desarrollo. Después falta el segundo paso: `npx playwright install`, para descargar los navegadores de esa versión.';

export const CLONE_START = 'clone';
export const CLONE_NODES: Record<string, DecisionNode> = {
  clone: {
    id: 'clone',
    situation: 'Clonaste el repositorio de la suite de turnos en una computadora nueva. Tiene package.json, package-lock.json, playwright.config.ts y la carpeta tests. ¿Qué corrés primero?',
    options: [
      {text: '`npm init playwright@latest`, para tener Playwright.', correct: false, why: 'El proyecto ya existe: el instalador está pensado para crearlo, y volvería a escribir archivos que el equipo ya tiene.'},
      {text: '`npx playwright test`, para ver si anda.', correct: false, why: 'Todavía no hay `node_modules/`: el paquete no está instalado en esta computadora.'},
      {text: '`npm install`, para instalar las dependencias declaradas.', correct: true, why: 'Lee `package.json` y `package-lock.json` e instala exactamente las versiones del equipo.', next: 'missing'},
    ],
  },
  missing: {
    id: 'missing',
    situation: 'Corrés `npx playwright test` y todos los tests fallan con `Executable doesn\'t exist` y el recuadro que pide descargar navegadores. ¿Qué hacés?',
    options: [
      {text: 'Correr `npx playwright install`.', correct: true, why: '`npm install` instaló el paquete, pero los navegadores van aparte, en la carpeta compartida de la computadora.', next: 'update'},
      {text: 'Borrar `package-lock.json` y repetir `npm install`.', correct: false, why: 'El paquete se instaló bien. Lo que falta son los navegadores, que `npm install` no descarga.'},
      {text: 'Repetir `npm install` con la opción `--force`.', correct: false, why: '`npm install` no descarga navegadores, con o sin opciones.'},
    ],
  },
  update: {
    id: 'update',
    situation: 'Todo funciona. Un mes después actualizás con `npm install -D @playwright/test@latest`, y vuelve a aparecer `Executable doesn\'t exist`. ¿Qué pasó?',
    options: [
      {text: 'La actualización rompió el proyecto: hay que volver a la versión anterior.', correct: false, why: 'No hay nada roto: es el paso que falta después de actualizar.'},
      {text: 'La versión nueva pide otra versión de cada navegador, que todavía no está descargada.', correct: true, why: 'Cada versión del paquete usa una versión exacta de cada navegador. Se resuelve con `npx playwright install`.', next: 'ci'},
      {text: 'Falta correr `npm init playwright@latest` para la versión nueva.', correct: false, why: 'El instalador crea proyectos; no hace falta para actualizar uno existente.'},
    ],
  },
  ci: {
    id: 'ci',
    situation: 'El equipo suma la suite a un servidor de integración continua con Linux y sin entorno gráfico. Los navegadores se descargan, pero no arrancan porque faltan librerías del sistema operativo. ¿Qué comando va en el workflow?',
    options: [
      {text: '`npx playwright install chromium`.', correct: false, why: 'Descarga solo Chromium, pero tampoco instala las librerías del sistema que faltan.'},
      {text: '`npm install --with-deps`.', correct: false, why: '`npm install` instala los paquetes de `package.json`; ni descarga navegadores ni instala librerías del sistema operativo.'},
      {text: '`npx playwright install --with-deps`.', correct: true, why: '`--with-deps` instala, además de los navegadores, las librerías del sistema que necesitan. Es lo que usa el workflow que genera el instalador.'},
    ],
  },
};
export const CLONE_EXPLANATION =
  'En una computadora nueva: `npm install` para el paquete y `npx playwright install` para los navegadores. Al actualizar, los dos pasos otra vez. En Linux y en integración continua, `--with-deps` suma las librerías del sistema.';
