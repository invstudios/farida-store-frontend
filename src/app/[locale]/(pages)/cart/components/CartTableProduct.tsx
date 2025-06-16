"use client";
import React, { useContext, useState } from "react";
import CartProductCard from "./CartProductCard";
import { userCartProductType } from "@/stores/specificTypes/userCartProductType";
import QuantityCounter from "./QuantityCounter";
import TotalSingleCartProductPrice from "./TotalSingleCartProductPrice";
import { MdDelete } from "react-icons/md";
import { StoreContext } from "@/contexts/StoreContext";
import { observer } from "mobx-react-lite";
import LoadingOverlay from "@/components/LoadingOverlay";
import { useScreenSize } from "react-screen-size-helper";
import { useLocale } from "next-intl";

interface cartTableProductProps {
  product: userCartProductType;
}

const CartTableProduct = ({ product }: cartTableProductProps) => {
  const { user, cart } = useContext(StoreContext);
  const [isLoading, setIsloading] = useState(false);
  const { isDesktop, isLargeDesktop, isMobile, isTablet, currentWidth } =
    useScreenSize({});

  const locale = useLocale();

  return (
    <div className="relative">
      {isLoading && <LoadingOverlay />}
      <div className="grid grid-cols-[5.5fr_1fr_1.5fr_1fr_.5fr] gap-3 items-center">
        <div className="col-span-4 lmob:col-span-3 md:col-span-1">
          <CartProductCard
            id={product.id}
            imageUrl={product.imgSrc}
            description={
              locale === "en"
                ? product.description
                : product.localizatons.description
            }
            title={locale === "en" ? product.title : product.localizatons.title}
          />
        </div>

        <h1 className="text-center text-xl hidden md:block ">
          {product.price}
        </h1>

        {currentWidth >= 768 && (
          <QuantityCounter settingLoading={setIsloading} product={product} />
        )}

        <h1 className="text-center text-xl hidden md:block">
          {(product.price * product.quantity).toFixed(2)}
        </h1>

        <div className="flex gap-x-5 col-span-5 items-center order-3 lmob:col-span-1 lmob:order-none md:hidden lmob:flex-col gap-2 justify-between smob:justify-center">
          <h1 className="text-center text-sm md:text-xl text-mainBlack/25 hidden smob:block md:hidden">
            {product.price}
          </h1>
          <QuantityCounter settingLoading={setIsloading} product={product} />
          <h1 className="text-center text-sm md:text-xl hidden smob:block md:hidden">
            {(Number(product.price) * Number(product.quantity)).toFixed(2)}{" "}
          </h1>

          <div className=" smob:hidden flex flex-col gap-2">
            <h1 className="text-center text-sm md:text-xl  text-mainBlack/25">
              {product.price}
            </h1>
            <h1 className="text-center text-sm md:text-xl  ">
              {(Number(product.price) * Number(product.quantity)).toFixed(2)}{" "}
            </h1>
          </div>
        </div>
        <MdDelete
          className="text-red-500 transition-all hover:text-red-700 text-xl md:text-3xl cursor-pointer"
          onClick={() => {
            setIsloading(true);
            user.removeProductFromUserCart(product.cartItemId).then(() => {
              cart.setProductsCount = cart.productsCount - 1;
              setIsloading(false);
            });
          }}
        />
      </div>
    </div>
  );
};

export default observer(CartTableProduct);
