import { OrderType } from "@/data";
import { Table } from "@mui/joy";
import Link from "next/link";

export function OrdersTable({ orders }: { orders: Array<OrderType> }) {
  return (
    <>
      <header className="flex justify-between items-center mb-4">
        <h1 className="text-2xl">Orders List</h1>
        <Link
          className="border border-slate-500 text-slate-500 px-2 py-1 rounded hover:bg-slate-200 focus-within:bg-slate-300 outline-none"
          href="/orders/addOrder"
        >
          Add Order
        </Link>
      </header>
      <Table aria-label="basic table">
        <thead>
          <tr>
            <th>Id</th>
            <th>User</th>
            <th>Created</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order.orderId}>
              <td>
                <Link
                  className="border border-slate-500 text-slate-500 px-2 py-1 rounded hover:bg-slate-200 focus-within:bg-slate-300 outline-none"
                  href={`/orders/${order.orderId}`}
                >
                  {order.orderId}
                </Link>
              </td>
              <td>{order.userId + ""}</td>
              <td>{order.created + ""}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}
