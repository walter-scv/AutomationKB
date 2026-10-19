import {useEffect, useState, type ReactNode} from 'react';
import {highlightTs} from '@site/src/lib/highlightTs';
import styles from './styles.module.css';

export type CodeLine = {
  code: string;
  /** 0 = la línea está bien; 1..N = qué regla rompe. */
  rule: number;
  /** Explicación completa — se revela al clasificar bien, o al confirmar que está bien. */
  why: string;
  /** Pista específica de ESTA línea, mostrada solo si se la clasifica mal (rule > 0). */
  hint?: string;
};

export type FindInCodeProps = {
  lines: CodeLine[];
  /** Un label por regla, en orden (rule 1 = ruleLabels[0], etc.). "Está bien" se agrega solo. */
  ruleLabels: string[];
  /** Si ya estaba marcada como completada al cargar la página (localStorage) — evita el mensaje contradictorio "Completada" + "0 de N". */
  alreadyDone?: boolean;
  onSolved?: () => void;
};

type Feedback = {kind: 'ok' | 'err' | 'warn'; text: string};

export default function FindInCode({lines, ruleLabels, alreadyDone, onSolved}: FindInCodeProps): ReactNode {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [current, setCurrent] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  const totalProblems = lines.filter((l) => l.rule !== 0).length;
  const foundCount = Object.entries(answers).filter(
    ([i, r]) => lines[Number(i)].rule !== 0 && r === lines[Number(i)].rule
  ).length;

  useEffect(() => {
    if (totalProblems > 0 && foundCount === totalProblems) {
      onSolved?.();
    }
    // Solo nos importa reaccionar cuando cambia foundCount, no en cada render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [foundCount]);

  function selectLine(i: number): void {
    if (answers[i] !== undefined) {
      const l = lines[i];
      setFeedback({kind: l.rule ? 'ok' : 'warn', text: `Línea ${i + 1}: ${l.why}`});
      setCurrent(null);
      return;
    }
    setCurrent(i);
    setFeedback(null);
  }

  function classify(choice: number): void {
    if (current === null) return;
    const i = current;
    const l = lines[i];

    if (choice === l.rule) {
      setAnswers((prev) => ({...prev, [i]: choice}));
      setFeedback({kind: 'ok', text: `Línea ${i + 1}: correcto${l.rule ? '' : ', está bien'}. ${l.why}`});
      setCurrent(null);
      return;
    }

    if (l.rule === 0) {
      // La línea está bien, el lector marcó cualquier regla: igual se da por resuelta.
      setAnswers((prev) => ({...prev, [i]: 0}));
      setFeedback({kind: 'warn', text: `Línea ${i + 1}: en realidad está bien. ${l.why}`});
      setCurrent(null);
      return;
    }

    // Línea con problema real, clasificada con la regla equivocada: pista, sin spoiler, se puede reintentar.
    setFeedback({
      kind: 'err',
      text:
        (choice === 0
          ? 'Mirá de nuevo: esta línea sí rompe una regla. '
          : `No es "${ruleLabels[choice - 1]}". `) + (l.hint ?? ''),
    });
  }

  return (
    <div>
      <div className={styles.lines}>
        {lines.map((l, i) => {
          const classes = [styles.line];
          if (answers[i] !== undefined) classes.push(answers[i] ? styles.hit : styles.cleared);
          else if (i === current) classes.push(styles.currentLine);
          return (
            <button key={i} type="button" className={classes.join(' ')} onClick={() => selectLine(i)}>
              <span className={styles.ln}>{i + 1}</span>
              {highlightTs(l.code)}
            </button>
          );
        })}
      </div>

      {current !== null && (
        <div className={styles.classify}>
          <strong>Línea {current + 1}: ¿rompe alguna regla?</strong>
          <div className={styles.clLine}>{highlightTs(lines[current].code.trim())}</div>
          <div className={styles.choices}>
            {ruleLabels.map((label, idx) => (
              <button key={idx + 1} type="button" onClick={() => classify(idx + 1)}>
                {label}
              </button>
            ))}
            <button type="button" onClick={() => classify(0)}>
              Está bien
            </button>
          </div>
        </div>
      )}

      <div className={styles.counter}>
        {alreadyDone && foundCount === 0
          ? 'Ya resolviste esta actividad antes — resolvela de nuevo si querés repasar.'
          : `${foundCount} de ${totalProblems} problemas encontrados`}
      </div>

      {feedback && <div className={`akb-feedback akb-feedback--${feedback.kind}`}>{feedback.text}</div>}
    </div>
  );
}
