import { makeAutoObservable } from "mobx";

export class CartSidebarStore {
  showBackdrop: boolean = false;

  showCartSideBar: boolean = false;

  isLocalCartHasItems: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  set displayBackdrop(state: boolean) {
    if (state) {
      this.showBackdrop = state;
      if (typeof window !== 'undefined') {
        document.body.style.overflow = "hidden";
      }
    } else {
      this.showBackdrop = state;
      if (typeof window !== 'undefined') {
        document.body.style.overflow = "unset";
      }
    }
  }

  set displayCartSideBar(state: boolean) {
    state ? (this.showCartSideBar = state) : (this.showCartSideBar = state);
  }

  hideWholeCartSidebar = () => {
    this.displayCartSideBar = false;
    setTimeout(() => {
      this.displayBackdrop = false;
    }, 500);
  };

  displayWholeCartSidebar = () => {
    this.displayBackdrop = true;
    setTimeout(() => {
      this.displayCartSideBar = true;
    }, 500);
  };

  checkLocalCartHasItems() {
    if (typeof window === 'undefined') return;

    if (
      sessionStorage.getItem("cart")
      // && JSON.parse(sessionStorage.getItem("cart") ?? "[]").length > 0
    ) {
      this.isLocalCartHasItems = true;
    } else {
      this.isLocalCartHasItems = false;
    }
  }
}
