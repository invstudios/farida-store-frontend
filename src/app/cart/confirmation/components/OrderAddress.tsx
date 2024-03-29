"use client";
import React, { useContext, useEffect, useState } from "react";
import InfoCard from "./InfoCard";
import { observer } from "mobx-react-lite";
import { StoreContext } from "@/contexts/StoreContext";
import { useSearchParams } from "next/navigation";

const OrderAddress = () => {
  const { userOrders } = useContext(StoreContext);

  const information = [
    {
      title: "state :",
      description: userOrders.orderDetails?.data?.attributes?.state,
    },
    {
      title: "country  :",
      description: userOrders.orderDetails?.data?.attributes?.country,
    },
    {
      title: "city:",
      description: userOrders.orderDetails?.data?.attributes?.city,
    },
    {
      title: "street  :",
      description: userOrders.orderDetails?.data?.attributes?.street,
    },
    {
      title: "postal code :",
      description: userOrders.orderDetails?.data?.attributes?.postal_code,
    },
    {
      title: "phone :",
      description: userOrders.orderDetails?.data?.attributes?.phone,
    },
    {
      title: "second phone :",
      description: userOrders.orderDetails?.data?.attributes?.second_phone,
    },
  ];

  return (
    <div className="border-1 border-mainBlack/25 border-solid px-10 py-3 capitalize">
      <h1 className="text-lg md:text-xl  text-center mb-2">order address</h1>
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
