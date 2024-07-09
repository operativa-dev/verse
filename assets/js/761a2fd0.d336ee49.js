"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[9486],{2480:(e,n,i)=>{i.r(n),i.d(n,{assets:()=>c,contentTitle:()=>d,default:()=>a,frontMatter:()=>t,metadata:()=>l,toc:()=>o});var s=i(5723),r=i(3327);const t={title:"UnitOfWorkApi"},d="Interface: UnitOfWorkApi",l={id:"api/uow/interfaces/UnitOfWorkApi",title:"UnitOfWorkApi",description:"Extends",source:"@site/docs/api/uow/interfaces/UnitOfWorkApi.md",sourceDirName:"api/uow/interfaces",slug:"/api/uow/interfaces/UnitOfWorkApi",permalink:"/docs/api/uow/interfaces/UnitOfWorkApi",draft:!1,unlisted:!1,tags:[],version:"current",frontMatter:{title:"UnitOfWorkApi"},sidebar:"apiSidebar",previous:{title:"EntityEntryApi",permalink:"/docs/api/uow/interfaces/EntityEntryApi"},next:{title:"EntityKey",permalink:"/docs/api/uow/type-aliases/EntityKey"}},c={},o=[{value:"Extends",id:"extends",level:2},{value:"Methods",id:"methods",level:2},{value:"[asyncDispose]()",id:"asyncdispose",level:3},{value:"Returns",id:"returns",level:4},{value:"Inherited from",id:"inherited-from",level:4},{value:"Defined in",id:"defined-in",level:4},{value:"add()",id:"add",level:3},{value:"add(entities)",id:"addentities",level:4},{value:"Parameters",id:"parameters",level:5},{value:"Returns",id:"returns-1",level:5},{value:"Example",id:"example",level:5},{value:"Defined in",id:"defined-in-1",level:5},{value:"add(entityName, entities)",id:"addentityname-entities",level:4},{value:"Parameters",id:"parameters-1",level:5},{value:"Returns",id:"returns-2",level:5},{value:"Example",id:"example-1",level:5},{value:"Defined in",id:"defined-in-2",level:5},{value:"commit()",id:"commit",level:3},{value:"Parameters",id:"parameters-2",level:4},{value:"Returns",id:"returns-3",level:4},{value:"Defined in",id:"defined-in-3",level:4},{value:"entry()",id:"entry",level:3},{value:"Type Parameters",id:"type-parameters",level:4},{value:"Parameters",id:"parameters-3",level:4},{value:"Returns",id:"returns-4",level:4},{value:"Example",id:"example-2",level:4},{value:"Defined in",id:"defined-in-4",level:4},{value:"remove()",id:"remove",level:3},{value:"Parameters",id:"parameters-4",level:4},{value:"Returns",id:"returns-5",level:4},{value:"Example",id:"example-3",level:4},{value:"Defined in",id:"defined-in-5",level:4}];function h(e){const n={a:"a",blockquote:"blockquote",code:"code",em:"em",h1:"h1",h2:"h2",h3:"h3",h4:"h4",h5:"h5",hr:"hr",li:"li",p:"p",pre:"pre",strong:"strong",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",ul:"ul",...(0,r.R)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(n.h1,{id:"interface-unitofworkapi",children:"Interface: UnitOfWorkApi"}),"\n",(0,s.jsx)(n.h2,{id:"extends",children:"Extends"}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsx)(n.li,{children:(0,s.jsx)(n.code,{children:"AsyncDisposable"})}),"\n"]}),"\n",(0,s.jsx)(n.h2,{id:"methods",children:"Methods"}),"\n",(0,s.jsx)(n.h3,{id:"asyncdispose",children:"[asyncDispose]()"}),"\n",(0,s.jsxs)(n.blockquote,{children:["\n",(0,s.jsxs)(n.p,{children:[(0,s.jsx)(n.strong,{children:"[asyncDispose]"}),"(): ",(0,s.jsx)(n.code,{children:"PromiseLike"}),"<",(0,s.jsx)(n.code,{children:"void"}),">"]}),"\n"]}),"\n",(0,s.jsx)(n.h4,{id:"returns",children:"Returns"}),"\n",(0,s.jsxs)(n.p,{children:[(0,s.jsx)(n.code,{children:"PromiseLike"}),"<",(0,s.jsx)(n.code,{children:"void"}),">"]}),"\n",(0,s.jsx)(n.h4,{id:"inherited-from",children:"Inherited from"}),"\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.code,{children:"AsyncDisposable.[asyncDispose]"})}),"\n",(0,s.jsx)(n.h4,{id:"defined-in",children:"Defined in"}),"\n",(0,s.jsx)(n.p,{children:"node_modules/.pnpm/@types+node@20.14.10/node_modules/@types/node/globals.d.ts:121"}),"\n",(0,s.jsx)(n.hr,{}),"\n",(0,s.jsx)(n.h3,{id:"add",children:"add()"}),"\n",(0,s.jsx)(n.h4,{id:"addentities",children:"add(entities)"}),"\n",(0,s.jsxs)(n.blockquote,{children:["\n",(0,s.jsxs)(n.p,{children:[(0,s.jsx)(n.strong,{children:"add"}),"(...",(0,s.jsx)(n.code,{children:"entities"}),": readonly ",(0,s.jsx)(n.code,{children:"object"}),"[]): ",(0,s.jsx)(n.a,{href:"https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise",children:(0,s.jsx)(n.code,{children:"Promise"})}),"<",(0,s.jsx)(n.code,{children:"void"}),">"]}),"\n"]}),"\n",(0,s.jsx)(n.p,{children:"Adds one or more entities in this unit of work. The entities will be inserted into the database when the\nunit of work is committed. If the corresponding entity type is configured with a client-side key generator,\nthen keys will be generated and set on the entities; otherwise, the entities will be assigned\ntemporary keys."}),"\n",(0,s.jsx)(n.h5,{id:"parameters",children:"Parameters"}),"\n",(0,s.jsxs)(n.table,{children:[(0,s.jsx)(n.thead,{children:(0,s.jsxs)(n.tr,{children:[(0,s.jsx)(n.th,{children:"Parameter"}),(0,s.jsx)(n.th,{children:"Type"}),(0,s.jsx)(n.th,{children:"Description"})]})}),(0,s.jsx)(n.tbody,{children:(0,s.jsxs)(n.tr,{children:[(0,s.jsxs)(n.td,{children:["...",(0,s.jsx)(n.code,{children:"entities"})]}),(0,s.jsxs)(n.td,{children:["readonly ",(0,s.jsx)(n.code,{children:"object"}),"[]"]}),(0,s.jsx)(n.td,{children:"One or more entity instances."})]})})]}),"\n",(0,s.jsx)(n.h5,{id:"returns-1",children:"Returns"}),"\n",(0,s.jsxs)(n.p,{children:[(0,s.jsx)(n.a,{href:"https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise",children:(0,s.jsx)(n.code,{children:"Promise"})}),"<",(0,s.jsx)(n.code,{children:"void"}),">"]}),"\n",(0,s.jsx)(n.p,{children:"A promise that resolves once the entities have been added."}),"\n",(0,s.jsx)(n.h5,{id:"example",children:"Example"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-ts",metastring:"showLineNumbers",children:"const blog1 = new Blog({\n title: 'My first blog',\n content: 'This is the content of my first blog',\n});\n\nconst blog2 = new Blog({\n title: 'My second blog',\n content: 'This is the content of my second blog',\n});\n\nawait uow.add(blog1, blog2);\n"})}),"\n",(0,s.jsx)(n.h5,{id:"defined-in-1",children:"Defined in"}),"\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.a,{href:"https://github.com/operativa-dev/verse/blob/afd181c927e47fdeff512ae41818fb33ecad359a/packages/verse-core/src/uow.ts#L428",children:"packages/verse-core/src/uow.ts:428"})}),"\n",(0,s.jsx)(n.h4,{id:"addentityname-entities",children:"add(entityName, entities)"}),"\n",(0,s.jsxs)(n.blockquote,{children:["\n",(0,s.jsxs)(n.p,{children:[(0,s.jsx)(n.strong,{children:"add"}),"(",(0,s.jsx)(n.code,{children:"entityName"}),": ",(0,s.jsx)(n.code,{children:"string"}),", ...",(0,s.jsx)(n.code,{children:"entities"}),": readonly ",(0,s.jsx)(n.code,{children:"object"}),"[]): ",(0,s.jsx)(n.a,{href:"https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise",children:(0,s.jsx)(n.code,{children:"Promise"})}),"<",(0,s.jsx)(n.code,{children:"void"}),">"]}),"\n"]}),"\n",(0,s.jsx)(n.p,{children:"Adds one or more entities in this unit of work. The entities will be inserted into the database when the\nunit of work is committed. If the corresponding entity type is configured with a client-side key generator,\nthen keys will be generated and set on the entities; otherwise, the entities will be assigned\ntemporary keys."}),"\n",(0,s.jsx)(n.h5,{id:"parameters-1",children:"Parameters"}),"\n",(0,s.jsxs)(n.table,{children:[(0,s.jsx)(n.thead,{children:(0,s.jsxs)(n.tr,{children:[(0,s.jsx)(n.th,{children:"Parameter"}),(0,s.jsx)(n.th,{children:"Type"}),(0,s.jsx)(n.th,{children:"Description"})]})}),(0,s.jsxs)(n.tbody,{children:[(0,s.jsxs)(n.tr,{children:[(0,s.jsx)(n.td,{children:(0,s.jsx)(n.code,{children:"entityName"})}),(0,s.jsx)(n.td,{children:(0,s.jsx)(n.code,{children:"string"})}),(0,s.jsx)(n.td,{children:"The name of the entity model."})]}),(0,s.jsxs)(n.tr,{children:[(0,s.jsxs)(n.td,{children:["...",(0,s.jsx)(n.code,{children:"entities"})]}),(0,s.jsxs)(n.td,{children:["readonly ",(0,s.jsx)(n.code,{children:"object"}),"[]"]}),(0,s.jsx)(n.td,{children:"One or more entity instances."})]})]})]}),"\n",(0,s.jsx)(n.h5,{id:"returns-2",children:"Returns"}),"\n",(0,s.jsxs)(n.p,{children:[(0,s.jsx)(n.a,{href:"https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise",children:(0,s.jsx)(n.code,{children:"Promise"})}),"<",(0,s.jsx)(n.code,{children:"void"}),">"]}),"\n",(0,s.jsx)(n.p,{children:"A promise that resolves once the entities have been added."}),"\n",(0,s.jsx)(n.h5,{id:"example-1",children:"Example"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-ts",metastring:"showLineNumbers",children:"const blog1 = {\n title: 'My first blog',\n content: 'This is the content of my first blog',\n};\n\nconst blog2 = {\n title: 'My second blog',\n content: 'This is the content of my second blog',\n}l\n\nawait uow.add(\"Blog\", blog1, blog2);\n"})}),"\n",(0,s.jsx)(n.h5,{id:"defined-in-2",children:"Defined in"}),"\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.a,{href:"https://github.com/operativa-dev/verse/blob/afd181c927e47fdeff512ae41818fb33ecad359a/packages/verse-core/src/uow.ts#L455",children:"packages/verse-core/src/uow.ts:455"})}),"\n",(0,s.jsx)(n.hr,{}),"\n",(0,s.jsx)(n.h3,{id:"commit",children:"commit()"}),"\n",(0,s.jsxs)(n.blockquote,{children:["\n",(0,s.jsxs)(n.p,{children:[(0,s.jsx)(n.strong,{children:"commit"}),"(",(0,s.jsx)(n.code,{children:"isolation"}),"?: ",(0,s.jsx)(n.a,{href:"/docs/api/db/driver/type-aliases/IsolationLevel",children:(0,s.jsx)(n.code,{children:"IsolationLevel"})}),"): ",(0,s.jsx)(n.a,{href:"https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise",children:(0,s.jsx)(n.code,{children:"Promise"})}),"<",(0,s.jsx)(n.code,{children:"void"}),">"]}),"\n"]}),"\n",(0,s.jsx)(n.p,{children:"Commits all changes made in this unit of work to the database."}),"\n",(0,s.jsx)(n.h4,{id:"parameters-2",children:"Parameters"}),"\n",(0,s.jsxs)(n.table,{children:[(0,s.jsx)(n.thead,{children:(0,s.jsxs)(n.tr,{children:[(0,s.jsx)(n.th,{children:"Parameter"}),(0,s.jsx)(n.th,{children:"Type"}),(0,s.jsx)(n.th,{children:"Description"})]})}),(0,s.jsx)(n.tbody,{children:(0,s.jsxs)(n.tr,{children:[(0,s.jsxs)(n.td,{children:[(0,s.jsx)(n.code,{children:"isolation"}),"?"]}),(0,s.jsx)(n.td,{children:(0,s.jsx)(n.a,{href:"/docs/api/db/driver/type-aliases/IsolationLevel",children:(0,s.jsx)(n.code,{children:"IsolationLevel"})})}),(0,s.jsx)(n.td,{children:"Optional isolation level for the database transaction."})]})})]}),"\n",(0,s.jsx)(n.h4,{id:"returns-3",children:"Returns"}),"\n",(0,s.jsxs)(n.p,{children:[(0,s.jsx)(n.a,{href:"https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise",children:(0,s.jsx)(n.code,{children:"Promise"})}),"<",(0,s.jsx)(n.code,{children:"void"}),">"]}),"\n",(0,s.jsx)(n.p,{children:"A promise that resolves when the commit is successful."}),"\n",(0,s.jsx)(n.h4,{id:"defined-in-3",children:"Defined in"}),"\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.a,{href:"https://github.com/operativa-dev/verse/blob/afd181c927e47fdeff512ae41818fb33ecad359a/packages/verse-core/src/uow.ts#L473",children:"packages/verse-core/src/uow.ts:473"})}),"\n",(0,s.jsx)(n.hr,{}),"\n",(0,s.jsx)(n.h3,{id:"entry",children:"entry()"}),"\n",(0,s.jsxs)(n.blockquote,{children:["\n",(0,s.jsxs)(n.p,{children:[(0,s.jsx)(n.strong,{children:"entry"}),"<",(0,s.jsx)(n.code,{children:"Entity"}),">(",(0,s.jsx)(n.code,{children:"entity"}),": ",(0,s.jsx)(n.code,{children:"Entity"}),"): ",(0,s.jsx)(n.code,{children:"undefined"})," | ",(0,s.jsx)(n.a,{href:"/docs/api/uow/interfaces/EntityEntryApi",children:(0,s.jsx)(n.code,{children:"EntityEntryApi"})}),"<",(0,s.jsx)(n.code,{children:"Entity"}),">"]}),"\n"]}),"\n",(0,s.jsx)(n.p,{children:"Exposes operations that can be performed on an entity in this unit of work."}),"\n",(0,s.jsx)(n.h4,{id:"type-parameters",children:"Type Parameters"}),"\n",(0,s.jsxs)(n.table,{children:[(0,s.jsx)(n.thead,{children:(0,s.jsx)(n.tr,{children:(0,s.jsx)(n.th,{children:"Type Parameter"})})}),(0,s.jsx)(n.tbody,{children:(0,s.jsx)(n.tr,{children:(0,s.jsxs)(n.td,{children:[(0,s.jsx)(n.code,{children:"Entity"})," ",(0,s.jsx)(n.em,{children:"extends"})," ",(0,s.jsx)(n.code,{children:"object"})]})})})]}),"\n",(0,s.jsx)(n.h4,{id:"parameters-3",children:"Parameters"}),"\n",(0,s.jsxs)(n.table,{children:[(0,s.jsx)(n.thead,{children:(0,s.jsxs)(n.tr,{children:[(0,s.jsx)(n.th,{children:"Parameter"}),(0,s.jsx)(n.th,{children:"Type"}),(0,s.jsx)(n.th,{children:"Description"})]})}),(0,s.jsx)(n.tbody,{children:(0,s.jsxs)(n.tr,{children:[(0,s.jsx)(n.td,{children:(0,s.jsx)(n.code,{children:"entity"})}),(0,s.jsx)(n.td,{children:(0,s.jsx)(n.code,{children:"Entity"})}),(0,s.jsx)(n.td,{children:"The entity for which the entry API needs to be retrieved."})]})})]}),"\n",(0,s.jsx)(n.h4,{id:"returns-4",children:"Returns"}),"\n",(0,s.jsxs)(n.p,{children:[(0,s.jsx)(n.code,{children:"undefined"})," | ",(0,s.jsx)(n.a,{href:"/docs/api/uow/interfaces/EntityEntryApi",children:(0,s.jsx)(n.code,{children:"EntityEntryApi"})}),"<",(0,s.jsx)(n.code,{children:"Entity"}),">"]}),"\n",(0,s.jsx)(n.p,{children:"The entry API for the entity, or undefined if not found."}),"\n",(0,s.jsx)(n.h4,{id:"example-2",children:"Example"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-ts",metastring:"showLineNumbers",children:"uow.entry(album).setState('removed');\n"})}),"\n",(0,s.jsx)(n.h4,{id:"defined-in-4",children:"Defined in"}),"\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.a,{href:"https://github.com/operativa-dev/verse/blob/afd181c927e47fdeff512ae41818fb33ecad359a/packages/verse-core/src/uow.ts#L484",children:"packages/verse-core/src/uow.ts:484"})}),"\n",(0,s.jsx)(n.hr,{}),"\n",(0,s.jsx)(n.h3,{id:"remove",children:"remove()"}),"\n",(0,s.jsxs)(n.blockquote,{children:["\n",(0,s.jsxs)(n.p,{children:[(0,s.jsx)(n.strong,{children:"remove"}),"(...",(0,s.jsx)(n.code,{children:"entities"}),": readonly ",(0,s.jsx)(n.code,{children:"object"}),"[]): ",(0,s.jsx)(n.code,{children:"void"})]}),"\n"]}),"\n",(0,s.jsx)(n.p,{children:"Removes one or more entities in this unit of work. The entities will be deleted from the database when the\nunit of work is committed."}),"\n",(0,s.jsx)(n.h4,{id:"parameters-4",children:"Parameters"}),"\n",(0,s.jsxs)(n.table,{children:[(0,s.jsx)(n.thead,{children:(0,s.jsxs)(n.tr,{children:[(0,s.jsx)(n.th,{children:"Parameter"}),(0,s.jsx)(n.th,{children:"Type"}),(0,s.jsx)(n.th,{children:"Description"})]})}),(0,s.jsx)(n.tbody,{children:(0,s.jsxs)(n.tr,{children:[(0,s.jsxs)(n.td,{children:["...",(0,s.jsx)(n.code,{children:"entities"})]}),(0,s.jsxs)(n.td,{children:["readonly ",(0,s.jsx)(n.code,{children:"object"}),"[]"]}),(0,s.jsx)(n.td,{children:"The entities to be removed."})]})})]}),"\n",(0,s.jsx)(n.h4,{id:"returns-5",children:"Returns"}),"\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.code,{children:"void"})}),"\n",(0,s.jsx)(n.h4,{id:"example-3",children:"Example"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-ts",metastring:"showLineNumbers",children:"await uow.remove(blog1, blog2);\n"})}),"\n",(0,s.jsx)(n.h4,{id:"defined-in-5",children:"Defined in"}),"\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.a,{href:"https://github.com/operativa-dev/verse/blob/afd181c927e47fdeff512ae41818fb33ecad359a/packages/verse-core/src/uow.ts#L466",children:"packages/verse-core/src/uow.ts:466"})})]})}function a(e={}){const{wrapper:n}={...(0,r.R)(),...e.components};return n?(0,s.jsx)(n,{...e,children:(0,s.jsx)(h,{...e})}):h(e)}},3327:(e,n,i)=>{i.d(n,{R:()=>d,x:()=>l});var s=i(2155);const r={},t=s.createContext(r);function d(e){const n=s.useContext(t);return s.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function l(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(r):e.components||r:d(e.components),s.createElement(t.Provider,{value:n},e.children)}}}]);