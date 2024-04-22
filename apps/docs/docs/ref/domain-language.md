# Domain Language

The jargon we use to talk about core concepts in O/RM.

|          Term           | Definition                                                                                                                                                  |
| :---------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------------- |
|     **Association**     | A relationship between two entities. E.g. `customer.orders` or `customer.address`.                                                                          |
|   **Change Tracking**   | Keeping track of modifications to loaded entities, so that we can generate SQL DML to persist the changes.                                                  |
|   **Compiled Query**    | Allowing user-code to reference a query executor component to remove any query preparation overhead.                                                        |
|     **Eager Load**      | Loading an entity's related data together with the entity itself.                                                                                           |
|   **Expression Tree**   | Turning code into a tree data structure at runtime, instead of executing it.                                                                                |
|       **Fix-up**        | The process of ensuring loaded, related entities reference each other properly.                                                                             |
|    **Identity Map**     | Caching loaded entities in memory, so that we only have a single instance of each entity loaded within a unit of work. (Sometimes called the Level 1 cache) |
|       **Ignored**       | An entity or property that is explicitly excluded from the metadata model.                                                                                  |
|      **Lazy Load**      | Loading an entity's related data only when and if it is needed.                                                                                             |
|        **LINQ**         | Language Integrated Query. The pattern used in .NET that allows database queries to be translated to SQL, but written in C# code.                           |
|   **Metadata Model**    | The configuration data that describes the model, and how it maps to the database.                                                                           |
|        **Model**        | The set of entity types, associations and value-types comprising the data and behavior of an application.                                                   |
|  **Query Compilation**  | The process of turning a logical query, expressed in API calls, into a physical, reusable execution plan.                                                   |
|   **Query Operator**    | A function that describes a specific query operation. e.g. `map`, `where`, `limit` etc.                                                                     |
| **Navigation Property** | A property on an entity type that references another entity type (either single or collection).                                                             |
| **Persistent Ignorant** | When user-code does not directly depend on any O/RM code.                                                                                                   |
|   **Shadow Property**   | A property that exists on an entity in the model, but does not exist on the corresponding Typescript class.                                                 |
|   **Streaming Query**   | When the results of a query are loaded as they are needed, usually via iteration.                                                                           |
|    **Unit of Work**     | A logical set of operations against a model that will be flushed to the database in a single transaction.                                                   |
|   **Update Pipeline**   | The components that determine how to turn in-memory logical model changes into physical SQL operations.                                                     |
