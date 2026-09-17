"use client";
import { StoreContext } from "@/contexts/StoreContext";
import { Button, Divider } from "@nextui-org/react";
import { observer } from "mobx-react-lite";
import { useRouter } from "@/navigation";
import React, { useContext, useEffect, useState } from "react";
import ConfirmMergeCart from "./ConfirmMergeCart";
import { isUserLoggedIn } from "@/functions/credentials";
import { useTranslations } from "next-intl";
import { useAuth } from "@/hooks/useAuth";

const CartSidebarFooter = () => {
  const { cartSidebar, cart, user, loginForm, registerForm } =
    useContext(StoreContext);
  const { isLoggedIn } = useAuth();

  const router = useRouter();
  const t = useTranslations("cartSidebar");
  const currency = useTranslations("currency");

  const goToCartShippingPage = () => {
    router.push("/cart/shipping");
    cartSidebar.hideWholeCartSidebar();
  };

  useEffect(() => {
    if (isUserLoggedIn()) {
      cartSidebar.checkLocalCartHasItems();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    user.isLoading,
    loginForm.isLoading,
    registerForm.isLoading,
    user.isMergingOrRemovingLoading,
  ]);

  return (
    <div>
      <Divider />
      {isLoggedIn &&
        cartSidebar.isLocalCartHasItems &&
        !user.isMergingOrRemovingLoading && <ConfirmMergeCart />}
      <div className="p-5 flex flex-col gap-5">
        <div className="flex justify-between items-center capitalize ">
          <h1 className="text-lg lmob:text-xl">{t("total")} :</h1>
          <h1 className="text-green-500 font-bold text-lg lmob:text-xl">
            {cart.totalPrice.toFixed(2)}{" "}
            <span className="text-sm ltr:ml-1 rtl:mr-1">
              {currency("currency")}
            </span>
          </h1>
        </div>

        <Button
          radius="none"
          className="bg-mainBlack text-mainWhite capitalize"
          onClick={goToCartShippingPage}
        >
          {t("complete")}
        </Button>
      </div>
    </div>
  );
};

export default observer(CartSidebarFooter);
