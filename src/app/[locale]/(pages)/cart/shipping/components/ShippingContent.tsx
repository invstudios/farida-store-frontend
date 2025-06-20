"use client";
import { Divider, Input } from "@nextui-org/react";
import React, { useContext } from "react";
import ShippingForm from "./ShippingForm";
import ShippingOrderAndPrice from "./ShippingOrderAndPrice";
import { StoreContext } from "@/contexts/StoreContext";
import EmptyCart from "../../components/EmptyCart";
import { observer } from "mobx-react-lite";
import LoadingOverlay from "@/components/LoadingOverlay";
import { useScreenSize } from "react-screen-size-helper";
import { useLocale } from "next-intl";

const ShippingContent = () => {
  const { cart, userOrders } = useContext(StoreContext);
  const { currentWidth } = useScreenSize({});
  const locale = useLocale();
  return (
    <div className="relative" dir={locale === "en" ? "ltr" : "rtl"}>
      {userOrders.isCreatingOrderLoading && <LoadingOverlay />}
      {cart.productsCount > 0 ? (
        <div className="px-5 md:px-9 lg:px-20">

          <div className="grid grid-rows-[auto_auto_auto] grid-cols-1 lg:grid-rows-1 lg:grid-cols-[3fr_auto_1.5fr] gap-5">
            <ShippingForm />
            <Divider
              orientation={currentWidth > 1024 ? "vertical" : "horizontal"}
            />
            <ShippingOrderAndPrice />
          </div>
        </div>
      ) : (
        <EmptyCart />
      )}
    </div>
  );
};

export default observer(ShippingContent);
