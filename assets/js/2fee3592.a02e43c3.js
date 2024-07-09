"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[9712],{1529:(e,r,s)=>{s.r(r),s.d(r,{assets:()=>t,contentTitle:()=>l,default:()=>a,frontMatter:()=>n,metadata:()=>c,toc:()=>o});var d=s(5723),i=s(3327);const n={title:"ModelVisitor"},l="Class: ModelVisitor<T, S>",c={id:"api/model/visitor/classes/ModelVisitor",title:"ModelVisitor",description:"Implements the visitor pattern for models.",source:"@site/docs/api/model/visitor/classes/ModelVisitor.md",sourceDirName:"api/model/visitor/classes",slug:"/api/model/visitor/classes/ModelVisitor",permalink:"/docs/api/model/visitor/classes/ModelVisitor",draft:!1,unlisted:!1,tags:[],version:"current",frontMatter:{title:"ModelVisitor"},sidebar:"apiSidebar",previous:{title:"model/visitor",permalink:"/docs/api/model/visitor/"},next:{title:"query/queryable",permalink:"/docs/api/query/queryable/"}},t={},o=[{value:"Extended by",id:"extended-by",level:2},{value:"Type Parameters",id:"type-parameters",level:2},{value:"Constructors",id:"constructors",level:2},{value:"new ModelVisitor()",id:"new-modelvisitor",level:3},{value:"Returns",id:"returns",level:4},{value:"Methods",id:"methods",level:2},{value:"visitBooleanProperty()",id:"visitbooleanproperty",level:3},{value:"Parameters",id:"parameters",level:4},{value:"Returns",id:"returns-1",level:4},{value:"Defined in",id:"defined-in",level:4},{value:"visitConcurrency()",id:"visitconcurrency",level:3},{value:"Parameters",id:"parameters-1",level:4},{value:"Returns",id:"returns-2",level:4},{value:"Defined in",id:"defined-in-1",level:4},{value:"visitConversion()",id:"visitconversion",level:3},{value:"Parameters",id:"parameters-2",level:4},{value:"Returns",id:"returns-3",level:4},{value:"Defined in",id:"defined-in-2",level:4},{value:"visitDateProperty()",id:"visitdateproperty",level:3},{value:"Parameters",id:"parameters-3",level:4},{value:"Returns",id:"returns-4",level:4},{value:"Defined in",id:"defined-in-3",level:4},{value:"visitEntity()",id:"visitentity",level:3},{value:"Parameters",id:"parameters-4",level:4},{value:"Returns",id:"returns-5",level:4},{value:"Defined in",id:"defined-in-4",level:4},{value:"visitForeignKey()",id:"visitforeignkey",level:3},{value:"Parameters",id:"parameters-5",level:4},{value:"Returns",id:"returns-6",level:4},{value:"Defined in",id:"defined-in-5",level:4},{value:"visitGenerator()",id:"visitgenerator",level:3},{value:"Parameters",id:"parameters-6",level:4},{value:"Returns",id:"returns-7",level:4},{value:"Defined in",id:"defined-in-6",level:4},{value:"visitIntProperty()",id:"visitintproperty",level:3},{value:"Parameters",id:"parameters-7",level:4},{value:"Returns",id:"returns-8",level:4},{value:"Defined in",id:"defined-in-7",level:4},{value:"visitKey()",id:"visitkey",level:3},{value:"Parameters",id:"parameters-8",level:4},{value:"Returns",id:"returns-9",level:4},{value:"Defined in",id:"defined-in-8",level:4},{value:"visitModel()",id:"visitmodel",level:3},{value:"Parameters",id:"parameters-9",level:4},{value:"Returns",id:"returns-10",level:4},{value:"Defined in",id:"defined-in-9",level:4},{value:"visitNavigationProperty()",id:"visitnavigationproperty",level:3},{value:"Parameters",id:"parameters-10",level:4},{value:"Returns",id:"returns-11",level:4},{value:"Defined in",id:"defined-in-10",level:4},{value:"visitNumberProperty()",id:"visitnumberproperty",level:3},{value:"Parameters",id:"parameters-11",level:4},{value:"Returns",id:"returns-12",level:4},{value:"Defined in",id:"defined-in-11",level:4},{value:"visitScalarProperty()",id:"visitscalarproperty",level:3},{value:"Parameters",id:"parameters-12",level:4},{value:"Returns",id:"returns-13",level:4},{value:"Defined in",id:"defined-in-12",level:4},{value:"visitSequence()",id:"visitsequence",level:3},{value:"Parameters",id:"parameters-13",level:4},{value:"Returns",id:"returns-14",level:4},{value:"Defined in",id:"defined-in-13",level:4},{value:"visitStringProperty()",id:"visitstringproperty",level:3},{value:"Parameters",id:"parameters-14",level:4},{value:"Returns",id:"returns-15",level:4},{value:"Defined in",id:"defined-in-14",level:4},{value:"visitValueObject()",id:"visitvalueobject",level:3},{value:"Parameters",id:"parameters-15",level:4},{value:"Returns",id:"returns-16",level:4},{value:"Defined in",id:"defined-in-15",level:4},{value:"visitValueObjectProperty()",id:"visitvalueobjectproperty",level:3},{value:"Parameters",id:"parameters-16",level:4},{value:"Returns",id:"returns-17",level:4},{value:"Defined in",id:"defined-in-16",level:4}];function h(e){const r={a:"a",blockquote:"blockquote",code:"code",h1:"h1",h2:"h2",h3:"h3",h4:"h4",hr:"hr",li:"li",p:"p",strong:"strong",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",ul:"ul",...(0,i.R)(),...e.components};return(0,d.jsxs)(d.Fragment,{children:[(0,d.jsx)(r.h1,{id:"class-modelvisitort-s",children:"Class: ModelVisitor<T, S>"}),"\n",(0,d.jsx)(r.p,{children:"Implements the visitor pattern for models."}),"\n",(0,d.jsx)(r.h2,{id:"extended-by",children:"Extended by"}),"\n",(0,d.jsxs)(r.ul,{children:["\n",(0,d.jsx)(r.li,{children:(0,d.jsx)(r.a,{href:"/docs/api/db/schema/classes/SchemaGenerator",children:(0,d.jsx)(r.code,{children:"SchemaGenerator"})})}),"\n",(0,d.jsx)(r.li,{children:(0,d.jsx)(r.a,{href:"/docs/api/model/rewriter/classes/ModelRewriter",children:(0,d.jsx)(r.code,{children:"ModelRewriter"})})}),"\n"]}),"\n",(0,d.jsx)(r.h2,{id:"type-parameters",children:"Type Parameters"}),"\n",(0,d.jsxs)(r.table,{children:[(0,d.jsx)(r.thead,{children:(0,d.jsxs)(r.tr,{children:[(0,d.jsx)(r.th,{children:"Type Parameter"}),(0,d.jsx)(r.th,{children:"Default type"}),(0,d.jsx)(r.th,{children:"Description"})]})}),(0,d.jsxs)(r.tbody,{children:[(0,d.jsxs)(r.tr,{children:[(0,d.jsx)(r.td,{children:(0,d.jsx)(r.code,{children:"T"})}),(0,d.jsx)(r.td,{children:"-"}),(0,d.jsx)(r.td,{children:"The return type of visit methods."})]}),(0,d.jsxs)(r.tr,{children:[(0,d.jsx)(r.td,{children:(0,d.jsx)(r.code,{children:"S"})}),(0,d.jsx)(r.td,{children:(0,d.jsx)(r.code,{children:"unknown"})}),(0,d.jsx)(r.td,{children:"The type of additional state that can be passed to visit methods."})]})]})]}),"\n",(0,d.jsx)(r.h2,{id:"constructors",children:"Constructors"}),"\n",(0,d.jsx)(r.h3,{id:"new-modelvisitor",children:"new ModelVisitor()"}),"\n",(0,d.jsxs)(r.blockquote,{children:["\n",(0,d.jsxs)(r.p,{children:[(0,d.jsx)(r.strong,{children:"new ModelVisitor"}),"<",(0,d.jsx)(r.code,{children:"T"}),", ",(0,d.jsx)(r.code,{children:"S"}),">(): ",(0,d.jsx)(r.a,{href:"/docs/api/model/visitor/classes/ModelVisitor",children:(0,d.jsx)(r.code,{children:"ModelVisitor"})}),"<",(0,d.jsx)(r.code,{children:"T"}),", ",(0,d.jsx)(r.code,{children:"S"}),">"]}),"\n"]}),"\n",(0,d.jsx)(r.h4,{id:"returns",children:"Returns"}),"\n",(0,d.jsxs)(r.p,{children:[(0,d.jsx)(r.a,{href:"/docs/api/model/visitor/classes/ModelVisitor",children:(0,d.jsx)(r.code,{children:"ModelVisitor"})}),"<",(0,d.jsx)(r.code,{children:"T"}),", ",(0,d.jsx)(r.code,{children:"S"}),">"]}),"\n",(0,d.jsx)(r.h2,{id:"methods",children:"Methods"}),"\n",(0,d.jsx)(r.h3,{id:"visitbooleanproperty",children:"visitBooleanProperty()"}),"\n",(0,d.jsxs)(r.blockquote,{children:["\n",(0,d.jsxs)(r.p,{children:[(0,d.jsx)(r.strong,{children:"visitBooleanProperty"}),"(",(0,d.jsx)(r.code,{children:"booleanProperty"}),": ",(0,d.jsx)(r.a,{href:"/docs/api/model/model/classes/BooleanPropertyModel",children:(0,d.jsx)(r.code,{children:"BooleanPropertyModel"})}),", ",(0,d.jsx)(r.code,{children:"state"}),"?: ",(0,d.jsx)(r.code,{children:"S"}),"): ",(0,d.jsx)(r.code,{children:"T"})]}),"\n"]}),"\n",(0,d.jsx)(r.h4,{id:"parameters",children:"Parameters"}),"\n",(0,d.jsxs)(r.table,{children:[(0,d.jsx)(r.thead,{children:(0,d.jsxs)(r.tr,{children:[(0,d.jsx)(r.th,{children:"Parameter"}),(0,d.jsx)(r.th,{children:"Type"})]})}),(0,d.jsxs)(r.tbody,{children:[(0,d.jsxs)(r.tr,{children:[(0,d.jsx)(r.td,{children:(0,d.jsx)(r.code,{children:"booleanProperty"})}),(0,d.jsx)(r.td,{children:(0,d.jsx)(r.a,{href:"/docs/api/model/model/classes/BooleanPropertyModel",children:(0,d.jsx)(r.code,{children:"BooleanPropertyModel"})})})]}),(0,d.jsxs)(r.tr,{children:[(0,d.jsxs)(r.td,{children:[(0,d.jsx)(r.code,{children:"state"}),"?"]}),(0,d.jsx)(r.td,{children:(0,d.jsx)(r.code,{children:"S"})})]})]})]}),"\n",(0,d.jsx)(r.h4,{id:"returns-1",children:"Returns"}),"\n",(0,d.jsx)(r.p,{children:(0,d.jsx)(r.code,{children:"T"})}),"\n",(0,d.jsx)(r.h4,{id:"defined-in",children:"Defined in"}),"\n",(0,d.jsx)(r.p,{children:(0,d.jsx)(r.a,{href:"https://github.com/operativa-dev/verse/blob/afd181c927e47fdeff512ae41818fb33ecad359a/packages/verse-core/src/model/visitor.ts#L79",children:"packages/verse-core/src/model/visitor.ts:79"})}),"\n",(0,d.jsx)(r.hr,{}),"\n",(0,d.jsx)(r.h3,{id:"visitconcurrency",children:"visitConcurrency()"}),"\n",(0,d.jsxs)(r.blockquote,{children:["\n",(0,d.jsxs)(r.p,{children:[(0,d.jsx)(r.strong,{children:"visitConcurrency"}),"(",(0,d.jsx)(r.code,{children:"concurrency"}),": ",(0,d.jsx)(r.a,{href:"/docs/api/model/model/classes/ConcurrencyModel",children:(0,d.jsx)(r.code,{children:"ConcurrencyModel"})}),", ",(0,d.jsx)(r.code,{children:"state"}),"?: ",(0,d.jsx)(r.code,{children:"S"}),"): ",(0,d.jsx)(r.code,{children:"T"})]}),"\n"]}),"\n",(0,d.jsx)(r.h4,{id:"parameters-1",children:"Parameters"}),"\n",(0,d.jsxs)(r.table,{children:[(0,d.jsx)(r.thead,{children:(0,d.jsxs)(r.tr,{children:[(0,d.jsx)(r.th,{children:"Parameter"}),(0,d.jsx)(r.th,{children:"Type"})]})}),(0,d.jsxs)(r.tbody,{children:[(0,d.jsxs)(r.tr,{children:[(0,d.jsx)(r.td,{children:(0,d.jsx)(r.code,{children:"concurrency"})}),(0,d.jsx)(r.td,{children:(0,d.jsx)(r.a,{href:"/docs/api/model/model/classes/ConcurrencyModel",children:(0,d.jsx)(r.code,{children:"ConcurrencyModel"})})})]}),(0,d.jsxs)(r.tr,{children:[(0,d.jsxs)(r.td,{children:[(0,d.jsx)(r.code,{children:"state"}),"?"]}),(0,d.jsx)(r.td,{children:(0,d.jsx)(r.code,{children:"S"})})]})]})]}),"\n",(0,d.jsx)(r.h4,{id:"returns-2",children:"Returns"}),"\n",(0,d.jsx)(r.p,{children:(0,d.jsx)(r.code,{children:"T"})}),"\n",(0,d.jsx)(r.h4,{id:"defined-in-1",children:"Defined in"}),"\n",(0,d.jsx)(r.p,{children:(0,d.jsx)(r.a,{href:"https://github.com/operativa-dev/verse/blob/afd181c927e47fdeff512ae41818fb33ecad359a/packages/verse-core/src/model/visitor.ts#L59",children:"packages/verse-core/src/model/visitor.ts:59"})}),"\n",(0,d.jsx)(r.hr,{}),"\n",(0,d.jsx)(r.h3,{id:"visitconversion",children:"visitConversion()"}),"\n",(0,d.jsxs)(r.blockquote,{children:["\n",(0,d.jsxs)(r.p,{children:[(0,d.jsx)(r.strong,{children:"visitConversion"}),"(",(0,d.jsx)(r.code,{children:"conversion"}),": ",(0,d.jsx)(r.a,{href:"/docs/api/model/model/classes/ConversionModel",children:(0,d.jsx)(r.code,{children:"ConversionModel"})}),", ",(0,d.jsx)(r.code,{children:"state"}),"?: ",(0,d.jsx)(r.code,{children:"S"}),"): ",(0,d.jsx)(r.code,{children:"T"})]}),"\n"]}),"\n",(0,d.jsx)(r.h4,{id:"parameters-2",children:"Parameters"}),"\n",(0,d.jsxs)(r.table,{children:[(0,d.jsx)(r.thead,{children:(0,d.jsxs)(r.tr,{children:[(0,d.jsx)(r.th,{children:"Parameter"}),(0,d.jsx)(r.th,{children:"Type"})]})}),(0,d.jsxs)(r.tbody,{children:[(0,d.jsxs)(r.tr,{children:[(0,d.jsx)(r.td,{children:(0,d.jsx)(r.code,{children:"conversion"})}),(0,d.jsx)(r.td,{children:(0,d.jsx)(r.a,{href:"/docs/api/model/model/classes/ConversionModel",children:(0,d.jsx)(r.code,{children:"ConversionModel"})})})]}),(0,d.jsxs)(r.tr,{children:[(0,d.jsxs)(r.td,{children:[(0,d.jsx)(r.code,{children:"state"}),"?"]}),(0,d.jsx)(r.td,{children:(0,d.jsx)(r.code,{children:"S"})})]})]})]}),"\n",(0,d.jsx)(r.h4,{id:"returns-3",children:"Returns"}),"\n",(0,d.jsx)(r.p,{children:(0,d.jsx)(r.code,{children:"T"})}),"\n",(0,d.jsx)(r.h4,{id:"defined-in-2",children:"Defined in"}),"\n",(0,d.jsx)(r.p,{children:(0,d.jsx)(r.a,{href:"https://github.com/operativa-dev/verse/blob/afd181c927e47fdeff512ae41818fb33ecad359a/packages/verse-core/src/model/visitor.ts#L109",children:"packages/verse-core/src/model/visitor.ts:109"})}),"\n",(0,d.jsx)(r.hr,{}),"\n",(0,d.jsx)(r.h3,{id:"visitdateproperty",children:"visitDateProperty()"}),"\n",(0,d.jsxs)(r.blockquote,{children:["\n",(0,d.jsxs)(r.p,{children:[(0,d.jsx)(r.strong,{children:"visitDateProperty"}),"(",(0,d.jsx)(r.code,{children:"dateProperty"}),": ",(0,d.jsx)(r.a,{href:"/docs/api/model/model/classes/DatePropertyModel",children:(0,d.jsx)(r.code,{children:"DatePropertyModel"})}),", ",(0,d.jsx)(r.code,{children:"state"}),"?: ",(0,d.jsx)(r.code,{children:"S"}),"): ",(0,d.jsx)(r.code,{children:"T"})]}),"\n"]}),"\n",(0,d.jsx)(r.h4,{id:"parameters-3",children:"Parameters"}),"\n",(0,d.jsxs)(r.table,{children:[(0,d.jsx)(r.thead,{children:(0,d.jsxs)(r.tr,{children:[(0,d.jsx)(r.th,{children:"Parameter"}),(0,d.jsx)(r.th,{children:"Type"})]})}),(0,d.jsxs)(r.tbody,{children:[(0,d.jsxs)(r.tr,{children:[(0,d.jsx)(r.td,{children:(0,d.jsx)(r.code,{children:"dateProperty"})}),(0,d.jsx)(r.td,{children:(0,d.jsx)(r.a,{href:"/docs/api/model/model/classes/DatePropertyModel",children:(0,d.jsx)(r.code,{children:"DatePropertyModel"})})})]}),(0,d.jsxs)(r.tr,{children:[(0,d.jsxs)(r.td,{children:[(0,d.jsx)(r.code,{children:"state"}),"?"]}),(0,d.jsx)(r.td,{children:(0,d.jsx)(r.code,{children:"S"})})]})]})]}),"\n",(0,d.jsx)(r.h4,{id:"returns-4",children:"Returns"}),"\n",(0,d.jsx)(r.p,{children:(0,d.jsx)(r.code,{children:"T"})}),"\n",(0,d.jsx)(r.h4,{id:"defined-in-3",children:"Defined in"}),"\n",(0,d.jsx)(r.p,{children:(0,d.jsx)(r.a,{href:"https://github.com/operativa-dev/verse/blob/afd181c927e47fdeff512ae41818fb33ecad359a/packages/verse-core/src/model/visitor.ts#L84",children:"packages/verse-core/src/model/visitor.ts:84"})}),"\n",(0,d.jsx)(r.hr,{}),"\n",(0,d.jsx)(r.h3,{id:"visitentity",children:"visitEntity()"}),"\n",(0,d.jsxs)(r.blockquote,{children:["\n",(0,d.jsxs)(r.p,{children:[(0,d.jsx)(r.strong,{children:"visitEntity"}),"(",(0,d.jsx)(r.code,{children:"entity"}),": ",(0,d.jsx)(r.a,{href:"/docs/api/model/model/classes/EntityModel",children:(0,d.jsx)(r.code,{children:"EntityModel"})}),"<",(0,d.jsx)(r.code,{children:"any"}),", ",(0,d.jsx)(r.code,{children:"any"}),">, ",(0,d.jsx)(r.code,{children:"state"}),"?: ",(0,d.jsx)(r.code,{children:"S"}),"): ",(0,d.jsx)(r.code,{children:"T"})]}),"\n"]}),"\n",(0,d.jsx)(r.h4,{id:"parameters-4",children:"Parameters"}),"\n",(0,d.jsxs)(r.table,{children:[(0,d.jsx)(r.thead,{children:(0,d.jsxs)(r.tr,{children:[(0,d.jsx)(r.th,{children:"Parameter"}),(0,d.jsx)(r.th,{children:"Type"})]})}),(0,d.jsxs)(r.tbody,{children:[(0,d.jsxs)(r.tr,{children:[(0,d.jsx)(r.td,{children:(0,d.jsx)(r.code,{children:"entity"})}),(0,d.jsxs)(r.td,{children:[(0,d.jsx)(r.a,{href:"/docs/api/model/model/classes/EntityModel",children:(0,d.jsx)(r.code,{children:"EntityModel"})}),"<",(0,d.jsx)(r.code,{children:"any"}),", ",(0,d.jsx)(r.code,{children:"any"}),">"]})]}),(0,d.jsxs)(r.tr,{children:[(0,d.jsxs)(r.td,{children:[(0,d.jsx)(r.code,{children:"state"}),"?"]}),(0,d.jsx)(r.td,{children:(0,d.jsx)(r.code,{children:"S"})})]})]})]}),"\n",(0,d.jsx)(r.h4,{id:"returns-5",children:"Returns"}),"\n",(0,d.jsx)(r.p,{children:(0,d.jsx)(r.code,{children:"T"})}),"\n",(0,d.jsx)(r.h4,{id:"defined-in-4",children:"Defined in"}),"\n",(0,d.jsx)(r.p,{children:(0,d.jsx)(r.a,{href:"https://github.com/operativa-dev/verse/blob/afd181c927e47fdeff512ae41818fb33ecad359a/packages/verse-core/src/model/visitor.ts#L34",children:"packages/verse-core/src/model/visitor.ts:34"})}),"\n",(0,d.jsx)(r.hr,{}),"\n",(0,d.jsx)(r.h3,{id:"visitforeignkey",children:"visitForeignKey()"}),"\n",(0,d.jsxs)(r.blockquote,{children:["\n",(0,d.jsxs)(r.p,{children:[(0,d.jsx)(r.strong,{children:"visitForeignKey"}),"(",(0,d.jsx)(r.code,{children:"foreignKey"}),": ",(0,d.jsx)(r.a,{href:"/docs/api/model/model/classes/ForeignKeyModel",children:(0,d.jsx)(r.code,{children:"ForeignKeyModel"})}),", ",(0,d.jsx)(r.code,{children:"state"}),"?: ",(0,d.jsx)(r.code,{children:"S"}),"): ",(0,d.jsx)(r.code,{children:"T"})]}),"\n"]}),"\n",(0,d.jsx)(r.h4,{id:"parameters-5",children:"Parameters"}),"\n",(0,d.jsxs)(r.table,{children:[(0,d.jsx)(r.thead,{children:(0,d.jsxs)(r.tr,{children:[(0,d.jsx)(r.th,{children:"Parameter"}),(0,d.jsx)(r.th,{children:"Type"})]})}),(0,d.jsxs)(r.tbody,{children:[(0,d.jsxs)(r.tr,{children:[(0,d.jsx)(r.td,{children:(0,d.jsx)(r.code,{children:"foreignKey"})}),(0,d.jsx)(r.td,{children:(0,d.jsx)(r.a,{href:"/docs/api/model/model/classes/ForeignKeyModel",children:(0,d.jsx)(r.code,{children:"ForeignKeyModel"})})})]}),(0,d.jsxs)(r.tr,{children:[(0,d.jsxs)(r.td,{children:[(0,d.jsx)(r.code,{children:"state"}),"?"]}),(0,d.jsx)(r.td,{children:(0,d.jsx)(r.code,{children:"S"})})]})]})]}),"\n",(0,d.jsx)(r.h4,{id:"returns-6",children:"Returns"}),"\n",(0,d.jsx)(r.p,{children:(0,d.jsx)(r.code,{children:"T"})}),"\n",(0,d.jsx)(r.h4,{id:"defined-in-5",children:"Defined in"}),"\n",(0,d.jsx)(r.p,{children:(0,d.jsx)(r.a,{href:"https://github.com/operativa-dev/verse/blob/afd181c927e47fdeff512ae41818fb33ecad359a/packages/verse-core/src/model/visitor.ts#L54",children:"packages/verse-core/src/model/visitor.ts:54"})}),"\n",(0,d.jsx)(r.hr,{}),"\n",(0,d.jsx)(r.h3,{id:"visitgenerator",children:"visitGenerator()"}),"\n",(0,d.jsxs)(r.blockquote,{children:["\n",(0,d.jsxs)(r.p,{children:[(0,d.jsx)(r.strong,{children:"visitGenerator"}),"(",(0,d.jsx)(r.code,{children:"generator"}),": ",(0,d.jsx)(r.a,{href:"/docs/api/model/model/classes/GeneratorModel",children:(0,d.jsx)(r.code,{children:"GeneratorModel"})}),", ",(0,d.jsx)(r.code,{children:"state"}),"?: ",(0,d.jsx)(r.code,{children:"S"}),"): ",(0,d.jsx)(r.code,{children:"T"})]}),"\n"]}),"\n",(0,d.jsx)(r.h4,{id:"parameters-6",children:"Parameters"}),"\n",(0,d.jsxs)(r.table,{children:[(0,d.jsx)(r.thead,{children:(0,d.jsxs)(r.tr,{children:[(0,d.jsx)(r.th,{children:"Parameter"}),(0,d.jsx)(r.th,{children:"Type"})]})}),(0,d.jsxs)(r.tbody,{children:[(0,d.jsxs)(r.tr,{children:[(0,d.jsx)(r.td,{children:(0,d.jsx)(r.code,{children:"generator"})}),(0,d.jsx)(r.td,{children:(0,d.jsx)(r.a,{href:"/docs/api/model/model/classes/GeneratorModel",children:(0,d.jsx)(r.code,{children:"GeneratorModel"})})})]}),(0,d.jsxs)(r.tr,{children:[(0,d.jsxs)(r.td,{children:[(0,d.jsx)(r.code,{children:"state"}),"?"]}),(0,d.jsx)(r.td,{children:(0,d.jsx)(r.code,{children:"S"})})]})]})]}),"\n",(0,d.jsx)(r.h4,{id:"returns-7",children:"Returns"}),"\n",(0,d.jsx)(r.p,{children:(0,d.jsx)(r.code,{children:"T"})}),"\n",(0,d.jsx)(r.h4,{id:"defined-in-6",children:"Defined in"}),"\n",(0,d.jsx)(r.p,{children:(0,d.jsx)(r.a,{href:"https://github.com/operativa-dev/verse/blob/afd181c927e47fdeff512ae41818fb33ecad359a/packages/verse-core/src/model/visitor.ts#L104",children:"packages/verse-core/src/model/visitor.ts:104"})}),"\n",(0,d.jsx)(r.hr,{}),"\n",(0,d.jsx)(r.h3,{id:"visitintproperty",children:"visitIntProperty()"}),"\n",(0,d.jsxs)(r.blockquote,{children:["\n",(0,d.jsxs)(r.p,{children:[(0,d.jsx)(r.strong,{children:"visitIntProperty"}),"(",(0,d.jsx)(r.code,{children:"intProperty"}),": ",(0,d.jsx)(r.a,{href:"/docs/api/model/model/classes/IntPropertyModel",children:(0,d.jsx)(r.code,{children:"IntPropertyModel"})}),", ",(0,d.jsx)(r.code,{children:"state"}),"?: ",(0,d.jsx)(r.code,{children:"S"}),"): ",(0,d.jsx)(r.code,{children:"T"})]}),"\n"]}),"\n",(0,d.jsx)(r.h4,{id:"parameters-7",children:"Parameters"}),"\n",(0,d.jsxs)(r.table,{children:[(0,d.jsx)(r.thead,{children:(0,d.jsxs)(r.tr,{children:[(0,d.jsx)(r.th,{children:"Parameter"}),(0,d.jsx)(r.th,{children:"Type"})]})}),(0,d.jsxs)(r.tbody,{children:[(0,d.jsxs)(r.tr,{children:[(0,d.jsx)(r.td,{children:(0,d.jsx)(r.code,{children:"intProperty"})}),(0,d.jsx)(r.td,{children:(0,d.jsx)(r.a,{href:"/docs/api/model/model/classes/IntPropertyModel",children:(0,d.jsx)(r.code,{children:"IntPropertyModel"})})})]}),(0,d.jsxs)(r.tr,{children:[(0,d.jsxs)(r.td,{children:[(0,d.jsx)(r.code,{children:"state"}),"?"]}),(0,d.jsx)(r.td,{children:(0,d.jsx)(r.code,{children:"S"})})]})]})]}),"\n",(0,d.jsx)(r.h4,{id:"returns-8",children:"Returns"}),"\n",(0,d.jsx)(r.p,{children:(0,d.jsx)(r.code,{children:"T"})}),"\n",(0,d.jsx)(r.h4,{id:"defined-in-7",children:"Defined in"}),"\n",(0,d.jsx)(r.p,{children:(0,d.jsx)(r.a,{href:"https://github.com/operativa-dev/verse/blob/afd181c927e47fdeff512ae41818fb33ecad359a/packages/verse-core/src/model/visitor.ts#L74",children:"packages/verse-core/src/model/visitor.ts:74"})}),"\n",(0,d.jsx)(r.hr,{}),"\n",(0,d.jsx)(r.h3,{id:"visitkey",children:"visitKey()"}),"\n",(0,d.jsxs)(r.blockquote,{children:["\n",(0,d.jsxs)(r.p,{children:[(0,d.jsx)(r.strong,{children:"visitKey"}),"(",(0,d.jsx)(r.code,{children:"key"}),": ",(0,d.jsx)(r.a,{href:"/docs/api/model/model/classes/KeyModel",children:(0,d.jsx)(r.code,{children:"KeyModel"})}),", ",(0,d.jsx)(r.code,{children:"state"}),"?: ",(0,d.jsx)(r.code,{children:"S"}),"): ",(0,d.jsx)(r.code,{children:"T"})]}),"\n"]}),"\n",(0,d.jsx)(r.h4,{id:"parameters-8",children:"Parameters"}),"\n",(0,d.jsxs)(r.table,{children:[(0,d.jsx)(r.thead,{children:(0,d.jsxs)(r.tr,{children:[(0,d.jsx)(r.th,{children:"Parameter"}),(0,d.jsx)(r.th,{children:"Type"})]})}),(0,d.jsxs)(r.tbody,{children:[(0,d.jsxs)(r.tr,{children:[(0,d.jsx)(r.td,{children:(0,d.jsx)(r.code,{children:"key"})}),(0,d.jsx)(r.td,{children:(0,d.jsx)(r.a,{href:"/docs/api/model/model/classes/KeyModel",children:(0,d.jsx)(r.code,{children:"KeyModel"})})})]}),(0,d.jsxs)(r.tr,{children:[(0,d.jsxs)(r.td,{children:[(0,d.jsx)(r.code,{children:"state"}),"?"]}),(0,d.jsx)(r.td,{children:(0,d.jsx)(r.code,{children:"S"})})]})]})]}),"\n",(0,d.jsx)(r.h4,{id:"returns-9",children:"Returns"}),"\n",(0,d.jsx)(r.p,{children:(0,d.jsx)(r.code,{children:"T"})}),"\n",(0,d.jsx)(r.h4,{id:"defined-in-8",children:"Defined in"}),"\n",(0,d.jsx)(r.p,{children:(0,d.jsx)(r.a,{href:"https://github.com/operativa-dev/verse/blob/afd181c927e47fdeff512ae41818fb33ecad359a/packages/verse-core/src/model/visitor.ts#L49",children:"packages/verse-core/src/model/visitor.ts:49"})}),"\n",(0,d.jsx)(r.hr,{}),"\n",(0,d.jsx)(r.h3,{id:"visitmodel",children:"visitModel()"}),"\n",(0,d.jsxs)(r.blockquote,{children:["\n",(0,d.jsxs)(r.p,{children:[(0,d.jsx)(r.strong,{children:"visitModel"}),"(",(0,d.jsx)(r.code,{children:"model"}),": ",(0,d.jsx)(r.a,{href:"/docs/api/model/model/classes/Model",children:(0,d.jsx)(r.code,{children:"Model"})}),", ",(0,d.jsx)(r.code,{children:"state"}),"?: ",(0,d.jsx)(r.code,{children:"S"}),"): ",(0,d.jsx)(r.code,{children:"T"})]}),"\n"]}),"\n",(0,d.jsx)(r.h4,{id:"parameters-9",children:"Parameters"}),"\n",(0,d.jsxs)(r.table,{children:[(0,d.jsx)(r.thead,{children:(0,d.jsxs)(r.tr,{children:[(0,d.jsx)(r.th,{children:"Parameter"}),(0,d.jsx)(r.th,{children:"Type"})]})}),(0,d.jsxs)(r.tbody,{children:[(0,d.jsxs)(r.tr,{children:[(0,d.jsx)(r.td,{children:(0,d.jsx)(r.code,{children:"model"})}),(0,d.jsx)(r.td,{children:(0,d.jsx)(r.a,{href:"/docs/api/model/model/classes/Model",children:(0,d.jsx)(r.code,{children:"Model"})})})]}),(0,d.jsxs)(r.tr,{children:[(0,d.jsxs)(r.td,{children:[(0,d.jsx)(r.code,{children:"state"}),"?"]}),(0,d.jsx)(r.td,{children:(0,d.jsx)(r.code,{children:"S"})})]})]})]}),"\n",(0,d.jsx)(r.h4,{id:"returns-10",children:"Returns"}),"\n",(0,d.jsx)(r.p,{children:(0,d.jsx)(r.code,{children:"T"})}),"\n",(0,d.jsx)(r.h4,{id:"defined-in-9",children:"Defined in"}),"\n",(0,d.jsx)(r.p,{children:(0,d.jsx)(r.a,{href:"https://github.com/operativa-dev/verse/blob/afd181c927e47fdeff512ae41818fb33ecad359a/packages/verse-core/src/model/visitor.ts#L29",children:"packages/verse-core/src/model/visitor.ts:29"})}),"\n",(0,d.jsx)(r.hr,{}),"\n",(0,d.jsx)(r.h3,{id:"visitnavigationproperty",children:"visitNavigationProperty()"}),"\n",(0,d.jsxs)(r.blockquote,{children:["\n",(0,d.jsxs)(r.p,{children:[(0,d.jsx)(r.strong,{children:"visitNavigationProperty"}),"(",(0,d.jsx)(r.code,{children:"navigation"}),": ",(0,d.jsx)(r.a,{href:"/docs/api/model/model/classes/NavigationPropertyModel",children:(0,d.jsx)(r.code,{children:"NavigationPropertyModel"})}),", ",(0,d.jsx)(r.code,{children:"state"}),"?: ",(0,d.jsx)(r.code,{children:"S"}),"): ",(0,d.jsx)(r.code,{children:"T"})]}),"\n"]}),"\n",(0,d.jsx)(r.h4,{id:"parameters-10",children:"Parameters"}),"\n",(0,d.jsxs)(r.table,{children:[(0,d.jsx)(r.thead,{children:(0,d.jsxs)(r.tr,{children:[(0,d.jsx)(r.th,{children:"Parameter"}),(0,d.jsx)(r.th,{children:"Type"})]})}),(0,d.jsxs)(r.tbody,{children:[(0,d.jsxs)(r.tr,{children:[(0,d.jsx)(r.td,{children:(0,d.jsx)(r.code,{children:"navigation"})}),(0,d.jsx)(r.td,{children:(0,d.jsx)(r.a,{href:"/docs/api/model/model/classes/NavigationPropertyModel",children:(0,d.jsx)(r.code,{children:"NavigationPropertyModel"})})})]}),(0,d.jsxs)(r.tr,{children:[(0,d.jsxs)(r.td,{children:[(0,d.jsx)(r.code,{children:"state"}),"?"]}),(0,d.jsx)(r.td,{children:(0,d.jsx)(r.code,{children:"S"})})]})]})]}),"\n",(0,d.jsx)(r.h4,{id:"returns-11",children:"Returns"}),"\n",(0,d.jsx)(r.p,{children:(0,d.jsx)(r.code,{children:"T"})}),"\n",(0,d.jsx)(r.h4,{id:"defined-in-10",children:"Defined in"}),"\n",(0,d.jsx)(r.p,{children:(0,d.jsx)(r.a,{href:"https://github.com/operativa-dev/verse/blob/afd181c927e47fdeff512ae41818fb33ecad359a/packages/verse-core/src/model/visitor.ts#L94",children:"packages/verse-core/src/model/visitor.ts:94"})}),"\n",(0,d.jsx)(r.hr,{}),"\n",(0,d.jsx)(r.h3,{id:"visitnumberproperty",children:"visitNumberProperty()"}),"\n",(0,d.jsxs)(r.blockquote,{children:["\n",(0,d.jsxs)(r.p,{children:[(0,d.jsx)(r.strong,{children:"visitNumberProperty"}),"(",(0,d.jsx)(r.code,{children:"numberProperty"}),": ",(0,d.jsx)(r.a,{href:"/docs/api/model/model/classes/NumberPropertyModel",children:(0,d.jsx)(r.code,{children:"NumberPropertyModel"})}),", ",(0,d.jsx)(r.code,{children:"state"}),"?: ",(0,d.jsx)(r.code,{children:"S"}),"): ",(0,d.jsx)(r.code,{children:"T"})]}),"\n"]}),"\n",(0,d.jsx)(r.h4,{id:"parameters-11",children:"Parameters"}),"\n",(0,d.jsxs)(r.table,{children:[(0,d.jsx)(r.thead,{children:(0,d.jsxs)(r.tr,{children:[(0,d.jsx)(r.th,{children:"Parameter"}),(0,d.jsx)(r.th,{children:"Type"})]})}),(0,d.jsxs)(r.tbody,{children:[(0,d.jsxs)(r.tr,{children:[(0,d.jsx)(r.td,{children:(0,d.jsx)(r.code,{children:"numberProperty"})}),(0,d.jsx)(r.td,{children:(0,d.jsx)(r.a,{href:"/docs/api/model/model/classes/NumberPropertyModel",children:(0,d.jsx)(r.code,{children:"NumberPropertyModel"})})})]}),(0,d.jsxs)(r.tr,{children:[(0,d.jsxs)(r.td,{children:[(0,d.jsx)(r.code,{children:"state"}),"?"]}),(0,d.jsx)(r.td,{children:(0,d.jsx)(r.code,{children:"S"})})]})]})]}),"\n",(0,d.jsx)(r.h4,{id:"returns-12",children:"Returns"}),"\n",(0,d.jsx)(r.p,{children:(0,d.jsx)(r.code,{children:"T"})}),"\n",(0,d.jsx)(r.h4,{id:"defined-in-11",children:"Defined in"}),"\n",(0,d.jsx)(r.p,{children:(0,d.jsx)(r.a,{href:"https://github.com/operativa-dev/verse/blob/afd181c927e47fdeff512ae41818fb33ecad359a/packages/verse-core/src/model/visitor.ts#L89",children:"packages/verse-core/src/model/visitor.ts:89"})}),"\n",(0,d.jsx)(r.hr,{}),"\n",(0,d.jsx)(r.h3,{id:"visitscalarproperty",children:"visitScalarProperty()"}),"\n",(0,d.jsxs)(r.blockquote,{children:["\n",(0,d.jsxs)(r.p,{children:[(0,d.jsx)(r.strong,{children:"visitScalarProperty"}),"(",(0,d.jsx)(r.code,{children:"scalarProperty"}),": ",(0,d.jsx)(r.a,{href:"/docs/api/model/model/classes/ScalarPropertyModel",children:(0,d.jsx)(r.code,{children:"ScalarPropertyModel"})}),", ",(0,d.jsx)(r.code,{children:"state"}),"?: ",(0,d.jsx)(r.code,{children:"S"}),"): ",(0,d.jsx)(r.code,{children:"T"})]}),"\n"]}),"\n",(0,d.jsx)(r.h4,{id:"parameters-12",children:"Parameters"}),"\n",(0,d.jsxs)(r.table,{children:[(0,d.jsx)(r.thead,{children:(0,d.jsxs)(r.tr,{children:[(0,d.jsx)(r.th,{children:"Parameter"}),(0,d.jsx)(r.th,{children:"Type"})]})}),(0,d.jsxs)(r.tbody,{children:[(0,d.jsxs)(r.tr,{children:[(0,d.jsx)(r.td,{children:(0,d.jsx)(r.code,{children:"scalarProperty"})}),(0,d.jsx)(r.td,{children:(0,d.jsx)(r.a,{href:"/docs/api/model/model/classes/ScalarPropertyModel",children:(0,d.jsx)(r.code,{children:"ScalarPropertyModel"})})})]}),(0,d.jsxs)(r.tr,{children:[(0,d.jsxs)(r.td,{children:[(0,d.jsx)(r.code,{children:"state"}),"?"]}),(0,d.jsx)(r.td,{children:(0,d.jsx)(r.code,{children:"S"})})]})]})]}),"\n",(0,d.jsx)(r.h4,{id:"returns-13",children:"Returns"}),"\n",(0,d.jsx)(r.p,{children:(0,d.jsx)(r.code,{children:"T"})}),"\n",(0,d.jsx)(r.h4,{id:"defined-in-12",children:"Defined in"}),"\n",(0,d.jsx)(r.p,{children:(0,d.jsx)(r.a,{href:"https://github.com/operativa-dev/verse/blob/afd181c927e47fdeff512ae41818fb33ecad359a/packages/verse-core/src/model/visitor.ts#L64",children:"packages/verse-core/src/model/visitor.ts:64"})}),"\n",(0,d.jsx)(r.hr,{}),"\n",(0,d.jsx)(r.h3,{id:"visitsequence",children:"visitSequence()"}),"\n",(0,d.jsxs)(r.blockquote,{children:["\n",(0,d.jsxs)(r.p,{children:[(0,d.jsx)(r.strong,{children:"visitSequence"}),"(",(0,d.jsx)(r.code,{children:"sequence"}),": ",(0,d.jsx)(r.a,{href:"/docs/api/model/model/classes/SequenceModel",children:(0,d.jsx)(r.code,{children:"SequenceModel"})}),", ",(0,d.jsx)(r.code,{children:"state"}),"?: ",(0,d.jsx)(r.code,{children:"S"}),"): ",(0,d.jsx)(r.code,{children:"T"})]}),"\n"]}),"\n",(0,d.jsx)(r.h4,{id:"parameters-13",children:"Parameters"}),"\n",(0,d.jsxs)(r.table,{children:[(0,d.jsx)(r.thead,{children:(0,d.jsxs)(r.tr,{children:[(0,d.jsx)(r.th,{children:"Parameter"}),(0,d.jsx)(r.th,{children:"Type"})]})}),(0,d.jsxs)(r.tbody,{children:[(0,d.jsxs)(r.tr,{children:[(0,d.jsx)(r.td,{children:(0,d.jsx)(r.code,{children:"sequence"})}),(0,d.jsx)(r.td,{children:(0,d.jsx)(r.a,{href:"/docs/api/model/model/classes/SequenceModel",children:(0,d.jsx)(r.code,{children:"SequenceModel"})})})]}),(0,d.jsxs)(r.tr,{children:[(0,d.jsxs)(r.td,{children:[(0,d.jsx)(r.code,{children:"state"}),"?"]}),(0,d.jsx)(r.td,{children:(0,d.jsx)(r.code,{children:"S"})})]})]})]}),"\n",(0,d.jsx)(r.h4,{id:"returns-14",children:"Returns"}),"\n",(0,d.jsx)(r.p,{children:(0,d.jsx)(r.code,{children:"T"})}),"\n",(0,d.jsx)(r.h4,{id:"defined-in-13",children:"Defined in"}),"\n",(0,d.jsx)(r.p,{children:(0,d.jsx)(r.a,{href:"https://github.com/operativa-dev/verse/blob/afd181c927e47fdeff512ae41818fb33ecad359a/packages/verse-core/src/model/visitor.ts#L44",children:"packages/verse-core/src/model/visitor.ts:44"})}),"\n",(0,d.jsx)(r.hr,{}),"\n",(0,d.jsx)(r.h3,{id:"visitstringproperty",children:"visitStringProperty()"}),"\n",(0,d.jsxs)(r.blockquote,{children:["\n",(0,d.jsxs)(r.p,{children:[(0,d.jsx)(r.strong,{children:"visitStringProperty"}),"(",(0,d.jsx)(r.code,{children:"stringProperty"}),": ",(0,d.jsx)(r.a,{href:"/docs/api/model/model/classes/StringPropertyModel",children:(0,d.jsx)(r.code,{children:"StringPropertyModel"})}),", ",(0,d.jsx)(r.code,{children:"state"}),"?: ",(0,d.jsx)(r.code,{children:"S"}),"): ",(0,d.jsx)(r.code,{children:"T"})]}),"\n"]}),"\n",(0,d.jsx)(r.h4,{id:"parameters-14",children:"Parameters"}),"\n",(0,d.jsxs)(r.table,{children:[(0,d.jsx)(r.thead,{children:(0,d.jsxs)(r.tr,{children:[(0,d.jsx)(r.th,{children:"Parameter"}),(0,d.jsx)(r.th,{children:"Type"})]})}),(0,d.jsxs)(r.tbody,{children:[(0,d.jsxs)(r.tr,{children:[(0,d.jsx)(r.td,{children:(0,d.jsx)(r.code,{children:"stringProperty"})}),(0,d.jsx)(r.td,{children:(0,d.jsx)(r.a,{href:"/docs/api/model/model/classes/StringPropertyModel",children:(0,d.jsx)(r.code,{children:"StringPropertyModel"})})})]}),(0,d.jsxs)(r.tr,{children:[(0,d.jsxs)(r.td,{children:[(0,d.jsx)(r.code,{children:"state"}),"?"]}),(0,d.jsx)(r.td,{children:(0,d.jsx)(r.code,{children:"S"})})]})]})]}),"\n",(0,d.jsx)(r.h4,{id:"returns-15",children:"Returns"}),"\n",(0,d.jsx)(r.p,{children:(0,d.jsx)(r.code,{children:"T"})}),"\n",(0,d.jsx)(r.h4,{id:"defined-in-14",children:"Defined in"}),"\n",(0,d.jsx)(r.p,{children:(0,d.jsx)(r.a,{href:"https://github.com/operativa-dev/verse/blob/afd181c927e47fdeff512ae41818fb33ecad359a/packages/verse-core/src/model/visitor.ts#L69",children:"packages/verse-core/src/model/visitor.ts:69"})}),"\n",(0,d.jsx)(r.hr,{}),"\n",(0,d.jsx)(r.h3,{id:"visitvalueobject",children:"visitValueObject()"}),"\n",(0,d.jsxs)(r.blockquote,{children:["\n",(0,d.jsxs)(r.p,{children:[(0,d.jsx)(r.strong,{children:"visitValueObject"}),"(",(0,d.jsx)(r.code,{children:"valueObject"}),": ",(0,d.jsx)(r.a,{href:"/docs/api/model/model/classes/ValueObjectModel",children:(0,d.jsx)(r.code,{children:"ValueObjectModel"})}),"<",(0,d.jsx)(r.code,{children:"any"}),">, ",(0,d.jsx)(r.code,{children:"state"}),"?: ",(0,d.jsx)(r.code,{children:"S"}),"): ",(0,d.jsx)(r.code,{children:"T"})]}),"\n"]}),"\n",(0,d.jsx)(r.h4,{id:"parameters-15",children:"Parameters"}),"\n",(0,d.jsxs)(r.table,{children:[(0,d.jsx)(r.thead,{children:(0,d.jsxs)(r.tr,{children:[(0,d.jsx)(r.th,{children:"Parameter"}),(0,d.jsx)(r.th,{children:"Type"})]})}),(0,d.jsxs)(r.tbody,{children:[(0,d.jsxs)(r.tr,{children:[(0,d.jsx)(r.td,{children:(0,d.jsx)(r.code,{children:"valueObject"})}),(0,d.jsxs)(r.td,{children:[(0,d.jsx)(r.a,{href:"/docs/api/model/model/classes/ValueObjectModel",children:(0,d.jsx)(r.code,{children:"ValueObjectModel"})}),"<",(0,d.jsx)(r.code,{children:"any"}),">"]})]}),(0,d.jsxs)(r.tr,{children:[(0,d.jsxs)(r.td,{children:[(0,d.jsx)(r.code,{children:"state"}),"?"]}),(0,d.jsx)(r.td,{children:(0,d.jsx)(r.code,{children:"S"})})]})]})]}),"\n",(0,d.jsx)(r.h4,{id:"returns-16",children:"Returns"}),"\n",(0,d.jsx)(r.p,{children:(0,d.jsx)(r.code,{children:"T"})}),"\n",(0,d.jsx)(r.h4,{id:"defined-in-15",children:"Defined in"}),"\n",(0,d.jsx)(r.p,{children:(0,d.jsx)(r.a,{href:"https://github.com/operativa-dev/verse/blob/afd181c927e47fdeff512ae41818fb33ecad359a/packages/verse-core/src/model/visitor.ts#L39",children:"packages/verse-core/src/model/visitor.ts:39"})}),"\n",(0,d.jsx)(r.hr,{}),"\n",(0,d.jsx)(r.h3,{id:"visitvalueobjectproperty",children:"visitValueObjectProperty()"}),"\n",(0,d.jsxs)(r.blockquote,{children:["\n",(0,d.jsxs)(r.p,{children:[(0,d.jsx)(r.strong,{children:"visitValueObjectProperty"}),"(",(0,d.jsx)(r.code,{children:"valueObjectProperty"}),": ",(0,d.jsx)(r.a,{href:"/docs/api/model/model/classes/ValueObjectPropertyModel",children:(0,d.jsx)(r.code,{children:"ValueObjectPropertyModel"})}),", ",(0,d.jsx)(r.code,{children:"state"}),"?: ",(0,d.jsx)(r.code,{children:"S"}),"): ",(0,d.jsx)(r.code,{children:"T"})]}),"\n"]}),"\n",(0,d.jsx)(r.h4,{id:"parameters-16",children:"Parameters"}),"\n",(0,d.jsxs)(r.table,{children:[(0,d.jsx)(r.thead,{children:(0,d.jsxs)(r.tr,{children:[(0,d.jsx)(r.th,{children:"Parameter"}),(0,d.jsx)(r.th,{children:"Type"})]})}),(0,d.jsxs)(r.tbody,{children:[(0,d.jsxs)(r.tr,{children:[(0,d.jsx)(r.td,{children:(0,d.jsx)(r.code,{children:"valueObjectProperty"})}),(0,d.jsx)(r.td,{children:(0,d.jsx)(r.a,{href:"/docs/api/model/model/classes/ValueObjectPropertyModel",children:(0,d.jsx)(r.code,{children:"ValueObjectPropertyModel"})})})]}),(0,d.jsxs)(r.tr,{children:[(0,d.jsxs)(r.td,{children:[(0,d.jsx)(r.code,{children:"state"}),"?"]}),(0,d.jsx)(r.td,{children:(0,d.jsx)(r.code,{children:"S"})})]})]})]}),"\n",(0,d.jsx)(r.h4,{id:"returns-17",children:"Returns"}),"\n",(0,d.jsx)(r.p,{children:(0,d.jsx)(r.code,{children:"T"})}),"\n",(0,d.jsx)(r.h4,{id:"defined-in-16",children:"Defined in"}),"\n",(0,d.jsx)(r.p,{children:(0,d.jsx)(r.a,{href:"https://github.com/operativa-dev/verse/blob/afd181c927e47fdeff512ae41818fb33ecad359a/packages/verse-core/src/model/visitor.ts#L99",children:"packages/verse-core/src/model/visitor.ts:99"})})]})}function a(e={}){const{wrapper:r}={...(0,i.R)(),...e.components};return r?(0,d.jsx)(r,{...e,children:(0,d.jsx)(h,{...e})}):h(e)}},3327:(e,r,s)=>{s.d(r,{R:()=>l,x:()=>c});var d=s(2155);const i={},n=d.createContext(i);function l(e){const r=d.useContext(n);return d.useMemo((function(){return"function"==typeof e?e(r):{...r,...e}}),[r,e])}function c(e){let r;return r=e.disableParentContext?"function"==typeof e.components?e.components(i):e.components||i:l(e.components),d.createElement(n.Provider,{value:r},e.children)}}}]);