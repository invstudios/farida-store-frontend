import { makeAutoObservable, runInAction } from "mobx";
import { CategoryType } from "./specificTypes/catgorytype";
import { ArabicCategoryType } from "./specificTypes/arabicCategoryType";

export class CategoriesStore {
  categories: CategoryType[] = [];
  someCategories: CategoryType[] = [];
  arabicCategory: string = "";

  private getOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: process.env.NEXT_PUBLIC_STRAPI_API_TOKEN ?? "",
    },
  };

  constructor() {
    makeAutoObservable(this);
  }

  getAllCategories = async () => {
    await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_API_ENDPOINT}/categories?populate=*`,
      this.getOptions
    )
      .then((res) => res.json())
      .then((data) => {
        runInAction(() => {
          this.categories = data.data;
        });
      })
      .catch((err) => {});
  };

  getSomeCategories = async (count: number, locale: string) => {
    await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_API_ENDPOINT}/categories?populate=*&pagination[page]=1&pagination[pageSize]=${count}&locale=${locale}`,
      this.getOptions
    )
      .then((res) => res.json())
      .then((data) => {
        runInAction(() => {
          this.someCategories = data.data;
        });
      })
      .catch((err) => {});
  };

  getArabicCategory = async (category: string) => {
    await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_API_ENDPOINT}/categories?filters[$and][0][name][$eq]=${category}&populate=localizations`,
      this.getOptions
    )
      .then((res) => res.json())
      .then((data: ArabicCategoryType) => {
        runInAction(() => {
          this.arabicCategory =
            data.data[0].attributes.localizations?.data[0].attributes.name ??
            "";
        });
      })
      .catch((err) => {});
  };
}
