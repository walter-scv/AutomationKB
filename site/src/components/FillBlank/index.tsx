import {useMemo, useState, type ReactNode} from 'react';
import {playCorrect, playTick, playWrong} from '@site/src/lib/sound';
import InlineText from '@site/src/components/InlineText';
import styles from './styles.module.css';

export type FillBlankSlot = {
  /** Coincide con `{{id}}` dentro de `template`. */
  id: string;
  answer: string;
};

export type FillBlankProps = {
  /** Texto con huecos marcados `{{id}}`. Se divide en segmentos + huecos. */
  template: string;
  slots: FillBlankSlot[];
  /** Fichas disponibles para completar los huecos — ya mezcladas, incluye distractoras. */
  bank: string[];
  explanation: string;
  /** Si ya estaba marcada como completada al cargar la página (localStorage) — evita el mensaje contradictorio "Completada" + huecos vacíos. */
  alreadyDone?: boolean;
  onSolved?: () => void;
};

type Piece = {text: string} | {slotId: string};

function splitTemplate(template: string): Piece[] {
  const pieces: Piece[] = [];
  const re = /\{\{(\w+)\}\}/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(template))) {
    if (m.index > last) pieces.push({text: template.slice(last, m.index)});
    pieces.push({slotId: m[1]});
    last = re.lastIndex;
  }
  if (last < template.length) pieces.push({text: template.slice(last)});
  return pieces;
}

/** Cloze: completar huecos de un template clickeando fichas de un banco — sin arrastrar, sin escribir. */
export default function FillBlank({template, slots, bank, explanation, alreadyDone, onSolved}: FillBlankProps): ReactNode {
  const pieces = useMemo(() => splitTemplate(template), [template]);
  const slotIds = useMemo(() => pieces.filter((p): p is {slotId: string} => 'slotId' in p).map((p) => p.slotId), [pieces]);

  // assigned[slotId] = índice dentro de `bank`, o null si el hueco está vacío.
  const [assigned, setAssigned] = useState<Record<string, number | null>>(() =>
    Object.fromEntries(slotIds.map((id) => [id, null]))
  );
  const [marks, setMarks] = useState<Record<string, boolean> | null>(null);
  const [feedback, setFeedback] = useState<{kind: 'ok' | 'err'; text: ReactNode} | null>(null);
  const [solved, setSolved] = useState(false);

  const usedIndices = new Set(Object.values(assigned).filter((v): v is number => v !== null));
  const allFilled = slotIds.every((id) => assigned[id] !== null);

  function answerOf(id: string): string {
    return slots.find((s) => s.id === id)!.answer;
  }

  function pickChip(index: number): void {
    const targetSlot = slotIds.find((id) => assigned[id] === null);
    if (!targetSlot || usedIndices.has(index)) return;
    playTick();
    setAssigned((prev) => ({...prev, [targetSlot]: index}));
    setMarks(null);
    setFeedback(null);
  }

  function clearSlot(id: string): void {
    if (marks?.[id]) return; // no se deshace un hueco ya marcado correcto
    setAssigned((prev) => ({...prev, [id]: null}));
    setMarks(null);
    setFeedback(null);
  }

  function check(): void {
    if (!allFilled) return;
    const nextMarks: Record<string, boolean> = {};
    slotIds.forEach((id) => {
      nextMarks[id] = bank[assigned[id]!] === answerOf(id);
    });
    setMarks(nextMarks);

    if (Object.values(nextMarks).every(Boolean)) {
      playCorrect();
      setFeedback({kind: 'ok', text: <InlineText text={explanation} />});
      setSolved(true);
      onSolved?.();
    } else {
      playWrong();
      setFeedback({
        kind: 'err',
        text: 'Hay al menos un hueco mal — hacé click sobre el que esté marcado en rojo para sacarlo y probar otra ficha.',
      });
    }
  }

  return (
    <div>
      <div className={styles.template}>
        {pieces.map((p, i) =>
          'text' in p ? (
            <span key={i} className={styles.text}>
              {p.text}
            </span>
          ) : (
            <button
              key={i}
              type="button"
              className={[
                styles.slot,
                assigned[p.slotId] !== null ? styles.filled : '',
                marks ? (marks[p.slotId] ? styles.ok : styles.bad) : '',
              ]
                .join(' ')
                .trim()}
              onClick={() => clearSlot(p.slotId)}
              aria-label={assigned[p.slotId] !== null ? `Hueco completado con "${bank[assigned[p.slotId]!]}", click para vaciarlo` : 'Hueco vacío'}
            >
              {assigned[p.slotId] !== null ? bank[assigned[p.slotId]!] : '␣'}
            </button>
          )
        )}
      </div>

      {alreadyDone && usedIndices.size === 0 && !solved && (
        <div className={styles.counter}>Ya resolviste esta actividad antes — resolvela de nuevo si querés repasar.</div>
      )}

      <div className={styles.bank} role="group" aria-label="Fichas disponibles">
        {bank.map((chip, i) => (
          <button
            key={i}
            type="button"
            className={styles.chip}
            disabled={usedIndices.has(i) || solved}
            onClick={() => pickChip(i)}
          >
            {chip}
          </button>
        ))}
      </div>

      <button type="button" className="button button--primary" disabled={!allFilled || solved} onClick={check}>
        Comprobar
      </button>

      {feedback && <div className={`akb-feedback akb-feedback--${feedback.kind}`}>{feedback.text}</div>}
    </div>
  );
}
