// Prueba mal/bien de las actividades del prototipo del track UI (lecciones 43 a 48).
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
  await p.setViewportSize({width: 1280, height: 1600});

  console.log('43 match'); S = await go(p, U + '43-locators-orientados-al-usuario', 'El locator para cada elemento');
  await matchExact(S, [['<img src="mapa.png"', "getByAltText('Mapa de la sede')"], ['<input placeholder=', "getByPlaceholder('Buscar especialidad')"], ['<label for="dni">', "getByLabel('DNI')"],
    ['<button title=', "getByTitle('Imprimir comprobante')"], ['<h2>', "getByRole('heading', { name: 'Próximos turnos' })"], ['<p>Llegá', "getByText('Llegá 10 minutos antes')"]],
    ['<button title=', "getByText('Llegá 10 minutos antes')"]);
  console.log('43 classify'); S = await go(p, U + '43-locators-orientados-al-usuario', '¿Cuántos encuentra?');
  await L.classify(p, [["{ name: 'Cancelar' })", /^Uno$/], ["{ name: 'Cancelar' })", 'Varios'], ["'Cancelar', exact: true", /^Uno$/], ["'Imprimir comprobante' })", 'Ninguno'], ["getByText('turno')", 'Varios'],
    ["'pedir turno'", /^Uno$/], ['level: 3', 'Ninguno'], ["'Buscar especialidad'", /^Uno$/], ["'×'", 'Ninguno'], ["getByRole('heading')", 'Varios']]);
  console.log('43 builder'); S = await go(p, U + '43-locators-orientados-al-usuario', 'Armar el locator del botón Cancelar');
  await L.builder(S, [['getByText', 'getByRole'], ["('link', {", "('button', {"], ["name: 'Cancelar' })", "name: 'Cancelar', exact: true })"]]);
  console.log('43 decision'); S = await go(p, U + '43-locators-orientados-al-usuario', 'Un locator que no encuentra y otro que encuentra de más');
  await L.decision(S, [['Subir el timeout', 'El rol y el nombre accesible'], ["name: '×', exact", "name: 'Cerrar aviso'"], ['Quedarse con el primero', 'Agregar `?exact: true']]);

  console.log('44 match'); S = await go(p, U + '44-css-y-xpath', '¿Qué encuentra cada selector?');
  await matchExact(S, [['.turno.ocupado', 'El bloque completo del turno de las 09:30.'], ['[data-id="T-88"] button', 'El botón Reservar del turno de las 09:00.'], ['#filtros input', 'El campo DNI del formulario de filtros.'],
    ["//span[text()='Dra. Paz']/..", 'El bloque completo del turno de las 09:00.'], ['.turno .hora', 'Los dos horarios, 09:00 y 09:30.'], ['//button[@disabled]', 'El botón Reservar del turno de las 09:30.']],
    ['.turno .hora', 'El bloque completo del turno de las 09:30.']);
  console.log('44 spot'); S = await go(p, U + '44-css-y-xpath', 'La parte que se va a romper');
  await L.spot(S, [['button\').click();', 'div:nth-child(3)'], [null, "span:first-child');"], ['page.locator(\'.turno', ".btn-x7a9').click();"], [null, "page.locator('.turno:nth-child(3)"], ["page.locator('#filtros", '.col-md-6']]);
  console.log('44 type'); S = await go(p, U + '44-css-y-xpath', 'Un selector estable para el DNI');
  await L.typedIn(S, 'Selector CSS', ['#dni'], 'input[name="dni"]');
  console.log('44 decision'); S = await go(p, U + '44-css-y-xpath', 'Un test heredado que reserva otro turno');
  await L.decision(S, [['defecto', 'El turno nuevo ocupa'], ['nth-child', 'data-id=.T-91'], ['Ver código fuente', 'panel Elements']]);

  console.log('45 fill'); S = await go(p, U + '45-encadenar-y-filtrar', 'Quitar un producto del carrito');
  await L.fill(S, ['list', 'nth', 'name', 'Vaciar carrito'], ['listitem', 'filter', 'hasText', 'Quitar']);
  console.log('45 multi'); S = await go(p, U + '45-encadenar-y-filtrar', '¿Cuáles describen el elemento correcto?');
  await multiQ(S, 'botón Quitar de la mochila urbana', ["hasText: 'Mochila' })"], ["hasText: 'Mochila urbana' })", "name: 'Mochila urbana' }) })"]);
  await multiQ(S, 'solo el ítem del termo', ['nth(2)'], ["disabled: true", "{ hasText: 'Sin stock' })"]);
  console.log('45 spot'); S = await go(p, U + '45-encadenar-y-filtrar', 'Encuentra de más o encuentra otro');
  await L.spot(S, [['hasText:', "'Mo'"], [null, '}).nth(2).click();'], ["'Termo", "}).getByRole('button')).toBeVisible();"]]);
  console.log('45 decision'); S = await go(p, U + '45-encadenar-y-filtrar', 'El carrito cambió de orden');
  await L.decision(S, [['rompió', 'first\\(\\)`? elige el primer'], ['last\\(\\)', "filter\\(\\{ hasText: 'Mochila urbana'"], ['count\\(\\)', "getByRole\\('listitem'\\)\\.getByRole\\('heading'\\)"]]);

  console.log('46 find'); S = await go(p, U + '46-data-testid-y-codegen', '¿El atributo cumple el contrato?');
  await find(S, [['<div data-testid="campo-dni"', 'Cumple el contrato', 'Está en el contenedor, no en el elemento'], ['<button data-testid="boton-verde"', null, 'Nombra el diseño o la posición'],
    ['<button data-testid="boton">', null, 'Nombre que sirve para varios elementos'], ['<div data-testid="columna-derecha"', null, 'Nombra el diseño o la posición']]);
  console.log('46 quiz'); S = await go(p, U + '46-data-testid-y-codegen', 'Cómo busca getByTestId');
  await quiz(S, [[/Uno: busca una parte/, /Ninguno: compara/], [/busca en los dos/, /Nada: con esa/], [/solo encuentra botones/, /Sigue pasando/]]);
  console.log('46 builder'); S = await go(p, U + '46-data-testid-y-codegen', 'Grabar la agenda con codegen');
  await L.builder(S, [['test', 'codegen'], ['--project=data-qa', '--test-id-attribute data-qa'], ['--list', '-o tests/turnos.spec.ts'], ['--last-failed', 'http://localhost:3000/turnos']]);
  console.log('46 decision'); S = await go(p, U + '46-data-testid-y-codegen', 'Un ícono sin nombre');
  await L.decision(S, [['circle-green', 'Pedirle al equipo'], ['formato inválido', 'contenedor del campo'], ['encuentra los dos', 'testIdAttribute']]);

  console.log('47 match'); S = await go(p, U + '47-assertions', 'La assertion para cada verificación');
  await matchExact(S, [['El campo Cantidad', "toHaveValue('2')"], ['El resumen dice', "toHaveText('Total: $ 90.000')"], ['El aviso de envío', "toContainText('llega el jueves')"], ['Quedaron tres', 'toHaveCount(3)'],
    ['La casilla', 'toBeChecked()'], ['El botón Pagar', 'toBeDisabled()'], ['La página pasó', 'toHaveURL(/\\/pedido\\/confirmado/)'], ['El aviso de error', 'toBeHidden()']], ['El aviso de error', 'toBeDisabled()']);
  console.log('47 find'); S = await go(p, U + '47-assertions', '¿Qué le pasa a esta assertion?');
  await find(S, [['expect\\(await page.getByText', 'Sin problema', 'No reintenta: es una manual assertion'], ["await expect\\(page.getByText\\('Pedido confirmado'\\)\\).toBeAttached", null, 'Está aflojada: ya no verifica lo que tenía que verificar'],
    ["await expect\\(page.getByTestId\\('stock'\\)", null, 'Compara contra un valor que depende de los datos de hoy'], ["await expect\\(page.locator\\('#total'\\)\\)", null, 'Está aflojada: ya no verifica lo que tenía que verificar'],
    ['const envio', null, 'No reintenta: es una manual assertion'], ["await expect\\(page.getByRole\\('row'\\)", null, 'Compara contra un valor que depende de los datos de hoy']]);
  console.log('47 builder'); S = await go(p, U + '47-assertions', 'Verificar la cantidad sin cortar el test');
  await L.builder(S, [['assert', 'expect.soft'], ["(await page", "(page.getByLabel('Cantidad'))"], [".toBe('3')", ".toHaveValue('3')"]]);
  console.log('47 quiz'); S = await go(p, U + '47-assertions', 'Leer dos tests que fallaron');
  await quiz(S, [[/clicks no funcionaron/, /leyó el contador una sola vez/], [/fallaron las tres/, /fallaron las dos soft/], [/timeout: 5 segundos/, /valor esperado contradice/]]);

  console.log('48 classify'); S = await go(p, U + '48-esperas-y-timeouts', '¿Qué le faltó al click?');
  await L.classify(p, [["Finalizar compra", 'Otro elemento'], ["Finalizar compra", 'No lo encuentra'], ["'Confirmar compra'", 'No está habilitado'], ['Aceptá las cookies', 'Otro elemento'], ["Código postal", 'No está habilitado'],
    ['spinner', 'Otro elemento'], ["'Elegir envío'", 'No está habilitado']]);
  console.log('48 match'); S = await go(p, U + '48-esperas-y-timeouts', '¿Qué plazo se cambia?');
  await matchExact(S, [['Un test recorre', 'test.setTimeout(120_000)'], ['Un test corre en', 'test.slow()'], ['Una sola verificación', '{ timeout: 15_000 } en esa assertion'], ['Todas las assertions', 'expect: { timeout: 8_000 } en la configuración'],
    ['Ningún click', 'actionTimeout: 10_000 en use'], ['El mismo plazo', 'Una constante TIMEOUTS.proceso']], ['Ningún click', 'test.slow()']);
  console.log('48 fill'); S = await go(p, U + '48-esperas-y-timeouts', 'Reemplazar la espera fija');
  await L.fill(S, ['expect', 'soft', 'toBeVisible', 'goto'], ['not', 'toHaveCount', 'waitForURL']);
  console.log('48 multi'); S = await go(p, U + '48-esperas-y-timeouts', 'Un indicador de carga que no se va');
  await L.multi(S, ['force: true'], ['hay que investigar', 'visible, habilitado y estable']);

  for (const [f, n] of [['43-locators-orientados-al-usuario', 4], ['44-css-y-xpath', 4], ['45-encadenar-y-filtrar', 4], ['46-data-testid-y-codegen', 4], ['47-assertions', 4], ['48-esperas-y-timeouts', 4]]) {
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
