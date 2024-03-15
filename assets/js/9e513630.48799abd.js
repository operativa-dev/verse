"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[4121],{4134:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>d,contentTitle:()=>i,default:()=>h,frontMatter:()=>n,metadata:()=>a,toc:()=>o});var s=r(3159),l=r(6374);const n={title:"RootQueryOperations"},i="Type alias: RootQueryOperations<TQueryable>",a={id:"api/verse/type-aliases/RootQueryOperations",title:"RootQueryOperations",description:"RootQueryOperations\\ TQueryable;sql: TQueryable;  }",source:"@site/docs/api/verse/type-aliases/RootQueryOperations.md",sourceDirName:"api/verse/type-aliases",slug:"/api/verse/type-aliases/RootQueryOperations",permalink:"/docs/api/verse/type-aliases/RootQueryOperations",draft:!1,unlisted:!1,tags:[],version:"current",frontMatter:{title:"RootQueryOperations"},sidebar:"apiSidebar",previous:{title:"QueryResult",permalink:"/docs/api/verse/type-aliases/QueryResult"},next:{title:"UnitOfWork",permalink:"/docs/api/verse/type-aliases/UnitOfWork"}},d={},o=[{value:"Type parameters",id:"type-parameters",level:2},{value:"Type declaration",id:"type-declaration",level:2},{value:"options()",id:"options",level:3},{value:"Parameters",id:"parameters",level:4},{value:"Returns",id:"returns",level:4},{value:"Example",id:"example",level:4},{value:"sql()",id:"sql",level:3},{value:"Parameters",id:"parameters-1",level:4},{value:"Returns",id:"returns-1",level:4},{value:"Example",id:"example-1",level:4},{value:"Source",id:"source",level:2}];function c(e){const t={a:"a",blockquote:"blockquote",code:"code",h1:"h1",h2:"h2",h3:"h3",h4:"h4",p:"p",pre:"pre",strong:"strong",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",...(0,l.R)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(t.h1,{id:"type-alias-rootqueryoperationstqueryable",children:"Type alias: RootQueryOperations<TQueryable>"}),"\n",(0,s.jsxs)(t.blockquote,{children:["\n",(0,s.jsxs)(t.p,{children:[(0,s.jsx)(t.strong,{children:"RootQueryOperations"}),"<",(0,s.jsx)(t.code,{children:"TQueryable"}),">: {",(0,s.jsx)(t.code,{children:"options"}),": ",(0,s.jsx)(t.code,{children:"TQueryable"}),";",(0,s.jsx)(t.code,{children:"sql"}),": ",(0,s.jsx)(t.code,{children:"TQueryable"}),";  }"]}),"\n"]}),"\n",(0,s.jsx)(t.h2,{id:"type-parameters",children:"Type parameters"}),"\n",(0,s.jsxs)(t.table,{children:[(0,s.jsx)(t.thead,{children:(0,s.jsx)(t.tr,{children:(0,s.jsx)(t.th,{style:{textAlign:"left"},children:"Type parameter"})})}),(0,s.jsx)(t.tbody,{children:(0,s.jsx)(t.tr,{children:(0,s.jsxs)(t.td,{style:{textAlign:"left"},children:[(0,s.jsx)(t.code,{children:"TQueryable"})," extends ",(0,s.jsx)(t.a,{href:"/docs/api/query/queryable/classes/AbstractQueryable",children:(0,s.jsx)(t.code,{children:"AbstractQueryable"})})]})})})]}),"\n",(0,s.jsx)(t.h2,{id:"type-declaration",children:"Type declaration"}),"\n",(0,s.jsx)(t.h3,{id:"options",children:"options()"}),"\n",(0,s.jsx)(t.p,{children:"Set query options that affect the behaviour of the query."}),"\n",(0,s.jsx)(t.h4,{id:"parameters",children:"Parameters"}),"\n",(0,s.jsxs)(t.table,{children:[(0,s.jsx)(t.thead,{children:(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.th,{style:{textAlign:"left"},children:"Parameter"}),(0,s.jsx)(t.th,{style:{textAlign:"left"},children:"Type"}),(0,s.jsx)(t.th,{style:{textAlign:"left"},children:"Description"})]})}),(0,s.jsx)(t.tbody,{children:(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{style:{textAlign:"left"},children:(0,s.jsx)(t.code,{children:"options"})}),(0,s.jsx)(t.td,{style:{textAlign:"left"},children:(0,s.jsx)(t.a,{href:"/docs/api/verse/type-aliases/QueryOptions",children:(0,s.jsx)(t.code,{children:"QueryOptions"})})}),(0,s.jsx)(t.td,{style:{textAlign:"left"},children:"The query options."})]})})]}),"\n",(0,s.jsx)(t.h4,{id:"returns",children:"Returns"}),"\n",(0,s.jsx)(t.p,{children:(0,s.jsx)(t.code,{children:"TQueryable"})}),"\n",(0,s.jsx)(t.p,{children:"The queryable with the specified options applied."}),"\n",(0,s.jsx)(t.h4,{id:"example",children:"Example"}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-ts",metastring:"showLineNumbers",children:'const q =\n  db.from.albums.options({ disabledConditions: ["soft delete"] });\n'})}),"\n",(0,s.jsx)(t.h3,{id:"sql",children:"sql()"}),"\n",(0,s.jsx)(t.p,{children:"Inject a raw SQL query using tagged template literals. The returned queryable may be further\ncomposed with additional query operators."}),"\n",(0,s.jsx)(t.h4,{id:"parameters-1",children:"Parameters"}),"\n",(0,s.jsxs)(t.table,{children:[(0,s.jsx)(t.thead,{children:(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.th,{style:{textAlign:"left"},children:"Parameter"}),(0,s.jsx)(t.th,{style:{textAlign:"left"},children:"Type"}),(0,s.jsx)(t.th,{style:{textAlign:"left"},children:"Description"})]})}),(0,s.jsxs)(t.tbody,{children:[(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{style:{textAlign:"left"},children:(0,s.jsx)(t.code,{children:"strings"})}),(0,s.jsx)(t.td,{style:{textAlign:"left"},children:(0,s.jsx)(t.code,{children:"TemplateStringsArray"})}),(0,s.jsx)(t.td,{style:{textAlign:"left"},children:"The SQL query template string."})]}),(0,s.jsxs)(t.tr,{children:[(0,s.jsxs)(t.td,{style:{textAlign:"left"},children:["...",(0,s.jsx)(t.code,{children:"values"})]}),(0,s.jsxs)(t.td,{style:{textAlign:"left"},children:[(0,s.jsx)(t.code,{children:"any"}),"[]"]}),(0,s.jsx)(t.td,{style:{textAlign:"left"},children:"The values to be inserted into the query."})]})]})]}),"\n",(0,s.jsx)(t.h4,{id:"returns-1",children:"Returns"}),"\n",(0,s.jsx)(t.p,{children:(0,s.jsx)(t.code,{children:"TQueryable"})}),"\n",(0,s.jsx)(t.p,{children:"The queryable result of the injected SQL query."}),"\n",(0,s.jsx)(t.h4,{id:"example-1",children:"Example"}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-ts",metastring:"showLineNumbers",children:'const id = 1;\nconst album =\n  db.from.albums\n    .sql`select * from "Album" where "AlbumId" = ${id}`.single();\n'})}),"\n",(0,s.jsx)(t.h2,{id:"source",children:"Source"}),"\n",(0,s.jsx)(t.p,{children:(0,s.jsx)(t.a,{href:"https://github.com/operativa-dev/verse/blob/7612a404/packages/verse-core/src/verse.ts#L159",children:"packages/verse-core/src/verse.ts:159"})})]})}function h(e={}){const{wrapper:t}={...(0,l.R)(),...e.components};return t?(0,s.jsx)(t,{...e,children:(0,s.jsx)(c,{...e})}):c(e)}},6374:(e,t,r)=>{r.d(t,{R:()=>i,x:()=>a});var s=r(1855);const l={},n=s.createContext(l);function i(e){const t=s.useContext(n);return s.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function a(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(l):e.components||l:i(e.components),s.createElement(n.Provider,{value:t},e.children)}}}]);