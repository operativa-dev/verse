# Repository

> [!WARNING]
> Verse is an **experimental** package. It is subject to change and intended only for evaluation purposes.

This repository is home to the following [Verse](http://about:blank/) packages. These packages are licensed under the [MIT License](LICENSE).

- [Verse](#verse)

## Verse

Verse is a modern object-database mapper for TypeScript. It supports fluent queries, change tracking, updates, and schema migrations. Verse works with PostgreSql, MySql, Azure|SQL Database, SQLite, and other databases through a provider plugin API.

### Installation

Verse is available on [npm](https://www.npmjs.com/package/@operativa/verse).

```bash
npm i @operativa/verse
```

Install the provider package corresponding to your target database:

```bash
npm i @operativa/verse-sqlite
npm i @operativa/verse-postgres
npm i @operativa/verse-mysql
```

It is advisable to also install the cli:

```bash
npm i @operativa/verse-cli
```

### Basic usage

The following code demonstrates basic usage of Verse.

```ts include ./apps/snippets/src/basic.ts
import { verse } from "@operativa/verse";
import { sqlite } from "@operativa/verse-sqlite";
import { boolean, entity, int, string } from "@operativa/verse/model/builder";
import { PrettyConsoleLogger } from "@operativa/verse/utils/logging";

// Define the model
export class Todo {
  public readonly id!: number;

  constructor(public title: string) {}

  completed: boolean = false;
}

const db = verse({
  config: {
    driver: sqlite(":memory:"),
    logger: new PrettyConsoleLogger(),
  },
  model: {
    entities: {
      todos: entity(Todo, {
        id: int(),
        title: string(),
        completed: boolean(),
      }),
    },
  },
});

// Create a clean database schema.
// In a real app, this would be done using migrations.
await db.database.recreate();

// Create a unit of work.
// This allows for transacted units of work following the unit of work pattern.
// See https://en.wikipedia.org/wiki/Unit_of_work
const uow = db.uow();

// Inserting data into the database
await uow.todos.add(new Todo("test"));
await uow.commit();

// Querying
const todo = await uow.todos.orderByDesc(t => t.id).first();

// Updating
todo.completed = true;
await uow.commit();

// Deleting
uow.todos.remove(todo);
await uow.commit();
```

### Contributing

We welcome community pull requests for bug fixes, enhancements, and documentation. See [How to contribute](./CONTRIBUTING.md) for more information.

### Getting support

If you encounter a bug or would like to request a feature, [submit an issue](https://github.com/operativa-dev/verse/issues/new/choose).

## See also

- [Documentation](https://about:blank/)
- [Code of conduct](CODE_OF_CONDUCT.md)
