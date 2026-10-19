import type {ReactNode} from 'react';

// Resaltado de sintaxis chico y propio (no Prism): necesitamos resaltar
// LÍNEAS SUELTAS dentro de botones clickeables (FindInCode, Order), algo
// que la API por-bloque de Prism no hace cómodo. Portado de la demo.
const KEYWORDS = new Set([
  'const', 'let', 'await', 'async', 'new', 'return', 'import', 'from',
  'export', 'class', 'readonly', 'if', 'else', 'true', 'false',
]);

const TOKEN_RE =
  /(\/\/.*)|('(?:[^'\\]|\\.)*'?|"(?:[^"\\]|\\.)*"?|`(?:[^`\\]|\\.)*`?)|(\b\d+(?:\.\d+)?\b)|([A-Za-z_$][\w$]*)/g;

export function highlightTs(line: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  let key = 0;
  TOKEN_RE.lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = TOKEN_RE.exec(line))) {
    if (match.index > lastIndex) {
      nodes.push(line.slice(lastIndex, match.index));
    }
    const token = match[0];

    if (match[1]) {
      nodes.push(
        <span key={key++} style={{color: 'var(--akb-t-com)', fontStyle: 'italic'}}>
          {token}
        </span>
      );
    } else if (match[2]) {
      nodes.push(
        <span key={key++} style={{color: 'var(--akb-t-str)'}}>
          {token}
        </span>
      );
    } else if (match[3]) {
      nodes.push(
        <span key={key++} style={{color: 'var(--akb-t-num)'}}>
          {token}
        </span>
      );
    } else if (match[4]) {
      if (KEYWORDS.has(token)) {
        nodes.push(
          <span key={key++} style={{color: 'var(--akb-t-kw)'}}>
            {token}
          </span>
        );
      } else if (/^\s*\(/.test(line.slice(TOKEN_RE.lastIndex))) {
        nodes.push(
          <span key={key++} style={{color: 'var(--akb-t-fn)'}}>
            {token}
          </span>
        );
      } else if (/^[A-Z]/.test(token)) {
        nodes.push(
          <span key={key++} style={{color: 'var(--akb-t-type)'}}>
            {token}
          </span>
        );
      } else {
        nodes.push(token);
      }
    }
    lastIndex = TOKEN_RE.lastIndex;
  }
  if (lastIndex < line.length) nodes.push(line.slice(lastIndex));
  return nodes;
}
