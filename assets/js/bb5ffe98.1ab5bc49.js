"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[1982],{4165:(e,s,l)=>{l.r(s),l.d(s,{assets:()=>h,contentTitle:()=>n,default:()=>o,frontMatter:()=>c,metadata:()=>i,toc:()=>t});var r=l(3159),d=l(768);const c={title:"SqlNode"},n="Class: abstract SqlNode",i={id:"api/db/sql/classes/SqlNode",title:"SqlNode",description:"Extended by",source:"@site/docs/api/db/sql/classes/SqlNode.md",sourceDirName:"api/db/sql/classes",slug:"/api/db/sql/classes/SqlNode",permalink:"/verse/docs/api/db/sql/classes/SqlNode",draft:!1,unlisted:!1,tags:[],version:"current",frontMatter:{title:"SqlNode"},sidebar:"apiSidebar",previous:{title:"SqlNegation",permalink:"/verse/docs/api/db/sql/classes/SqlNegation"},next:{title:"SqlNot",permalink:"/verse/docs/api/db/sql/classes/SqlNot"}},h={},t=[{value:"Extended by",id:"extended-by",level:2},{value:"Implements",id:"implements",level:2},{value:"Constructors",id:"constructors",level:2},{value:"new SqlNode(binding)",id:"new-sqlnodebinding",level:3},{value:"Parameters",id:"parameters",level:4},{value:"Returns",id:"returns",level:4},{value:"Source",id:"source",level:4},{value:"Accessors",id:"accessors",level:2},{value:"binding",id:"binding",level:3},{value:"Returns",id:"returns-1",level:4},{value:"Source",id:"source-1",level:4},{value:"identifier",id:"identifier",level:3},{value:"Returns",id:"returns-2",level:4},{value:"Source",id:"source-2",level:4},{value:"nullable",id:"nullable",level:3},{value:"Returns",id:"returns-3",level:4},{value:"Source",id:"source-3",level:4},{value:"readable",id:"readable",level:3},{value:"Returns",id:"returns-4",level:4},{value:"Source",id:"source-4",level:4},{value:"size",id:"size",level:3},{value:"Returns",id:"returns-5",level:4},{value:"Source",id:"source-5",level:4},{value:"type",id:"type",level:3},{value:"Returns",id:"returns-6",level:4},{value:"Source",id:"source-6",level:4},{value:"Methods",id:"methods",level:2},{value:"accept()",id:"accept",level:3},{value:"Type parameters",id:"type-parameters",level:4},{value:"Parameters",id:"parameters-1",level:4},{value:"Returns",id:"returns-7",level:4},{value:"Source",id:"source-7",level:4},{value:"apply()",id:"apply",level:3},{value:"Parameters",id:"parameters-2",level:4},{value:"Returns",id:"returns-8",level:4},{value:"Source",id:"source-8",level:4},{value:"bind()",id:"bind",level:3},{value:"Parameters",id:"parameters-3",level:4},{value:"Returns",id:"returns-9",level:4},{value:"Source",id:"source-9",level:4},{value:"compare()",id:"compare",level:3},{value:"Parameters",id:"parameters-4",level:4},{value:"Returns",id:"returns-10",level:4},{value:"Source",id:"source-10",level:4},{value:"equals()",id:"equals",level:3},{value:"Parameters",id:"parameters-5",level:4},{value:"Returns",id:"returns-11",level:4},{value:"Implementation of",id:"implementation-of",level:4},{value:"Source",id:"source-11",level:4},{value:"hashCode()",id:"hashcode",level:3},{value:"Returns",id:"returns-12",level:4},{value:"Implementation of",id:"implementation-of-1",level:4},{value:"Source",id:"source-12",level:4},{value:"identify()",id:"identify",level:3},{value:"Parameters",id:"parameters-6",level:4},{value:"Returns",id:"returns-13",level:4},{value:"Source",id:"source-13",level:4},{value:"map()",id:"map",level:3},{value:"Parameters",id:"parameters-7",level:4},{value:"Returns",id:"returns-14",level:4},{value:"Source",id:"source-14",level:4},{value:"reduce()",id:"reduce",level:3},{value:"Returns",id:"returns-15",level:4},{value:"Source",id:"source-15",level:4},{value:"rewrite()",id:"rewrite",level:3},{value:"Parameters",id:"parameters-8",level:4},{value:"Returns",id:"returns-16",level:4},{value:"Source",id:"source-16",level:4},{value:"scope()",id:"scope",level:3},{value:"Parameters",id:"parameters-9",level:4},{value:"Returns",id:"returns-17",level:4},{value:"Source",id:"source-17",level:4},{value:"uniquify()",id:"uniquify",level:3},{value:"Parameters",id:"parameters-10",level:4},{value:"Returns",id:"returns-18",level:4},{value:"Source",id:"source-18",level:4}];function a(e){const s={a:"a",blockquote:"blockquote",code:"code",h1:"h1",h2:"h2",h3:"h3",h4:"h4",hr:"hr",li:"li",p:"p",strong:"strong",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",ul:"ul",...(0,d.R)(),...e.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsxs)(s.h1,{id:"class-abstract-sqlnode",children:["Class: ",(0,r.jsx)(s.code,{children:"abstract"})," SqlNode"]}),"\n",(0,r.jsx)(s.h2,{id:"extended-by",children:"Extended by"}),"\n",(0,r.jsxs)(s.ul,{children:["\n",(0,r.jsx)(s.li,{children:(0,r.jsx)(s.a,{href:"/verse/docs/api/db/sql/classes/SqlCreateDatabase",children:(0,r.jsx)(s.code,{children:"SqlCreateDatabase"})})}),"\n",(0,r.jsx)(s.li,{children:(0,r.jsx)(s.a,{href:"/verse/docs/api/db/sql/classes/SqlDropDatabase",children:(0,r.jsx)(s.code,{children:"SqlDropDatabase"})})}),"\n",(0,r.jsx)(s.li,{children:(0,r.jsx)(s.a,{href:"/verse/docs/api/db/sql/classes/SqlCreateTable",children:(0,r.jsx)(s.code,{children:"SqlCreateTable"})})}),"\n",(0,r.jsx)(s.li,{children:(0,r.jsx)(s.a,{href:"/verse/docs/api/db/sql/classes/SqlDropTable",children:(0,r.jsx)(s.code,{children:"SqlDropTable"})})}),"\n",(0,r.jsx)(s.li,{children:(0,r.jsx)(s.a,{href:"/verse/docs/api/db/sql/classes/SqlRenameTable",children:(0,r.jsx)(s.code,{children:"SqlRenameTable"})})}),"\n",(0,r.jsx)(s.li,{children:(0,r.jsx)(s.a,{href:"/verse/docs/api/db/sql/classes/SqlCreateIndex",children:(0,r.jsx)(s.code,{children:"SqlCreateIndex"})})}),"\n",(0,r.jsx)(s.li,{children:(0,r.jsx)(s.a,{href:"/verse/docs/api/db/sql/classes/SqlDropIndex",children:(0,r.jsx)(s.code,{children:"SqlDropIndex"})})}),"\n",(0,r.jsx)(s.li,{children:(0,r.jsx)(s.a,{href:"/verse/docs/api/db/sql/classes/SqlCreateSequence",children:(0,r.jsx)(s.code,{children:"SqlCreateSequence"})})}),"\n",(0,r.jsx)(s.li,{children:(0,r.jsx)(s.a,{href:"/verse/docs/api/db/sql/classes/SqlDropSequence",children:(0,r.jsx)(s.code,{children:"SqlDropSequence"})})}),"\n",(0,r.jsx)(s.li,{children:(0,r.jsx)(s.a,{href:"/verse/docs/api/db/sql/classes/SqlAddColumn",children:(0,r.jsx)(s.code,{children:"SqlAddColumn"})})}),"\n",(0,r.jsx)(s.li,{children:(0,r.jsx)(s.a,{href:"/verse/docs/api/db/sql/classes/SqlDropColumn",children:(0,r.jsx)(s.code,{children:"SqlDropColumn"})})}),"\n",(0,r.jsx)(s.li,{children:(0,r.jsx)(s.a,{href:"/verse/docs/api/db/sql/classes/SqlRenameColumn",children:(0,r.jsx)(s.code,{children:"SqlRenameColumn"})})}),"\n",(0,r.jsx)(s.li,{children:(0,r.jsx)(s.a,{href:"/verse/docs/api/db/sql/classes/SqlInsert",children:(0,r.jsx)(s.code,{children:"SqlInsert"})})}),"\n",(0,r.jsx)(s.li,{children:(0,r.jsx)(s.a,{href:"/verse/docs/api/db/sql/classes/SqlUpdate",children:(0,r.jsx)(s.code,{children:"SqlUpdate"})})}),"\n",(0,r.jsx)(s.li,{children:(0,r.jsx)(s.a,{href:"/verse/docs/api/db/sql/classes/SqlDelete",children:(0,r.jsx)(s.code,{children:"SqlDelete"})})}),"\n",(0,r.jsx)(s.li,{children:(0,r.jsx)(s.a,{href:"/verse/docs/api/db/sql/classes/SqlForeignKey",children:(0,r.jsx)(s.code,{children:"SqlForeignKey"})})}),"\n",(0,r.jsx)(s.li,{children:(0,r.jsx)(s.a,{href:"/verse/docs/api/db/sql/classes/SqlAddForeignKey",children:(0,r.jsx)(s.code,{children:"SqlAddForeignKey"})})}),"\n",(0,r.jsx)(s.li,{children:(0,r.jsx)(s.a,{href:"/verse/docs/api/db/sql/classes/SqlColumn",children:(0,r.jsx)(s.code,{children:"SqlColumn"})})}),"\n",(0,r.jsx)(s.li,{children:(0,r.jsx)(s.a,{href:"/verse/docs/api/db/sql/classes/SqlSelect",children:(0,r.jsx)(s.code,{children:"SqlSelect"})})}),"\n",(0,r.jsx)(s.li,{children:(0,r.jsx)(s.a,{href:"/verse/docs/api/db/sql/classes/SqlJoin",children:(0,r.jsx)(s.code,{children:"SqlJoin"})})}),"\n",(0,r.jsx)(s.li,{children:(0,r.jsx)(s.a,{href:"/verse/docs/api/db/sql/classes/SqlOrderBy",children:(0,r.jsx)(s.code,{children:"SqlOrderBy"})})}),"\n",(0,r.jsx)(s.li,{children:(0,r.jsx)(s.a,{href:"/verse/docs/api/db/sql/classes/SqlOrdering",children:(0,r.jsx)(s.code,{children:"SqlOrdering"})})}),"\n",(0,r.jsx)(s.li,{children:(0,r.jsx)(s.a,{href:"/verse/docs/api/db/sql/classes/SqlBinary",children:(0,r.jsx)(s.code,{children:"SqlBinary"})})}),"\n",(0,r.jsx)(s.li,{children:(0,r.jsx)(s.a,{href:"/verse/docs/api/db/sql/classes/SqlAlias",children:(0,r.jsx)(s.code,{children:"SqlAlias"})})}),"\n",(0,r.jsx)(s.li,{children:(0,r.jsx)(s.a,{href:"/verse/docs/api/db/sql/classes/SqlTypeAlias",children:(0,r.jsx)(s.code,{children:"SqlTypeAlias"})})}),"\n",(0,r.jsx)(s.li,{children:(0,r.jsx)(s.a,{href:"/verse/docs/api/db/sql/classes/SqlFunction",children:(0,r.jsx)(s.code,{children:"SqlFunction"})})}),"\n",(0,r.jsx)(s.li,{children:(0,r.jsx)(s.a,{href:"/verse/docs/api/db/sql/classes/SqlMember",children:(0,r.jsx)(s.code,{children:"SqlMember"})})}),"\n",(0,r.jsx)(s.li,{children:(0,r.jsx)(s.a,{href:"/verse/docs/api/db/sql/classes/SqlIdentifier",children:(0,r.jsx)(s.code,{children:"SqlIdentifier"})})}),"\n",(0,r.jsx)(s.li,{children:(0,r.jsx)(s.a,{href:"/verse/docs/api/db/sql/classes/SqlExists",children:(0,r.jsx)(s.code,{children:"SqlExists"})})}),"\n",(0,r.jsx)(s.li,{children:(0,r.jsx)(s.a,{href:"/verse/docs/api/db/sql/classes/SqlLike",children:(0,r.jsx)(s.code,{children:"SqlLike"})})}),"\n",(0,r.jsx)(s.li,{children:(0,r.jsx)(s.a,{href:"/verse/docs/api/db/sql/classes/SqlNotLike",children:(0,r.jsx)(s.code,{children:"SqlNotLike"})})}),"\n",(0,r.jsx)(s.li,{children:(0,r.jsx)(s.a,{href:"/verse/docs/api/db/sql/classes/SqlNot",children:(0,r.jsx)(s.code,{children:"SqlNot"})})}),"\n",(0,r.jsx)(s.li,{children:(0,r.jsx)(s.a,{href:"/verse/docs/api/db/sql/classes/SqlNegation",children:(0,r.jsx)(s.code,{children:"SqlNegation"})})}),"\n",(0,r.jsx)(s.li,{children:(0,r.jsx)(s.a,{href:"/verse/docs/api/db/sql/classes/SqlString",children:(0,r.jsx)(s.code,{children:"SqlString"})})}),"\n",(0,r.jsx)(s.li,{children:(0,r.jsx)(s.a,{href:"/verse/docs/api/db/sql/classes/SqlTimestamp",children:(0,r.jsx)(s.code,{children:"SqlTimestamp"})})}),"\n",(0,r.jsx)(s.li,{children:(0,r.jsx)(s.a,{href:"/verse/docs/api/db/sql/classes/SqlNumber",children:(0,r.jsx)(s.code,{children:"SqlNumber"})})}),"\n",(0,r.jsx)(s.li,{children:(0,r.jsx)(s.a,{href:"/verse/docs/api/db/sql/classes/SqlBoolean",children:(0,r.jsx)(s.code,{children:"SqlBoolean"})})}),"\n",(0,r.jsx)(s.li,{children:(0,r.jsx)(s.a,{href:"/verse/docs/api/db/sql/classes/SqlNull",children:(0,r.jsx)(s.code,{children:"SqlNull"})})}),"\n",(0,r.jsx)(s.li,{children:(0,r.jsx)(s.a,{href:"/verse/docs/api/db/sql/classes/SqlParameter",children:(0,r.jsx)(s.code,{children:"SqlParameter"})})}),"\n",(0,r.jsx)(s.li,{children:(0,r.jsx)(s.a,{href:"/verse/docs/api/db/sql/classes/SqlStar",children:(0,r.jsx)(s.code,{children:"SqlStar"})})}),"\n",(0,r.jsx)(s.li,{children:(0,r.jsx)(s.a,{href:"/verse/docs/api/db/sql/classes/SqlIsNull",children:(0,r.jsx)(s.code,{children:"SqlIsNull"})})}),"\n",(0,r.jsx)(s.li,{children:(0,r.jsx)(s.a,{href:"/verse/docs/api/db/sql/classes/SqlIsNotNull",children:(0,r.jsx)(s.code,{children:"SqlIsNotNull"})})}),"\n",(0,r.jsx)(s.li,{children:(0,r.jsx)(s.a,{href:"/verse/docs/api/db/sql/classes/SqlComposite",children:(0,r.jsx)(s.code,{children:"SqlComposite"})})}),"\n",(0,r.jsx)(s.li,{children:(0,r.jsx)(s.a,{href:"/verse/docs/api/db/sql/classes/SqlRaw",children:(0,r.jsx)(s.code,{children:"SqlRaw"})})}),"\n",(0,r.jsx)(s.li,{children:(0,r.jsx)(s.a,{href:"/verse/docs/api/db/sql/classes/SqlCase",children:(0,r.jsx)(s.code,{children:"SqlCase"})})}),"\n",(0,r.jsx)(s.li,{children:(0,r.jsx)(s.a,{href:"/verse/docs/api/db/sql/classes/SqlSet",children:(0,r.jsx)(s.code,{children:"SqlSet"})})}),"\n"]}),"\n",(0,r.jsx)(s.h2,{id:"implements",children:"Implements"}),"\n",(0,r.jsxs)(s.ul,{children:["\n",(0,r.jsx)(s.li,{children:(0,r.jsx)(s.code,{children:"ValueObject"})}),"\n"]}),"\n",(0,r.jsx)(s.h2,{id:"constructors",children:"Constructors"}),"\n",(0,r.jsx)(s.h3,{id:"new-sqlnodebinding",children:"new SqlNode(binding)"}),"\n",(0,r.jsxs)(s.blockquote,{children:["\n",(0,r.jsxs)(s.p,{children:[(0,r.jsx)(s.strong,{children:(0,r.jsx)(s.code,{children:"protected"})})," ",(0,r.jsx)(s.strong,{children:"new SqlNode"}),"(",(0,r.jsx)(s.code,{children:"binding"}),"?: ",(0,r.jsx)(s.a,{href:"/verse/docs/api/db/sql/classes/SqlBinding",children:(0,r.jsx)(s.code,{children:"SqlBinding"})}),"): ",(0,r.jsx)(s.a,{href:"/verse/docs/api/db/sql/classes/SqlNode",children:(0,r.jsx)(s.code,{children:"SqlNode"})})]}),"\n"]}),"\n",(0,r.jsx)(s.h4,{id:"parameters",children:"Parameters"}),"\n",(0,r.jsxs)(s.table,{children:[(0,r.jsx)(s.thead,{children:(0,r.jsxs)(s.tr,{children:[(0,r.jsx)(s.th,{style:{textAlign:"left"},children:"Parameter"}),(0,r.jsx)(s.th,{style:{textAlign:"left"},children:"Type"})]})}),(0,r.jsx)(s.tbody,{children:(0,r.jsxs)(s.tr,{children:[(0,r.jsxs)(s.td,{style:{textAlign:"left"},children:[(0,r.jsx)(s.code,{children:"binding"}),"?"]}),(0,r.jsx)(s.td,{style:{textAlign:"left"},children:(0,r.jsx)(s.a,{href:"/verse/docs/api/db/sql/classes/SqlBinding",children:(0,r.jsx)(s.code,{children:"SqlBinding"})})})]})})]}),"\n",(0,r.jsx)(s.h4,{id:"returns",children:"Returns"}),"\n",(0,r.jsx)(s.p,{children:(0,r.jsx)(s.a,{href:"/verse/docs/api/db/sql/classes/SqlNode",children:(0,r.jsx)(s.code,{children:"SqlNode"})})}),"\n",(0,r.jsx)(s.h4,{id:"source",children:"Source"}),"\n",(0,r.jsx)(s.p,{children:(0,r.jsx)(s.a,{href:"https://github.com/operativa-dev/verse/blob/f2cb028/packages/verse-core/src/db/sql.ts#L96",children:"packages/verse-core/src/db/sql.ts:96"})}),"\n",(0,r.jsx)(s.h2,{id:"accessors",children:"Accessors"}),"\n",(0,r.jsx)(s.h3,{id:"binding",children:"binding"}),"\n",(0,r.jsxs)(s.blockquote,{children:["\n",(0,r.jsxs)(s.p,{children:[(0,r.jsx)(s.strong,{children:(0,r.jsx)(s.code,{children:"get"})})," ",(0,r.jsx)(s.strong,{children:"binding"}),"(): ",(0,r.jsx)(s.code,{children:"undefined"})," | ",(0,r.jsx)(s.a,{href:"/verse/docs/api/db/sql/classes/SqlBinding",children:(0,r.jsx)(s.code,{children:"SqlBinding"})})]}),"\n"]}),"\n",(0,r.jsx)(s.h4,{id:"returns-1",children:"Returns"}),"\n",(0,r.jsxs)(s.p,{children:[(0,r.jsx)(s.code,{children:"undefined"})," | ",(0,r.jsx)(s.a,{href:"/verse/docs/api/db/sql/classes/SqlBinding",children:(0,r.jsx)(s.code,{children:"SqlBinding"})})]}),"\n",(0,r.jsx)(s.h4,{id:"source-1",children:"Source"}),"\n",(0,r.jsx)(s.p,{children:(0,r.jsx)(s.a,{href:"https://github.com/operativa-dev/verse/blob/f2cb028/packages/verse-core/src/db/sql.ts#L100",children:"packages/verse-core/src/db/sql.ts:100"})}),"\n",(0,r.jsx)(s.hr,{}),"\n",(0,r.jsx)(s.h3,{id:"identifier",children:"identifier"}),"\n",(0,r.jsxs)(s.blockquote,{children:["\n",(0,r.jsxs)(s.p,{children:[(0,r.jsx)(s.strong,{children:(0,r.jsx)(s.code,{children:"get"})})," ",(0,r.jsx)(s.strong,{children:"identifier"}),"(): ",(0,r.jsx)(s.a,{href:"/verse/docs/api/db/sql/classes/SqlIdentifier",children:(0,r.jsx)(s.code,{children:"SqlIdentifier"})})]}),"\n"]}),"\n",(0,r.jsx)(s.h4,{id:"returns-2",children:"Returns"}),"\n",(0,r.jsx)(s.p,{children:(0,r.jsx)(s.a,{href:"/verse/docs/api/db/sql/classes/SqlIdentifier",children:(0,r.jsx)(s.code,{children:"SqlIdentifier"})})}),"\n",(0,r.jsx)(s.h4,{id:"source-2",children:"Source"}),"\n",(0,r.jsx)(s.p,{children:(0,r.jsx)(s.a,{href:"https://github.com/operativa-dev/verse/blob/f2cb028/packages/verse-core/src/db/sql.ts#L125",children:"packages/verse-core/src/db/sql.ts:125"})}),"\n",(0,r.jsx)(s.hr,{}),"\n",(0,r.jsx)(s.h3,{id:"nullable",children:"nullable"}),"\n",(0,r.jsxs)(s.blockquote,{children:["\n",(0,r.jsxs)(s.p,{children:[(0,r.jsx)(s.strong,{children:(0,r.jsx)(s.code,{children:"get"})})," ",(0,r.jsx)(s.strong,{children:"nullable"}),"(): ",(0,r.jsx)(s.code,{children:"undefined"})," | ",(0,r.jsx)(s.code,{children:"boolean"})]}),"\n"]}),"\n",(0,r.jsx)(s.h4,{id:"returns-3",children:"Returns"}),"\n",(0,r.jsxs)(s.p,{children:[(0,r.jsx)(s.code,{children:"undefined"})," | ",(0,r.jsx)(s.code,{children:"boolean"})]}),"\n",(0,r.jsx)(s.h4,{id:"source-3",children:"Source"}),"\n",(0,r.jsx)(s.p,{children:(0,r.jsx)(s.a,{href:"https://github.com/operativa-dev/verse/blob/f2cb028/packages/verse-core/src/db/sql.ts#L108",children:"packages/verse-core/src/db/sql.ts:108"})}),"\n",(0,r.jsx)(s.hr,{}),"\n",(0,r.jsx)(s.h3,{id:"readable",children:"readable"}),"\n",(0,r.jsxs)(s.blockquote,{children:["\n",(0,r.jsxs)(s.p,{children:[(0,r.jsx)(s.strong,{children:(0,r.jsx)(s.code,{children:"get"})})," ",(0,r.jsx)(s.strong,{children:"readable"}),"(): ",(0,r.jsx)(s.code,{children:"boolean"})]}),"\n"]}),"\n",(0,r.jsx)(s.h4,{id:"returns-4",children:"Returns"}),"\n",(0,r.jsx)(s.p,{children:(0,r.jsx)(s.code,{children:"boolean"})}),"\n",(0,r.jsx)(s.h4,{id:"source-4",children:"Source"}),"\n",(0,r.jsx)(s.p,{children:(0,r.jsx)(s.a,{href:"https://github.com/operativa-dev/verse/blob/f2cb028/packages/verse-core/src/db/sql.ts#L112",children:"packages/verse-core/src/db/sql.ts:112"})}),"\n",(0,r.jsx)(s.hr,{}),"\n",(0,r.jsx)(s.h3,{id:"size",children:"size"}),"\n",(0,r.jsxs)(s.blockquote,{children:["\n",(0,r.jsxs)(s.p,{children:[(0,r.jsx)(s.strong,{children:(0,r.jsx)(s.code,{children:"get"})})," ",(0,r.jsx)(s.strong,{children:"size"}),"(): ",(0,r.jsx)(s.code,{children:"number"})]}),"\n"]}),"\n",(0,r.jsx)(s.h4,{id:"returns-5",children:"Returns"}),"\n",(0,r.jsx)(s.p,{children:(0,r.jsx)(s.code,{children:"number"})}),"\n",(0,r.jsx)(s.h4,{id:"source-5",children:"Source"}),"\n",(0,r.jsx)(s.p,{children:(0,r.jsx)(s.a,{href:"https://github.com/operativa-dev/verse/blob/f2cb028/packages/verse-core/src/db/sql.ts#L153",children:"packages/verse-core/src/db/sql.ts:153"})}),"\n",(0,r.jsx)(s.hr,{}),"\n",(0,r.jsx)(s.h3,{id:"type",children:"type"}),"\n",(0,r.jsxs)(s.blockquote,{children:["\n",(0,r.jsxs)(s.p,{children:[(0,r.jsx)(s.strong,{children:(0,r.jsx)(s.code,{children:"get"})})," ",(0,r.jsx)(s.strong,{children:"type"}),"(): ",(0,r.jsx)(s.code,{children:"undefined"})," | ",(0,r.jsx)(s.a,{href:"/verse/docs/api/db/sql/type-aliases/SqlType",children:(0,r.jsx)(s.code,{children:"SqlType"})})]}),"\n"]}),"\n",(0,r.jsx)(s.h4,{id:"returns-6",children:"Returns"}),"\n",(0,r.jsxs)(s.p,{children:[(0,r.jsx)(s.code,{children:"undefined"})," | ",(0,r.jsx)(s.a,{href:"/verse/docs/api/db/sql/type-aliases/SqlType",children:(0,r.jsx)(s.code,{children:"SqlType"})})]}),"\n",(0,r.jsx)(s.h4,{id:"source-6",children:"Source"}),"\n",(0,r.jsx)(s.p,{children:(0,r.jsx)(s.a,{href:"https://github.com/operativa-dev/verse/blob/f2cb028/packages/verse-core/src/db/sql.ts#L104",children:"packages/verse-core/src/db/sql.ts:104"})}),"\n",(0,r.jsx)(s.h2,{id:"methods",children:"Methods"}),"\n",(0,r.jsx)(s.h3,{id:"accept",children:"accept()"}),"\n",(0,r.jsxs)(s.blockquote,{children:["\n",(0,r.jsxs)(s.p,{children:[(0,r.jsx)(s.strong,{children:"accept"}),"<",(0,r.jsx)(s.code,{children:"T"}),", ",(0,r.jsx)(s.code,{children:"S"}),">(",(0,r.jsx)(s.code,{children:"visitor"}),": ",(0,r.jsx)(s.a,{href:"/verse/docs/api/db/visitor/classes/SqlVisitor",children:(0,r.jsx)(s.code,{children:"SqlVisitor"})}),"< ",(0,r.jsx)(s.code,{children:"T"}),", ",(0,r.jsx)(s.code,{children:"unknown"})," >, ",(0,r.jsx)(s.code,{children:"state"}),"?: ",(0,r.jsx)(s.code,{children:"S"}),"): ",(0,r.jsx)(s.code,{children:"T"})]}),"\n"]}),"\n",(0,r.jsx)(s.h4,{id:"type-parameters",children:"Type parameters"}),"\n",(0,r.jsxs)(s.table,{children:[(0,r.jsx)(s.thead,{children:(0,r.jsxs)(s.tr,{children:[(0,r.jsx)(s.th,{style:{textAlign:"left"},children:"Type parameter"}),(0,r.jsx)(s.th,{style:{textAlign:"left"},children:"Value"})]})}),(0,r.jsxs)(s.tbody,{children:[(0,r.jsxs)(s.tr,{children:[(0,r.jsx)(s.td,{style:{textAlign:"left"},children:(0,r.jsx)(s.code,{children:"T"})}),(0,r.jsx)(s.td,{style:{textAlign:"left"},children:"-"})]}),(0,r.jsxs)(s.tr,{children:[(0,r.jsx)(s.td,{style:{textAlign:"left"},children:(0,r.jsx)(s.code,{children:"S"})}),(0,r.jsx)(s.td,{style:{textAlign:"left"},children:(0,r.jsx)(s.code,{children:"unknown"})})]})]})]}),"\n",(0,r.jsx)(s.h4,{id:"parameters-1",children:"Parameters"}),"\n",(0,r.jsxs)(s.table,{children:[(0,r.jsx)(s.thead,{children:(0,r.jsxs)(s.tr,{children:[(0,r.jsx)(s.th,{style:{textAlign:"left"},children:"Parameter"}),(0,r.jsx)(s.th,{style:{textAlign:"left"},children:"Type"})]})}),(0,r.jsxs)(s.tbody,{children:[(0,r.jsxs)(s.tr,{children:[(0,r.jsx)(s.td,{style:{textAlign:"left"},children:(0,r.jsx)(s.code,{children:"visitor"})}),(0,r.jsxs)(s.td,{style:{textAlign:"left"},children:[(0,r.jsx)(s.a,{href:"/verse/docs/api/db/visitor/classes/SqlVisitor",children:(0,r.jsx)(s.code,{children:"SqlVisitor"})}),"< ",(0,r.jsx)(s.code,{children:"T"}),", ",(0,r.jsx)(s.code,{children:"unknown"})," >"]})]}),(0,r.jsxs)(s.tr,{children:[(0,r.jsxs)(s.td,{style:{textAlign:"left"},children:[(0,r.jsx)(s.code,{children:"state"}),"?"]}),(0,r.jsx)(s.td,{style:{textAlign:"left"},children:(0,r.jsx)(s.code,{children:"S"})})]})]})]}),"\n",(0,r.jsx)(s.h4,{id:"returns-7",children:"Returns"}),"\n",(0,r.jsx)(s.p,{children:(0,r.jsx)(s.code,{children:"T"})}),"\n",(0,r.jsx)(s.h4,{id:"source-7",children:"Source"}),"\n",(0,r.jsx)(s.p,{children:(0,r.jsx)(s.a,{href:"https://github.com/operativa-dev/verse/blob/f2cb028/packages/verse-core/src/db/sql.ts#L158",children:"packages/verse-core/src/db/sql.ts:158"})}),"\n",(0,r.jsx)(s.hr,{}),"\n",(0,r.jsx)(s.h3,{id:"apply",children:"apply()"}),"\n",(0,r.jsxs)(s.blockquote,{children:["\n",(0,r.jsxs)(s.p,{children:[(0,r.jsx)(s.strong,{children:"apply"}),"(",(0,r.jsx)(s.code,{children:"ctor"}),": ",(0,r.jsx)(s.code,{children:"Newable"}),"< ",(0,r.jsx)(s.a,{href:"/verse/docs/api/db/sql/classes/SqlNode",children:(0,r.jsx)(s.code,{children:"SqlNode"})})," >): ",(0,r.jsx)(s.a,{href:"/verse/docs/api/db/sql/classes/SqlNode",children:(0,r.jsx)(s.code,{children:"SqlNode"})})]}),"\n"]}),"\n",(0,r.jsx)(s.h4,{id:"parameters-2",children:"Parameters"}),"\n",(0,r.jsxs)(s.table,{children:[(0,r.jsx)(s.thead,{children:(0,r.jsxs)(s.tr,{children:[(0,r.jsx)(s.th,{style:{textAlign:"left"},children:"Parameter"}),(0,r.jsx)(s.th,{style:{textAlign:"left"},children:"Type"})]})}),(0,r.jsx)(s.tbody,{children:(0,r.jsxs)(s.tr,{children:[(0,r.jsx)(s.td,{style:{textAlign:"left"},children:(0,r.jsx)(s.code,{children:"ctor"})}),(0,r.jsxs)(s.td,{style:{textAlign:"left"},children:[(0,r.jsx)(s.code,{children:"Newable"}),"< ",(0,r.jsx)(s.a,{href:"/verse/docs/api/db/sql/classes/SqlNode",children:(0,r.jsx)(s.code,{children:"SqlNode"})})," >"]})]})})]}),"\n",(0,r.jsx)(s.h4,{id:"returns-8",children:"Returns"}),"\n",(0,r.jsx)(s.p,{children:(0,r.jsx)(s.a,{href:"/verse/docs/api/db/sql/classes/SqlNode",children:(0,r.jsx)(s.code,{children:"SqlNode"})})}),"\n",(0,r.jsx)(s.h4,{id:"source-8",children:"Source"}),"\n",(0,r.jsx)(s.p,{children:(0,r.jsx)(s.a,{href:"https://github.com/operativa-dev/verse/blob/f2cb028/packages/verse-core/src/db/sql.ts#L145",children:"packages/verse-core/src/db/sql.ts:145"})}),"\n",(0,r.jsx)(s.hr,{}),"\n",(0,r.jsx)(s.h3,{id:"bind",children:"bind()"}),"\n",(0,r.jsxs)(s.blockquote,{children:["\n",(0,r.jsxs)(s.p,{children:[(0,r.jsx)(s.strong,{children:"bind"}),"(",(0,r.jsx)(s.code,{children:"binding"}),": ",(0,r.jsx)(s.a,{href:"/verse/docs/api/db/sql/classes/SqlBinding",children:(0,r.jsx)(s.code,{children:"SqlBinding"})}),"): ",(0,r.jsx)(s.a,{href:"/verse/docs/api/db/sql/classes/SqlNode",children:(0,r.jsx)(s.code,{children:"SqlNode"})})]}),"\n"]}),"\n",(0,r.jsx)(s.h4,{id:"parameters-3",children:"Parameters"}),"\n",(0,r.jsxs)(s.table,{children:[(0,r.jsx)(s.thead,{children:(0,r.jsxs)(s.tr,{children:[(0,r.jsx)(s.th,{style:{textAlign:"left"},children:"Parameter"}),(0,r.jsx)(s.th,{style:{textAlign:"left"},children:"Type"})]})}),(0,r.jsx)(s.tbody,{children:(0,r.jsxs)(s.tr,{children:[(0,r.jsx)(s.td,{style:{textAlign:"left"},children:(0,r.jsx)(s.code,{children:"binding"})}),(0,r.jsx)(s.td,{style:{textAlign:"left"},children:(0,r.jsx)(s.a,{href:"/verse/docs/api/db/sql/classes/SqlBinding",children:(0,r.jsx)(s.code,{children:"SqlBinding"})})})]})})]}),"\n",(0,r.jsx)(s.h4,{id:"returns-9",children:"Returns"}),"\n",(0,r.jsx)(s.p,{children:(0,r.jsx)(s.a,{href:"/verse/docs/api/db/sql/classes/SqlNode",children:(0,r.jsx)(s.code,{children:"SqlNode"})})}),"\n",(0,r.jsx)(s.h4,{id:"source-9",children:"Source"}),"\n",(0,r.jsx)(s.p,{children:(0,r.jsx)(s.a,{href:"https://github.com/operativa-dev/verse/blob/f2cb028/packages/verse-core/src/db/sql.ts#L117",children:"packages/verse-core/src/db/sql.ts:117"})}),"\n",(0,r.jsx)(s.hr,{}),"\n",(0,r.jsx)(s.h3,{id:"compare",children:"compare()"}),"\n",(0,r.jsxs)(s.blockquote,{children:["\n",(0,r.jsxs)(s.p,{children:[(0,r.jsx)(s.strong,{children:"compare"}),"(",(0,r.jsx)(s.code,{children:"op"}),": ",(0,r.jsx)(s.a,{href:"/verse/docs/api/db/sql/type-aliases/SqlBinaryOperator",children:(0,r.jsx)(s.code,{children:"SqlBinaryOperator"})}),", ",(0,r.jsx)(s.code,{children:"other"}),": ",(0,r.jsx)(s.a,{href:"/verse/docs/api/db/sql/classes/SqlNode",children:(0,r.jsx)(s.code,{children:"SqlNode"})}),"): ",(0,r.jsx)(s.a,{href:"/verse/docs/api/db/sql/classes/SqlBinary",children:(0,r.jsx)(s.code,{children:"SqlBinary"})})]}),"\n"]}),"\n",(0,r.jsx)(s.h4,{id:"parameters-4",children:"Parameters"}),"\n",(0,r.jsxs)(s.table,{children:[(0,r.jsx)(s.thead,{children:(0,r.jsxs)(s.tr,{children:[(0,r.jsx)(s.th,{style:{textAlign:"left"},children:"Parameter"}),(0,r.jsx)(s.th,{style:{textAlign:"left"},children:"Type"})]})}),(0,r.jsxs)(s.tbody,{children:[(0,r.jsxs)(s.tr,{children:[(0,r.jsx)(s.td,{style:{textAlign:"left"},children:(0,r.jsx)(s.code,{children:"op"})}),(0,r.jsx)(s.td,{style:{textAlign:"left"},children:(0,r.jsx)(s.a,{href:"/verse/docs/api/db/sql/type-aliases/SqlBinaryOperator",children:(0,r.jsx)(s.code,{children:"SqlBinaryOperator"})})})]}),(0,r.jsxs)(s.tr,{children:[(0,r.jsx)(s.td,{style:{textAlign:"left"},children:(0,r.jsx)(s.code,{children:"other"})}),(0,r.jsx)(s.td,{style:{textAlign:"left"},children:(0,r.jsx)(s.a,{href:"/verse/docs/api/db/sql/classes/SqlNode",children:(0,r.jsx)(s.code,{children:"SqlNode"})})})]})]})]}),"\n",(0,r.jsx)(s.h4,{id:"returns-10",children:"Returns"}),"\n",(0,r.jsx)(s.p,{children:(0,r.jsx)(s.a,{href:"/verse/docs/api/db/sql/classes/SqlBinary",children:(0,r.jsx)(s.code,{children:"SqlBinary"})})}),"\n",(0,r.jsx)(s.h4,{id:"source-10",children:"Source"}),"\n",(0,r.jsx)(s.p,{children:(0,r.jsx)(s.a,{href:"https://github.com/operativa-dev/verse/blob/f2cb028/packages/verse-core/src/db/sql.ts#L149",children:"packages/verse-core/src/db/sql.ts:149"})}),"\n",(0,r.jsx)(s.hr,{}),"\n",(0,r.jsx)(s.h3,{id:"equals",children:"equals()"}),"\n",(0,r.jsxs)(s.blockquote,{children:["\n",(0,r.jsxs)(s.p,{children:[(0,r.jsx)(s.strong,{children:(0,r.jsx)(s.code,{children:"abstract"})})," ",(0,r.jsx)(s.strong,{children:"equals"}),"(",(0,r.jsx)(s.code,{children:"other"}),": ",(0,r.jsx)(s.code,{children:"unknown"}),"): ",(0,r.jsx)(s.code,{children:"boolean"})]}),"\n"]}),"\n",(0,r.jsx)(s.h4,{id:"parameters-5",children:"Parameters"}),"\n",(0,r.jsxs)(s.table,{children:[(0,r.jsx)(s.thead,{children:(0,r.jsxs)(s.tr,{children:[(0,r.jsx)(s.th,{style:{textAlign:"left"},children:"Parameter"}),(0,r.jsx)(s.th,{style:{textAlign:"left"},children:"Type"})]})}),(0,r.jsx)(s.tbody,{children:(0,r.jsxs)(s.tr,{children:[(0,r.jsx)(s.td,{style:{textAlign:"left"},children:(0,r.jsx)(s.code,{children:"other"})}),(0,r.jsx)(s.td,{style:{textAlign:"left"},children:(0,r.jsx)(s.code,{children:"unknown"})})]})})]}),"\n",(0,r.jsx)(s.h4,{id:"returns-11",children:"Returns"}),"\n",(0,r.jsx)(s.p,{children:(0,r.jsx)(s.code,{children:"boolean"})}),"\n",(0,r.jsx)(s.h4,{id:"implementation-of",children:"Implementation of"}),"\n",(0,r.jsx)(s.p,{children:(0,r.jsx)(s.code,{children:"ValueObject.equals"})}),"\n",(0,r.jsx)(s.h4,{id:"source-11",children:"Source"}),"\n",(0,r.jsx)(s.p,{children:(0,r.jsx)(s.a,{href:"https://github.com/operativa-dev/verse/blob/f2cb028/packages/verse-core/src/db/sql.ts#L167",children:"packages/verse-core/src/db/sql.ts:167"})}),"\n",(0,r.jsx)(s.hr,{}),"\n",(0,r.jsx)(s.h3,{id:"hashcode",children:"hashCode()"}),"\n",(0,r.jsxs)(s.blockquote,{children:["\n",(0,r.jsxs)(s.p,{children:[(0,r.jsx)(s.strong,{children:(0,r.jsx)(s.code,{children:"abstract"})})," ",(0,r.jsx)(s.strong,{children:"hashCode"}),"(): ",(0,r.jsx)(s.code,{children:"number"})]}),"\n"]}),"\n",(0,r.jsx)(s.h4,{id:"returns-12",children:"Returns"}),"\n",(0,r.jsx)(s.p,{children:(0,r.jsx)(s.code,{children:"number"})}),"\n",(0,r.jsx)(s.h4,{id:"implementation-of-1",children:"Implementation of"}),"\n",(0,r.jsx)(s.p,{children:(0,r.jsx)(s.code,{children:"ValueObject.hashCode"})}),"\n",(0,r.jsx)(s.h4,{id:"source-12",children:"Source"}),"\n",(0,r.jsx)(s.p,{children:(0,r.jsx)(s.a,{href:"https://github.com/operativa-dev/verse/blob/f2cb028/packages/verse-core/src/db/sql.ts#L168",children:"packages/verse-core/src/db/sql.ts:168"})}),"\n",(0,r.jsx)(s.hr,{}),"\n",(0,r.jsx)(s.h3,{id:"identify",children:"identify()"}),"\n",(0,r.jsxs)(s.blockquote,{children:["\n",(0,r.jsxs)(s.p,{children:[(0,r.jsx)(s.strong,{children:"identify"}),"(",(0,r.jsx)(s.code,{children:"_"}),":     (",(0,r.jsx)(s.code,{children:"n"}),": ",(0,r.jsx)(s.a,{href:"/verse/docs/api/db/sql/classes/SqlNode",children:(0,r.jsx)(s.code,{children:"SqlNode"})}),") => ",(0,r.jsx)(s.a,{href:"/verse/docs/api/db/sql/classes/SqlNode",children:(0,r.jsx)(s.code,{children:"SqlNode"})}),"): ",(0,r.jsx)(s.a,{href:"/verse/docs/api/db/sql/classes/SqlNode",children:(0,r.jsx)(s.code,{children:"SqlNode"})})]}),"\n"]}),"\n",(0,r.jsx)(s.h4,{id:"parameters-6",children:"Parameters"}),"\n",(0,r.jsxs)(s.table,{children:[(0,r.jsx)(s.thead,{children:(0,r.jsxs)(s.tr,{children:[(0,r.jsx)(s.th,{style:{textAlign:"left"},children:"Parameter"}),(0,r.jsx)(s.th,{style:{textAlign:"left"},children:"Type"})]})}),(0,r.jsx)(s.tbody,{children:(0,r.jsxs)(s.tr,{children:[(0,r.jsx)(s.td,{style:{textAlign:"left"},children:(0,r.jsx)(s.code,{children:"_"})}),(0,r.jsxs)(s.td,{style:{textAlign:"left"},children:["(",(0,r.jsx)(s.code,{children:"n"}),": ",(0,r.jsx)(s.a,{href:"/verse/docs/api/db/sql/classes/SqlNode",children:(0,r.jsx)(s.code,{children:"SqlNode"})}),") => ",(0,r.jsx)(s.a,{href:"/verse/docs/api/db/sql/classes/SqlNode",children:(0,r.jsx)(s.code,{children:"SqlNode"})})]})]})})]}),"\n",(0,r.jsx)(s.h4,{id:"returns-13",children:"Returns"}),"\n",(0,r.jsx)(s.p,{children:(0,r.jsx)(s.a,{href:"/verse/docs/api/db/sql/classes/SqlNode",children:(0,r.jsx)(s.code,{children:"SqlNode"})})}),"\n",(0,r.jsx)(s.h4,{id:"source-13",children:"Source"}),"\n",(0,r.jsx)(s.p,{children:(0,r.jsx)(s.a,{href:"https://github.com/operativa-dev/verse/blob/f2cb028/packages/verse-core/src/db/sql.ts#L129",children:"packages/verse-core/src/db/sql.ts:129"})}),"\n",(0,r.jsx)(s.hr,{}),"\n",(0,r.jsx)(s.h3,{id:"map",children:"map()"}),"\n",(0,r.jsxs)(s.blockquote,{children:["\n",(0,r.jsxs)(s.p,{children:[(0,r.jsx)(s.strong,{children:"map"}),"(",(0,r.jsx)(s.code,{children:"mapper"}),":     (",(0,r.jsx)(s.code,{children:"node"}),": ",(0,r.jsx)(s.a,{href:"/verse/docs/api/db/sql/classes/SqlNode",children:(0,r.jsx)(s.code,{children:"SqlNode"})}),") => ",(0,r.jsx)(s.a,{href:"/verse/docs/api/db/sql/classes/SqlNode",children:(0,r.jsx)(s.code,{children:"SqlNode"})}),"): ",(0,r.jsx)(s.a,{href:"/verse/docs/api/db/sql/classes/SqlNode",children:(0,r.jsx)(s.code,{children:"SqlNode"})})]}),"\n"]}),"\n",(0,r.jsx)(s.h4,{id:"parameters-7",children:"Parameters"}),"\n",(0,r.jsxs)(s.table,{children:[(0,r.jsx)(s.thead,{children:(0,r.jsxs)(s.tr,{children:[(0,r.jsx)(s.th,{style:{textAlign:"left"},children:"Parameter"}),(0,r.jsx)(s.th,{style:{textAlign:"left"},children:"Type"})]})}),(0,r.jsx)(s.tbody,{children:(0,r.jsxs)(s.tr,{children:[(0,r.jsx)(s.td,{style:{textAlign:"left"},children:(0,r.jsx)(s.code,{children:"mapper"})}),(0,r.jsxs)(s.td,{style:{textAlign:"left"},children:["(",(0,r.jsx)(s.code,{children:"node"}),": ",(0,r.jsx)(s.a,{href:"/verse/docs/api/db/sql/classes/SqlNode",children:(0,r.jsx)(s.code,{children:"SqlNode"})}),") => ",(0,r.jsx)(s.a,{href:"/verse/docs/api/db/sql/classes/SqlNode",children:(0,r.jsx)(s.code,{children:"SqlNode"})})]})]})})]}),"\n",(0,r.jsx)(s.h4,{id:"returns-14",children:"Returns"}),"\n",(0,r.jsx)(s.p,{children:(0,r.jsx)(s.a,{href:"/verse/docs/api/db/sql/classes/SqlNode",children:(0,r.jsx)(s.code,{children:"SqlNode"})})}),"\n",(0,r.jsx)(s.h4,{id:"source-14",children:"Source"}),"\n",(0,r.jsx)(s.p,{children:(0,r.jsx)(s.a,{href:"https://github.com/operativa-dev/verse/blob/f2cb028/packages/verse-core/src/db/sql.ts#L141",children:"packages/verse-core/src/db/sql.ts:141"})}),"\n",(0,r.jsx)(s.hr,{}),"\n",(0,r.jsx)(s.h3,{id:"reduce",children:"reduce()"}),"\n",(0,r.jsxs)(s.blockquote,{children:["\n",(0,r.jsxs)(s.p,{children:[(0,r.jsx)(s.strong,{children:"reduce"}),"(): ",(0,r.jsx)(s.code,{children:"List"}),"< ",(0,r.jsx)(s.a,{href:"/verse/docs/api/db/sql/classes/SqlNode",children:(0,r.jsx)(s.code,{children:"SqlNode"})})," >"]}),"\n"]}),"\n",(0,r.jsx)(s.h4,{id:"returns-15",children:"Returns"}),"\n",(0,r.jsxs)(s.p,{children:[(0,r.jsx)(s.code,{children:"List"}),"< ",(0,r.jsx)(s.a,{href:"/verse/docs/api/db/sql/classes/SqlNode",children:(0,r.jsx)(s.code,{children:"SqlNode"})})," >"]}),"\n",(0,r.jsx)(s.h4,{id:"source-15",children:"Source"}),"\n",(0,r.jsx)(s.p,{children:(0,r.jsx)(s.a,{href:"https://github.com/operativa-dev/verse/blob/f2cb028/packages/verse-core/src/db/sql.ts#L137",children:"packages/verse-core/src/db/sql.ts:137"})}),"\n",(0,r.jsx)(s.hr,{}),"\n",(0,r.jsx)(s.h3,{id:"rewrite",children:"rewrite()"}),"\n",(0,r.jsxs)(s.blockquote,{children:["\n",(0,r.jsxs)(s.p,{children:[(0,r.jsx)(s.strong,{children:"rewrite"}),"(",(0,r.jsx)(s.code,{children:"rewriter"}),": ",(0,r.jsx)(s.a,{href:"/verse/docs/api/db/rewriter/classes/SqlRewriter",children:(0,r.jsx)(s.code,{children:"SqlRewriter"})}),"): ",(0,r.jsx)(s.a,{href:"/verse/docs/api/db/sql/classes/SqlNode",children:(0,r.jsx)(s.code,{children:"SqlNode"})})]}),"\n"]}),"\n",(0,r.jsx)(s.h4,{id:"parameters-8",children:"Parameters"}),"\n",(0,r.jsxs)(s.table,{children:[(0,r.jsx)(s.thead,{children:(0,r.jsxs)(s.tr,{children:[(0,r.jsx)(s.th,{style:{textAlign:"left"},children:"Parameter"}),(0,r.jsx)(s.th,{style:{textAlign:"left"},children:"Type"})]})}),(0,r.jsx)(s.tbody,{children:(0,r.jsxs)(s.tr,{children:[(0,r.jsx)(s.td,{style:{textAlign:"left"},children:(0,r.jsx)(s.code,{children:"rewriter"})}),(0,r.jsx)(s.td,{style:{textAlign:"left"},children:(0,r.jsx)(s.a,{href:"/verse/docs/api/db/rewriter/classes/SqlRewriter",children:(0,r.jsx)(s.code,{children:"SqlRewriter"})})})]})})]}),"\n",(0,r.jsx)(s.h4,{id:"returns-16",children:"Returns"}),"\n",(0,r.jsx)(s.p,{children:(0,r.jsx)(s.a,{href:"/verse/docs/api/db/sql/classes/SqlNode",children:(0,r.jsx)(s.code,{children:"SqlNode"})})}),"\n",(0,r.jsx)(s.h4,{id:"source-16",children:"Source"}),"\n",(0,r.jsx)(s.p,{children:(0,r.jsx)(s.a,{href:"https://github.com/operativa-dev/verse/blob/f2cb028/packages/verse-core/src/db/sql.ts#L163",children:"packages/verse-core/src/db/sql.ts:163"})}),"\n",(0,r.jsx)(s.hr,{}),"\n",(0,r.jsx)(s.h3,{id:"scope",children:"scope()"}),"\n",(0,r.jsxs)(s.blockquote,{children:["\n",(0,r.jsxs)(s.p,{children:[(0,r.jsx)(s.strong,{children:"scope"}),"(",(0,r.jsx)(s.code,{children:"_"}),": ",(0,r.jsx)(s.a,{href:"/verse/docs/api/db/sql/classes/SqlIdentifier",children:(0,r.jsx)(s.code,{children:"SqlIdentifier"})}),"): ",(0,r.jsx)(s.a,{href:"/verse/docs/api/db/sql/classes/SqlNode",children:(0,r.jsx)(s.code,{children:"SqlNode"})})]}),"\n"]}),"\n",(0,r.jsx)(s.h4,{id:"parameters-9",children:"Parameters"}),"\n",(0,r.jsxs)(s.table,{children:[(0,r.jsx)(s.thead,{children:(0,r.jsxs)(s.tr,{children:[(0,r.jsx)(s.th,{style:{textAlign:"left"},children:"Parameter"}),(0,r.jsx)(s.th,{style:{textAlign:"left"},children:"Type"})]})}),(0,r.jsx)(s.tbody,{children:(0,r.jsxs)(s.tr,{children:[(0,r.jsx)(s.td,{style:{textAlign:"left"},children:(0,r.jsx)(s.code,{children:"_"})}),(0,r.jsx)(s.td,{style:{textAlign:"left"},children:(0,r.jsx)(s.a,{href:"/verse/docs/api/db/sql/classes/SqlIdentifier",children:(0,r.jsx)(s.code,{children:"SqlIdentifier"})})})]})})]}),"\n",(0,r.jsx)(s.h4,{id:"returns-17",children:"Returns"}),"\n",(0,r.jsx)(s.p,{children:(0,r.jsx)(s.a,{href:"/verse/docs/api/db/sql/classes/SqlNode",children:(0,r.jsx)(s.code,{children:"SqlNode"})})}),"\n",(0,r.jsx)(s.h4,{id:"source-17",children:"Source"}),"\n",(0,r.jsx)(s.p,{children:(0,r.jsx)(s.a,{href:"https://github.com/operativa-dev/verse/blob/f2cb028/packages/verse-core/src/db/sql.ts#L121",children:"packages/verse-core/src/db/sql.ts:121"})}),"\n",(0,r.jsx)(s.hr,{}),"\n",(0,r.jsx)(s.h3,{id:"uniquify",children:"uniquify()"}),"\n",(0,r.jsxs)(s.blockquote,{children:["\n",(0,r.jsxs)(s.p,{children:[(0,r.jsx)(s.strong,{children:"uniquify"}),"(",(0,r.jsx)(s.code,{children:"_"}),": ",(0,r.jsx)(s.a,{href:"https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Set",children:(0,r.jsx)(s.code,{children:"Set"})}),"< ",(0,r.jsx)(s.code,{children:"string"})," >, ",(0,r.jsx)(s.code,{children:"__"}),":     (",(0,r.jsx)(s.code,{children:"node"}),": ",(0,r.jsx)(s.a,{href:"/verse/docs/api/db/sql/classes/SqlNode",children:(0,r.jsx)(s.code,{children:"SqlNode"})}),") => ",(0,r.jsx)(s.a,{href:"/verse/docs/api/db/sql/classes/SqlAlias",children:(0,r.jsx)(s.code,{children:"SqlAlias"})}),"): ",(0,r.jsx)(s.a,{href:"/verse/docs/api/db/sql/classes/SqlNode",children:(0,r.jsx)(s.code,{children:"SqlNode"})})]}),"\n"]}),"\n",(0,r.jsx)(s.h4,{id:"parameters-10",children:"Parameters"}),"\n",(0,r.jsxs)(s.table,{children:[(0,r.jsx)(s.thead,{children:(0,r.jsxs)(s.tr,{children:[(0,r.jsx)(s.th,{style:{textAlign:"left"},children:"Parameter"}),(0,r.jsx)(s.th,{style:{textAlign:"left"},children:"Type"})]})}),(0,r.jsxs)(s.tbody,{children:[(0,r.jsxs)(s.tr,{children:[(0,r.jsx)(s.td,{style:{textAlign:"left"},children:(0,r.jsx)(s.code,{children:"_"})}),(0,r.jsxs)(s.td,{style:{textAlign:"left"},children:[(0,r.jsx)(s.a,{href:"https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Set",children:(0,r.jsx)(s.code,{children:"Set"})}),"< ",(0,r.jsx)(s.code,{children:"string"})," >"]})]}),(0,r.jsxs)(s.tr,{children:[(0,r.jsx)(s.td,{style:{textAlign:"left"},children:(0,r.jsx)(s.code,{children:"__"})}),(0,r.jsxs)(s.td,{style:{textAlign:"left"},children:["(",(0,r.jsx)(s.code,{children:"node"}),": ",(0,r.jsx)(s.a,{href:"/verse/docs/api/db/sql/classes/SqlNode",children:(0,r.jsx)(s.code,{children:"SqlNode"})}),") => ",(0,r.jsx)(s.a,{href:"/verse/docs/api/db/sql/classes/SqlAlias",children:(0,r.jsx)(s.code,{children:"SqlAlias"})})]})]})]})]}),"\n",(0,r.jsx)(s.h4,{id:"returns-18",children:"Returns"}),"\n",(0,r.jsx)(s.p,{children:(0,r.jsx)(s.a,{href:"/verse/docs/api/db/sql/classes/SqlNode",children:(0,r.jsx)(s.code,{children:"SqlNode"})})}),"\n",(0,r.jsx)(s.h4,{id:"source-18",children:"Source"}),"\n",(0,r.jsx)(s.p,{children:(0,r.jsx)(s.a,{href:"https://github.com/operativa-dev/verse/blob/f2cb028/packages/verse-core/src/db/sql.ts#L133",children:"packages/verse-core/src/db/sql.ts:133"})})]})}function o(e={}){const{wrapper:s}={...(0,d.R)(),...e.components};return s?(0,r.jsx)(s,{...e,children:(0,r.jsx)(a,{...e})}):a(e)}},768:(e,s,l)=>{l.d(s,{R:()=>n,x:()=>i});var r=l(1855);const d={},c=r.createContext(d);function n(e){const s=r.useContext(c);return r.useMemo((function(){return"function"==typeof e?e(s):{...s,...e}}),[s,e])}function i(e){let s;return s=e.disableParentContext?"function"==typeof e.components?e.components(d):e.components||d:n(e.components),r.createElement(c.Provider,{value:s},e.children)}}}]);