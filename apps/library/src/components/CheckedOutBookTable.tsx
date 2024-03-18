import { Book, User, db } from "@/data";
import { Table } from "@mui/joy";
import Link from "next/link";
import { ReturnBookButton } from "./ReturnBookButton";
export async function CheckedOutBookTable() {
  const checkOutBooks = await db.from.libraryInventory
    .where((i) => i.userId !== 0)
    .join(Book, (lib, book) => lib.bookId === book.bookId)
    .join(User, (lib, book, user) => lib.userId === user.userId)
    .select((lib, book, user) => [lib.id, user.firstName, book.title, lib.created])
    .toArray();
  // const checkOutBooks = await db.from.libraryInventory
  //   .join(Book, (lib, book) => lib.bookId === book.bookId)
  //   .join(User, ([lib, b], user) => lib.userId === user.userId)
  //   .where((i) => i.userId !== 0)
  //   .select((lib, book, user) => ({
  //     libraryInventory: lib.id,
  //     users: user.firstName,
  //     books: book.title,
  //   }))
  //   .toArray();
  return (
    <>
      <header className="flex justify-between items-center mb-4">
        <h1 className="text-2xl">Checked Out Books</h1>
        <Link
          className="border border-slate-500 text-slate-500 px-2 py-1 rounded hover:bg-slate-200 focus-within:bg-slate-300 outline-none"
          href="/checkoutBook"
        >
          Checkout Book
        </Link>
      </header>

      <Table aria-label="basic table">
        <thead>
          <tr>
            <th style={{ width: "10%" }}>Return book</th>
            <th style={{ width: "5%" }}>Id</th>
            <th>Customer</th>
            <th>Book</th>
          </tr>
        </thead>
        <tbody>
          {checkOutBooks.map((checkOutBook: Array<string | number>) => (
            <tr key={"key-" + checkOutBooks[0]}>
              <td>
                <ReturnBookButton id={parseInt(checkOutBook[0] + "")} />
              </td>
              <td>{checkOutBook[0]}</td>
              <td>{checkOutBook[1]}</td>
              <td>{checkOutBook[2]}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}
