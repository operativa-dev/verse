import { Book, db } from "@/data";
import Link from "next/link";
import { redirect } from "next/navigation";

async function checkoutBook(data: FormData) {
  "use server";

  const bookId = parseInt(data.get("bookId")?.valueOf() + "");
  const userId = parseInt(data.get("userId")?.valueOf() + "");

  const uow = db.uow();

  const book = await uow.libraryInventory
    .where(
      (a, $bookId: number) => a.id === $bookId && a.userId === null,
      bookId
    )
    .single();
  book.userId = userId;
  await uow.commit();

  redirect("/customers");
}
export default async function Page() {
  const users = await db.from.users.toArray();
  const availableBooks = await db.from.libraryInventory
    .where((i) => i.userId === null)
    .join(Book, (lib, book) => lib.bookId === book.bookId)
    .select((lib,book) => [lib.id, book.title, book.description])
    .toArray();
  return (
    <>
      <header className="flex justify-between items-center mb-4">
        <h1 className="text-2xl">Checkout a book</h1>
      </header>
      <form action={checkoutBook} className="flex gap-2 flex-col">
        <label className="block mb-2 text-sm font-medium">
          Select a customer
        </label>
        <select
          name="userId"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        >
          {users.map((user) => (
            <option key={user.userId} value={user.userId}>
              {user.firstName}
            </option>
          ))}
        </select>
        <label className="block mb-2 text-sm font-medium">Select a book</label>
        <select
          name="bookId"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        >
          {availableBooks.map((book) => (
            <option key={book[0]} value={book[0]}>
              {book[1]}
            </option>
          ))}
        </select>

        <div className="flex gap-1 justify-end">
          <Link
            href="/customers"
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
