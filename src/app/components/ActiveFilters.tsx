"use client";
import React, { useContext, useEffect } from "react";
import MiniActiveFilter from "./MiniActiveFilter";
import { useSearchParams } from "next/navigation";
import { useRouter, usePathname } from "@/navigation";
import { useLocale, useTranslations } from "next-intl";
import { StoreContext } from "@/contexts/StoreContext";
import { observer } from "mobx-react-lite";

const ActiveFilters = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("activeFilters");
  const currency = useTranslations("currency");
  const locale = useLocale();
  const { colors } = useContext(StoreContext);

  const params = new URLSearchParams(searchParams);

  const colorName = searchParams.get("color");
  const min_price = searchParams.get("min_price");
  const max_price = searchParams.get("max_price");

  const deleteFilter = (filter: string) => {
    params.delete(filter);
    router.replace(`${pathname}?${params.toString()}`);
  };

  useEffect(() => {
    colors.getArabicColor(colorName ?? "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [colorName]);

  return (
    <div className="flex gap-x-5 gap-y-2 items-center md:justify-start justify-center flex-wrap">
      <h1 className="capitalize text-sm md:text-xl font-semibold">
        {t("active")} :
      </h1>
      {colorName && (
        <MiniActiveFilter
          filterName={t("color")}
          deleteFilter={deleteFilter}
          filterTitle={`${t("color")} : ${
            locale === "en" ? colorName : colors.arabicColorName
          }`}
        />
      )}
      {min_price && (
        <MiniActiveFilter
          filterName={t("minPrice")}
          deleteFilter={deleteFilter}
          filterTitle={`${t("minPrice")} : ${min_price} ${currency(
            "currency"
          )}`}
        />
      )}
      {max_price && (
        <MiniActiveFilter
          filterName={t("maxPrice")}
          deleteFilter={deleteFilter}
          filterTitle={`${t("maxPrice")} : ${max_price} ${currency(
            "currency"
          )}`}
        />
      )}
    </div>
  );
};

export default observer(ActiveFilters);
