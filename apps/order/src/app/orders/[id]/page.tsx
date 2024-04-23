import { EditOrder } from "@/components/EditOrder";
import { db } from "@/data";
type Props = {
  id: string;
};
export default async function Orders({ params }: { params: Props }) {
  const order = await db.from.orders
    .where((order, $orderIdIn: number) => order.orderId === $orderIdIn, parseInt(params.id))
    .single();
  let productList = await db.from.products.toArray();
  const items = await db.from.items
    .where((item, $orderIdIn: number) => item.orderId === $orderIdIn, parseInt(params.id))
    .toArray();

  return (
    <>
      <p>Edit this page in a new tab to see conflict handling.</p>
      <EditOrder
        orderId={parseInt(params.id)}
        orderIn={order}
        itemsIn={items}
        products={productList}
      />
    </>
  );
}
