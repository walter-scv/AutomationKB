import {useEffect, useState, type ReactNode} from 'react';
import {playCorrect, playWrong} from '@site/src/lib/sound';
import InlineText from '@site/src/components/InlineText';
import styles from './styles.module.css';

export type QuizOption = {text: string; correct: boolean; why: string};
export type QuizQuestion = {question: string; options: QuizOption[]};
export type QuizProps = {questions: QuizQuestion[]; onSolved?: () => void};

/** Opción múltiple con explicación por opción. No bloquea reintentar otras opciones. */
export default function Quiz({questions, onSolved}: QuizProps): ReactNode {
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const [solved, setSolved] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (questions.length > 0 && solved.size === questions.length) {
      onSolved?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [solved]);

  function pick(qIndex: number, oIndex: number, correct: boolean): void {
    setRevealed((prev) => ({...prev, [`${qIndex}-${oIndex}`]: true}));
    if (!correct) {
      playWrong();
      return;
    }
    playCorrect();
    setSolved((prev) => {
      if (prev.has(qIndex)) return prev;
      const next = new Set(prev);
      next.add(qIndex);
      return next;
    });
  }

  return (
    <div>
      {questions.map((q, qi) => (
        <div key={qi} className={styles.question}>
          <p className={styles.questionText}>
            <InlineText text={q.question} />
          </p>
          <div className={styles.options}>
            {q.options.map((o, oi) => {
              const isRevealed = revealed[`${qi}-${oi}`];
              const cls = [styles.option];
              if (isRevealed) cls.push(o.correct ? styles.right : styles.wrong);
              return (
                <button key={oi} type="button" className={cls.join(' ')} onClick={() => pick(qi, oi, o.correct)}>
                  <InlineText text={o.text} />
                  {isRevealed && (
                    <span className={styles.why}>
                      <InlineText text={o.why} />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
