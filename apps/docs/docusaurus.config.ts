import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

const config: Config = {
  title: "Verse ORM",
  tagline: "Beautiful TypeScript data access.",
  favicon: "img/favicon.ico",

  url: "https://verse.operativa.dev",

  baseUrl: "/",

  organizationName: "operativa-dev",
  projectName: "verse",
  deploymentBranch: "gh-pages",

  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",

  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      {
        docs: {
          sidebarPath: "./sidebars.ts",
          remarkPlugins: [[require("@docusaurus/remark-plugin-npm2yarn"), { sync: true }]],
          editUrl: params =>
            params.docPath.startsWith("api/")
              ? undefined
              : "https://github.com/operativa-dev/verse/edit/main/apps/docs/docs/ref",
        },
        theme: {
          customCss: "./src/css/custom.css",
        },
        googleTagManager: {
          containerId: "GTM-WG75CT3N",
        },
      } satisfies Preset.Options,
    ],
  ],

  plugins: [
    [
      "docusaurus-plugin-typedoc",
      {
        tsconfig: "../../packages/verse-core/tsconfig.json",
        readme: "none",
        sidebar: { pretty: true },
        expandParameters: true,
        //useCodeBlocks: true,
        expandObjects: true,
        parametersFormat: "table",
      },
    ],
  ],

  themeConfig: {
    image: "img/icon.png",
    navbar: {
      title: "Verse ORM",
      logo: {
        alt: "Operativa Logo",
        src: "img/icon.svg",
        srcDark: "img/icon_dark.svg",
        href: "/",
        target: "_self",
        width: 32,
        height: 32,
      },
      items: [
        {
          type: "docSidebar",
          sidebarId: "refSidebar",
          position: "left",
          label: "Reference",
        },
        {
          type: "docSidebar",
          sidebarId: "apiSidebar",
          position: "left",
          label: "API Reference",
        },
        {
          href: "https://github.com/operativa-dev/verse",
          label: "GitHub",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      links: [],
      copyright: `Copyright © ${new Date().getFullYear()} Operativa Solutions (PTY) LTD.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.vsDark,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
