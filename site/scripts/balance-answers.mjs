/**
 * Codemod: reparte las respuestas correctas de la sección Foundations para
 * que el lector no pueda adivinarlas por posición.
 *
 * Qué hace:
 *   1. En cada quiz, elige una asignación de posiciones para las respuestas
 *      correctas que: (a) no repite la misma posición en todas las preguntas,
 *      (b) no sube ni baja en orden, (c) no alterna 1-2-1-2, y (d) mantiene
 *      una distribución global pareja entre las posiciones disponibles.
 *   2. En cada actividad FindInCode, reordena los RULE_LABELS y reescribe el
 *      campo `rule:` de cada línea, de modo que los problemas no aparezcan en
 *      orden 1→2→3→4.
 *
 * Es idempotente: los objetivos dependen solo de la estructura del quiz (no
 * del orden actual), así que correrlo dos veces deja el archivo igual.
 *
 * Uso: node scripts/balance-answers.mjs [--dry] [--verbose]
 */
import {readFileSync, writeFileSync, readdirSync} from 'node:fs';
import {join, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {parseExports, parseCodeLines, parseQuiz, parseStringArray, splitArrayItems} from './lib/parse-lessons.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const LESSONS_DIR = join(HERE, '..', 'src', 'content', 'lessons');
const dry = process.argv.includes('--dry');
const verbose = process.argv.includes('--verbose');

// ---------------------------------------------------------------- utilidades

function hashString(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** PRNG determinista (mulberry32). */
function rng(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function isAlternating(seq) {
  if (seq.length < 4) return false;
  for (let i = 2; i < seq.length; i++) {
    if (seq[i] !== seq[i % 2]) return false;
  }
  return true;
}

function isAscendingRun(rules) {
  const bad = rules.filter((r) => r !== 0);
  if (bad.length < 3) return false;
  let asc = true;
  let desc = true;
  for (let i = 1; i < bad.length; i++) {
    if (bad[i] <= bad[i - 1]) asc = false;
    if (bad[i] >= bad[i - 1]) desc = false;
  }
  return asc || desc;
}

/** Aplica reemplazos sobre rangos, de atrás hacia adelante. */
function applyEdits(src, edits) {
  const sorted = edits.slice().sort((a, b) => b.start - a.start);
  let out = src;
  for (const e of sorted) {
    out = out.slice(0, e.start) + e.text + out.slice(e.end);
  }
  return out;
}

/** Reensambla un array con los mismos items en otro orden, sin tocar el formato. */
function rebuildArray(src, range, orderedTexts) {
  const parts = splitArrayItems(src, range.bodyStart, range.bodyEnd);
  let body = '';
  orderedTexts.forEach((t, i) => {
    body += parts.gapBefore[Math.min(i, parts.gapBefore.length - 1)] + t.trim();
  });
  body += parts.tail;
  return body;
}

/** Rango del array `options` dentro de un objeto pregunta. */
function findOptionsArray(src, objStart, objEnd) {
  const objText = src.slice(objStart, objEnd);
  const m = /(?:^|[,{\s])options\s*:\s*\[/.exec(objText);
  if (!m) return null;
  const openIdx = objStart + objText.indexOf('[', m.index);
  let depth = 0;
  let quote = null;
  let i = openIdx;
  while (i < objEnd) {
    const ch = src[i];
    if (quote) {
      if (ch === '\\') {
        i += 2;
        continue;
      }
      if (ch === quote) quote = null;
      i += 1;
      continue;
    }
    if (ch === "'" || ch === '"' || ch === '`') {
      quote = ch;
      i += 1;
      continue;
    }
    if (ch === '[') depth += 1;
    else if (ch === ']') {
      depth -= 1;
      if (depth === 0) return {open: openIdx, close: i, bodyStart: openIdx + 1, bodyEnd: i};
    }
    i += 1;
  }
  return null;
}

// ------------------------------------------------ asignación de posiciones

/** Cuenta global de respuestas correctas por posición (para la distribución). */
const positionCounts = [0, 0, 0, 0];

/** ¿La secuencia de posiciones cumple las reglas anti-patrón del checker? */
function validSequence(seq, optionCounts) {
  const wide = seq.filter((_, i) => optionCounts[i] >= 3);
  const wideCounts = optionCounts.filter((n) => n >= 3);
  if (wide.length >= 3) {
    if (new Set(wide).size === 1) return false;
    if (isAlternating(wide)) return false;
    const asc = wide.every((p, i) => i === 0 || p >= wide[i - 1]);
    const desc = wide.every((p, i) => i === 0 || p <= wide[i - 1]);
    if (asc || desc) return false;
  }
  // aunque sea de 2 opciones, no todas en la misma posición
  if (seq.length >= 3 && new Set(seq).size === 1) return false;
  // y no alternar cuando hay 4+
  if (seq.length >= 4 && isAlternating(seq)) return false;
  return true;
}

/** Costo de balance global si se aplicara `seq` (menor = más parejo). */
function balanceCost(seq) {
  const next = positionCounts.slice();
  seq.forEach((p) => {
    next[p] = (next[p] ?? 0) + 1;
  });
  const total = next.reduce((a, b) => a + b, 0);
  return next.reduce((acc, n) => acc + Math.pow(n / total - 0.25, 2), 0);
}

/** Elige posiciones objetivo para un quiz completo. */
function chooseTargets(optionCounts, seed) {
  const rand = rng(seed);
  let best = null;
  let bestCost = Infinity;

  for (let attempt = 0; attempt < 400; attempt++) {
    const seq = optionCounts.map((n) => Math.floor(rand() * n));
    if (!validSequence(seq, optionCounts)) continue;
    const cost = balanceCost(seq);
    if (cost < bestCost) {
      bestCost = cost;
      best = seq;
    }
  }

  // fallback: si no hubo ninguna secuencia válida (quiz de 2 preguntas de 2
  // opciones, por ejemplo), se elige la de menor costo.
  if (!best) {
    for (let attempt = 0; attempt < 200; attempt++) {
      const seq = optionCounts.map((n) => Math.floor(rand() * n));
      const cost = balanceCost(seq);
      if (cost < bestCost) {
        bestCost = cost;
        best = seq;
      }
    }
  }

  best.forEach((p) => {
    positionCounts[p] = (positionCounts[p] ?? 0) + 1;
  });
  return best;
}

// ------------------------------------------------ actividad FindInCode

/**
 * Orden canónico de los labels. Depende solo de los textos de los labels y
 * del seed, nunca del orden actual: así el codemod es idempotente.
 * Devuelve la secuencia de labels a mostrar y, para cada texto, su posición
 * (1-indexada) en esa secuencia.
 */
function canonicalLabelOrder(labels, lineLabelTexts, seed) {
  const n = labels.length;
  const idxOf = new Map(labels.map((t, i) => [t, i]));
  const base = labels
    .map((t, i) => i)
    .sort((a, b) => hashString(seed + '::' + labels[a]) - hashString(seed + '::' + labels[b]) || a - b);

  const variants = [];
  for (let r = 0; r < n; r++) variants.push(base.slice(r).concat(base.slice(0, r)));
  variants.push([...base].reverse());

  let best = null;
  let bestScore = Infinity;
  for (const order of variants) {
    const posOf = new Array(n);
    order.forEach((labelIdx, j) => {
      posOf[labelIdx] = j + 1;
    });
    const newRules = lineLabelTexts.map((t) => {
      if (t === null) return 0;
      const idx = idxOf.get(t);
      return idx === undefined ? 0 : posOf[idx];
    });
    const bad = newRules.filter((r) => r !== 0);
    let score = 0;
    if (isAscendingRun(newRules)) score += 100;
    if (bad.length >= 2 && bad[0] === 1) score += 3;
    if (score < bestScore) {
      bestScore = score;
      best = order;
    }
  }

  if (bestScore >= 100) return null;
  const posOf = new Array(n);
  best.forEach((labelIdx, j) => {
    posOf[labelIdx] = j + 1;
  });
  return {order: best, posOf, idxOf};
}

// ------------------------------------------------ main

const files = readdirSync(LESSONS_DIR).filter((f) => f.endsWith('.ts')).sort();
let changedFiles = 0;

for (const file of files) {
  const path = join(LESSONS_DIR, file);
  const src = readFileSync(path, 'utf8');
  const exports = parseExports(src);
  const edits = [];

  // quizzes
  for (const exp of exports) {
    if (exp.type !== 'QuizQuestion') continue;
    const quiz = parseQuiz(src, exp);
    if (quiz.length === 0) continue;

    const optionCounts = quiz.map((q) => q.options.length);
    const targets = chooseTargets(optionCounts, hashString(`${file}::${exp.name}`));

    quiz.forEach((q, qi) => {
      const n = q.options.length;
      const correctIdx = q.options.findIndex((o) => o.correct);
      if (correctIdx === -1) return;
      const target = targets[qi];
      if (target === correctIdx) return;

      const others = q.options.filter((_, i) => i !== correctIdx);
      const newOrder = others.slice();
      newOrder.splice(target, 0, q.options[correctIdx]);

      const optionsRange = findOptionsArray(src, q.start, q.end);
      if (!optionsRange) return;
      edits.push({
        start: optionsRange.bodyStart,
        end: optionsRange.bodyEnd,
        text: rebuildArray(src, optionsRange, newOrder.map((o) => o.raw)),
      });
    });
  }

  // actividades FindInCode
  for (const lineExp of exports) {
    if (lineExp.type !== 'CodeLine') continue;
    const prefix = lineExp.name.replace(/_LINES$/, '');
    const labelExp = exports.find((e) => e.name === `${prefix}_RULE_LABELS`);
    if (!labelExp) continue;
    const labels = parseStringArray(src, labelExp);
    const lines = parseCodeLines(src, lineExp);
    if (labels.length < 2) continue;

    const currentRules = lines.map((l) => l.rule);
    const lineLabelTexts = currentRules.map((r) => (r === 0 ? null : labels[r - 1] ?? null));
    const plan = canonicalLabelOrder(labels, lineLabelTexts, hashString(file + '::' + lineExp.name));
    if (!plan) continue;

    const labelParts = splitArrayItems(src, labelExp.bodyStart, labelExp.bodyEnd);
    const orderedLabels = plan.order.map((i) => labelParts.items[i].text);
    edits.push({
      start: labelExp.bodyStart,
      end: labelExp.bodyEnd,
      text: rebuildArray(src, labelExp, orderedLabels),
    });

    const lineParts = splitArrayItems(src, lineExp.bodyStart, lineExp.bodyEnd);
    lineParts.items.forEach((item, i) => {
      const text = lineLabelTexts[i];
      const rule = currentRules[i] ?? 0;
      if (text === null) return;
      const labelIdx = plan.idxOf.get(text);
      if (labelIdx === undefined) return;
      const next = plan.posOf[labelIdx];
      if (next === rule) return;
      const m = /(\brule\s*:\s*)\d+/.exec(item.text);
      if (!m) return;
      edits.push({
        start: item.start + m.index,
        end: item.start + m.index + m[0].length,
        text: m[1] + next,
      });
    });
  }

  if (edits.length > 0) {
    const out = applyEdits(src, edits);
    if (out !== src) {
      changedFiles += 1;
      if (!dry) writeFileSync(path, out);
    }
  }
}

if (verbose) {
  const total = positionCounts.reduce((a, b) => a + b, 0);
  console.log('\nrespuestas correctas por posición (preguntas de 3+ opciones):');
  positionCounts.forEach((n, i) => {
    console.log(`  posición ${i + 1}: ${n} (${((n / total) * 100).toFixed(1)}%)`);
  });
}
console.log(`${dry ? '[dry] ' : ''}${changedFiles} archivo(s) reordenados.`);
