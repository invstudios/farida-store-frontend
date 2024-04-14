"use client";
import { StoreContext } from "@/contexts/StoreContext";
import { Button, Slider, SliderValue } from "@nextui-org/react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useRouter, usePathname } from "@/navigation";
import React, { useContext, useEffect } from "react";

const PriceSlider = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const min_price = searchParams.get("min_price");
  const max_price = searchParams.get("max_price");
  const [value, setValue] = React.useState<SliderValue>([
    min_price ? Number(min_price) : 0,
    max_price ? Number(max_price) : 50000,
  ]);
  const { filter } = useContext(StoreContext);
  const t = useTranslations("filters");

  const params = new URLSearchParams(searchParams);

  // const salesOnly = searchParams.get("salesonly")

  const handlePriceSearch = (min: string, max: string) => {
    if (min && max) {
      params.set("min_price", min);
      params.set("max_price", max);
    } else {
      params.delete("min_price");
      params.delete("max_price");
    }
    router.replace(`${pathname}?${params.toString()}`);
  };

  const filterByPriceRange = () => {
    if (typeof value === "object") {
      // router.push(`${pathname}?min_price=${value[0] }&max_price=${value[1]}`)
      handlePriceSearch(`${value[0]}`.toString() ?? "", `${value[1]}` ?? "");
    }
    filter.hideWholeFilterSidebar();
  };

  return (
    <div className="flex flex-col gap-2 w-full h-full max-w-md items-start justify-center">
      <Slider
        label={t("selectPrice")}
        formatOptions={{ style: "currency", currency: "EGP" }}
        size="sm"
        color="foreground"
        step={10}
        maxValue={50000}
        minValue={0}
        value={value}
        onChange={setValue}
        className="max-w-md"
      />
      <div className="flex items-center w-full justify-between">
        <p className="text-default-500 font-medium text-small">
          {t("price")}:{" "}
          {Array.isArray(value) && value.map((b) => `EGP${b}`).join(" – ")}
        </p>
        <Button
          radius="sm"
          className="bg-mainBlack p-2 capitalize text-mainWhite"
          onClick={filterByPriceRange}
        >
          {t("select")}
        </Button>
      </div>
    </div>
  );
};

export default PriceSlider;
