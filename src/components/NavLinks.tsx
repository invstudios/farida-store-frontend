import Link from "next/link";
import React from "react";
import '../app/globals.css'
const NavLinks = () => {
  return (
    <div className="">
      <div className="hidden md:block">
        <ul className="flex ml-4 items-center space-x-4">
          <Link href="/about" className="navlink">
            <li className="uppercase hover:border-b  border-red-600 text-xl">
              Why us
            </li>
          </Link>
          <Link href="/contact" className="navlink">
            <li className="mx-4 uppercase hover:border-b border-red-600 text-xl">
              Contact
            </li>
          </Link>
          <Link href="/services" className="navlink">
            <li className="mx-4 uppercase hover:border-b  border-red-600 text-xl">
              services
            </li>
          </Link>
          <Link href="/ourservices" className="navlink">
            <li className="mx-4 uppercase hover:border-b border-red-600 text-xl">
              our-services
            </li>
          </Link>
        </ul>
      </div>
    </div>
  );
};

export default NavLinks;
