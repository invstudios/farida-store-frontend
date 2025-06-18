"use client";
import React, { useContext } from "react";
import { StoreContext } from "@/contexts/StoreContext";
import { observer } from "mobx-react-lite";
import { useLocale, useTranslations } from "next-intl";
import { Card, CardBody, CardHeader, Divider, Image } from "@nextui-org/react";

const PaymentSummary = () => {
  const { cart } = useContext(StoreContext);
  const locale = useLocale();
  const t = useTranslations("paymentPage");
  const currency = useTranslations("currency");

  const cartItems = cart.userCartItems;
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = 50; // Fixed shipping cost
  const tax = subtotal * 0.14; // 14% tax
  const total = subtotal + shipping + tax;

  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-semibold">
          {locale === "ar" ? "ملخص الطلب" : "Order Summary"}
        </h2>
      </CardHeader>
      <CardBody className="space-y-4">
        {/* Cart Items */}
        <div className="space-y-3">
          {cartItems.map((item) => (
            <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Image
                src={item.imgSrc || 'https://via.placeholder.com/60x60?text=No+Image'}
                alt={item.title}
                width={60}
                height={60}
                className="rounded-md object-cover"
              />
              <div className="flex-1">
                <h4 className="font-medium text-sm line-clamp-2">
                  {locale === "ar" && item.localizatons?.title 
                    ? item.localizatons.title 
                    : item.title
                  }
                </h4>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-sm text-gray-600">
                    {locale === "ar" ? "الكمية" : "Qty"}: {item.quantity}
                  </span>
                  <span className="font-semibold text-sm">
                    {item.price.toFixed(2)} {currency("currency")}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Divider />

        {/* Price Breakdown */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>{locale === "ar" ? "المجموع الفرعي" : "Subtotal"}:</span>
            <span>{subtotal.toFixed(2)} {currency("currency")}</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span>{locale === "ar" ? "الشحن" : "Shipping"}:</span>
            <span>{shipping.toFixed(2)} {currency("currency")}</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span>{locale === "ar" ? "الضرائب" : "Tax"} (14%):</span>
            <span>{tax.toFixed(2)} {currency("currency")}</span>
          </div>
        </div>

        <Divider />

        {/* Total */}
        <div className="flex justify-between text-lg font-bold">
          <span>{locale === "ar" ? "المجموع الكلي" : "Total"}:</span>
          <span className="text-blue-600">
            {total.toFixed(2)} {currency("currency")}
          </span>
        </div>

        {/* Security Badges */}
        <div className="mt-6 pt-4 border-t">
          <p className="text-xs text-gray-500 text-center mb-3">
            {locale === "ar" ? "طرق الدفع المقبولة" : "Accepted Payment Methods"}
          </p>
          <div className="flex justify-center items-center gap-3">
            <Image
              src="/Visa_Inc._logo.svg.png"
              alt="Visa"
              width={40}
              height={25}
              className="grayscale hover:grayscale-0 transition-all"
            />
            <Image
              src="/MasterCard_Logo.svg.webp"
              alt="Mastercard"
              width={40}
              height={25}
              className="grayscale hover:grayscale-0 transition-all"
            />
            <div className="text-xs text-gray-500 px-2">
              {locale === "ar" ? "وأكثر" : "& more"}
            </div>
          </div>
        </div>

        {/* Security Notice */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-xs text-green-700">
              {locale === "ar" 
                ? "جميع المعاملات مؤمنة ومشفرة بتقنية SSL"
                : "All transactions are secured and encrypted with SSL"
              }
            </span>
          </div>
        </div>

        {/* Return Policy */}
        <div className="text-xs text-gray-500 text-center mt-4">
          <p>
            {locale === "ar" 
              ? "سياسة الإرجاع: يمكن إرجاع المنتجات خلال 14 يوم"
              : "Return Policy: Items can be returned within 14 days"
            }
          </p>
        </div>
      </CardBody>
    </Card>
  );
};

export default observer(PaymentSummary);
