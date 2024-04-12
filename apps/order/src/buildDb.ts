import { db } from "./data";

const exists = await db.database.exists();
if (!exists) {
  await db.database.recreate();
}
