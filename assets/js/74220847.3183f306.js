"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[1261],{7840:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>c,contentTitle:()=>r,default:()=>h,frontMatter:()=>o,metadata:()=>a,toc:()=>d});var i=t(3159),s=t(15);const o={},r="Overview",a={id:"ref/Configuration/overview",title:"Overview",description:"Verse configuration involves specifying things like a database driver and connection information, as well",source:"@site/docs/ref/02-Configuration/01-overview.mdx",sourceDirName:"ref/02-Configuration",slug:"/ref/Configuration/overview",permalink:"/docs/ref/Configuration/overview",draft:!1,unlisted:!1,editUrl:"https://github.com/operativa-dev/verse/edit/main/apps/docs",tags:[],version:"current",sidebarPosition:1,frontMatter:{},sidebar:"refSidebar",previous:{title:"Getting Started",permalink:"/docs/ref/Tutorials/getting-started"},next:{title:"Entities",permalink:"/docs/ref/Configuration/entities"}},c={},d=[];function l(e){const n={a:"a",code:"code",em:"em",h1:"h1",li:"li",p:"p",pre:"pre",ul:"ul",...(0,s.R)(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(n.h1,{id:"overview",children:"Overview"}),"\n",(0,i.jsxs)(n.p,{children:["Verse configuration involves specifying things like a database driver and connection information, as well\nas defining a ",(0,i.jsx)(n.em,{children:"metadata model"})," that describes the structure of your application's data, and how it maps\nto your database schema. Verse is a pure runtime library, so there is no code generation step to slow down\nyour development process. Instead, you define your metadata model in code, and then use it to interact with\nyour database."]}),"\n",(0,i.jsx)(n.h1,{id:"verse-object",children:"Verse Object"}),"\n",(0,i.jsxs)(n.p,{children:["A ",(0,i.jsx)(n.code,{children:"Verse"})," object is the main entry point for using the framework. There is normally a single ",(0,i.jsx)(n.code,{children:"Verse"})," object per\napplication, scoped at the top level of your application code."]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-ts",metastring:"include ./apps/snippets/src/config.ts:verse-object showLineNumbers",children:"const db = verse({\n  config: {\n    //...\n  },\n  model: {\n    //...\n  },\n});\n"})}),"\n",(0,i.jsxs)(n.p,{children:["The ",(0,i.jsx)(n.a,{href:"../../api/verse/functions/verse",children:(0,i.jsx)(n.code,{children:"verse"})})," function is used to create a new ",(0,i.jsx)(n.code,{children:"Verse"})," object.\nIt takes an object with two properties:"]}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.code,{children:"config"}),": An object that specifies configuration such as the database driver to use."]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.code,{children:"model"}),": An object that specifies the metadata model for the application."]}),"\n"]}),"\n",(0,i.jsx)(n.h1,{id:"config",children:"Config"}),"\n",(0,i.jsxs)(n.p,{children:["The ",(0,i.jsx)(n.a,{href:"../../api/verse/type-aliases/Config",children:(0,i.jsx)(n.code,{children:"config"})})," object is used like this:"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-ts",metastring:"include ./apps/snippets/src/config.ts:config showLineNumbers",children:"const db = verse({\n  config: {\n    driver: sqlite(`Chinook_Sqlite.sqlite`),\n    logger: new PrettyConsoleLogger(),\n  },\n  model: {\n    //...\n  },\n});\n"})}),"\n",(0,i.jsxs)(n.p,{children:["Here we are using the ",(0,i.jsx)(n.code,{children:"sqlite"})," driver to connect to a SQLite database file named ",(0,i.jsx)(n.code,{children:"Chinook_Sqlite.sqlite"}),". We\nare also enabling logging to the console using the ",(0,i.jsx)(n.code,{children:"PrettyConsoleLogger"}),", which is a built-in logger that\nformats log messages in a human-readable way."]}),"\n",(0,i.jsx)(n.h1,{id:"model",children:"Model"}),"\n",(0,i.jsxs)(n.p,{children:["The ",(0,i.jsx)(n.code,{children:"model"})," object is used to define the metadata model for the application. The model is primarily a collection of\n",(0,i.jsx)(n.em,{children:"entity"})," models, which represent the concepts in your application domain. Each entity has a name, and a set of properties\nthat describe the structure of the entity. The model can also define ",(0,i.jsx)(n.em,{children:"value objects"}),", which are simple objects that are\nused to represent data that doesn't have an identity of its own, and ",(0,i.jsx)(n.em,{children:"sequences"}),", which are used to generate unique identifiers."]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-ts",metastring:"include ./apps/snippets/src/config.ts:model showLineNumbers",children:'const db = verse({\n  config: {\n    //...\n  },\n  model: {\n    entities: {\n      artists: entity(\n        {\n          artistId: int(),\n          name: string(),\n        },\n        builder => {\n          builder.table("Artist");\n        }\n      ),\n    },\n  },\n});\n'})}),"\n",(0,i.jsxs)(n.p,{children:["Here we are defining an entity that represents artists in a music database. The entity has two properties: ",(0,i.jsx)(n.code,{children:"artistId"})," and ",(0,i.jsx)(n.code,{children:"name"}),".\nEach entity is given a label in the model, in this case ",(0,i.jsx)(n.code,{children:"artists"}),", which is used to refer to the entity in queries. We also\nuse the optional ",(0,i.jsx)(n.code,{children:"builder"})," function to specify that the entity maps to a table named ",(0,i.jsx)(n.code,{children:"Artist"})," in the database."]}),"\n",(0,i.jsx)(n.p,{children:"These configuration objects are of course just plain JavaScript objects, so you can define them in any\nway that is convenient for you."}),"\n",(0,i.jsx)(n.p,{children:"For example, you could define the entity configuration separately and then reference it in the model. In fact, this is\nsometimes necessary when you have circular references between entities."}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-ts",metastring:"include ./apps/snippets/src/config.ts:separate-config showLineNumbers",children:'const Artist = entity(\n  {\n    artistId: int(),\n    name: string(),\n  },\n  builder => {\n    builder.table("Artist");\n  }\n);\n\nconst db = verse({\n  config: {\n    //...\n  },\n  model: {\n    entities: {\n      artists: Artist,\n    },\n  },\n});\n'})}),"\n",(0,i.jsx)(n.p,{children:"In the next sections, we will drill down into the details of the configuration objects that can be used to define\nthe metadata model."})]})}function h(e={}){const{wrapper:n}={...(0,s.R)(),...e.components};return n?(0,i.jsx)(n,{...e,children:(0,i.jsx)(l,{...e})}):l(e)}},15:(e,n,t)=>{t.d(n,{R:()=>r,x:()=>a});var i=t(1855);const s={},o=i.createContext(s);function r(e){const n=i.useContext(o);return i.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function a(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(s):e.components||s:r(e.components),i.createElement(o.Provider,{value:n},e.children)}}}]);