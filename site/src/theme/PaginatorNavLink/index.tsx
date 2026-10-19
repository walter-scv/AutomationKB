import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import type {Props} from '@theme/PaginatorNavLink';
import {playTick} from '@site/src/lib/sound';

/** Igual al original de @docusaurus/theme-classic, solo que suma el tick de
 * sonido al navegar entre lecciones (lo único que faltaba sin swizzlear). */
export default function PaginatorNavLink(props: Props): ReactNode {
  const {permalink, title, subLabel, isNext} = props;
  return (
    <Link
      className={clsx('pagination-nav__link', isNext ? 'pagination-nav__link--next' : 'pagination-nav__link--prev')}
      to={permalink}
      onClick={() => playTick()}
    >
      {subLabel && <div className="pagination-nav__sublabel">{subLabel}</div>}
      <div className="pagination-nav__label">{title}</div>
    </Link>
  );
}
