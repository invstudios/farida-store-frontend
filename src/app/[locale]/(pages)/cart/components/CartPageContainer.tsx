"use client";
import React, { useContext } from "react";

import { StoreContext } from "@/contexts/StoreContext";
import { observer } from "mobx-react-lite";
import EmptyCart from "./EmptyCart";
import CartContent from "./CartContent";
import { useLocale } from "next-intl";

interface CartPageContainerProps {
  // Define your props here
}

const CartPageContainer = ({}: CartPageContainerProps) => {
  const { cart } = useContext(StoreContext);
  const locale = useLocale();
  return (
    <div dir={locale === "en" ? "ltr" : "rtl"}>
      {cart.productsCount === 0 ? <EmptyCart /> : <CartContent />}
    </div>
  );
};

export default observer(CartPageContainer);
