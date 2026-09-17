import { makeAutoObservable, runInAction } from "mobx";
import { STRAPI_ENDPOINT } from "@/api/config";
import { createSession } from "@/functions/credentials";

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

    let userId: number | string = "";

    try {
      const response = await fetch(
        `${STRAPI_ENDPOINT}/auth/local/register`,
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
      );
      const data = await response.json();

      if (!data.jwt) {
        runInAction(() => {
          this.isLoading = false;
          this.errorMessage = data.error?.message || "Registration failed";
        });
        return;
      }

      userId = data.user.id;
      await createSession(data.jwt);

      const [cartCreated, wishlistCreated] = await Promise.all([
        this.createUserCart(userId),
        this.createUserWishlist(userId),
      ]);

      runInAction(() => {
        this.isLoading = false;
        if (!cartCreated || !wishlistCreated) {
          this.errorMessage =
            "Account created, but we could not initialize your cart or wishlist. You can still use the site; your cart will be created on your first order attempt.";
        }
      });
    } catch (err) {
      runInAction(() => {
        this.isLoading = false;
        this.errorMessage = "Something went wrong. Please try again.";
      });
    }
  };

  // create user cart

  createUserCart = async (userId: number | string): Promise<boolean> => {
    try {
      const response = await fetch(`${STRAPI_ENDPOINT}/carts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: {
            cart_items: [],
            user: `${userId}`,
          },
        }),
      });

      if (!response.ok) {
        const body = await response.json();
        if (body?.error?.message) {
          runInAction(() => {
            this.errorMessage = body.error.message;
          });
        }
        return false;
      }

      return true;
    } catch (err) {
      return false;
    }
  };

  // create user wishlist

  createUserWishlist = async (userId: number | string): Promise<boolean> => {
    try {
      const response = await fetch(`${STRAPI_ENDPOINT}/wishlists`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: {
            wishlist_items: [],
            user: `${userId}`,
          },
        }),
      });

      if (!response.ok) {
        const body = await response.json();
        if (body?.error?.message) {
          runInAction(() => {
            this.errorMessage = body.error.message;
          });
        }
        return false;
      }

      return true;
    } catch (err) {
      return false;
    }
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
