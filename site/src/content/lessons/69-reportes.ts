import type {DecisionNode} from '@site/src/components/DecisionPath';
import type {BuilderStep} from '@site/src/components/CommandBuilder';
import type {TerminalStep} from '@site/src/components/Terminal';
import type {CodeLine} from '@site/src/components/FindInCode';

export const REP_START = 'ci';
export const REP_NODES: Record<string, DecisionNode> = {
  ci: {
    id: 'ci',
    situation: 'La suite de turnos usa `reporter: \'html\'`. El script `npm run verificar` corre los tests y después revisa el estilo del código. Cuando un test falla, el script se queda detenido en «Serving HTML report» y la revisión de estilo nunca corre. ¿Qué cambiás?',
    options: [
      {text: 'Sacar el reporter `html` y dejar solo `list`.', correct: false, why: 'Se destraba el script, pero se pierde el reporte que se usa para investigar los fallos.'},
      {text: 'Usar `[\'html\', { open: \'never\' }]`.', correct: true, why: 'Por defecto, si algo falla en una terminal interactiva, el reporte se abre y el comando se queda sirviéndolo. Con `open: \'never\'` se genera igual, sin abrirse, y el script sigue.', next: 'platform'},
      {text: 'Agregar `retries: 2` para que los fallos se resuelvan solos.', correct: false, why: 'Si el test sigue fallando después de los reintentos, el reporte se abre igual.'},
    ],
  },
  platform: {
    id: 'platform',
    situation: 'El equipo quiere ver qué tests fallaron en la pestaña de resultados de la plataforma de CI, sin descargar nada. ¿Qué agregás?',
    options: [
      {text: 'Un segundo reporter `json`, con todos los datos de la corrida.', correct: false, why: 'Es un formato propio de Playwright: la plataforma no sabe leerlo como resultados de tests.'},
      {text: 'Subir la carpeta `playwright-report/` al repositorio después de cada corrida.', correct: false, why: 'Los reportes no se versionan, y la plataforma tampoco lo mostraría en su pestaña.'},
      {text: 'Un reporter `junit` con un `outputFile`, junto a los que ya están.', correct: true, why: 'El XML de JUnit es el formato estándar que leen las plataformas de CI. La lista de reporters admite varios a la vez.', next: 'manager'},
    ],
  },
  manager: {
    id: 'manager',
    situation: 'La responsable de calidad quiere ver, en cada versión, solo los tests críticos que fallaron, y saber si un test falla seguido o es la primera vez. ¿Qué proponés?',
    options: [
      {text: 'Allure, con `severity` declarada en los tests y el historial de corridas configurado.', correct: true, why: 'La severidad se convierte en un filtro, y el historial muestra los resultados anteriores de cada test.'},
      {text: 'Agregar «CRÍTICO» al título de los tests importantes y buscarlo en el reporte HTML.', correct: false, why: 'El título deja de describir el comportamiento, y el reporte HTML sigue sin mostrar las corridas anteriores.'},
      {text: 'Mandarle el XML de JUnit de cada corrida.', correct: false, why: 'Tiene el resultado de una sola corrida y ninguna severidad: no responde ninguna de las dos preguntas.'},
    ],
  },
};
export const REP_EXPLANATION =
  'Un reporter para cada lector: `list` para quien corre, `html` sin abrirse en CI, `junit` para la plataforma y Allure, con severidad e historial, para quien sigue la calidad entre versiones.';

export const ATTACH_PREFIX = 'await ';
export const ATTACH_STEPS: BuilderStep[] = [
  {options: ['console.log(', 'testInfo.attach(', 'page.screenshot('], correct: 'testInfo.attach(', hint: 'Lo que se imprime en la consola no queda como adjunto con nombre: buscá el método que agrega algo al reporte.'},
  {options: ["'turno', ", "'turno reservado', ", "turno, "], correct: "'turno reservado', ", hint: 'El primer argumento es el nombre del adjunto: un texto que diga qué es.'},
  {options: ['{ body: turno, ', '{ body: JSON.stringify(turno, null, 2), ', '{ path: turno, '], correct: '{ body: JSON.stringify(turno, null, 2), ', hint: '`body` recibe un texto: el objeto tiene que convertirse antes.'},
  {options: ["contentType: 'text/html' });", "contentType: 'application/json' });", "contentType: 'image/png' });"], correct: "contentType: 'application/json' });", hint: '¿Qué formato tiene el texto que generó `JSON.stringify`?'},
];
export const ATTACH_EXPLANATION =
  "`await testInfo.attach('turno reservado', { body: JSON.stringify(turno, null, 2), contentType: 'application/json' });` deja en el reporte el turno que devolvió la API, dentro del paso que lo creó.";

export const ALLURE_STEPS: TerminalStep[] = [
  {
    instruction: 'La corrida de turnos terminó y dejó sus resultados en allure-results. Generá el reporte de Allure desde esa carpeta, borrando antes el reporte de la corrida anterior.',
    accepted: ['npx allure generate allure-results --clean', 'npx allure generate --clean allure-results', 'npx allure generate ./allure-results --clean', 'npx allure generate --clean ./allure-results', 'npx allure generate allure-results --clean*', 'npx allure generate ./allure-results --clean*'],
    hint: 'Es `npx allure generate`, la carpeta de resultados y la opción que limpia el reporte anterior.',
    output: '',
  },
  {
    instruction: 'Abrí el reporte generado.',
    accepted: ['npx allure open', 'npx allure open*'],
    hint: 'Es el comando de Allure que sirve el reporte por HTTP.',
    output: 'Allure is running on http://localhost:54399. Press CTRL+C to stop.',
  },
];
export const ALLURE_EXPLANATION =
  '`generate` arma `allure-report/` desde los resultados crudos, y `--clean` evita que se mezcle con el reporte anterior. `open` lo sirve en un puerto libre.';

export const PR_RULE_LABELS = [
  'Severidad que no refleja el impacto',
  'Dato sensible en el reporte',
  'Archivo generado en el repositorio',
];
export const PR_LINES: CodeLine[] = [
  {
    code: '+ /allure-results/   (línea nueva en .gitignore)',
    rule: 0,
    why: 'Los resultados crudos se generan en cada corrida: van en `.gitignore`.',
    hint: '¿Esto agrega algo al repositorio o lo deja afuera?',
  },
  {
    code: "+ allure-report/index.html   (archivo nuevo en el commit)",
    rule: 3,
    why: 'El reporte se genera en cada corrida y se publica desde CI (sección IV): no se versiona.',
    hint: '¿Este archivo lo escribió una persona o lo generó una herramienta?',
  },
  {
    code: "await allure.severity('critical'); // agregado igual en los 300 tests",
    rule: 1,
    why: 'Si todo es crítico, el filtro por severidad no separa nada: cada test tiene que declarar el impacto real de su falla.',
    hint: '¿Los 300 tests protegen funciones igual de importantes?',
  },
  {
    code: '"report": "allure generate allure-results --clean && allure open"   (script nuevo en package.json)',
    rule: 0,
    why: 'Genera el reporte sin restos del anterior y lo abre: es el uso esperado.',
    hint: '¿Qué hace `--clean` con el reporte anterior?',
  },
  {
    code: "await testInfo.attach('credenciales', { body: variable('RECEPCIONISTA_CLAVE'), contentType: 'text/plain' });",
    rule: 2,
    why: 'El reporte lo ve mucha gente y se publica: la contraseña adjunta queda expuesta.',
    hint: '¿Quién puede abrir el reporte?',
  },
  {
    code: "await allure.severity('blocker'); // en el test de reservar turno, sin el que la agenda no sirve",
    rule: 0,
    why: 'Reservar es la función central de la agenda: si falla, bloquea la versión. La severidad refleja el impacto.',
    hint: '¿Qué pasa con la agenda si reservar no funciona?',
  },
  {
    code: '+ allure-results/3f2a9c1e-result.json   (archivo nuevo en el commit)',
    rule: 3,
    why: 'Es un resultado crudo de una corrida en una computadora: se genera cada vez y no se versiona.',
    hint: '¿De dónde salió este archivo?',
  },
];
