"use client";
import { ItemType, OrderType, ProductType } from "@/data";
import { fetchItems, fetchOrder, lockOrderServer, updateOrderServer } from "@/server";
import { Button, IconButton, Modal, ModalClose, Sheet, Typography } from "@mui/joy";
import { useEffect, useState } from "react";
import { ItemDeltaTable } from "./ItemDeltaTable";
import { ItemTable } from "./ItemTable";
import { Edit, FavoriteBorder, SaveAs, Lock, LockOpen } from "@mui/icons-material";

export function EditOrder({
  products,
  orderIn,
  orderId,
  itemsIn,
}: {
  products: Array<ProductType>;
  orderIn: OrderType;
  orderId: number;
  itemsIn: Array<ItemType>;
}) {
  const [originalItems, setOriginalItems] = useState<ItemType[]>([
    JSON.parse(JSON.stringify(itemsIn)),
  ]);
  const [items, setItems] = useState<ItemType[]>(itemsIn);
  const [order, setOrder] = useState<OrderType>(orderIn);
  const [serverItemsDelta, setServerItemsDelta] = useState<ItemType[]>([]);
  const [serverItemsRemoved, setServerItemsRemoved] = useState<ItemType[]>([]);
  const [currentItemsDelta, setCurrentItemsDelta] = useState<ItemType[]>([]);
  const [itemsRemoved, setItemsRemoved] = useState<number[]>([]);
  const [editMode, setEditMode] = useState(true);
  const [updateCount, setUpdateCount] = useState(1);
  const [errorMessage, setErrorMessage] = useState("");
  const [openModal, setOpenModal] = useState<boolean>(false);

  const getFirstProduct = products[0];
  const productsPriceDict = Object.fromEntries(products.map(x => [x.productId, x.price]));
  const productsNameDict = Object.fromEntries(products.map(x => [x.productId, x.name]));
  useEffect(() => {
    refreshItemsFromServer(orderId);
  }, []);

  useEffect(() => {
    setUpdateCount(updateCount + 1);
  }, [items]);

  useEffect(() => {
    if (order.lock) {
      setEditMode(false);
    } else {
      setEditMode(true);
    }
  }, [order.lock]);

  const refreshItemsFromServer = (orderId: number) => {
    fetchItems(orderId).then(data => {
      setItems(data);
      setOriginalItems(JSON.parse(JSON.stringify(data)));
    });
    fetchOrder(orderId).then(data => {
      setOrder(data);
    });
  };
  const refreshOrderFromServer = (orderId: number) => {
    fetchOrder(orderId).then(data => {
      setOrder({ ...order, lock: data.lock });
    });
  };
  const addEmptyItem = () => {
    let itemsTemp = [
      ...items,
      {
        itemId: -Math.floor(Math.random() * 1000 + 1),
        productId: getFirstProduct.productId,
        price: getFirstProduct.price,
        overridePrice: getFirstProduct.price,
        quantity: 1,
        orderId: orderId,
      },
    ];
    setUpdateCount(updateCount + 1);
    setItems(itemsTemp);
  };
  const removeItem = (itemId: number) => {
    const tempItems = items.filter(item => item.itemId !== itemId);
    setItems(tempItems);
    setUpdateCount(updateCount + 1);
    // if the item has a positive ID (on the server), we need to add it to the itemsRemoved array
    if (itemId > 0) {
      setItemsRemoved([...itemsRemoved, itemId]);
    }
  };
  const updateValue = (property: string, itemId: number, value: number, isCurrent: boolean) => {
    let tempItems = items;
    if (!isCurrent) {
      tempItems = serverItemsDelta;
    }
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
    if (isCurrent) {
      setItems(tempItems);
    } else {
      setServerItemsDelta(tempItems);
    }

    setUpdateCount(updateCount + 1);
  };

  const lockOrder = (toLock: boolean) => {
    lockOrderServer(order, toLock).then(response => {
      setErrorMessage(response);
      refreshOrderFromServer(orderId);
    });
  };
  const updateOrder = () => {
    // let response = updateOrderServer(items, order, itemsRemoved);
    updateOrderServer(items, order, itemsRemoved, false, [], originalItems).then(response => {
      if (response?.error) {
        setErrorMessage(response.error);
        if (response?.orderLocked) {
          fetchOrder(orderId).then(data => {
            setOrder(data);
          });
        }
      } else {
        refreshItemsFromServer(orderId);
        setErrorMessage("Successfully updated order");
      }

      if (response.currentChange && response.currentChange.length !== 0) {
        setOpenModal(true);
      }
      setCurrentItemsDelta(returnDelta(response.currentChange, response.serverChange));
      setServerItemsDelta(returnDelta(response.serverChange, []));
      setServerItemsRemoved(itemsRemovedDelta(response.serverChange));
    });
  };

  const updateOrderWithDelta = (
    updatedItems: Array<ItemType>,
    deltaItemsToRemove: Array<ItemType>,
    keepCurrentDelta: boolean
  ) => {
    // we must remove items from the other delta
    // finds new items added to deltaItemsToRemove compared to originalItems and gets their ids
    let itemsToRemove = deltaItemsToRemove.filter(
      x => !originalItems.map(y => y.itemId).includes(x.itemId)
    );
    let itemsToRemoveIds = itemsToRemove.map(x => x.itemId);
    // if we are keeping our changes, we also want to preserve items removed.
    if (keepCurrentDelta) {
      itemsToRemoveIds = [...itemsRemoved, ...itemsToRemoveIds];
    }

    updateOrderServer(
      updatedItems,
      order,
      itemsToRemoveIds,
      true,
      serverItemsDelta,
      originalItems
    ).then(response => {
      if (response?.error) {
        setErrorMessage(response.error);
        setServerItemsDelta(returnDelta(response.serverChange, []));
        setUpdateCount(updateCount + 1);
      } else {
        setErrorMessage("");
        setCurrentItemsDelta(returnDelta(response.currentChange, response.serverChange));
        setServerItemsDelta(returnDelta(response.serverChange, []));
        setOpenModal(false);
        refreshItemsFromServer(orderId);
      }
    });
  };

  const returnDelta = (itemsIn: Array<ItemType>, serverChanges: Array<ItemType>) => {
    // return the delta between the original items and the items we are looking at (current/server)
    // original items are items that were in the order when we started editing

    let delta: Array<ItemType> = [];
    for (let i = 0; i < itemsIn.length; i++) {
      let found = false;
      for (let j = 0; j < originalItems.length; j++) {
        if (itemsIn[i].itemId == originalItems[j].itemId) {
          found = true;

          if (
            itemsIn[i].productId != originalItems[j].productId ||
            itemsIn[i].quantity != originalItems[j].quantity ||
            itemsIn[i].overridePrice != originalItems[j].overridePrice
          ) {
            delta.push(itemsIn[i]);
          }
        }
      }
      if (!found) {
        delta.push(itemsIn[i]);
      }
    }
    // we need to add the items back that were removed from the server
    // we need to update the IDs to being negative so we create copies of the items
    if (serverChanges.length !== 0) {
      let itemsThatWereRemoved = originalItems.filter(
        x => !serverChanges.map(y => y.itemId).includes(x.itemId)
      );
      let itemsTemp: Array<ItemType> = [];
      itemsThatWereRemoved.forEach(function (part, index, theArray) {
        // check if the item was also removed by the user
        if (itemsRemoved.includes(part.itemId)) {
          return;
        }
        // check if part was edited by the user:
        if (delta.findIndex(x => x.itemId === part.itemId) !== -1) {
          return;
        }

        itemsTemp.push({
          itemId: -part.itemId,
          productId: part.productId,
          overridePrice: part.overridePrice,
          quantity: part.quantity,
          orderId: part.orderId,
        });
      });
      delta.push(...itemsTemp);
    }

    return delta;
  };
  const itemsRemovedDelta = (itemsIn: Array<ItemType>) => {
    // return the delta between the original items and the items we are looking at (current/server)
    // original items are items that were in the order when we started editing

    //return items that are in originalItems but not in itemsIn
    let delta = [];
    for (let i = 0; i < originalItems.length; i++) {
      let found = false;
      for (let j = 0; j < itemsIn.length; j++) {
        if (originalItems[i].itemId == itemsIn[j].itemId) {
          found = true;
        }
      }
      if (!found) {
        delta.push(originalItems[i]);
      }
    }

    return delta;
  };
  const getOriginalValue = (itemId: number, property: string, currentValue: string | number) => {
    // get the value of the property for the item with itemId in the originalItems array
    var index = originalItems.findIndex(obj => {
      return obj.itemId === itemId;
    });
    if (index !== -1) {
      if (originalItems[index][property as keyof ItemType] === currentValue) {
        return null;
      } else {
        return originalItems[index][property as keyof ItemType];
      }
    } else {
      // these are for items that were removed since editing started
      var indexRemoved = originalItems.findIndex(obj => {
        return obj.itemId === -itemId;
      });
      if (indexRemoved !== -1) {
        return "Removed recently";
      } else {
        return "new ";
      }
    }
  };

  return (
    <>
      <header className="flex justify-between items-center mb-4">
        <h1 className="text-2xl">
          {order?.token} Order {orderId} - {(order?.lastUpdated + "").substr(0, 10)}
        </h1>
        <div>
          <IconButton onClick={() => updateOrder()}>
            <SaveAs /> Save
          </IconButton>
          <IconButton className="mx-5" disabled={order.lock} onClick={() => setEditMode(!editMode)}>
            <Edit /> Edit
          </IconButton>
          {!order.lock && (
            <IconButton disabled={order.lock} onClick={() => lockOrder(true)}>
              <Lock />
              Lock
            </IconButton>
          )}
          {order.lock && (
            <IconButton
              hidden={!order.lock}
              disabled={!order.lock}
              onClick={() => lockOrder(false)}
            >
              <LockOpen />
              Unlock
            </IconButton>
          )}
        </div>
      </header>

      <p>{errorMessage}</p>

      <Modal
        aria-labelledby="close-modal-title"
        open={openModal}
        onClose={(_event: React.MouseEvent<HTMLButtonElement>, reason: string) => {
          // alert(`Reason: ${reason}`);
          setOpenModal(false);
        }}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Sheet
          variant="outlined"
          sx={{
            minWidth: 300,
            borderRadius: "md",
            p: 3,
          }}
        >
          <ModalClose variant="outlined" />
          <Typography
            component="h2"
            id="close-modal-title"
            level="h4"
            textColor="inherit"
            fontWeight="lg"
          >
            Select changes to keep
            <div className="grid  grid-cols-2">
              <div style={{ borderRight: "1px solid black", paddingRight: 20 }}>
                <Button
                  onClick={() => updateOrderWithDelta(currentItemsDelta, serverItemsDelta, true)}
                >
                  Override with your changes
                </Button>
                <ItemDeltaTable
                  title="Your changes"
                  items={currentItemsDelta}
                  editMode={editMode}
                  deltaMode={true}
                  updateCount={updateCount}
                  removeItem={removeItem}
                  productsNameDict={productsNameDict}
                  productsPriceDict={productsPriceDict}
                  getOriginalValue={getOriginalValue}
                  updateValue={updateValue}
                  products={products}
                  isCurrent={true}
                />
              </div>

              <div style={{ paddingLeft: 20 }}>
                <Button
                  onClick={() => updateOrderWithDelta(serverItemsDelta, currentItemsDelta, false)}
                >
                  Keep server changes
                </Button>
                <ItemDeltaTable
                  title="Server changes"
                  items={serverItemsDelta}
                  editMode={editMode}
                  deltaMode={true}
                  updateCount={updateCount}
                  removeItem={removeItem}
                  productsNameDict={productsNameDict}
                  productsPriceDict={productsPriceDict}
                  getOriginalValue={getOriginalValue}
                  updateValue={updateValue}
                  products={products}
                  isCurrent={false}
                />
                <ItemDeltaTable
                  title="Items removed from server"
                  items={serverItemsRemoved}
                  editMode={false}
                  deltaMode={true}
                  updateCount={updateCount}
                  removeItem={removeItem}
                  productsNameDict={productsNameDict}
                  productsPriceDict={productsPriceDict}
                  getOriginalValue={getOriginalValue}
                  updateValue={updateValue}
                  products={products}
                  isCurrent={false}
                />
              </div>
            </div>
          </Typography>
        </Sheet>
      </Modal>

      <ItemTable
        title="Item List"
        items={items}
        editMode={editMode}
        updateCount={updateCount}
        removeItem={removeItem}
        productsPriceDict={productsPriceDict}
        updateValue={updateValue}
        products={products}
        isCurrent={true}
      />
      {editMode && <Button onClick={() => addEmptyItem()}>Add</Button>}
    </>
  );
}
