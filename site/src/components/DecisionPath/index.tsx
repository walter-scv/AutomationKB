import {useState, type ReactNode} from 'react';
import {playCorrect, playTick, playWrong} from '@site/src/lib/sound';
import InlineText from '@site/src/components/InlineText';
import styles from './styles.module.css';

export type DecisionOption = {
  text: string;
  /** Si lleva por el camino correcto (el único que termina resolviendo la actividad). */
  correct: boolean;
  why: string;
  /** Próximo nodo si `correct` y hay uno — si no hay, esta opción termina el camino. */
  next?: string;
};

export type DecisionNode = {
  id: string;
  situation: string;
  options: DecisionOption[];
};

export type DecisionPathProps = {
  startId: string;
  nodes: Record<string, DecisionNode>;
  /** Explicación final, al llegar al cierre del camino correcto. */
  explanation: string;
  /** Si ya estaba marcada como completada al cargar la página (localStorage) — evita el mensaje contradictorio "Completada" + camino sin recorrer. */
  alreadyDone?: boolean;
  onSolved?: () => void;
};

/** Escenario encadenado: cada decisión lleva a la siguiente situación, hasta un cierre. */
export default function DecisionPath({startId, nodes, explanation, alreadyDone, onSolved}: DecisionPathProps): ReactNode {
  const [trail, setTrail] = useState<string[]>([startId]);
  const [feedback, setFeedback] = useState<{kind: 'ok' | 'err'; text: ReactNode} | null>(null);
  const [finished, setFinished] = useState(false);

  const currentId = trail[trail.length - 1];
  const node = nodes[currentId];

  function choose(opt: DecisionOption): void {
    if (!opt.correct) {
      playWrong();
      setFeedback({kind: 'err', text: <InlineText text={opt.why} />});
      return;
    }
    if (opt.next) {
      playTick();
      setFeedback({kind: 'ok', text: <InlineText text={opt.why} />});
      setTrail((prev) => [...prev, opt.next!]);
    } else {
      playCorrect();
      setFeedback({kind: 'ok', text: <InlineText text={explanation} />});
      setFinished(true);
      onSolved?.();
    }
  }

  function restart(): void {
    setTrail([startId]);
    setFeedback(null);
    setFinished(false);
  }

  return (
    <div>
      <ol className={styles.trail}>
        {trail.map((id, i) => (
          <li key={i} className={i === trail.length - 1 && !finished ? styles.trailCurrent : styles.trailDone}>
            <InlineText text={nodes[id].situation} />
          </li>
        ))}
      </ol>

      {!finished && (
        <div className={styles.options}>
          {node.options.map((opt, i) => (
            <button key={i} type="button" className={styles.option} onClick={() => choose(opt)}>
              <InlineText text={opt.text} />
            </button>
          ))}
        </div>
      )}

      {finished && (
        <button type="button" className={styles.reset} onClick={restart}>
          Recorrer otro camino
        </button>
      )}

      {alreadyDone && !finished && trail.length === 1 && (
        <div className={styles.counter}>Ya resolviste esta actividad antes — resolvela de nuevo si querés repasar.</div>
      )}

      {feedback && <div className={`akb-feedback akb-feedback--${feedback.kind}`}>{feedback.text}</div>}
    </div>
  );
}
