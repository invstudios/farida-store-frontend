import { auth } from "@/firebase/auth";
import { signInWithEmailAndPassword } from "firebase/auth";
import Cookies from "js-cookie";
import { makeAutoObservable, runInAction } from "mobx";

export class LoginFormStore {
  email: string = "";
  password: string = "";
  isLoading: boolean = false;
  isPasswordVisible: boolean = false;
  isValidEmail: boolean = true;
  errorMessage: string = "";

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

  firebaseLoginWithEmailAndPass = () => {
    if (
      this.isValidEmail &&
      this.email.length > 0 &&
      this.password.length > 5
    ) {
      runInAction(() => {
        this.isLoading = true;
      });

      return signInWithEmailAndPassword(auth, this.email, this.password);
    }
  };

  strapiLogin = async () => {
    runInAction(() => {
      this.isLoading = true;
      this.errorMessage = "";
    });

    await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_ENDPOINT}/auth/local`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        identifier: this.email,
        password: this.password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {

        if (data.jwt) {
          Cookies.set("credentials", data.jwt);
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

  // set class states function for external actions

  setEmail(val: string) {
    this.email = val;
  }

  setPassword(val: string) {
    this.password = val;
  }

  setIsloading(val: boolean) {
    this.isLoading = val;
  }

  setIsPasswordVisible(val: boolean) {
    this.isPasswordVisible = val;
  }

  setIsValidEmail(val: boolean) {
    this.isValidEmail = val;
  }

  setErrMessage(val: string) {
    this.errorMessage = val;
  }
}
