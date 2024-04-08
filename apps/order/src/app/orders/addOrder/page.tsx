import { CreateOrder } from "@/components/CreateOrder";
import { db } from "@/data";

export default async function Page() {
  let products = await db.from.products.toArray();

  return (
    <>
      <CreateOrder products={JSON.parse(JSON.stringify(products))} />
    </>
  );
}
