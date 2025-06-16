"use client";
import React, { useContext, useEffect } from "react";
import PageCard from "./PageCard";
import { FaRegAddressCard } from "react-icons/fa";
import { BsBox2 } from "react-icons/bs";
import { BsCart3 } from "react-icons/bs";
import { TbHearts } from "react-icons/tb";
import { RiUserSettingsLine } from "react-icons/ri";
import { StoreContext } from "@/contexts/StoreContext";
import { useRouter } from "@/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useAuth } from "@/hooks/useAuth";

const UserPagesMenu = () => {
  const { user } = useContext(StoreContext);
  const { isLoggedIn } = useAuth();
  const t = useTranslations("userPage");
  const locale = useLocale();

  const router = useRouter();

  const pagesCards = [
    {
      id: 1,
      title: t("title.orders"),
      description: t("description.orders"),
      icon: <BsBox2 />,
      pageLink: `/userorders`,
    },
    {
      id: 2,
      title: t("title.profile"),
      description: t("description.profile"),
      icon: <RiUserSettingsLine />,
      pageLink: `/userprofile`,
    },
    {
      id: 3,
      title: t("title.addresses"),
      description: t("description.addresses"),
      icon: <FaRegAddressCard />,
      pageLink: `/useraddresses`,
    },
    // {
    //   id: 4,
    //   title: "your payments",
    //   description:
    //     "view all transactions , manage payment methods and settings",
    //   icon: <MdPayment />,
    //   pageLink: "#",
    // },
    {
      id: 5,
      title: t("title.cart"),
      description: t("description.cart"),
      icon: <BsCart3 />,
      pageLink: `/cart`,
    },
    {
      id: 6,
      title: t("title.wishlist"),
      description: t("description.wishlist"),
      icon: <TbHearts />,
      pageLink: `/wishlist`,
    },
  ];

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login");
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn, user.isLoading]);

  return (
    <div
      className="grid grid-cols-1 lg:grid-cols-2 gap-5 md:gap-10 px-5  md:px-36 py-10"
      dir={locale === "en" ? "ltr" : "rtl"}
    >
      {pagesCards.map((card) => (
        <PageCard
          key={card.id}
          title={card.title}
          description={card.description}
          icon={card.icon}
          pageLink={card.pageLink}
          locale={locale}
        />
      ))}
    </div>
  );
};

export default UserPagesMenu;
