"use server";

import { db } from "@/data";

export async function toggleTodo(id: number, completed: boolean) {
  const uow = db.uow();
  const todo = await uow.todos.where((t, $id) => t.id === $id, id).single();

  todo.completed = completed;

  await uow.commit();
}
