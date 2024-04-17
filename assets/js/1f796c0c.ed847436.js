"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[2824],{756:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>c,contentTitle:()=>o,default:()=>h,frontMatter:()=>r,metadata:()=>a,toc:()=>d});var i=t(3159),s=t(6595);const r={},o="Entities",a={id:"ref/Configuration/entities",title:"Entities",description:"Entities are the primary building blocks of a model, and correspond to the core concepts in your application domain,",source:"@site/docs/ref/02-Configuration/02-entities.mdx",sourceDirName:"ref/02-Configuration",slug:"/ref/Configuration/entities",permalink:"/docs/ref/Configuration/entities",draft:!1,unlisted:!1,editUrl:"https://github.com/operativa-dev/verse/edit/main/apps/docs",tags:[],version:"current",sidebarPosition:2,frontMatter:{},sidebar:"refSidebar",previous:{title:"Overview",permalink:"/docs/ref/Configuration/overview"},next:{title:"Properties",permalink:"/docs/ref/Configuration/properties"}},c={},d=[{value:"Objects vs. Classes",id:"objects-vs-classes",level:2},{value:"Entity Types",id:"entity-types",level:2},{value:"Circular References",id:"circular-references",level:2},{value:"Properties",id:"properties",level:2},{value:"Shadow Properties",id:"shadow-properties",level:2},{value:"Navigations",id:"navigations",level:2},{value:"Key",id:"key",level:2},{value:"Foreign Keys",id:"foreign-keys",level:2},{value:"Table",id:"table",level:2},{value:"Concurrency",id:"concurrency",level:2},{value:"Conditions",id:"conditions",level:2},{value:"Seed Data",id:"seed-data",level:2}];function l(e){const n={a:"a",admonition:"admonition",code:"code",em:"em",h1:"h1",h2:"h2",li:"li",p:"p",pre:"pre",ul:"ul",...(0,s.R)(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(n.h1,{id:"entities",children:"Entities"}),"\n",(0,i.jsx)(n.p,{children:"Entities are the primary building blocks of a model, and correspond to the core concepts in your application domain,\nsuch as users, products, orders, etc. Entities have identity, and are uniquely identifiable by their primary key. They\nare made up of fields, which represent the properties of the entity, and relationships, which represent the associations\nbetween entities."}),"\n",(0,i.jsxs)(n.p,{children:["In Verse, entity models are created using the ",(0,i.jsx)(n.a,{href:"../../api/model/builder/functions/entity",children:(0,i.jsx)(n.code,{children:"entity"})})," configuration function,\nwhich is used, along with other configuration functions, to define a complete entity model. The following example\ndemonstrates how to define a simple entity model for a user:"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-ts",metastring:"include ./apps/snippets/src/entities.ts:user showLineNumbers",children:"const User = entity({\n  id: int(),\n  name: string(),\n  email: string(),\n});\n"})}),"\n",(0,i.jsxs)(n.p,{children:["Once created, we can add it to the model by simply adding it to the ",(0,i.jsx)(n.code,{children:"entities"})," object in the model configuration:"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-ts",metastring:"include ./apps/snippets/src/entities.ts:model showLineNumbers",children:"const db = verse({\n  config: {\n    // ...\n  },\n  model: {\n    entities: {\n      users: User,\n    },\n  },\n});\n"})}),"\n",(0,i.jsx)(n.admonition,{type:"note",children:(0,i.jsx)(n.p,{children:"We could have just as easily defined the entity directly in the model configuration, but it's often better to\ndefine it separately, especially when the model is large or the entity is involved in relationships."})}),"\n",(0,i.jsxs)(n.p,{children:["Observe that when we add an entity to the model, we associate it with a ",(0,i.jsx)(n.code,{children:"label"}),", in this case ",(0,i.jsx)(n.code,{children:"users"}),". This label is used\nto refer to the entity when we are doing things like querying data."]}),"\n",(0,i.jsxs)(n.p,{children:["E.g. it lets us write queries like ",(0,i.jsx)(n.code,{children:"db.from.users.where(u => u.name === 'Alice')"}),"."]}),"\n",(0,i.jsx)(n.h2,{id:"objects-vs-classes",children:"Objects vs. Classes"}),"\n",(0,i.jsx)(n.p,{children:"At runtime, Verse entities can either be plain objects or class instances. By default, entities are plain objects, but\nyou can also use classes to represent entities. This can be useful when you want to add methods to your entities, or when\nyou want to use inheritance to define common behavior."}),"\n",(0,i.jsxs)(n.p,{children:["To use a a class to define an entity, you can simply pass the class constructor to the ",(0,i.jsx)(n.code,{children:"entity"})," function:"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-ts",metastring:"include ./apps/snippets/src/entities.ts:class showLineNumbers",children:"class User {\n  constructor(\n    readonly id: number,\n    public name: string,\n    public email: string\n  ) {}\n}\n\nconst user = entity(User, {\n  id: int(),\n  name: string(),\n  email: string(),\n});\n"})}),"\n",(0,i.jsxs)(n.p,{children:["In this case, we define a ",(0,i.jsx)(n.code,{children:"User"})," class with a constructor that takes the properties of the entity as arguments. We then\npass the class constructor to the ",(0,i.jsx)(n.code,{children:"entity"})," function, along with the configuration object that defines the properties of\nthe entity."]}),"\n",(0,i.jsx)(n.admonition,{type:"note",children:(0,i.jsx)(n.p,{children:"All configuration APIs that accept entity types can also accept class constructors."})}),"\n",(0,i.jsx)(n.p,{children:"Whether or not you use classes to define entities is largely a matter of personal preference, but there are some things\nthat you can do with classes that you can't do with plain objects:"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsx)(n.li,{children:"Use inheritance to define common behavior."}),"\n",(0,i.jsx)(n.li,{children:"Create entities with stricter APIs. e.g. by making properties read-only."}),"\n",(0,i.jsxs)(n.li,{children:["Use ",(0,i.jsx)(n.em,{children:"shadow properties"})," to represent properties that are not present in the class definition."]}),"\n",(0,i.jsx)(n.li,{children:"Easily create circular references between entities."}),"\n",(0,i.jsx)(n.li,{children:"Perform in-line model configuration."}),"\n"]}),"\n",(0,i.jsx)(n.h2,{id:"entity-types",children:"Entity Types"}),"\n",(0,i.jsxs)(n.p,{children:["When using plain objects to define entities, we would like a type that represents the shape of the entity. Verse\nprovides a utility type, ",(0,i.jsx)(n.a,{href:"../../api/verse/type-aliases/EntityType",children:(0,i.jsx)(n.code,{children:"EntityType"})}),", that generates a type for an\nentity. This type can be used to type-check entities and queries, and to provide additional tooling support."]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-ts",metastring:"include ./apps/snippets/src/entities.ts:type showLineNumbers",children:"type UserType = EntityType<typeof db.entities.users>;\n"})}),"\n",(0,i.jsx)(n.h2,{id:"circular-references",children:"Circular References"}),"\n",(0,i.jsxs)(n.p,{children:["Entities can have relationships with other entities, and these relationships can form a graph of entities that reference\neach other. This is known as a ",(0,i.jsx)(n.em,{children:"circular reference"}),", and can be useful for representing complex relationships between\nentities. When using class-based entities, this is not a problem, as classes can reference each other directly. However,\nwhen using plain objects, we need to use a different approach to handle circular references, because TypeScript does not\nperform type-inference for types containing circular references."]}),"\n",(0,i.jsx)(n.p,{children:"The pattern we need to use looks like this:"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-ts",metastring:"include ./apps/snippets/src/entities.ts:circular showLineNumbers",children:'type PostType = {\n  readonly id: number;\n  userId: number;\n};\n\nconst User = entity({\n  id: int(),\n  posts: many<PostType>("Post"),\n});\n\nconst Post = entity({\n  id: int(),\n  userId: int(),\n  user: one(User),\n});\n\nconst db = verse({\n  config: {\n    // ...\n  },\n  model: {\n    entities: {\n      users: User,\n      posts: Post,\n    },\n  },\n});\n'})}),"\n",(0,i.jsxs)(n.p,{children:["We can see that the main difference is that we have had to explicitly define the type of the ",(0,i.jsx)(n.code,{children:"Post"})," entity, and then\npass it to the ",(0,i.jsx)(n.code,{children:"many"})," function when defining the ",(0,i.jsx)(n.code,{children:"posts"})," navigation property on the ",(0,i.jsx)(n.code,{children:"User"})," entity. Additionally, we\nhave had to pass the name of the ",(0,i.jsx)(n.code,{children:"Post"})," entity to the ",(0,i.jsx)(n.code,{children:"many"})," function, so that Verse can resolve the entity that the\nnavigation is referencing. The name of an entity is just the singularized, pascal-cased version of the entity label,\nand is used internally by Verse to identify entities."]}),"\n",(0,i.jsx)(n.h2,{id:"properties",children:"Properties"}),"\n",(0,i.jsxs)(n.p,{children:["As shown above, properties are specified by passing a configuration object to the ",(0,i.jsx)(n.code,{children:"entity"})," function. The configuration\nobject keys are the names of the properties, and the values are calls to type-specific configuration functions. In this\ncase, we used the ",(0,i.jsx)(n.a,{href:"../../api/model/builder/functions/int",children:(0,i.jsx)(n.code,{children:"int"})})," and ",(0,i.jsx)(n.a,{href:"../../api/model/builder/functions/string",children:(0,i.jsx)(n.code,{children:"string"})}),"\nfunctions to define the ",(0,i.jsx)(n.code,{children:"id"}),", ",(0,i.jsx)(n.code,{children:"name"}),", and ",(0,i.jsx)(n.code,{children:"email"})," properties. There are also configuration functions for defining\nother types of properties, such as ",(0,i.jsx)(n.code,{children:"boolean"}),", ",(0,i.jsx)(n.code,{children:"date"})," and ",(0,i.jsx)(n.code,{children:"number"}),"."]}),"\n",(0,i.jsx)(n.p,{children:"These scalar property configuration functions are also used to define how the property behaves and how it should be\nmapped to the database."}),"\n",(0,i.jsx)(n.p,{children:"For example we can can override the default column name for a property:"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-ts",metastring:"include ./apps/snippets/src/entities.ts:column showLineNumbers",children:'const User = entity({\n  id: int({ column: "user_id" }),\n  name: string(),\n  email: string(),\n});\n'})}),"\n",(0,i.jsx)(n.p,{children:"Or set the maximum length of a string property:"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-ts",metastring:"include ./apps/snippets/src/entities.ts:length showLineNumbers",children:"const User = entity({\n  id: int(),\n  name: string({ maxLength: 255 }),\n  email: string(),\n});\n"})}),"\n",(0,i.jsx)(n.h2,{id:"shadow-properties",children:"Shadow Properties"}),"\n",(0,i.jsxs)(n.p,{children:["When using class-based entities, we can define ",(0,i.jsx)(n.em,{children:"shadow properties"})," on the entity to represent properties that are not\npresent in the class definition, but are used by the entity model. Shadow properties are useful for things like\noptimistic concurrency control, where we need to store a version number for the entity, but don't want to expose it\nas a property on the class."]}),"\n",(0,i.jsxs)(n.p,{children:["For example, we can define a shadow property for the ",(0,i.jsx)(n.code,{children:"User"})," entity to represent the version number:"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-ts",metastring:"include ./apps/snippets/src/entities.ts:shadow showLineNumbers",children:'class User {\n  constructor(\n    readonly id: number,\n    public name: string\n  ) {}\n}\n\nconst user = entity(\n  User,\n  {\n    id: int(),\n    name: string(),\n    version: int(),\n  },\n  e => e.concurrency({ version: "version" })\n);\n'})}),"\n",(0,i.jsxs)(n.p,{children:["Verse will treat the ",(0,i.jsx)(n.code,{children:"version"})," property just like any other property, but it will not be present in the type of the\nentity, and so will not be visible to consumers of the entity."]}),"\n",(0,i.jsx)(n.h2,{id:"navigations",children:"Navigations"}),"\n",(0,i.jsx)(n.p,{children:"Navigations are entity properties that reference other entities. They are used to represent relationships between\nentities so that we can enjoy a rich and natural programming model that reflects the data structure of our application domain.\nSpecifically, they allow us to do things like: eager load related data, query across relations without the need for manual joins,\nand update aggregate roots with their children in a single transaction."}),"\n",(0,i.jsxs)(n.p,{children:["For example, a ",(0,i.jsx)(n.code,{children:"User"})," entity might have a ",(0,i.jsx)(n.code,{children:"posts"})," navigation property that references a collection of ",(0,i.jsx)(n.code,{children:"Post"}),"\nentities that the user has created."]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-ts",metastring:"include ./apps/snippets/src/entities.ts:navigations showLineNumbers",children:"const Post = entity({\n  id: int(),\n  title: string(),\n  content: string(),\n});\n\nconst User = entity({\n  id: int(),\n  name: string(),\n  email: string(),\n  posts: many(Post),\n});\n"})}),"\n",(0,i.jsxs)(n.p,{children:["We use the ",(0,i.jsx)(n.a,{href:"../../api/model/builder/functions/many",children:(0,i.jsx)(n.code,{children:"many"})})," function to define a navigation property that references a\ncollection of entities. We can also use the ",(0,i.jsx)(n.a,{href:"../../api/model/builder/functions/one",children:(0,i.jsx)(n.code,{children:"one"})})," function to define a navigation\nproperty that references a single entity."]}),"\n",(0,i.jsx)(n.h2,{id:"key",children:"Key"}),"\n",(0,i.jsxs)(n.p,{children:["Entities have a primary key, which is a unique identifier for the entity. By default, Verse tries to infer the primary\nkey based on the properties of the entity using ",(0,i.jsx)(n.a,{href:"Conventions/overview",children:"conventions"}),". However, you can, of course,\nexplicitly specify the primary key using configuration:"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-ts",metastring:"include ./apps/snippets/src/entities.ts:key showLineNumbers",children:'const User = entity(\n  {\n    id: int(),\n    name: string(),\n    email: string(),\n  },\n  e => e.key("id")\n);\n'})}),"\n",(0,i.jsxs)(n.p,{children:["In this case, we explicitly specify that the ",(0,i.jsx)(n.code,{children:"id"})," property is the primary key of the entity by calling the ",(0,i.jsx)(n.code,{children:"key"})," method\non an entity configuration builder object. We pass a function that takes the entity configuration builder as the second\nargument to the ",(0,i.jsx)(n.code,{children:"entity"})," function."]}),"\n",(0,i.jsx)(n.h2,{id:"foreign-keys",children:"Foreign Keys"}),"\n",(0,i.jsxs)(n.p,{children:["Foreign keys are used to define relationships between entities at the database level, and underpin things like navigations\nand cascading updates. In Verse, foreign keys are defined using the ",(0,i.jsx)(n.code,{children:"references"})," method on the entity configuration builder:"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-ts",metastring:"include ./apps/snippets/src/entities.ts:fks-1 showLineNumbers",children:"const User = entity({\n  id: int(),\n  //...\n});\n\nconst Post = entity(\n  {\n    id: int(),\n    userId: int(),\n    //...\n  },\n  e => e.references(User)\n);\n"})}),"\n",(0,i.jsx)(n.p,{children:"Observe that, in this case, we don't need to specify the column name for the foreign key property, as Verse will infer it\nusing conventions. However, we can override the default behavior by specifying the column name explicitly:"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-ts",metastring:"include ./apps/snippets/src/entities.ts:fks-2 showLineNumbers",children:'const User = entity({\n  id: int(),\n  //...\n});\n\nconst Post = entity(\n  {\n    id: int(),\n    userFk: int(),\n    //...\n  },\n  e => e.references(User, "userFk")\n);\n'})}),"\n",(0,i.jsxs)(n.p,{children:["Here, the foreign key property is named ",(0,i.jsx)(n.code,{children:"userFk"}),", and so will not be automatically inferred by Verse. We need to specify\nthe column name explicitly when calling the ",(0,i.jsx)(n.code,{children:"references"})," method."]}),"\n",(0,i.jsx)(n.h2,{id:"table",children:"Table"}),"\n",(0,i.jsx)(n.p,{children:"We can also specify the table name for an entity, using the same fluent configuration builder function:"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-ts",metastring:"include ./apps/snippets/src/entities.ts:table showLineNumbers",children:'const User = entity(\n  {\n    id: int(),\n    name: string(),\n    email: string(),\n  },\n  e => e.table("users")\n);\n'})}),"\n",(0,i.jsx)(n.admonition,{type:"note",children:(0,i.jsx)(n.p,{children:"In Verse, explicit configuration is often not necessary, as the framework can infer most of the configuration from\nconventions. However, explicit configuration can be useful when you need to override the default behavior."})}),"\n",(0,i.jsx)(n.h2,{id:"concurrency",children:"Concurrency"}),"\n",(0,i.jsxs)(n.p,{children:["Entities can also have a concurrency property, which is used to implement ",(0,i.jsx)(n.em,{children:"optimistic concurrency"})," control. This is a\nmechanism to prevent lost updates in a multi-user environment. When an entity has a concurrency property, Verse will\nautomatically include it in the ",(0,i.jsx)(n.code,{children:"WHERE"})," clause of ",(0,i.jsx)(n.code,{children:"UPDATE"})," and ",(0,i.jsx)(n.code,{children:"DELETE"})," statements, and check that the value has not\nchanged since the entity was last read."]}),"\n",(0,i.jsxs)(n.p,{children:["To specify a concurrency property, we can use the ",(0,i.jsx)(n.code,{children:"concurrency"})," method on the entity configuration builder:"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-ts",metastring:"include ./apps/snippets/src/entities.ts:concurrency showLineNumbers",children:'const User = entity(\n  {\n    //...\n    token: int(),\n  },\n  e => e.concurrency({ version: "token" })\n);\n'})}),"\n",(0,i.jsxs)(n.p,{children:["Here, we specify that the ",(0,i.jsx)(n.code,{children:"token"})," property is the concurrency property for the entity. The ",(0,i.jsx)(n.code,{children:"version"})," option is used to\nspecify that we are using the ",(0,i.jsx)(n.em,{children:"version"})," strategy for concurrency control. This means that the property is expected to\nbe a monotonically increasing value, and will be incremented by one each time the entity is updated. Verse will\nmanage this for us automatically."]}),"\n",(0,i.jsx)(n.h2,{id:"conditions",children:"Conditions"}),"\n",(0,i.jsxs)(n.p,{children:["Entities can also have conditions, which are filters that are automatically applied to any queries for that entity.\nConditions are specified using the ",(0,i.jsx)(n.code,{children:"condition"})," method on the entity configuration builder:"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-ts",metastring:"include ./apps/snippets/src/entities.ts:condition showLineNumbers",children:"const User = entity(\n  {\n    //...\n    deleted: boolean(),\n  },\n  e => e.condition(user => !user.deleted)\n);\n"})}),"\n",(0,i.jsxs)(n.p,{children:["Conditions are useful for implementing cross-cutting concerns, such as soft deletes, where entities are not actually\ndeleted from the database, but are instead marked as deleted by setting a ",(0,i.jsx)(n.code,{children:"deleted"})," flag to ",(0,i.jsx)(n.code,{children:"true"}),". By adding a\ncondition to the entity, we can ensure that developers do not have to remember to filter out deleted entities in their\nqueries."]}),"\n",(0,i.jsx)(n.h2,{id:"seed-data",children:"Seed Data"}),"\n",(0,i.jsxs)(n.p,{children:["Entities can also have seed data, which is initial data, defined at the model level. Verse will automatically insert\nthis data into the database when the database is created. Seed data is specified using the ",(0,i.jsx)(n.code,{children:"data"})," method on the entity\nconfiguration builder:"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-ts",metastring:"include ./apps/snippets/src/entities.ts:seed-data showLineNumbers",children:'const User = entity(\n  {\n    id: int(),\n    name: string(),\n    email: string(),\n  },\n  e =>\n    e.data(\n      { id: 1, name: "John", email: "john@example.com" },\n      { id: 2, name: "Jane", email: "jane@example.com" }\n    )\n);\n'})}),"\n",(0,i.jsx)(n.p,{children:"Seed data is useful for populating the database with initial data, such as reference data, that is required for the\napplication to function correctly. It can also be used for testing purposes, to ensure that the database is in a known\nstate before running tests."})]})}function h(e={}){const{wrapper:n}={...(0,s.R)(),...e.components};return n?(0,i.jsx)(n,{...e,children:(0,i.jsx)(l,{...e})}):l(e)}},6595:(e,n,t)=>{t.d(n,{R:()=>o,x:()=>a});var i=t(1855);const s={},r=i.createContext(s);function o(e){const n=i.useContext(r);return i.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function a(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(s):e.components||s:o(e.components),i.createElement(r.Provider,{value:n},e.children)}}}]);