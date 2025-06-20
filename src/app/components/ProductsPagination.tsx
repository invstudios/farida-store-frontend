"use client";
import React, { useContext, useEffect, useState } from "react";
import { Pagination } from "@nextui-org/react";
import { observer } from "mobx-react-lite";
import { StoreContext } from "@/contexts/StoreContext";
import { useParams, useSearchParams, usePathname } from "next/navigation";
import { useScreenSize } from "react-screen-size-helper";
import { useLocale } from "next-intl";

const ProductsPagination = () => {
  const locale = useLocale();
  const { products, filter } = useContext(StoreContext);
  const [currentPage, setCurrentPage] = useState(1);
  const searchParams = useSearchParams();
  const urlParams = useParams();

  const pathname = usePathname();
  const { isDesktop, isMobile } = useScreenSize({});

  const salesOnly = searchParams.get("salesonly");
  const sorting = searchParams.get("sort");
  const pageSize = searchParams.get("psize");
  const min_price = searchParams.get("min_price");
  const max_price = searchParams.get("max_price");
  const colorName = searchParams.get("color");
  const searchQuery = searchParams.get("q");

  const goUp = () => {
    // router.replace("#filters");

    const filtersSection = document.getElementById("filters");

    filtersSection?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    products.setPaginationPage(currentPage, pageSize ? Number(pageSize) : 12);

    if ((searchParams.size > 0 && pathname !== "/search") || urlParams.name) {
      products.getProductsByFilters(
        sorting ?? "",
        salesOnly ? true : false,
        colorName ?? "",
        min_price ?? "",
        max_price ?? "",
        urlParams.name as string,
        ""
        // locale
      );

      filter.hideWholeFilterSidebar();
    } else if (pathname === "/search") {
      products.getProductsByFilters(
        sorting ?? "",
        salesOnly ? true : false,
        colorName ?? "",
        min_price ?? "",
        max_price ?? "",
        undefined as unknown as string,
        searchQuery ?? ""
        // locale
      );
      filter.hideWholeFilterSidebar();
    } else {
      products.getAllProducts();

      filter.hideWholeFilterSidebar();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    currentPage,
    salesOnly,
    sorting,
    min_price,
    max_price,
    colorName,
    urlParams.name,
    searchQuery,
  ]);

  return (
    <>
      {products.products && products.products.length > 0 && (
        <div className="flex justify-center items-center">
          <Pagination
            showControls
            color="danger"
            size={isMobile ? "sm" : isDesktop ? "md" : "lg"}
            total={products.pagination?.pageCount || 1}
            initialPage={1}
            variant={"faded"}
            onChange={(page) => {
              goUp();
              setCurrentPage(page);
            }}
            classNames={{
              cursor: "bg-mainPink",
            }}
          />
        </div>
      )}
    </>
  );
};

export default observer(ProductsPagination);
