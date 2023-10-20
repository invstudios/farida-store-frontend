import appstor from "/public/images/appstor.png";
import googleplaylogo from "/public/images/googleplaylogo.webp";
import payment from "/public/images/payment.png";
import frida from "/public/images/frida.png";
import Image from "next/image";
import React from "react";

const Footer = () => {
  return (
    <footer className="p-4">
      <div className="max-w-7xl mx-auto p-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="">
            <span className="text-xl sm:relative sm:text-center sm:mx-auto  ">
              حمل تطبيق إيفال التركي الآن للطلب بكل سهولة
            </span>
          </div>
          <div className="">
            <Image alt="me" width={150} height={150} src={appstor} />
          </div>
          <div className="">
            <Image alt="me" width={150} height={150} src={googleplaylogo} />
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto p-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="">
            <Image alt="me" width={200} height={50} src={frida} />
          </div>
          <div className="flex flex-col">
            <span className="text-sm">
              تحتاج للمساعدة اتصل بنا على :- 01028306949 الاتنين – الجمعة :-
            </span>
            <span className="text-sm">
              8:00 – 21:00 / السبت – الاحد :- 9:00 – 18:00
            </span>
          </div>

          <div className="">
            <Image src={payment} alt="" width={300} height={200} />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
