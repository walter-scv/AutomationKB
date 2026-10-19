import type {ReactNode} from 'react';
import styles from './styles.module.css';

export type ActivityProps = {
  title: string;
  kind: string;
  goal: string;
  need: ReactNode;
  tools?: {summary: string; content: ReactNode};
  consigna: ReactNode;
  done: boolean;
  children: ReactNode;
};

/**
 * Contenedor común de toda actividad (checklist de CLAUDE.md): título,
 * tipo, estado, "Qué practicás", "Lo que necesitás saber", referencia
 * opcional a la Page Object, y la consigna. El componente de actividad en
 * sí (FindInCode, Order, etc.) va en `children`.
 */
export default function Activity({title, kind, goal, need, tools, consigna, done, children}: ActivityProps): ReactNode {
  return (
    <section className={styles.activity}>
      <div className={styles.head}>
        <h3>{title}</h3>
        <span>
          <span className={styles.kind}>{kind}</span>
          {done && <span className={styles.status}> · Completada</span>}
        </span>
      </div>

      <p className={styles.goal}>
        <strong>Qué practicás:</strong> {goal}
      </p>

      <div className={styles.need}>
        <strong>Lo que necesitás saber</strong>
        {need}
      </div>

      {tools && (
        <details className={styles.tools}>
          <summary>{tools.summary}</summary>
          {tools.content}
        </details>
      )}

      <p className={styles.consigna}>
        <strong>Tu tarea:</strong> {consigna}
      </p>

      {children}
    </section>
  );
}
