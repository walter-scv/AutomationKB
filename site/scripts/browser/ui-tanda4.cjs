// Prueba mal/bien de las actividades del prototipo del track UI (lecciones 54 a 59b).
// Correr con el dev server en :3100: node site/scripts/browser/ui-prototipo.cjs
const L = require('./lib.cjs');
const U = '02-testing-domains/ui/';
const go = async (p, path, title) => { await L.go(p, path, title); await p.waitForTimeout(800);
  return p.locator('section', {has: p.getByRole('heading', {name: title, exact: true})}); };
const btn = (p, t) => p.getByRole('button', {name: t}).first();

async function quiz(p, steps) { // [[incorrecta|null, correcta]] por pregunta, como texto o regex
  for (const [w, r] of steps) {
    if (w) { await btn(p, w).click(); console.log('  quiz ERR:', (await btn(p, w).innerText()).slice(0, 90).replace(/\n/g, ' ')); }
    await btn(p, r).click();
  }
  await new Promise(r => setTimeout(r, 400));
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
  const {b, p, errs} = await L.open(); let S;
  await p.setViewportSize({width: 1280, height: 2600});
  const exact = (t) => new RegExp('^' + t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$');

  console.log('54 classify'); S = await go(p, U + '54-leer-un-fallo', '¿De quién es el problema?');
  await L.classify(p, [['31/11', 'Error del test'], ['31/11', 'Defecto de la aplicación'], ['Confirmar el turno', 'Error del test'], ['ERR_CONNECTION_REFUSED', 'Problema del entorno'],
    ['31/02/2026', 'Error del test'], ['alguien borró', 'Problema del entorno'], ['sigue mostrando el horario', 'Defecto de la aplicación'], ['strict mode', 'Error del test']]);
  console.log('54 term'); S = await go(p, U + '54-leer-un-fallo', 'Reproducir y abrir el reporte');
  await L.term(S, [['npx playwright test', 'npx playwright test --last-failed'], [null, 'npx playwright show-report']]);
  console.log('54 quiz'); S = await go(p, U + '54-leer-un-fallo', 'El paso que falló y el paso que tuvo la culpa');
  await quiz(S, [[/En el paso 1: el campo DNI/, /En el paso 2: una acción/], [/En el entorno/, /En el paso 1: el DNI escrito/], [/Subir el timeout/, /Terminar el paso 1/]]);

  console.log('55 classify'); S = await go(p, U + '55-debugging', '¿Qué herramienta corresponde?');
  await L.classify(p, [['cada vez que guardás', 'Trace viewer'], ['cada vez que guardás', 'UI mode'], ['falló anoche en CI', 'Trace viewer'], ['justo antes', 'Inspector'], ['también en el reintento', 'Trace viewer'],
    ['acción por acción', 'Inspector'], ['filtrar la suite', 'UI mode']]);
  console.log('55 term'); S = await go(p, U + '55-debugging', 'Grabar y abrir un trace');
  await L.term(S, [['npx playwright test turnos', 'npx playwright test turnos --trace on'], [null, 'npx playwright show-trace test-results/turnos-reservar-chromium/trace.zip']]);
  console.log('55 quiz'); S = await go(p, U + '55-debugging', 'Leer un trace de CI');
  await quiz(S, [[/tardó más de lo normal/, /no pasó la validación/], [/Metadata/, /Network, que lista/]]);

  console.log('56 fill'); S = await go(p, U + '56-interceptar-la-red', 'Simular un error del cálculo de envío');
  await L.fill(S, ['waitForResponse', 'abort', 'json', 'fetch'], ['route', 'fulfill', 'status', 'goto']);
  console.log('56 spot'); S = await go(p, U + '56-interceptar-la-red', 'La intercepción que no intercepta');
  await L.spot(S, [["page.getByRole('button',", "page.route('**/api/envios*',"], [null, "page.route('**/api/envio',"], [null, "page.waitForResponse('**/api/envios*');"], [null, "page.route('**/api/**',"]]);
  console.log('56 multi'); S = await go(p, U + '56-interceptar-la-red', '¿Simular o no simular?');
  await L.multi(S, ['flujo principal'], ['503', 'servicio externo', 'Tu carrito está vacío']);

  console.log('57 fill'); S = await go(p, U + '57-cross-browser-y-emulacion', 'Configurar los entornos de la tienda');
  await L.fill(S, ['viewport', 'browserName', 'projects', 'geolocation'], ['locale', 'timezoneId', 'channel', 'devices']);
  console.log('57 term'); S = await go(p, U + '57-cross-browser-y-emulacion', 'Correr solo en los celulares');
  await L.term(S, [['npx playwright test --list', 'npx playwright test carrito --list'], ['npx playwright test carrito --project=mobile-chrome', 'npx playwright test carrito --project=mobile-chrome --project=mobile-safari']]);
  console.log('57 quiz'); S = await go(p, U + '57-cross-browser-y-emulacion', 'Falla en un entorno y no en otro');
  await quiz(S, [[/Sacar webkit/, /Reportar la diferencia/], [/WebKit no soporta/, /le falta/], [/Subir el timeout/, /Fijar .?timezoneId/]]);

  console.log('58 classify'); S = await go(p, U + '58-visual-testing', '¿Qué hacer con esta diferencia?');
  await L.classify(p, [['se superpone', 'Actualizar'], ['se superpone', 'Reportar'], ['cambió el logo', 'Actualizar'], ['Oferta válida', 'Enmascarar'], ['carrusel', 'Enmascarar'], ['cortado a la mitad', 'Reportar'], ['bordes', 'Actualizar']]);
  console.log('58 term'); S = await go(p, U + '58-visual-testing', 'Crear y actualizar una referencia');
  await L.term(S, [['npx playwright test', 'npx playwright test ficha'], ['npx playwright test ficha', 'npx playwright test ficha --update-snapshots']]);
  console.log('58 order'); S = await go(p, U + '58-visual-testing', 'La vida de una imagen de referencia');
  await L.solveOrder(S, ['Escribir el test con toHaveScreenshot y la máscara del contenido dinámico.', 'Correrlo por primera vez: falla y escribe la referencia.', 'Mirar la imagen generada y confirmar que se ve como se espera.',
    'Confirmar la imagen de referencia en el repositorio.', 'Semanas después, el test falla con píxeles distintos.', 'Revisar Expected, Received y Diff en el reporte.', 'Correr --update-snapshots para ese test, porque el cambio fue aprobado.']);

  console.log('59 match'); S = await go(p, U + '59-accesibilidad-automatizada', 'Cada violación con su corrección');
  await matchExact(S, [['button-name', 'Darle al botón un texto visible o un aria-label.'], ['image-alt', 'Agregar un alt que describa la foto.'], ['color-contrast', 'Oscurecer el color del texto hasta alcanzar el contraste mínimo.'],
    ['label:', 'Asociarle un <label> con for e id.'], ['html-has-lang', 'Agregar lang="es" a la etiqueta <html>.'], ['link-name', 'Darle al enlace un texto o un aria-label que diga a dónde lleva.']], ['image-alt', 'Agregar lang="es" a la etiqueta <html>.']);
  console.log('59 classify'); S = await go(p, U + '59-accesibilidad-automatizada', '¿Lo encuentra axe?');
  await L.classify(p, [['no tiene atributo alt', 'Requiere'], ['no tiene atributo alt', 'Lo detecta'], ['alt="imagen"', 'Requiere'], ['solo tiene un ícono', 'Lo detecta'], ['con Tab', 'Requiere'], ['gris claro', 'Lo detecta'], ['200%', 'Requiere'], ['aria-label="botón"', 'Requiere']]);
  console.log('59 fill'); S = await go(p, U + '59-accesibilidad-automatizada', 'Analizar el formulario de pago');
  await L.fill(S, ['@playwright/test', 'browser', 'exclude', 'passes', 'disableRules'], ['@axe-core/playwright', 'page', 'withTags', 'analyze', 'violations']);

  const I = U + '59b-repaso-integrador-ui';
  console.log('59b decision'); S = await go(p, I, 'De la primera suite al primer fallo de CI');
  await L.decision(S, [['diseño nuevo|combinaciones', 'Reservar un turno y cancelarlo'], ['Borrar', 'Descargar los navegadores'], ['retries: 0', 'retain-on-failure'], ['waitForTimeout', 'Esperar el estado'], ['beforeAll', 'test.beforeEach']]);
  console.log('59b find'); S = await go(p, I, 'Revisión de un test de la agenda');
  await find(S, [["await page.getByRole\\('row'\\).filter\\(\\{ hasText: 'Dra. Paz'", 'Sin problema', 'Locator frágil o ambiguo'], ['await page.waitForTimeout', null, 'Espera fija'], ["await page.locator\\('table", null, 'Locator frágil o ambiguo'],
    ['expect\\(await', null, 'Assertion que no reintenta o que fue aflojada'], ["await expect\\(page.getByText\\('Turno cancelado'\\)\\).toBeAttached", null, 'Assertion que no reintenta o que fue aflojada']]);
  console.log('59b order'); S = await go(p, I, 'Armar el test de cancelar un turno');
  await L.solveOrder(S, ["import { test, expect } from '@playwright/test';", "test.describe('Agenda', () => {", "test('cancelar un turno lo libera', { tag: '@smoke' }, async ({ page }) => {",
    "await test.step('1- La recepcionista cancela el turno de las 09:30', async () => {", "page.once('dialog', (dialog) => dialog.accept());", "await page.getByRole('row').filter({ hasText: '09:30' }).getByRole('button', { name: 'Cancelar' }).click();",
    "await test.step('2- Confirma la cancelación', async () => {", "await expect(page.getByText('Turno cancelado')).toBeVisible();"]);
  console.log('59b term'); S = await go(p, I, 'Correr justo lo necesario');
  await L.term(S, [['npx playwright test @smoke --list', 'npx playwright test --grep @smoke --project=chromium --list'], [null, 'npx playwright test turnos.spec.ts:8'], ['npx playwright test --last-failed', 'npx playwright show-report']]);
  console.log('59b match'); S = await go(p, I, 'Cada situación con su mecanismo');
  await matchExact(S, [['El botón «Reprogramar»', 'hover() sobre la fila'], ['Cancelar un turno abre', "page.once('dialog', ...) antes del click"], ['El pago de la consulta', 'frameLocator(...)'], ['El enlace «Indicaciones', "page.waitForEvent('popup') antes del click"],
    ['La orden médica', 'setInputFiles(...)'], ['Hay que ver', 'page.route(...) con route.fulfill({ status: 500 })'], ['El teléfono del paciente', "pressSequentially('1145678901')"]], ['La orden médica', 'frameLocator(...)']);
  console.log('59b fill'); S = await go(p, I, 'La configuración de la suite');
  await L.fill(S, ['&&', 'on', 'locale', 'testDir', 'webkit'], ['?', 'on-first-retry', 'testIdAttribute', 'timezoneId', 'iPhone 13']);
  console.log('59b spot'); S = await go(p, I, 'El detalle que rompe la línea');
  await L.spot(S, [["}).click();", "expect(page.getByText('Turno"], [null, "'Imprimir'"], [null, "médica').setInputFiles('/Users/ana/Descargas/orden.pdf');"], [null, "expect(page.getByTestId('comprobante')).toHaveScreenshot('comprobante.png');"]]);
  console.log('59b multi'); S = await go(p, I, 'Qué le falta al test del pago');
  await L.multi(S, ['toContainText'], ['axe', 'toHaveScreenshot', 'rechazo de la tarjeta']);
  console.log('59b quiz'); S = await go(p, I, 'Un botón que cambió de nombre');
  await quiz(S, [[/deshabilitado/, /no coincide con el nombre real/], [/defecto de la aplicación/, /error del test/]]);
  console.log('59b builder'); S = await go(p, I, 'Verificar el estado de un turno');
  await L.builder(S, [['.nth(2)', ".filter({ hasText: '10:30' })"], [".getByText('Estado')", ".getByRole('cell').nth(3)"], [').toBeAttached();', ").toHaveText('Libre');"]]);

  for (const [f, n] of [['54-leer-un-fallo', 3], ['55-debugging', 3], ['56-interceptar-la-red', 3], ['57-cross-browser-y-emulacion', 3], ['58-visual-testing', 3], ['59-accesibilidad-automatizada', 3], ['59b-repaso-integrador-ui', 10]]) {
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
