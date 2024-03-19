"use client";
import React, { useEffect, useRef, useState } from "react";
import NavIcons from "./NavIcons";
import NavLinks from "./NavLinks";
import NavMenuIcon from "./NavMenuIcon";
import SearchMenu from "./SearchMenu";
import { motion } from "framer-motion";

const NavBar2 = () => {
  const [isNavbarFixed, setNavbarFixed] = useState(false);

  useEffect(() => {
    const scrolling = (e: Event) => {
      window.scrollY > 500 ? setNavbarFixed(true) : setNavbarFixed(false);
    };

    window.addEventListener("scroll", scrolling);

    return () => {
      window.removeEventListener("scroll", scrolling);
    };
  }, []);

  return (
    <>
      <SearchMenu />
      <motion.div
        initial={{
          y: 0,
        }}
        animate={{
          y: isNavbarFixed ? 160 : 0,
        }}
        transition={{
          duration: 0,
        }}
        className={`${
          isNavbarFixed ? `fixed -top-40 left-0 z-[80]` : `relative`
        } bg-mainWhite  transition-all p-2 px-5 md:p-5 md:px-10 w-full min-h-[3.75rem] max-h-[5rem] border-b-[1px] border-b-mainDarkBlue border-solid`}
      >
        <div className=" flex justify-between items-center gap-3">
          <NavMenuIcon />

          <NavLinks />
          <NavIcons />
        </div>
      </motion.div>
    </>
  );
};

export default NavBar2;
