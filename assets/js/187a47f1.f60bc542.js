"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[9412],{8488:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>a,contentTitle:()=>o,default:()=>p,frontMatter:()=>i,metadata:()=>l,toc:()=>c});var s=n(3159),r=n(6595);const i={title:"EntityType"},o="Type alias: EntityType<Model>",l={id:"api/verse/type-aliases/EntityType",title:"EntityType",description:"EntityType\\ never",source:"@site/docs/api/verse/type-aliases/EntityType.md",sourceDirName:"api/verse/type-aliases",slug:"/api/verse/type-aliases/EntityType",permalink:"/docs/api/verse/type-aliases/EntityType",draft:!1,unlisted:!1,tags:[],version:"current",frontMatter:{title:"EntityType"},sidebar:"apiSidebar",previous:{title:"EntitySets",permalink:"/docs/api/verse/type-aliases/EntitySets"},next:{title:"From",permalink:"/docs/api/verse/type-aliases/From"}},a={},c=[{value:"Example",id:"example",level:2},{value:"Type parameters",id:"type-parameters",level:2},{value:"Source",id:"source",level:2}];function d(e){const t={a:"a",blockquote:"blockquote",code:"code",em:"em",h1:"h1",h2:"h2",p:"p",pre:"pre",strong:"strong",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",...(0,r.R)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(t.h1,{id:"type-alias-entitytypemodel",children:"Type alias: EntityType<Model>"}),"\n",(0,s.jsxs)(t.blockquote,{children:["\n",(0,s.jsxs)(t.p,{children:[(0,s.jsx)(t.strong,{children:"EntityType"}),"<",(0,s.jsx)(t.code,{children:"Model"}),">: ",(0,s.jsx)(t.code,{children:"Model"})," extends ",(0,s.jsx)(t.a,{href:"/docs/api/model/model/classes/EntityModel",children:(0,s.jsx)(t.code,{children:"EntityModel"})}),"< infer Properties > ? ",(0,s.jsx)(t.a,{href:"/docs/api/model/builder/type-aliases/UnwrapProperties",children:(0,s.jsx)(t.code,{children:"UnwrapProperties"})}),"< ",(0,s.jsx)(t.code,{children:"Properties"})," > : ",(0,s.jsx)(t.code,{children:"never"})]}),"\n"]}),"\n",(0,s.jsxs)(t.p,{children:["A type that can infer an entity type from an ",(0,s.jsx)(t.a,{href:"/docs/api/model/model/classes/EntityModel",children:"EntityModel"})," when used in conjunction with\nthe ",(0,s.jsx)(t.em,{children:"typeof"})," operator."]}),"\n",(0,s.jsx)(t.h2,{id:"example",children:"Example"}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-ts",metastring:"showLineNumbers",children:"const db = verse({\n  config: // ...\n  model: {\n    entities: {\n      customers: entity(\n        // ...\n      )\n    },\n  },\n});\n\ntype Customer = EntityType<typeof db.entities.customers>;\n"})}),"\n",(0,s.jsx)(t.h2,{id:"type-parameters",children:"Type parameters"}),"\n",(0,s.jsxs)(t.table,{children:[(0,s.jsx)(t.thead,{children:(0,s.jsx)(t.tr,{children:(0,s.jsx)(t.th,{style:{textAlign:"left"},children:"Type parameter"})})}),(0,s.jsx)(t.tbody,{children:(0,s.jsx)(t.tr,{children:(0,s.jsxs)(t.td,{style:{textAlign:"left"},children:[(0,s.jsx)(t.code,{children:"Model"})," extends ",(0,s.jsx)(t.a,{href:"/docs/api/model/model/classes/EntityModel",children:(0,s.jsx)(t.code,{children:"EntityModel"})})]})})})]}),"\n",(0,s.jsx)(t.h2,{id:"source",children:"Source"}),"\n",(0,s.jsx)(t.p,{children:(0,s.jsx)(t.a,{href:"https://github.com/operativa-dev/verse/blob/ee00038319804ef38c50a82b1b67bfea30cfe34e/packages/verse-core/src/verse.ts#L124",children:"packages/verse-core/src/verse.ts:124"})})]})}function p(e={}){const{wrapper:t}={...(0,r.R)(),...e.components};return t?(0,s.jsx)(t,{...e,children:(0,s.jsx)(d,{...e})}):d(e)}},6595:(e,t,n)=>{n.d(t,{R:()=>o,x:()=>l});var s=n(1855);const r={},i=s.createContext(r);function o(e){const t=s.useContext(i);return s.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function l(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(r):e.components||r:o(e.components),s.createElement(i.Provider,{value:t},e.children)}}}]);