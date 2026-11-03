// Prueba mal/bien de las actividades del prototipo del track UI (lecciones 38, 39, 41 y 42).
// Correr con el dev server en :3100: node site/scripts/browser/ui-prototipo.cjs
const L = require('./lib.cjs');
const U = '02-testing-domains/ui/';
const go = async (p, path, title) => { await L.go(p, path, title); await p.waitForTimeout(800); };
const btn = (p, t) => p.getByRole('button', {name: t}).first();

async function quiz(p, steps) { // [[incorrecta|null, correcta]] por pregunta, como texto o regex
  for (const [w, r] of steps) {
    if (w) { await btn(p, w).click(); console.log('  quiz ERR:', (await btn(p, w).innerText()).slice(0, 90).replace(/\n/g, ' ')); }
    await btn(p, r).click();
  }
  await p.waitForTimeout(400);
  console.log('  quiz end: correctas marcadas =', await p.locator('[class*=right]').count());
}
async function matchExact(p, pairs, wrong) { // Match con el texto derecho exacto (lib.match lo busca como subcadena)
  const pick = async (l, r) => { await btn(p, l.includes(' ') ? new RegExp('^' + l.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')) : l).click();
    await p.getByRole('button', {name: r, exact: true}).first().click(); };
  if (wrong) { await pick(...wrong); console.log('  match ERR:', await L.fb(p)); }
  for (const [l, r] of pairs) await pick(l, r);
  console.log('  match end:', await L.fb(p));
}
async function multiQ(p, prompt, wrong, right) { // MultiSelect acotado a la pregunta que contiene prompt
  const q = p.locator('[class*=question]').filter({hasText: prompt}).first();
  const cb = t => q.getByRole('checkbox', {name: t}).first();
  for (const t of wrong) await cb(t).check();
  await q.getByRole('button', {name: 'Confirmar selección'}).click(); console.log('  ms ERR:', (await q.locator('.akb-feedback').innerText()).slice(0, 80));
  for (const t of wrong) await cb(t).uncheck();
  for (const t of right) await cb(t).check();
  await q.getByRole('button', {name: 'Confirmar selección'}).click(); console.log('  ms end:', (await q.locator('.akb-feedback').innerText()).slice(0, 80));
}
async function find(p, lines) { // FindInCode: [[inicio de la línea, regla incorrecta|null, regla correcta]]
  for (const [line, w, r] of lines) {
    if (w) { await btn(p, new RegExp('^\\d+\\s*' + line)).click(); await btn(p, w).click(); console.log('  fic ERR:', await L.fb(p)); }
    await btn(p, new RegExp('^\\d+\\s*' + line)).click(); await btn(p, r).click();
  }
  console.log('  fic end:', await L.fb(p));
}

(async () => {
  const {b, p, errs} = await L.open();
  await p.setViewportSize({width: 1280, height: 1600});

  console.log('38 term'); await go(p, U + '38-instalar-playwright', 'Crear la suite desde cero');
  await L.term(p, [['npm -v', 'node -v'], ['npm install playwright', 'npm init playwright@latest'], [null, 'npx playwright test'], [null, 'npx playwright --version']]);
  console.log('38 classify'); await go(p, U + '38-instalar-playwright', '¿Va al repositorio?');
  await L.classify(p, [['package-lock.json', 'No se versiona'], ['package-lock.json', 'Se versiona'], ['node_modules/', 'No se versiona'], ['playwright.config.ts', 'Se versiona'],
    ['test-results/', 'No se versiona'], ['tests/turno.spec.ts', 'Se versiona'], ['playwright/.auth/', 'No se versiona'], ['.github/workflows', 'Se versiona'],
    ['playwright-report/', 'No se versiona'], ['package.json', 'Se versiona']]);
  console.log('38 builder'); await go(p, U + '38-instalar-playwright', 'Armar el comando de actualización');
  await L.builder(p, [['init', 'install'], ['-g', '-D'], ['playwright@latest', '@playwright/test@latest']]);
  console.log('38 decision'); await go(p, U + '38-instalar-playwright', 'La suite en otra computadora');
  await L.decision(p, [['npx playwright test', 'npm install`?, para instalar'], ['Borrar', 'Correr `?npx playwright install`?\\.'], ['volver a la versión', 'La versión nueva pide'], ['install chromium', 'npx playwright install --with-deps']]);

  console.log('39 match'); await go(p, U + '39-configuracion-playwright', '¿Qué opción resuelve cada necesidad?');
  await matchExact(p, [['La suite tiene que correr contra', 'use.baseURL'], ['Alguien subió un test', 'forbidOnly'], ['La máquina de CI', 'workers'], ['Los archivos de test', 'testDir'],
    ['Hace falta ver', 'use.trace'], ['La aplicación tiene que', 'webServer'], ['Un corte breve', 'retries'], ['La suite también', 'projects']], ['Un corte breve', 'workers']);
  console.log('39 fill'); await go(p, U + '39-configuracion-playwright', 'Configurar la suite de la tienda');
  await L.fill(p, ['&&', '?', 'url', 'on', 'only-on-failure'], ['!!', '?', 'baseURL', 'on-first-retry', 'only-on-failure']);
  console.log('39 quiz'); await go(p, U + '39-configuracion-playwright', 'Leer una corrida con reintentos');
  await quiz(p, [[/Pasó: el resultado final/, /Falló una vez y pasó/], [/solo se graba cuando/, /graba el trace solo en el primer/], [/igual que en CI/, /con la captura del fallo y sin trace/]]);

  console.log('41 term'); await go(p, U + '41-correr-los-tests', 'Elegir qué corre');
  await L.term(p, [['npx playwright test', 'npx playwright test --list'], [null, 'npx playwright test turnos --list'], ['npx playwright test @smoke --list', 'npx playwright test --grep @smoke --project=chromium --list'], [null, 'npx playwright test turnos.spec.ts:8']]);
  console.log('41 multi'); await go(p, U + '41-correr-los-tests', '¿Qué corre este comando?');
  await multiQ(p, 'perfil -g cancelar', ['[firefox] Turnos › cancelar'], ['[firefox] Perfil › cancelar']);
  await multiQ(p, 'C mayúscula', ['Ninguna'], ['[chromium] Turnos › cancelar', '[chromium] Perfil › cancelar']);
  console.log('41 builder'); await go(p, U + '41-correr-los-tests', 'Ver el test de perfil en Firefox');
  await L.builder(p, [['@perfil', 'perfil'], ['--project=chromium', '--project=firefox'], ['--list', '--headed']]);
  console.log('41 decision'); await go(p, U + '41-correr-los-tests', 'Del fallo al cambio listo');
  await L.decision(p, [['test --list', 'test --last-failed'], ['Agregar test.skip', 'show-report'], ['Subirlo así', 'Quitar el']]);
  console.log('41 type'); await go(p, U + '41-correr-los-tests', 'Correr el script del equipo');
  await L.typedIn(p, 'npm ...', ['npx test:smoke'], 'npm run test:smoke');

  console.log('42 order'); await go(p, U + '42-hooks-y-aislamiento', '¿En qué orden se ejecuta?');
  await L.solveOrder(p, ['// beforeAll', '// beforeEach, antes de cambiar el teléfono', '// test: cambiar el teléfono', '// afterEach, después de cambiar el teléfono',
    '// beforeEach, antes de cambiar el email', '// test: cambiar el email', '// afterEach, después de cambiar el email', '// afterAll']);
  console.log('42 classify'); await go(p, U + '42-hooks-y-aislamiento', '¿En qué hook va?');
  await L.classify(p, [['lista de especialidades', 'beforeEach'], ['lista de especialidades', 'beforeAll'], ['Abrir la pantalla de turnos', 'beforeEach'], ['Cancelar en el sistema', 'afterEach'],
    ['página de perfil', 'beforeEach'], ['Borrar el paciente', 'afterEach'], ['horarios de atención', 'beforeAll'], ['Liberar el horario', 'afterEach']]);
  console.log('42 decision'); await go(p, U + '42-hooks-y-aislamiento', 'Dos tests que se necesitan');
  await L.decision(p, [['el servidor tarda', 'Cada worker tiene'], ['workers: 1', 'cree su propio pedido'], ['afterAll', 'a `?beforeEach']]);
  console.log('42 quiz'); await go(p, U + '42-hooks-y-aislamiento', 'Hooks, workers y contextos');
  await quiz(p, [[/antes de cada test\./, /corrieron tres workers/], [/mismo worker\./, /Sin sesión/]]);

  for (const [f, n] of [['38-instalar-playwright', 4], ['39-configuracion-playwright', 3], ['41-correr-los-tests', 5], ['42-hooks-y-aislamiento', 4]]) {
    await p.goto('http://localhost:3100/AutomationKB/docs/' + U + f);
    await p.getByRole('heading', {level: 1}).waitFor(); await p.waitForTimeout(500);
    console.log(f, 'completadas:', await p.getByText('· Completada').count(), 'de', n);
    for (const sec of await p.locator('section').all()) {
      const h = sec.locator('h3').first(); if (!(await h.count())) continue;
      if (!(await sec.getByText('· Completada').count())) console.log('   sin completar:', await h.innerText());
    }
  }
  console.log('ERRS', errs);
  await b.close();
})();
