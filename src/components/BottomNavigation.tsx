import React from "react";
import Icon from "./Icon";
import { FaHome } from "react-icons/fa";
import { Link } from "@/navigation";
import { AiOutlineSearch } from "react-icons/ai";
import { FaRegUser } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa";
import FullSearchIcon from "./FullSearchIcon";
import FullWishlistIcon from "./FullWishlistIcon";
import { FiHome } from "react-icons/fi";

const BottomNavigation = () => {
  return (
    <div className="w-full fixed bottom-0 bg-mainWhite shadow-md p-3 py-1 grid md:hidden grid-cols-4 items-center z-[85] border-t-[1px] border-t-mainDarkBlue border-solid ">
      <Link href={"/"} className="justify-self-center  ">
        <Icon
          hasBorder
          hasBorderHover={false}
          icon={<FiHome className="text-lg" />}
        />
      </Link>
      <Link href={"/user"} className="justify-self-center  ">
        <Icon
          hasBorder
          hasBorderHover={false}
          icon={<FaRegUser className="text-lg" />}
        />
      </Link>
      <div className="justify-self-center text-5xl ">
        {/* <Icon icon={<FaRegHeart />} /> */}
        <FullWishlistIcon
          hasBorder={true}
          hasBorderHover={false}
          className="justify-self-center text-lg "
        />
      </div>
      <Link href={""} className="justify-self-center  ">
        <FullSearchIcon
          hasBorder={true}
          hasBorderHover={false}
          className="justify-self-center text-lg "
        />
      </Link>
    </div>
  );
};

export default BottomNavigation;
