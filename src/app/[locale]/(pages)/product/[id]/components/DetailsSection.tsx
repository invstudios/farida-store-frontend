"use client";
import React from "react";

import ReactStars from "react-rating-star-with-type";
import { FaStar } from "react-icons/fa";
import { FaStarHalfAlt } from "react-icons/fa";
import { FaRegStar } from "react-icons/fa";
import { Chip, Divider, Skeleton } from "@nextui-org/react";
import Rating from "@/components/Rating";
import { strapiProductType } from "@/stores/specificTypes/strapiProductType";
import { Link } from "@/navigation";
import { useScreenSize } from "react-screen-size-helper";
import { useLocale, useTranslations } from "next-intl";
import { ProductArabicData } from "@/stores/specificTypes/productArabicDataType";

interface productProps {
  product?: strapiProductType;
  averageRating?: number;
  ratingsLength?: number;
  priceAfterDiscount?: number;
  arabicData?: ProductArabicData;
}

const DetailsSection = ({
  product,
  averageRating,
  ratingsLength,
  priceAfterDiscount,
  arabicData,
}: productProps) => {
  const { currentWidth } = useScreenSize({});
  const locale = useLocale();
  const t = useTranslations("productPage");
  const currency = useTranslations("currency");

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3">
        <Skeleton isLoaded={product?.attributes?.title !== ""}>
          <h1 className="text-lg md:text-2xl ">
            {product?.attributes?.title !== ""
              ? locale === "en"
                ? product?.attributes?.title
                : product?.attributes?.localizations?.data[0]?.attributes?.title
              : ""}
          </h1>
        </Skeleton>

        <Skeleton
          isLoaded={
            averageRating !== null || averageRating !== undefined ? true : false
          }
        >
          <div className="flex items-center gap-2">
            <Rating
              rating={averageRating}
              size={currentWidth > 768 ? "1.5rem" : "1rem"}
            />
            <h1 className="text-mainBlack/50 text-sm md:text-xl">
              ({ratingsLength})
            </h1>
          </div>
        </Skeleton>
      </div>

      <div className="flex flex-col gap-3">
        <Skeleton isLoaded={product?.attributes?.description !== ""}>
          <h1 className="capitalize text-sm md:text-xl font-semibold">
            {t("details.description")} :-
          </h1>

          <h1 className="text-sm md:text-xl ">
            {product?.attributes?.description
              ? locale === "en"
                ? product?.attributes?.description
                : product?.attributes?.localizations?.data[0]?.attributes
                    ?.description
              : ""}
          </h1>
        </Skeleton>
      </div>

      <h1 className="text-sm md:text-xl font-semibold capitalize">
        {t("details.status")} :{" "}
        {product?.attributes?.product_inventory?.data?.attributes?.available_in_stock != null &&
        product?.attributes?.product_inventory?.data?.attributes?.available_in_stock > 0 ? (
          <span className="text-green-700">
            {t("details.inStock")} ({product?.attributes?.product_inventory?.data?.attributes?.available_in_stock} {locale === "ar" ? "قطعة متوفرة" : "items available"})
          </span>
        ) : (
          <span className="text-red-700">{t("details.outStock")}</span>
        )}
      </h1>

      <div className="flex flex-col gap-2">
        {product?.attributes?.discount?.data && (
          <div className="bg-green-500 p-1 pr-3 md:p-2 md:pr-5 w-max ltr:rounded-r-full rtl:rounded-l-full">
            <h1 className="capitalize text-white font-semibold text-lg md:text-2xl ">
              {t("details.discount")}{" "}
              {
                product?.attributes?.discount?.data?.attributes
                  ?.discount_percent
              }
              %
            </h1>
          </div>
        )}

        <Skeleton isLoaded={product?.attributes?.price !== 0}>
          <div className="flex items-center gap-5">
            {product?.attributes?.discount?.data && (
              <div className="relative ">
                <div className="absolute top-1/2 -translate-y-1/2 w-full h-[2px] bg-black/50 -rotate-3" />
                <h2 className="text-xl md:text-3xl text-mainBlack/30 font-bold  text-center">
                  {product?.attributes?.price}
                  <span className="text-sm ltr:ml-1 rtl:mr-1">
                    {currency("currency")}
                  </span>
                </h2>
              </div>
            )}
            <h2 className="text-xl md:text-3xl text-mainBlack/70 font-bold">
              {product?.attributes?.discount?.data
                ? priceAfterDiscount
                : product?.attributes?.price}{" "}
              <span className="text-sm ltr:ml-1 rtl:mr-1">
                {currency("currency")}
              </span>
            </h2>
          </div>
        </Skeleton>
      </div>

      <div className="flex flex-col gap-2">
        <Divider />
        <Skeleton isLoaded={product?.attributes?.category?.data ? true : false}>
          <h1 className="text-sm md:text-xl capitalize font-semibold">
            {t("details.categories")}:-
          </h1>
          <div className="flex items-center gap-5 flex-wrap mt-5">
            {locale === "en"
              ? product?.attributes?.category?.data.map((cat) => (
                  <Link
                    key={cat?.id}
                    href={`/categories/${cat.attributes.name}`}
                  >
                    <Chip
                      variant="bordered"
                      classNames={{
                        base: "text-xs md:text-lg capitalize hover:text-mainBlack hover:border-mainBlack transition-all ",
                      }}
                    >
                      {cat?.attributes?.name}
                    </Chip>
                  </Link>
                ))
              : arabicData?.attributes?.category?.data.map((cat) => (
                  <Link
                    key={cat?.id}
                    href={`/categories/${cat.attributes.name}`}
                  >
                    <Chip
                      variant="bordered"
                      classNames={{
                        base: "text-xs md:text-lg capitalize hover:text-mainBlack hover:border-mainBlack transition-all ",
                      }}
                    >
                      {cat?.attributes?.name}
                    </Chip>
                  </Link>
                ))}
          </div>
        </Skeleton>
      </div>
    </div>
  );
};

export default DetailsSection;
