import type {ReactNode} from 'react';
import styles from './styles.module.css';

/** Renderiza el texto con los tramos entre backticks como código en línea. */
export default function InlineText({text}: {text: string}): ReactNode {
  const parts = text.split('`');
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <code key={i} className={styles.code}>
            {part}
          </code>
        ) : (
          part
        ),
      )}
    </>
  );
}
