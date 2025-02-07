"use client";

import { Button } from "@nextui-org/react";
import React, { useContext, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import UserAddress from "./UserAddress";
import { StoreContext } from "@/contexts/StoreContext";
import { observer } from "mobx-react-lite";
import EmptyAddress from "./EmptyAddress";
import AddNewAddressModal from "./AddNewAddressModal";
import { useScreenSize } from "react-screen-size-helper";
import { useTranslations } from "next-intl";

const AddressesContainer = () => {
  const { userAddresses, userOrders, addressModal } = useContext(StoreContext);

  const { currentWidth } = useScreenSize({});
  const t = useTranslations("userAdderesses");

  useEffect(() => {
    userAddresses.getAllUserAddresses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userAddresses.isLoading, userOrders.isAddressLoading]);

  return (
    <>
      <AddNewAddressModal />
      {userAddresses?.userAddresses?.length > 0 ? (
        <div className="mt-10 px-5 md:px-10 lg:px-20">
          <Button
            size={currentWidth > 768 ? "md" : "sm"}
            className="bg-mainBlack text-mainWhite capitalize w-full md:w-auto"
            radius="none"
            endContent={<FaPlus />}
            onPress={addressModal.onOpen}
          >
            {t("new")}
          </Button>
          <div className="grid grid-cols-1 md:grid-cols-2 mt-5 gap-5">
            {userAddresses?.userAddresses?.map((add, index) => (
              <UserAddress
                key={add.id}
                addressId={add.id}
                index={index + 1}
                state={add.state}
                country={add.country}
                city={add.city}
                street={add.street}
                phone={add.phone}
                secondPhone={add.second_phone}
                postalCode={add.postal_code}
              />
            ))}
          </div>
        </div>
      ) : (
        <EmptyAddress />
      )}
    </>
  );
};

export default observer(AddressesContainer);
