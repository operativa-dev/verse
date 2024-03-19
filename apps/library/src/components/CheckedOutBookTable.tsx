import { Book, User, db } from "@/data";
import { Table } from "@mui/joy";
import Link from "next/link";
import { ReturnBookButton } from "./ReturnBookButton";
export async function CheckedOutBookTable() {
  const checkOutBooks = await db.from.libraryInventory
    .where((i) => i.userId !== 0)
    .join(Book, (lib, book) => lib.bookId === book.bookId)
    .join(User, (lib, _, user) => lib.userId === user.userId)
    .select((lib, book, user) => ({
      id: lib.id,
      firstName: user.firstName,
      title: book.title,
      created: lib.created,
    }))
    .toArray();
    
  return (
    <>
      <header className="flex justify-between items-center mb-4">
        <h1 className="text-2xl">Checked Out Books</h1>
        <Link
          className="border border-slate-500 text-slate-500 px-2 py-1 rounded hover:bg-slate-200 focus-within:bg-slate-300 outline-none"
          href="/customers/checkoutBook"
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
            <th>Created</th>
          </tr>
        </thead>
        <tbody>
          {checkOutBooks.map((checkOutBook: any) => (
            <tr key={"key-" + checkOutBook.id}>
              <td>
                <ReturnBookButton id={parseInt(checkOutBook.id + "")} />
              </td>
              <td>{checkOutBook.id}</td>
              <td>{checkOutBook.firstName}</td>
              <td>{checkOutBook.title}</td>
              <td>{checkOutBook.created}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}
