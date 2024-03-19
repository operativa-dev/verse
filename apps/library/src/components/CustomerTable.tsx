import { User } from "@/data";
import { Table } from "@mui/joy";
import Link from "next/link";

export function CustomerTable({ users }: { users: Array<User> }) {
  return (
    <>
      <header className="flex justify-between items-center mb-4">
        <h1 className="text-2xl">Customer List</h1>
        <Link
          className="border border-slate-500 text-slate-500 px-2 py-1 rounded hover:bg-slate-200 focus-within:bg-slate-300 outline-none"
          href="/customers/addCustomer"
        >
          Add Customer
        </Link>
      </header>
      <Table aria-label="basic table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Birthday</th>
            <th>Active</th>
            <th>Author</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.userId}>
              <td>{user.firstName}</td>
              <td>{user.birthday.toDateString()}</td>
              <td>{user.active ? "True" : "False"}</td>
              <td>{user.isAuthor ? "True" : "False"}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}
