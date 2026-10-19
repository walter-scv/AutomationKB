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
    // docs/best-practices/ queda fuera de este sitio (ver site/PLAN.md,
    // sección 2) — 'detect' es igual la config recomendada por Docusaurus
    // para no sorprenderse si algún .md se agrega acá más adelante.
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
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
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
      copyright: `AutomationKB — lecciones interactivas sobre docs/best-practices/`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
