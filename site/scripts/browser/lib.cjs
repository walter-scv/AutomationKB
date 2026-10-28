// Helpers compartidos para probar actividades en el navegador.
// Helpers para probar actividades en el navegador. Requiere el dev server en :3100.
// Uso: node site/scripts/browser/mi-test.cjs (los tests hacen require('./lib.cjs')).
const path = require('path');
const {chromium} = require(path.resolve(__dirname, '../../../project/node_modules/playwright'));
const BASE='http://localhost:3100/AutomationKB/docs/01-foundations/';
async function open() {
  const b = await chromium.launch(); const p = await b.newPage({viewport:{width:1280,height:900}});
  const errs=[]; p.on('pageerror',e=>errs.push(e.message)); p.on('console',m=>{ if(m.type()==='error') errs.push(m.text()); });
  return {b,p,errs};
}
async function go(p, path, title) {
  await p.goto(BASE+path);
  const h=p.getByRole('heading',{name:title,exact:true}); await h.waitFor();
  await h.evaluate(e=>window.scrollBy(0,e.getBoundingClientRect().top-80));
  return p.locator('div',{has:h}).filter({has:p.locator('.akb-feedback, button')}).last();
}
const fb = async (p) => (await p.locator('.akb-feedback').last().innerText()).slice(0,90).replace(/\n/g,' ');
async function match(p, pairs, wrong) {  // pairs: [[leftText, rightRegexText]]
  const esc=t=>t.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
  const L=t=>p.getByRole('button',{name: typeof t==='string' ? (!t.includes(' ') ? t : new RegExp('^'+esc(t))) : t, exact: typeof t==='string' && !t.includes(' ')}).first();
  const R=t=>p.getByRole('button',{name:new RegExp(t.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'))}).first();
  if (wrong) { await L(wrong[0]).click(); await R(wrong[1]).click(); console.log('  match ERR:', await fb(p)); }
  for (const [l,r] of pairs) { await L(l).click(); await R(r).click(); }
  console.log('  match end:', await fb(p));
}
async function decision(p, steps) { // steps: [[wrongRegex|null, rightRegex]]
  for (const [w,r] of steps) {
    if (w) { await p.getByRole('button',{name:new RegExp(w)}).first().click(); console.log('  dp ERR:', await fb(p)); }
    await p.getByRole('button',{name:new RegExp(r)}).first().click();
  }
  console.log('  dp end:', await fb(p));
}
async function multi(p, wrong, right) {
  const cb=t=>p.getByRole('checkbox',{name:new RegExp(t)});
  for (const t of wrong) await cb(t).check();
  await p.getByRole('button',{name:'Confirmar selección'}).first().click(); console.log('  ms ERR:', await fb(p));
  for (const t of wrong) await cb(t).uncheck();
  for (const t of right) await cb(t).check();
  await p.getByRole('button',{name:'Confirmar selección'}).first().click(); console.log('  ms end:', await fb(p));
}
module.exports={open,go,fb,match,decision,multi};
async function fill(p, wrong, right) { // FillBlank: wrong chips first, then clear and fill right ones
  const chip=t=>p.getByRole('group',{name:'Fichas disponibles'}).first().getByRole('button',{name:t,exact:true});
  for (const t of wrong) await chip(t).click();
  await p.getByRole('group',{name:'Fichas disponibles'}).first().locator('xpath=following-sibling::button[1]').click(); console.log('  fb ERR:', await fb(p));
  for (const t of wrong) await p.getByRole('button',{name:`Hueco completado con "${t}", click para vaciarlo`}).first().click();
  // vacía también los que quedaron (si wrong no llenó todos los huecos)
  for (const t of right) await chip(t).click();
  await p.getByRole('group',{name:'Fichas disponibles'}).first().locator('xpath=following-sibling::button[1]').click(); console.log('  fb end:', await fb(p));
}
async function builder(p, steps) { // [[wrongPrefix|null, rightPrefix]]
  const b=t=>p.getByRole('button',{name:new RegExp('^\\s*'+t.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'))}).first();
  for (const [w,r] of steps) { if (w) { await b(w).click(); console.log('  cb ERR:', await fb(p)); } await b(r).click(); }
  console.log('  cb end:', await fb(p));
}
async function typed(p, wrong, right) {
  const i=p.getByRole('textbox').last();
  for (const w of wrong) { await i.fill(w); await i.press('Enter'); console.log('  ta ERR:', await fb(p)); }
  await i.fill(right); await i.press('Enter'); console.log('  ta end:', await fb(p));
}
async function spot(p, rounds) { // [[wrongToken|null, rightToken]]
  for (const [w,r] of rounds) { if (w) { await p.getByRole('button',{name:w,exact:true}).first().click(); console.log('  st ERR:', await fb(p)); } await p.getByRole('button',{name:r,exact:true}).first().click(); }
  console.log('  st end:', await fb(p));
}
module.exports.fill=fill; module.exports.builder=builder; module.exports.typed=typed; module.exports.spot=spot;
async function term(p, steps) { // [[wrong|null, right]]
  const inp=()=>p.getByRole('textbox',{name:/Comando para el paso/}).last();
  for (const [w,r] of steps) {
    if (w) { await inp().fill(w); await inp().press('Enter'); console.log('  term ERR:', (await p.locator('[class*=errorLine]').last().innerText()).slice(0,80)); }
    await inp().fill(r); await inp().press('Enter');
  }
  console.log('  term done:', await p.locator('[class*=doneMsg]').count());
}
module.exports.term=term;
async function order(p, correctTexts) { // usa los botones de flechas no es trivial; se prueba "Comprobar orden" con el orden inicial (error) y se reporta
  await p.getByRole('button',{name:/Comprobar orden/}).first().click();
  console.log('  order ERR:', await fb(p));
}
module.exports.order=order;
async function solveOrder(p, want) {
  await p.getByRole('button',{name:/Comprobar orden/}).first().click(); console.log('  order ERR:', await fb(p));
  for (let t=0;t<want.length;t++){
    for (let g=0;g<12;g++){
      const rows=p.locator('li[draggable]'); const n=await rows.count(); const tx=[];
      for(let i=0;i<n;i++) tx.push((await rows.nth(i).locator('[class*=codeLine]').innerText()).trim());
      const j=tx.indexOf(want[t]); if (j===t) break; if (j<0) { console.log('  no encontré', want[t], tx); return; }
      await rows.nth(j).getByRole('button',{name:/hacia arriba/}).click();
    }
  }
  await p.getByRole('button',{name:/Comprobar orden/}).first().click(); console.log('  order end:', await fb(p));
}
module.exports.solveOrder=solveOrder;

async function classify(p, pairs) { // pairs: [[texto del ítem, inicio del nombre de la caja]]
  for (const [t, col] of pairs) {
    const chip = p.getByRole('group', {name: 'Elementos sin clasificar'}).locator('[draggable]').filter({hasText: t}).first();
    const box = p.locator('[class*=box_]').filter({has: p.locator('[class*=boxLabel]', {hasText: col})}).first();
    await chip.dragTo(box);
  }
  console.log('  cl:', await fb(p));
}
async function typedIn(p, placeholder, wrong, right) { // TypeAnswer por placeholder
  const i = p.getByPlaceholder(placeholder).first();
  for (const w of wrong) { await i.fill(w); await i.press('Enter'); console.log('  ta ERR:', await fb(p)); }
  await i.fill(right); await i.press('Enter'); console.log('  ta end:', await fb(p));
}
module.exports.classify = classify; module.exports.typedIn = typedIn;
