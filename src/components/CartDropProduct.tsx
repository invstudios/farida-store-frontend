/* eslint-disable @next/next/no-img-element */
"use client";

import { StoreContext } from "@/contexts/StoreContext";
import { cartProductType } from "@/stores/specificTypes/cartProductType";

import { Image } from "@nextui-org/react";
import { observer } from "mobx-react-lite";
import React, { useContext, useEffect, useState } from "react";
import { CgClose } from "react-icons/cg";
import LoadingOverlay from "./LoadingOverlay";
import { isUserLoggedIn } from "@/functions/credentials";
import { userCartProductType } from "@/stores/specificTypes/userCartProductType";
import { useLocale, useTranslations } from "next-intl";

interface cartDropProductProps {
  product: userCartProductType;
}

const CartDropProduct = ({ product }: cartDropProductProps) => {
  const [counter, setCounter] = useState(product.quantity);
  const [isLoading, setIsLoading] = useState(false);
  const locale = useLocale();
  const currency = useTranslations("currency");

  const { cart, user } = useContext(StoreContext);

  const increase = () => {
    setCounter((c) => Number(c) + 1);

    if (isUserLoggedIn()) {
      setIsLoading(true);
      user
        .updateUserCartProductQuantity(product.cartItemId, Number(counter) + 1)
        .then(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(true);
      cart.changeQuantity(product.id, Number(counter) + 1);
      setIsLoading(false);
    }

    cart.setProductsCount = cart.productsCount + 1;
  };

  const decrease = () => {
    if (counter > 1) {
      setCounter((c) => c - 1);
      if (isUserLoggedIn()) {
        setIsLoading(true);
        user
          .updateUserCartProductQuantity(product.cartItemId, counter - 1)
          .then(() => {
            setIsLoading(false);
          });
      } else {
        setIsLoading(true);
        cart.changeQuantity(product.id, counter - 1);
        setIsLoading(false);
      }
    } else {
      return;
    }

    cart.setProductsCount = cart.productsCount + 1;
  };

  const deleteItem = () => {
    if (isUserLoggedIn()) {
      setIsLoading(true);
      user.removeProductFromUserCart(product.cartItemId).then(() => {
        setIsLoading(false);
        cart.setProductsCount = cart.productsCount - 1;
      });
    } else {
      setIsLoading(true);
      cart.deleteProduct(product.id);
      setIsLoading(false);
      cart.setProductsCount = cart.productsCount - 1;
    }
  };

  useEffect(() => {
    setCounter(product.quantity);
  }, [product.quantity]);

  return (
    <div className="relative ">
      {isLoading && <LoadingOverlay />}
      <div className="grid grid-cols-[1fr_2.5fr]  gap-3  px-3">
        <div className="w-full aspect-square">
          <img
            src={product.imgSrc}
            alt=""
            className="w-full h-full object-contain"
          />
        </div>
        <div className="grid grid-rows-2">
          <div className="grid grid-cols-[auto_auto] gap-1  overflow-hidden">
            <h1 className="text-lg capitalize  line-clamp-2 ">
              {locale === "en" ? product.title : product.localizatons.title}
            </h1>
            <CgClose
              className="text-2xl cursor-pointer justify-self-end"
              onClick={deleteItem}
            />
            {/* <h1 className="text-lg text-mainPink font-bold">
            {product.price}
            <span className="text-sm ml-1">EGP</span>
          </h1> */}
          </div>
          <div className="grid grid-cols-2 items-end justify-between h-full   ">
            <div className="flex items-center justify-between">
              <div key={"counter"} className="flex items-center">
                <button
                  className="p-1 text-lg border-mainBlack border-1 border-solid "
                  onClick={increase}
                >
                  +
                </button>
                <h1 className="text-lg p-1 px-2 border-y-1 border-mainBlack border-solid">
                  {counter}
                </h1>
                <button
                  className="p-1 text-lg border-mainBlack border-1 border-solid "
                  onClick={decrease}
                >
                  -
                </button>
              </div>
            </div>
            {/* <h1 className="text-xl font-bold text-emerald-500">
            {" "}
            {(product.price * product.quantity).toFixed(2)}
            <span className="text-sm ml-1">EGP</span>
          </h1> */}
            <h1 className="text-xl font-bold text-emerald-500 justify-self-end">
              {product.price}
              <span className="text-sm ltr:ml-1 rtl:mr-1">
                {currency("currency")}
              </span>
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default observer(CartDropProduct);
