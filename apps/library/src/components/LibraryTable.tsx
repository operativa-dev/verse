import { Book, db } from "@/data";
import { Table } from "@mui/joy";
import Link from "next/link";

export async function LibraryTable() {
  const libraryInventory = await db.from.libraryInventory
    .join(Book, (lib, book) => lib.bookId === book.bookId)
    .toArray();

  return (
    <>
      <header className="flex justify-between items-center mb-4">
        <h1 className="text-2xl">Library Inventory</h1>
        <Link
          className="border border-slate-500 text-slate-500 px-2 py-1 rounded hover:bg-slate-200 focus-within:bg-slate-300 outline-none"
          href="/library//addBookToLibrary"
        >
          Add Book to Library
        </Link>
      </header>
      <Table aria-label="basic table">
        <thead>
          <tr>
            <th style={{ width: "5%" }}>ID</th>
            <th>Title</th>
            <th>Created</th>
          </tr>
        </thead>
        <tbody>
          {libraryInventory.map((libraryInventoryItem, index) => (
            <tr key={libraryInventoryItem[0].id}>
              <td>{libraryInventoryItem[0].id}</td>
              <td>{libraryInventoryItem[1].title}</td>
              <td>{libraryInventoryItem[0].created.toDateString()}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}
