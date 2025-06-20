"use client";

import { auth } from "@/firebase/auth";
import { signInWithEmailAndPassword } from "firebase/auth";
import { makeAutoObservable } from "mobx";

export class UserDropStore {
  isUserMenuDisplayed: boolean = false;
  emailInputValue: string = "";
  passwordInputValue: string = "";
  emailInputFocus: boolean = false;
  passwordInputFocus: boolean = false;
  isLoading: boolean = false;
  errorMessage: string = "";

  constructor() {
    makeAutoObservable(this);
  }

  displayUserMenu = () => {
    this.isUserMenuDisplayed = true;
  };

  hideUserMenu = () => {
    if (
      !(this.emailInputValue.length > 0) &&
      !(this.passwordInputValue.length > 0) &&
      !this.emailInputFocus &&
      !this.passwordInputFocus
    ) {
      this.isUserMenuDisplayed = false;
    }
  };

  setEmailValue = (value: string) => {
    this.emailInputValue = value;
  };
  setPasswordValue = (value: string) => {
    this.passwordInputValue = value;
  };

  setEmailFocus = (value: boolean) => {
    this.emailInputFocus = value;
  };

  setPasswordFocus = (value: boolean) => {
    this.passwordInputFocus = value;
  };

  login = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();

    this.isLoading = true;
    this.errorMessage = "";
    return signInWithEmailAndPassword(
      auth,
      this.emailInputValue,
      this.passwordInputValue
    )
      .then((userCredential) => {
        this.isLoading = false;
        // router.push("/");
      })
      .catch((err) => {
        this.errorMessage = err.message;
        this.isLoading = false;
      });
  };
}
