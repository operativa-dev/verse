# Verse

> [!WARNING]
> Verse is an **experimental** package. It is subject to change and intended only for evaluation purposes.

Verse is a modern, fast, object/relational mapper for TypeScript. Some of its features are:

- **Type safety**: Define your model using TypeScript and get full type safety when querying and modifying your data.
- **Performance**: Designed to be fast and efficient, with minimal overhead.
- **Powerful modelling**: Create entities with relationships, inheritance, identity generation strategies, value
  objects, data converters and more.
- **Rich querying**: Supports complex queries, including eager-loading, navigation properties, joins, sub-queries,
  aggregations, grouping etc. The generated SQL is concise and easy to read.
- **Unit of work**: Supports the unit of work pattern, allowing you to easily batch multiple changes and commit them
  in a single transaction.
- **Migrations**: Supports database migrations, allowing you to manage your database schema in a versioned and
  repeatable way.
- **Reliability**: Verse is designed to be reliable and robust, with a strong focus on testing and quality.

Verse is licensed under the [Apache 2.0 License](https://www.apache.org/licenses/LICENSE-2.0).

Reference and API documentation is available at [verse docs](https://operativa-dev.github.io/verse).

## Installation

Verse is available on [npm](https://www.npmjs.com/package/@operativa/verse).

```bash
npm i @operativa/verse
```

Install the driver package corresponding to your target database:

```bash
npm i @operativa/verse-sqlite
npm i @operativa/verse-postgres
npm i @operativa/verse-mysql
```

It is advisable to also install the cli:

```bash
npm i @operativa/verse-cli
```

## Basic usage

The following code demonstrates basic usage of Verse.

```ts include ./apps/snippets/src/basic.ts
import { verse } from "@operativa/verse";
import { sqlite } from "@operativa/verse-sqlite";
import { boolean, entity, int, string } from "@operativa/verse/model/builder";
import { PrettyConsoleLogger } from "@operativa/verse/utils/logging";

// Define a simple entity to represent a Todo item.

const Todo = entity(
  {
    id: int(),
    title: string(),
    completed: boolean(),
  },
  builder => {
    builder.data(
      { title: "Do the dishes", completed: false },
      { title: "Walk the dog", completed: false }
    );
  }
);

// Setup our Verse instance.

const db = verse({
  config: {
    driver: sqlite("todos.sqlite"),
    logger: new PrettyConsoleLogger(),
  },
  model: {
    entities: {
      todos: Todo,
    },
  },
});

// Create a clean database schema. In a real app, this would be done using migrations.

await db.database.recreate();

// Query all the todos from the database.

const todos = await db.from.todos.toArray();

todos.forEach(todo => {
  console.log(`${todo.id}: ${todo.title} (completed: ${todo.completed})`);
});

// Query todos about dogs.

const query = db.from.todos.where(todo => todo.title.like("%dog%"));

for await (const todo of query) {
  console.log(`${todo.id}: ${todo.title} (completed: ${todo.completed})`);
}

// Modify a todo and save the changes.

const uow = db.uow();

const todo = await uow.todos
  .where(todo => todo.title === "Do the dishes")
  .single();

todo.completed = true;

await uow.commit();

// Now we can remove the todo from the database.

uow.todos.remove(todo);

await uow.commit();
```

## Development Status

Please note that "Verse" is in its early development and the presented version is an alpha release. It's intended to be
a preview for select developers. We appreciate bug reports and improvement suggestions as we continue to refine and
enhance this library.

## Contributing

We welcome community pull requests for bug fixes, enhancements, and documentation. See [How to contribute](./CONTRIBUTING.md) for more information.

## Getting support

If you encounter a bug or would like to request a feature, [submit an issue](https://github.com/operativa-dev/verse/issues/new/choose).

## See also

- [Documentation](https://operativa-dev.github.io/verse)
- [Code of conduct](CODE_OF_CONDUCT.md)
