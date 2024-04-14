"use client";
import PageTitle from "@/components/PageTitle";
import React, { useContext, useEffect } from "react";
import MiniAdsSection from "./MiniAdsSection";
import FiltersSection from "@/app/components/FiltersSection";
import ProductsSection from "@/app/components/ProductsSection";
import { observer } from "mobx-react-lite";
import { StoreContext } from "@/contexts/StoreContext";
import { useLocale } from "next-intl";

interface CategoriesPageContainerProps {
  // Define your props here
  name: string;
}

const CategoriesPageContainer = ({ name }: CategoriesPageContainerProps) => {
  const { categories } = useContext(StoreContext);
  const locale = useLocale();
  useEffect(() => {
    categories.getArabicCategory(name);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name]);

  return (
    <main>
      <PageTitle
        title={`${
          locale === "en"
            ? name.replaceAll("%20", " ")
            : categories.arabicCategory
        }`}
      />
      <MiniAdsSection />
      <FiltersSection />
      <ProductsSection />
    </main>
  );
};

export default observer(CategoriesPageContainer);
