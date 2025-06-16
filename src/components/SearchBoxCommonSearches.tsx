"use client";

import { StoreContext } from "@/contexts/StoreContext";
import { Chip } from "@nextui-org/react";
import { observer } from "mobx-react-lite";
import { useTranslations } from "next-intl";
import React, { useContext } from "react";

interface commonSearchProps {
  searchForResult: (param: string) => void;
}

const SearchBoxCommonSearches = ({ searchForResult }: commonSearchProps) => {
  const { categories } = useContext(StoreContext);
  const t = useTranslations("search");

  return (
    <div
      key={"common search"}
      className="flex flex-wrap items-center justify-center gap-2 md:gap-5"
    >
      <h1 className="text-sm md:text-xl capitalize">{t("common")}</h1>

      {categories.someCategories?.map((cat) => (
        <div
          key={cat.id}
          onClick={() => {
            searchForResult(cat.attributes.name);
          }}
        >
          <Chip
            variant="bordered"
            className="cursor-pointer text-xs md:text-sm"
            classNames={{
              base: "hover:text-mainBlack hover:border-mainBlack transition-all",
            }}
          >
            {cat.attributes.name}
          </Chip>
        </div>
      ))}
    </div>
  );
};

export default observer(SearchBoxCommonSearches);
