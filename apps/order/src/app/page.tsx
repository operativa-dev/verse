import { db } from "@/data";

export default async function Home() {
  const exists = await db.database.exists();

  if (!exists) {
    await db.database.recreate();
  }

  return (
    <>
      <header className="flex justify-between items-center mb-4">
        <h1 className="text-2xl"> Welcome to the Order App!</h1>
      </header>
    </>
  );
}
