import {useEffect, useState} from 'react';
import {initSoundPreference, isSoundEnabled, setSoundEnabled, subscribe} from '@site/src/lib/sound';

/** Solo lo usa <SoundToggle> — el resto de los componentes llama a las
 * funciones playX() de site/src/lib/sound directo, sin necesitar este hook. */
export function useSoundEnabledState(): [boolean, (value: boolean) => void] {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    initSoundPreference();
    setEnabled(isSoundEnabled());
    return subscribe(setEnabled);
  }, []);

  return [enabled, setSoundEnabled];
}
