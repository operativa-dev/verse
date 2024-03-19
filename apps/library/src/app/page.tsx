import { Book, db } from "@/data";

export default async function Home() {
  const exists = await db.database.exists();

  if (!exists) {
    await db.database.recreate();
  }
  const libraryInventoryCount = await db.from.libraryInventory.count();
  const usersCount = await db.from.users.count();
  const libraryInventoryAvailable = await db.from.libraryInventory
    .where((lib) => lib.userId === null)
    .count();
  return (
    <>
     <header className="flex justify-between items-center mb-4">
        <h1 className="text-2xl"> Welcome to the library!</h1>
      </header>
      <br />
      There are {libraryInventoryCount} books in the library.
      <br />
      {libraryInventoryAvailable} books are available 
      and {libraryInventoryCount - libraryInventoryAvailable} books are checked out.
      <br />
      There are {usersCount} customers in the system.
    </>
  );
}
