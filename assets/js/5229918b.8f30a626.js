"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[9113],{4577:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>a,contentTitle:()=>o,default:()=>c,frontMatter:()=>i,metadata:()=>l,toc:()=>p});var s=r(3159),n=r(1515);const i={},o="Type alias: UnwrapProperties<T>",l={id:"api/model/builder/type-aliases/UnwrapProperties",title:"Type alias: UnwrapProperties\\<T\\>",description:"UnwrapProperties\\ T[K] extends Property ? R T[K] extends Property ? R : never }",source:"@site/docs/api/model/builder/type-aliases/UnwrapProperties.md",sourceDirName:"api/model/builder/type-aliases",slug:"/api/model/builder/type-aliases/UnwrapProperties",permalink:"/verse/docs/api/model/builder/type-aliases/UnwrapProperties",draft:!1,unlisted:!1,tags:[],version:"current",frontMatter:{},sidebar:"apiSidebar",previous:{title:"Type alias: StringOptions",permalink:"/verse/docs/api/model/builder/type-aliases/StringOptions"},next:{title:"Function: boolean()",permalink:"/verse/docs/api/model/builder/functions/boolean"}},a={},p=[{value:"Type parameters",id:"type-parameters",level:2},{value:"Source",id:"source",level:2}];function d(e){const t={a:"a",blockquote:"blockquote",code:"code",h1:"h1",h2:"h2",p:"p",strong:"strong",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",...(0,n.R)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(t.h1,{id:"type-alias-unwrappropertiest",children:"Type alias: UnwrapProperties<T>"}),"\n",(0,s.jsxs)(t.blockquote,{children:["\n",(0,s.jsxs)(t.p,{children:[(0,s.jsx)(t.strong,{children:"UnwrapProperties"}),"<",(0,s.jsx)(t.code,{children:"T"}),">: ",(0,s.jsx)(t.code,{children:"{ [K in OptionalProperties<T>]?: T[K] extends Property<infer R> ? R : never }"})," & ",(0,s.jsx)(t.code,{children:"{ [K in Exclude<keyof T, OptionalProperties<T>>]: T[K] extends Property<infer R> ? R : never }"})]}),"\n"]}),"\n",(0,s.jsx)(t.p,{children:"A utility type for unwrapping the properties of entity builder properties."}),"\n",(0,s.jsx)(t.h2,{id:"type-parameters",children:"Type parameters"}),"\n",(0,s.jsxs)(t.table,{children:[(0,s.jsx)(t.thead,{children:(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.th,{style:{textAlign:"left"},children:"Type parameter"}),(0,s.jsx)(t.th,{style:{textAlign:"left"},children:"Description"})]})}),(0,s.jsx)(t.tbody,{children:(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{style:{textAlign:"left"},children:(0,s.jsx)(t.code,{children:"T"})}),(0,s.jsx)(t.td,{style:{textAlign:"left"},children:"The type to unwrap the properties from."})]})})]}),"\n",(0,s.jsx)(t.h2,{id:"source",children:"Source"}),"\n",(0,s.jsx)(t.p,{children:(0,s.jsx)(t.a,{href:"https://github.com/operativa-dev/verse/blob/4eae236/packages/verse-core/src/model/builder.ts#L61",children:"packages/verse-core/src/model/builder.ts:61"})})]})}function c(e={}){const{wrapper:t}={...(0,n.R)(),...e.components};return t?(0,s.jsx)(t,{...e,children:(0,s.jsx)(d,{...e})}):d(e)}},1515:(e,t,r)=>{r.d(t,{R:()=>o,x:()=>l});var s=r(1855);const n={},i=s.createContext(n);function o(e){const t=s.useContext(i);return s.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function l(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(n):e.components||n:o(e.components),s.createElement(i.Provider,{value:t},e.children)}}}]);