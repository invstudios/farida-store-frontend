import { makeAutoObservable, runInAction } from "mobx";
import { color } from "./specificTypes/colorType";
import { ArabicColorDataType } from "./specificTypes/arabicColorDataType";

export class ColorsStore {
  colors: color[] = [];
  arabicColorName: string = "";

  getOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: process.env.NEXT_PUBLIC_STRAPI_API_TOKEN ?? "",
    },
  };

  constructor() {
    makeAutoObservable(this);
  }

  getAllColors = async () => {
    await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_API_ENDPOINT}/colors?populate=*`,
      this.getOptions
    )
      .then((res) => res.json())
      .then((data) => {
        // console.log(
        //   "this is the data of the promise we get from colors : ",
        //   data
        // );
        runInAction(() => {
          this.colors = data.data;
        });
      })
      .catch((err) => console.log(err));
  };

  getArabicColor = async (color: string) => {
    await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_API_ENDPOINT}/colors?populate=localizations&filters[$and][0][name][$eq]=${color}`,
      this.getOptions
    )
      .then((res) => res.json())
      .then((data: ArabicColorDataType) => {
        // console.log(
        //   "this is the data of the promise we get from colors : ",
        //   data
        // );
        runInAction(() => {
          this.arabicColorName =
            data.data[0].attributes.localizations?.data[0].attributes.name ??
            "";
        });
      })
      .catch((err) => console.log(err));
  };
}
