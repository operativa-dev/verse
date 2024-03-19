import { User, db } from "@/data";
import { Checkbox } from "@mui/joy";
import Link from "next/link";
import { redirect } from "next/navigation";

async function addCustomer(data: FormData) {
  "use server";

  const name = data.get("name")?.valueOf();
  const active = data.get("active")?.valueOf() === "on" || false;

  // noinspection SuspiciousTypeOfGuard
  if (typeof name !== "string" || name.length === 0) {
    throw new Error("Invalid name");
  }
  // noinspection SuspiciousTypeOfGuard
  if (typeof active !== "boolean") {
    throw new Error("Invalid active");
  }
  const uow = db.uow();
  await uow.users.add(new User(name, new Date(), active, false));
  await uow.commit();

  redirect("/customers");
}

export default async function Page() {
  return (
    <>
      <header className="flex justify-between items-center mb-4">
        <h1 className="text-2xl">New Customer</h1>
      </header>
      <form action={addCustomer} className="flex gap-2 flex-col">
        <label className="block mb-2 text-sm font-medium">Name</label>
        <input
          type="text"
          name="name"
          className="border border-slate-300 bg-transparent rounded px-2 py-1 outline-none focus-within:border-slate-100"
        />
        <label className="block mb-2 text-sm font-medium">Active</label>
        <Checkbox
          name="active"
          className="border border-slate-300 bg-transparent rounded px-2 py-1 outline-none focus-within:border-slate-100"
        />
        <div className="flex gap-1 justify-end">
          <Link
            href="/customers"
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
