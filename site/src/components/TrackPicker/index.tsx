import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';

export type Track = {
  id: string;
  label: string;
  description: string;
  href: string;
};

export type TrackPickerProps = {
  tracks: Track[];
};

/**
 * Selector de track de la sección II (Testing Domains). Cada track es una
 * bifurcación real de navegación, no un tab: lleva a su propio sub-árbol de
 * capítulos.
 */
export default function TrackPicker({tracks}: TrackPickerProps): ReactNode {
  return (
    <div className={styles.grid}>
      {tracks.map((track) => (
        <Link key={track.id} to={track.href} className={styles.card}>
          <span className={styles.label}>{track.label}</span>
          <span className={styles.description}>{track.description}</span>
        </Link>
      ))}
    </div>
  );
}
