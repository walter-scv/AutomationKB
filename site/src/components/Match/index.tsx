import {useState, type ReactNode} from 'react';
import {playCorrect, playTick, playWrong} from '@site/src/lib/sound';
import InlineText from '@site/src/components/InlineText';
import styles from './styles.module.css';

export type MatchItem = {id: string; text: string};

export type MatchProps = {
  /** Columna izquierda, en el orden dado. */
  left: MatchItem[];
  /** Columna derecha, YA MEZCLADA — el `id` de cada ítem indica con qué ítem de `left` forma el par correcto. */
  right: MatchItem[];
  leftLabel?: string;
  rightLabel?: string;
  /** Explicación por par, indexada por `id`. */
  why: Record<string, string>;
  /** Si ya estaba marcada como completada al cargar la página (localStorage) — evita el mensaje contradictorio "Completada" + "0 de N". */
  alreadyDone?: boolean;
  onSolved?: () => void;
};

type Selection = {side: 'left' | 'right'; id: string} | null;

/** Emparejar: conectar cada ítem de una columna con su par en la otra, click-click (sin arrastrar). */
export default function Match({left, right, leftLabel = 'A', rightLabel = 'B', why, alreadyDone, onSolved}: MatchProps): ReactNode {
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [selected, setSelected] = useState<Selection>(null);
  const [wrongPair, setWrongPair] = useState<{left: string; right: string} | null>(null);
  const [feedback, setFeedback] = useState<{kind: 'ok' | 'err'; text: ReactNode} | null>(null);

  const total = left.length;

  function pick(side: 'left' | 'right', id: string): void {
    if (matched.has(id)) return;
    setWrongPair(null);
    setFeedback(null);

    if (!selected) {
      playTick();
      setSelected({side, id});
      return;
    }

    if (selected.side === side) {
      // re-elegir del mismo lado
      playTick();
      setSelected({side, id});
      return;
    }

    const leftId = side === 'left' ? id : selected.id;
    const rightId = side === 'right' ? id : selected.id;

    if (leftId === rightId) {
      playCorrect();
      const next = new Set(matched);
      next.add(leftId);
      setMatched(next);
      setSelected(null);
      setFeedback({kind: 'ok', text: <InlineText text={why[leftId]} /> });
      if (next.size === total) onSolved?.();
    } else {
      playWrong();
      setWrongPair({left: leftId, right: rightId});
      setSelected(null);
      setFeedback({kind: 'err', text: 'Ese par no corresponde — volvé a intentar.'});
    }
  }

  function stateOf(side: 'left' | 'right', id: string): string {
    if (matched.has(id)) return styles.matched;
    if (selected?.side === side && selected.id === id) return styles.selected;
    if (wrongPair && ((side === 'left' && wrongPair.left === id) || (side === 'right' && wrongPair.right === id))) {
      return styles.wrong;
    }
    return '';
  }

  return (
    <div>
      <div className={styles.columns}>
        <div className={styles.column}>
          <div className={styles.colLabel}>{leftLabel}</div>
          {left.map((item) => (
            <button
              key={item.id}
              type="button"
              className={[styles.item, stateOf('left', item.id)].join(' ').trim()}
              disabled={matched.has(item.id)}
              onClick={() => pick('left', item.id)}
            >
              <InlineText text={item.text} />
            </button>
          ))}
        </div>
        <div className={styles.column}>
          <div className={styles.colLabel}>{rightLabel}</div>
          {right.map((item) => (
            <button
              key={item.id}
              type="button"
              className={[styles.item, stateOf('right', item.id)].join(' ').trim()}
              disabled={matched.has(item.id)}
              onClick={() => pick('right', item.id)}
            >
              <InlineText text={item.text} />
            </button>
          ))}
        </div>
      </div>

      <div className={styles.counter}>
        {alreadyDone && matched.size === 0
          ? 'Ya resolviste esta actividad antes — resolvela de nuevo si querés repasar.'
          : `${matched.size} de ${total} emparejados`}
      </div>

      {feedback && <div className={`akb-feedback akb-feedback--${feedback.kind}`}>{feedback.text}</div>}
    </div>
  );
}
