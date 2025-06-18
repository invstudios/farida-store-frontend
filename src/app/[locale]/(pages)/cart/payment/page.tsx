"use client";
import React, { useContext, useEffect, useState } from "react";
import { StoreContext } from "@/contexts/StoreContext";
import { observer } from "mobx-react-lite";
import { useRouter } from "@/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Button, Card, CardBody, CardHeader, Spinner } from "@nextui-org/react";
import { FaCreditCard, FaMoneyBillWave } from "react-icons/fa";
import { MdPayment } from "react-icons/md";
import { toast } from "react-toastify";
import PaymentIframe from "./components/PaymentIframe";
import PaymentSummary from "./components/PaymentSummary";
import { generateOrderId } from "@/utils/paymentValidation";

const PaymentPage = () => {
  const { cart, user, userOrders, payment } = useContext(StoreContext);
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("paymentPage");

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    "card" | "cod"
  >("card");
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);

  // Check if user come from shipping page
  useEffect(() => {
    if (!cart.userCartItems.length) {
      router.push("/cart");
      return;
    }
  }, [cart.userCartItems.length, router, locale]);

  // Handle payment method selection
  const handlePaymentMethodChange = (method: "card" | "cod") => {
    setSelectedPaymentMethod(method);
    payment.resetPaymentState();
  };

  // Process card payment
  const processCardPayment = async () => {
    if (!user.strapiUserdata.id) {
      toast.error(
        locale === "ar" ? "يجب تسجيل الدخول أولاً" : "Please login first"
      );
      return;
    }

    setIsProcessingOrder(true);

    try {
      // Get shipping data from localStorage
      const shippingData = JSON.parse(
        localStorage.getItem("shippingData") || "{}"
      );

      // Prepare payment data
      const paymentData = {
        amount: cart.totalPrice,
        orderId: generateOrderId("FARIDA"),
        customerData: {
          first_name: user.strapiUserdata.first_name,
          last_name: user.strapiUserdata.last_name,
          email: user.strapiUserdata.email,
          phone: shippingData.phone || user.strapiUserdata.username,
          phone_number: shippingData.phone || user.strapiUserdata.username,
          street: shippingData.street,
          building: shippingData.building,
          floor: shippingData.floor,
          apartment: shippingData.apartment,
          city: shippingData.city,
          state: shippingData.state,
          country: shippingData.country,
          postal_code: shippingData.postal_code,
        },
        items: cart.userCartItems.map((item) => ({
          name: item.title,
          description: item.description || item.title,
          amount_cents: Math.round(item.price * 100),
          quantity: item.quantity,
        })),
      };

      // Initiate payment
      const paymentKey = await payment.initiatePayment(paymentData);

      if (paymentKey) {
        // Payment iframe will be shown
        console.log("Payment initiated successfully");
        // function to save the data when user use credit card .
      } else {
        throw new Error("Failed to initiate payment");
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error(
        locale === "ar" ? "حدث خطأ في الدفع" : "Payment error occurred"
      );
    } finally {
      setIsProcessingOrder(false);
    }
  };

  // Process cash on delivery
  const processCODPayment = async () => {
    if (!user.strapiUserdata.id) {
      toast.error(
        locale === "ar" ? "يجب تسجيل الدخول أولاً" : "Please login first"
      );
      return;
    }

    setIsProcessingOrder(true);

    try {
      // Create order with COD payment method
      // Get shipping data from localStorage
      const shippingData = JSON.parse(
        localStorage.getItem("shippingData") || "{}"
      );

      const userOrderDetailData = {
        totalPrice: cart.totalPrice,
        userPaymentId: null, // No payment method for COD
        userId: user.strapiUserdata.id.toString(),
        orderNotes: "Cash on Delivery",
        orderAddress: {
          state: shippingData.state || "Cairo",
          country: shippingData.country || "Egypt",
          city: shippingData.city || "Cairo",
          street: shippingData.street || "Street Address",
          postal_code: shippingData.postal_code || "12345",
          phone:
            shippingData.phone || user.strapiUserdata.username || "01000000000",
          second_phone: shippingData.second_phone || "",
        },
        orderItemsIds: [],
      };

      const orderData = await userOrders.createNewOrder(userOrderDetailData);

      if (orderData) {
        await userOrders.createOrderItemsFromCart(
          cart.userCartItems,
          orderData.data.id
        );
        await user.clearUserCart(cart.userCartItems);

        // Clear shipping data from localStorage
        localStorage.removeItem("shippingData");

        toast.success(
          locale === "ar"
            ? "تم إنشاء الطلب بنجاح"
            : "Order created successfully"
        );
        router.push(`/cart/confirmation?order_number=${orderData.data.id}`);
      } else {
        throw new Error("Failed to create order");
      }
    } catch (error) {
      console.error("COD order error:", error);
      toast.error(
        locale === "ar" ? "حدث خطأ في إنشاء الطلب" : "Order creation failed"
      );
    } finally {
      setIsProcessingOrder(false);
    }
  };

  // Handle payment completion
  const handlePaymentSuccess = async (
    transactionId: string,
    paymobOrderId: string
  ) => {
    try {
      // Get shipping data from localStorage
      const shippingData = JSON.parse(
        localStorage.getItem("shippingData") || "{}"
      );

      // Create order in your system
      const userOrderDetailData = {
        totalPrice: cart.totalPrice,
        userPaymentId: transactionId,
        userId: user.strapiUserdata.id.toString(),
        orderNotes: `Paid via Paymob - Transaction ID: ${transactionId}. Paymob Order ID: ${paymobOrderId}`,
        orderAddress: {
          state: shippingData.state,
          country: shippingData.country,
          city: shippingData.city,
          street: shippingData.street,
          postal_code: shippingData.postal_code,
          phone: shippingData.phone,
          second_phone: shippingData.second_phone,
        },
        orderItemsIds: [],
      };

      const orderData = await userOrders.createNewOrder(userOrderDetailData);

      if (orderData) {
        await userOrders.createOrderItemsFromCart(
          cart.userCartItems,
          orderData.data.id
        );
        await user.clearUserCart(cart.userCartItems);

        // Clear shipping data from localStorage
        localStorage.removeItem("shippingData");

        toast.success(
          locale === "ar" ? "تم الدفع بنجاح" : "Payment successful"
        );
        router.push(`/cart/confirmation?order_number=${orderData.data.id}`);
      }
    } catch (error) {
      console.error("Order creation after payment error:", error);
      toast.error(
        locale === "ar" ? "حدث خطأ بعد الدفع" : "Error after payment"
      );
    }
  };

  if (payment.currentIframeUrl) {
    return (
      <PaymentIframe
        iframeUrl={payment.currentIframeUrl}
        onSuccess={handlePaymentSuccess}
        onError={(error: string) => {
          console.error("Payment iframe error:", error);
          payment.resetPaymentState();
        }}
      />
    );
  }

  return (
    <div
      className={`min-h-screen bg-gray-50 py-8 px-4 ${
        locale === "ar" ? "rtl" : "ltr"
      }`}
    >
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-center mb-8">
          {t("title")}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Payment Methods */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <MdPayment />
                  {locale === "ar" ? "طرق الدفع" : "Payment Methods"}
                </h2>
              </CardHeader>
              <CardBody className="space-y-4">
                {/* Credit Card Payment */}
                <div
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    selectedPaymentMethod === "card"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => handlePaymentMethodChange("card")}
                >
                  <div className="flex items-center gap-3">
                    <FaCreditCard className="text-2xl text-blue-600" />
                    <div>
                      <h3 className="font-semibold">
                        {locale === "ar"
                          ? "بطاقة ائتمان/خصم"
                          : "Credit/Debit Card"}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {locale === "ar"
                          ? "ادفع بأمان باستخدام بطاقتك"
                          : "Pay securely with your card"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Cash on Delivery */}
                <div
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    selectedPaymentMethod === "cod"
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => handlePaymentMethodChange("cod")}
                >
                  <div className="flex items-center gap-3">
                    <FaMoneyBillWave className="text-2xl text-green-600" />
                    <div>
                      <h3 className="font-semibold">
                        {locale === "ar"
                          ? "الدفع عند الاستلام"
                          : "Cash on Delivery"}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {locale === "ar"
                          ? "ادفع نقداً عند استلام طلبك"
                          : "Pay cash when you receive your order"}
                      </p>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Payment Button */}
            <Button
              size="lg"
              className="w-full bg-blue-600 text-white hover:bg-blue-700"
              onClick={
                selectedPaymentMethod === "card"
                  ? processCardPayment
                  : processCODPayment
              }
              isLoading={isProcessingOrder || payment.isInitiatingPayment}
              isDisabled={isProcessingOrder || payment.isInitiatingPayment}
            >
              {isProcessingOrder || payment.isInitiatingPayment
                ? null
                : selectedPaymentMethod === "card"
                ? locale === "ar"
                  ? "ادفع بالبطاقة"
                  : "Pay with Card"
                : locale === "ar"
                ? "تأكيد الطلب"
                : "Confirm Order"}
            </Button>

            {payment.paymentError && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{payment.paymentError}</p>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <PaymentSummary />
        </div>
      </div>
    </div>
  );
};

export default observer(PaymentPage);
