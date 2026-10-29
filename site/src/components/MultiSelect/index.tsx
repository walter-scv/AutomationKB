import {useEffect, useState, type ReactNode} from 'react';
import {playCorrect, playWrong} from '@site/src/lib/sound';
import InlineText from '@site/src/components/InlineText';
import styles from './styles.module.css';

export type MultiSelectOption = {text: string; correct: boolean; why: string};
export type MultiSelectQuestion = {prompt: string; options: MultiSelectOption[]};
export type MultiSelectProps = {
  questions: MultiSelectQuestion[];
  /** Si ya estaba marcada como completada al cargar la página (localStorage) — evita el mensaje contradictorio "Completada" + opciones sin marcar. */
  alreadyDone?: boolean;
  onSolved?: () => void;
};

/** "Marcá todas las que correspondan" — el conjunto elegido tiene que coincidir exacto, no una por una. */
export default function MultiSelect({questions, alreadyDone, onSolved}: MultiSelectProps): ReactNode {
  const [selected, setSelected] = useState<Record<number, Set<number>>>({});
  const [solved, setSolved] = useState<Set<number>>(new Set());
  const [feedback, setFeedback] = useState<Record<number, {kind: 'ok' | 'err'; text: ReactNode}>>({});

  useEffect(() => {
    if (questions.length > 0 && solved.size === questions.length) {
      onSolved?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [solved]);

  function toggle(qi: number, oi: number): void {
    if (solved.has(qi)) return;
    setSelected((prev) => {
      const cur = new Set(prev[qi] ?? []);
      if (cur.has(oi)) cur.delete(oi);
      else cur.add(oi);
      return {...prev, [qi]: cur};
    });
    setFeedback((prev) => ({...prev, [qi]: undefined as unknown as {kind: 'ok' | 'err'; text: ReactNode}}));
  }

  function submit(qi: number): void {
    const q = questions[qi];
    const chosen = selected[qi] ?? new Set<number>();
    const correctSet = new Set(q.options.map((o, i) => (o.correct ? i : -1)).filter((i) => i >= 0));
    const matches = chosen.size === correctSet.size && [...chosen].every((i) => correctSet.has(i));

    if (matches) {
      playCorrect();
      setSolved((prev) => {
        const next = new Set(prev);
        next.add(qi);
        return next;
      });
      setFeedback((prev) => ({...prev, [qi]: {kind: 'ok', text: 'Exacto — es ese conjunto.'}}));
    } else {
      playWrong();
      setFeedback((prev) => ({
        ...prev,
        [qi]: {kind: 'err', text: 'Ese no es el conjunto exacto: falta marcar alguna, o sobra alguna marcada. Revisá cada opción de nuevo.'},
      }));
    }
  }

  return (
    <div>
      {questions.map((q, qi) => {
        const isSolved = solved.has(qi);
        const chosen = selected[qi] ?? new Set<number>();
        return (
          <div key={qi} className={styles.question}>
            <p className={styles.prompt}>
              <InlineText text={q.prompt} />
            </p>
            <div className={styles.options}>
              {q.options.map((o, oi) => {
                const isChecked = chosen.has(oi);
                const cls = [styles.option];
                if (isChecked) cls.push(styles.checked);
                if (isSolved) cls.push(o.correct ? styles.right : styles.neutral);
                return (
                  <label key={oi} className={cls.join(' ')}>
                    <input
                      type="checkbox"
                      checked={isChecked}
                      disabled={isSolved}
                      onChange={() => toggle(qi, oi)}
                    />
                    <span>
                      <InlineText text={o.text} />
                      {isSolved && (
                        <span className={styles.why}>
                          <InlineText text={o.why} />
                        </span>
                      )}
                    </span>
                  </label>
                );
              })}
            </div>
            {alreadyDone && !isSolved && chosen.size === 0 && (
              <div className={styles.counter}>Ya resolviste esta actividad antes — resolvela de nuevo si querés repasar.</div>
            )}
            {!isSolved && (
              <button type="button" className="button button--primary" disabled={chosen.size === 0} onClick={() => submit(qi)}>
                Confirmar selección
              </button>
            )}
            {feedback[qi] && <div className={`akb-feedback akb-feedback--${feedback[qi].kind}`}>{feedback[qi].text}</div>}
          </div>
        );
      })}
    </div>
  );
}
