"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[15],{9444:(e,s,n)=>{n.r(s),n.d(s,{assets:()=>a,contentTitle:()=>r,default:()=>p,frontMatter:()=>o,metadata:()=>l,toc:()=>d});var t=n(3159),i=n(15);const o={title:"QueryOptions"},r="Type alias: QueryOptions",l={id:"api/verse/type-aliases/QueryOptions",title:"QueryOptions",description:'QueryOptions "all" \\| readonly string[];  }',source:"@site/docs/api/verse/type-aliases/QueryOptions.md",sourceDirName:"api/verse/type-aliases",slug:"/api/verse/type-aliases/QueryOptions",permalink:"/docs/api/verse/type-aliases/QueryOptions",draft:!1,unlisted:!1,tags:[],version:"current",frontMatter:{title:"QueryOptions"},sidebar:"apiSidebar",previous:{title:"ModelBuilder",permalink:"/docs/api/verse/type-aliases/ModelBuilder"},next:{title:"QueryResult",permalink:"/docs/api/verse/type-aliases/QueryResult"}},a={},d=[{value:"Type declaration",id:"type-declaration",level:2},{value:"disabledConditions?",id:"disabledconditions",level:3},{value:"Example",id:"example",level:4},{value:"Source",id:"source",level:2}];function c(e){const s={a:"a",blockquote:"blockquote",code:"code",h1:"h1",h2:"h2",h3:"h3",h4:"h4",p:"p",pre:"pre",strong:"strong",...(0,i.R)(),...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(s.h1,{id:"type-alias-queryoptions",children:"Type alias: QueryOptions"}),"\n",(0,t.jsxs)(s.blockquote,{children:["\n",(0,t.jsxs)(s.p,{children:[(0,t.jsx)(s.strong,{children:"QueryOptions"}),": {",(0,t.jsx)(s.code,{children:"disabledConditions"}),": ",(0,t.jsx)(s.code,{children:'"all"'})," | readonly ",(0,t.jsx)(s.code,{children:"string"}),"[];  }"]}),"\n"]}),"\n",(0,t.jsx)(s.p,{children:"Settings that affect the behaviour of individual queries, such as disabling default entity\nquery conditions. Used in conjunction with the RootQueryOperations.options query operator."}),"\n",(0,t.jsx)(s.h2,{id:"type-declaration",children:"Type declaration"}),"\n",(0,t.jsx)(s.h3,{id:"disabledconditions",children:"disabledConditions?"}),"\n",(0,t.jsxs)(s.blockquote,{children:["\n",(0,t.jsxs)(s.p,{children:[(0,t.jsx)(s.strong,{children:(0,t.jsx)(s.code,{children:"optional"})})," ",(0,t.jsx)(s.strong,{children:"disabledConditions"}),": ",(0,t.jsx)(s.code,{children:'"all"'})," | readonly ",(0,t.jsx)(s.code,{children:"string"}),"[]"]}),"\n"]}),"\n",(0,t.jsx)(s.p,{children:"Disables entity query conditions for the query."}),"\n",(0,t.jsx)(s.h4,{id:"example",children:"Example"}),"\n",(0,t.jsx)(s.pre,{children:(0,t.jsx)(s.code,{className:"language-ts",metastring:"showLineNumbers",children:'// Disable the default "soft delete" condition for the query.\nconst q =\n  db.from.products.options({ disabledConditions: ["soft delete"] });\n'})}),"\n",(0,t.jsx)(s.h2,{id:"source",children:"Source"}),"\n",(0,t.jsx)(s.p,{children:(0,t.jsx)(s.a,{href:"https://github.com/operativa-dev/verse/blob/63ad83c4/packages/verse-core/src/verse.ts#L134",children:"packages/verse-core/src/verse.ts:134"})})]})}function p(e={}){const{wrapper:s}={...(0,i.R)(),...e.components};return s?(0,t.jsx)(s,{...e,children:(0,t.jsx)(c,{...e})}):c(e)}},15:(e,s,n)=>{n.d(s,{R:()=>r,x:()=>l});var t=n(1855);const i={},o=t.createContext(i);function r(e){const s=t.useContext(o);return t.useMemo((function(){return"function"==typeof e?e(s):{...s,...e}}),[s,e])}function l(e){let s;return s=e.disableParentContext?"function"==typeof e.components?e.components(i):e.components||i:r(e.components),t.createElement(o.Provider,{value:s},e.children)}}}]);