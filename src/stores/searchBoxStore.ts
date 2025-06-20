import { makeAutoObservable, runInAction } from "mobx";
import { strapiProductType } from "./specificTypes/strapiProductType";

export class SearchBoxStore {
  showBackdrop: boolean = false;

  showSearchBox: boolean = false;

  quickProducts: strapiProductType[] = [];
  quickProductsLoading: boolean = false;
  searchInputValue: string = "";

  private getMethodOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: process.env.NEXT_PUBLIC_STRAPI_API_TOKEN ?? "",
    },
  };

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

  set displaySearchBox(state: boolean) {
    state ? (this.showSearchBox = state) : (this.showSearchBox = state);
  }

  hideWholeSearchBox = () => {
    this.displaySearchBox = false;
    setTimeout(() => {
      this.displayBackdrop = false;
    }, 500);
  };

  displayWholeSearchBox = () => {
    this.displayBackdrop = true;
    setTimeout(() => {
      this.displaySearchBox = true;
    }, 500);
  };

  quickSearch = async (searchQuery: string) => {
    runInAction(() => {
      this.quickProductsLoading = true;
    });

    await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_API_ENDPOINT}/products/?populate=*&pagination[page]=1&pagination[pageSize]=4&filters[$or][0][title][$contains]=${searchQuery}&filters[$or][1][description][$contains]=${searchQuery}&filters[$or][2][category][name][$contains]=${searchQuery}&filters[$or][3][colors][name][$contains]=${searchQuery}&filters[$or][4][localizations][title][$contains]=${searchQuery}&filters[$or][5][localizations][description][$contains]=${searchQuery}`,
      this.getMethodOptions
    )
      .then((res) => res.json())
      .then((data) => {

        runInAction(() => {
          this.quickProducts = data.data;
          this.quickProductsLoading = false;
        });
      })
      .catch((err) => {});
  };

  setSearchInputValue(val: string) {
    this.searchInputValue = val;
  }

  setQuickProducts(val: strapiProductType[]) {
    this.quickProducts = val;
  }
}
