// Prueba mal/bien de las actividades del prototipo del track UI (lecciones 49 a 53).
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

  console.log('49 match'); S = await go(p, U + '49-formularios', 'La acción para cada campo');
  await matchExact(S, [['Escribir el email', "fill('ana@mail.com')"], ['Escribir el número', "pressSequentially('4509953566233704')"], ['Elegir «Córdoba»', "selectOption('Córdoba')"],
    ['Dejar marcada', 'check() sobre la casilla'], ['Elegir «Retiro', 'check() sobre esa opción'], ['Marcar o desmarcar', 'setChecked(esEmpresa)']], ['Dejar marcada', "fill('ana@mail.com')"]);
  console.log('49 spot'); S = await go(p, U + '49-formularios', 'La acción que no corresponde');
  await L.spot(S, [['await', "términos').click();"], [null, "page.getByLabel('Provincia').fill('Córdoba');"], [null, "domicilio').uncheck();"], ['2', 'index:'], [null, "tarjeta').fill('4509953566233704');"]]);
  console.log('49 order'); S = await go(p, U + '49-formularios', 'Completar el checkout en orden');
  await L.solveOrder(S, ["await page.goto('/checkout');", "await page.getByLabel('Provincia').selectOption('Córdoba');", "await page.getByLabel('Ciudad').selectOption('Villa María');",
    "await page.getByLabel('Envío a domicilio').check();", "await page.getByLabel('Dirección').fill('Av. Colón 1200');", "await page.getByLabel('Acepto los términos').check();",
    "await page.getByRole('button', { name: 'Pagar' }).click();", "await expect(page.getByText('Pedido confirmado')).toBeVisible();"]);
  console.log('49 type'); S = await go(p, U + '49-formularios', 'Elegir la cobertura');
  await L.typedIn(S, 'await page...', ["await page.getByLabel('Cobertura').fill('OSDE');"], "await page.getByLabel('Cobertura').selectOption('OSDE');");

  console.log('50 match'); S = await go(p, U + '50-mouse-y-teclado', 'La interacción de cada pantalla');
  await matchExact(S, [['El botón «Comparar»', 'hover() sobre la tarjeta'], ['La cantidad del carrito', 'dblclick()'], ['El click derecho', "click({ button: 'right' })"], ['El buscador de la tienda', "press('Enter') sobre el buscador"],
    ['La ventana del zoom', "page.keyboard.press('Escape')"], ['La lista de deseos', 'dragTo(destino)']], ['La lista de deseos', 'dblclick()']);
  console.log('50 order'); S = await go(p, U + '50-mouse-y-teclado', 'Ingresar solo con el teclado');
  await L.solveOrder(S, ["await page.getByLabel('Email').fill('ana@mail.com');", "await page.keyboard.press('Tab');  // primer Tab", "await expect(page.getByLabel('Contraseña')).toBeFocused();",
    "await page.getByLabel('Contraseña').fill('clave123');", "await page.keyboard.press('Tab');  // segundo Tab", "await expect(page.getByLabel('Recordarme')).toBeFocused();",
    "await page.keyboard.press('Space');", "await expect(page.getByLabel('Recordarme')).toBeChecked();"]);
  console.log('50 builder'); S = await go(p, U + '50-mouse-y-teclado', 'Mover el termo al principio');
  await L.builder(S, [['.nth(2)', ".filter({ hasText: 'Termo' })"], ['.click(', '.dragTo('], ['page.mouse.move', "page.getByRole('listitem').filter({ hasText: 'Mochila urbana' })"], [').first();', ');']]);
  console.log('50 type'); S = await go(p, U + '50-mouse-y-teclado', 'Seleccionar todo, en cualquier sistema');
  await L.typedIn(S, 'Tecla o combinación', ['Control+A'], 'ControlOrMeta+A');

  console.log('51 match'); S = await go(p, U + '51-dialogos-iframes-y-pestanas', '¿Cómo se alcanza cada cosa?');
  await matchExact(S, [['Al cancelar un turno', "page.once('dialog', (d) => d.accept())"], ['La misma ventanita', "page.once('dialog', (d) => d.dismiss())"], ['Una ventanita del navegador pide', "page.once('dialog', (d) => d.accept('Viajo ese día'))"],
    ['Un <div role="dialog">', "page.getByRole('dialog')"], ['El mapa de la sede', "page.frameLocator('iframe[title=\"Mapa de la sede\"]')"], ['El enlace «Preparación', "page.waitForEvent('popup') antes del click"]],
    ['El mapa de la sede', "page.getByRole('dialog')"]);
  console.log('51 fill'); S = await go(p, U + '51-dialogos-iframes-y-pestanas', 'Aceptar la confirmación y pagar');
  await L.fill(S, ['dismiss', 'type', 'accept', 'locator'], ['once', 'message', 'accept', 'frameLocator']);
  console.log('51 order'); S = await go(p, U + '51-dialogos-iframes-y-pestanas', 'Las indicaciones en otra pestaña');
  await L.solveOrder(S, ["await page.goto('/turnos/estudios');", "const nuevaPestana = page.waitForEvent('popup');", "await page.getByRole('link', { name: 'Preparación para el estudio' }).click();",
    'const indicaciones = await nuevaPestana;', "await expect(indicaciones.getByRole('heading', { name: 'Ayuno de 8 horas' })).toBeVisible();"]);
  console.log('51 quiz'); S = await go(p, U + '51-dialogos-iframes-y-pestanas', 'Del síntoma a la causa');
  await quiz(S, [[/no mostró la confirmación/, /Apareció un .?confirm/], [/está deshabilitado/, /dentro de un iframe/], [/solo funciona con/, /no acepta ni cancela/]]);

  console.log('52 match'); S = await go(p, U + '52-tablas-y-componentes-dinamicos', 'Cada componente con su manejo');
  await matchExact(S, [['Un <input type="date">', "fill('2026-11-18')"], ['Un <input type="range">', "fill('10')"], ['Un <div role="slider">', "press('ArrowRight') con el foco en el control"],
    ['Un <div role="combobox">', "click en el combobox y click en getByRole('option', { name: 'Centro' })"], ['Un <select> nativo', "selectOption('OSDE')"], ['Un campo que sugiere', "pressSequentially('Pa') y click en la opción sugerida"]],
    ['Un <select> nativo', "fill('10')"]);
  console.log('52 type'); S = await go(p, U + '52-tablas-y-componentes-dinamicos', '¿Qué celda devuelve?');
  await L.typedIn(S, 'Texto de la celda', ['Dr. Ruiz'], 'Belgrano');
  console.log('52 multi'); S = await go(p, U + '52-tablas-y-componentes-dinamicos', 'La celda del estado de las 10:00');
  await L.multi(S, ["hasText: 'Dra. Paz'"], ["'10:00' \\}\\)\\.getByRole\\('cell'\\)\\.nth", "name: '10:00', exact: true"]);
  console.log('52 order'); S = await go(p, U + '52-tablas-y-componentes-dinamicos', 'Buscar turnos con todos los filtros');
  await L.solveOrder(S, ["await page.getByRole('combobox', { name: 'Especialidad' }).click();", "await page.getByRole('option', { name: 'Dermatología' }).click();", "await page.getByRole('combobox', { name: 'Profesional' }).pressSequentially('Pa');",
    "await page.getByRole('option', { name: 'Dra. Paz' }).click();", "await page.getByLabel('Desde').fill('2026-11-18');", "await page.getByRole('button', { name: 'Buscar turnos' }).click();",
    "await expect(page.getByRole('row').filter({ has: page.getByRole('cell') })).toHaveCount(4);"]);

  console.log('53 classify'); S = await go(p, U + '53-subir-y-descargar-archivos', '¿Cómo entra o sale el archivo?');
  await L.classify(p, [['Cargar la orden médica', 'Evento download'], ['Cargar la orden médica', 'setInputFiles'], ['Bajar el comprobante', 'Evento download'], ['Adjuntar estudios', 'Evento filechooser'],
    ['Quitar la foto', 'setInputFiles'], ['Exportar la agenda', 'Evento download'], ['Probar que la aplicación rechaza', 'setInputFiles']]);
  console.log('53 fill'); S = await go(p, U + '53-subir-y-descargar-archivos', 'Subir dos estudios y quitarlos');
  await L.fill(S, ['fs', 'fill', "'/Users/ana'", 'null'], ['path', 'setInputFiles', '__dirname', '[]']);
  console.log('53 order'); S = await go(p, U + '53-subir-y-descargar-archivos', 'Descargar y leer el comprobante');
  await L.solveOrder(S, ["await page.goto('/turnos/12-11');", "const descargaPromise = page.waitForEvent('download');", "await page.getByRole('link', { name: 'Descargar comprobante' }).click();",
    'const descarga = await descargaPromise;', 'const destino = testInfo.outputPath(descarga.suggestedFilename());', 'await descarga.saveAs(destino);', "const contenido = fs.readFileSync(destino, 'utf-8');", "expect(contenido).toContain('Dermatología');"]);
  console.log('53 spot'); S = await go(p, U + '53-subir-y-descargar-archivos', 'Lo que va a fallar en otra computadora');
  await L.spot(S, [['await', "médica').setInputFiles('/Users/ana/Escritorio/orden.pdf');"]]);
  // ronda 2: hay dos «await» en la línea y otro en la ronda 1, ya resuelta: se elige el primero habilitado
  await S.getByRole('button', {name: 'const', exact: true}).and(S.locator(':enabled')).first().click(); console.log('  st ERR:', await L.fb(S));
  await S.getByRole('button', {name: 'await', exact: true}).and(S.locator(':enabled')).first().click();
  await L.spot(S, [['descargaPromise;', "descarga.saveAs('comprobante.pdf');"]]);

  for (const [f, n] of [['49-formularios', 4], ['50-mouse-y-teclado', 4], ['51-dialogos-iframes-y-pestanas', 4], ['52-tablas-y-componentes-dinamicos', 4], ['53-subir-y-descargar-archivos', 4]]) {
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
