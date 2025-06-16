/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useContext, useEffect, useState } from "react";
import { Sliderify } from "react-sliderify";
import { Image } from "@nextui-org/react";
import { StoreContext } from "@/contexts/StoreContext";
import { observer } from "mobx-react-lite";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

import {
  Autoplay,
  Pagination,
  Navigation,
  A11y,
  EffectFade,
} from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useLocale } from "next-intl";
// import 'swiper/css/scrollbar'
// import "swiper/css/bundle";

type slide = {
  title?: string | JSX.Element | undefined;
  content: JSX.Element;
};

const AdsSlider = () => {
  const { ads } = useContext(StoreContext);
  const locale = useLocale();

  useEffect(() => {
    ads.getAllAds(locale);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="grid place-items-center mx-0 lmob:mx-5 my-10  md:m-10">
      <Swiper
        autoHeight={true}
        modules={[Autoplay, Navigation, Pagination]}
        autoplay={{
          pauseOnMouseEnter: true,
          waitForTransition: true,
          delay: 5000,
        }}
        // navigation
        pagination={{ clickable: true }}
        // effect="fade"
        spaceBetween={0}
        slidesPerView={1}
        centeredSlides={true}
        className="w-full md:w-10/12 aspect-video bg-white cursor-grab"
      >
        {ads.ads?.map((ad) => (
          <SwiperSlide key={ad.id} className="w-full h-full ">
            <img
              src={`${process.env.NEXT_PUBLIC_HOST}${ad.attributes.thumb.data.attributes.url}`}
              alt=""
              className="w-full aspect-video "
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default observer(AdsSlider);
