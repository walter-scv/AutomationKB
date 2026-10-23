import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'Automation Knowledge Base',
  tagline: 'Aprendé automation haciendo, no solo leyendo',
  favicon: 'img/favicon.svg',

  future: {
    v4: true,
  },

  url: 'https://walter-scv.github.io',
  baseUrl: '/AutomationKB/',

  organizationName: 'walter-scv',
  projectName: 'AutomationKB',

  onBrokenLinks: 'throw',

  i18n: {
    defaultLocale: 'es',
    locales: ['es'],
  },

  headTags: [
    {
      tagName: 'link',
      attributes: {rel: 'preconnect', href: 'https://fonts.googleapis.com'},
    },
    {
      tagName: 'link',
      attributes: {rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: 'anonymous'},
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:wght@400;700&family=JetBrains+Mono:wght@400;600&display=swap',
      },
    },
  ],

  markdown: {
    // docs/best-practices/ queda fuera de este sitio — 'detect' es la
    // config recomendada por Docusaurus para no sorprenderse si algún .md
    // se agrega acá más adelante.
    format: 'detect',
  },

  presets: [
    [
      'classic',
      {
        docs: {
          path: 'docs',
          routeBasePath: 'docs',
          sidebarPath: './sidebars.ts',
          // Sin esto, Docusaurus interpreta "06-" como orden de sidebar y lo
          // saca de la URL (ej. /docs/anatomia-de-un-test). Lo desactivamos
          // para que la URL de cada lección coincida con el nombre de archivo
          // (mismo prefijo que docs/best-practices/06-....md), y el orden lo
          // da `sidebar_position` en el front matter de cada .mdx.
          numberPrefixParser: false,
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Tema único "arcade neón" en toda la base (portada y lecciones) — sin
    // alternativa en modo claro, por eso se deshabilita el switch en vez de
    // mantener dos paletas (ver CLAUDE.md).
    colorMode: {
      defaultMode: 'dark',
      disableSwitch: true,
      respectPrefersColorScheme: false,
    },
    navbar: {
      style: 'dark',
      title: 'Automation Knowledge Base',
      items: [
        {
          href: 'https://github.com/walter-scv/AutomationKB',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      logo: {
        alt: 'SCVsoft',
        src: 'img/scvsoft-logo.png',
        width: 120,
      },
      copyright: `AutomationKB — currícula interactiva de test automation`,
    },
    prism: {
      theme: prismThemes.synthwave84,
      darkTheme: prismThemes.synthwave84,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
