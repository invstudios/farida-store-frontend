"use client";

import { Button } from "@nextui-org/react";
import React, { useContext, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import UserAddress from "./UserAddress";
import { StoreContext } from "@/contexts/StoreContext";
import { observer } from "mobx-react-lite";
import EmptyAddress from "./EmptyAddress";
import AddNewAddressModal from "./AddNewAddressModal";

const AddressesContainer = () => {
  const { userAddresses, userOrders, addressModal } = useContext(StoreContext);

  useEffect(() => {
    userAddresses.getAllUserAddresses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userAddresses.isLoading, userOrders.isAddressLoading]);

  return (
    <>
      <AddNewAddressModal />
      {userAddresses.userAddresses.length > 0 ? (
        <div className="mt-10 px-32">
          <Button
            className="bg-mainBlack text-mainWhite capitalize"
            radius="none"
            endContent={<FaPlus />}
            onPress={addressModal.onOpen}
          >
            add new address
          </Button>
          <div className="grid grid-cols-2 mt-5 gap-5">
            {userAddresses.userAddresses.map((add, index) => (
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
                postalCode={add.postalcode}
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