import { makeAutoObservable, runInAction } from "mobx";
import { Advertise } from "./specificTypes/advertiseType";
import { MiniAdType } from "./specificTypes/miniAdType";
import { STRAPI_ENDPOINT } from "@/api/config";

export class AdsSliderStore {
  ads: Advertise[] = [];
  miniAds: MiniAdType[] = [];

  private getOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  constructor() {
    makeAutoObservable(this);
  }

  getAllAds = async (locale: string) => {
    await fetch(
      `${STRAPI_ENDPOINT}/advertises?populate=*&locale=${locale}`,
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
      `${STRAPI_ENDPOINT}/mini-ads?populate=*&locale=${locale}`,
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
