import { makeAutoObservable, runInAction } from "mobx";
import { STRAPI_ENDPOINT } from "@/api/config";
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
      `${STRAPI_ENDPOINT}/users/me?populate=user_addresses`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
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

  // Resolve a single address from the server (owner-safe, via /users/me)
  // instead of trusting personal data stored in the browser.
  getUserAddressById = async (
    addressId: number | string
  ): Promise<UserAddressType | null> => {
    await this.getAllUserAddresses();

    const address = this.userAddresses.find(
      (item) => item.id.toString() === addressId.toString()
    );

    if (address) {
      runInAction(() => {
        this.selectedUserAddress = address;
      });
      return address;
    }
    return null;
  };

  deleteUserAddress = async (addressId: number | string) => {
    runInAction(() => {
      this.isLoading = true;
    });

    let response = await fetch(
      `${STRAPI_ENDPOINT}/user-addresses/${addressId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
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
