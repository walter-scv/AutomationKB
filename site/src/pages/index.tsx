import type {MouseEvent, ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import {useHistory} from '@docusaurus/router';
import useBaseUrl from '@docusaurus/useBaseUrl';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import {playStartFanfare} from '@site/src/lib/sound';

import styles from './index.module.css';

const FIRST_LESSON = '/docs/01-foundations/testing/01-que-es-testing';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  const history = useHistory();
  const firstLessonUrl = useBaseUrl(FIRST_LESSON);

  // Si el sonido está activado, deja sonar la fanfarria de "arranca la
  // partida" antes de navegar. Si está en silencio, playStartFanfare()
  // devuelve 0 y el click se comporta como un <Link> normal.
  function handleStart(e: MouseEvent<HTMLAnchorElement>): void {
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    const delay = playStartFanfare();
    if (delay === 0) {
      history.push(firstLessonUrl);
    } else {
      setTimeout(() => history.push(firstLessonUrl), delay);
    }
  }

  return (
    <header className={clsx('hero', styles.heroBanner)}>
      <div className={styles.scanlines} aria-hidden="true" />
      <div className={clsx('container', styles.menuPanel)}>
        <p className={styles.kicker}>Software Testing</p>
        <h1 className={styles.title}>{siteConfig.title}</h1>
        <Link className={styles.playButton} to={FIRST_LESSON} onClick={handleStart}>
          <span className={styles.playIcon} aria-hidden="true">▶</span>
          Start!
        </Link>
        <p className={styles.hint}>I. Foundations — 35 capítulos disponibles</p>
      </div>
    </header>
  );
}

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout title={siteConfig.title} description={siteConfig.tagline}>
      <HomepageHeader />
    </Layout>
  );
}
