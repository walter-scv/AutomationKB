import {useEffect, useState, type ReactNode} from 'react';
import {playCorrect, playWrong} from '@site/src/lib/sound';
import InlineText from '@site/src/components/InlineText';
import styles from './styles.module.css';

export type SpotTokenRound = {
  line: string;
  /** Índice (0-based) de la palabra buscada, contando solo palabras — no espacios. */
  targetIndex: number;
  why: string;
  hint: string;
};

export type SpotTokenProps = {
  rounds: SpotTokenRound[];
  /** Qué se busca en cada línea — igual para todas las rondas. */
  prompt: string;
  itemLabel?: string;
  /** Si ya estaba marcada como completada al cargar la página (localStorage) — evita el mensaje contradictorio "Completada" + "0 de N". */
  alreadyDone?: boolean;
  onSolved?: () => void;
};

type Piece = {text: string; tokenIndex: number | null};

function tokenize(line: string): Piece[] {
  let tokenIndex = 0;
  return line.split(/(\s+)/).map((text) => {
    if (/^\s*$/.test(text)) return {text, tokenIndex: null};
    return {text, tokenIndex: tokenIndex++};
  });
}

/** Señalar la palabra exacta dentro de una línea — más fino que elegir la línea entera. */
export default function SpotToken({rounds, prompt, itemLabel = 'Ronda', alreadyDone, onSolved}: SpotTokenProps): ReactNode {
  const [solved, setSolved] = useState<Set<number>>(new Set());
  const [feedback, setFeedback] = useState<Record<number, {kind: 'ok' | 'err'; text: ReactNode}>>({});
  const [wrongToken, setWrongToken] = useState<Record<number, number>>({});

  useEffect(() => {
    if (rounds.length > 0 && solved.size === rounds.length) {
      onSolved?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [solved]);

  function click(ri: number, tokenIndex: number): void {
    if (solved.has(ri)) return;
    const round = rounds[ri];
    if (tokenIndex === round.targetIndex) {
      playCorrect();
      setSolved((prev) => {
        const next = new Set(prev);
        next.add(ri);
        return next;
      });
      setFeedback((prev) => ({...prev, [ri]: {kind: 'ok', text: <InlineText text={round.why} />}}));
    } else {
      playWrong();
      setWrongToken((prev) => ({...prev, [ri]: tokenIndex}));
      setFeedback((prev) => ({...prev, [ri]: {kind: 'err', text: <InlineText text={round.hint} />}}));
    }
  }

  return (
    <div>
      <p className={styles.prompt}>{prompt}</p>
      {rounds.map((round, ri) => {
        const pieces = tokenize(round.line);
        const isSolved = solved.has(ri);
        return (
          <div key={ri} className={styles.round}>
            <div className={styles.label}>
              {itemLabel} {ri + 1}
            </div>
            <div className={styles.line}>
              {pieces.map((p, pi) =>
                p.tokenIndex === null ? (
                  <span key={pi}>{p.text}</span>
                ) : (
                  <button
                    key={pi}
                    type="button"
                    className={[
                      styles.token,
                      isSolved && p.tokenIndex === round.targetIndex ? styles.ok : '',
                      !isSolved && wrongToken[ri] === p.tokenIndex ? styles.bad : '',
                    ]
                      .join(' ')
                      .trim()}
                    disabled={isSolved}
                    onClick={() => click(ri, p.tokenIndex!)}
                  >
                    {p.text}
                  </button>
                )
              )}
            </div>
            {feedback[ri] && <div className={`akb-feedback akb-feedback--${feedback[ri].kind}`}>{feedback[ri].text}</div>}
          </div>
        );
      })}
      <div className={styles.counter}>
        {alreadyDone && solved.size === 0
          ? 'Ya resolviste esta actividad antes — resolvela de nuevo si querés repasar.'
          : `${solved.size} de ${rounds.length} resueltas`}
      </div>
    </div>
  );
}
