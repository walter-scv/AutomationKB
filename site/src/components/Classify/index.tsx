import {useState, type DragEvent, type ReactNode} from 'react';
import {highlightTs} from '@site/src/lib/highlightTs';
import {playCorrect, playTick, playWrong} from '@site/src/lib/sound';
import InlineText from '@site/src/components/InlineText';
import styles from './styles.module.css';

// Drag-and-drop puro, sin alternativa de teclado: decisión explícita (aprendizaje 24 de CLAUDE.md).

export type ClassifyItem = {
  code: string;
  /** Índice (0-based) de la columna donde corresponde este ítem. */
  column: number;
  /** Explicación completa — se revela al clasificar bien. */
  why: string;
  /** Pista específica de ESTE ítem, mostrada solo tras un intento equivocado. */
  hint?: string;
};

export type ClassifyProps = {
  items: ClassifyItem[];
  /** Un label por columna, en el mismo orden que `column` en cada ítem. */
  columns: string[];
  /** Cómo se nombra cada ítem en el feedback. Por defecto, "Ítem". */
  itemLabel?: string;
  /** Unidad del contador. Por defecto, "clasificados". */
  counterLabel?: string;
  /** Si ya estaba marcada como completada al cargar la página (localStorage). */
  alreadyDone?: boolean;
  onSolved?: () => void;
};

type Feedback = {kind: 'ok' | 'err'; text: ReactNode};

export default function Classify({
  items,
  columns,
  itemLabel = 'Ítem',
  counterLabel = 'clasificados',
  alreadyDone,
  onSolved,
}: ClassifyProps): ReactNode {
  const [placed, setPlaced] = useState<Record<number, number>>({});
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<number | null>(null);

  const solvedCount = Object.keys(placed).length;
  const total = items.length;

  function classify(index: number, columnChoice: number): void {
    const item = items[index];
    if (placed[index] !== undefined) return;

    if (columnChoice === item.column) {
      playCorrect();
      setPlaced((prev) => ({...prev, [index]: columnChoice}));
      setFeedback({
        kind: 'ok',
        text: (
          <>
            {itemLabel} {index + 1}: correcto. <InlineText text={item.why} />
          </>
        ),
      });
      if (solvedCount + 1 === total) onSolved?.();
      return;
    }

    playWrong();
    setFeedback({
      kind: 'err',
      text: (
        <>
          {itemLabel} {index + 1}: no es "<InlineText text={columns[columnChoice]} />".{' '}
          <InlineText text={item.hint ?? 'Releé la situación con cuidado y volvé a intentar.'} />
        </>
      ),
    });
  }

  function handleDragStart(e: DragEvent<HTMLDivElement>, index: number): void {
    setDragIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    playTick();
  }

  function handleDragOver(e: DragEvent<HTMLDivElement>, columnIndex: number): void {
    e.preventDefault();
    setDragOverColumn(columnIndex);
  }

  function handleDrop(e: DragEvent<HTMLDivElement>, columnIndex: number): void {
    e.preventDefault();
    if (dragIndex !== null) classify(dragIndex, columnIndex);
    setDragIndex(null);
    setDragOverColumn(null);
  }

  const pending = items.map((item, index) => ({item, index})).filter(({index}) => placed[index] === undefined);

  return (
    <div className={styles.wrap}>
      <div className={styles.tray} role="group" aria-label="Elementos sin clasificar">
        {pending.length === 0 && <p className={styles.trayDone}>Clasificaste todos — revisá las cajas.</p>}
        {pending.map(({item, index}) => (
          <div
            key={index}
            className={[styles.chip, dragIndex === index ? styles.dragging : ''].join(' ').trim()}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragEnd={() => setDragIndex(null)}
          >
            <span className={styles.chipCode}>{highlightTs(item.code)}</span>
          </div>
        ))}
      </div>

      <div className={styles.boxes} style={{gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))`}}>
        {columns.map((label, ci) => (
          <div
            key={ci}
            className={[styles.box, dragOverColumn === ci ? styles.boxOver : ''].join(' ').trim()}
            onDragOver={(e) => handleDragOver(e, ci)}
            onDragLeave={() => setDragOverColumn((cur) => (cur === ci ? null : cur))}
            onDrop={(e) => handleDrop(e, ci)}
          >
            <span className={styles.boxLabel}>
              <InlineText text={label} />
            </span>
            <div className={styles.boxContent}>
              {items.map((item, index) =>
                placed[index] === ci ? (
                  <div key={index} className={styles.placedCard}>
                    {highlightTs(item.code)}
                  </div>
                ) : null
              )}
            </div>
          </div>
        ))}
      </div>

      <div className={styles.counter}>
        {alreadyDone && solvedCount === 0
          ? 'Ya resolviste esta actividad antes — resolvela de nuevo si querés repasar.'
          : `${solvedCount} de ${total} ${counterLabel}`}
      </div>

      {feedback && <div className={`akb-feedback akb-feedback--${feedback.kind}`}>{feedback.text}</div>}
    </div>
  );
}
