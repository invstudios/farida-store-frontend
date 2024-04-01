"use client";
import { StoreContext } from "@/contexts/StoreContext";
import { observer } from "mobx-react-lite";
import { useLocale } from "next-intl";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";

const FilterSidebarLinks = () => {
  const { categories } = useContext(StoreContext);
  const urlParams: Params = useParams();
  const locale = useLocale();

  const [editedParams, setEditedParam] = useState<string>("");

  useEffect(() => {
    if (urlParams.name) {
      setEditedParam(urlParams.name.replaceAll("%20", " "));
    }

    categories.getAllCategories(locale);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col gap-3">
      {categories.categories.map((cat) => (
        <Link
          key={cat.id}
          href={`/categories/${cat.attributes.name}`}
          className={`filter-link ${
            editedParams === cat.attributes.name && `text-mainPink`
          }`}
        >
          <h1>{cat.attributes.name}</h1>
          <h1>({cat.attributes.products.data.length})</h1>
        </Link>
      ))}
    </div>
  );
};

export default observer(FilterSidebarLinks);
