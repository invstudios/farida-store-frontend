"use client";
import React, { useContext, useEffect } from "react";

import CompletedOrderedItem from "./CompletedOrderedItem";
import { observer } from "mobx-react-lite";
import { StoreContext } from "@/contexts/StoreContext";
import { useSearchParams } from "next/navigation";
import { useRouter } from "@/navigation";
import OrderItem from "../../../order/[id]/components/OrderItem";
import { useLocale, useTranslations } from "next-intl";

// import OrderItem from "@/app/(pages)/order/[id]/components/OrderItem";

const ItemsContainer = () => {
  const { userOrders } = useContext(StoreContext);
  const t = useTranslations("confirmationPage");
  const locale = useLocale();
  const searchParams = useSearchParams();
  const router = useRouter();

  const orderId = searchParams.get("order_number");

  useEffect(() => {
    if (orderId) {
      userOrders.getAllOrderItems(orderId ?? "");
    } else {
      router.push("/cart/shipping");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col gap-3">
      <h1 className="text-xl font-semibold capitalize text-center">
        {t("orderItems.title")}
      </h1>
      {userOrders?.orderItems?.data?.map((orderItem) => (
        // <CompletedOrderedItem
        //   key={orderItem.id}
        //   title={orderItem.attributes.product.data.attributes.title}
        //   description={orderItem.attributes.product.data.attributes.description}
        //   imgSrc={`${process.env.NEXT_PUBLIC_HOST}${orderItem.attributes.product.data.attributes?.thumbnail?.data.attributes.url}`}
        //   price={orderItem.attributes.product.data.attributes.price}
        //   quantity={orderItem.attributes.quantity}
        // />
        <OrderItem
          key={orderItem.id}
          id={orderItem.attributes.product.data?.id}
          title={
            locale === "en"
              ? orderItem.attributes.product.data?.attributes?.title
              : orderItem.attributes.product.data.attributes.localizations
                  .data[0].attributes.title
          }
          description={
            locale === "en"
              ? orderItem.attributes.product.data?.attributes?.description
              : orderItem.attributes.product.data.attributes.localizations
                  .data[0].attributes.description
          }
          imgsrc={
            orderItem.attributes.product.data?.attributes?.thumbnail?.data
              ?.attributes?.url
          }
          price={orderItem.attributes.product.data?.attributes?.price}
          quantity={orderItem.attributes?.quantity}
        />
      ))}
    </div>
  );
};

export default observer(ItemsContainer);
