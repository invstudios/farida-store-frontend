import { makeAutoObservable, runInAction } from "mobx";
import { Advertise } from "./specificTypes/advertiseType";
import { MiniAdType } from "./specificTypes/miniAdType";

export class AdsSliderStore {
  ads: Advertise[] = [];
  miniAds: MiniAdType[] = [];

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

  getAllAds = async (locale: string) => {
    await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_API_ENDPOINT}/advertises?populate=*&locale=${locale}`,
      this.getOptions
    )
      .then((res) => res.json())
      .then((data) => {

        runInAction(() => {
          this.ads = data.data;
        });
      })
      .catch((err) => {});
  };

  getAllMiniAds = async (locale: string) => {
    await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_API_ENDPOINT}/mini-ads?populate=*&locale=${locale}`,
      this.getOptions
    )
      .then((res) => res.json())
      .then((data) => {
        runInAction(() => {
          this.miniAds = data.data;
        });
      })
      .catch((err) => {});
  };
}
