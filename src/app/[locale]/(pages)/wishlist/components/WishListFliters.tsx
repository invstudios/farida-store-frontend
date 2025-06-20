"use client";
import { StoreContext } from "@/contexts/StoreContext";
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Input,
} from "@nextui-org/react";
import { useSearchParams } from "next/navigation";
import { useRouter, usePathname } from "@/navigation";
import React, { useContext } from "react";

import { IoAddCircleOutline } from "react-icons/io5";
import { IoFilterOutline } from "react-icons/io5";
import { useLocale, useTranslations } from "next-intl";

interface wishListFiltersProps {
  showFilters?: boolean;
  showAddNewBtn?: boolean;
}

const WishListFliters = ({
  showAddNewBtn = true,
  showFilters = true,
}: wishListFiltersProps) => {
  const { userWishlist } = useContext(StoreContext);
  const t = useTranslations("wishList");
  const locale = useLocale();

  const filters = [
    { type: "Rating", title: t("content.filters.rating") },
    {
      type: "Prices Up",
      title: t("content.filters.pricesUp"),
    },
    {
      type: "Prices Down",
      title: t("content.filters.pricesDown"),
    },
    { type: "A-Z", title: t("content.filters.AZ") },
  ];

  const router = useRouter();
  const pathname = usePathname();

  const goToHomePage = () => {
    router.push("/");
  };

  const setFilter = (selection: any) => {
    // if (selection) {
    //   router.push(`${pathname}?sortby=${selection}`);
    //   userWishlist.sortUserWishlistItems(selection);
    // } else {
    //   router.push(`${pathname}`);
    // }
    userWishlist.sortUserWishlistItems(selection);
  };

  return (
    <div className=" relative hidden xl:block">
      <div className="flex flex-col gap-10 ">
        {showAddNewBtn && (
          <Button
            endContent={<IoAddCircleOutline />}
            className="bg-mainBlack text-mainWhite p-5 py-8 text-xl capitalize"
            onClick={goToHomePage}
          >
            {t("content.filters.action")}
          </Button>
        )}

        {showFilters && (
          <Autocomplete
            label={t("content.filters.filters")}
            placeholder={t("content.filters.filterBy")}
            defaultItems={filters}
            variant="faded"
            startContent={<IoFilterOutline />}
            className="border-mainPink"
            color="success"
            classNames={{
              popoverContent: "bg-emerald-500 text-mainWhite ",
            }}
            onSelectionChange={(selection) => {
              setFilter(selection);
            }}
          >
            {(item) => (
              <AutocompleteItem
                key={item.type}
                classNames={{
                  base: `${locale === "en" ? `text-left` : `text-right`}  `,
                }}
              >
                {item.title}
              </AutocompleteItem>
            )}
          </Autocomplete>
        )}
      </div>
    </div>
  );
};

export default WishListFliters;
