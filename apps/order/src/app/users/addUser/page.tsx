import { UserType, db } from "@/data";
import Link from "next/link";
import { redirect } from "next/navigation";

async function addUser(data: FormData) {
  "use server";

  const name = data.get("name")?.valueOf();

  // noinspection SuspiciousTypeOfGuard
  if (typeof name !== "string" || name.length === 0) {
    throw new Error("Invalid name");
  }

  const uow = db.uow();
  await uow.users.add({ firstName: name } as UserType);
  await uow.commit();

  redirect("/users");
}

export default async function Page() {
  return (
    <>
      <header className="flex justify-between items-center mb-4">
        <h1 className="text-2xl">New Customer</h1>
      </header>
      <form action={addUser} className="flex gap-2 flex-col">
        <label className="block mb-2 text-sm font-medium">Name</label>
        <input
          type="text"
          name="name"
          className="border border-slate-300 bg-transparent rounded px-2 py-1 outline-none focus-within:border-slate-100"
        />

        <div className="flex gap-1 justify-end">
          <Link
            href="/users"
            className="border border-slate-500 text-slate-500 px-2 py-1 rounded hover:bg-slate-200 focus-within:bg-slate-300 outline-none"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="border border-slate-500 text-slate-500 px-2 py-1 rounded hover:bg-slate-200 focus-within:bg-slate-300 outline-none"
          >
            Create
          </button>
        </div>
      </form>
    </>
  );
}
