"use client";
import React, { useContext, useEffect } from "react";
import OrderCard from "./OrderCard";
import { observer } from "mobx-react-lite";
import { StoreContext } from "@/contexts/StoreContext";

const OrderCardsContainer = () => {
  const { user, userOrders } = useContext(StoreContext);

  useEffect(() => {
    userOrders.getUserOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-20 px-5 md:px-10 lg:px-20">
      {userOrders.userOrders.map((order) => (
        <OrderCard
          key={order.id}
          totalPrice={order.total}
          orderNumber={order.id}
          orderedOn={order.createdAt}
          arrivedOn={order.arrivedAt}
          orderItemsCount={order.order_items.length}
        />
      ))}
    </div>
  );
};

export default observer(OrderCardsContainer);
