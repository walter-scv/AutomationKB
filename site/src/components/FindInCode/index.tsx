import {useEffect, useState, type ReactNode} from 'react';
import {highlightTs} from '@site/src/lib/highlightTs';
import {playCorrect, playTick, playWrong} from '@site/src/lib/sound';
import InlineText from '@site/src/components/InlineText';
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
  /** Un label por regla, en orden (rule 1 = ruleLabels[0], etc.). La categoría "sin problema" se agrega solo. */
  ruleLabels: string[];
  /** Texto del botón para las líneas sin problema. Por defecto, "Está bien". */
  okLabel?: string;
  /** Pregunta que se muestra al elegir una línea. Por defecto, "¿rompe alguna regla?". */
  prompt?: string;
  /** Unidad del contador. Por defecto, "problemas encontrados". */
  counterLabel?: string;
  /** Cómo se nombra cada ítem en la consigna y el feedback. Por defecto, "Línea". */
  itemLabel?: string;
  /** Si ya estaba marcada como completada al cargar la página (localStorage) — evita el mensaje contradictorio "Completada" + "0 de N". */
  alreadyDone?: boolean;
  onSolved?: () => void;
};

type Feedback = {kind: 'ok' | 'err' | 'warn'; text: ReactNode};

export default function FindInCode({
  lines,
  ruleLabels,
  okLabel = 'Está bien',
  prompt = '¿rompe alguna regla?',
  counterLabel = 'problemas encontrados',
  itemLabel = 'Línea',
  alreadyDone,
  onSolved,
}: FindInCodeProps): ReactNode {
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
      setFeedback({
        kind: l.rule ? 'ok' : 'warn',
        text: (
          <>
            {itemLabel} {i + 1}: <InlineText text={l.why} />
          </>
        ),
      });
      setCurrent(null);
      return;
    }
    setCurrent(i);
    playTick();
    setFeedback(null);
  }

  function classify(choice: number): void {
    if (current === null) return;
    const i = current;
    const l = lines[i];

    if (choice === l.rule) {
      playCorrect();
      setAnswers((prev) => ({...prev, [i]: choice}));
      setFeedback({
        kind: 'ok',
        text: (
          <>
            {itemLabel} {i + 1}: correcto{l.rule ? '' : `: ${okLabel}`}. <InlineText text={l.why} />
          </>
        ),
      });
      setCurrent(null);
      return;
    }

    if (l.rule === 0) {
      // La línea no tiene problema: se avisa y se deja reintentar. No se marca
      // como resuelta, para que el lector pueda corregir su clasificación.
      playWrong();
      setFeedback({
        kind: 'err',
        text: (
          <>
            {itemLabel} {i + 1}: esa no es la clasificación correcta. <InlineText text={l.why} />
          </>
        ),
      });
      return;
    }

    // Línea con problema real, clasificada con la regla equivocada: pista, sin spoiler, se puede reintentar.
    playWrong();
    setFeedback({
      kind: 'err',
      text: (
        <>
          {choice === 0 ? (
            okLabel === 'Está bien'
              ? 'Mirá de nuevo: esta línea sí tiene un problema. '
              : 'Mirá de nuevo: esa no es la clasificación correcta. '
          ) : (
            <>
              No es "<InlineText text={ruleLabels[choice - 1]} />".{' '}
            </>
          )}
          <InlineText text={l.hint ?? ''} />
        </>
      ),
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
          <strong>
            {itemLabel} {current + 1}: <InlineText text={prompt} />
          </strong>
          <div className={styles.clLine}>{highlightTs(lines[current].code.trim())}</div>
          <div className={styles.choices}>
            {ruleLabels.map((label, idx) => (
              <button key={idx + 1} type="button" onClick={() => classify(idx + 1)}>
                <InlineText text={label} />
              </button>
            ))}
            <button type="button" onClick={() => classify(0)}>
              <InlineText text={okLabel} />
            </button>
          </div>
        </div>
      )}

      <div className={styles.counter}>
        {alreadyDone && foundCount === 0
          ? 'Ya resolviste esta actividad antes — resolvela de nuevo si querés repasar.'
          : `${foundCount} de ${totalProblems} ${counterLabel}`}
      </div>

      {feedback && <div className={`akb-feedback akb-feedback--${feedback.kind}`}>{feedback.text}</div>}
    </div>
  );
}
