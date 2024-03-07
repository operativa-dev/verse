"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[9412],{3479:(e,t,s)=>{s.r(t),s.d(t,{assets:()=>d,contentTitle:()=>o,default:()=>p,frontMatter:()=>i,metadata:()=>l,toc:()=>a});var n=s(3159),r=s(7377);const i={title:"EntityType"},o="Type alias: EntityType<Model>",l={id:"api/verse/type-aliases/EntityType",title:"EntityType",description:"EntityType\\ never",source:"@site/docs/api/verse/type-aliases/EntityType.md",sourceDirName:"api/verse/type-aliases",slug:"/api/verse/type-aliases/EntityType",permalink:"/verse/docs/api/verse/type-aliases/EntityType",draft:!1,unlisted:!1,tags:[],version:"current",frontMatter:{title:"EntityType"},sidebar:"apiSidebar",previous:{title:"EntitySets",permalink:"/verse/docs/api/verse/type-aliases/EntitySets"},next:{title:"From",permalink:"/verse/docs/api/verse/type-aliases/From"}},d={},a=[{value:"Example",id:"example",level:2},{value:"Type parameters",id:"type-parameters",level:2},{value:"Source",id:"source",level:2}];function c(e){const t={a:"a",blockquote:"blockquote",code:"code",em:"em",h1:"h1",h2:"h2",p:"p",pre:"pre",strong:"strong",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",...(0,r.R)(),...e.components};return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(t.h1,{id:"type-alias-entitytypemodel",children:"Type alias: EntityType<Model>"}),"\n",(0,n.jsxs)(t.blockquote,{children:["\n",(0,n.jsxs)(t.p,{children:[(0,n.jsx)(t.strong,{children:"EntityType"}),"<",(0,n.jsx)(t.code,{children:"Model"}),">: ",(0,n.jsx)(t.code,{children:"Model"})," extends ",(0,n.jsx)(t.a,{href:"/verse/docs/api/model/model/classes/EntityModel",children:(0,n.jsx)(t.code,{children:"EntityModel"})}),"< infer Properties > ? ",(0,n.jsx)(t.a,{href:"/verse/docs/api/model/builder/type-aliases/UnwrapProperties",children:(0,n.jsx)(t.code,{children:"UnwrapProperties"})}),"< ",(0,n.jsx)(t.code,{children:"Properties"})," > : ",(0,n.jsx)(t.code,{children:"never"})]}),"\n"]}),"\n",(0,n.jsxs)(t.p,{children:["A type that can infer an entity type from an ",(0,n.jsx)(t.a,{href:"/verse/docs/api/model/model/classes/EntityModel",children:"EntityModel"})," when used in conjunction with\nthe ",(0,n.jsx)(t.em,{children:"typeof"})," operator."]}),"\n",(0,n.jsx)(t.h2,{id:"example",children:"Example"}),"\n",(0,n.jsx)(t.pre,{children:(0,n.jsx)(t.code,{className:"language-ts",metastring:"showLineNumbers",children:"const db = verse({\n  config: // ...\n  model: {\n    entities: {\n      customers: entity(\n        // ...\n      )\n    },\n  },\n});\n\ntype Customer = EntityType<typeof db.entities.customers>;\n"})}),"\n",(0,n.jsx)(t.h2,{id:"type-parameters",children:"Type parameters"}),"\n",(0,n.jsxs)(t.table,{children:[(0,n.jsx)(t.thead,{children:(0,n.jsx)(t.tr,{children:(0,n.jsx)(t.th,{style:{textAlign:"left"},children:"Type parameter"})})}),(0,n.jsx)(t.tbody,{children:(0,n.jsx)(t.tr,{children:(0,n.jsxs)(t.td,{style:{textAlign:"left"},children:[(0,n.jsx)(t.code,{children:"Model"})," extends ",(0,n.jsx)(t.a,{href:"/verse/docs/api/model/model/classes/EntityModel",children:(0,n.jsx)(t.code,{children:"EntityModel"})})]})})})]}),"\n",(0,n.jsx)(t.h2,{id:"source",children:"Source"}),"\n",(0,n.jsx)(t.p,{children:(0,n.jsx)(t.a,{href:"https://github.com/operativa-dev/verse/blob/5ca7dc6/packages/verse-core/src/verse.ts#L119",children:"packages/verse-core/src/verse.ts:119"})})]})}function p(e={}){const{wrapper:t}={...(0,r.R)(),...e.components};return t?(0,n.jsx)(t,{...e,children:(0,n.jsx)(c,{...e})}):c(e)}},7377:(e,t,s)=>{s.d(t,{R:()=>o,x:()=>l});var n=s(1855);const r={},i=n.createContext(r);function o(e){const t=n.useContext(i);return n.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function l(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(r):e.components||r:o(e.components),n.createElement(i.Provider,{value:t},e.children)}}}]);