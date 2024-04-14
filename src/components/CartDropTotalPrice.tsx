"use client";
import { StoreContext } from "@/contexts/StoreContext";
import { Button } from "@nextui-org/react";
import { observer } from "mobx-react-lite";
import { useTranslations } from "next-intl";

import { useRouter } from "@/navigation";
import React, { useContext } from "react";

const CartDropTotalPrice = () => {
  const router = useRouter();
  const { cart } = useContext(StoreContext);
  const t = useTranslations("cartDrop");
  const currency = useTranslations("currency");

  const goToCartPage = () => {
    router.push("/cart");
  };
  const goToShippingSection = () => {
    router.push("/cart/shipping");
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl capitalize">{t("total")} :</h1>
        <h1 className="text-xl font-bold text-emerald-500">
          {cart.totalPrice.toFixed(2)}
          <span className="text-sm ml-1">{currency("currency")} </span>
        </h1>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Button
          radius="sm"
          className="bg-mainBlack capitalize text-mainWhite text-lg"
          onClick={goToCartPage}
        >
          {t("go")}
        </Button>
        <Button
          radius="sm"
          className="bg-mainPink capitalize text-mainWhite text-lg"
          onClick={goToShippingSection}
        >
          {t("complete")}
        </Button>
      </div>
    </div>
  );
};

export default observer(CartDropTotalPrice);
