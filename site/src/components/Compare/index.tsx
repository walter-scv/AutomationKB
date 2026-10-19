import type {ReactNode} from 'react';
import {highlightTs} from '@site/src/lib/highlightTs';
import styles from './styles.module.css';

export type CompareSide = {
  code: string;
  explanation: ReactNode;
};

export type CompareProps = {
  bad: CompareSide;
  good: CompareSide;
};

function CodeBlock({code}: {code: string}) {
  return (
    <pre className={styles.code}>
      {code.split('\n').map((line, i) => (
        <div key={i}>{highlightTs(line) }</div>
      ))}
    </pre>
  );
}

/** "Así no" / "Así sí" — par de ejemplos contrastados, como en la demo. */
export default function Compare({bad, good}: CompareProps): ReactNode {
  return (
    <div className={styles.compare}>
      <div className={styles.side}>
        <span className={styles.badHeading}>Así no</span>
        <CodeBlock code={bad.code} />
        <div>{bad.explanation}</div>
      </div>
      <div className={styles.side}>
        <span className={styles.goodHeading}>Así sí</span>
        <CodeBlock code={good.code} />
        <div>{good.explanation}</div>
      </div>
    </div>
  );
}
