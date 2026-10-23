/**
 * Parser mínimo de los archivos de contenido de las lecciones
 * (site/src/content/lessons/*.ts).
 *
 * Los archivos exportan tres formas de datos:
 *   - CodeLine[]      → {code, rule, why, hint?}
 *   - string[]        → los ruleLabels de una actividad
 *   - QuizQuestion[]  → {question, options: [{text, correct, why}]}
 *
 * No hace falta un parser de TypeScript completo: son literales de objeto
 * con campos conocidos, y alcanza con emparejar llaves respetando comillas
 * y escapes. Todos los offsets que devuelve son absolutos dentro del archivo,
 * para que el codemod pueda hacer cirugía de texto sin perder el formato.
 */

function matchBracket(src, start, open, close) {
  let depth = 0;
  let i = start;
  let quote = null;
  while (i < src.length) {
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
    if (ch === open) depth += 1;
    else if (ch === close) {
      depth -= 1;
      if (depth === 0) return i;
    }
    i += 1;
  }
  return -1;
}

/**
 * Divide un array literal en sus elementos.
 * Devuelve para cada elemento su texto y su rango absoluto, más el texto
 * que había entre elementos (`gapBefore`, que incluye la coma) para poder
 * re-ensamblar el array sin cambiar el formato del archivo.
 */
export function splitArrayItems(src, bodyStart, bodyEnd, offset = 0) {
  const items = [];
  let i = bodyStart;
  let depth = 0;
  let quote = null;
  let start = null;
  while (i < bodyEnd) {
    const ch = src[i];
    if (quote) {
      if (ch === '\\') {
        i += 2;
        continue;
      }
      if (ch === quote) {
        quote = null;
        if (depth === 0 && start !== null) {
          items.push({text: src.slice(start, i + 1), start: start + offset, end: i + 1 + offset});
          start = null;
        }
      }
      i += 1;
      continue;
    }
    if (ch === "'" || ch === '"' || ch === '`') {
      quote = ch;
      if (depth === 0) start = i;
      i += 1;
      continue;
    }
    if (ch === '{' || ch === '[' || ch === '(') {
      if (depth === 0) start = i;
      depth += 1;
      i += 1;
      continue;
    }
    if (ch === '}' || ch === ']' || ch === ')') {
      depth -= 1;
      if (depth === 0 && start !== null) {
        items.push({text: src.slice(start, i + 1), start: start + offset, end: i + 1 + offset});
        start = null;
      }
      i += 1;
      continue;
    }
    i += 1;
  }
  if (start !== null) {
    items.push({text: src.slice(start, bodyEnd), start: start + offset, end: bodyEnd + offset});
  }

  // texto entre elementos (incluye la coma) y texto sobrante al final
  let prevEnd = bodyStart;
  const gapBefore = items.map((it) => {
    const gap = src.slice(prevEnd, it.start);
    prevEnd = it.end;
    return gap;
  });
  const tail = src.slice(prevEnd, bodyEnd);

  return {items, gapBefore, tail};
}

function readString(text) {
  const m = text.match(/^\s*'((?:[^'\\]|\\.)*)'/s) || text.match(/^\s*"((?:[^"\\]|\\.)*)"/s);
  if (!m) return null;
  return m[1].replace(/\\'/g, "'").replace(/\\"/g, '"').replace(/\\n/g, '\n');
}

/** Lee un campo escalar (number | boolean | string) de un objeto literal. */
export function readField(objText, field) {
  const re = new RegExp(`(?:^|[,{\\s])${field}\\s*:\\s*`, 'g');
  const m = re.exec(objText);
  if (!m) return undefined;
  const i = m.index + m[0].length;
  const ch = objText[i];
  if (ch === "'" || ch === '"' || ch === '`') return readString(objText.slice(i));
  const rest = objText.slice(i);
  const num = rest.match(/^-?\d+(\.\d+)?/);
  if (num) return Number(num[0]);
  const bool = rest.match(/^(true|false)/);
  if (bool) return bool[1] === 'true';
  return undefined;
}

/** Rango absoluto del valor de un campo que es un array literal. */
export function readArrayFieldRange(src, objStart, objEnd, field) {
  const objText = src.slice(objStart, objEnd);
  const re = new RegExp(`(?:^|[,{\\s])${field}\\s*:\\s*\\[`, 'g');
  const m = re.exec(objText);
  if (!m) return null;
  const openIdx = objStart + objText.indexOf('[', m.index);
  const closeIdx = matchBracket(src, openIdx, '[', ']');
  if (closeIdx === -1) return null;
  return {open: openIdx, close: closeIdx, bodyStart: openIdx + 1, bodyEnd: closeIdx};
}

/** Extrae todas las exportaciones const array de un archivo TS. */
export function parseExports(src) {
  const exports = [];
  const re = /export\s+const\s+([A-Za-z0-9_]+)\s*(?::\s*[^=]+)?=\s*\[/g;
  let m;
  while ((m = re.exec(src))) {
    const name = m[1];
    const openIdx = m.index + m[0].length - 1;
    const closeIdx = matchBracket(src, openIdx, '[', ']');
    if (closeIdx === -1) continue;
    const typeMatch = src.slice(m.index, openIdx).match(/:\s*([A-Za-z0-9_]+)\[\]/);
    exports.push({
      name,
      type: typeMatch ? typeMatch[1] : null,
      open: openIdx,
      close: closeIdx,
      bodyStart: openIdx + 1,
      bodyEnd: closeIdx,
    });
  }
  return exports;
}

export function parseStringArray(src, exp) {
  return splitArrayItems(src, exp.bodyStart, exp.bodyEnd)
    .items.map((it) => readString(it.text))
    .filter((s) => s !== null);
}

export function parseCodeLines(src, exp) {
  return splitArrayItems(src, exp.bodyStart, exp.bodyEnd)
    .items.map((it) => {
      const o = it.text;
      const rule = readField(o, 'rule');
      const code = readField(o, 'code');
      const why = readField(o, 'why');
      const hint = readField(o, 'hint');
      if (rule === undefined) return null;
      return {code: code ?? '', rule, why: why ?? '', hint, raw: o};
    })
    .filter(Boolean);
}

export function parseQuiz(src, exp) {
  return splitArrayItems(src, exp.bodyStart, exp.bodyEnd)
    .items.map((it) => {
      const o = it.text;
      const question = readField(o, 'question');
      const range = readArrayFieldRange(src, it.start, it.end, 'options');
      if (!range) return null;
      const options = splitArrayItems(src, range.bodyStart, range.bodyEnd).items.map((oit) => {
        const ot = oit.text;
        return {
          text: readField(ot, 'text') ?? '',
          correct: readField(ot, 'correct') === true,
          why: readField(ot, 'why') ?? '',
          raw: ot,
          start: oit.start,
          end: oit.end,
        };
      });
      return {question: question ?? '', options, raw: o, start: it.start, end: it.end};
    })
    .filter(Boolean);
}
