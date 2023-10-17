/* eslint-disable react/no-children-prop */

"use client";
import Link from "next/link";
import { useState } from "react";
import Tooltip from "./Tooltip";

import {
  AiOutlineHeart,
  AiOutlineMenu,
  AiOutlineSearch,
  AiOutlineShoppingCart,
  AiOutlineUser,
} from "react-icons/ai";

import SideNavbar from "./Sidenavbar";
import Cartdrop from "./Cartdrop";
import NavLinks from "./NavLinks";

const Navbar = () => {
  const [sidenav, setSidenav] = useState(false);
  const handelSideNav = () => {
    setSidenav(!sidenav);
  };
  const [showtool, setshowtool] = useState(false);
  const handtool = () => {
    setshowtool(!showtool);
  };

  const [cartshow, setCartshow] = useState(false);
  const handelCart = () => {
    setCartshow(!cartshow);
  };

  return (
    <nav className="w-full h-24 shadow-lg md:flex md:items-center bg-slate-200  md:justify-between">
      <div className="flex justify-between items-center h-full w-full px-4 2xl:px-6">
        {/* Div of icons */}
        <div className="relative flex justify-between items-center  cursor-pointer ">
          {/* icons */}
          <div
            className={`absolute left-[100%] top-[100%] origin-top-left rotate-12 duration-150 ease-in-out  ${
              cartshow ? "fixed" : "hidden"
            }`}
          >
            <Cartdrop />
          </div>

          <div>
            <div className="relative group inline-block ">
              <div
                className="border_circle"
                onMouseEnter={handtool}
                onMouseLeave={handtool}
              >
                <AiOutlineShoppingCart
                  onMouseLeave={handelCart}
                  onMouseEnter={handelCart}
                />
              </div>
              {/* Budget */}
              <div className="absolute items-center -top-3 left-2 w-5 h-5 rounded-full bg-blue-900  flex justify-center">
                <span className="text-white sm:font-sans text-sm">0</span>
              </div>

              {/* Tool tip for Car */}

              <div dir="ltr">
                <div
                  className={`mt-1 absolute start-6  ${
                    showtool ? "fixed" : "hidden"
                  }`}
                >
                  <Tooltip
                    tooltip="عرض عربةالتسوق الخاص بك"
                    children={undefined}
                  />
                </div>
              </div>
              {/* Care menu when hover */}
            </div>
          </div>
          <div className="border_circle">
            <AiOutlineUser />
          </div>
          <div className="border_circle">
            <AiOutlineHeart />
          </div>
          <div className="border_circle">
            <AiOutlineSearch />
          </div>
        </div>
        <NavLinks />
        <div className="flex cursor-pointer pl-24 z-20">
          <AiOutlineMenu size={25} onClick={handelSideNav} />
          <div
            className={sidenav ? "fixed bg-gray-500 cursor-pointer" : "hidden"}
          >
            <SideNavbar data={handelSideNav} />
          </div>
        </div>
      </div>
    </nav>
  );
};
export default Navbar;
