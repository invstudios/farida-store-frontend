"use client";
import React, { useContext } from "react";
import { Divider } from "@nextui-org/react";
import TotalPrice from "./TotalPrice";
import CartFooter from "./CartFooter";
import { StoreContext } from "@/contexts/StoreContext";
import { observer } from "mobx-react-lite";

import ProductsTable2 from "./ProductsTable2";
import ConfirmMergeCart from "@/components/ConfirmMergeCart";
import { useScreenSize } from "react-screen-size-helper";
import { useAuth } from "@/hooks/useAuth";

const CartContent = () => {
  const { cartSidebar, user } = useContext(StoreContext);
  const { isLargeDesktop } = useScreenSize({});
  const { isLoggedIn } = useAuth();

  return (
    <div className="grid grid-cols-1 grid-rows-[auto_auto_auto] gap-y-10 gap-x-5 lg:grid-cols-[3fr_auto_1fr] lg:grid-rows-1 px-5 md:px-9 lg:px-20 ">
      <div className="flex flex-col gap-2">
        <ProductsTable2 />

        <CartFooter />
      </div>

      <Divider orientation={isLargeDesktop ? "vertical" : "horizontal"} />
      <div className="flex w-full flex-col items-start gap-5 ">
        <TotalPrice />
        {isLoggedIn &&
          cartSidebar.isLocalCartHasItems &&
          !user.isMergingOrRemovingLoading && <ConfirmMergeCart />}
      </div>
    </div>
  );
};

export default observer(CartContent);
