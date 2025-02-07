"use client";
import React, { useContext, useEffect, useState } from "react";
import Thanks from "./Thanks";

import ItemsContainer from "./ItemsContainer";
import Orderinfo from "./Orderinfo";
import OrderAddress from "./OrderAddress";
import { StoreContext } from "@/contexts/StoreContext";
import { useSearchParams } from "next/navigation";
import { useRouter } from "@/navigation";
import { observer } from "mobx-react-lite";
import NoOrder from "./NoOrder";
import { useLocale } from "next-intl";

const ConfirmationPageContainer = () => {
  const { userOrders, user } = useContext(StoreContext);
  const locale = useLocale();
  const searchParams = useSearchParams();
  const router = useRouter();

  const orderId = searchParams.get("order_number");

  const [foundedInUserOrders, setFoundedInUserOrders] = useState(false);

  useEffect(() => {
    if (orderId) {
      userOrders.getOrderDetails(orderId ?? "");
    } else {
      router.push("/cart/shipping");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (orderId && user.strapiUserdata.id) {
      userOrders
        .isOrderInUserOrdersList(orderId, user.strapiUserdata.id)
        .then((value) => {
          console.log("value order in user order list : ", value)
          setFoundedInUserOrders(value ?? false);
        });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userOrders.isCreatingOrderLoading, user.strapiUserdata.id]);

  return (
    <div dir={locale === "en" ? "ltr" : "rtl"}>
      {orderId && userOrders.orderDetails.data && foundedInUserOrders ? (
        <div className="flex flex-col gap-10 mt-20 px-5 md:px-10 lg:px-20">
          <Thanks />
          {/* <OrderInformationContainer /> */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 ">
            <Orderinfo />
            <OrderAddress />
          </div>
          <ItemsContainer />
        </div>
      ) : (
        <NoOrder />
      )}
    </div>
  );
};

export default observer(ConfirmationPageContainer);
