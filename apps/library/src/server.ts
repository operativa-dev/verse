"use server";

import { db } from "@/data";

export async function returnBook(id: number) {
  const uow = db.uow();
  const book = await uow.libraryInventory.where((t, $id) => t.id === $id, id).single();

  book.userId = null;

  await uow.commit();
}
