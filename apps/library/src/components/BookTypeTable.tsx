import { db } from "@/data";
import { Table } from "@mui/joy";
import Link from "next/link";

export async function BookTypeTable() {
  const books = await db.from.books.toArray();
  return (
    <>
      <header className="flex justify-between items-center mb-4">
        <h1 className="text-2xl">Book List</h1>
        <Link
          className="border border-slate-500 text-slate-500 px-2 py-1 rounded hover:bg-slate-200 focus-within:bg-slate-300 outline-none"
          href="/library/addBookType"
        >
          Add Book to System
        </Link>
      </header>
      <Table aria-label="basic table">
        <thead>
          <tr>
            <th style={{ width: "40%" }}>Title</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {books.map(book => (
            <tr key={book.bookId}>
              <td>{book.title}</td>
              <td>{book.description}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}
