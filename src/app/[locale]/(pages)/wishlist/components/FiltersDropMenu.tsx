"use client";
import { StoreContext } from "@/contexts/StoreContext";

import { observer } from "mobx-react-lite";

import { useRouter } from "@/navigation";
import React, { useContext, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const FiltersDropMenu = () => {
  const { userWishlist, filtersDrop } = useContext(StoreContext);

  const filters = [
    { type: "Rating" },
    { type: "Prices Up" },
    { type: "Prices Down" },
    { type: "A-Z" },
  ];

  const router = useRouter();
  const filtersRef = useRef<HTMLDivElement>(null);

  const [selected, setSelected] = useState("");

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

  useEffect(() => {
    const clickingOutside = (e: MouseEvent) => {
      if (e.target !== filtersRef.current) {
        filtersDrop.hideDropMenu();
      }
    };

    window.addEventListener("click", (e) => clickingOutside(e));

    return () => {
      window.removeEventListener("click", (e) => clickingOutside(e));
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <motion.div
      ref={filtersRef}
      initial={{ display: "none" }}
      animate={{ display: filtersDrop.showDropMenu ? "unset" : "none" }}
      className="bg-mainWhite w-auto origin-top absolute top-full right-0 flex flex-col  z-[60] border-1 border-solid border-mainBlack shadow-sm"
    >
      <h1 className="capitalize text-mainBlack/25 text-center text-xl pb-2 border-solid border-mainBlack/10 border-b-1">
        filters
      </h1>
      {filters.map((filter) => (
        <div
          key={filter.type}
          className={`text-sm  ${
            selected === filter.type
              ? `bg-emerald-500 text-mainWhite`
              : `bg-mainWhite text-mainBlack`
          } p-3   border-solid border-mainBlack/10 border-b-1`}
          onClick={() => {
            setFilter(filter.type);
            setSelected(filter.type);
          }}
        >
          {filter.type}
        </div>
      ))}

      {/* <input type="checkbox" /> */}
    </motion.div>
  );
};

export default observer(FiltersDropMenu);
