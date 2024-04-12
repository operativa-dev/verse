"use client";
import { ItemType, ProductType } from "@/data";
import { Button, Input, Table } from "@mui/joy";

export function ItemTable({
  title,
  items,
  editMode,
  updateCount,
  removeItem,
  productsPriceDict,
  updateValue,
  products,
  isCurrent,
}: {
  title: string;
  items: Array<ItemType>;
  editMode: boolean;
  updateCount: number;
  removeItem: Function;
  productsPriceDict: { [key: number]: number };
  updateValue: Function;
  products: Array<ProductType>;
  isCurrent: boolean;
}) {
  return (
    <>
      {items && items.length !== 0 && (
        <>
          <header className="flex justify-between items-center mb-4">
            <h1 className="text-2xl">{title}</h1>
          </header>
          <Table aria-label="basic table">
            <thead>
              <tr>
                <th></th>
                <th>Id</th>
                <th>Name</th>
                <th>Price</th>
                <th>Override Price</th>
                <th>Qty</th>
              </tr>
            </thead>
            <tbody>
              {items.map((obj: ItemType) => (
                <tr key={"key" + obj.itemId + updateCount}>
                  <td>
                    <Button onClick={() => removeItem(obj.itemId)} disabled={!editMode}>
                      Remove
                    </Button>
                  </td>
                  <td>{obj.itemId}</td>
                  <td>
                    <select
                      name="productId"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      defaultValue={obj.productId + ""}
                      disabled={!editMode}
                      onChange={e =>
                        updateValue("productId", obj.itemId, parseInt(e.target.value), isCurrent)
                      }
                    >
                      {products.map(product => (
                        <option key={product.productId} value={product.productId}>
                          {product.name}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <Input
                      type="number"
                      name="price"
                      defaultValue={productsPriceDict[obj.productId]}
                      disabled={true}
                      className="border border-slate-300 bg-transparent rounded px-2 py-1 outline-none focus-within:border-slate-100"
                    />
                  </td>
                  <td>
                    <Input
                      type="number"
                      name="overridePrice"
                      defaultValue={obj.overridePrice}
                      disabled={!editMode}
                      className="border border-slate-300 bg-transparent rounded px-2 py-1 outline-none focus-within:border-slate-100"
                      tabIndex={0}
                      onBlur={e => {
                        updateValue(
                          "overridePrice",
                          obj.itemId,
                          parseInt(e.target.value),
                          isCurrent
                        );
                      }}
                    />
                  </td>
                  <td>
                    <Input
                      type="number"
                      name="quantity"
                      defaultValue={obj.quantity}
                      disabled={!editMode}
                      className="border border-slate-300 bg-transparent rounded px-2 py-1 outline-none focus-within:border-slate-100"
                      tabIndex={0}
                      onBlur={e => {
                        updateValue("quantity", obj.itemId, parseInt(e.target.value), isCurrent);
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}
    </>
  );
}
