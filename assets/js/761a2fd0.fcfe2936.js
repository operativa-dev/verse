"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[9486],{49:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>c,contentTitle:()=>l,default:()=>a,frontMatter:()=>r,metadata:()=>d,toc:()=>o});var s=n(3159),i=n(7377);const r={title:"UnitOfWorkApi"},l="Interface: UnitOfWorkApi",d={id:"api/uow/interfaces/UnitOfWorkApi",title:"UnitOfWorkApi",description:"Extends",source:"@site/docs/api/uow/interfaces/UnitOfWorkApi.md",sourceDirName:"api/uow/interfaces",slug:"/api/uow/interfaces/UnitOfWorkApi",permalink:"/verse/docs/api/uow/interfaces/UnitOfWorkApi",draft:!1,unlisted:!1,tags:[],version:"current",frontMatter:{title:"UnitOfWorkApi"},sidebar:"apiSidebar",previous:{title:"EntityEntryApi",permalink:"/verse/docs/api/uow/interfaces/EntityEntryApi"},next:{title:"EntityKey",permalink:"/verse/docs/api/uow/type-aliases/EntityKey"}},c={},o=[{value:"Extends",id:"extends",level:2},{value:"Methods",id:"methods",level:2},{value:"<code>[asyncDispose]</code>()",id:"asyncdispose",level:3},{value:"Returns",id:"returns",level:4},{value:"Inherited from",id:"inherited-from",level:4},{value:"Source",id:"source",level:4},{value:"add()",id:"add",level:3},{value:"add(entities)",id:"addentities",level:4},{value:"Parameters",id:"parameters",level:5},{value:"Returns",id:"returns-1",level:5},{value:"Example",id:"example",level:5},{value:"Source",id:"source-1",level:5},{value:"add(entityName, entities)",id:"addentityname-entities",level:4},{value:"Parameters",id:"parameters-1",level:5},{value:"Returns",id:"returns-2",level:5},{value:"Example",id:"example-1",level:5},{value:"Source",id:"source-2",level:5},{value:"commit()",id:"commit",level:3},{value:"Parameters",id:"parameters-2",level:4},{value:"Returns",id:"returns-3",level:4},{value:"Source",id:"source-3",level:4},{value:"entry()",id:"entry",level:3},{value:"Type parameters",id:"type-parameters",level:4},{value:"Parameters",id:"parameters-3",level:4},{value:"Returns",id:"returns-4",level:4},{value:"Example",id:"example-2",level:4},{value:"Source",id:"source-4",level:4},{value:"remove()",id:"remove",level:3},{value:"Parameters",id:"parameters-4",level:4},{value:"Returns",id:"returns-5",level:4},{value:"Example",id:"example-3",level:4},{value:"Source",id:"source-5",level:4}];function h(e){const t={a:"a",blockquote:"blockquote",code:"code",h1:"h1",h2:"h2",h3:"h3",h4:"h4",h5:"h5",hr:"hr",li:"li",p:"p",pre:"pre",strong:"strong",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",ul:"ul",...(0,i.R)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(t.h1,{id:"interface-unitofworkapi",children:"Interface: UnitOfWorkApi"}),"\n",(0,s.jsx)(t.h2,{id:"extends",children:"Extends"}),"\n",(0,s.jsxs)(t.ul,{children:["\n",(0,s.jsx)(t.li,{children:(0,s.jsx)(t.code,{children:"AsyncDisposable"})}),"\n"]}),"\n",(0,s.jsx)(t.h2,{id:"methods",children:"Methods"}),"\n",(0,s.jsxs)(t.h3,{id:"asyncdispose",children:[(0,s.jsx)(t.code,{children:"[asyncDispose]"}),"()"]}),"\n",(0,s.jsxs)(t.blockquote,{children:["\n",(0,s.jsxs)(t.p,{children:[(0,s.jsx)(t.strong,{children:"[asyncDispose]"}),"(): ",(0,s.jsx)(t.code,{children:"PromiseLike"}),"< ",(0,s.jsx)(t.code,{children:"void"})," >"]}),"\n"]}),"\n",(0,s.jsx)(t.h4,{id:"returns",children:"Returns"}),"\n",(0,s.jsxs)(t.p,{children:[(0,s.jsx)(t.code,{children:"PromiseLike"}),"< ",(0,s.jsx)(t.code,{children:"void"})," >"]}),"\n",(0,s.jsx)(t.h4,{id:"inherited-from",children:"Inherited from"}),"\n",(0,s.jsx)(t.p,{children:(0,s.jsx)(t.code,{children:"AsyncDisposable.[asyncDispose]"})}),"\n",(0,s.jsx)(t.h4,{id:"source",children:"Source"}),"\n",(0,s.jsx)(t.p,{children:"node_modules/.pnpm/@types+node@20.11.25/node_modules/@types/node/globals.d.ts:120"}),"\n",(0,s.jsx)(t.hr,{}),"\n",(0,s.jsx)(t.h3,{id:"add",children:"add()"}),"\n",(0,s.jsx)(t.h4,{id:"addentities",children:"add(entities)"}),"\n",(0,s.jsxs)(t.blockquote,{children:["\n",(0,s.jsxs)(t.p,{children:[(0,s.jsx)(t.strong,{children:"add"}),"(...",(0,s.jsx)(t.code,{children:"entities"}),": ",(0,s.jsx)(t.code,{children:"object"}),"[]): ",(0,s.jsx)(t.a,{href:"https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise",children:(0,s.jsx)(t.code,{children:"Promise"})}),"< ",(0,s.jsx)(t.code,{children:"void"})," >"]}),"\n"]}),"\n",(0,s.jsx)(t.p,{children:"Adds one or more entities in this unit of work. The entities will be inserted into the database when the\nunit of work is committed. If the corresponding entity type is configured with a client-side key generator,\nthen keys will be generated and set on the entities; otherwise, the entities will be assigned\ntemporary keys."}),"\n",(0,s.jsx)(t.h5,{id:"parameters",children:"Parameters"}),"\n",(0,s.jsxs)(t.table,{children:[(0,s.jsx)(t.thead,{children:(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.th,{style:{textAlign:"left"},children:"Parameter"}),(0,s.jsx)(t.th,{style:{textAlign:"left"},children:"Type"}),(0,s.jsx)(t.th,{style:{textAlign:"left"},children:"Description"})]})}),(0,s.jsx)(t.tbody,{children:(0,s.jsxs)(t.tr,{children:[(0,s.jsxs)(t.td,{style:{textAlign:"left"},children:["...",(0,s.jsx)(t.code,{children:"entities"})]}),(0,s.jsxs)(t.td,{style:{textAlign:"left"},children:[(0,s.jsx)(t.code,{children:"object"}),"[]"]}),(0,s.jsx)(t.td,{style:{textAlign:"left"},children:"One or more entity instances."})]})})]}),"\n",(0,s.jsx)(t.h5,{id:"returns-1",children:"Returns"}),"\n",(0,s.jsxs)(t.p,{children:[(0,s.jsx)(t.a,{href:"https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise",children:(0,s.jsx)(t.code,{children:"Promise"})}),"< ",(0,s.jsx)(t.code,{children:"void"})," >"]}),"\n",(0,s.jsx)(t.p,{children:"A promise that resolves once the entities have been added."}),"\n",(0,s.jsx)(t.h5,{id:"example",children:"Example"}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-ts",metastring:"showLineNumbers",children:"const blog1 = new Blog({\n title: 'My first blog',\n content: 'This is the content of my first blog',\n});\n\nconst blog2 = new Blog({\n title: 'My second blog',\n content: 'This is the content of my second blog',\n});\n\nawait uow.add(blog1, blog2);\n"})}),"\n",(0,s.jsx)(t.h5,{id:"source-1",children:"Source"}),"\n",(0,s.jsx)(t.p,{children:(0,s.jsx)(t.a,{href:"https://github.com/operativa-dev/verse/blob/c43fe9b/packages/verse-core/src/uow.ts#L428",children:"packages/verse-core/src/uow.ts:428"})}),"\n",(0,s.jsx)(t.h4,{id:"addentityname-entities",children:"add(entityName, entities)"}),"\n",(0,s.jsxs)(t.blockquote,{children:["\n",(0,s.jsxs)(t.p,{children:[(0,s.jsx)(t.strong,{children:"add"}),"(",(0,s.jsx)(t.code,{children:"entityName"}),": ",(0,s.jsx)(t.code,{children:"string"}),", ...",(0,s.jsx)(t.code,{children:"entities"}),": ",(0,s.jsx)(t.code,{children:"object"}),"[]): ",(0,s.jsx)(t.a,{href:"https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise",children:(0,s.jsx)(t.code,{children:"Promise"})}),"< ",(0,s.jsx)(t.code,{children:"void"})," >"]}),"\n"]}),"\n",(0,s.jsx)(t.p,{children:"Adds one or more entities in this unit of work. The entities will be inserted into the database when the\nunit of work is committed. If the corresponding entity type is configured with a client-side key generator,\nthen keys will be generated and set on the entities; otherwise, the entities will be assigned\ntemporary keys."}),"\n",(0,s.jsx)(t.h5,{id:"parameters-1",children:"Parameters"}),"\n",(0,s.jsxs)(t.table,{children:[(0,s.jsx)(t.thead,{children:(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.th,{style:{textAlign:"left"},children:"Parameter"}),(0,s.jsx)(t.th,{style:{textAlign:"left"},children:"Type"}),(0,s.jsx)(t.th,{style:{textAlign:"left"},children:"Description"})]})}),(0,s.jsxs)(t.tbody,{children:[(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{style:{textAlign:"left"},children:(0,s.jsx)(t.code,{children:"entityName"})}),(0,s.jsx)(t.td,{style:{textAlign:"left"},children:(0,s.jsx)(t.code,{children:"string"})}),(0,s.jsx)(t.td,{style:{textAlign:"left"},children:"The name of the entity model."})]}),(0,s.jsxs)(t.tr,{children:[(0,s.jsxs)(t.td,{style:{textAlign:"left"},children:["...",(0,s.jsx)(t.code,{children:"entities"})]}),(0,s.jsxs)(t.td,{style:{textAlign:"left"},children:[(0,s.jsx)(t.code,{children:"object"}),"[]"]}),(0,s.jsx)(t.td,{style:{textAlign:"left"},children:"One or more entity instances."})]})]})]}),"\n",(0,s.jsx)(t.h5,{id:"returns-2",children:"Returns"}),"\n",(0,s.jsxs)(t.p,{children:[(0,s.jsx)(t.a,{href:"https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise",children:(0,s.jsx)(t.code,{children:"Promise"})}),"< ",(0,s.jsx)(t.code,{children:"void"})," >"]}),"\n",(0,s.jsx)(t.p,{children:"A promise that resolves once the entities have been added."}),"\n",(0,s.jsx)(t.h5,{id:"example-1",children:"Example"}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-ts",metastring:"showLineNumbers",children:"const blog1 = {\n title: 'My first blog',\n content: 'This is the content of my first blog',\n};\n\nconst blog2 = {\n title: 'My second blog',\n content: 'This is the content of my second blog',\n}l\n\nawait uow.add(\"Blog\", blog1, blog2);\n"})}),"\n",(0,s.jsx)(t.h5,{id:"source-2",children:"Source"}),"\n",(0,s.jsx)(t.p,{children:(0,s.jsx)(t.a,{href:"https://github.com/operativa-dev/verse/blob/c43fe9b/packages/verse-core/src/uow.ts#L455",children:"packages/verse-core/src/uow.ts:455"})}),"\n",(0,s.jsx)(t.hr,{}),"\n",(0,s.jsx)(t.h3,{id:"commit",children:"commit()"}),"\n",(0,s.jsxs)(t.blockquote,{children:["\n",(0,s.jsxs)(t.p,{children:[(0,s.jsx)(t.strong,{children:"commit"}),"(",(0,s.jsx)(t.code,{children:"isolation"}),"?: ",(0,s.jsx)(t.a,{href:"/verse/docs/api/db/driver/type-aliases/IsolationLevel",children:(0,s.jsx)(t.code,{children:"IsolationLevel"})}),"): ",(0,s.jsx)(t.a,{href:"https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise",children:(0,s.jsx)(t.code,{children:"Promise"})}),"< ",(0,s.jsx)(t.code,{children:"void"})," >"]}),"\n"]}),"\n",(0,s.jsx)(t.p,{children:"Commits all changes made in this unit of work to the database."}),"\n",(0,s.jsx)(t.h4,{id:"parameters-2",children:"Parameters"}),"\n",(0,s.jsxs)(t.table,{children:[(0,s.jsx)(t.thead,{children:(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.th,{style:{textAlign:"left"},children:"Parameter"}),(0,s.jsx)(t.th,{style:{textAlign:"left"},children:"Type"}),(0,s.jsx)(t.th,{style:{textAlign:"left"},children:"Description"})]})}),(0,s.jsx)(t.tbody,{children:(0,s.jsxs)(t.tr,{children:[(0,s.jsxs)(t.td,{style:{textAlign:"left"},children:[(0,s.jsx)(t.code,{children:"isolation"}),"?"]}),(0,s.jsx)(t.td,{style:{textAlign:"left"},children:(0,s.jsx)(t.a,{href:"/verse/docs/api/db/driver/type-aliases/IsolationLevel",children:(0,s.jsx)(t.code,{children:"IsolationLevel"})})}),(0,s.jsx)(t.td,{style:{textAlign:"left"},children:"Optional isolation level for the database transaction."})]})})]}),"\n",(0,s.jsx)(t.h4,{id:"returns-3",children:"Returns"}),"\n",(0,s.jsxs)(t.p,{children:[(0,s.jsx)(t.a,{href:"https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise",children:(0,s.jsx)(t.code,{children:"Promise"})}),"< ",(0,s.jsx)(t.code,{children:"void"})," >"]}),"\n",(0,s.jsx)(t.p,{children:"A promise that resolves when the commit is successful."}),"\n",(0,s.jsx)(t.h4,{id:"source-3",children:"Source"}),"\n",(0,s.jsx)(t.p,{children:(0,s.jsx)(t.a,{href:"https://github.com/operativa-dev/verse/blob/c43fe9b/packages/verse-core/src/uow.ts#L473",children:"packages/verse-core/src/uow.ts:473"})}),"\n",(0,s.jsx)(t.hr,{}),"\n",(0,s.jsx)(t.h3,{id:"entry",children:"entry()"}),"\n",(0,s.jsxs)(t.blockquote,{children:["\n",(0,s.jsxs)(t.p,{children:[(0,s.jsx)(t.strong,{children:"entry"}),"<",(0,s.jsx)(t.code,{children:"Entity"}),">(",(0,s.jsx)(t.code,{children:"entity"}),": ",(0,s.jsx)(t.code,{children:"Entity"}),"): ",(0,s.jsx)(t.code,{children:"undefined"})," | ",(0,s.jsx)(t.a,{href:"/verse/docs/api/uow/interfaces/EntityEntryApi",children:(0,s.jsx)(t.code,{children:"EntityEntryApi"})}),"< ",(0,s.jsx)(t.code,{children:"Entity"})," >"]}),"\n"]}),"\n",(0,s.jsx)(t.p,{children:"Exposes operations that can be performed on an entity in this unit of work."}),"\n",(0,s.jsx)(t.h4,{id:"type-parameters",children:"Type parameters"}),"\n",(0,s.jsxs)(t.table,{children:[(0,s.jsx)(t.thead,{children:(0,s.jsx)(t.tr,{children:(0,s.jsx)(t.th,{style:{textAlign:"left"},children:"Type parameter"})})}),(0,s.jsx)(t.tbody,{children:(0,s.jsx)(t.tr,{children:(0,s.jsxs)(t.td,{style:{textAlign:"left"},children:[(0,s.jsx)(t.code,{children:"Entity"})," extends ",(0,s.jsx)(t.code,{children:"object"})]})})})]}),"\n",(0,s.jsx)(t.h4,{id:"parameters-3",children:"Parameters"}),"\n",(0,s.jsxs)(t.table,{children:[(0,s.jsx)(t.thead,{children:(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.th,{style:{textAlign:"left"},children:"Parameter"}),(0,s.jsx)(t.th,{style:{textAlign:"left"},children:"Type"}),(0,s.jsx)(t.th,{style:{textAlign:"left"},children:"Description"})]})}),(0,s.jsx)(t.tbody,{children:(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{style:{textAlign:"left"},children:(0,s.jsx)(t.code,{children:"entity"})}),(0,s.jsx)(t.td,{style:{textAlign:"left"},children:(0,s.jsx)(t.code,{children:"Entity"})}),(0,s.jsx)(t.td,{style:{textAlign:"left"},children:"The entity for which the entry API needs to be retrieved."})]})})]}),"\n",(0,s.jsx)(t.h4,{id:"returns-4",children:"Returns"}),"\n",(0,s.jsxs)(t.p,{children:[(0,s.jsx)(t.code,{children:"undefined"})," | ",(0,s.jsx)(t.a,{href:"/verse/docs/api/uow/interfaces/EntityEntryApi",children:(0,s.jsx)(t.code,{children:"EntityEntryApi"})}),"< ",(0,s.jsx)(t.code,{children:"Entity"})," >"]}),"\n",(0,s.jsx)(t.p,{children:"The entry API for the entity, or undefined if not found."}),"\n",(0,s.jsx)(t.h4,{id:"example-2",children:"Example"}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-ts",metastring:"showLineNumbers",children:"uow.entry(album).setState('removed');\n"})}),"\n",(0,s.jsx)(t.h4,{id:"source-4",children:"Source"}),"\n",(0,s.jsx)(t.p,{children:(0,s.jsx)(t.a,{href:"https://github.com/operativa-dev/verse/blob/c43fe9b/packages/verse-core/src/uow.ts#L484",children:"packages/verse-core/src/uow.ts:484"})}),"\n",(0,s.jsx)(t.hr,{}),"\n",(0,s.jsx)(t.h3,{id:"remove",children:"remove()"}),"\n",(0,s.jsxs)(t.blockquote,{children:["\n",(0,s.jsxs)(t.p,{children:[(0,s.jsx)(t.strong,{children:"remove"}),"(...",(0,s.jsx)(t.code,{children:"entities"}),": ",(0,s.jsx)(t.code,{children:"object"}),"[]): ",(0,s.jsx)(t.code,{children:"void"})]}),"\n"]}),"\n",(0,s.jsx)(t.p,{children:"Removes one or more entities in this unit of work. The entities will be deleted from the database when the\nunit of work is committed."}),"\n",(0,s.jsx)(t.h4,{id:"parameters-4",children:"Parameters"}),"\n",(0,s.jsxs)(t.table,{children:[(0,s.jsx)(t.thead,{children:(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.th,{style:{textAlign:"left"},children:"Parameter"}),(0,s.jsx)(t.th,{style:{textAlign:"left"},children:"Type"}),(0,s.jsx)(t.th,{style:{textAlign:"left"},children:"Description"})]})}),(0,s.jsx)(t.tbody,{children:(0,s.jsxs)(t.tr,{children:[(0,s.jsxs)(t.td,{style:{textAlign:"left"},children:["...",(0,s.jsx)(t.code,{children:"entities"})]}),(0,s.jsxs)(t.td,{style:{textAlign:"left"},children:[(0,s.jsx)(t.code,{children:"object"}),"[]"]}),(0,s.jsx)(t.td,{style:{textAlign:"left"},children:"The entities to be removed."})]})})]}),"\n",(0,s.jsx)(t.h4,{id:"returns-5",children:"Returns"}),"\n",(0,s.jsx)(t.p,{children:(0,s.jsx)(t.code,{children:"void"})}),"\n",(0,s.jsx)(t.h4,{id:"example-3",children:"Example"}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-ts",metastring:"showLineNumbers",children:"await uow.remove(blog1, blog2);\n"})}),"\n",(0,s.jsx)(t.h4,{id:"source-5",children:"Source"}),"\n",(0,s.jsx)(t.p,{children:(0,s.jsx)(t.a,{href:"https://github.com/operativa-dev/verse/blob/c43fe9b/packages/verse-core/src/uow.ts#L466",children:"packages/verse-core/src/uow.ts:466"})})]})}function a(e={}){const{wrapper:t}={...(0,i.R)(),...e.components};return t?(0,s.jsx)(t,{...e,children:(0,s.jsx)(h,{...e})}):h(e)}},7377:(e,t,n)=>{n.d(t,{R:()=>l,x:()=>d});var s=n(1855);const i={},r=s.createContext(i);function l(e){const t=s.useContext(r);return s.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function d(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(i):e.components||i:l(e.components),s.createElement(r.Provider,{value:t},e.children)}}}]);