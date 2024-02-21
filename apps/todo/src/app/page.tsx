import { TodoItem } from "@/components/TodoItem";
import { db } from "@/data";
import Link from "next/link";

export default async function Home() {
  const exists = await db.database.exists();

  if (!exists) {
    await db.database.recreate();
  }

  const todos = await db.from.todos.toArray();

  return (
    <>
      <header className="flex justify-between items-center mb-4">
        <h1 className="text-2xl">Todos</h1>
        <Link
          className="border border-slate-300 text-slate-300 px-2 py-1 rounded hover:bg-slate-700 focus-within:bg-slate-700 outline-none"
          href="/new"
        >
          New
        </Link>
      </header>
      <ul className="pl-4">
        {todos.map(todo => (
          <TodoItem key={todo.id} {...todo} />
        ))}
      </ul>
    </>
  );
}
