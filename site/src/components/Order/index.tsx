import {useRef, useState, type DragEvent, type ReactNode} from 'react';
import {highlightTs} from '@site/src/lib/highlightTs';
import {playCorrect, playTick, playWrong} from '@site/src/lib/sound';
import styles from './styles.module.css';

export type OrderItem = {
  id: string;
  what: string;
  code: string;
  /** 'header' = un marcador de sección (ej. `// ARRANGE`), se ve distinto de un paso de código. */
  kind?: 'step' | 'header';
};

export type OrderRule = {
  before: string;
  after: string;
  why: string;
};

export type OrderProps = {
  /** Ya en el orden MEZCLADO inicial — sin aleatoriedad, para que sea reproducible. */
  items: OrderItem[];
  correctOrder: string[];
  rules: OrderRule[];
  onSolved?: () => void;
};

export default function Order({items, correctOrder, rules, onSolved}: OrderProps): ReactNode {
  const [order, setOrder] = useState<string[]>(items.map((i) => i.id));
  const [marks, setMarks] = useState<Record<string, boolean> | null>(null);
  const [feedback, setFeedback] = useState<{kind: 'ok' | 'err'; text: string} | null>(null);
  const [dragFrom, setDragFrom] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const byId = (id: string) => items.find((i) => i.id === id)!;

  function move(from: number, to: number, focusId?: string): void {
    if (from === to) return;
    playTick();
    setOrder((prev) => {
      const next = [...prev];
      const [x] = next.splice(from, 1);
      next.splice(to, 0, x);
      return next;
    });
    setMarks(null);
    setFeedback(null);
    if (focusId) requestAnimationFrame(() => buttonRefs.current[focusId]?.focus());
  }

  function check(): void {
    const nextMarks: Record<string, boolean> = {};
    order.forEach((id, i) => {
      nextMarks[id] = correctOrder[i] === id;
    });
    setMarks(nextMarks);

    const broken = rules.filter((r) => order.indexOf(r.before) > order.indexOf(r.after));
    if (broken.length === 0) {
      playCorrect();
      setFeedback({kind: 'ok', text: 'Orden correcto.'});
      onSolved?.();
    } else {
      playWrong();
      setFeedback({
        kind: 'err',
        text: 'Todavía no — revisá esto: ' + broken.slice(0, 2).map((r) => r.why).join(' '),
      });
    }
  }

  function handleDragStart(e: DragEvent<HTMLLIElement>, index: number): void {
    setDragFrom(index);
    e.dataTransfer.effectAllowed = 'move';
  }

  function handleDragOver(e: DragEvent<HTMLLIElement>, index: number): void {
    e.preventDefault();
    setDragOverIndex(index);
  }

  function handleDrop(e: DragEvent<HTMLLIElement>, index: number): void {
    e.preventDefault();
    if (dragFrom !== null) move(dragFrom, index);
    setDragFrom(null);
    setDragOverIndex(null);
  }

  function handleDragEnd(): void {
    setDragFrom(null);
    setDragOverIndex(null);
  }

  return (
    <div>
      <ul className={styles.list}>
        {order.map((id, i) => {
          const item = byId(id);
          const cls = [styles.item];
          if (item.kind === 'header') cls.push(styles.header);
          if (marks) cls.push(marks[id] ? styles.ok : styles.bad);
          if (dragFrom === i) cls.push(styles.dragging);
          if (dragOverIndex === i && dragFrom !== i) cls.push(styles.dragOver);
          return (
            <li
              key={id}
              className={cls.join(' ')}
              draggable
              onDragStart={(e) => handleDragStart(e, i)}
              onDragOver={(e) => handleDragOver(e, i)}
              onDrop={(e) => handleDrop(e, i)}
              onDragEnd={handleDragEnd}
            >
              <span className={styles.grip} aria-hidden="true">
                ⋮⋮
              </span>
              <span>
                <span className={styles.what}>{item.what}</span>
                <span className={item.kind === 'header' ? styles.headerLine : styles.codeLine}>{highlightTs(item.code)}</span>
              </span>
              <span className={styles.controls}>
                <button
                  type="button"
                  ref={(el) => {
                    buttonRefs.current[id] = el;
                  }}
                  disabled={i === 0}
                  aria-label={`Mover "${item.what}" hacia arriba`}
                  onClick={() => move(i, i - 1, id)}
                >
                  ↑
                </button>
                <button
                  type="button"
                  disabled={i === order.length - 1}
                  aria-label={`Mover "${item.what}" hacia abajo`}
                  onClick={() => move(i, i + 1, id)}
                >
                  ↓
                </button>
              </span>
            </li>
          );
        })}
      </ul>

      <button type="button" className="button button--primary" onClick={check}>
        Comprobar orden
      </button>

      {feedback && <div className={`akb-feedback akb-feedback--${feedback.kind}`}>{feedback.text}</div>}
    </div>
  );
}
