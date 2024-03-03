"use client";
import Cookies from "js-cookie";
import { makeAutoObservable, runInAction } from "mobx";
import { Userdata } from "./specificTypes/userdata";
import { cartProductType } from "./specificTypes/cartProductType";
import { userCartProductType } from "./specificTypes/userCartProductType";
import { isUserLoggedIn } from "@/functions/credentials";

export class userStore {
  strapiUserdata: Userdata = {} as Userdata;

  isLoading: boolean = false;

  isMergingOrRemovingLoading: boolean = false;

  userReviewRating: number = 0;
  userReviewDescription: string = "";
  userReviewLoading: boolean = false;

  userReviewSended: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  // get user data

  getUserData = async () => {
    await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_API_ENDPOINT}/users/me?populate=*`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("credentials")}`,
        },
      }
    )
      .then((res) => res.json())
      .then((data): void => {
        // console.log("this is user data : ", data);

        runInAction(() => {
          this.strapiUserdata = data;
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // user logged out

  userLogout() {
    const logoutPromise = new Promise((resolve, reject) => {
      resolve(Cookies.remove("credentials"));
    });

    return logoutPromise;
  }

  // user products methods

  addProductToUserCart = async (
    productId: string | number,
    quantity: number
  ) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_API_ENDPOINT}/cart-items`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${isUserLoggedIn()}`,
        },
        body: JSON.stringify({
          data: {
            product: productId.toString(),
            quantity: quantity,
            cart: this.strapiUserdata?.cart?.id.toString(),
          },
        }),
      }
    );

    return response.ok;
  };

  removeProductFromUserCart = async (cartItemId: number | string) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_API_ENDPOINT}/cart-items/${cartItemId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${isUserLoggedIn()}`,
        },
      }
    );

    return response.ok;
  };

  updateUserCartProductQuantity = async (
    cartItemId: number | string,

    newQuantity: number
  ) => {
    return await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_API_ENDPOINT}/cart-items/${cartItemId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${isUserLoggedIn()}`,
        },
        body: JSON.stringify({
          data: {
            quantity: newQuantity,
          },
        }),
      }
    );
  };

  mergeLocalCartWithUserCart = async (userCartItems: userCartProductType[]) => {
    const localCartItems: cartProductType[] = JSON.parse(
      sessionStorage.getItem("cart") ?? "[]"
    );

    for (const product of localCartItems) {
      const founded = userCartItems.find((userItem) => {
        return userItem.id === product.id;
      });

      if (!founded) {
        await this.addProductToUserCart(product.id, product.quantity);
      }
    }

    sessionStorage.removeItem("cart");

    return true;
  };

  clearLocalCart = async () => {
    sessionStorage.removeItem("cart");

    return true;
  };

  clearUserCart = async (userCartItems: userCartProductType[]) => {
    for (const product of userCartItems) {
      await this.removeProductFromUserCart(product.cartItemId);
    }
  };

  addReviewToProduct = async (productId: string | number) => {
    runInAction(() => {
      this.userReviewSended = false;
      this.userReviewLoading = true;
    });
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_API_ENDPOINT}/reviews`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${isUserLoggedIn()}`,
        },
        body: JSON.stringify({
          data: {
            description: this.userReviewDescription,
            rating: this.userReviewRating,
            product: productId.toString(),
            user: this.strapiUserdata.id,
          },
        }),
      }
    );

    if (response.ok) {
      runInAction(() => {
        this.userReviewSended = true;
        this.userReviewLoading = false;
      });
    }
    return response.ok;
  };

  addNewUserAddress = async (userAddressData: {
    street: string;
    state: string;
    city: string;
    country: string;
    postalcode: string;
    phone: string;
    userId: string;
    second_phone: string;
    fullname: string;
  }) => {
    const response = await fetch("http://localhost:1337/api/user-addresses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${isUserLoggedIn()}`,
      },
      body: JSON.stringify({
        data: {
          street: userAddressData.street,
          state: userAddressData.state,
          city: userAddressData.city,
          country: userAddressData.country,
          postalcode: userAddressData.postalcode,
          phone: userAddressData.phone,
          user: userAddressData.userId,
          second_phone: userAddressData.second_phone,
          fullname: userAddressData.fullname,
        },
      }),
    });

    if (response.ok) {
      let data = await response.json();

      // console.log("this is the user address data inside the promise  : ", data);

      return data;
    } else {
      return null;
    }
  };

  createNewOrder = async (newOrderData: {
    totalPrice: number;
    userPaymentId: string | null;
    userId: string | null;
    orderAddressId: string | null;
    orderNotes: string | null;
    orderCartItemsIds: string[];
  }) => {
    let response = await fetch("http://localhost:1337/api/order-details", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${isUserLoggedIn()}`,
      },
      body: JSON.stringify({
        data: {
          total: newOrderData.totalPrice,
          user_payment: newOrderData.userPaymentId,
          user: newOrderData.userId,
          user_order_address: newOrderData.orderAddressId,
          order_notes: newOrderData.orderNotes,
          order_cart_items: newOrderData.orderCartItemsIds,
        },
      }),
    });

    // "total": 0,
    // "user_payment": "string or id",
    // "user": "string or id",
    // "user_order_address": "string or id",
    // "order_notes": "string",
    // "order_cart_items": [
    //   "string or id",
    //   "string or id"
    // ]

    if (response.ok) {
      let data = await response.json();

      //  console.log("this is the user address data inside the promise  : ", data);

      return data;
    } else {
      return null;
    }
  };

  resetAllAddReviewSectionStates() {
    this.userReviewDescription = "";
    this.userReviewRating = 0;
  }

  // setting states of the class

  set setIsMergingOrRemovingLoading(val: boolean) {
    this.isMergingOrRemovingLoading = val;
  }

  set setUserReviewDescription(val: string) {
    this.userReviewDescription = val;
  }

  set setUserReviewRating(val: number) {
    this.userReviewRating = val;
  }

  // updateCartQuantity() {} //Updates the quantity of a specific product in the shopping cart.

  // addAddress() {}

  // removeAddress() {}

  // addToWishList() {}

  // removeFromWishList() {}

  // addPaymentMethod() {}

  // removePaymentMethod() {}

  // updateUserProfile() {}

  // calculateOrderTotal() {} // Calculates the total amount for a given order, considering items, shipping, tax, and discounts.

  // applyDiscount() {} // user may have a discount copon

  // trackOrder() {}

  // cancelOrder() {}

  // getRecommendedProducts() {}

  // getOrderHistory() {}
}
