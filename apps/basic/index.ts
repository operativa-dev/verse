import { EntityType } from "@operativa/verse";
import { db } from "./model.js";

await db.database.recreate();

console.log("Created database!");

const uow = db.uow();

type Todo = EntityType<typeof db.entities.todos>;

const todo: Partial<Todo> = { title: "Buy milk", completed: false };

await uow.todos.add(todo, { title: "Buy eggs", completed: false });

await uow.commit();

console.log("Saved todos to database!");

const todos = await db.from.todos.toArray();

console.log("Read todos from database:", todos);
