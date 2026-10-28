import {useState, type ReactNode} from 'react';
import {playCorrect, playTick, playWrong} from '@site/src/lib/sound';
import InlineText from '@site/src/components/InlineText';
import styles from './styles.module.css';

export type TerminalStep = {
  /** Qué hay que lograr en este paso — se muestra como comentario antes del prompt. */
  instruction: string;
  /** Comandos aceptados. Admiten `*` como comodín. */
  accepted: string[];
  /** Salida simulada que se "imprime" al acertar. */
  output: string;
  hint: string;
};

export type TerminalProps = {
  steps: TerminalStep[];
  explanation: string;
  /** Si ya estaba marcada como completada al cargar la página (localStorage) — evita el mensaje contradictorio "Completada" + terminal vacía. */
  alreadyDone?: boolean;
  onSolved?: () => void;
  /** Símbolo del prompt: `$` para una shell (default), `>` para una consola de JavaScript. */
  promptSymbol?: string;
  /** Prefijo de las instrucciones: `#` en una shell (default), `//` en una consola de JavaScript. */
  commentPrefix?: string;
};

function normalize(s: string): string {
  return s.trim().replace(/\s+/g, ' ');
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

type HistoryEntry = {instruction: string; command: string; output: string};

/** Terminal simulada: se escribe un comando real por paso y se valida antes de pasar al siguiente. */
export default function Terminal({steps, explanation, alreadyDone, onSolved, promptSymbol = '$', commentPrefix = '#'}: TerminalProps): ReactNode {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [value, setValue] = useState('');
  const [error, setError] = useState<string | null>(null);
  const stepIndex = history.length;
  const done = stepIndex === steps.length;

  function run(): void {
    if (!value.trim() || done) return;
    const step = steps[stepIndex];
    if (step.accepted.some((p) => matches(value, p))) {
      playTick();
      const nextHistory = [...history, {instruction: step.instruction, command: value, output: step.output}];
      setHistory(nextHistory);
      setValue('');
      setError(null);
      if (nextHistory.length === steps.length) {
        playCorrect();
        onSolved?.();
      }
      return;
    }
    playWrong();
    setError(step.hint);
  }

  return (
    <div className={styles.term}>
      <div className={styles.titlebar}>
        <span className={styles.dot} />
        <span className={styles.dot} />
        <span className={styles.dot} />
      </div>
      <div className={styles.body}>
        {alreadyDone && stepIndex === 0 && !value && (
          <div className={styles.comment}>{commentPrefix} Ya resolviste esta actividad antes — resolvela de nuevo si querés repasar.</div>
        )}
        {history.map((h, i) => (
          <div key={i} className={styles.entry}>
            <div className={styles.comment}>{commentPrefix} {h.instruction}</div>
            <div className={styles.cmdLine}>
              <span className={styles.prompt}>{promptSymbol}</span> {h.command}
            </div>
            <div className={styles.output}>{h.output}</div>
          </div>
        ))}

        {!done && (
          <div className={styles.entry}>
            <div className={styles.comment}>{commentPrefix} {steps[stepIndex].instruction}</div>
            <div className={styles.cmdLine}>
              <span className={styles.prompt}>{promptSymbol}</span>
              <input
                className={styles.input}
                value={value}
                onChange={(e) => {
                  setValue(e.target.value);
                  setError(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') run();
                }}
                autoComplete="off"
                autoCapitalize="off"
                spellCheck={false}
                aria-label={`Comando para el paso ${stepIndex + 1}`}
              />
            </div>
            {error && <div className={styles.errorLine}><InlineText text={error} /></div>}
          </div>
        )}

        {done && (
          <div className={styles.entry}>
            <div className={styles.doneMsg}>
              <InlineText text={explanation} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
