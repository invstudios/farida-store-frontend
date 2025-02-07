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
        console.log("this is user data : ", data);

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
    console.log({
      product: productId.toString(),
      quantity: quantity,
      cart: this.strapiUserdata.cart.id,
    })
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
            cart: String(this.strapiUserdata?.cart?.id),
          },
        }),
      }
    );
    console.log({
      product: productId.toString(),
      quantity: quantity,
      cart: this.strapiUserdata.cart.id,
    })
    console.log("status post data : ", response.ok)
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
            product: productId,
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

  resetAllAddReviewSectionStates() {
    this.userReviewDescription = "";
    this.userReviewRating = 0;
  }

  updateUserData = async (newUserData: {
    username: string;
    email: string;
    firstName: string;
    lastName: string;
  }) => {
    console.log({
      username: newUserData.username,
      email: newUserData.email,
      first_name: newUserData.firstName,
      last_name: newUserData.lastName,
    })
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_API_ENDPOINT}/users/${this.strapiUserdata.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${isUserLoggedIn()}`,
        },
        body: JSON.stringify({
          username: newUserData.username,
          email: newUserData.email,
          first_name: newUserData.firstName,
          last_name: newUserData.lastName,
        }),
      }
    );

    return response.ok;
  };

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
}
