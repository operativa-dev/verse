"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[4315],{368:(e,s,r)=>{r.r(s),r.d(s,{assets:()=>i,contentTitle:()=>a,default:()=>h,frontMatter:()=>c,metadata:()=>l,toc:()=>d});var t=r(3159),n=r(6595);const c={title:"DbOperations"},a="Class: DbOperations",l={id:"api/verse/classes/DbOperations",title:"DbOperations",description:"Contains methods to perform various operations on the current database.",source:"@site/docs/api/verse/classes/DbOperations.md",sourceDirName:"api/verse/classes",slug:"/api/verse/classes/DbOperations",permalink:"/docs/api/verse/classes/DbOperations",draft:!1,unlisted:!1,tags:[],version:"current",frontMatter:{title:"DbOperations"},sidebar:"apiSidebar",previous:{title:"verse",permalink:"/docs/api/verse/"},next:{title:"Verse",permalink:"/docs/api/verse/classes/Verse"}},i={},d=[{value:"Constructors",id:"constructors",level:2},{value:"new DbOperations(metadata)",id:"new-dboperationsmetadata",level:3},{value:"Parameters",id:"parameters",level:4},{value:"Returns",id:"returns",level:4},{value:"Source",id:"source",level:4},{value:"Methods",id:"methods",level:2},{value:"exists()",id:"exists",level:3},{value:"Returns",id:"returns-1",level:4},{value:"Source",id:"source-1",level:4},{value:"recreate()",id:"recreate",level:3},{value:"Parameters",id:"parameters-1",level:4},{value:"Returns",id:"returns-2",level:4},{value:"Source",id:"source-2",level:4},{value:"schema()",id:"schema",level:3},{value:"Returns",id:"returns-3",level:4},{value:"Source",id:"source-3",level:4}];function o(e){const s={a:"a",blockquote:"blockquote",code:"code",h1:"h1",h2:"h2",h3:"h3",h4:"h4",hr:"hr",p:"p",strong:"strong",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",...(0,n.R)(),...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(s.h1,{id:"class-dboperations",children:"Class: DbOperations"}),"\n",(0,t.jsx)(s.p,{children:"Contains methods to perform various operations on the current database."}),"\n",(0,t.jsx)(s.h2,{id:"constructors",children:"Constructors"}),"\n",(0,t.jsx)(s.h3,{id:"new-dboperationsmetadata",children:"new DbOperations(metadata)"}),"\n",(0,t.jsxs)(s.blockquote,{children:["\n",(0,t.jsxs)(s.p,{children:[(0,t.jsx)(s.strong,{children:"new DbOperations"}),"(",(0,t.jsx)(s.code,{children:"metadata"}),": ",(0,t.jsx)(s.a,{href:"/docs/api/verse/type-aliases/Metadata",children:(0,t.jsx)(s.code,{children:"Metadata"})}),"): ",(0,t.jsx)(s.a,{href:"/docs/api/verse/classes/DbOperations",children:(0,t.jsx)(s.code,{children:"DbOperations"})})]}),"\n"]}),"\n",(0,t.jsx)(s.p,{children:"Creates a new instance."}),"\n",(0,t.jsx)(s.h4,{id:"parameters",children:"Parameters"}),"\n",(0,t.jsxs)(s.table,{children:[(0,t.jsx)(s.thead,{children:(0,t.jsxs)(s.tr,{children:[(0,t.jsx)(s.th,{style:{textAlign:"left"},children:"Parameter"}),(0,t.jsx)(s.th,{style:{textAlign:"left"},children:"Type"}),(0,t.jsx)(s.th,{style:{textAlign:"left"},children:"Description"})]})}),(0,t.jsx)(s.tbody,{children:(0,t.jsxs)(s.tr,{children:[(0,t.jsx)(s.td,{style:{textAlign:"left"},children:(0,t.jsx)(s.code,{children:"metadata"})}),(0,t.jsx)(s.td,{style:{textAlign:"left"},children:(0,t.jsx)(s.a,{href:"/docs/api/verse/type-aliases/Metadata",children:(0,t.jsx)(s.code,{children:"Metadata"})})}),(0,t.jsx)(s.td,{style:{textAlign:"left"},children:"The Verse metadata object."})]})})]}),"\n",(0,t.jsx)(s.h4,{id:"returns",children:"Returns"}),"\n",(0,t.jsx)(s.p,{children:(0,t.jsx)(s.a,{href:"/docs/api/verse/classes/DbOperations",children:(0,t.jsx)(s.code,{children:"DbOperations"})})}),"\n",(0,t.jsx)(s.h4,{id:"source",children:"Source"}),"\n",(0,t.jsx)(s.p,{children:(0,t.jsx)(s.a,{href:"https://github.com/operativa-dev/verse/blob/ee00038319804ef38c50a82b1b67bfea30cfe34e/packages/verse-core/src/verse.ts#L547",children:"packages/verse-core/src/verse.ts:547"})}),"\n",(0,t.jsx)(s.h2,{id:"methods",children:"Methods"}),"\n",(0,t.jsx)(s.h3,{id:"exists",children:"exists()"}),"\n",(0,t.jsxs)(s.blockquote,{children:["\n",(0,t.jsxs)(s.p,{children:[(0,t.jsx)(s.strong,{children:"exists"}),"(): ",(0,t.jsx)(s.a,{href:"https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise",children:(0,t.jsx)(s.code,{children:"Promise"})}),"< ",(0,t.jsx)(s.code,{children:"boolean"})," >"]}),"\n"]}),"\n",(0,t.jsx)(s.p,{children:"Determine whether the target database exists."}),"\n",(0,t.jsx)(s.h4,{id:"returns-1",children:"Returns"}),"\n",(0,t.jsxs)(s.p,{children:[(0,t.jsx)(s.a,{href:"https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise",children:(0,t.jsx)(s.code,{children:"Promise"})}),"< ",(0,t.jsx)(s.code,{children:"boolean"})," >"]}),"\n",(0,t.jsxs)(s.p,{children:["A promise that resolves to ",(0,t.jsx)(s.code,{children:"true"})," if the database exists, otherwise ",(0,t.jsx)(s.code,{children:"false"}),"."]}),"\n",(0,t.jsx)(s.h4,{id:"source-1",children:"Source"}),"\n",(0,t.jsx)(s.p,{children:(0,t.jsx)(s.a,{href:"https://github.com/operativa-dev/verse/blob/ee00038319804ef38c50a82b1b67bfea30cfe34e/packages/verse-core/src/verse.ts#L555",children:"packages/verse-core/src/verse.ts:555"})}),"\n",(0,t.jsx)(s.hr,{}),"\n",(0,t.jsx)(s.h3,{id:"recreate",children:"recreate()"}),"\n",(0,t.jsxs)(s.blockquote,{children:["\n",(0,t.jsxs)(s.p,{children:[(0,t.jsx)(s.strong,{children:"recreate"}),"(",(0,t.jsx)(s.code,{children:"seed"}),": ",(0,t.jsx)(s.code,{children:"boolean"}),"): ",(0,t.jsx)(s.a,{href:"https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise",children:(0,t.jsx)(s.code,{children:"Promise"})}),"< ",(0,t.jsx)(s.code,{children:"void"})," >"]}),"\n"]}),"\n",(0,t.jsx)(s.p,{children:"Re-create the database schema, and, optionally, seed the database with any seed data defined in the model."}),"\n",(0,t.jsx)(s.p,{children:"NB: This will drop the target database if it exists."}),"\n",(0,t.jsx)(s.h4,{id:"parameters-1",children:"Parameters"}),"\n",(0,t.jsxs)(s.table,{children:[(0,t.jsx)(s.thead,{children:(0,t.jsxs)(s.tr,{children:[(0,t.jsx)(s.th,{style:{textAlign:"left"},children:"Parameter"}),(0,t.jsx)(s.th,{style:{textAlign:"left"},children:"Type"}),(0,t.jsx)(s.th,{style:{textAlign:"left"},children:"Default value"}),(0,t.jsx)(s.th,{style:{textAlign:"left"},children:"Description"})]})}),(0,t.jsx)(s.tbody,{children:(0,t.jsxs)(s.tr,{children:[(0,t.jsx)(s.td,{style:{textAlign:"left"},children:(0,t.jsx)(s.code,{children:"seed"})}),(0,t.jsx)(s.td,{style:{textAlign:"left"},children:(0,t.jsx)(s.code,{children:"boolean"})}),(0,t.jsx)(s.td,{style:{textAlign:"left"},children:(0,t.jsx)(s.code,{children:"true"})}),(0,t.jsx)(s.td,{style:{textAlign:"left"},children:"Whether to seed the database with any seed data defined in the model."})]})})]}),"\n",(0,t.jsx)(s.h4,{id:"returns-2",children:"Returns"}),"\n",(0,t.jsxs)(s.p,{children:[(0,t.jsx)(s.a,{href:"https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise",children:(0,t.jsx)(s.code,{children:"Promise"})}),"< ",(0,t.jsx)(s.code,{children:"void"})," >"]}),"\n",(0,t.jsx)(s.p,{children:"A promise that resolves when the schema has been created."}),"\n",(0,t.jsx)(s.h4,{id:"source-2",children:"Source"}),"\n",(0,t.jsx)(s.p,{children:(0,t.jsx)(s.a,{href:"https://github.com/operativa-dev/verse/blob/ee00038319804ef38c50a82b1b67bfea30cfe34e/packages/verse-core/src/verse.ts#L575",children:"packages/verse-core/src/verse.ts:575"})}),"\n",(0,t.jsx)(s.hr,{}),"\n",(0,t.jsx)(s.h3,{id:"schema",children:"schema()"}),"\n",(0,t.jsxs)(s.blockquote,{children:["\n",(0,t.jsxs)(s.p,{children:[(0,t.jsx)(s.strong,{children:"schema"}),"(): ",(0,t.jsx)(s.code,{children:"List"}),"< ",(0,t.jsx)(s.a,{href:"/docs/api/db/sql/classes/SqlNode",children:(0,t.jsx)(s.code,{children:"SqlNode"})})," >"]}),"\n"]}),"\n",(0,t.jsx)(s.p,{children:"Get a list of SQL operations that could be executed to create the database schema."}),"\n",(0,t.jsx)(s.h4,{id:"returns-3",children:"Returns"}),"\n",(0,t.jsxs)(s.p,{children:[(0,t.jsx)(s.code,{children:"List"}),"< ",(0,t.jsx)(s.a,{href:"/docs/api/db/sql/classes/SqlNode",children:(0,t.jsx)(s.code,{children:"SqlNode"})})," >"]}),"\n",(0,t.jsx)(s.p,{children:"A list of SQL operations."}),"\n",(0,t.jsx)(s.h4,{id:"source-3",children:"Source"}),"\n",(0,t.jsx)(s.p,{children:(0,t.jsx)(s.a,{href:"https://github.com/operativa-dev/verse/blob/ee00038319804ef38c50a82b1b67bfea30cfe34e/packages/verse-core/src/verse.ts#L563",children:"packages/verse-core/src/verse.ts:563"})})]})}function h(e={}){const{wrapper:s}={...(0,n.R)(),...e.components};return s?(0,t.jsx)(s,{...e,children:(0,t.jsx)(o,{...e})}):o(e)}},6595:(e,s,r)=>{r.d(s,{R:()=>a,x:()=>l});var t=r(1855);const n={},c=t.createContext(n);function a(e){const s=t.useContext(c);return t.useMemo((function(){return"function"==typeof e?e(s):{...s,...e}}),[s,e])}function l(e){let s;return s=e.disableParentContext?"function"==typeof e.components?e.components(n):e.components||n:a(e.components),t.createElement(c.Provider,{value:s},e.children)}}}]);