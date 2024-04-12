import { UserType } from "@/data";
import { Table } from "@mui/joy";
import Link from "next/link";

export function UserTable({ users }: { users: Array<UserType> }) {
  return (
    <>
      <header className="flex justify-between items-center mb-4">
        <h1 className="text-2xl">Users List</h1>
        <Link
          className="border border-slate-500 text-slate-500 px-2 py-1 rounded hover:bg-slate-200 focus-within:bg-slate-300 outline-none"
          href="/users/addUser"
        >
          Add User
        </Link>
      </header>
      <Table aria-label="basic table">
        <thead>
          <tr>
            <th>Id</th>
            <th>Name</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.userId}>
              <td>{user.userId}</td>
              <td>{user.firstName}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}
