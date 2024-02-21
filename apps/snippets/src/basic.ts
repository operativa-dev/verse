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
