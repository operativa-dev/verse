import { CreateOrder } from "@/components/CreateOrder";
import { db } from "@/data";

export default async function Page() {
  let products = await db.from.products.toArray();
  let firstProductId = 0;
  if (products[0]?.productId) {
    firstProductId = products[0].productId;
  }
  return (
    <>
      <CreateOrder products={products} firstProductId={firstProductId} />
    </>
  );
}
