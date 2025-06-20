import Cookies from "js-cookie";
import { makeAutoObservable, runInAction } from "mobx";

export class RegisterFormStore {
  email: string = "";
  password: string = "";
  confirmedPassword: string = "";
  username: string = "";
  firstName: string = "";
  lastName: string = "";
  isLoading: boolean = false;
  isPasswordVisible: boolean = false;
  isConfirmedPasswordVisible: boolean = false;
  isValidEmail: boolean = true;
  isValidPassword: boolean = true;
  errorMessage: string = "";
  disabledCondition: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  validateEmail() {
    if (this.email.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$/i)) {
      runInAction(() => {
        this.isValidEmail = true;
      });
    } else {
      runInAction(() => {
        this.isValidEmail = false;
      });
    }
  }

  validatePassword() {
    if (this.password.match(/^(?=.*[A-Z])(?=.*\d).{6,}$/)) {
      runInAction(() => {
        this.isValidPassword = true;
      });
    } else {
      runInAction(() => {
        this.isValidPassword = false;
      });
    }
  }

  strapiRegister = async () => {
    runInAction(() => {
      this.isLoading = true;
      this.errorMessage = "";
    });

    await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_API_ENDPOINT}/auth/local/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: this.username,
          email: this.email,
          password: this.password,
          first_name: this.firstName,
          last_name: this.lastName,
        }),
      }
    )
      .then((res) => res.json())
      .then((data) => {

        if (data.jwt) {
          Cookies.set("credentials", data.jwt);
          this.createUserCart(data.user.id, data.jwt);
          this.createUserWishlist(data.user.id, data.jwt);
        }
        //  this.products = data.data;
        //  this.pagination = data.meta.pagination;

        if (data.error) {
          runInAction(() => {
            this.isLoading = false;
            this.errorMessage = data.error.message;
          });
        }

        runInAction(() => {
          this.isLoading = false;
        });
      })
      .catch((err) => {

        runInAction(() => {
          this.isLoading = false;
        });
      });
  };

  // create user cart

  createUserCart = async (userId: number | string, jwt: string) => {
    await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_ENDPOINT}/carts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({
        data: {
          cart_items: [],
          user: `${userId}`,
        },
      }),
    });
  };

  // create user wishlist

  createUserWishlist = async (userId: number | string, jwt: string) => {
    await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_ENDPOINT}/wishlists`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({
        data: {
          wishlist_items: [],
          user: `${userId}`,
        },
      }),
    });
  };

  // set class states function for external actions

  setEmail(val: string) {
    this.email = val;
  }

  setPassword(val: string) {
    this.password = val;
  }

  setConfirmedPassword(val: string) {
    this.confirmedPassword = val;
  }

  setUsername(val: string) {
    this.username = val;
  }
  setFirstName(val: string) {
    this.firstName = val;
  }
  setlastName(val: string) {
    this.lastName = val;
  }

  setIsloading(val: boolean) {
    this.isLoading = val;
  }

  setIsPasswordVisible(val: boolean) {
    this.isPasswordVisible = val;
  }

  setIsConfirmedPasswordVisible(val: boolean) {
    this.isConfirmedPasswordVisible = val;
  }

  setIsValidEmail(val: boolean) {
    this.isValidEmail = val;
  }

  setIsValidPassword(val: boolean) {
    this.isValidPassword = val;
  }

  setErrMessage(val: string) {
    this.errorMessage = val;
  }

  setDisabledCondition(val: boolean) {
    this.disabledCondition = val;
  }
}
