"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[8554],{2987:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>l,contentTitle:()=>a,default:()=>u,frontMatter:()=>r,metadata:()=>o,toc:()=>c});var s=n(3159),i=n(6595);const r={},a="Eager Loading",o={id:"ref/Querying/eager-loading",title:"Eager Loading",description:"Eager loading allows you to efficiently load graphs of related objects in a single Verse query. It is useful",source:"@site/docs/ref/03-Querying/04-eager-loading.mdx",sourceDirName:"ref/03-Querying",slug:"/ref/Querying/eager-loading",permalink:"/docs/ref/Querying/eager-loading",draft:!1,unlisted:!1,editUrl:"https://github.com/operativa-dev/verse/edit/main/apps/docs",tags:[],version:"current",sidebarPosition:4,frontMatter:{},sidebar:"refSidebar",previous:{title:"Compiled Queries",permalink:"/docs/ref/Querying/compiled-queries"},next:{title:"Raw SQL",permalink:"/docs/ref/Querying/raw-sql"}},l={},c=[];function d(e){const t={admonition:"admonition",code:"code",em:"em",h1:"h1",p:"p",pre:"pre",...(0,i.R)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(t.h1,{id:"eager-loading",children:"Eager Loading"}),"\n",(0,s.jsx)(t.p,{children:"Eager loading allows you to efficiently load graphs of related objects in a single Verse query. It is useful\nwhen you know that you will need access to the related objects as part of a single operation, such as rendering\na view. Eager loading can be used to avoid the N+1 query problem."}),"\n",(0,s.jsxs)(t.p,{children:["Eager loading in Verse is specified using the ",(0,s.jsx)(t.code,{children:"with"})," query operator. The ",(0,s.jsx)(t.code,{children:"with"})," operator takes an expression that\nspecifies the related navigations to load. E.g."]}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-ts",metastring:"include ./apps/snippets/src/query.ts:with showLineNumbers",children:"let eager = db.from.artists.limit(1).with(a => a.albums);\n\nfor await (const artist of eager) {\n  console.log(artist);\n}\n"})}),"\n",(0,s.jsxs)(t.p,{children:["In this example, the ",(0,s.jsx)(t.code,{children:"albums"})," navigation property will be eagerly loaded with the artist. It outputs:"]}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-js",children:"{\n  artistId: 1,\n  name: 'AC/DC',\n  albums: [\n    {\n      albumId: 1,\n      title: 'For Those About To Rock We Salute You',\n      artistId: 1\n    },\n    { albumId: 4, title: 'Let There Be Rock', artistId: 1 }\n  ]\n}\n"})}),"\n",(0,s.jsxs)(t.p,{children:["Multiple navigations can be specified as part of a single ",(0,s.jsx)(t.code,{children:"with"})," operation. E.g. load an\nartist with their albums and tracks:"]}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-ts",metastring:"include ./apps/snippets/src/query.ts:with-multiple-1 showLineNumbers",children:"const artistAlbumsTracks = await db.from.artists\n  .limit(1)\n  .with(ar => ar.albums.with(al => al.tracks))\n  .toArray();\n"})}),"\n",(0,s.jsx)(t.p,{children:"Or, load a track with its album and artist:"}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-ts",metastring:"include ./apps/snippets/src/query.ts:with-multiple-2 showLineNumbers",children:"const trackAlbumArtist = await db.from.tracks\n  .limit(1)\n  .with(t => t.album.artist)\n  .toArray();\n"})}),"\n",(0,s.jsx)(t.admonition,{type:"note",children:(0,s.jsxs)(t.p,{children:["Verse uses a single query to load the related objects. This strategy is known as ",(0,s.jsx)(t.em,{children:"Left Join Fetching"}),"."]})})]})}function u(e={}){const{wrapper:t}={...(0,i.R)(),...e.components};return t?(0,s.jsx)(t,{...e,children:(0,s.jsx)(d,{...e})}):d(e)}},6595:(e,t,n)=>{n.d(t,{R:()=>a,x:()=>o});var s=n(1855);const i={},r=s.createContext(i);function a(e){const t=s.useContext(r);return s.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function o(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(i):e.components||i:a(e.components),s.createElement(r.Provider,{value:t},e.children)}}}]);