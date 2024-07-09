"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[7773],{189:(e,r,t)=>{t.r(r),t.d(r,{assets:()=>c,contentTitle:()=>o,default:()=>l,frontMatter:()=>i,metadata:()=>a,toc:()=>u});var n=t(5723),s=t(3327);const i={},o="Compiled Queries",a={id:"ref/Querying/compiled-queries",title:"Compiled Queries",description:"Verse has another query type called a compiled query. Compiled queries are a way to pre-compile a query and then execute it multiple times.",source:"@site/docs/ref/03-Querying/03-compiled-queries.mdx",sourceDirName:"ref/03-Querying",slug:"/ref/Querying/compiled-queries",permalink:"/docs/ref/Querying/compiled-queries",draft:!1,unlisted:!1,editUrl:"https://github.com/operativa-dev/verse/edit/main/apps/docs/docs/ref",tags:[],version:"current",sidebarPosition:3,frontMatter:{},sidebar:"refSidebar",previous:{title:"Parameters",permalink:"/docs/ref/Querying/parameters"},next:{title:"Eager Loading",permalink:"/docs/ref/Querying/eager-loading"}},c={},u=[];function d(e){const r={code:"code",h1:"h1",p:"p",pre:"pre",...(0,s.R)(),...e.components};return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(r.h1,{id:"compiled-queries",children:"Compiled Queries"}),"\n",(0,n.jsx)(r.p,{children:"Verse has another query type called a compiled query. Compiled queries are a way to pre-compile a query and then execute it multiple times.\nThis can be useful if you have a query that gets run many times and with different parameters."}),"\n",(0,n.jsx)(r.p,{children:"Here's an example of a compiled query:"}),"\n",(0,n.jsx)(r.pre,{children:(0,n.jsx)(r.code,{className:"language-ts",metastring:"include ./apps/snippets/src/query.ts:compiled showLineNumbers",children:"const artistsQuery = db.compile((from, $count: number) =>\n  from.artists.where(\n    ar => from.albums.where(al => ar.artistId === al.artistId).count() > $count\n  )\n);\n\nconst result1 = await artistsQuery(3).toArray();\nconst result2 = await artistsQuery(5).toArray();\n"})}),"\n",(0,n.jsxs)(r.p,{children:["In this example, we're creating a compiled query that takes two parameters: ",(0,n.jsx)(r.code,{children:"from"})," and ",(0,n.jsx)(r.code,{children:"$count"}),". The ",(0,n.jsx)(r.code,{children:"from"})," parameter is the query\nroot (just like the ",(0,n.jsx)(r.code,{children:"from"})," property on the Verse object), and the ",(0,n.jsx)(r.code,{children:"$count"})," parameter is the number of albums that an artist\nmust have to be included in the result. The ",(0,n.jsx)(r.code,{children:"compile"})," method returns a function that we can call each time we want to execute the query."]})]})}function l(e={}){const{wrapper:r}={...(0,s.R)(),...e.components};return r?(0,n.jsx)(r,{...e,children:(0,n.jsx)(d,{...e})}):d(e)}},3327:(e,r,t)=>{t.d(r,{R:()=>o,x:()=>a});var n=t(2155);const s={},i=n.createContext(s);function o(e){const r=n.useContext(i);return n.useMemo((function(){return"function"==typeof e?e(r):{...r,...e}}),[r,e])}function a(e){let r;return r=e.disableParentContext?"function"==typeof e.components?e.components(s):e.components||s:o(e.components),n.createElement(i.Provider,{value:r},e.children)}}}]);