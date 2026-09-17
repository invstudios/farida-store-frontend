"use client";
import { StoreContext } from "@/contexts/StoreContext";
import { observer } from "mobx-react-lite";
import React, { useContext } from "react";
import CartTableProduct from "./CartTableProduct";
import CartTableHeader from "./CartTableHeader";
import { Divider } from "@nextui-org/react";
import LoadingOverlay from "@/components/LoadingOverlay";
import { useAuth } from "@/hooks/useAuth";

const ProductsTable2 = () => {
  const { cart, user } = useContext(StoreContext);
  const { isLoggedIn } = useAuth();

  return (
    <div className="relative flex flex-col gap-5  pt-4">
      <CartTableHeader />

      {isLoggedIn
        ? cart.userCartItems.map((item) => (
            <div key={item.id} className="flex flex-col gap-2">
              <CartTableProduct product={item} />
              <Divider />
            </div>
          ))
        : cart.cartProducts.map((item) => (
            <div key={item.id} className="flex flex-col gap-2">
              <CartTableProduct product={{ ...item, cartItemId: item.id }} />
              <Divider />
            </div>
          ))}

      {user.isMergingOrRemovingLoading && <LoadingOverlay />}
    </div>
  );
};

export default observer(ProductsTable2);
