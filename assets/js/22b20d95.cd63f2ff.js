"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[6229],{3588:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>c,contentTitle:()=>o,default:()=>h,frontMatter:()=>i,metadata:()=>a,toc:()=>l});var r=t(3159),s=t(6374);const i={},o="Overview",a={id:"ref/Querying/overview",title:"Overview",description:"Querying in Verse is based on a fluent, compositional, pipeline-style API. This means that you chain together a",source:"@site/docs/ref/03-Querying/00-overview.mdx",sourceDirName:"ref/03-Querying",slug:"/ref/Querying/overview",permalink:"/docs/ref/Querying/overview",draft:!1,unlisted:!1,editUrl:"https://github.com/operativa-dev/verse/edit/main/apps/docs",tags:[],version:"current",sidebarPosition:0,frontMatter:{},sidebar:"refSidebar",previous:{title:"Introduction",permalink:"/docs/ref/Configuration/intro"},next:{title:"Introduction",permalink:"/docs/ref/Updating/intro"}},c={},l=[];function d(e){const n={admonition:"admonition",code:"code",h1:"h1",p:"p",pre:"pre",...(0,s.R)(),...e.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(n.h1,{id:"overview",children:"Overview"}),"\n",(0,r.jsx)(n.p,{children:"Querying in Verse is based on a fluent, compositional, pipeline-style API. This means that you chain together a\nseries of discrete operations to build up a complete query. This is similar to how you might build a pipeline in a\nshell script, or a series of method calls in a programming language. This approach is designed to be easy to read and\nwrite, and to have excellent tooling support and type safety."}),"\n",(0,r.jsx)(n.p,{children:"For example:"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-ts",metastring:"include ./apps/snippets/src/query.ts:40-43 showLineNumbers",children:'const artists = await db.from.artists\n  .where(a => a.name.like("A%"))\n  .select(a => a.name)\n  .toArray();\n'})}),"\n",(0,r.jsxs)(n.p,{children:["In this example, we start by querying all artists with ",(0,r.jsx)(n.code,{children:"db.from.artists"}),", then we use the ",(0,r.jsx)(n.code,{children:"where"}),' operator to filter\nthe\nresults to only include artists whose name starts with "A", and then we apply the ',(0,r.jsx)(n.code,{children:"select"})," operator to project just the\n",(0,r.jsx)(n.code,{children:"name"})," property from the results. Finally, we call ",(0,r.jsx)(n.code,{children:"toArray"})," to execute the query and buffer the results into an array."]}),"\n",(0,r.jsxs)(n.p,{children:["Instead of buffering with ",(0,r.jsx)(n.code,{children:"toArray"}),", you can also use a ",(0,r.jsx)(n.code,{children:"for await"})," loop to iterate over the results in a streaming\nfashion, which can be more efficient for large result sets:"]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-ts",metastring:"include ./apps/snippets/src/query.ts:45-51 showLineNumbers",children:'const query = db.from.artists.where(a => a.name.like("A%")).select(a => a.name);\n\nfor await (const name of query) {\n  console.log(name);\n}\n\nconst acdc = await db.from.artists.where(a => a.name === "AC/DC").first();\n'})}),"\n",(0,r.jsxs)(n.p,{children:["We can also use the ",(0,r.jsx)(n.code,{children:"first"})," operator to get the first result, or ",(0,r.jsx)(n.code,{children:"single"})," to get the only result:"]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-ts",metastring:"include ./apps/snippets/src/query.ts:53-59 showLineNumbers",children:'const alanis = await db.from.artists\n  .where(a => a.name === "Alanis Morissette")\n  .single();\n'})}),"\n",(0,r.jsxs)(n.p,{children:["The difference between ",(0,r.jsx)(n.code,{children:"first"})," and ",(0,r.jsx)(n.code,{children:"single"})," is that ",(0,r.jsx)(n.code,{children:"single"})," will throw an error if there is more than one result."]}),"\n",(0,r.jsx)(n.admonition,{type:"note",children:(0,r.jsxs)(n.p,{children:["Both ",(0,r.jsx)(n.code,{children:"first"})," and ",(0,r.jsx)(n.code,{children:"single"})," will throw an error if there is no result. To return ",(0,r.jsx)(n.code,{children:"undefined"})," instead,\nwe can use the ",(0,r.jsx)(n.code,{children:"maybeFirst"})," or ",(0,r.jsx)(n.code,{children:"maybeSingle"})," operators."]})}),"\n",(0,r.jsxs)(n.p,{children:["Verse supports a wide range of other operators, including ",(0,r.jsx)(n.code,{children:"orderBy"}),", ",(0,r.jsx)(n.code,{children:"groupBy"}),", ",(0,r.jsx)(n.code,{children:"join"}),", ",(0,r.jsx)(n.code,{children:"limit"}),", ",(0,r.jsx)(n.code,{children:"offset"}),", among others. We'll cover these in more detail in the following sections."]})]})}function h(e={}){const{wrapper:n}={...(0,s.R)(),...e.components};return n?(0,r.jsx)(n,{...e,children:(0,r.jsx)(d,{...e})}):d(e)}},6374:(e,n,t)=>{t.d(n,{R:()=>o,x:()=>a});var r=t(1855);const s={},i=r.createContext(s);function o(e){const n=r.useContext(i);return r.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function a(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(s):e.components||s:o(e.components),r.createElement(i.Provider,{value:n},e.children)}}}]);