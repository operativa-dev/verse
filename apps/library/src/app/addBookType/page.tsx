import { Book, db } from "@/data";
import { EntityType } from "@operativa/verse";
import Link from "next/link";
import { redirect } from "next/navigation";

async function addBookToSystem(data: FormData) {
  "use server";

  const title = data.get("title")?.valueOf();
  const description = data.get("description")?.valueOf();

  // noinspection SuspiciousTypeOfGuard
  if (typeof title !== "string" || title.length === 0) {
    throw new Error("Invalid title");
  }
  // noinspection SuspiciousTypeOfGuard
  if (typeof description !== "string" || description.length === 0) {
    throw new Error("Invalid description");
  }
  const uow = db.uow();

  type BookEntity = EntityType<typeof db.entities.books>;
  const newBook: BookEntity = new Book(title, description);
  await uow.books.add(newBook);

  await uow.commit();

  redirect("/library");
}

export default async function Page() {
  return (
    <>
      <header className="flex justify-between items-center mb-4">
        <h1 className="text-2xl">New Book</h1>
      </header>
      <form action={addBookToSystem} className="flex gap-2 flex-col">
        <label className="block mb-2 text-sm font-medium">Title</label>
        <input
          type="string"
          name="title"
          className="border border-slate-300 bg-transparent rounded px-2 py-1 outline-none focus-within:border-slate-100"
        />
        <label className="block mb-2 text-sm font-medium">Description</label>
        <input
          type="string"
          name="description"
          className="border border-slate-300 bg-transparent rounded px-2 py-1 outline-none focus-within:border-slate-100"
        />
        <div className="flex gap-1 justify-end">
          <Link
            href=".."
            className="border border-slate-500 text-slate-500 px-2 py-1 rounded hover:bg-slate-200 focus-within:bg-slate-300 outline-none"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="border border-slate-500 text-slate-500 px-2 py-1 rounded hover:bg-slate-200 focus-within:bg-slate-300 outline-none"
          >
            Create
          </button>
        </div>
      </form>
    </>
  );
}
