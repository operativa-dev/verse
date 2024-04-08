"use client";
import { Item, Product } from "@/data";
import { Input, Table } from "@mui/joy";

export function ItemDeltaTable({
  title,
  items,
  editMode,
  deltaMode,
  updateCount,
  removeItem,
  productsNameDict,
  productsPriceDict,
  getOriginalValue,
  updateValue,
  products,
}: {
  title: string;
  items: Array<Item>;
  editMode: boolean;
  deltaMode: boolean;
  updateCount: number;
  productsNameDict: { [key: string]: string };
  removeItem: Function;
  productsPriceDict: { [key: number]: number };
  getOriginalValue: Function;
  updateValue: Function;
  products: Array<Product>;
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
                <th>Id</th>
                <th>Name</th>
                <th>Price</th>
                <th>Override Price</th>
                <th>Qty</th>
              </tr>
            </thead>
            <tbody>
              {items.map((obj: Item) => (
                <tr key={"key" + obj.itemId + updateCount}>
                  <td>
                    {deltaMode && getOriginalValue(obj.itemId, "itemId", obj.itemId) && (
                      <p style={{ color: "red", paddingRight: 5 }} className="inline-block">
                        {getOriginalValue(obj.itemId, "itemId", obj.itemId)}
                        {" =>  "}
                      </p>
                    )}
                    {obj.itemId}
                  </td>
                  <td>
                    {deltaMode &&
                      productsNameDict[
                        getOriginalValue(obj.itemId, "productId", obj.productId)
                      ] && (
                        <p style={{ color: "red", paddingRight: 5 }} className="inline-block">
                          {
                            productsNameDict[
                              getOriginalValue(obj.itemId, "productId", obj.productId)
                            ]
                          }
                          {" =>  "}
                        </p>
                      )}
                    <select
                      name="productId"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 w-24 inline-block"
                      defaultValue={obj.productId + ""}
                      disabled={!editMode}
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
                      defaultValue={productsPriceDict[obj.productId]}
                      disabled={true}
                      className="border border-slate-300 bg-transparent rounded px-2 py-1 outline-none focus-within:border-slate-100 w-12 inline-block"
                    />
                  </td>
                  <td>
                    {deltaMode &&
                      getOriginalValue(obj.itemId, "overridePrice", obj.overridePrice) && (
                        <p style={{ color: "red", paddingRight: 5 }} className="inline-block">
                          {getOriginalValue(obj.itemId, "overridePrice", obj.overridePrice)}{" "}
                          {" =>  "}
                        </p>
                      )}
                    <Input
                      type="number"
                      name="overridePrice"
                      defaultValue={obj.overridePrice}
                      disabled={!editMode}
                      className="border border-slate-300 bg-transparent rounded px-2 py-1 outline-none focus-within:border-slate-100 w-12 inline-block"
                      tabIndex={0}
                      onBlur={e => {
                        updateValue("overridePrice", obj.itemId, parseInt(e.target.value));
                      }}
                    />
                  </td>
                  <td>
                    {deltaMode && getOriginalValue(obj.itemId, "quantity", obj.quantity) && (
                      <p style={{ color: "red", paddingRight: 5 }} className="inline-block">
                        {getOriginalValue(obj.itemId, "quantity", obj.quantity)}
                        {" =>"}
                      </p>
                    )}
                    <Input
                      type="number"
                      name="quantity"
                      defaultValue={obj.quantity}
                      disabled={!editMode}
                      className="border border-slate-300 bg-transparent rounded px-2 py-1 outline-none focus-within:border-slate-100 w-12 inline-block"
                      tabIndex={0}
                      onBlur={e => {
                        updateValue("quantity", obj.itemId, parseInt(e.target.value));
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
