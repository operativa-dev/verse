import { CheckedOutBookTable } from "@/components/CheckedOutBookTable";
import { CustomerTable } from "@/components/CustomerTable";
import { db } from "@/data";

export default async function Customer() {
  const users = await db.from.users.toArray();

  return (
    <>
      {/* <GenericTable objectType="users" /> */}

      <CustomerTable users={users} />
      <br />
      <CheckedOutBookTable />
    </>
  );
}
