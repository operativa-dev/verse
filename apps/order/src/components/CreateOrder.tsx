"use client";
import { ItemType, ProductType } from "@/data";
import { createOrderServer } from "@/server";
import { Button, Input, Table } from "@mui/joy";
import { useState } from "react";
export function CreateOrder({
  products,
  firstProductId,
}: {
  products: Array<ProductType>;
  firstProductId: number;
}) {
  const getFirstProduct: ProductType = products[0];
  const productsPriceDict = Object.fromEntries(products.map(x => [x.productId, x.price]));
  const initialItem: ItemType = {
    itemId: 1,
    productId: firstProductId,
    overridePrice: productsPriceDict[firstProductId],
    quantity: 1,
    orderId: -1,
  };
  const [items, setItems] = useState<ItemType[]>([initialItem]);
  const [updateCount, setUpdateCount] = useState(1);

  const addEmptyItem = () => {
    let itemsTemp = [
      ...items,
      {
        itemId: updateCount + 1,
        productId: getFirstProduct.productId,
        overridePrice: productsPriceDict[getFirstProduct.productId],
        quantity: 1,
        orderId: -1,
      },
    ];
    setUpdateCount(updateCount + 1);
    setItems(itemsTemp);
  };
  const removeItem = (itemId: number) => {
    const tempItems = items.filter(item => item.itemId !== itemId);
    setUpdateCount(updateCount + 1);
    setItems(tempItems);
  };
  const updateValue = (property: string, itemId: number, value: number) => {
    const tempItems = items;
    var index = tempItems.findIndex(obj => {
      return obj.itemId === itemId;
    });
    tempItems[index][property as keyof ItemType] = value;

    // if productId is updated we also need to update the overridePrice attribute
    if (property == "productId") {
      var propIndex = products.findIndex(obj => {
        return obj.productId === value;
      });
      tempItems[index].overridePrice = products[propIndex].price;
    }
    setItems(tempItems);
    setUpdateCount(updateCount + 1);
  };
  // const createOrder = () => {
  //   createOrderServer(items);
  // };

  return (
    <>
      <header className="flex justify-between items-center mb-4">
        <h1 className="text-2xl">New Order</h1>
        <Button onClick={() => createOrderServer(items)}>Save</Button>
      </header>
      <Table aria-label="basic table">
        <thead>
          <tr>
            <th></th>
            <th>ID</th>
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
                <Button onClick={() => removeItem(obj.itemId)}>Remove</Button>{" "}
              </td>
              <td>{obj.itemId}</td>
              <td>
                <select
                  name="productId"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  defaultValue={obj.productId + ""}
                  onChange={e => updateValue("productId", obj.itemId, parseInt(e.target.value))}
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
                  disabled={true}
                  defaultValue={productsPriceDict[obj.productId]}
                  className="border border-slate-300 bg-transparent rounded px-2 py-1 outline-none focus-within:border-slate-100"
                />
              </td>

              <td>
                <Input
                  type="number"
                  name="overridePrice"
                  defaultValue={obj.overridePrice}
                  className="border border-slate-300 bg-transparent rounded px-2 py-1 outline-none focus-within:border-slate-100"
                  onBlur={e => updateValue("overridePrice", obj.itemId, parseInt(e.target.value))}
                />
              </td>
              <td>
                <Input
                  type="number"
                  name="quantity"
                  defaultValue={obj.quantity}
                  className="border border-slate-300 bg-transparent rounded px-2 py-1 outline-none focus-within:border-slate-100"
                  onBlur={e => updateValue("quantity", obj.itemId, parseInt(e.target.value))}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Button onClick={() => addEmptyItem()}>Add</Button>
    </>
  );
}
