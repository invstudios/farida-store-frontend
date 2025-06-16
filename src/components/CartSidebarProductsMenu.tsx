"use client";
import React, { useContext, useEffect, useState } from "react";
import CartSidebarProduct from "./CartSidebarProduct";
import { Divider } from "@nextui-org/react";
import { StoreContext } from "@/contexts/StoreContext";
import { observer } from "mobx-react-lite";
import Cookies from "js-cookie";
import { useAuth } from "@/hooks/useAuth";

const CartSidebarProductsMenu = () => {
  const { cart, user, loginForm, registerForm, cartSidebar } =
    useContext(StoreContext);
  const { isLoggedIn, isLoading } = useAuth();
  const [uiCondition, setUiCondition] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      setUiCondition(isLoggedIn);
    }
  }, [
    isLoggedIn,
    isLoading,
    user.isLoading,
    loginForm.isLoading,
    registerForm.isLoading,
    user.isMergingOrRemovingLoading,
  ]);

  return (
    <div className="flex flex-col  gap-3 p-5 overflow-auto h-full w-full">
      {uiCondition
        ? cart.userCartItems.map((product) => (
            <div key={product.id} className="flex flex-col gap-3">
              <CartSidebarProduct product={product} />

              <Divider />
            </div>
          ))
        : cart.cartProducts.map((product) => (
            <div key={product.id} className="flex flex-col gap-3">
              <CartSidebarProduct
                product={{ ...product, cartItemId: product.id }}
              />

              <Divider />
            </div>
          ))}
    </div>
  );
};

export default observer(CartSidebarProductsMenu);
