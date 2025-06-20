"use client";
import React, { useEffect, useState } from "react";
import { FaLongArrowAltUp } from "react-icons/fa";
import { motion } from "framer-motion";
import { useScreenSize } from "react-screen-size-helper";
import { useLocale } from "next-intl";

const GoTopFloatingButton = () => {
  const [screenScrollY, setScreenScrollY] = useState(0);
  const { isTablet, isMobile } = useScreenSize({});
  const locale = useLocale();
  const goTop = () => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const scrolling = () => {
      setScreenScrollY(scrollY);
    };

    window.addEventListener("scroll", scrolling);

    return () => {
      window.removeEventListener("scroll", scrolling);
    };
  }, []);

  return (
    <motion.div
      initial={{
        x:
          isTablet || isMobile
            ? locale === "en"
              ? -100
              : 100
            : locale === "en"
            ? 100
            : -100,
      }}
      animate={{
        x:
          screenScrollY > (1 / 2) * (typeof window !== 'undefined' ? document.body.offsetHeight : 1000)
            ? 0
            : isTablet || isMobile
            ? locale === "en"
              ? -100
              : 100
            : locale === "en"
            ? 100
            : -100,
      }}
      className={` bg-mainPink hover:bg-mainPink/75 text-mainWhite p-1 md:p-2 rounded-md fixed ${
        isTablet || isMobile
          ? `bottom-20 ${locale === "en" ? "left-9" : "right-9"} `
          : `bottom-10 ${locale === "en" ? "right-9" : "left-9"}`
      }  z-[70] cursor-pointer`}
      onClick={goTop}
    >
      <FaLongArrowAltUp />
    </motion.div>
  );
};

export default GoTopFloatingButton;
