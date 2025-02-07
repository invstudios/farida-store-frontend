"use client";
import { Divider, Skeleton } from "@nextui-org/react";
import React, { useContext, useEffect, useState } from "react";
import { Tabs, Tab, Chip } from "@nextui-org/react";
import { VscPreview } from "react-icons/vsc";
import { MdOutlineDescription } from "react-icons/md";
import UserReview from "./UserReview";
import { strapiProductType } from "@/stores/specificTypes/strapiProductType";
import { observer } from "mobx-react-lite";
import { StoreContext } from "@/contexts/StoreContext";
import AddYourReviewSection from "./AddYourReviewSection";
import { isUserLoggedIn } from "@/functions/credentials";
import ReviewSendedSuccesfuly from "./ReviewSendedSuccesfuly";
import { getTheLengthOfAllowedRatings } from "@/functions/getTheLengthOfAllowedRatings";
import { useScreenSize } from "react-screen-size-helper";
import { useLocale, useTranslations } from "next-intl";
import ReviewLoginCondition from "./ReviewLoginCondition";

interface reviewProps {
  product: strapiProductType;
}

const ReviewsSection = ({ product }: reviewProps) => {
  const { products, loginForm, registerForm, user } = useContext(StoreContext);

  const { currentWidth } = useScreenSize({});

  const [userLoggedin, setUserLoggedin] = useState(false);

  const t = useTranslations("productPage");
  const locale = useLocale();

  useEffect(() => {
    if (isUserLoggedIn()) {
      setUserLoggedin(true);
    } else {
      setUserLoggedin(false);
    }
  }, [loginForm.isLoading, registerForm.isLoading, user.isLoading]);
  return (
    <div className="flex flex-col">
      <div className="flex w-full flex-col ">
        <Tabs
          aria-label="Options"
          color="primary"
          variant="underlined"
          size={currentWidth > 768 ? "lg" : "sm"}
          classNames={{
            tabList:
              "gap-6 w-full relative rounded-none p-0 border-b border-divider",
            cursor: "w-full bg-mainPink",
            tab: "max-w-fit px-0 h-12",
            tabContent: "group-data-[selected=true]:text-mainPink",
          }}
        >
          <Tab
            key="reviews"
            value={"reviews"}
            title={
              <div className="flex items-center space-x-2">
                <VscPreview className="text-lg md:text-2xl" />
                <span className="text-lg md:text-2xl">
                  {t("details.reviews")}
                </span>
                <Chip
                  size={currentWidth > 768 ? "md" : "sm"}
                  variant="shadow"
                  className="bg-mainDarkBlue text-mainWhite hidden md:block"
                >
                  {getTheLengthOfAllowedRatings(products.targetProductReviews)}
                </Chip>
              </div>
            }
          >
            <div className="flex flex-col gap-5 pt-5">
              {products.targetProductReviews.map(
                (r) =>
                  r.attributes.allowed && (
                    <div key={r?.id}>
                      <UserReview
                        userAvatar={
                          r?.attributes?.user?.data?.attributes?.username
                        }
                        review={r?.attributes?.description}
                        name={r?.attributes?.user?.data?.attributes?.username}
                        rating={r?.attributes?.rating}
                        date={r?.attributes?.createdAt}
                        id={r?.id}
                      />
                      <Divider />
                    </div>
                  )
              )}
            </div>
            {userLoggedin ? (
              !user.userReviewSended ? (
                <AddYourReviewSection productId={product.id} />
              ) : (
                <ReviewSendedSuccesfuly />
              )
            ) : (
              <ReviewLoginCondition />
            )}
          </Tab>

          <Tab
            key="more-info"
            value={"description"}
            title={
              <div className="flex items-center space-x-2">
                <MdOutlineDescription className="text-lg md:text-2xl" />
                <span className="text-lg md:text-2xl">
                  {t("details.description")}
                </span>
              </div>
            }
          >
            <div className="flex flex-col gap-3">
              <Skeleton
                isLoaded={product?.attributes?.description?.length !== 0}
                className="w-max"
              >
                <h1 className="capitalize text-sm md:text-xl font-semibold">
                  {t("details.description")} :-
                </h1>
              </Skeleton>

              <Skeleton
                isLoaded={product?.attributes?.description?.length !== 0}
              >
                <h1 className="text-sm md:text-xl ">
                  {product?.attributes?.description
                    ? locale === "en"
                      ? product?.attributes?.description
                      : product?.attributes?.localizations?.data[0]?.attributes
                          ?.description
                    : "slkdslk"}
                </h1>
              </Skeleton>
            </div>
          </Tab>
        </Tabs>
      </div>
    </div>
  );
};

export default observer(ReviewsSection);
