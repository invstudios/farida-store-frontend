import appstor from "/public/images/appstor.png";
import googleplaylogo from "/public/images/googleplaylogo.webp";
import payment from "/public/images/payment.png";
import download from "/public/images/download.png";
import Image from "next/image";
import React from "react";
const Footer = () => {
  return (
    <footer className="">
      <div className="p-4">
        <div className="max-w-7xl mx-auto items-center">
          <div className="grid  lg:grid-cols-3 gap-2 sm:justify-center  ">
            <div className="">
              <span className="text-xl ">
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
      </div>
      <div className="p-4">
        <div className="max-w-7xl mx-auto items-center">
          <div className="grid  lg:grid-cols-3 gap-2 sm:justify-center items-center ">
            <div>
              <Image alt="me" width={50} height={20} src={download} />
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
              <Image src={payment} alt="" width={500} height={200} />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
