import {useState, type ReactNode} from 'react';
import {playCorrect, playWrong} from '@site/src/lib/sound';
import InlineText from '@site/src/components/InlineText';
import styles from './styles.module.css';

export type TypeAnswerProps = {
  /** Respuestas aceptadas. Admiten `*` como comodín (ej. `git commit -m *`). */
  accepted: string[];
  /** Pistas progresivas: la primera se muestra tras el primer intento fallido, la segunda tras el segundo, etc. */
  hints: string[];
  explanation: string;
  placeholder?: string;
  /** Si ya estaba marcada como completada al cargar la página (localStorage) — evita el mensaje contradictorio "Completada" + campo vacío. */
  alreadyDone?: boolean;
  onSolved?: () => void;
};

function normalize(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, ' ');
}

function matches(value: string, pattern: string): boolean {
  const normValue = normalize(value);
  if (!pattern.includes('*')) return normValue === normalize(pattern);
  const re = new RegExp(
    '^' +
      normalize(pattern)
        .split('*')
        .map((chunk) => chunk.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
        .join('.+') +
      '$'
  );
  return re.test(normValue);
}

/** Respuesta corta escrita a mano, validada contra variantes aceptadas (sin compilar ni ejecutar nada). */
export default function TypeAnswer({accepted, hints, explanation, placeholder, alreadyDone, onSolved}: TypeAnswerProps): ReactNode {
  const [value, setValue] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [feedback, setFeedback] = useState<{kind: 'ok' | 'err'; text: ReactNode} | null>(null);
  const [solved, setSolved] = useState(false);

  function check(): void {
    if (!value.trim()) return;
    const ok = accepted.some((p) => matches(value, p));
    if (ok) {
      playCorrect();
      setFeedback({kind: 'ok', text: <InlineText text={explanation} />});
      setSolved(true);
      onSolved?.();
      return;
    }
    playWrong();
    const nextAttempts = attempts + 1;
    setAttempts(nextAttempts);
    const hint = hints[Math.min(nextAttempts - 1, hints.length - 1)] ?? 'Releé la situación y probá de nuevo.';
    setFeedback({kind: 'err', text: <InlineText text={hint} />});
  }

  return (
    <div>
      <div className={styles.row}>
        <input
          type="text"
          className={styles.input}
          value={value}
          placeholder={placeholder ?? 'Escribí tu respuesta…'}
          disabled={solved}
          onChange={(e) => {
            setValue(e.target.value);
            setFeedback(null);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') check();
          }}
          aria-label="Tu respuesta"
        />
        <button type="button" className="button button--primary" disabled={solved || !value.trim()} onClick={check}>
          Comprobar
        </button>
      </div>

      {alreadyDone && !solved && !value && (
        <div className={styles.counter}>Ya resolviste esta actividad antes — resolvela de nuevo si querés repasar.</div>
      )}

      {feedback && <div className={`akb-feedback akb-feedback--${feedback.kind}`}>{feedback.text}</div>}
    </div>
  );
}
