import {useEffect, type ReactNode} from 'react';
import {useLocation} from '@docusaurus/router';
import useBaseUrl from '@docusaurus/useBaseUrl';
import {MUSIC_VOLUME_LANDING, MUSIC_VOLUME_LESSON, setMusicSrc, setMusicVolume} from '@site/src/lib/sound';
import {useSoundEnabledState} from '@site/src/hooks/useSoundEnabled';
import styles from './styles.module.css';

/** Botón flotante, visible en todas las páginas (montado desde src/theme/Root).
 * Es el único gesto que puede crear el AudioContext — por eso toda la música
 * y los efectos quedan en silencio hasta que el lector lo prende acá. */
export default function SoundToggle(): ReactNode {
  const [enabled, setEnabled] = useSoundEnabledState();
  const musicUrl = useBaseUrl('/audio/power-stage-loop.mp3');
  const homeUrl = useBaseUrl('/');
  const {pathname} = useLocation();

  useEffect(() => {
    setMusicSrc(musicUrl);
  }, [musicUrl]);

  // La portada es una pantalla de menú (sin texto que leer): ahí el volumen
  // más alto de antes suena bien. En una lección, de fondo mientras se lee,
  // el mismo volumen distrae — se baja apenas se navega a una.
  useEffect(() => {
    setMusicVolume(pathname === homeUrl ? MUSIC_VOLUME_LANDING : MUSIC_VOLUME_LESSON);
  }, [pathname, homeUrl]);

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
