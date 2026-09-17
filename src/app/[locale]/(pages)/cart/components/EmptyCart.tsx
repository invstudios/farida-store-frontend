"use client";
import { FaBagShopping } from "react-icons/fa6";
import React, { useContext } from "react";
import { useRouter } from "@/navigation";
import ConfirmMergeCart from "@/components/ConfirmMergeCart";
import { StoreContext } from "@/contexts/StoreContext";
import { observer } from "mobx-react-lite";
import { useTranslations } from "next-intl";
import { useAuth } from "@/hooks/useAuth";

const EmptyCart = () => {
  const { cartSidebar, user } = useContext(StoreContext);
  const { isLoggedIn } = useAuth();
  const t = useTranslations("cartPage");
  const router = useRouter();

  const goToHomePage = () => {
    router.push("/");
  };

  return (
    <div className="relative">
      <div className="w-full h-auto flex flex-col gap-5 items-center mt-20">
        <div className="flex flex-col gap-5 items-center justify-center">
          <FaBagShopping className="text-7xl md:text-9xl text-mainBlack/10" />

          <h1 className="capitalize text-lg md:text-xl">
            {t("emptyCart.title")}{" "}
          </h1>
        </div>

        <button
          className="px-4 py-1 md:px-5 md:py-2 capitalize bg-transparent  text-mainBlack border-mainBlack border-2 border-solid transition-all hover:bg-mainBlack hover:text-mainWhite"
          onClick={goToHomePage}
        >
          {t("emptyCart.action")}
        </button>
      </div>

      {isLoggedIn &&
        cartSidebar.isLocalCartHasItems &&
        !user.isMergingOrRemovingLoading && (
          <div className="px-0 md:px-32">
            <ConfirmMergeCart />
          </div>
        )}
    </div>
  );
};

export default observer(EmptyCart);
