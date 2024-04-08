import { UserTable } from "@/components/UserTable";
import { db } from "@/data";

export default async function Users() {
  const users = await db.from.users.toArray();

  return (
    <>
      <UserTable users={users} />
    </>
  );
}
