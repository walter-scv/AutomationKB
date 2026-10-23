/**
 * Verificador de las actividades de la sección Foundations.
 *
 * Busca tres cosas:
 *   1. Respuestas correctas en posiciones predecibles (siempre la misma,
 *      alternando 1-2-1-2, o subiendo 1-2-3-4 en cada actividad).
 *   2. Actividades sin distractores (todo o casi todo está mal).
 *   3. Distribución global sesgada de la posición correcta.
 *
 * Uso: node scripts/check-exercises.mjs [--verbose]
 */
import {readFileSync, readdirSync} from 'node:fs';
import {join, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {parseExports, parseCodeLines, parseQuiz, parseStringArray} from './lib/parse-lessons.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const LESSONS_DIR = join(HERE, '..', 'src', 'content', 'lessons');
const verbose = process.argv.includes('--verbose');

const problems = [];
const warnings = [];
const globalPositions = [];
const perLesson = [];

function isAlternating(seq) {
  if (seq.length < 4) return false;
  for (let i = 2; i < seq.length; i++) {
    if (seq[i] !== seq[i % 2]) return false;
  }
  return true;
}

function isAscendingRun(seq) {
  // la secuencia de reglas con problema, en el orden en que aparece
  const idx = seq.map((r, i) => (r === 0 ? -1 : i)).filter((i) => i !== -1);
  if (idx.length < 3) return false;
  const rules = idx.map((i) => seq[i]);
  let asc = true;
  let desc = true;
  for (let i = 1; i < rules.length; i++) {
    if (rules[i] <= rules[i - 1]) asc = false;
    if (rules[i] >= rules[i - 1]) desc = false;
  }
  return asc || desc;
}

const files = readdirSync(LESSONS_DIR).filter((f) => f.endsWith('.ts')).sort();

for (const file of files) {
  const src = readFileSync(join(LESSONS_DIR, file), 'utf8');
  const exports = parseExports(src);
  const lesson = {file, quizzes: [], activities: []};

  // --- actividades FindInCode: emparejar X_RULE_LABELS con X_LINES ---
  const labels = new Map();
  const linesArrays = [];
  for (const exp of exports) {
    if (exp.name.endsWith('_RULE_LABELS')) {
      labels.set(exp.name.replace(/_RULE_LABELS$/, ''), parseStringArray(src, exp));
    } else if (exp.type === 'CodeLine') {
      linesArrays.push({prefix: exp.name.replace(/_LINES$/, ''), name: exp.name, exp});
    }
  }
  for (const la of linesArrays) {
    const parsed = parseCodeLines(src, la.exp);
    const ruleLabels = labels.get(la.prefix) ?? [];
    const rules = parsed.map((l) => l.rule);
    const problemsCount = rules.filter((r) => r !== 0).length;
    const okCount = rules.length - problemsCount;
    const badRules = rules.filter((r) => r !== 0);

    lesson.activities.push({name: la.name, rules, ruleLabels});

    if (ruleLabels.length === 0) {
      problems.push(`${file} / ${la.name}: no encontré los ruleLabels (prefijo "${la.prefix}")`);
    }
    if (rules.some((r) => r > ruleLabels.length)) {
      problems.push(`${file} / ${la.name}: hay una regla ${Math.max(...rules)} pero solo hay ${ruleLabels.length} labels`);
    }
    if (problemsCount === 0) {
      problems.push(`${file} / ${la.name}: no hay ningún problema que encontrar`);
    }
    if (okCount === 0) {
      problems.push(`${file} / ${la.name}: no hay ninguna línea "está bien" (sin distractores)`);
    } else if (rules.length >= 6 && okCount / rules.length < 0.3) {
      problems.push(`${file} / ${la.name}: solo ${okCount}/${rules.length} líneas "está bien" — sin distractores suficientes`);
    }
    if (isAscendingRun(rules)) {
      problems.push(
        `${file} / ${la.name}: los problemas aparecen en orden ${badRules.join('→')} — se adivina sin leer (intercalalos)`
      );
    }
    if (new Set(badRules).size === 1 && badRules.length >= 3) {
      warnings.push(`${file} / ${la.name}: los ${badRules.length} problemas son de la misma regla`);
    }
    if (badRules.length >= 2 && ruleLabels.length >= 3) {
      const used = new Set(badRules);
      const unused = ruleLabels.length - used.size;
      if (unused === 0) {
        warnings.push(`${file} / ${la.name}: no queda ninguna regla sin usar (todos los labels aparecen como problema)`);
      }
    }
  }

  // --- quizzes ---
  for (const exp of exports) {
    if (exp.type === 'QuizQuestion') {
      const quiz = parseQuiz(src, exp);
      const positions = quiz.map((q) => q.options.findIndex((o) => o.correct));
      const counts = quiz.map((q) => q.options.length);
      lesson.quizzes.push({name: exp.name, positions, count: quiz.length});
      // la distribución global solo mira las preguntas con 3+ opciones: en una
      // pregunta de 2 opciones la respuesta correcta solo puede ir en 1 o 2.
      quiz.forEach((q, qi) => {
        if (q.options.length >= 3) globalPositions.push(positions[qi]);
      });

      quiz.forEach((q, qi) => {
        const n = q.options.length;
        const correct = q.options.filter((o) => o.correct).length;
        if (correct !== 1) {
          problems.push(`${file} / ${exp.name} pregunta ${qi + 1}: ${correct} opciones correctas (tiene que ser 1)`);
        }
        if (n < 3) {
          warnings.push(`${file} / ${exp.name} pregunta ${qi + 1}: solo ${n} opciones`);
        }
        const texts = q.options.map((o) => o.text);
        if (new Set(texts).size !== texts.length) {
          problems.push(`${file} / ${exp.name} pregunta ${qi + 1}: hay opciones con el mismo texto`);
        }
      });

      if (positions.length >= 3) {
        if (new Set(positions).size === 1) {
          problems.push(`${file} / ${exp.name}: la respuesta correcta está siempre en la posición ${positions[0] + 1}`);
        }
        // los patrones de alternancia / orden solo tienen sentido con 3+ opciones
        const wide = positions.filter((_, i) => counts[i] >= 3);
        if (wide.length >= 3) {
          if (isAlternating(wide)) {
            problems.push(`${file} / ${exp.name}: las respuestas se alternan ${wide.join(',')} — patrón predecible`);
          }
          const asc = wide.every((p, i) => i === 0 || p >= wide[i - 1]);
          const desc = wide.every((p, i) => i === 0 || p <= wide[i - 1]);
          if (asc || desc) {
            problems.push(`${file} / ${exp.name}: las posiciones ${wide.join(',')} van en orden — patrón predecible`);
          }
        }
      }
    }
  }

  perLesson.push(lesson);
}

// --- distribución global ---
const dist = {};
for (const p of globalPositions) dist[p] = (dist[p] ?? 0) + 1;
const total = globalPositions.length;

if (total > 0) {
  for (const [pos, n] of Object.entries(dist)) {
    const pct = (n / total) * 100;
    if (pct > 45) {
      problems.push(`distribución global: la posición ${Number(pos) + 1} concentra ${pct.toFixed(0)}% de las respuestas correctas`);
    }
    if (pct < 12 && total > 40) {
      problems.push(`distribución global: la posición ${Number(pos) + 1} solo aparece ${pct.toFixed(0)}% de las veces`);
    }
  }
}

if (verbose) {
  for (const lesson of perLesson) {
    console.log(`\n${lesson.file}`);
    for (const q of lesson.quizzes) {
      console.log(`  quiz ${q.name}: [${q.positions.map((p) => p + 1).join(', ')}]`);
    }
    for (const a of lesson.activities) {
      console.log(`  act ${a.name}: [${a.rules.join(', ')}] (${a.ruleLabels.length} labels)`);
    }
  }
}

console.log('\n--- distribución global de respuestas correctas ---');
for (const [pos, n] of Object.entries(dist).sort((a, b) => Number(a[0]) - Number(b[0]))) {
  const bar = '█'.repeat(Math.round((n / total) * 40));
  console.log(`  posición ${Number(pos) + 1}: ${String(n).padStart(3)} (${((n / total) * 100).toFixed(1)}%) ${bar}`);
}
console.log(`  total: ${total} preguntas`);

if (warnings.length) {
  console.log('\n--- avisos ---');
  warnings.forEach((w) => console.log(`  ! ${w}`));
}

if (problems.length) {
  console.log('\n--- problemas ---');
  problems.forEach((p) => console.log(`  x ${p}`));
  console.log(`\n${problems.length} problema(s).`);
  process.exit(1);
} else {
  console.log('\nOK: sin patrones predecibles.');
}
