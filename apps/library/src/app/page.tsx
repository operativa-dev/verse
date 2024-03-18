import { db } from "@/data";

export default async function Home() {
  const exists = await db.database.exists();

  if (!exists) {
    await db.database.recreate();
  }

  return (
    <>
      Welcome to the library!
    </>
  );
}
