// Prueba mal/bien de las actividades del prototipo del track UI (lecciones 36, 37 y 40).
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
async function find(p, lines) { // FindInCode: [[inicio de la línea, regla incorrecta|null, regla correcta]]
  for (const [line, w, r] of lines) {
    if (w) { await btn(p, new RegExp('^\\d+\\s*' + line)).click(); await btn(p, w).click(); console.log('  fic ERR:', await L.fb(p)); }
    await btn(p, new RegExp('^\\d+\\s*' + line)).click(); await btn(p, r).click();
  }
  console.log('  fic end:', await L.fb(p));
}

(async () => {
  const {b, p, errs} = await L.open();
  await p.setViewportSize({width: 1280, height: 1600}); // con 900 px la caja de destino queda fuera de la ventana y dragTo no hace scroll

  console.log('36 classify'); await go(p, U + '36-que-es-automatizar-ui', '¿En qué capa va cada verificación?');
  await L.classify(p, [['formato del CUIT', 'UI'], ['formato del CUIT', 'Componente'], ['envío gratis', 'Componente'],
    ['botón «Pagar»', 'UI'], ['servicio de stock', 'API'], ['total del carrito', 'Componente'], ['«Mis pedidos»', 'UI'],
    ['servicio de pedidos', 'API'], ['falta de stock', 'UI'], ['servicio de cupones', 'API']]);

  console.log('36 multi'); await go(p, U + '36-que-es-automatizar-ui', 'Beneficios, riesgos y alcance');
  await L.multi(p, ['regresión de transferencias'], ['ninguna hora', 'sesiones exploratorias', 'tres años', 'cinco minutos']);
  await L.multi(p, ['cuenta destino'], ['coincidieron', 'Los pasos se ejecutaron']);

  console.log('36 find'); await go(p, U + '36-que-es-automatizar-ui', '¿Qué propiedad le falta?');
  await find(p, [['El test de alta de un plazo fijo', 'No es rápido', 'No es repetible'], ['El test de débito automático', null, 'No se valida solo'],
    ['El test de baja de una tarjeta', null, 'No es independiente'], ['El test de login', null, 'No es rápido'],
    ['El test de compra de dólares', null, 'No es repetible']]);

  console.log('36 decision'); await go(p, U + '36-que-es-automatizar-ui', 'La primera suite de una app de turnos');
  await L.decision(p, [['Las 30 combinaciones', 'Reservar un turno'], ['Atribuirlo al servidor', 'Revisar qué cambia'],
    ['Agregar una espera', 'busque un turno libre'], ['Escribir los 30', 'Probar las combinaciones']]);

  console.log('37 match'); await go(p, U + '37-html-dom-y-devtools', 'Del HTML al árbol de accesibilidad');
  await matchExact(p, [['<a href="/turnos">', 'link "Mis turnos"'], ['<label for="esp">', 'combobox "Especialidad"'], ['<input type="text" id="os">', 'textbox, sin nombre'],
    ['<div class="btn"', 'text: Cancelar'], ['<button aria-label=', 'button "Semana siguiente"'], ['<input type="search"', 'searchbox "Buscar profesional"'],
    ['<input type="checkbox"', 'checkbox "Aviso por SMS"']], ['<div class="btn"', 'button "Semana siguiente"']);

  console.log('37 spot'); await go(p, U + '37-html-dom-y-devtools', '¿De dónde sale el nombre?');
  await L.spot(p, [['type="date"', 'aria-label="Fecha">'], ['name="franja"', 'for="m">Mañana</label>'], ['placeholder="0000-0000"', 'aria-label="Afiliado">'],
    [null, 'alt="Buscar"'], ['name="motivo"', 'placeholder="Síntomas"></textarea>']]);

  console.log('37 fill'); await go(p, U + '37-html-dom-y-devtools', 'Ponerle nombre a tres elementos');
  await L.fill(p, ['name', 'id', 'src', 'alt'], ['for', 'id', 'aria-label', 'alt']);

  console.log('37 multi'); await go(p, U + '37-html-dom-y-devtools', 'Presentes, pero ¿visibles?');
  await L.multi(p, ['Recordatorio enviado'], ['Cargando agenda', 'Dra. Paz', 'Turno confirmado']);

  console.log('37 quiz'); await go(p, U + '37-html-dom-y-devtools', 'Leer el DOM y DevTools');
  await quiz(p, [[/no muestra el contenido/, /lo agregó JavaScript/], [null, /seis elementos tienen/], [/es el padre/, /Son hermanos/], [null, /no está asociado/]]);

  console.log('40 fill'); await go(p, U + '40-anatomia-de-un-test', 'Completar el primer test');
  await L.fill(p, ['test', 'async', 'browser', 'const', 'click'], ['page', 'await', 'toBeVisible']);

  console.log('40 classify'); await go(p, U + '40-anatomia-de-un-test', 'Arrange, Act o Assert');
  await L.classify(p, [["name: 'Ingresar'", 'Act'], ["name: 'Ingresar'", 'Arrange'], ['Sí, cancelar', 'Act'], ["goto('/ingresar')", 'Arrange'],
    ['No tenés turnos', 'Assert'], ["getByLabel('DNI')", 'Arrange'], ["name: 'Cancelar turno'", 'Act'], ['Mis turnos', 'Arrange'], ['Turno cancelado', 'Assert']]);

  console.log('40 order'); await go(p, U + '40-anatomia-de-un-test', 'Ordenar el test de pedir un turno');
  await L.solveOrder(p, ["await page.goto('/ingresar');", "await page.getByLabel('DNI').fill('27999888');",
    "await page.getByRole('button', { name: 'Ingresar' }).click();", "await page.getByRole('link', { name: 'Pedir turno' }).click();",
    "await page.getByRole('button', { name: 'Dermatología' }).click();", "await page.getByRole('button', { name: '18/11 15:00' }).click();",
    "await page.getByRole('button', { name: 'Confirmar' }).click();", "await expect(page.getByText('Turno confirmado')).toBeVisible();"]);

  console.log('40 quiz'); await go(p, U + '40-anatomia-de-un-test', 'Leer lo que informa Playwright');
  await quiz(p, [[/En la verificación final/, /Al elegir el horario/], [/El nombre del archivo/, /El nombre del grupo/], [null, /De un tag declarado/], [/defecto/, /Falta el/]]);

  for (const [f, n] of [['36-que-es-automatizar-ui', 4], ['37-html-dom-y-devtools', 5], ['40-anatomia-de-un-test', 4]]) {
    await p.goto('http://localhost:3100/AutomationKB/docs/' + U + f);
    await p.getByRole('heading', {level: 1}).waitFor();
    console.log(f, 'completadas:', await p.getByText('· Completada').count(), 'de', n);
  }
  console.log('ERRS', errs);
  await b.close();
})();
