"use client";
import { StoreContext } from "@/contexts/StoreContext";
import { isUserLoggedIn } from "@/functions/credentials";

import { userCartProductType } from "@/stores/specificTypes/userCartProductType";

import { Image } from "@nextui-org/react";
import { observer } from "mobx-react-lite";
import { Link } from "@/navigation";
import React, { useContext, useEffect, useState } from "react";
import { MdDelete } from "react-icons/md";
import LoadingOverlay from "./LoadingOverlay";
import { useLocale, useTranslations } from "next-intl";

interface CartSidebarProductProps {
  product: userCartProductType;
}

const CartSidebarProduct = ({ product }: CartSidebarProductProps) => {
  const [counter, setCounter] = useState(product.quantity);
  const [isLoading, setIsLoading] = useState(false);

  const { cart, user } = useContext(StoreContext);
  const locale = useLocale();
  const currency = useTranslations("currency");

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
    <div className="relative">
      {isLoading && <LoadingOverlay />}

      <div className=" grid grid-cols-[2fr_3fr_1fr] gap-5">
        <Link
          href={`/product/${product.id}`}
          className="w-full h-auto grid place-items-center overflow-hidden"
        >
          <Image
            src={product.imgSrc}
            alt=""
            className="w-full  aspect-square  grid place-items-center overflow-hidden "
            classNames={{ img: "w-full h-full  object-contain" }}
          />
        </Link>

        {/* <Link
            href={`/product/${product.id}`}
            className="w-full grid place-items-center overflow-hidden"
          >
           
            <Image
              //   as={NextImage}
              src={`${process.env.NEXT_PUBLIC_HOST}${product.attributes?.thumbnail?.data.attributes.url}`}
              radius="sm"
              //   quality={100}
              alt="product image"
              className="w-full  aspect-square  grid place-items-center overflow-hidden "
              classNames={{
                img: "w-full   h-full  object-contain justify-self-center",
              }}
            />
          </Link> */}

        <div className="flex flex-col justify-between items-start gap-2 w-full overflow-hidden ">
          <Link href={`/product/${product.id}`}>
            <h1 className="text-sm lmob:text-lg w-full   line-clamp-2">
              {locale === "en" ? product.title : product.localizatons.title}
            </h1>
          </Link>
          <div className="flex items-center" dir="ltr">
            <button
              className="p-[.125rem] px-1 lmob:p-1 lmob:px-2 border-solid border-1 border-mainBlack/50 rounded-l-full"
              onClick={increase}
            >
              +
            </button>
            <h1 className="p-[.125rem] px-1 lmob:p-1 lmob:px-2 border-solid border-1 border-mainBlack/50 border-x-0 ">
              {counter}
            </h1>
            <button
              className="p-[.125rem] px-1 lmob:p-1 lmob:px-2 border-solid border-1 border-mainBlack/50 rounded-r-full"
              onClick={decrease}
            >
              -
            </button>
          </div>
        </div>
        <div className="flex flex-col justify-between items-end">
          <MdDelete
            className="text-2xl transition-all text-red-500 hover:text-red-700 cursor-pointer"
            onClick={deleteItem}
          />
          <h1 className="text-green-500 font-bold text-sm lmob:text-lg">
            {product.price}
            <span className="text-sm ltr:ml-1 rtl:mr-1">
              {currency("currency")}
            </span>
          </h1>
        </div>
      </div>
    </div>
  );
};

export default observer(CartSidebarProduct);
