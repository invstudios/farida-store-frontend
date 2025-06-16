"use client";
import LoadingOverlay from "@/components/LoadingOverlay";
import { StoreContext } from "@/contexts/StoreContext";
import { isUserLoggedIn } from "@/functions/credentials";
import { cartProduct } from "@/stores/generalTypes";
import { observer } from "mobx-react-lite";
import React, { useContext, useEffect, useState } from "react";

interface quantityCounterProps {
  product: cartProduct;
  settingLoading: (val: React.SetStateAction<boolean>) => void;
}

const QuantityCounter = ({ product, settingLoading }: quantityCounterProps) => {
  const { cart, user } = useContext(StoreContext);

  const [counter, setCounter] = useState<number>(product.quantity);

  const increase = () => {
    setCounter((c) => Number(c) + 1);

    if (isUserLoggedIn()) {
      settingLoading(true);
      user
        .updateUserCartProductQuantity(product.cartItemId, Number(counter) + 1)
        .then(() => {
          settingLoading(false);
        });
    } else {
      settingLoading(true);
      cart.changeQuantity(product.id, Number(counter) + 1);
      settingLoading(false);
    }

    cart.setProductsCount = cart.productsCount + 1;
  };

  const decrease = () => {
    if (counter > 1) {
      setCounter((c) => c - 1);
      if (isUserLoggedIn()) {
        settingLoading(true);
        user
          .updateUserCartProductQuantity(product.cartItemId, counter - 1)
          .then(() => {
            settingLoading(false);
          });
      } else {
        settingLoading(true);
        cart.changeQuantity(product.id, counter - 1);
        settingLoading(false);
      }
    } else {
      return;
    }

    cart.setProductsCount = cart.productsCount + 1;
  };

  useEffect(() => {
    setCounter(product.quantity);
  }, [product.quantity]);

  return (
    <div className="relative " dir="ltr">
      <div className="flex items-center justify-center">
        <button
          className="border-mainBlack/10 border-1 border-solid text-sm md:text-lg px-2 py-1 md:px-3 md:py-2 rounded-l-full transition-all hover:bg-mainBlack/5"
          onClick={increase}
        >
          +
        </button>
        <h1 className="border-mainBlack/10 border-1 border-solid text-sm md:text-xl px-4 py-1 md:px-5 md:py-2">
          {counter}
        </h1>
        <button
          className="border-mainBlack/10 border-1 border-solid text-sm md:text-lg px-2 py-1 md:px-3 md:py-2 rounded-r-full transition-all hover:bg-mainBlack/5"
          onClick={decrease}
        >
          -
        </button>
      </div>
    </div>
  );
};

export default observer(QuantityCounter);
