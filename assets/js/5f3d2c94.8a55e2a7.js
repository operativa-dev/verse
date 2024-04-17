"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[4461],{9541:(n,e,t)=>{t.r(e),t.d(e,{assets:()=>a,contentTitle:()=>c,default:()=>h,frontMatter:()=>s,metadata:()=>r,toc:()=>d});var o=t(3159),i=t(6595);const s={},c="Customizing",r={id:"ref/Configuration/Conventions/customizing",title:"Customizing",description:"Conventions can be customized to suit the standards and idioms of your project. This makes it easier to enforce a consistent",source:"@site/docs/ref/02-Configuration/08-Conventions/02-customizing.mdx",sourceDirName:"ref/02-Configuration/08-Conventions",slug:"/ref/Configuration/Conventions/customizing",permalink:"/docs/ref/Configuration/Conventions/customizing",draft:!1,unlisted:!1,editUrl:"https://github.com/operativa-dev/verse/edit/main/apps/docs",tags:[],version:"current",sidebarPosition:2,frontMatter:{},sidebar:"refSidebar",previous:{title:"Overview",permalink:"/docs/ref/Configuration/Conventions/overview"},next:{title:"Overview",permalink:"/docs/ref/Querying/overview"}},a={},d=[{value:"Customization Hook",id:"customization-hook",level:2},{value:"Customizing Existing Conventions",id:"customizing-existing-conventions",level:2},{value:"Creating New Conventions",id:"creating-new-conventions",level:2}];function l(n){const e={a:"a",code:"code",h1:"h1",h2:"h2",p:"p",pre:"pre",...(0,i.R)(),...n.components};return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(e.h1,{id:"customizing",children:"Customizing"}),"\n",(0,o.jsx)(e.p,{children:"Conventions can be customized to suit the standards and idioms of your project. This makes it easier to enforce a consistent\nstyle and structure across your codebase, greatly reducing configuration boilerplate and duplication."}),"\n",(0,o.jsx)(e.p,{children:"Customization can be achieved by modifying, replacing or removing the default conventions provided by the library, or by\ncreating completely new conventions from scratch."}),"\n",(0,o.jsx)(e.h2,{id:"customization-hook",children:"Customization Hook"}),"\n",(0,o.jsxs)(e.p,{children:["By now you should be familiar with the ",(0,o.jsx)(e.a,{href:"../../../api/verse/type-aliases/Config",children:"Config"})," object that is passed to the ",(0,o.jsx)(e.code,{children:"verse"}),"\nfunction on startup. This object has an optional ",(0,o.jsx)(e.code,{children:"conventions"})," property that can be used to modify the conventions\nbefore they get added to the ",(0,o.jsx)(e.code,{children:"verse"})," instance."]}),"\n",(0,o.jsx)(e.pre,{children:(0,o.jsx)(e.code,{className:"language-ts",metastring:"include ./apps/snippets/src/conventions.ts:on-adding-conventions showLineNumbers",children:"const db = verse({\n  config: {\n    conventions: (conventions: Convention[]) => {\n      // Modify the conventions here.\n      return conventions;\n    },\n  },\n});\n"})}),"\n",(0,o.jsx)(e.h2,{id:"customizing-existing-conventions",children:"Customizing Existing Conventions"}),"\n",(0,o.jsxs)(e.p,{children:["Some built-in conventions can be customized by modifying their properties. For example, you can change the default\nmax length of a string column by modifying the ",(0,o.jsx)(e.code,{children:"maxLength"})," property of the ",(0,o.jsx)(e.code,{children:"MaxLengthDefault"})," convention."]}),"\n",(0,o.jsxs)(e.p,{children:["Since conventions are often immutable, like in the case of the ",(0,o.jsx)(e.code,{children:"MaxLengthDefault"})," convention, you can create a new\ninstance of the convention with the desired properties, and then replace the existing convention with the new one."]}),"\n",(0,o.jsx)(e.pre,{children:(0,o.jsx)(e.code,{className:"language-ts",metastring:"include ./apps/snippets/src/conventions.ts:existing showLineNumbers",children:"const db = verse({\n  config: {\n    conventions: (conventions: Convention[]) => {\n      const index = conventions.findIndex(c => c instanceof MaxLengthDefault);\n\n      conventions[index] = new MaxLengthDefault(100);\n\n      return conventions;\n    },\n  },\n});\n"})}),"\n",(0,o.jsx)(e.p,{children:"Now all string columns will have a default max length of 100 characters."}),"\n",(0,o.jsx)(e.h2,{id:"creating-new-conventions",children:"Creating New Conventions"}),"\n",(0,o.jsxs)(e.p,{children:["You can create a new convention by implementing the ",(0,o.jsx)(e.a,{href:"../../../api/conventions/convention/interfaces/Convention",children:(0,o.jsx)(e.code,{children:"Convention"})}),"\ninterface or, more conveniently, by extending the\n",(0,o.jsx)(e.a,{href:"../../../api/conventions/convention/classes/AbstractConvention",children:(0,o.jsx)(e.code,{children:"AbstractConvention"})})," class."]}),"\n",(0,o.jsx)(e.p,{children:"Conventions work by visiting the metadata model, and making changes to it based on the rules defined in the convention."}),"\n",(0,o.jsx)(e.p,{children:"For example, let's create a convention that adds a prefix to all table names."}),"\n",(0,o.jsx)(e.pre,{children:(0,o.jsx)(e.code,{className:"language-ts",metastring:"include ./apps/snippets/src/conventions.ts:custom-1 showLineNumbers",children:'class PrefixTables extends AbstractConvention {\n  constructor(readonly prefix = "tbl_") {\n    super();\n  }\n\n  override visitEntity(entity: EntityModel) {\n    return entity.withTable(this.prefix + entity.table);\n  }\n}\n'})}),"\n",(0,o.jsxs)(e.p,{children:["Because we are extending the ",(0,o.jsx)(e.code,{children:"AbstractConvention"})," class, we only need to implement the ",(0,o.jsx)(e.code,{children:"visitEntity"})," method. This method\nwill be called for every entity in the metadata model, and we can modify the entity as needed."]}),"\n",(0,o.jsxs)(e.p,{children:["Now we can add this convention to the ",(0,o.jsx)(e.code,{children:"verse"})," instance."]}),"\n",(0,o.jsx)(e.pre,{children:(0,o.jsx)(e.code,{className:"language-ts",metastring:"include ./apps/snippets/src/conventions.ts:custom-2 showLineNumbers",children:"const db = verse({\n  config: {\n    conventions: (conventions: Convention[]) => {\n      conventions.push(new PrefixTables());\n\n      return conventions;\n    },\n  },\n});\n"})}),"\n",(0,o.jsx)(e.p,{children:"We add our new convention to the end of the list of conventions. This is important because the order of conventions\nmatters. Conventions are applied in the order they are added, so later conventions can override or depend on changes\nmade by earlier ones. In this case, we want to apply the prefix only after the table name has been initially set."})]})}function h(n={}){const{wrapper:e}={...(0,i.R)(),...n.components};return e?(0,o.jsx)(e,{...n,children:(0,o.jsx)(l,{...n})}):l(n)}},6595:(n,e,t)=>{t.d(e,{R:()=>c,x:()=>r});var o=t(1855);const i={},s=o.createContext(i);function c(n){const e=o.useContext(s);return o.useMemo((function(){return"function"==typeof n?n(e):{...e,...n}}),[e,n])}function r(n){let e;return e=n.disableParentContext?"function"==typeof n.components?n.components(i):n.components||i:c(n.components),o.createElement(s.Provider,{value:e},n.children)}}}]);