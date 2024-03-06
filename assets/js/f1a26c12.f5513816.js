"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[3501],{5279:(e,t,s)=>{s.r(t),s.d(t,{assets:()=>l,contentTitle:()=>i,default:()=>h,frontMatter:()=>o,metadata:()=>d,toc:()=>c});var n=s(3159),r=s(768);const o={title:"verse"},i="Function: verse()",d={id:"api/verse/functions/verse",title:"verse",description:"verse\\(setup Config;model Verse\\",source:"@site/docs/api/verse/functions/verse.md",sourceDirName:"api/verse/functions",slug:"/api/verse/functions/verse",permalink:"/verse/docs/api/verse/functions/verse",draft:!1,unlisted:!1,tags:[],version:"current",frontMatter:{title:"verse"},sidebar:"apiSidebar",previous:{title:"UnitOfWork",permalink:"/verse/docs/api/verse/type-aliases/UnitOfWork"}},l={},c=[{value:"Example",id:"example",level:3},{value:"Type parameters",id:"type-parameters",level:2},{value:"Parameters",id:"parameters",level:2},{value:"Returns",id:"returns",level:2},{value:"Source",id:"source",level:2}];function a(e){const t={a:"a",blockquote:"blockquote",code:"code",h1:"h1",h2:"h2",h3:"h3",p:"p",pre:"pre",strong:"strong",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",...(0,r.R)(),...e.components};return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(t.h1,{id:"function-verse",children:"Function: verse()"}),"\n",(0,n.jsxs)(t.blockquote,{children:["\n",(0,n.jsxs)(t.p,{children:[(0,n.jsx)(t.strong,{children:"verse"}),"<",(0,n.jsx)(t.code,{children:"TEntities"}),">(",(0,n.jsx)(t.code,{children:"setup"}),":     {",(0,n.jsx)(t.code,{children:"config"}),": ",(0,n.jsx)(t.a,{href:"/verse/docs/api/verse/type-aliases/Config",children:(0,n.jsx)(t.code,{children:"Config"})}),";",(0,n.jsx)(t.code,{children:"model"}),": ",(0,n.jsx)(t.a,{href:"/verse/docs/api/verse/type-aliases/ModelBuilder",children:(0,n.jsx)(t.code,{children:"ModelBuilder"})}),"< ",(0,n.jsx)(t.code,{children:"TEntities"})," >;  }): ",(0,n.jsx)(t.a,{href:"/verse/docs/api/verse/classes/Verse",children:(0,n.jsx)(t.code,{children:"Verse"})}),"< ",(0,n.jsx)(t.code,{children:"TEntities"})," >"]}),"\n"]}),"\n",(0,n.jsx)(t.p,{children:"Creates a new top-level Verse instance, which is the API entry point for data access operations."}),"\n",(0,n.jsxs)(t.p,{children:["Initialize the Verse instance with ",(0,n.jsx)(t.a,{href:"/verse/docs/api/verse/type-aliases/Config",children:"Config"})," and ",(0,n.jsx)(t.a,{href:"/verse/docs/api/verse/type-aliases/ModelBuilder",children:"ModelBuilder"})," objects."]}),"\n",(0,n.jsxs)(t.p,{children:["Query and update operations are accessed through the ",(0,n.jsx)(t.a,{href:"/verse/docs/api/verse/classes/Verse#from",children:"Verse.from"})," property and ",(0,n.jsx)(t.a,{href:"/verse/docs/api/verse/classes/Verse#uow",children:"Verse.uow"}),"\nfunction, respectively."]}),"\n",(0,n.jsx)(t.h3,{id:"example",children:"Example"}),"\n",(0,n.jsx)(t.pre,{children:(0,n.jsx)(t.code,{className:"language-ts",metastring:"showLineNumbers",children:'import { verse } from "@operativa/verse";\nimport { sqlite } from "@operativa/verse-sqlite";\nimport { boolean, entity, int, string } from "@operativa/verse/model/builder";\nimport { PrettyConsoleLogger } from "@operativa/verse/utils/logging";\n\n// Create a simple entity class to represent a todo item.\n\nclass Todo {\n  public readonly id!: number;\n\n  constructor(\n    public title: string,\n    public completed = false\n  ) {}\n}\n\n// Setup our Verse instance.\n\nconst db = verse({\n  config: {\n    driver: sqlite("todos.sqlite"),\n    logger: new PrettyConsoleLogger(),\n  },\n  model: {\n    entities: {\n      todos: entity(\n        Todo,\n        {\n          id: int(),\n          title: string(),\n          completed: boolean(),\n        },\n        builder => {\n          builder.data(new Todo("Do the dishes"), new Todo("Walk the dog"));\n        }\n      ),\n    },\n  },\n});\n\n// Create a clean database schema. In a real app, this would be done using migrations.\n\nawait db.database.recreate();\n\n// Query all the todos from the database.\n\nconst todos = await db.from.todos.toArray();\n\ntodos.forEach(todo => {\n  console.log(`${todo.id}: ${todo.title} (completed: ${todo.completed})`);\n});\n\n// Query todos about dogs.\n\nconst query = db.from.todos.where(todo => todo.title.like("%dog%"));\n\nfor await (const todo of query) {\n  console.log(`${todo.id}: ${todo.title} (completed: ${todo.completed})`);\n}\n\n// Modify a todo and save the changes.\n\nconst uow = db.uow();\n\nconst todo = await uow.todos\n  .where(todo => todo.title === "Do the dishes")\n  .single();\n\ntodo.completed = true;\n\nawait uow.commit();\n\n// Now we can remove the todo from the database.\n\nuow.todos.remove(todo);\n\nawait uow.commit();\n'})}),"\n",(0,n.jsx)(t.h2,{id:"type-parameters",children:"Type parameters"}),"\n",(0,n.jsxs)(t.table,{children:[(0,n.jsx)(t.thead,{children:(0,n.jsx)(t.tr,{children:(0,n.jsx)(t.th,{style:{textAlign:"left"},children:"Type parameter"})})}),(0,n.jsx)(t.tbody,{children:(0,n.jsx)(t.tr,{children:(0,n.jsxs)(t.td,{style:{textAlign:"left"},children:[(0,n.jsx)(t.code,{children:"TEntities"})," extends ",(0,n.jsx)(t.a,{href:"/verse/docs/api/verse/type-aliases/Entities",children:(0,n.jsx)(t.code,{children:"Entities"})})]})})})]}),"\n",(0,n.jsx)(t.h2,{id:"parameters",children:"Parameters"}),"\n",(0,n.jsxs)(t.table,{children:[(0,n.jsx)(t.thead,{children:(0,n.jsxs)(t.tr,{children:[(0,n.jsx)(t.th,{style:{textAlign:"left"},children:"Parameter"}),(0,n.jsx)(t.th,{style:{textAlign:"left"},children:"Type"}),(0,n.jsx)(t.th,{style:{textAlign:"left"},children:"Description"})]})}),(0,n.jsxs)(t.tbody,{children:[(0,n.jsxs)(t.tr,{children:[(0,n.jsx)(t.td,{style:{textAlign:"left"},children:(0,n.jsx)(t.code,{children:"setup"})}),(0,n.jsx)(t.td,{style:{textAlign:"left"},children:(0,n.jsx)(t.code,{children:"Object"})}),(0,n.jsx)(t.td,{style:{textAlign:"left"},children:"The config and model initialization for this Verse instance."})]}),(0,n.jsxs)(t.tr,{children:[(0,n.jsx)(t.td,{style:{textAlign:"left"},children:(0,n.jsx)(t.code,{children:"setup.config"})}),(0,n.jsx)(t.td,{style:{textAlign:"left"},children:(0,n.jsx)(t.a,{href:"/verse/docs/api/verse/type-aliases/Config",children:(0,n.jsx)(t.code,{children:"Config"})})}),(0,n.jsx)(t.td,{style:{textAlign:"left"},children:"The config object."})]}),(0,n.jsxs)(t.tr,{children:[(0,n.jsx)(t.td,{style:{textAlign:"left"},children:(0,n.jsx)(t.code,{children:"setup.model"})}),(0,n.jsxs)(t.td,{style:{textAlign:"left"},children:[(0,n.jsx)(t.a,{href:"/verse/docs/api/verse/type-aliases/ModelBuilder",children:(0,n.jsx)(t.code,{children:"ModelBuilder"})}),"< ",(0,n.jsx)(t.code,{children:"TEntities"})," >"]}),(0,n.jsx)(t.td,{style:{textAlign:"left"},children:"The model initialization object."})]})]})]}),"\n",(0,n.jsx)(t.h2,{id:"returns",children:"Returns"}),"\n",(0,n.jsxs)(t.p,{children:[(0,n.jsx)(t.a,{href:"/verse/docs/api/verse/classes/Verse",children:(0,n.jsx)(t.code,{children:"Verse"})}),"< ",(0,n.jsx)(t.code,{children:"TEntities"})," >"]}),"\n",(0,n.jsx)(t.p,{children:"The new instance of Verse."}),"\n",(0,n.jsx)(t.h2,{id:"source",children:"Source"}),"\n",(0,n.jsx)(t.p,{children:(0,n.jsx)(t.a,{href:"https://github.com/operativa-dev/verse/blob/f2cb028/packages/verse-core/src/verse.ts#L512",children:"packages/verse-core/src/verse.ts:512"})})]})}function h(e={}){const{wrapper:t}={...(0,r.R)(),...e.components};return t?(0,n.jsx)(t,{...e,children:(0,n.jsx)(a,{...e})}):a(e)}},768:(e,t,s)=>{s.d(t,{R:()=>i,x:()=>d});var n=s(1855);const r={},o=n.createContext(r);function i(e){const t=n.useContext(o);return n.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function d(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(r):e.components||r:i(e.components),n.createElement(o.Provider,{value:t},e.children)}}}]);