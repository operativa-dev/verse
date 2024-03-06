"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[8712],{5715:(e,t,s)=>{s.r(t),s.d(t,{assets:()=>c,contentTitle:()=>l,default:()=>h,frontMatter:()=>i,metadata:()=>d,toc:()=>o});var r=s(3159),n=s(768);const i={title:"entity"},l="Function: entity()",d={id:"api/model/builder/functions/entity",title:"entity",description:"entity(klass, properties, build)",source:"@site/docs/api/model/builder/functions/entity.md",sourceDirName:"api/model/builder/functions",slug:"/api/model/builder/functions/entity",permalink:"/verse/docs/api/model/builder/functions/entity",draft:!1,unlisted:!1,tags:[],version:"current",frontMatter:{title:"entity"},sidebar:"apiSidebar",previous:{title:"date",permalink:"/verse/docs/api/model/builder/functions/date"},next:{title:"int",permalink:"/verse/docs/api/model/builder/functions/int"}},c={},o=[{value:"entity(klass, properties, build)",id:"entityklass-properties-build",level:2},{value:"Example",id:"example",level:3},{value:"Type parameters",id:"type-parameters",level:3},{value:"Parameters",id:"parameters",level:3},{value:"Returns",id:"returns",level:3},{value:"Source",id:"source",level:3},{value:"entity(properties, build)",id:"entityproperties-build",level:2},{value:"Example",id:"example-1",level:3},{value:"Type parameters",id:"type-parameters-1",level:3},{value:"Parameters",id:"parameters-1",level:3},{value:"Returns",id:"returns-1",level:3},{value:"Source",id:"source-1",level:3}];function a(e){const t={a:"a",blockquote:"blockquote",code:"code",h1:"h1",h2:"h2",h3:"h3",p:"p",pre:"pre",strong:"strong",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",...(0,n.R)(),...e.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(t.h1,{id:"function-entity",children:"Function: entity()"}),"\n",(0,r.jsx)(t.h2,{id:"entityklass-properties-build",children:"entity(klass, properties, build)"}),"\n",(0,r.jsxs)(t.blockquote,{children:["\n",(0,r.jsxs)(t.p,{children:[(0,r.jsx)(t.strong,{children:"entity"}),"<",(0,r.jsx)(t.code,{children:"T"}),", ",(0,r.jsx)(t.code,{children:"P"}),">(",(0,r.jsx)(t.code,{children:"klass"}),": ",(0,r.jsx)(t.code,{children:"Newable"}),"< ",(0,r.jsx)(t.code,{children:"T"})," >, ",(0,r.jsx)(t.code,{children:"properties"}),": ",(0,r.jsx)(t.code,{children:"NonEmptyObject"}),"< ",(0,r.jsx)(t.code,{children:"P"})," >, ",(0,r.jsx)(t.code,{children:"build"}),"?:     (",(0,r.jsx)(t.code,{children:"builder"}),": ",(0,r.jsx)(t.a,{href:"/verse/docs/api/model/builder/interfaces/EntityBuilder",children:(0,r.jsx)(t.code,{children:"EntityBuilder"})}),"< ",(0,r.jsx)(t.code,{children:"P"}),", ",(0,r.jsx)(t.code,{children:"T"})," >) => ",(0,r.jsx)(t.code,{children:"void"}),"): ",(0,r.jsx)(t.a,{href:"/verse/docs/api/model/model/classes/EntityModel",children:(0,r.jsx)(t.code,{children:"EntityModel"})}),"< ",(0,r.jsx)(t.code,{children:"P"}),", ",(0,r.jsx)(t.code,{children:"T"})," >"]}),"\n"]}),"\n",(0,r.jsxs)(t.p,{children:["Builds an ",(0,r.jsx)(t.a,{href:"/verse/docs/api/model/model/classes/EntityModel",children:"EntityModel"})," based on a Class."]}),"\n",(0,r.jsx)(t.h3,{id:"example",children:"Example"}),"\n",(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{className:"language-ts",metastring:"showLineNumbers",children:'import { EntityType } from "@operativa/verse";\nimport { entity, int, string } from "@operativa/verse/model/builder";\n\nclass Artist {\n  constructor(\n    readonly id: number,\n    public name: string\n  ) {}\n}\n\nclass Album {\n  constructor(\n    readonly id: number,\n    public name: string,\n    public artistId: number\n  ) {}\n}\n\nconst classModel = {\n  albums: entity(\n    Album,\n    {\n      id: int(),\n      name: string({ maxLength: 100 }),\n      artistId: int({ nullable: false, column: "ArtistId" }),\n    },\n    builder => {\n      builder.table("Albums");\n      builder.key("id");\n      builder.references(Artist, "artistId");\n    }\n  ),\n};\n'})}),"\n",(0,r.jsx)(t.h3,{id:"type-parameters",children:"Type parameters"}),"\n",(0,r.jsxs)(t.table,{children:[(0,r.jsx)(t.thead,{children:(0,r.jsx)(t.tr,{children:(0,r.jsx)(t.th,{style:{textAlign:"left"},children:"Type parameter"})})}),(0,r.jsxs)(t.tbody,{children:[(0,r.jsx)(t.tr,{children:(0,r.jsxs)(t.td,{style:{textAlign:"left"},children:[(0,r.jsx)(t.code,{children:"T"})," extends ",(0,r.jsx)(t.code,{children:"object"})]})}),(0,r.jsx)(t.tr,{children:(0,r.jsxs)(t.td,{style:{textAlign:"left"},children:[(0,r.jsx)(t.code,{children:"P"})," extends ",(0,r.jsx)(t.a,{href:"/verse/docs/api/model/builder/type-aliases/Properties",children:(0,r.jsx)(t.code,{children:"Properties"})}),"< ",(0,r.jsx)(t.code,{children:"T"})," >"]})})]})]}),"\n",(0,r.jsx)(t.h3,{id:"parameters",children:"Parameters"}),"\n",(0,r.jsxs)(t.table,{children:[(0,r.jsx)(t.thead,{children:(0,r.jsxs)(t.tr,{children:[(0,r.jsx)(t.th,{style:{textAlign:"left"},children:"Parameter"}),(0,r.jsx)(t.th,{style:{textAlign:"left"},children:"Type"}),(0,r.jsx)(t.th,{style:{textAlign:"left"},children:"Description"})]})}),(0,r.jsxs)(t.tbody,{children:[(0,r.jsxs)(t.tr,{children:[(0,r.jsx)(t.td,{style:{textAlign:"left"},children:(0,r.jsx)(t.code,{children:"klass"})}),(0,r.jsxs)(t.td,{style:{textAlign:"left"},children:[(0,r.jsx)(t.code,{children:"Newable"}),"< ",(0,r.jsx)(t.code,{children:"T"})," >"]}),(0,r.jsx)(t.td,{style:{textAlign:"left"},children:"The class of the entity."})]}),(0,r.jsxs)(t.tr,{children:[(0,r.jsx)(t.td,{style:{textAlign:"left"},children:(0,r.jsx)(t.code,{children:"properties"})}),(0,r.jsxs)(t.td,{style:{textAlign:"left"},children:[(0,r.jsx)(t.code,{children:"NonEmptyObject"}),"< ",(0,r.jsx)(t.code,{children:"P"})," >"]}),(0,r.jsx)(t.td,{style:{textAlign:"left"},children:"The properties of the entity."})]}),(0,r.jsxs)(t.tr,{children:[(0,r.jsxs)(t.td,{style:{textAlign:"left"},children:[(0,r.jsx)(t.code,{children:"build"}),"?"]}),(0,r.jsxs)(t.td,{style:{textAlign:"left"},children:["(",(0,r.jsx)(t.code,{children:"builder"}),": ",(0,r.jsx)(t.a,{href:"/verse/docs/api/model/builder/interfaces/EntityBuilder",children:(0,r.jsx)(t.code,{children:"EntityBuilder"})}),"< ",(0,r.jsx)(t.code,{children:"P"}),", ",(0,r.jsx)(t.code,{children:"T"})," >) => ",(0,r.jsx)(t.code,{children:"void"})]}),(0,r.jsx)(t.td,{style:{textAlign:"left"},children:"An optional builder function."})]})]})]}),"\n",(0,r.jsx)(t.h3,{id:"returns",children:"Returns"}),"\n",(0,r.jsxs)(t.p,{children:[(0,r.jsx)(t.a,{href:"/verse/docs/api/model/model/classes/EntityModel",children:(0,r.jsx)(t.code,{children:"EntityModel"})}),"< ",(0,r.jsx)(t.code,{children:"P"}),", ",(0,r.jsx)(t.code,{children:"T"})," >"]}),"\n",(0,r.jsx)(t.p,{children:"The created entity model."}),"\n",(0,r.jsx)(t.h3,{id:"source",children:"Source"}),"\n",(0,r.jsx)(t.p,{children:(0,r.jsx)(t.a,{href:"https://github.com/operativa-dev/verse/blob/f3eaeda/packages/verse-core/src/model/builder.ts#L92",children:"packages/verse-core/src/model/builder.ts:92"})}),"\n",(0,r.jsx)(t.h2,{id:"entityproperties-build",children:"entity(properties, build)"}),"\n",(0,r.jsxs)(t.blockquote,{children:["\n",(0,r.jsxs)(t.p,{children:[(0,r.jsx)(t.strong,{children:"entity"}),"<",(0,r.jsx)(t.code,{children:"T"}),", ",(0,r.jsx)(t.code,{children:"P"}),">(",(0,r.jsx)(t.code,{children:"properties"}),": ",(0,r.jsx)(t.code,{children:"NonEmptyObject"}),"< ",(0,r.jsx)(t.code,{children:"P"})," >, ",(0,r.jsx)(t.code,{children:"build"}),"?:     (",(0,r.jsx)(t.code,{children:"builder"}),": ",(0,r.jsx)(t.a,{href:"/verse/docs/api/model/builder/interfaces/EntityBuilder",children:(0,r.jsx)(t.code,{children:"EntityBuilder"})}),"< ",(0,r.jsx)(t.code,{children:"P"}),", ",(0,r.jsx)(t.a,{href:"/verse/docs/api/model/builder/type-aliases/UnwrapProperties",children:(0,r.jsx)(t.code,{children:"UnwrapProperties"})}),"< ",(0,r.jsx)(t.code,{children:"P"})," > >) => ",(0,r.jsx)(t.code,{children:"void"}),"): ",(0,r.jsx)(t.a,{href:"/verse/docs/api/model/model/classes/EntityModel",children:(0,r.jsx)(t.code,{children:"EntityModel"})}),"< ",(0,r.jsx)(t.code,{children:"P"}),", ",(0,r.jsx)(t.a,{href:"/verse/docs/api/model/builder/type-aliases/UnwrapProperties",children:(0,r.jsx)(t.code,{children:"UnwrapProperties"})}),"< ",(0,r.jsx)(t.code,{children:"P"})," > >"]}),"\n"]}),"\n",(0,r.jsxs)(t.p,{children:["Builds an ",(0,r.jsx)(t.a,{href:"/verse/docs/api/model/model/classes/EntityModel",children:"EntityModel"})," based on an Object. The type of the entity can be inferred using\nthe ",(0,r.jsx)(t.a,{href:"/verse/docs/api/verse/type-aliases/EntityType",children:"EntityType"})," utility type."]}),"\n",(0,r.jsx)(t.h3,{id:"example-1",children:"Example"}),"\n",(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{className:"language-ts",metastring:"showLineNumbers",children:'const objectModel = {\n  albums: entity(\n    {\n      id: int(),\n      name: string({ maxLength: 100 }),\n      artistId: int({ nullable: false, column: "ArtistId" }),\n    },\n    builder => {\n      builder.table("Albums");\n      builder.key("id");\n      builder.references(Artist, "artistId");\n    }\n  ),\n};\n\ntype AlbumType = EntityType<typeof objectModel.albums>;\n'})}),"\n",(0,r.jsx)(t.h3,{id:"type-parameters-1",children:"Type parameters"}),"\n",(0,r.jsxs)(t.table,{children:[(0,r.jsx)(t.thead,{children:(0,r.jsx)(t.tr,{children:(0,r.jsx)(t.th,{style:{textAlign:"left"},children:"Type parameter"})})}),(0,r.jsxs)(t.tbody,{children:[(0,r.jsx)(t.tr,{children:(0,r.jsxs)(t.td,{style:{textAlign:"left"},children:[(0,r.jsx)(t.code,{children:"T"})," extends ",(0,r.jsx)(t.code,{children:"object"})]})}),(0,r.jsx)(t.tr,{children:(0,r.jsxs)(t.td,{style:{textAlign:"left"},children:[(0,r.jsx)(t.code,{children:"P"})," extends ",(0,r.jsx)(t.a,{href:"/verse/docs/api/model/builder/type-aliases/Properties",children:(0,r.jsx)(t.code,{children:"Properties"})}),"< ",(0,r.jsx)(t.code,{children:"T"})," >"]})})]})]}),"\n",(0,r.jsx)(t.h3,{id:"parameters-1",children:"Parameters"}),"\n",(0,r.jsxs)(t.table,{children:[(0,r.jsx)(t.thead,{children:(0,r.jsxs)(t.tr,{children:[(0,r.jsx)(t.th,{style:{textAlign:"left"},children:"Parameter"}),(0,r.jsx)(t.th,{style:{textAlign:"left"},children:"Type"}),(0,r.jsx)(t.th,{style:{textAlign:"left"},children:"Description"})]})}),(0,r.jsxs)(t.tbody,{children:[(0,r.jsxs)(t.tr,{children:[(0,r.jsx)(t.td,{style:{textAlign:"left"},children:(0,r.jsx)(t.code,{children:"properties"})}),(0,r.jsxs)(t.td,{style:{textAlign:"left"},children:[(0,r.jsx)(t.code,{children:"NonEmptyObject"}),"< ",(0,r.jsx)(t.code,{children:"P"})," >"]}),(0,r.jsx)(t.td,{style:{textAlign:"left"},children:"The properties of the entity."})]}),(0,r.jsxs)(t.tr,{children:[(0,r.jsxs)(t.td,{style:{textAlign:"left"},children:[(0,r.jsx)(t.code,{children:"build"}),"?"]}),(0,r.jsxs)(t.td,{style:{textAlign:"left"},children:["(",(0,r.jsx)(t.code,{children:"builder"}),": ",(0,r.jsx)(t.a,{href:"/verse/docs/api/model/builder/interfaces/EntityBuilder",children:(0,r.jsx)(t.code,{children:"EntityBuilder"})}),"< ",(0,r.jsx)(t.code,{children:"P"}),", ",(0,r.jsx)(t.a,{href:"/verse/docs/api/model/builder/type-aliases/UnwrapProperties",children:(0,r.jsx)(t.code,{children:"UnwrapProperties"})}),"< ",(0,r.jsx)(t.code,{children:"P"})," > >) => ",(0,r.jsx)(t.code,{children:"void"})]}),(0,r.jsx)(t.td,{style:{textAlign:"left"},children:"An optional builder function."})]})]})]}),"\n",(0,r.jsx)(t.h3,{id:"returns-1",children:"Returns"}),"\n",(0,r.jsxs)(t.p,{children:[(0,r.jsx)(t.a,{href:"/verse/docs/api/model/model/classes/EntityModel",children:(0,r.jsx)(t.code,{children:"EntityModel"})}),"< ",(0,r.jsx)(t.code,{children:"P"}),", ",(0,r.jsx)(t.a,{href:"/verse/docs/api/model/builder/type-aliases/UnwrapProperties",children:(0,r.jsx)(t.code,{children:"UnwrapProperties"})}),"< ",(0,r.jsx)(t.code,{children:"P"})," > >"]}),"\n",(0,r.jsx)(t.p,{children:"The created entity model."}),"\n",(0,r.jsx)(t.h3,{id:"source-1",children:"Source"}),"\n",(0,r.jsx)(t.p,{children:(0,r.jsx)(t.a,{href:"https://github.com/operativa-dev/verse/blob/f3eaeda/packages/verse-core/src/model/builder.ts#L108",children:"packages/verse-core/src/model/builder.ts:108"})})]})}function h(e={}){const{wrapper:t}={...(0,n.R)(),...e.components};return t?(0,r.jsx)(t,{...e,children:(0,r.jsx)(a,{...e})}):a(e)}},768:(e,t,s)=>{s.d(t,{R:()=>l,x:()=>d});var r=s(1855);const n={},i=r.createContext(n);function l(e){const t=r.useContext(i);return r.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function d(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(n):e.components||n:l(e.components),r.createElement(i.Provider,{value:t},e.children)}}}]);