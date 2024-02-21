import { EntityType } from "@operativa/verse";
import { db, Todo } from "./model.js";

await db.database.recreate();

console.log("Created database!");

const uow = db.uow();

type TodoEntity = EntityType<typeof db.entities.todos>;

const todo: TodoEntity = new Todo("Buy milk");

await uow.todos.add(todo, new Todo("Buy eggs"));

await uow.commit();

console.log("Saved todos to database!");

const todos = await db.from.todos.toArray();

console.log("Read todos from database:", todos);
