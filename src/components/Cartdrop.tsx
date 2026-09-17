"use client";

import { Link } from "@/navigation";
import React, { useContext, useState } from "react";
import { observer } from "mobx-react-lite";
import { motion } from "framer-motion";
import { StoreContext } from "@/contexts/StoreContext";
import EmptyCartDrop from "./EmptyCartDrop";
import CartDropProductsMenu from "./CartDropProductsMenu";
import CartDropTotalPrice from "./CartDropTotalPrice";
import { Divider } from "@nextui-org/react";
import LoadingOverlay from "./LoadingOverlay";
import ConfirmMergeCart from "./ConfirmMergeCart";
import { useLocale, useTranslations } from "next-intl";
import { useAuth } from "@/hooks/useAuth";

const CartDrop2 = () => {
  const { cart, user, cartSidebar } = useContext(StoreContext);
  const { isLoggedIn } = useAuth();

  const locale = useLocale();
  const t = useTranslations("cartDrop");

  return (
    <motion.div
      initial={{ scaleY: 0, opacity: 0 }}
      animate={{
        scaleY: cart.isCartMenuDisplayed ? 1 : 0,
        opacity: cart.isCartMenuDisplayed ? 1 : 0,
      }}
      className={`origin-top  bg-white min-w-[25rem]  w-[25rem] max-w-[25rem] h-auto p-5 hidden md:block  text-mainBlack absolute top-20 ${
        locale === "en" ? "right-0" : "left-0"
      } z-[100] border-1 border-solid border-mainBlack border-t-0`}
      dir={locale === "en" ? "ltr" : "rtl"}
    >
      <div className="flex flex-col gap-5 relative">
        {user.isMergingOrRemovingLoading && <LoadingOverlay />}
        <h1 className="text-xl capitalize">
          {t("cart")}({cart.productsCount}){" "}
        </h1>

        {cart.productsCount === 0 ? (
          <EmptyCartDrop />
        ) : (
          <CartDropProductsMenu />
        )}

        {cart.productsCount > 0 && (
          <>
            <Divider />
            {isLoggedIn &&
              cartSidebar.isLocalCartHasItems &&
              !user.isMergingOrRemovingLoading && <ConfirmMergeCart />}
            <CartDropTotalPrice />
          </>
        )}
      </div>
    </motion.div>
  );
};

export default observer(CartDrop2);
