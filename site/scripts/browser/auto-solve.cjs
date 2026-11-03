// Resuelve en el navegador todas las actividades de una o más lecciones, a partir de sus datos:
// en cada una prueba primero una respuesta incorrecta y después la correcta, y al final cuenta
// cuántas quedaron completadas. Requiere el dev server en :3100.
// Uso: node scripts/browser/auto-solve.cjs 03-framework-engineering/ui/67-sesion-reutilizada [...]
const fs = require('fs');
const path = require('path');
const ts = require(path.resolve(__dirname, '../../node_modules/typescript'));
const L = require('./lib.cjs');

const SITE = path.resolve(__dirname, '../..');
const esc = (t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const plain = (t) => t.replace(/`/g, '').replace(/\s+/g, ' ').trim();
const starts = (t, n = 40) => new RegExp('^\\s*' + esc(plain(t).slice(0, n)));

function loadData(file) {
  const src = fs.readFileSync(file, 'utf8');
  const out = ts.transpileModule(src, {compilerOptions: {module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020}}).outputText;
  const m = {exports: {}};
  new Function('module', 'exports', 'require', out)(m, m.exports, require);
  return m.exports;
}

function activities(doc) {
  const mdx = fs.readFileSync(path.join(SITE, 'docs', doc + '.mdx'), 'utf8');
  const data = loadData(path.join(SITE, 'src/content/lessons', mdx.match(/@site\/src\/content\/lessons\/([^']+)'/)[1] + '.ts'));
  const acts = [];
  for (const block of mdx.split('<Activity').slice(1)) {
    const title = block.match(/title="([^"]+)"/)[1];
    const comp = [...block.matchAll(/<(\w+)\n([\s\S]*?)\/>/g)].find((c) => c[2].includes('onSolved'));
    const props = {};
    for (const [, k, v] of comp[2].matchAll(/(\w+)=\{(\w+)\}/g)) props[k] = data[v];
    for (const [, k, v] of comp[2].matchAll(/(\w+)="([^"]*)"/g)) props[k] = v;
    acts.push({title, type: comp[1], props});
  }
  return acts;
}

const solvers = {
  async DecisionPath(S, {startId, nodes}) {
    let id = startId;
    while (id) {
      const n = nodes[id];
      const w = n.options.find((o) => !o.correct), r = n.options.find((o) => o.correct);
      await S.getByRole('button', {name: starts(w.text)}).last().click();
      console.log('  dp ERR:', await L.fb(S));
      await S.getByRole('button', {name: starts(r.text)}).last().click();
      id = r.next;
    }
    console.log('  dp end:', await L.fb(S));
  },
  async Quiz(S, {questions}) {
    for (const q of questions) {
      const box = S.locator('fieldset, [class*=question]').filter({hasText: plain(q.question).slice(0, 50)}).first();
      const w = q.options.find((o) => !o.correct), r = q.options.find((o) => o.correct);
      await box.getByRole('button', {name: starts(w.text)}).first().click();
      await box.getByRole('button', {name: starts(r.text)}).first().click();
    }
    console.log('  quiz end: respondidas', questions.length);
  },
  async MultiSelect(S, {questions}) {
    for (const q of questions) {
      const box = S.locator('[class*=question]').filter({hasText: plain(q.prompt).slice(0, 50)}).first();
      const cb = (o) => box.getByRole('checkbox', {name: starts(o.text)}).first();
      const wrong = [q.options.find((o) => !o.correct)], right = q.options.filter((o) => o.correct);
      for (const o of wrong) await cb(o).check();
      await box.getByRole('button', {name: 'Confirmar selección'}).click();
      console.log('  ms ERR:', await L.fb(box));
      for (const o of wrong) await cb(o).uncheck();
      for (const o of right) await cb(o).check();
      await box.getByRole('button', {name: 'Confirmar selección'}).click();
      console.log('  ms end:', await L.fb(box));
    }
  },
  async Match(S, {left, right}) {
    const text = (id) => plain(right.find((r) => r.id === id).text);
    const pick = async (l, rid) => {
      await S.getByRole('button', {name: starts(l.text)}).first().click();
      await S.getByRole('button', {name: text(rid), exact: true}).first().click();
    };
    await pick(left[0], left[1].id);
    console.log('  match ERR:', await L.fb(S));
    for (const l of left) await pick(l, l.id);
    console.log('  match end:', await L.fb(S));
  },
  async Order(S, {items, correctOrder}) {
    await L.solveOrder(S, correctOrder.map((id) => items.find((i) => i.id === id).code.trim()));
  },
  async FillBlank(S, {slots, bank}) {
    const answers = slots.map((s) => s.answer);
    const distractors = bank.filter((b) => !answers.includes(b));
    // Primer intento: dos distractores y el resto de los huecos con sus respuestas.
    const first = answers.map((a, i) => (i < 2 && distractors[i] ? distractors[i] : a));
    const chips = S.getByRole('group', {name: 'Fichas disponibles'}).first();
    const check = chips.locator('xpath=following-sibling::button[1]');
    for (const t of first) await chips.getByRole('button', {name: t, exact: true}).click();
    await check.click();
    console.log('  fb ERR:', await L.fb(S));
    const filled = S.getByRole('button', {name: /^Hueco completado/});
    while (await filled.count()) await filled.first().click();
    for (const t of answers) await chips.getByRole('button', {name: t, exact: true}).click();
    await check.click();
    console.log('  fb end:', await L.fb(S));
  },
  async CommandBuilder(S, {steps}) {
    const opt = (t) => S.getByRole('button', {name: new RegExp('^\\s*' + esc(t.trim()))}).first();
    for (const st of steps) {
      await opt(st.options.find((o) => o !== st.correct)).click();
      console.log('  cb ERR:', await L.fb(S));
      await opt(st.correct).click();
    }
    console.log('  cb end:', await L.fb(S));
  },
  async Terminal(S, {steps}) {
    await L.term(S, steps.map((s, i) => [i === 0 ? 'echo hola' : null, s.accepted[0]]));
  },
  async TypeAnswer(S, {accepted, placeholder}) {
    await L.typedIn(S, placeholder, ['respuesta incorrecta'], accepted[0]);
  },
  async SpotToken(S, {rounds}) {
    for (const r of rounds) {
      const toks = r.line.split(' ');
      const nth = toks.slice(0, r.targetIndex).filter((t) => t === toks[r.targetIndex]).length;
      const w = toks.find((t, i) => i !== r.targetIndex && t !== toks[r.targetIndex]);
      await S.getByRole('button', {name: w, exact: true}).first().click();
      console.log('  st ERR:', await L.fb(S));
      await S.getByRole('button', {name: toks[r.targetIndex], exact: true}).nth(nth).click();
    }
    console.log('  st end:', await L.fb(S));
  },
  async Classify(S, {items, columns}, p) {
    const col = (i) => columns[i].slice(0, 14);
    const first = items[0];
    await L.classify(p, [[plain(first.code).slice(0, 30), col((first.column + 1) % columns.length)]]);
    await L.classify(p, items.map((it) => [plain(it.code).slice(0, 30), col(it.column)]));
  },
  async FindInCode(S, {lines, ruleLabels, okLabel}) {
    const line = (l) => S.getByRole('button', {name: new RegExp('^\\d+\\s*' + esc(l.code.replace(/\s+/g, ' ').slice(0, 60)))}).first();
    const bad = lines.filter((l) => l.rule > 0);
    await line(bad[0]).click();
    await S.getByRole('button', {name: okLabel, exact: true}).first().click();
    console.log('  fic ERR:', await L.fb(S));
    for (const l of bad) {
      await line(l).click();
      await S.getByRole('button', {name: ruleLabels[l.rule - 1], exact: true}).first().click();
    }
    console.log('  fic end:', await L.fb(S));
  },
};

(async () => {
  const docs = process.argv.slice(2);
  const {b, p, errs} = await L.open();
  await p.setViewportSize({width: 1280, height: 2600});
  for (const doc of docs) {
    const acts = activities(doc);
    for (const a of acts) {
      console.log(doc.split('/').pop(), '·', a.type, '·', a.title);
      const S = await L.go(p, doc, a.title);
      await p.waitForTimeout(800);
      try {
        await solvers[a.type](S, a.props, p);
      } catch (e) {
        console.log('  FALLÓ:', e.message.split('\n').slice(0, 3).join(' | '));
      }
    }
    await p.goto('http://localhost:3100/AutomationKB/docs/' + doc);
    await p.getByRole('heading', {level: 1}).waitFor();
    await p.waitForTimeout(500);
    console.log('==', doc.split('/').pop(), 'completadas:', await p.getByText('· Completada').count(), 'de', acts.length);
  }
  console.log('ERRS', errs);
  await b.close();
})();
