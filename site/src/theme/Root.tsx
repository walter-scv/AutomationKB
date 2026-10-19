import type {ReactNode} from 'react';
import SoundToggle from '@site/src/components/SoundToggle';

/** Wrapper global soportado por Docusaurus sin necesidad de swizzlear nada
 * (src/theme/Root.tsx envuelve toda la app). Lo usamos solo para montar el
 * toggle de sonido en todas las páginas. */
export default function Root({children}: {children: ReactNode}): ReactNode {
  return (
    <>
      {children}
      <SoundToggle />
    </>
  );
}
