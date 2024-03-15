import type * as Preset from "@docusaurus/preset-classic";
import type { Config } from "@docusaurus/types";
import { themes as prismThemes } from "prism-react-renderer";

const config: Config = {
  title: "@operativa/verse",
  tagline:
    "Verse is an experimental package to provide a next-gen Typescript ORM. It is subject to change and intended only for evaluation purposes.",
  favicon: "img/favicon.ico",

  // Set the production url of your site here
  url: "https://verse.operativa.dev",

  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: "/",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "operativa-dev",
  projectName: "verse",
  deploymentBranch: "gh-pages",

  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "throw",

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
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
              : "https://github.com/operativa-dev/verse/edit/main/apps/docs",
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
    [
      "@docusaurus/plugin-google-tag-manager",
      {
        containerId: "GTM-WG75CT3N",
      },
    ],
  ],

  themeConfig: {
    image: "img/icon.png",

    navbar: {
      title: "@operativa/verse",
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
          href: "#",
          label: "⚠️ Experimental package work in progress ⚠️",
          position: "right",
          style: {
            color: "#dc9234",
            fontWeight: "bold",
          },
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
      links: [
        // {
        //   title: "Docs",
        //   items: [
        //     {
        //       label: "Tutorial",
        //       to: "/docs/intro",
        //     },
        //   ],
        // },
        // {
        //   title: "Community",
        //   items: [
        //     {
        //       label: "Stack Overflow",
        //       href: "https://stackoverflow.com/questions/tagged/verse",
        //     },
        //     {
        //       label: "Discord",
        //       href: "https://discordapp.com/invite/docusaurus",
        //     },
        //     {
        //       label: "Twitter",
        //       href: "https://twitter.com/docusaurus",
        //     },
        //   ],
        // },
        // {
        //   title: "More",
        //   items: [
        //     {
        //       label: "Blog",
        //       to: "/blog",
        //     },
        //     {
        //       label: "GitHub",
        //       href: "https://github.com/operativa-dev/verse",
        //     },
        //   ],
        // },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Operativa Solutions (PTY) LTD.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.vsDark,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
