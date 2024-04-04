"use client";
import { StoreContext } from "@/contexts/StoreContext";
import { Chip, Input, Spinner } from "@nextui-org/react";
import { SearchIcon } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";
import QuickSearchMenu from "./QuickSearchMenu";
import { observer } from "mobx-react-lite";
import SearchBoxCommonSearches from "./SearchBoxCommonSearches";
import { useScreenSize } from "react-screen-size-helper";
import { useLocale, useTranslations } from "next-intl";

const SearchBox = () => {
  const { searchBox, categories } = useContext(StoreContext);
  const { isMobile, isTablet } = useScreenSize({});
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("q");
  const locale = useLocale();
  const t = useTranslations("search");

  const searchForResult = (query: string) => {
    router.push(`/${locale}/search?q=${query}`);
    searchBox.hideWholeSearchBox();

    searchBox.setSearchInputValue("");
  };

  useEffect(() => {
    categories.getSomeCategories(4, locale);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const clickingEnter = (e: KeyboardEvent) => {
      // console.log("this is key down event ",e)
      if (e.key === "Enter" && searchBox.searchInputValue.length > 0) {
        e.preventDefault();

        searchForResult(searchBox.searchInputValue);
      }
    };

    if (searchBox.showSearchBox === true) {
      window.addEventListener("keydown", clickingEnter);
    } else {
      window.removeEventListener("keydown", clickingEnter);
    }

    return () => window.removeEventListener("keydown", clickingEnter);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchBox.searchInputValue, searchBox.showSearchBox]);

  return (
    <div className="w-full flex flex-col gap-5 items-center justify-center">
      <Input
        size={isMobile ? "sm" : isTablet ? "md" : "lg"}
        radius="full"
        value={searchBox.searchInputValue}
        placeholder={query ? query : t("type")}
        endContent={
          !searchBox.quickProductsLoading ? (
            <SearchIcon
              className="cursor-pointer text-mainBlack"
              onClick={() => {
                if (searchBox.searchInputValue.length > 0) {
                  searchForResult(searchBox.searchInputValue);
                }
              }}
            />
          ) : (
            <Spinner color="default" />
          )
        }
        className="w-full md:w-3/4"
        onChange={(e) => {
          searchBox.setSearchInputValue(e.target.value);
        }}

        //   onValueChange={searchBox.setSearchInputValue}
      />

      {searchBox.quickProducts.length === 0 && (
        <SearchBoxCommonSearches searchForResult={searchForResult} />
      )}

      <QuickSearchMenu />
    </div>
  );
};

export default observer(SearchBox);
