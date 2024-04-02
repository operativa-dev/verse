import { LibraryInventory, db } from "@/data";
import Link from "next/link";
import { redirect } from "next/navigation";

async function addBookToLibrary(data: FormData) {
  "use server";

  const bookId = parseInt(data.get("book")?.valueOf() + "");
  const quantity = parseInt(data.get("quantity")?.valueOf() + "");

  // noinspection SuspiciousTypeOfGuard
  if (typeof bookId !== "number" || bookId <= 0) {
    throw new Error("Invalid bookId");
  }
  const uow = db.uow();
  let multipleObjectsCreated = new Array(quantity).fill(null).map(function () {
    return new LibraryInventory(new Date(), bookId, undefined);
  });

  await uow.libraryInventory.add(...multipleObjectsCreated);
  await uow.commit();

  redirect("/library");
}

async function getBookList() {
  "use server";

  const books = await db.from.books.toArray();
  return books;
}

export default async function Page() {
  let bookList = await db.from.books.toArray();

  return (
    <>
      <header className="flex justify-between items-center mb-4">
        <h1 className="text-2xl">Add Book to Library</h1>
      </header>
      <form action={addBookToLibrary} className="flex gap-2 flex-col">
        <label className="block mb-2 text-sm font-medium">Select an option</label>
        <select
          name="book"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        >
          {bookList.map(book => (
            <option key={book.bookId} value={book.bookId}>
              {book.title}
            </option>
          ))}
        </select>
        <label className="block mb-2 text-sm font-medium">Quantity</label>
        <input
          type="number"
          name="quantity"
          defaultValue={1}
          className="border border-slate-300 bg-transparent rounded px-2 py-1 outline-none focus-within:border-slate-100"
        />
        <div className="flex gap-1 justify-end">
          <Link
            href="/library"
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
