import { OrdersTable } from "@/components/OrdersTable";
import { db } from "@/data";

export default async function Orders() {
  const orders = await db.from.orders.toArray();

  return (
    <>
      <OrdersTable orders={orders} />
    </>
  );
}
