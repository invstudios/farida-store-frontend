"use client";
import React, { useContext, useEffect, useRef, useState } from "react";
import SliderProduct from "../../components/SliderProduct";
import { StoreContext } from "@/contexts/StoreContext";
import { observer } from "mobx-react-lite";
import { motion } from "framer-motion";
import { useLocale } from "next-intl";

const ProductsSlider = () => {
  const { categories } = useContext(StoreContext);
  const [isDown, setIsDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);
  const locale = useLocale();

  const mouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (sliderRef.current) {
      setStartX(e.pageX - sliderRef.current?.offsetLeft);
      setScrollLeft(sliderRef.current.scrollLeft);
    }
    setIsDown(true);
  };
  const mouseUp = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (sliderRef.current) {
      const x = e.pageX - sliderRef.current?.offsetLeft;
      const walk = x - startX;
      const scrollAmount = Math.sign(walk) * 1000; // Adjust the scroll amount as needed

      // Animate the scrolling

      sliderRef.current.scrollTo({
        left: sliderRef.current.scrollLeft - scrollAmount,
        behavior: "smooth",
      });
    }
    setIsDown(false);
  };
  const mouseLeave = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setIsDown(false);
  };
  const mouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!isDown) {
      return;
    }

    e.preventDefault();

    if (sliderRef.current) {
      const x = e.pageX - sliderRef.current?.offsetLeft;

      const walk = x - startX;
      // console.log({ walk });
      sliderRef.current.scrollLeft = scrollLeft - walk;
    }
  };

  useEffect(() => {
    categories.getAllCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    console.log(categories.categories);
  }, []);
  return (
    <motion.div
      ref={sliderRef}
      initial={{ scale: 1 }}
      animate={{ scale: isDown ? 0.99 : 1 }}
      className="w-auto h-auto overflow-auto flex gap-3 md:gap-10 pb-5 cursor-grab"
      onMouseDown={(e) => {
        mouseDown(e);
      }}
      onMouseMove={(e) => {
        mouseMove(e);
      }}
      onMouseUp={(e) => {
        mouseUp(e);
      }}
      onMouseLeave={(e) => {
        mouseLeave(e);
      }}
      dir={locale === "en" ? "ltr" : "rtl"}
    >
      {categories.categories?.map((cat) => (
        <SliderProduct
          isLinkActive={!isDown}
          title={
            locale === "en"
              ? cat.attributes.name
              : cat.attributes?.localizations?.data[0].attributes.name
          }
          img={cat.attributes?.thumbnail?.data.attributes.url}
          key={cat.id}
        />
      ))}
    </motion.div>
  );
};

export default observer(ProductsSlider);
