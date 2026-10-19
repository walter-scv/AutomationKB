import {useEffect, type ReactNode} from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';
import {setMusicSrc} from '@site/src/lib/sound';
import {useSoundEnabledState} from '@site/src/hooks/useSoundEnabled';
import styles from './styles.module.css';

/** Botón flotante, visible en todas las páginas (montado desde src/theme/Root).
 * Es el único gesto que puede crear el AudioContext — por eso toda la música
 * y los efectos quedan en silencio hasta que el lector lo prende acá. */
export default function SoundToggle(): ReactNode {
  const [enabled, setEnabled] = useSoundEnabledState();
  const musicUrl = useBaseUrl('/audio/power-stage-loop.mp3');

  useEffect(() => {
    setMusicSrc(musicUrl);
  }, [musicUrl]);

  return (
    <button
      type="button"
      className={styles.toggle}
      aria-pressed={enabled}
      aria-label={enabled ? 'Silenciar sonido' : 'Activar sonido y música 8-bit'}
      title={enabled ? 'Silenciar' : 'Sonido 8-bit'}
      onClick={() => setEnabled(!enabled)}
    >
      {enabled ? '🔊' : '🔇'}
    </button>
  );
}
