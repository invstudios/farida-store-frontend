import { makeAutoObservable } from "mobx";

export class SideBarStore {
  showBackdrop: boolean = false;
  showSideBar: boolean = false;
  showCartSideBar: boolean = false;

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

  set displaySideBar(state: boolean) {
    state ? (this.showSideBar = state) : (this.showSideBar = state);
  }

  hideWholeSidebar = () => {
    this.displaySideBar = false;
    setTimeout(() => {
      this.displayBackdrop = false;
    }, 500);
  };

  displayWholeSidebar = () => {
    this.displayBackdrop = true;
    setTimeout(() => {
      this.displaySideBar = true;
    }, 500);
  };
}
