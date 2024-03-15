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

// Create a simple entity class to represent a todo item.

class Todo {
  public readonly id!: number;

  constructor(
    public title: string,
    public completed = false
  ) {}
}

// Setup our Verse instance.

const db = verse({
  config: {
    driver: sqlite("todos.sqlite"),
    logger: new PrettyConsoleLogger(),
  },
  model: {
    entities: {
      todos: entity(
        Todo,
        {
          id: int(),
          title: string(),
          completed: boolean(),
        },
        builder => {
          builder.data(new Todo("Do the dishes"), new Todo("Walk the dog"));
        }
      ),
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

### Samples

The following steps will get you up and running with the Verse samples:
In the verse root directory run these commands:

**`pnpm install`**: bootstraps the entire project, symlinks all dependencies for
cross-component development and builds all components.

**`turbo build`**: run build for all component packages.

You can then navigate to a sample and run it with:

```
cd apps/basic/
pnpm dev
```

### Contributing

We welcome community pull requests for bug fixes, enhancements, and documentation. See [How to contribute](./CONTRIBUTING.md) for more information.

### Getting support

If you encounter a bug or would like to request a feature, [submit an issue](https://github.com/operativa-dev/verse/issues/new/choose).

## See also

- [Documentation](https://about:blank/)
- [Code of conduct](CODE_OF_CONDUCT.md)
