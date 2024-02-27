"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[784],{1546:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>o,contentTitle:()=>l,default:()=>h,frontMatter:()=>i,metadata:()=>d,toc:()=>c});var r=n(3159),s=n(1515);const i={},l="Domain Language",d={id:"ref/Other/domain-language",title:"Domain Language",description:"The jargon we use to talk about core concepts in O/RM.",source:"@site/docs/ref/Other/domain-language.md",sourceDirName:"ref/Other",slug:"/ref/Other/domain-language",permalink:"/docs/ref/Other/domain-language",draft:!1,unlisted:!1,editUrl:"https://github.com/operativa-dev/verse/edit/main/apps/docs",tags:[],version:"current",frontMatter:{},sidebar:"refSidebar",previous:{title:"Introduction",permalink:"/docs/ref/Updating/intro"}},o={},c=[];function a(e){const t={code:"code",h1:"h1",p:"p",strong:"strong",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",...(0,s.R)(),...e.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(t.h1,{id:"domain-language",children:"Domain Language"}),"\n",(0,r.jsx)(t.p,{children:"The jargon we use to talk about core concepts in O/RM."}),"\n",(0,r.jsxs)(t.table,{children:[(0,r.jsx)(t.thead,{children:(0,r.jsxs)(t.tr,{children:[(0,r.jsx)(t.th,{style:{textAlign:"center"},children:"Term"}),(0,r.jsx)(t.th,{style:{textAlign:"left"},children:"Definition"})]})}),(0,r.jsxs)(t.tbody,{children:[(0,r.jsxs)(t.tr,{children:[(0,r.jsx)(t.td,{style:{textAlign:"center"},children:(0,r.jsx)(t.strong,{children:"Association"})}),(0,r.jsxs)(t.td,{style:{textAlign:"left"},children:["A relationship between two entities. E.g. ",(0,r.jsx)(t.code,{children:"customer.orders"})," or ",(0,r.jsx)(t.code,{children:"customer.address"}),"."]})]}),(0,r.jsxs)(t.tr,{children:[(0,r.jsx)(t.td,{style:{textAlign:"center"},children:(0,r.jsx)(t.strong,{children:"Change Tracking"})}),(0,r.jsx)(t.td,{style:{textAlign:"left"},children:"Keeping track of modifications to loaded entities, so that we can generate SQL DML to persist the changes."})]}),(0,r.jsxs)(t.tr,{children:[(0,r.jsx)(t.td,{style:{textAlign:"center"},children:(0,r.jsx)(t.strong,{children:"Compiled Query"})}),(0,r.jsx)(t.td,{style:{textAlign:"left"},children:"Allowing user-code to reference a query executor component to remove any query preparation overhead."})]}),(0,r.jsxs)(t.tr,{children:[(0,r.jsx)(t.td,{style:{textAlign:"center"},children:(0,r.jsx)(t.strong,{children:"Eager Load"})}),(0,r.jsx)(t.td,{style:{textAlign:"left"},children:"Loading an entity's related data together with the entity itself."})]}),(0,r.jsxs)(t.tr,{children:[(0,r.jsx)(t.td,{style:{textAlign:"center"},children:(0,r.jsx)(t.strong,{children:"Expression Tree"})}),(0,r.jsx)(t.td,{style:{textAlign:"left"},children:"Turning code into a tree data structure at runtime, instead of executing it."})]}),(0,r.jsxs)(t.tr,{children:[(0,r.jsx)(t.td,{style:{textAlign:"center"},children:(0,r.jsx)(t.strong,{children:"Fix-up"})}),(0,r.jsx)(t.td,{style:{textAlign:"left"},children:"The process of ensuring loaded, related entities reference each other properly."})]}),(0,r.jsxs)(t.tr,{children:[(0,r.jsx)(t.td,{style:{textAlign:"center"},children:(0,r.jsx)(t.strong,{children:"Identity Map"})}),(0,r.jsx)(t.td,{style:{textAlign:"left"},children:"Caching loaded entities in memory, so that we only have a single instance of each entity loaded within a unit of work. (Sometimes called the Level 1 cache)"})]}),(0,r.jsxs)(t.tr,{children:[(0,r.jsx)(t.td,{style:{textAlign:"center"},children:(0,r.jsx)(t.strong,{children:"Ignored"})}),(0,r.jsx)(t.td,{style:{textAlign:"left"},children:"An entity or property that is explicitly excluded from the metadata model."})]}),(0,r.jsxs)(t.tr,{children:[(0,r.jsx)(t.td,{style:{textAlign:"center"},children:(0,r.jsx)(t.strong,{children:"Lazy Load"})}),(0,r.jsx)(t.td,{style:{textAlign:"left"},children:"Loading an entity's related data only when and if it is needed."})]}),(0,r.jsxs)(t.tr,{children:[(0,r.jsx)(t.td,{style:{textAlign:"center"},children:(0,r.jsx)(t.strong,{children:"LINQ"})}),(0,r.jsx)(t.td,{style:{textAlign:"left"},children:"Language Integrated Query. The pattern used in .NET that allows database queries to be translated to SQL, but written in C# code."})]}),(0,r.jsxs)(t.tr,{children:[(0,r.jsx)(t.td,{style:{textAlign:"center"},children:(0,r.jsx)(t.strong,{children:"Metadata Model"})}),(0,r.jsx)(t.td,{style:{textAlign:"left"},children:"The configuration data that describes the model, and how it maps to the database."})]}),(0,r.jsxs)(t.tr,{children:[(0,r.jsx)(t.td,{style:{textAlign:"center"},children:(0,r.jsx)(t.strong,{children:"Model"})}),(0,r.jsx)(t.td,{style:{textAlign:"left"},children:"The set of entity types, associations and value-types comprising the data and behavior of an application."})]}),(0,r.jsxs)(t.tr,{children:[(0,r.jsx)(t.td,{style:{textAlign:"center"},children:(0,r.jsx)(t.strong,{children:"Query Compilation"})}),(0,r.jsx)(t.td,{style:{textAlign:"left"},children:"The process of turning a logical query, expressed in API calls, into a physical, reusable execution plan."})]}),(0,r.jsxs)(t.tr,{children:[(0,r.jsx)(t.td,{style:{textAlign:"center"},children:(0,r.jsx)(t.strong,{children:"Query Operator"})}),(0,r.jsxs)(t.td,{style:{textAlign:"left"},children:["A function that describes a specific query operation. e.g. ",(0,r.jsx)(t.code,{children:"map"}),", ",(0,r.jsx)(t.code,{children:"where"}),", ",(0,r.jsx)(t.code,{children:"limit"})," etc."]})]}),(0,r.jsxs)(t.tr,{children:[(0,r.jsx)(t.td,{style:{textAlign:"center"},children:(0,r.jsx)(t.strong,{children:"Navigation Property"})}),(0,r.jsx)(t.td,{style:{textAlign:"left"},children:"A property on an entity type that references another entity type (either single or collection)."})]}),(0,r.jsxs)(t.tr,{children:[(0,r.jsx)(t.td,{style:{textAlign:"center"},children:(0,r.jsx)(t.strong,{children:"Persistent Ignorant"})}),(0,r.jsx)(t.td,{style:{textAlign:"left"},children:"When user-code does not directly depend on any O/RM code."})]}),(0,r.jsxs)(t.tr,{children:[(0,r.jsx)(t.td,{style:{textAlign:"center"},children:(0,r.jsx)(t.strong,{children:"Shadow Property"})}),(0,r.jsx)(t.td,{style:{textAlign:"left"},children:"A property that exists on an entity in the model, but does not exist on the corresponding Typescript class."})]}),(0,r.jsxs)(t.tr,{children:[(0,r.jsx)(t.td,{style:{textAlign:"center"},children:(0,r.jsx)(t.strong,{children:"Streaming Query"})}),(0,r.jsx)(t.td,{style:{textAlign:"left"},children:"When the results of a query are loaded as they are needed, usually via iteration."})]}),(0,r.jsxs)(t.tr,{children:[(0,r.jsx)(t.td,{style:{textAlign:"center"},children:(0,r.jsx)(t.strong,{children:"Unit of Work"})}),(0,r.jsx)(t.td,{style:{textAlign:"left"},children:"A logical set of operations against a model that will be flushed to the database in a single transaction."})]}),(0,r.jsxs)(t.tr,{children:[(0,r.jsx)(t.td,{style:{textAlign:"center"},children:(0,r.jsx)(t.strong,{children:"Update Pipeline"})}),(0,r.jsx)(t.td,{style:{textAlign:"left"},children:"The components that determine how to turn in-memory logical model changes into physical SQL operations."})]})]})]})]})}function h(e={}){const{wrapper:t}={...(0,s.R)(),...e.components};return t?(0,r.jsx)(t,{...e,children:(0,r.jsx)(a,{...e})}):a(e)}},1515:(e,t,n)=>{n.d(t,{R:()=>l,x:()=>d});var r=n(1855);const s={},i=r.createContext(s);function l(e){const t=r.useContext(i);return r.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function d(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(s):e.components||s:l(e.components),r.createElement(i.Provider,{value:t},e.children)}}}]);