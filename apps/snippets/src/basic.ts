/// setup-model
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
///

/// setup-verse
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
///

// Create a clean database schema. In a real app, this would be done using migrations.

/// recreate
await db.database.recreate();
///

// Query all the todos from the database.

/// query-all
const todos = await db.from.todos.toArray();

todos.forEach(todo => {
  console.log(`${todo.id}: ${todo.title} (completed: ${todo.completed})`);
});
///

// Query todos about dogs.

/// query-like
const query = db.from.todos.where(todo => todo.title.like("%dog%"));

for await (const todo of query) {
  console.log(`${todo.id}: ${todo.title} (completed: ${todo.completed})`);
}
///

/// update
// Modify a todo and save the changes.

const uow = db.uow();

const todo = await uow.todos
  .where(todo => todo.title === "Do the dishes")
  .single();

todo.completed = true;

await uow.commit();
///

// Now we can remove the todo from the database.

uow.todos.remove(todo);

await uow.commit();
