import {useState, type ReactNode} from 'react';
import {playCorrect, playTick, playWrong} from '@site/src/lib/sound';
import InlineText from '@site/src/components/InlineText';
import styles from './styles.module.css';

export type BuilderStep = {
  /** Fragmentos para elegir en esta posición — incluye el correcto y distractores. */
  options: string[];
  correct: string;
  /** Pista si se elige mal en este paso — no nombra la opción correcta. */
  hint: string;
};

export type CommandBuilderProps = {
  /** Texto fijo antes del primer fragmento elegible (ej. "git "). */
  prefix?: string;
  steps: BuilderStep[];
  explanation: string;
  /** Si ya estaba marcada como completada al cargar la página (localStorage) — evita el mensaje contradictorio "Completada" + comando vacío. */
  alreadyDone?: boolean;
  onSolved?: () => void;
};

/** Armar un comando fragmento a fragmento — cada paso revela el siguiente recién al acertar. */
export default function CommandBuilder({prefix = '', steps, explanation, alreadyDone, onSolved}: CommandBuilderProps): ReactNode {
  const [chosen, setChosen] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<{kind: 'ok' | 'err'; text: ReactNode} | null>(null);
  const stepIndex = chosen.length;
  const done = stepIndex === steps.length;

  function pick(option: string): void {
    const step = steps[stepIndex];
    if (option === step.correct) {
      playTick();
      const next = [...chosen, option];
      setChosen(next);
      setFeedback(null);
      if (next.length === steps.length) {
        playCorrect();
        setFeedback({kind: 'ok', text: <InlineText text={explanation} />});
        onSolved?.();
      }
      return;
    }
    playWrong();
    setFeedback({kind: 'err', text: <InlineText text={step.hint} />});
  }

  function reset(): void {
    setChosen([]);
    setFeedback(null);
  }

  return (
    <div>
      <div className={styles.line}>
        <span className={styles.prefix}>{prefix}</span>
        {chosen.map((c, i) => (
          <span key={i} className={styles.piece}>
            {c}
          </span>
        ))}
        {!done && <span className={styles.cursor}>▌</span>}
      </div>

      {!done && (
        <div className={styles.options}>
          {steps[stepIndex].options.map((opt, i) => (
            <button key={i} type="button" className={styles.option} onClick={() => pick(opt)}>
              {opt}
            </button>
          ))}
        </div>
      )}

      {done && (
        <button type="button" className={styles.reset} onClick={reset}>
          Armar de nuevo
        </button>
      )}

      {alreadyDone && !done && stepIndex === 0 && (
        <div className={styles.counter}>Ya resolviste esta actividad antes — resolvela de nuevo si querés repasar.</div>
      )}

      {feedback && <div className={`akb-feedback akb-feedback--${feedback.kind}`}>{feedback.text}</div>}
    </div>
  );
}
