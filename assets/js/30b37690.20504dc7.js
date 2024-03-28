"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[4219],{3607:(e,r,s)=>{s.r(r),s.d(r,{assets:()=>d,contentTitle:()=>l,default:()=>a,frontMatter:()=>i,metadata:()=>c,toc:()=>o});var t=s(3159),n=s(8740);const i={title:"Driver"},l="Interface: Driver",c={id:"api/db/driver/interfaces/Driver",title:"Driver",description:"The contract between Verse core and a relational database client.",source:"@site/docs/api/db/driver/interfaces/Driver.md",sourceDirName:"api/db/driver/interfaces",slug:"/api/db/driver/interfaces/Driver",permalink:"/docs/api/db/driver/interfaces/Driver",draft:!1,unlisted:!1,tags:[],version:"current",frontMatter:{title:"Driver"},sidebar:"apiSidebar",previous:{title:"db/driver",permalink:"/docs/api/db/driver/"},next:{title:"DriverInfo",permalink:"/docs/api/db/driver/type-aliases/DriverInfo"}},d={},o=[{value:"Accessors",id:"accessors",level:2},{value:"conventions",id:"conventions",level:3},{value:"Returns",id:"returns",level:4},{value:"Source",id:"source",level:4},{value:"info",id:"info",level:3},{value:"Returns",id:"returns-1",level:4},{value:"Source",id:"source-1",level:4},{value:"logger",id:"logger",level:3},{value:"Parameters",id:"parameters",level:4},{value:"Source",id:"source-2",level:4},{value:"Methods",id:"methods",level:2},{value:"create()",id:"create",level:3},{value:"Returns",id:"returns-2",level:4},{value:"Source",id:"source-3",level:4},{value:"drop()",id:"drop",level:3},{value:"Returns",id:"returns-3",level:4},{value:"Source",id:"source-4",level:4},{value:"execute()",id:"execute",level:3},{value:"Parameters",id:"parameters-1",level:4},{value:"Returns",id:"returns-4",level:4},{value:"Source",id:"source-5",level:4},{value:"exists()",id:"exists",level:3},{value:"Returns",id:"returns-5",level:4},{value:"Source",id:"source-6",level:4},{value:"rows()",id:"rows",level:3},{value:"Parameters",id:"parameters-2",level:4},{value:"Returns",id:"returns-6",level:4},{value:"Parameters",id:"parameters-3",level:5},{value:"Returns",id:"returns-7",level:5},{value:"Source",id:"source-7",level:4},{value:"script()",id:"script",level:3},{value:"Parameters",id:"parameters-4",level:4},{value:"Returns",id:"returns-8",level:4},{value:"Source",id:"source-8",level:4},{value:"tableExists()",id:"tableexists",level:3},{value:"Parameters",id:"parameters-5",level:4},{value:"Returns",id:"returns-9",level:4},{value:"Source",id:"source-9",level:4}];function h(e){const r={a:"a",blockquote:"blockquote",code:"code",h1:"h1",h2:"h2",h3:"h3",h4:"h4",h5:"h5",hr:"hr",p:"p",strong:"strong",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",...(0,n.R)(),...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(r.h1,{id:"interface-driver",children:"Interface: Driver"}),"\n",(0,t.jsx)(r.p,{children:"The contract between Verse core and a relational database client."}),"\n",(0,t.jsx)(r.h2,{id:"accessors",children:"Accessors"}),"\n",(0,t.jsx)(r.h3,{id:"conventions",children:"conventions"}),"\n",(0,t.jsxs)(r.blockquote,{children:["\n",(0,t.jsxs)(r.p,{children:[(0,t.jsx)(r.strong,{children:(0,t.jsx)(r.code,{children:"get"})})," ",(0,t.jsx)(r.strong,{children:"conventions"}),"(): ",(0,t.jsx)(r.code,{children:"List"}),"< ",(0,t.jsx)(r.a,{href:"/docs/api/conventions/convention/interfaces/Convention",children:(0,t.jsx)(r.code,{children:"Convention"})})," >"]}),"\n"]}),"\n",(0,t.jsx)(r.p,{children:"Conventions used by the driver."}),"\n",(0,t.jsx)(r.h4,{id:"returns",children:"Returns"}),"\n",(0,t.jsxs)(r.p,{children:[(0,t.jsx)(r.code,{children:"List"}),"< ",(0,t.jsx)(r.a,{href:"/docs/api/conventions/convention/interfaces/Convention",children:(0,t.jsx)(r.code,{children:"Convention"})})," >"]}),"\n",(0,t.jsx)(r.p,{children:"A list of conventions."}),"\n",(0,t.jsx)(r.h4,{id:"source",children:"Source"}),"\n",(0,t.jsx)(r.p,{children:(0,t.jsx)(r.a,{href:"https://github.com/operativa-dev/verse/blob/37ce5e10/packages/verse-core/src/db/driver.ts#L146",children:"packages/verse-core/src/db/driver.ts:146"})}),"\n",(0,t.jsx)(r.hr,{}),"\n",(0,t.jsx)(r.h3,{id:"info",children:"info"}),"\n",(0,t.jsxs)(r.blockquote,{children:["\n",(0,t.jsxs)(r.p,{children:[(0,t.jsx)(r.strong,{children:(0,t.jsx)(r.code,{children:"get"})})," ",(0,t.jsx)(r.strong,{children:"info"}),"(): ",(0,t.jsx)(r.a,{href:"/docs/api/db/driver/type-aliases/DriverInfo",children:(0,t.jsx)(r.code,{children:"DriverInfo"})})]}),"\n"]}),"\n",(0,t.jsx)(r.p,{children:"Retrieves the driver information."}),"\n",(0,t.jsx)(r.h4,{id:"returns-1",children:"Returns"}),"\n",(0,t.jsx)(r.p,{children:(0,t.jsx)(r.a,{href:"/docs/api/db/driver/type-aliases/DriverInfo",children:(0,t.jsx)(r.code,{children:"DriverInfo"})})}),"\n",(0,t.jsx)(r.p,{children:"The driver information."}),"\n",(0,t.jsx)(r.h4,{id:"source-1",children:"Source"}),"\n",(0,t.jsx)(r.p,{children:(0,t.jsx)(r.a,{href:"https://github.com/operativa-dev/verse/blob/37ce5e10/packages/verse-core/src/db/driver.ts#L153",children:"packages/verse-core/src/db/driver.ts:153"})}),"\n",(0,t.jsx)(r.hr,{}),"\n",(0,t.jsx)(r.h3,{id:"logger",children:"logger"}),"\n",(0,t.jsxs)(r.blockquote,{children:["\n",(0,t.jsxs)(r.p,{children:[(0,t.jsx)(r.strong,{children:(0,t.jsx)(r.code,{children:"set"})})," ",(0,t.jsx)(r.strong,{children:"logger"}),"(",(0,t.jsx)(r.code,{children:"logger"}),": ",(0,t.jsx)(r.code,{children:"undefined"})," | ",(0,t.jsx)(r.a,{href:"/docs/api/utils/logging/interfaces/Logger",children:(0,t.jsx)(r.code,{children:"Logger"})}),"): ",(0,t.jsx)(r.code,{children:"void"})]}),"\n"]}),"\n",(0,t.jsxs)(r.p,{children:["Set the ",(0,t.jsx)(r.a,{href:"/docs/api/utils/logging/interfaces/Logger",children:"Logger"})," to be used for logging events."]}),"\n",(0,t.jsx)(r.h4,{id:"parameters",children:"Parameters"}),"\n",(0,t.jsxs)(r.table,{children:[(0,t.jsx)(r.thead,{children:(0,t.jsxs)(r.tr,{children:[(0,t.jsx)(r.th,{style:{textAlign:"left"},children:"Parameter"}),(0,t.jsx)(r.th,{style:{textAlign:"left"},children:"Type"}),(0,t.jsx)(r.th,{style:{textAlign:"left"},children:"Description"})]})}),(0,t.jsx)(r.tbody,{children:(0,t.jsxs)(r.tr,{children:[(0,t.jsx)(r.td,{style:{textAlign:"left"},children:(0,t.jsx)(r.code,{children:"logger"})}),(0,t.jsxs)(r.td,{style:{textAlign:"left"},children:[(0,t.jsx)(r.code,{children:"undefined"})," | ",(0,t.jsx)(r.a,{href:"/docs/api/utils/logging/interfaces/Logger",children:(0,t.jsx)(r.code,{children:"Logger"})})]}),(0,t.jsx)(r.td,{style:{textAlign:"left"},children:"The logger instance to be used. Pass undefined to disable logging."})]})})]}),"\n",(0,t.jsx)(r.h4,{id:"source-2",children:"Source"}),"\n",(0,t.jsx)(r.p,{children:(0,t.jsx)(r.a,{href:"https://github.com/operativa-dev/verse/blob/37ce5e10/packages/verse-core/src/db/driver.ts#L139",children:"packages/verse-core/src/db/driver.ts:139"})}),"\n",(0,t.jsx)(r.h2,{id:"methods",children:"Methods"}),"\n",(0,t.jsx)(r.h3,{id:"create",children:"create()"}),"\n",(0,t.jsxs)(r.blockquote,{children:["\n",(0,t.jsxs)(r.p,{children:[(0,t.jsx)(r.strong,{children:"create"}),"(): ",(0,t.jsx)(r.a,{href:"https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise",children:(0,t.jsx)(r.code,{children:"Promise"})}),"< ",(0,t.jsx)(r.code,{children:"void"})," >"]}),"\n"]}),"\n",(0,t.jsx)(r.p,{children:"Creates the target database."}),"\n",(0,t.jsx)(r.h4,{id:"returns-2",children:"Returns"}),"\n",(0,t.jsxs)(r.p,{children:[(0,t.jsx)(r.a,{href:"https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise",children:(0,t.jsx)(r.code,{children:"Promise"})}),"< ",(0,t.jsx)(r.code,{children:"void"})," >"]}),"\n",(0,t.jsx)(r.p,{children:"A Promise that resolves with no value when the operation is complete."}),"\n",(0,t.jsx)(r.h4,{id:"source-3",children:"Source"}),"\n",(0,t.jsx)(r.p,{children:(0,t.jsx)(r.a,{href:"https://github.com/operativa-dev/verse/blob/37ce5e10/packages/verse-core/src/db/driver.ts#L125",children:"packages/verse-core/src/db/driver.ts:125"})}),"\n",(0,t.jsx)(r.hr,{}),"\n",(0,t.jsx)(r.h3,{id:"drop",children:"drop()"}),"\n",(0,t.jsxs)(r.blockquote,{children:["\n",(0,t.jsxs)(r.p,{children:[(0,t.jsx)(r.strong,{children:"drop"}),"(): ",(0,t.jsx)(r.a,{href:"https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise",children:(0,t.jsx)(r.code,{children:"Promise"})}),"< ",(0,t.jsx)(r.code,{children:"void"})," >"]}),"\n"]}),"\n",(0,t.jsx)(r.p,{children:"Drops the target database."}),"\n",(0,t.jsx)(r.h4,{id:"returns-3",children:"Returns"}),"\n",(0,t.jsxs)(r.p,{children:[(0,t.jsx)(r.a,{href:"https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise",children:(0,t.jsx)(r.code,{children:"Promise"})}),"< ",(0,t.jsx)(r.code,{children:"void"})," >"]}),"\n",(0,t.jsx)(r.p,{children:"A Promise that resolves with no value when the operation is complete."}),"\n",(0,t.jsx)(r.h4,{id:"source-4",children:"Source"}),"\n",(0,t.jsx)(r.p,{children:(0,t.jsx)(r.a,{href:"https://github.com/operativa-dev/verse/blob/37ce5e10/packages/verse-core/src/db/driver.ts#L132",children:"packages/verse-core/src/db/driver.ts:132"})}),"\n",(0,t.jsx)(r.hr,{}),"\n",(0,t.jsx)(r.h3,{id:"execute",children:"execute()"}),"\n",(0,t.jsxs)(r.blockquote,{children:["\n",(0,t.jsxs)(r.p,{children:[(0,t.jsx)(r.strong,{children:"execute"}),"(",(0,t.jsx)(r.code,{children:"statements"}),": ",(0,t.jsx)(r.a,{href:"/docs/api/db/driver/type-aliases/ExecuteStatement",children:(0,t.jsx)(r.code,{children:"ExecuteStatement"})}),"[], ",(0,t.jsx)(r.code,{children:"isolation"}),"?: ",(0,t.jsx)(r.a,{href:"/docs/api/db/driver/type-aliases/IsolationLevel",children:(0,t.jsx)(r.code,{children:"IsolationLevel"})}),", ",(0,t.jsx)(r.code,{children:"onBeforeCommit"}),"?:     (",(0,t.jsx)(r.code,{children:"results"}),": ",(0,t.jsx)(r.a,{href:"/docs/api/db/driver/type-aliases/ExecuteResult",children:(0,t.jsx)(r.code,{children:"ExecuteResult"})}),"[]) => ",(0,t.jsx)(r.code,{children:"void"}),"): ",(0,t.jsx)(r.a,{href:"https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise",children:(0,t.jsx)(r.code,{children:"Promise"})}),"< ",(0,t.jsx)(r.a,{href:"/docs/api/db/driver/type-aliases/ExecuteResult",children:(0,t.jsx)(r.code,{children:"ExecuteResult"})}),"[] >"]}),"\n"]}),"\n",(0,t.jsx)(r.p,{children:"Executes one or more SQL statements and returns the results."}),"\n",(0,t.jsx)(r.h4,{id:"parameters-1",children:"Parameters"}),"\n",(0,t.jsxs)(r.table,{children:[(0,t.jsx)(r.thead,{children:(0,t.jsxs)(r.tr,{children:[(0,t.jsx)(r.th,{style:{textAlign:"left"},children:"Parameter"}),(0,t.jsx)(r.th,{style:{textAlign:"left"},children:"Type"}),(0,t.jsx)(r.th,{style:{textAlign:"left"},children:"Description"})]})}),(0,t.jsxs)(r.tbody,{children:[(0,t.jsxs)(r.tr,{children:[(0,t.jsx)(r.td,{style:{textAlign:"left"},children:(0,t.jsx)(r.code,{children:"statements"})}),(0,t.jsxs)(r.td,{style:{textAlign:"left"},children:[(0,t.jsx)(r.a,{href:"/docs/api/db/driver/type-aliases/ExecuteStatement",children:(0,t.jsx)(r.code,{children:"ExecuteStatement"})}),"[]"]}),(0,t.jsx)(r.td,{style:{textAlign:"left"},children:"The SQL statements to execute."})]}),(0,t.jsxs)(r.tr,{children:[(0,t.jsxs)(r.td,{style:{textAlign:"left"},children:[(0,t.jsx)(r.code,{children:"isolation"}),"?"]}),(0,t.jsx)(r.td,{style:{textAlign:"left"},children:(0,t.jsx)(r.a,{href:"/docs/api/db/driver/type-aliases/IsolationLevel",children:(0,t.jsx)(r.code,{children:"IsolationLevel"})})}),(0,t.jsx)(r.td,{style:{textAlign:"left"},children:"The isolation level for the transaction."})]}),(0,t.jsxs)(r.tr,{children:[(0,t.jsxs)(r.td,{style:{textAlign:"left"},children:[(0,t.jsx)(r.code,{children:"onBeforeCommit"}),"?"]}),(0,t.jsxs)(r.td,{style:{textAlign:"left"},children:["(",(0,t.jsx)(r.code,{children:"results"}),": ",(0,t.jsx)(r.a,{href:"/docs/api/db/driver/type-aliases/ExecuteResult",children:(0,t.jsx)(r.code,{children:"ExecuteResult"})}),"[]) => ",(0,t.jsx)(r.code,{children:"void"})]}),(0,t.jsxs)(r.td,{style:{textAlign:"left"},children:["A callback function to be called before committing the transaction.",(0,t.jsx)("br",{}),"                        Receives an array of ",(0,t.jsx)(r.a,{href:"/docs/api/db/driver/type-aliases/ExecuteResult",children:"ExecuteResult"})," objects as parameter."]})]})]})]}),"\n",(0,t.jsx)(r.h4,{id:"returns-4",children:"Returns"}),"\n",(0,t.jsxs)(r.p,{children:[(0,t.jsx)(r.a,{href:"https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise",children:(0,t.jsx)(r.code,{children:"Promise"})}),"< ",(0,t.jsx)(r.a,{href:"/docs/api/db/driver/type-aliases/ExecuteResult",children:(0,t.jsx)(r.code,{children:"ExecuteResult"})}),"[] >"]}),"\n",(0,t.jsxs)(r.p,{children:["A Promise that resolves to an array of ",(0,t.jsx)(r.a,{href:"/docs/api/db/driver/type-aliases/ExecuteResult",children:"ExecuteResult"})," objects representing the\nresults of executing the statements."]}),"\n",(0,t.jsx)(r.h4,{id:"source-5",children:"Source"}),"\n",(0,t.jsx)(r.p,{children:(0,t.jsx)(r.a,{href:"https://github.com/operativa-dev/verse/blob/37ce5e10/packages/verse-core/src/db/driver.ts#L99",children:"packages/verse-core/src/db/driver.ts:99"})}),"\n",(0,t.jsx)(r.hr,{}),"\n",(0,t.jsx)(r.h3,{id:"exists",children:"exists()"}),"\n",(0,t.jsxs)(r.blockquote,{children:["\n",(0,t.jsxs)(r.p,{children:[(0,t.jsx)(r.strong,{children:"exists"}),"(): ",(0,t.jsx)(r.a,{href:"https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise",children:(0,t.jsx)(r.code,{children:"Promise"})}),"< ",(0,t.jsx)(r.code,{children:"boolean"})," >"]}),"\n"]}),"\n",(0,t.jsx)(r.p,{children:"Checks if the target database exists."}),"\n",(0,t.jsx)(r.h4,{id:"returns-5",children:"Returns"}),"\n",(0,t.jsxs)(r.p,{children:[(0,t.jsx)(r.a,{href:"https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise",children:(0,t.jsx)(r.code,{children:"Promise"})}),"< ",(0,t.jsx)(r.code,{children:"boolean"})," >"]}),"\n",(0,t.jsx)(r.p,{children:"A Promise that resolves to true if the database exists; otherwise, false."}),"\n",(0,t.jsx)(r.h4,{id:"source-6",children:"Source"}),"\n",(0,t.jsx)(r.p,{children:(0,t.jsx)(r.a,{href:"https://github.com/operativa-dev/verse/blob/37ce5e10/packages/verse-core/src/db/driver.ts#L118",children:"packages/verse-core/src/db/driver.ts:118"})}),"\n",(0,t.jsx)(r.hr,{}),"\n",(0,t.jsx)(r.h3,{id:"rows",children:"rows()"}),"\n",(0,t.jsxs)(r.blockquote,{children:["\n",(0,t.jsxs)(r.p,{children:[(0,t.jsx)(r.strong,{children:"rows"}),"(",(0,t.jsx)(r.code,{children:"sql"}),": ",(0,t.jsx)(r.a,{href:"/docs/api/db/sql/classes/SqlNode",children:(0,t.jsx)(r.code,{children:"SqlNode"})}),"): (",(0,t.jsx)(r.code,{children:"args"}),": ",(0,t.jsx)(r.code,{children:"unknown"}),"[]) => ",(0,t.jsx)(r.code,{children:"AsyncIterable"}),"< ",(0,t.jsx)(r.code,{children:"unknown"}),"[] >"]}),"\n"]}),"\n",(0,t.jsx)(r.p,{children:"Creates a function that can execute the given SQL query with the provided arguments\nand return an AsyncIterable of rows."}),"\n",(0,t.jsx)(r.h4,{id:"parameters-2",children:"Parameters"}),"\n",(0,t.jsxs)(r.table,{children:[(0,t.jsx)(r.thead,{children:(0,t.jsxs)(r.tr,{children:[(0,t.jsx)(r.th,{style:{textAlign:"left"},children:"Parameter"}),(0,t.jsx)(r.th,{style:{textAlign:"left"},children:"Type"}),(0,t.jsx)(r.th,{style:{textAlign:"left"},children:"Description"})]})}),(0,t.jsx)(r.tbody,{children:(0,t.jsxs)(r.tr,{children:[(0,t.jsx)(r.td,{style:{textAlign:"left"},children:(0,t.jsx)(r.code,{children:"sql"})}),(0,t.jsx)(r.td,{style:{textAlign:"left"},children:(0,t.jsx)(r.a,{href:"/docs/api/db/sql/classes/SqlNode",children:(0,t.jsx)(r.code,{children:"SqlNode"})})}),(0,t.jsx)(r.td,{style:{textAlign:"left"},children:"The SQL query to execute."})]})})]}),"\n",(0,t.jsx)(r.h4,{id:"returns-6",children:"Returns"}),"\n",(0,t.jsx)(r.p,{children:(0,t.jsx)(r.code,{children:"Function"})}),"\n",(0,t.jsx)(r.p,{children:"A function that can execute the given SQL query."}),"\n",(0,t.jsxs)(r.blockquote,{children:["\n",(0,t.jsx)(r.h5,{id:"parameters-3",children:"Parameters"}),"\n",(0,t.jsxs)(r.table,{children:[(0,t.jsx)(r.thead,{children:(0,t.jsxs)(r.tr,{children:[(0,t.jsx)(r.th,{style:{textAlign:"left"},children:"Parameter"}),(0,t.jsx)(r.th,{style:{textAlign:"left"},children:"Type"})]})}),(0,t.jsx)(r.tbody,{children:(0,t.jsxs)(r.tr,{children:[(0,t.jsx)(r.td,{style:{textAlign:"left"},children:(0,t.jsx)(r.code,{children:"args"})}),(0,t.jsxs)(r.td,{style:{textAlign:"left"},children:[(0,t.jsx)(r.code,{children:"unknown"}),"[]"]})]})})]}),"\n",(0,t.jsx)(r.h5,{id:"returns-7",children:"Returns"}),"\n",(0,t.jsxs)(r.p,{children:[(0,t.jsx)(r.code,{children:"AsyncIterable"}),"< ",(0,t.jsx)(r.code,{children:"unknown"}),"[] >"]}),"\n"]}),"\n",(0,t.jsx)(r.h4,{id:"source-7",children:"Source"}),"\n",(0,t.jsx)(r.p,{children:(0,t.jsx)(r.a,{href:"https://github.com/operativa-dev/verse/blob/37ce5e10/packages/verse-core/src/db/driver.ts#L87",children:"packages/verse-core/src/db/driver.ts:87"})}),"\n",(0,t.jsx)(r.hr,{}),"\n",(0,t.jsx)(r.h3,{id:"script",children:"script()"}),"\n",(0,t.jsxs)(r.blockquote,{children:["\n",(0,t.jsxs)(r.p,{children:[(0,t.jsx)(r.strong,{children:"script"}),"(",(0,t.jsx)(r.code,{children:"statements"}),": ",(0,t.jsx)(r.a,{href:"/docs/api/db/driver/type-aliases/ExecuteStatement",children:(0,t.jsx)(r.code,{children:"ExecuteStatement"})}),"[]): ",(0,t.jsx)(r.code,{children:"string"}),"[]"]}),"\n"]}),"\n",(0,t.jsx)(r.p,{children:"Generate a SQL script for the given statements."}),"\n",(0,t.jsx)(r.h4,{id:"parameters-4",children:"Parameters"}),"\n",(0,t.jsxs)(r.table,{children:[(0,t.jsx)(r.thead,{children:(0,t.jsxs)(r.tr,{children:[(0,t.jsx)(r.th,{style:{textAlign:"left"},children:"Parameter"}),(0,t.jsx)(r.th,{style:{textAlign:"left"},children:"Type"}),(0,t.jsx)(r.th,{style:{textAlign:"left"},children:"Description"})]})}),(0,t.jsx)(r.tbody,{children:(0,t.jsxs)(r.tr,{children:[(0,t.jsx)(r.td,{style:{textAlign:"left"},children:(0,t.jsx)(r.code,{children:"statements"})}),(0,t.jsxs)(r.td,{style:{textAlign:"left"},children:[(0,t.jsx)(r.a,{href:"/docs/api/db/driver/type-aliases/ExecuteStatement",children:(0,t.jsx)(r.code,{children:"ExecuteStatement"})}),"[]"]}),(0,t.jsx)(r.td,{style:{textAlign:"left"},children:"The SQL statements to generate the script for."})]})})]}),"\n",(0,t.jsx)(r.h4,{id:"returns-8",children:"Returns"}),"\n",(0,t.jsxs)(r.p,{children:[(0,t.jsx)(r.code,{children:"string"}),"[]"]}),"\n",(0,t.jsx)(r.p,{children:"An array of strings representing the SQL script."}),"\n",(0,t.jsx)(r.h4,{id:"source-8",children:"Source"}),"\n",(0,t.jsx)(r.p,{children:(0,t.jsx)(r.a,{href:"https://github.com/operativa-dev/verse/blob/37ce5e10/packages/verse-core/src/db/driver.ts#L111",children:"packages/verse-core/src/db/driver.ts:111"})}),"\n",(0,t.jsx)(r.hr,{}),"\n",(0,t.jsx)(r.h3,{id:"tableexists",children:"tableExists()"}),"\n",(0,t.jsxs)(r.blockquote,{children:["\n",(0,t.jsxs)(r.p,{children:[(0,t.jsx)(r.strong,{children:"tableExists"}),"(",(0,t.jsx)(r.code,{children:"name"}),": ",(0,t.jsx)(r.code,{children:"string"}),"): ",(0,t.jsx)(r.a,{href:"https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise",children:(0,t.jsx)(r.code,{children:"Promise"})}),"< ",(0,t.jsx)(r.code,{children:"boolean"})," >"]}),"\n"]}),"\n",(0,t.jsx)(r.p,{children:"Checks whether a table with the given name exists in the target database."}),"\n",(0,t.jsx)(r.h4,{id:"parameters-5",children:"Parameters"}),"\n",(0,t.jsxs)(r.table,{children:[(0,t.jsx)(r.thead,{children:(0,t.jsxs)(r.tr,{children:[(0,t.jsx)(r.th,{style:{textAlign:"left"},children:"Parameter"}),(0,t.jsx)(r.th,{style:{textAlign:"left"},children:"Type"}),(0,t.jsx)(r.th,{style:{textAlign:"left"},children:"Description"})]})}),(0,t.jsx)(r.tbody,{children:(0,t.jsxs)(r.tr,{children:[(0,t.jsx)(r.td,{style:{textAlign:"left"},children:(0,t.jsx)(r.code,{children:"name"})}),(0,t.jsx)(r.td,{style:{textAlign:"left"},children:(0,t.jsx)(r.code,{children:"string"})}),(0,t.jsx)(r.td,{style:{textAlign:"left"},children:"The name of the table to check."})]})})]}),"\n",(0,t.jsx)(r.h4,{id:"returns-9",children:"Returns"}),"\n",(0,t.jsxs)(r.p,{children:[(0,t.jsx)(r.a,{href:"https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise",children:(0,t.jsx)(r.code,{children:"Promise"})}),"< ",(0,t.jsx)(r.code,{children:"boolean"})," >"]}),"\n",(0,t.jsx)(r.p,{children:"A Promise resolving to a boolean value indicating whether the table exists."}),"\n",(0,t.jsx)(r.h4,{id:"source-9",children:"Source"}),"\n",(0,t.jsx)(r.p,{children:(0,t.jsx)(r.a,{href:"https://github.com/operativa-dev/verse/blob/37ce5e10/packages/verse-core/src/db/driver.ts#L161",children:"packages/verse-core/src/db/driver.ts:161"})})]})}function a(e={}){const{wrapper:r}={...(0,n.R)(),...e.components};return r?(0,t.jsx)(r,{...e,children:(0,t.jsx)(h,{...e})}):h(e)}},8740:(e,r,s)=>{s.d(r,{R:()=>l,x:()=>c});var t=s(1855);const n={},i=t.createContext(n);function l(e){const r=t.useContext(i);return t.useMemo((function(){return"function"==typeof e?e(r):{...r,...e}}),[r,e])}function c(e){let r;return r=e.disableParentContext?"function"==typeof e.components?e.components(n):e.components||n:l(e.components),t.createElement(i.Provider,{value:r},e.children)}}}]);