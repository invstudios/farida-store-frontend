"use client";
import React from "react";
import CartTab from "./CartTab";
import { Progress } from "@nextui-org/react";
import { usePathname } from "@/navigation";
import { useLocale, useTranslations } from "next-intl";

const LayoutTabs = () => {
  const currentLink = usePathname();
  const t = useTranslations("cartPage");
  const locale = useLocale();

  return (
    <div
      className="flex flex-col gap-2 w-full h-auto px-5 md:px-9 lg:px-20 py-3"
      dir={locale === "en" ? "ltr" : "rtl"}
    >
      <div className="w-full  grid grid-rows-[auto_auto_auto_auto] grid-cols-1 gap-y-5 mt-5 md:mt-0 md:grid-cols-4 md:grid-rows-1 gap-x-1  ">
        <div className="grid grid-rows-[auto_auto] grid-cols-1 md:grid-rows-1 gap-2">
          <CartTab
            step={1}
            title={t("tabs.step1.title")}
            description={t("tabs.step1.description")}
            targetLink={"/cart"}
            opacity={currentLink === "/cart" ? "opacity-100" : "opacity-50"}
            isChecked={
              currentLink === "/cart/shipping" ||
              currentLink === "/cart/confirmation"
                ? true
                : false
            }
          />
          <Progress
            aria-label="Loading..."
            value={100}
            size="sm"
            radius="none"
            className="w-full md:hidden ltr:rotate-0 rtl:rotate-180"
            classNames={{
              indicator: "bg-gradient-to-r from-mainPink to-mainPink",
            }}
          />
        </div>
        <div className="grid grid-rows-[auto_auto] grid-cols-1 md:grid-rows-1 gap-2">
          <CartTab
            step={2}
            title={t("tabs.step2.title")}
            description={t("tabs.step2.description")}
            opacity={
              currentLink === "/cart/shipping" ? "opacity-100" : "opacity-50"
            }
            targetLink={"/cart/shipping"}
            isChecked={currentLink === "/cart/confirmation" ? true : false}
          />
          <Progress
            aria-label="Loading..."
            value={
              currentLink === "/cart/shipping" ||
              currentLink === "/cart/confirmation"
                ? 100
                : 0
            }
            size="sm"
            radius="none"
            className="w-full md:hidden ltr:rotate-0 rtl:rotate-180"
            classNames={{
              indicator: "bg-gradient-to-r from-mainPink to-mainPink",
            }}
          />
        </div>
        <div className="grid grid-rows-[auto_auto] grid-cols-1 md:grid-rows-1 gap-2">
          <CartTab
            step={3}
            title={t("tabs.step3.title")}
            description={t("tabs.step3.description")}
            opacity={
              currentLink === "/cart/payment" ? "opacity-100" : "opacity-50"
            }
            targetLink={"/cart/payment"}
            isChecked={currentLink === "/cart/payment" ? true : false}
          />
          <Progress
            aria-label="Loading..."
            value={
              currentLink === "/cart/payment" ||
              currentLink === "/cart/payment"
                ? 100
                : 0
            }
            size="sm"
            radius="none"
            className="w-full md:hidden ltr:rotate-0 rtl:rotate-180"
            classNames={{
              indicator: "bg-gradient-to-r from-mainPink to-mainPink",
            }}
          />
        </div>
        <div className="grid grid-rows-[auto_auto] grid-cols-1 md:grid-rows-1 gap-2">
          <CartTab
            step={4}
            title={t("tabs.step4.title")}
            description={t("tabs.step4.description")}
            opacity={
              currentLink === "/cart/confirmation"
                ? "opacity-100"
                : "opacity-50"
            }
            targetLink="/cart/confirmation"
            isDisabled
          />
          <Progress
            aria-label="Loading..."
            value={currentLink === "/cart/confirmation" ? 100 : 0}
            size="sm"
            radius="none"
            className="w-full md:hidden ltr:rotate-0 rtl:rotate-180"
            classNames={{
              indicator: "bg-gradient-to-r from-mainPink to-mainPink",
            }}
          />
        </div>
      </div>
      <Progress
        aria-label="Loading..."
        value={
          currentLink === "/cart"
            ? 100 / 4
            : currentLink === "/cart/shipping"
            ? (100 / 4) * 2
            : currentLink === "/cart/payment"
            ? (100 / 4) * 3
            : currentLink === "/cart/confirmation"
            ? 100
            : 0
        }
        size="sm"
        radius="none"
        className="w-full hidden md:block ltr:rotate-0 rtl:rotate-180"
        classNames={{
          indicator: "bg-gradient-to-r from-mainPink to-mainPink",
        }}
      />
    </div>
  );
};

export default LayoutTabs;
