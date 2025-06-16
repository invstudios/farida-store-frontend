"use client";
import { StoreContext } from "@/contexts/StoreContext";
import { useAuth } from "@/hooks/useAuth";

import { cartProductType } from "@/stores/specificTypes/cartProductType";
import { strapiProductType } from "@/stores/specificTypes/strapiProductType";

import { Button, Spinner } from "@nextui-org/react";
import { observer } from "mobx-react-lite";
import React, { useContext, useMemo, useState } from "react";

import { FaCheck } from "react-icons/fa";
import { FaCartPlus } from "react-icons/fa6";
import { MdOutlineRemoveShoppingCart } from "react-icons/md";

import { useScreenSize } from "react-screen-size-helper";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

interface AddToCartButtonProps {
  product: strapiProductType;
}

const AddToCartButton = ({ product }: AddToCartButtonProps) => {
  const { cart, user, products, cartSidebar, sidebar, searchBox } =
    useContext(StoreContext);
  const { isLoggedIn } = useAuth();
  const { currentWidth } = useScreenSize({});
  const t = useTranslations("productPage");

  // const [foundInCart, setFoundInCart] = useState<cartProductType | undefined>();
  const [addingToUserCartLoading, setAddingToUserCartLoading] = useState(false);

  const addProductToCart = () => {
    // Check if product data is valid
    if (!product || !product.attributes) {
      console.error("Product data is missing or invalid");
      return;
    }

    // Check if product is available in stock
    if (!isProductAvailable()) {
      console.log("Product is not available in stock");
      return;
    }

    if (isLoggedIn) {
      if (!foundInCart) {
        setAddingToUserCartLoading(true);
        user
          .addProductToUserCart(product.id, 1)
          .then(() => {
            cart.setProductsCount = cart.productsCount + 1;
            setAddingToUserCartLoading(false);
          })
          .catch((err) => {
            console.log(err);
            setAddingToUserCartLoading(false);
          });
      }
    } else {
      setAddingToUserCartLoading(true);

      // Safe access to thumbnail
      const thumbnailUrl = product.attributes.thumbnail?.data?.attributes?.url || '';
      const imgSrc = thumbnailUrl ? `${process.env.NEXT_PUBLIC_HOST}${thumbnailUrl}` : '';

      const parsedProductToCartProduct: cartProductType = {
        id: product.id,
        imgSrc: imgSrc,
        title: product.attributes.title || 'Unknown Product',
        slug: product.attributes.slug || '',
        description: product.attributes.description || '',
        prePrice: getPriceAfterDiscount()
          ? Number(getSafePrice().toFixed(2))
          : 0,
        price:
          getPriceAfterDiscount() ??
          Number(getSafePrice().toFixed(2)),
        quantity: 1,
        localizatons: {
          title: product.attributes.localizations?.data?.[0]?.attributes?.title || product.attributes.title || 'Unknown Product',
          description:
            product.attributes.localizations?.data?.[0]?.attributes?.description || product.attributes.description || '',
          slug: product.attributes.localizations?.data?.[0]?.attributes?.slug || product.attributes.slug || '',
        },
      };
      console.log("parsedProductToCartProduct : ",parsedProductToCartProduct);
      cart.addProduct(parsedProductToCartProduct);
      setAddingToUserCartLoading(false);
    }
  };

  const getPriceAfterDiscount = () => {
    return products.getPriceAfterDiscount(
      product.attributes.discount?.data,
      product.attributes.price
    );
  };

  const getSafePrice = () => {
    const price = product.attributes.price;
    return typeof price === 'number' && !isNaN(price) ? price : 0;
  };

  const isProductAvailable = () => {
    const stock = product?.attributes?.product_inventory?.data?.attributes?.available_in_stock;
    return stock != null && stock > 0;
  };

  const foundInCart = useMemo(() => {
    if (isLoggedIn) {
      return cart.isInUserCart(product.id);
    } else {
      return cart.isInCart(product.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cart.totalPrice, product.id]);

  return (
    <motion.div
      initial={{ y: 0, x: 0 }}
      animate={{
        x:
          (cartSidebar.showCartSideBar ||
            sidebar.showSideBar ||
            searchBox.showSearchBox) &&
          currentWidth < 768
            ? 500
            : 0,
      }}
      transition={{
        delay: 0.5,
      }}
      className="fixed bottom-36 right-5 md:bottom-0 md:left-0 z-50 w-auto md:w-full"
    >
      <Button
        className={` py-2 ${
          !isProductAvailable()
            ? `bg-gray-400 cursor-not-allowed`
            : foundInCart
            ? `bg-emerald-500`
            : `bg-mainPink`
        } text-mainWhite  w-full capitalize transition-all ${
          !isProductAvailable() ? '' : 'hover:bg-mainPink/90'
        } text-2xl md:text-xl`}
        endContent={
          addingToUserCartLoading ? (
            <Spinner
              size="sm"
              classNames={{
                circle1: "border-l-mainWhite border-b-mainWhite",
                circle2: "border-mainWhite",
              }}
            />
          ) : !isProductAvailable() ? (
            <MdOutlineRemoveShoppingCart />
          ) : foundInCart ? (
            <FaCheck />
          ) : (
            <FaCartPlus />
          )
        }
        size="lg"
        // isLoading={addingToUserCartLoading}
        isDisabled={!!foundInCart || !isProductAvailable()}
        disableAnimation
        disableRipple
        onClick={addProductToCart}
        radius={currentWidth < 768 ? "full" : "none"}
        isIconOnly={currentWidth < 768 ? true : false}
      >
        {currentWidth < 768
          ? ""
          : !isProductAvailable()
          ? t("details.outStock")
          : foundInCart
          ? t("addedToCart")
          : t("addToCart")}
      </Button>
    </motion.div>
  );
};

export default observer(AddToCartButton);
