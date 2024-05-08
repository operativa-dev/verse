"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[9323],{1120:(e,l,s)=>{s.r(l),s.d(l,{assets:()=>c,contentTitle:()=>t,default:()=>a,frontMatter:()=>r,metadata:()=>d,toc:()=>o});var n=s(5723),i=s(6465);const r={title:"NullLogger"},t="Class: NullLogger",d={id:"api/utils/logging/classes/NullLogger",title:"NullLogger",description:"A logger that does nothing.",source:"@site/docs/api/utils/logging/classes/NullLogger.md",sourceDirName:"api/utils/logging/classes",slug:"/api/utils/logging/classes/NullLogger",permalink:"/docs/api/utils/logging/classes/NullLogger",draft:!1,unlisted:!1,tags:[],version:"current",frontMatter:{title:"NullLogger"},sidebar:"apiSidebar",previous:{title:"ConsoleLogger",permalink:"/docs/api/utils/logging/classes/ConsoleLogger"},next:{title:"PrettyConsoleLogger",permalink:"/docs/api/utils/logging/classes/PrettyConsoleLogger"}},c={},o=[{value:"Implements",id:"implements",level:2},{value:"Properties",id:"properties",level:2},{value:"debugEnabled",id:"debugenabled",level:3},{value:"Implementation of",id:"implementation-of",level:4},{value:"Source",id:"source",level:4},{value:"infoEnabled",id:"infoenabled",level:3},{value:"Implementation of",id:"implementation-of-1",level:4},{value:"Source",id:"source-1",level:4},{value:"INSTANCE",id:"instance",level:3},{value:"Source",id:"source-2",level:4},{value:"Methods",id:"methods",level:2},{value:"debug()",id:"debug",level:3},{value:"Parameters",id:"parameters",level:4},{value:"Returns",id:"returns",level:4},{value:"Implementation of",id:"implementation-of-2",level:4},{value:"Source",id:"source-3",level:4},{value:"info()",id:"info",level:3},{value:"Parameters",id:"parameters-1",level:4},{value:"Returns",id:"returns-1",level:4},{value:"Implementation of",id:"implementation-of-3",level:4},{value:"Source",id:"source-4",level:4},{value:"sql()",id:"sql",level:3},{value:"Parameters",id:"parameters-2",level:4},{value:"Returns",id:"returns-2",level:4},{value:"Implementation of",id:"implementation-of-4",level:4},{value:"Source",id:"source-5",level:4}];function h(e){const l={a:"a",blockquote:"blockquote",code:"code",h1:"h1",h2:"h2",h3:"h3",h4:"h4",hr:"hr",li:"li",p:"p",strong:"strong",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",ul:"ul",...(0,i.R)(),...e.components};return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(l.h1,{id:"class-nulllogger",children:"Class: NullLogger"}),"\n",(0,n.jsx)(l.p,{children:"A logger that does nothing."}),"\n",(0,n.jsx)(l.h2,{id:"implements",children:"Implements"}),"\n",(0,n.jsxs)(l.ul,{children:["\n",(0,n.jsx)(l.li,{children:(0,n.jsx)(l.a,{href:"/docs/api/utils/logging/interfaces/Logger",children:(0,n.jsx)(l.code,{children:"Logger"})})}),"\n"]}),"\n",(0,n.jsx)(l.h2,{id:"properties",children:"Properties"}),"\n",(0,n.jsx)(l.h3,{id:"debugenabled",children:"debugEnabled"}),"\n",(0,n.jsxs)(l.blockquote,{children:["\n",(0,n.jsxs)(l.p,{children:[(0,n.jsx)(l.code,{children:"readonly"})," ",(0,n.jsx)(l.strong,{children:"debugEnabled"}),": ",(0,n.jsx)(l.code,{children:"boolean"})," = ",(0,n.jsx)(l.code,{children:"false"})]}),"\n"]}),"\n",(0,n.jsx)(l.p,{children:"Whether debug logging is enabled."}),"\n",(0,n.jsx)(l.h4,{id:"implementation-of",children:"Implementation of"}),"\n",(0,n.jsxs)(l.p,{children:[(0,n.jsx)(l.a,{href:"/docs/api/utils/logging/interfaces/Logger",children:(0,n.jsx)(l.code,{children:"Logger"})})," . ",(0,n.jsx)(l.a,{href:"/docs/api/utils/logging/interfaces/Logger#debugenabled",children:(0,n.jsx)(l.code,{children:"debugEnabled"})})]}),"\n",(0,n.jsx)(l.h4,{id:"source",children:"Source"}),"\n",(0,n.jsx)(l.p,{children:(0,n.jsx)(l.a,{href:"https://github.com/operativa-dev/verse/blob/b04e8d96d19399f70c9e587b8cae8e61aa34839d/packages/verse-core/src/utils/logging.ts#L150",children:"packages/verse-core/src/utils/logging.ts:150"})}),"\n",(0,n.jsx)(l.hr,{}),"\n",(0,n.jsx)(l.h3,{id:"infoenabled",children:"infoEnabled"}),"\n",(0,n.jsxs)(l.blockquote,{children:["\n",(0,n.jsxs)(l.p,{children:[(0,n.jsx)(l.code,{children:"readonly"})," ",(0,n.jsx)(l.strong,{children:"infoEnabled"}),": ",(0,n.jsx)(l.code,{children:"boolean"})," = ",(0,n.jsx)(l.code,{children:"false"})]}),"\n"]}),"\n",(0,n.jsx)(l.p,{children:"Whether info logging is enabled."}),"\n",(0,n.jsx)(l.h4,{id:"implementation-of-1",children:"Implementation of"}),"\n",(0,n.jsxs)(l.p,{children:[(0,n.jsx)(l.a,{href:"/docs/api/utils/logging/interfaces/Logger",children:(0,n.jsx)(l.code,{children:"Logger"})})," . ",(0,n.jsx)(l.a,{href:"/docs/api/utils/logging/interfaces/Logger#infoenabled",children:(0,n.jsx)(l.code,{children:"infoEnabled"})})]}),"\n",(0,n.jsx)(l.h4,{id:"source-1",children:"Source"}),"\n",(0,n.jsx)(l.p,{children:(0,n.jsx)(l.a,{href:"https://github.com/operativa-dev/verse/blob/b04e8d96d19399f70c9e587b8cae8e61aa34839d/packages/verse-core/src/utils/logging.ts#L149",children:"packages/verse-core/src/utils/logging.ts:149"})}),"\n",(0,n.jsx)(l.hr,{}),"\n",(0,n.jsx)(l.h3,{id:"instance",children:"INSTANCE"}),"\n",(0,n.jsxs)(l.blockquote,{children:["\n",(0,n.jsxs)(l.p,{children:[(0,n.jsx)(l.code,{children:"static"})," ",(0,n.jsx)(l.code,{children:"readonly"})," ",(0,n.jsx)(l.strong,{children:"INSTANCE"}),": ",(0,n.jsx)(l.a,{href:"/docs/api/utils/logging/classes/NullLogger",children:(0,n.jsx)(l.code,{children:"NullLogger"})})]}),"\n"]}),"\n",(0,n.jsx)(l.h4,{id:"source-2",children:"Source"}),"\n",(0,n.jsx)(l.p,{children:(0,n.jsx)(l.a,{href:"https://github.com/operativa-dev/verse/blob/b04e8d96d19399f70c9e587b8cae8e61aa34839d/packages/verse-core/src/utils/logging.ts#L146",children:"packages/verse-core/src/utils/logging.ts:146"})}),"\n",(0,n.jsx)(l.h2,{id:"methods",children:"Methods"}),"\n",(0,n.jsx)(l.h3,{id:"debug",children:"debug()"}),"\n",(0,n.jsxs)(l.blockquote,{children:["\n",(0,n.jsxs)(l.p,{children:[(0,n.jsx)(l.strong,{children:"debug"}),"(",(0,n.jsx)(l.code,{children:"_"}),": ",(0,n.jsx)(l.code,{children:"any"}),"): ",(0,n.jsx)(l.code,{children:"void"})]}),"\n"]}),"\n",(0,n.jsx)(l.p,{children:"Logs the given message at the debug level."}),"\n",(0,n.jsx)(l.h4,{id:"parameters",children:"Parameters"}),"\n",(0,n.jsxs)(l.table,{children:[(0,n.jsx)(l.thead,{children:(0,n.jsxs)(l.tr,{children:[(0,n.jsx)(l.th,{style:{textAlign:"left"},children:"Parameter"}),(0,n.jsx)(l.th,{style:{textAlign:"left"},children:"Type"}),(0,n.jsx)(l.th,{style:{textAlign:"left"},children:"Description"})]})}),(0,n.jsx)(l.tbody,{children:(0,n.jsxs)(l.tr,{children:[(0,n.jsx)(l.td,{style:{textAlign:"left"},children:(0,n.jsx)(l.code,{children:"_"})}),(0,n.jsx)(l.td,{style:{textAlign:"left"},children:(0,n.jsx)(l.code,{children:"any"})}),(0,n.jsx)(l.td,{style:{textAlign:"left"},children:"The message to be logged."})]})})]}),"\n",(0,n.jsx)(l.h4,{id:"returns",children:"Returns"}),"\n",(0,n.jsx)(l.p,{children:(0,n.jsx)(l.code,{children:"void"})}),"\n",(0,n.jsx)(l.h4,{id:"implementation-of-2",children:"Implementation of"}),"\n",(0,n.jsxs)(l.p,{children:[(0,n.jsx)(l.a,{href:"/docs/api/utils/logging/interfaces/Logger",children:(0,n.jsx)(l.code,{children:"Logger"})})," . ",(0,n.jsx)(l.a,{href:"/docs/api/utils/logging/interfaces/Logger#debug",children:(0,n.jsx)(l.code,{children:"debug"})})]}),"\n",(0,n.jsx)(l.h4,{id:"source-3",children:"Source"}),"\n",(0,n.jsx)(l.p,{children:(0,n.jsx)(l.a,{href:"https://github.com/operativa-dev/verse/blob/b04e8d96d19399f70c9e587b8cae8e61aa34839d/packages/verse-core/src/utils/logging.ts#L154",children:"packages/verse-core/src/utils/logging.ts:154"})}),"\n",(0,n.jsx)(l.hr,{}),"\n",(0,n.jsx)(l.h3,{id:"info",children:"info()"}),"\n",(0,n.jsxs)(l.blockquote,{children:["\n",(0,n.jsxs)(l.p,{children:[(0,n.jsx)(l.strong,{children:"info"}),"(",(0,n.jsx)(l.code,{children:"_"}),": ",(0,n.jsx)(l.code,{children:"any"}),"): ",(0,n.jsx)(l.code,{children:"void"})]}),"\n"]}),"\n",(0,n.jsx)(l.p,{children:"Logs the given message at the info level."}),"\n",(0,n.jsx)(l.h4,{id:"parameters-1",children:"Parameters"}),"\n",(0,n.jsxs)(l.table,{children:[(0,n.jsx)(l.thead,{children:(0,n.jsxs)(l.tr,{children:[(0,n.jsx)(l.th,{style:{textAlign:"left"},children:"Parameter"}),(0,n.jsx)(l.th,{style:{textAlign:"left"},children:"Type"}),(0,n.jsx)(l.th,{style:{textAlign:"left"},children:"Description"})]})}),(0,n.jsx)(l.tbody,{children:(0,n.jsxs)(l.tr,{children:[(0,n.jsx)(l.td,{style:{textAlign:"left"},children:(0,n.jsx)(l.code,{children:"_"})}),(0,n.jsx)(l.td,{style:{textAlign:"left"},children:(0,n.jsx)(l.code,{children:"any"})}),(0,n.jsx)(l.td,{style:{textAlign:"left"},children:"The message to be logged."})]})})]}),"\n",(0,n.jsx)(l.h4,{id:"returns-1",children:"Returns"}),"\n",(0,n.jsx)(l.p,{children:(0,n.jsx)(l.code,{children:"void"})}),"\n",(0,n.jsx)(l.h4,{id:"implementation-of-3",children:"Implementation of"}),"\n",(0,n.jsxs)(l.p,{children:[(0,n.jsx)(l.a,{href:"/docs/api/utils/logging/interfaces/Logger",children:(0,n.jsx)(l.code,{children:"Logger"})})," . ",(0,n.jsx)(l.a,{href:"/docs/api/utils/logging/interfaces/Logger#info",children:(0,n.jsx)(l.code,{children:"info"})})]}),"\n",(0,n.jsx)(l.h4,{id:"source-4",children:"Source"}),"\n",(0,n.jsx)(l.p,{children:(0,n.jsx)(l.a,{href:"https://github.com/operativa-dev/verse/blob/b04e8d96d19399f70c9e587b8cae8e61aa34839d/packages/verse-core/src/utils/logging.ts#L153",children:"packages/verse-core/src/utils/logging.ts:153"})}),"\n",(0,n.jsx)(l.hr,{}),"\n",(0,n.jsx)(l.h3,{id:"sql",children:"sql()"}),"\n",(0,n.jsxs)(l.blockquote,{children:["\n",(0,n.jsxs)(l.p,{children:[(0,n.jsx)(l.strong,{children:"sql"}),"(",(0,n.jsx)(l.code,{children:"_"}),": ",(0,n.jsx)(l.code,{children:"string"}),"): ",(0,n.jsx)(l.code,{children:"void"})]}),"\n"]}),"\n",(0,n.jsx)(l.p,{children:"Logs the given SQL query."}),"\n",(0,n.jsx)(l.h4,{id:"parameters-2",children:"Parameters"}),"\n",(0,n.jsxs)(l.table,{children:[(0,n.jsx)(l.thead,{children:(0,n.jsxs)(l.tr,{children:[(0,n.jsx)(l.th,{style:{textAlign:"left"},children:"Parameter"}),(0,n.jsx)(l.th,{style:{textAlign:"left"},children:"Type"}),(0,n.jsx)(l.th,{style:{textAlign:"left"},children:"Description"})]})}),(0,n.jsx)(l.tbody,{children:(0,n.jsxs)(l.tr,{children:[(0,n.jsx)(l.td,{style:{textAlign:"left"},children:(0,n.jsx)(l.code,{children:"_"})}),(0,n.jsx)(l.td,{style:{textAlign:"left"},children:(0,n.jsx)(l.code,{children:"string"})}),(0,n.jsx)(l.td,{style:{textAlign:"left"},children:"The SQL query to be logged."})]})})]}),"\n",(0,n.jsx)(l.h4,{id:"returns-2",children:"Returns"}),"\n",(0,n.jsx)(l.p,{children:(0,n.jsx)(l.code,{children:"void"})}),"\n",(0,n.jsx)(l.h4,{id:"implementation-of-4",children:"Implementation of"}),"\n",(0,n.jsxs)(l.p,{children:[(0,n.jsx)(l.a,{href:"/docs/api/utils/logging/interfaces/Logger",children:(0,n.jsx)(l.code,{children:"Logger"})})," . ",(0,n.jsx)(l.a,{href:"/docs/api/utils/logging/interfaces/Logger#sql",children:(0,n.jsx)(l.code,{children:"sql"})})]}),"\n",(0,n.jsx)(l.h4,{id:"source-5",children:"Source"}),"\n",(0,n.jsx)(l.p,{children:(0,n.jsx)(l.a,{href:"https://github.com/operativa-dev/verse/blob/b04e8d96d19399f70c9e587b8cae8e61aa34839d/packages/verse-core/src/utils/logging.ts#L155",children:"packages/verse-core/src/utils/logging.ts:155"})})]})}function a(e={}){const{wrapper:l}={...(0,i.R)(),...e.components};return l?(0,n.jsx)(l,{...e,children:(0,n.jsx)(h,{...e})}):h(e)}},6465:(e,l,s)=>{s.d(l,{R:()=>t,x:()=>d});var n=s(2155);const i={},r=n.createContext(i);function t(e){const l=n.useContext(r);return n.useMemo((function(){return"function"==typeof e?e(l):{...l,...e}}),[l,e])}function d(e){let l;return l=e.disableParentContext?"function"==typeof e.components?e.components(i):e.components||i:t(e.components),n.createElement(r.Provider,{value:l},e.children)}}}]);