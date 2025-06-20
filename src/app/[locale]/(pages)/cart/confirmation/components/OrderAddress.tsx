"use client";
import React, { useContext, useEffect, useState } from "react";
import InfoCard from "./InfoCard";
import { observer } from "mobx-react-lite";
import { StoreContext } from "@/contexts/StoreContext";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

const OrderAddress = () => {
  const { userOrders } = useContext(StoreContext);
  const t = useTranslations("confirmationPage");

  const information = [
    {
      title: t("orderAddress.state"),
      description: userOrders.orderDetails?.data?.attributes?.state,
    },
    {
      title: t("orderAddress.country"),
      description: userOrders.orderDetails?.data?.attributes?.country,
    },
    {
      title: t("orderAddress.city"),
      description: userOrders.orderDetails?.data?.attributes?.city,
    },
    {
      title: t("orderAddress.street"),
      description: userOrders.orderDetails?.data?.attributes?.street,
    },
    {
      title: t("orderAddress.postal"),
      description: userOrders.orderDetails?.data?.attributes?.postal_code,
    },
    {
      title: t("orderAddress.phone1"),
      description: userOrders.orderDetails?.data?.attributes?.phone,
    },
    {
      title: t("orderAddress.phone2"),
      description: userOrders.orderDetails?.data?.attributes?.second_phone,
    },
  ];

  return (
    <div className="border-1 border-mainBlack/25 border-solid px-10 py-3 capitalize">
      <h1 className="text-lg md:text-xl  text-center mb-2">
        {" "}
        {t("orderAddress.title")}
      </h1>
      <div className=" grid  grid-cols-1 lmob:grid-cols-2 gap-2 ">
        {information?.map(
          (info) =>
            info.description && (
              <InfoCard
                key={info.title}
                title={info.title}
                description={info.description?.toString() ?? ""}
              />
            )
        )}
      </div>
    </div>
  );
};

export default observer(OrderAddress);
