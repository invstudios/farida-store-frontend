import { isUserLoggedIn } from "@/functions/credentials";
import { makeAutoObservable, runInAction } from "mobx";
import {
  MainAddressData,
  UserAddressType,
} from "./specificTypes/userAddressType";

export class UserAddressesStore {
  userAddresses: UserAddressType[] = [];
  isLoading: boolean = false;
  selectedUserAddress: UserAddressType = {} as UserAddressType;
  selectLoading: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  getAllUserAddresses = async () => {
    let response = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_API_ENDPOINT}/users/me?populate=user_addresses`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${isUserLoggedIn()}`,
        },
      }
    );

    if (response.ok) {
      let data: MainAddressData = await response.json();

      runInAction(() => {
        this.userAddresses = data.user_addresses;
      });

      return response.ok;
    } else {
      return false;
    }
  };

  deleteUserAddress = async (addressId: number | string) => {
    runInAction(() => {
      this.isLoading = true;
    });

    let response = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_API_ENDPOINT}/user-addresses/${addressId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${isUserLoggedIn()}`,
        },
      }
    );

    if (response.ok) {
      //   let data: MainAddressData = await response.json();

      //   runInAction(() => {
      //     this.userAddresses = data.user_addresses;
      //   });

      runInAction(() => {
        this.isLoading = false;
      });

      return response.ok;
    } else {
      return false;
    }
  };

  // set states of the class

  set setSelectedUserAddress(val: UserAddressType) {
    this.selectedUserAddress = val;
  }

  set setSelectLoading(val: boolean) {
    this.selectLoading = val;
  }
}
